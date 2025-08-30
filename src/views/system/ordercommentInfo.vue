<template>

  <el-form ref="queryFormRef" :model="queryForm" :inline="true">
    <el-form-item label="游戏名称" prop="gameName">
      <el-select
          v-model="queryForm.gameName"
          placeholder="请选择游戏"
          style="width: 250px"
          @focus="selectGameName"
          filterable
          :loading="loading"
      >
        <el-option
            v-for="game in Games"
            :key="game.gameId"
            :label="game.gameName"
            :value="game.gameName"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="下单日期" prop="gameName" style="width: 340px">
      <div class="demo-date-picker">
        <div class="block">
          <el-date-picker
              v-model="queryForm.commentDatetime"
              type="date"
              placeholder="请输入查询的下单时间"
              value-format="YYYY-MM-DD"
          />
        </div>
      </div>
    </el-form-item>
    <el-form-item label="下单用户" prop="orderPaymentCustomerName" style="width: 340px">
      <el-input v-model="queryForm.orderPaymentCustomerName" style="width: 220px;" placeholder="请输入用户名称"
                clearable/>
    </el-form-item>
    <el-form-item label="接单用户" prop="orderServeCustomerName" style="width: 340px">
      <el-input v-model="queryForm.orderServeCustomerName" style="width: 220px;" placeholder="请输入游戏名称"
                clearable/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="queryReset">重置</el-button>
      <el-button-group style="margin-left: 20px;">
        <el-button plain @click="onSubmit('asc')">
          评分升序
          <el-icon class="el-icon--right">
            <ArrowUpBold/>
          </el-icon>
        </el-button>
        <el-button plain @click="onSubmit('desc')">
          评分降序
          <el-icon class="el-icon--right">
            <ArrowDownBold/>
          </el-icon>
        </el-button>
      </el-button-group>
    </el-form-item>
  </el-form>

  <el-table height="450" :data="tableData.tableList" style="width: 100%">
    <el-table-column prop="commentId" fixed label="评论编号" width="90" align="center"/>
    <el-table-column prop="gameName" label="游戏名称" width="120" align="center"/>
    <el-table-column prop="orderPaymentCustomerName" label="下单用户" width="100" align="center">
      <template #default="scope">
        <el-tag type="primary">{{ scope.row.orderPaymentCustomerName }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="orderServeCustomerName" label="接单用户" width="100" align="center">
      <template #default="scope">
        <el-tag type="success">{{ scope.row.orderServeCustomerName }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="orderId" label="订单编号" width="90" align="center"/>
    <el-table-column prop="commentDatetime" label="评论时间" width="150" align="center">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>评论时间：{{ scope.row.commentDatetime }}</div>
          </template>
          <template #reference>
            <el-tag>{{ scope.row.commentDatetime }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="commentScore" label="评论分数" width="220" align="center">
      <template #default="scope">
        <el-rate
            :model-value="Number(scope.row.commentScore)"
            disabled
            show-score
            text-color="#ff9900"
            :score-template="`${scope.row.commentScore} 分`"
        />
      </template>
    </el-table-column>
    <el-table-column prop="commentDetail" label="评论详细" width="150" align="center">
      <template #default="scope">
        <el-button type="text" @click="openCommentDialog(scope.row)">
          查看详情
        </el-button>
      </template>
    </el-table-column>
    <el-table-column prop="commentStatus" label="评论状态" width="150" align="center">
      <template #default="scope">
        <el-switch
            v-model="scope.row.commentStatus"
            :inactive-value="0"
            :active-value="1"
            active-text="正常"
            inactive-text="屏蔽"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="updateComment(scope.row)"
        />
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="200" align="center">
      <template #default="scope">
        <el-button type="primary" plain @click="DeleteComment(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 5px">
  <el-pagination
      v-model:current-page="tableData.pageInfo.page"
      v-model:page-size="tableData.pageInfo.pageSize"
      :total="tableData.pageInfo.total"
      :page-sizes="[3, 6, 9]"
      layout="total, sizes, prev, pager, next, jumper"

      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
  </div>
  <el-dialog
      title="评论详情"
      v-model="commentDialogVisible"
      width="500"
      align-center
  >
    <el-text type="primary">{{ currentCommentDetail }}</el-text>
  </el-dialog>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {myGet, myPost} from '@/myaxios'
import {ElMessage, ElMessageBox} from 'element-plus'

/**查询功能*/
//设置缓冲时间
const loading = ref(false);
//查询已有游戏内容
const Games = reactive([])
const selectGameName = async () => {
  let resp = await myPost("/game/listAllGame")
  Games.splice(0, Games.length, ...resp.data.returnData)
}
//table绑定的数据
const tableData = reactive({
  tableList: [],
  pageInfo: {
    page: 1,
    pageSize: 3,
    total: 55
  }
})
//查询表单对象
const queryFormRef = ref()
//查询表单
const queryForm = reactive({
  gameName: '',
  commentDatetime: '',
  orderPaymentCustomerName: '',
  orderServeCustomerName: '',
  sort: ''
})
//查询按钮
const querySubmit = () => {
  myQuery(queryForm)
}
//升序降序按钮
const onSubmit = (sort) => {
  console.log(sort)
  queryForm.sort = sort
  myQuery(queryForm)
}
//重置按钮
const queryReset = () => {
  //清数据
  queryFormRef.value.resetFields()
  //重新查
  myQuery({})
}
//page改变
const handleCurrentChange = (page) => {
  //改页码参数
  tableData.pageInfo.page = page
  let params1 = tableData.pageInfo
  let params2 = queryForm
  //查询请求
  myQuery({...params1, ...params2})
}
//pageSize改变
const handleSizeChange = (pageSize) => {
  //改页码参数
  tableData.pageInfo.page = 1
  tableData.pageInfo.pageSize = pageSize
  let params1 = tableData.pageInfo
  let params2 = queryForm
  //查询请求
  myQuery({...params1, ...params2})
}
//查询函数
const myQuery = async (params) => {
  /**
   * await  异步同步等待
   * async  异步同步控制
   * 回调地狱 .then互相嵌套调用 代码结构显得杂乱
   *
   * 语法糖 简化和优化语法的语法功能
   *        使用了await语法之后 ajax请求代码结构更简洁
   */
      //await 主线程会等待 await的函数 执行完 主线程才会继续执

  let resp = await myGet("/comment/listComment", params)
  if (resp.data.code == 20000) {
    tableData.tableList = resp.data.returnData
    tableData.pageInfo = resp.data.pageInfo
  } else if (resp.data.code == 20001) {
    tableData.tableList = []
    tableData.pageInfo = {page: 1, pageSize: 3, total: 0}
  }
}
/**查看评论详细*/
const commentDialogVisible = ref(false);
const currentCommentDetail = ref('');

const openCommentDialog = (row) => {
  currentCommentDetail.value = row.commentDetail;
  console.log(currentCommentDetail.value)
  commentDialogVisible.value = true;
};
//修改评论状态
const updateComment = async (row) => {
  //查询请求
  await myQuery()
  ElMessageBox.confirm(
      `确定要修改评论状态为[${row.commentStatus == 0 ? '屏蔽' : '正常'}]么?`,
      '注意',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
    let resp = await myPost("/comment/updateComment", {commentStatus: row.commentStatus, commentId: row.commentId})
    if (resp.data.code == 20010) {
      ElMessage.success(resp.data.msg)
      //当前查询条件
      let params1 = tableData.pageInfo
      let params2 = queryForm
      //查询请求
      myQuery({...params1, ...params2})
    } else {
      ElMessage.error(resp.data.msg)
    }
  })
      .catch(() => {

      })
}
//评论删除
const DeleteComment = (row) => {
  ElMessageBox.confirm(
      `确定要删除此条评论数据吗?`,
      '注意',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //发送请求
        let resp = await myPost("/comment/deleteComment", {commentId: row.commentId})
        if (resp.data.code == 20010) {
          ElMessage.success(resp.data.msg)
          //当前查询条件
          let params1 = tableData.pageInfo
          let params2 = queryForm
          //查询请求
          myQuery({...params1, ...params2})
        } else {
          ElMessage.error(resp.data.msg)
        }

      })
      .catch(() => {
      })
}
/**页面加载结束 加载查询数据 */
onMounted(() => {
  myQuery({})
})


</script>


<style scoped>
img {
  width: 50px;
  height: 50px;
}


.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}


.game-price-column .cell {
  font-weight: 600;
  color: #e91e63;
  font-size: 14px;
}

.game-price-column .cell::before {
  content: "¥";
  margin-right: 2px;
  font-size: 12px;
  opacity: 0.8;
}
</style>
