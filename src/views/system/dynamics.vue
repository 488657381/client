<template>
  <el-form ref="queryFormRef" :model="queryForm" :inline="true">
    <el-form-item label="用户名称" prop="nickname">
      <el-input v-model="queryForm.nickname" style="width: 240px;" placeholder="nickname" clearable/>
    </el-form-item>
    <el-form-item label="动态日期" prop="createTime">
      <!-- <el-input v-model="queryForm.createTime" style="width: 240px;" placeholder="createTime" clearable /> -->
      <!-- <el-date-picker
              v-model="queryForm.createTime"
              type="datetime"
              placeholder="请选择日期"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%;"
          /> -->
      <el-date-picker
          v-model="queryForm.createTime"
          type="date"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
          :max-date="today"
          :disabled-date="disableFutureDates"
          clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="queryReset">重置</el-button>
      <el-button type="danger" @click="openDeleteDialog">删除</el-button>
    </el-form-item>
  </el-form>
  <!--
          ref是组件对象的名字，可以使用  组件对象名字.value.api

          table通过  :data属性绑定 自动遍历数据
                      height属性固定表头 上下出滚动条
                      fixed固定列在左边 fixed="right" 固定列在右边
                      添加一列，设置type="selection" 实现多选效果

          自定义列需要用到插槽 <template #default="scope">  scope是变量 scope.row获得当前行的数据
              1.搭配其他样式组件进行，美化
              2. 根据值得特征 显示不同得页面元素 v-if
              3.配置按钮 做数据相关得操作按钮 通过传值获取到遍历中的数据

              table自动遍历 通过插槽可以获取到遍历中的数据


     -->


  <el-table ref="tableRef" height="580" :data="tableData.dataList" style="width: 100%">
    <el-table-column type="selection" width="55"/>
    <el-table-column prop="id" label="动态编号" width="180"/>
    <el-table-column prop="uid" label="用户编号" width="180"/>
    <el-table-column prop="webUserInfo.nickname" label="用户名称" width="180"/>
    <el-table-column prop="content" label="动态内容" width="180">
      <template #default="scope">
        <el-link type="primary" @click="openDialog(scope.row)">{{ scope.row.content }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="动态日期" width="180"/>
    <el-table-column prop="likenum" label="点赞数" width="180"/>
  </el-table>


  <!--
          分页组件：
  -->
  <el-pagination
      v-model:current-page="tableData.pageInfo.page"
      v-model:page-size="tableData.pageInfo.pageSize"
      :total="tableData.pageInfo.total"
      :page-sizes="[10, 20, 30]"
      layout="total,sizes, prev, pager, next,jumper"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"

  />


  <el-dialog
      v-model="updateDialogVisible" title="动态内容" width="500">
    <!-- 对话框内容区域 -->
    <div class="content-box">{{ currentDynamic.content }}</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateDialogVisible = false">关闭</el-button>
      </span>
    </template>


  </el-dialog>
</template>

<script setup>
import {ref, reactive, onMounted, watch} from 'vue'
import {
  User,
  Link,
  Service,
  Discount,
  Female,
  Odometer,
  Tools,
  Avatar,
  SwitchFilled,
  Present,
  Shop
} from '@element-plus/icons-vue';
import {myGet, myPost} from '@/myaxios'
import {ElMessage, ElMessageBox} from 'element-plus'


/** 删除功能 */
// table对象
// 删除开框
const openDeleteDialog = () => {
  // getSelectionRows删除选择的行
  let currentRows = tableRef.value.getSelectionRows()
  console.log(currentRows);

  if (currentRows.length > 0) {
    // 显示信息用的列表
    let showMsg = []
    // 发送mid请求用的
    let listId = []
    // 从页面table取dao数据 组织不同的数据集合
    currentRows.forEach(data => {
      showMsg.push(`${data.id}-${data.content}`)
      listId.push(data.id)
    })
    console.log(showMsg);
    console.log(listId);
    // 确认框confirm
    ElMessageBox.confirm(
        `确认要删除[${showMsg}]吗?`,
        '警告',
        {
          // confirmButtonText确认按钮
          confirmButtonText: '删除',
          // cancelButtonText取消按钮
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
        .then(() => {
          // 点击删除时发送删除请求
          console.log("发送删除请求");
          myPost("/dynamics/deleteDynamics", {listId: listId.join(",")})
              .then(resp => {
                if (resp.data.code == 20010) {
                  // 显示操作结果的弹窗
                  ElMessage.success(resp.data.msg)
                  // 刷新数据 保留当前页码和查询条件
                  // 把修改后的page作为参数通过请求传走
                  let params1 = tableData.pageInfo;
                  let params2 = queryForm;
                  // json对象组合语法
                  let allParam = {...params1, ...params2}
                  // 调用钩子函数 发送请求
                  myQuery(allParam)
                }
              })
        })
        .catch(() => {
          // 点击取消时的操作
          console.log("取消操作");

        })
  } else {
    ElMessage.warning("请选择要删除的菜单")
  }

}


// 查询功能


// 定义变量存储当前选中的动态数据
const currentDynamic = reactive({})

const updateDialogVisible = ref(false)

const openDialog = (currentRow) => {

  // 将当前行数据复制到currentDynamic
  Object.assign(currentDynamic, currentRow)
  // console.log(currentRow);
  // myGet("/dynamics/listDynamics",{id:currentRow.id})
  // .then(resp=>{
  //     console.log(resp.data.returnData);
  // })
  updateDialogVisible.value = true
}


const today = ref(new Date());
// 禁用未来日期
const disableFutureDates = (time) => {
  // 返回true表示禁用该日期
  return time > new Date(today.value);
};

const tableRef = ref()
// 如果有后端数据 需要覆盖 为了保持响应对象 
// table数据 dataList
const tableData = reactive({
  dataList: [],
  // 分页数据 页码信息 pageInfo
  pageInfo: {
    page: 1,
    pageSize: 10,
    total: 55
  }
})


// page改变  currentPage当前点击的显示第几页
const handlePageChange = (currentPage) => {
  console.log(currentPage);
  // 修改page页面参数
  tableData.pageInfo.page = currentPage;
  // 把修改后的page作为参数通过请求传走
  let params1 = tableData.pageInfo;
  let params2 = queryForm;
  // json对象组合语法
  let allParam = {...params1, ...params2}
  // 调用钩子函数 发送请求
  myQuery(allParam)
}
// pageSize改变，currentPageSize当前点击的一页显示多少数据
const handleSizeChange = (currentPageSize) => {
  // 修改pageSize页面参数
  tableData.pageInfo.page = 1
  tableData.pageInfo.pageSize = currentPageSize;
  // 把修改后的page作为参数通过请求传走
  let params1 = tableData.pageInfo;
  let params2 = queryForm;
  // json对象组合语法
  let allParam = {...params1, ...params2}
  myQuery(allParam)
}


// 查询公共方法
const myQuery = (params) => {
  myGet("/dynamics/listDynamics", params)
      .then(resp => {
        console.log(resp.data);
        if (resp.data.code == 20000) {
          tableData.dataList = resp.data.returnData
          tableData.pageInfo = resp.data.pageInfo
        } else if (resp.data.code == 20001) {
          tableData.dataList = []
          tableData.pageInfo = {page: 1, pageSize: 10, total: 0}
        }

      })
}

// 查询表单对象
const queryFormRef = ref()
// 查询表单
const queryForm = reactive({
  nickname: '',
  createTime: ''
})
// 提交查询
const querySubmit = () => {
  let params = queryForm;
  myQuery(params)
}
// 查询重置
const queryReset = () => {
  queryFormRef.value.resetFields()
  myQuery({})
}
onMounted(() => {
  myQuery({})
})
</script>

<style scoped>
.content-box {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  min-height: 80px;
}
</style>