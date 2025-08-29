<template>

  <el-form ref="queryFormRef" :model="queryForm" :inline="true">
    <el-form-item label="礼物名称" prop="giftName">
      <el-input v-model="queryForm.giftName" style="width: 240px;" placeholder="请输入礼物名称" clearable/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="queryReset">重置</el-button>
      <el-button type="primary" @click="openInsert()">添加</el-button>
    </el-form-item>
  </el-form>
  <!--ID
  礼物名称
  礼物价格
  礼物图片
  礼物折算-->
  <el-table height="550" :data="tableData.tableList" style="width: 100%" >
    <el-table-column prop="giftId" fixed label="ID" width="70" align="center"/>
    <el-table-column prop="giftName" label="礼物名称" width="100" align="center"/>
    <el-table-column prop="giftPrice" label="礼物价格" width="140" align="center">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>商品价格：￥{{ Math.round(scope.row.giftPrice) }}</div>
          </template>
          <template #reference>
            <el-tag>￥{{ Math.round(scope.row.giftPrice) }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="giftLogo" label="礼物图片" width="140" align="center">
      <template #default="scope">
        <img :src="scope.row.giftLogo"></img>

      </template>
    </el-table-column>
    <el-table-column prop="giftRatio" label="礼物折算" width="140" align="center">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>打折力度: {{ Math.round(scope.row.giftRatio) }}</div>
          </template>
          <template #reference>
            <el-tag>{{ Math.round(scope.row.giftRatio) }}%</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="280" align="center">
      <template #default="scope">
        <el-button type="primary" @click="openUpdate(scope.row)">修改</el-button>
        <el-button type="primary" @click="openDelete(scope.row.giftId)">删除</el-button>
      </template>
    </el-table-column>

  </el-table>

  <div style="margin-top: 5px">
    <el-pagination
        v-model:current-page="tableData.pageInfo.page"
        v-model:page-size="tableData.pageInfo.pageSize"
        :total="tableData.pageInfo.total"
        :page-sizes="[10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="custom-pagination"
    />
  </div>

  <!--  giftId: '',
      giftLogo: '',
      giftName: '',
      giftPrice: '',
      giftRatio: '',-->
  <el-drawer title="添加" size="30%" v-model="drawerVisable" direction="rtl">
    <el-form ref="insertFromRef" :model="insertForm" label-width="70"
             style="max-width: 600px">
      <el-form-item label="礼物编号" prop="giftId">
        <el-input v-model="insertForm.giftId"/>
      </el-form-item>
      <el-form-item label="礼物图片" prop="giftLogo">
        <!-- <el-input v-model="insertForm.headImg" /> -->
        <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="addUpload"
        >
          <img v-if="insertForm.giftLogo" :src="insertForm.giftLogo" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="礼物名称" prop="giftName">
        <el-input v-model="insertForm.giftName"/>
      </el-form-item>
      <el-form-item label="礼物价格" prop="giftPrice">
        <el-input-number
            v-model="insertForm.giftPrice"
            :min="0"
            :max="9999"
            :step="1"
            :precision="0"
            controls-position="right"
            placeholder="请输入礼物价格"
        />
      </el-form-item>
      <el-form-item label="礼物折扣" prop="giftRatio">
        <el-input-number
            v-model="insertForm.giftRatio"
            :min="0"
            :max="100"
            :step="10"
            :precision="0"
            placeholder="请输入折扣比例"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="insertSubmit">保存</el-button>
      </el-form-item>

    </el-form>

    <!-- <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template> -->
  </el-drawer>


  <el-drawer title="修改" size="30%" v-model="updateVisable" direction="rtl">
    <el-form :model="editForm.editData" label-width="70"
             style="max-width: 600px">
      <el-form-item label="礼物名称" prop="giftName">
        <el-input v-model="editForm.editData.giftName"/>
      </el-form-item>
      <el-form-item label="礼物图片" prop="giftLogo">
        <!-- <el-input v-model="insertForm.headImg" /> -->
        <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="updateUpload"
        >
          <img v-if="editForm.editData.giftLogo" :src="editForm.editData.giftLogo" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="礼物价格" prop="giftPrice">
        <el-input-number
            v-model="editForm.editData.giftPrice"
            :min="0"
            :max="9999"
            :step="1"
            :precision="0"
            controls-position="right"
            placeholder="请输入礼物价格"
        />
      </el-form-item>
      <el-form-item label="礼物折扣" prop="giftRatio">
        <el-input-number
            v-model="editForm.editData.giftRatio"
            :min="0"
            :max="100"
            :step="10"
            :precision="0"
            placeholder="请输入折扣比例"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateSubmit">保存</el-button>
      </el-form-item>

    </el-form>

    <!-- <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template> -->
  </el-drawer>

</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {Check, Delete, Edit, Message, Search, Star, Share} from '@element-plus/icons-vue'
import {myGet, myPost} from '@/myaxios'
import {ElMessage, ElMessageBox} from 'element-plus'
import axios from 'axios'

/**上传函数 */
//设置缓冲时间
const loading = ref(false);
const addUpload = async (rawFile) => {
  //1找到文件
  let curretFile = rawFile.file
  //2创建formData 把文件放进去
  let formData = new FormData()
  formData.append("myfile", curretFile)
  let resp = await axios.post("http://localhost:8080/baseProj/upload", formData)
  //给上传组件 配置图片显示的路径
  insertForm.giftLogo = resp.data.returnData
}

const updateUpload = async (rawFile) => {
  //1找到文件
  let curretFile = rawFile.file
  //2创建formData 把文件放进去
  let formData = new FormData()
  formData.append("myfile", curretFile)
  console.log("调用了")
  let resp = await axios.post("http://localhost:8080/baseProj/upload", formData)
  //给上传组件 配置图片显示的路径
  editForm.editData.giftLogo = resp.data.returnData
}

/**删除功能 */
const openDelete = (uid) => {
  ElMessageBox.confirm(
      `确定要删除编号为[${uid}]记录么?`,
      '注意',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //发送请求
        let resp = await myPost("/gift/deleteGift", {giftId: uid})
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


/**修改功能 */
//修改抽屉显示 隐藏
const updateVisable = ref(false)
//修改表单对象
const editForm = reactive({
  editData: {
    giftId: '',
    giftLogo: '',
    giftName: '',
    giftPrice: 0,
    giftRatio: 100,
    version: ''
  }
})

//打开修改框
const openUpdate = (currentRow) => {
  console.log(currentRow)
  updateVisable.value = true
  // console.log(currentRow);
  // console.log(JSON.parse(JSON.stringify(currentRow))  );
  //需要做对象复制 不能直接传引用
  editForm.editData = {
    ...JSON.parse(JSON.stringify(currentRow)),
    giftPrice: Number(currentRow.giftPrice), // 确保转换为数字
    giftRatio: Number(currentRow.giftRatio)  // 确保转换为数字
  }
}
//提交修改
const updateSubmit = async () => {
  let resp = await myPost("/gift/updateGift", editForm.editData)
  if (resp.data.code == 20010) {
    updateVisable.value = false
    ElMessage.success(resp.data.msg)
    //当前查询条件
    let params1 = tableData.pageInfo
    let params2 = queryForm
    //查询请求
    myQuery({...params1, ...params2})
  } else {
    ElMessage.error(resp.data.msg)
  }


}


/**添加功能 */
//抽屉显示 隐藏 bol值
const drawerVisable = ref(false)
//添加表单对象
const insertForm = reactive({
  giftId: '',
  giftLogo: '',
  giftName: '',
  giftPrice: 0,
  giftRatio: 100,
  version: ''
})

//添加表单对象
const insertFromRef = ref()

//添加提交
const insertSubmit = async () => {
  let resp = await myPost('/gift/insertGift', insertForm);
  if (resp.data.code == 20010) {
    drawerVisable.value = false
    ElMessage.success(resp.data.msg)
    //当前查询条件
    let params1 = tableData.pageInfo
    let params2 = queryForm
    //查询请求
    myQuery({...params1, ...params2})
    //清空表单
    insertFromRef.value.resetFields()

  } else {
    ElMessage.error(resp.data.msg)
  }


}

//抽屉开框
const openInsert = () => {
  drawerVisable.value = true
}


/**查询功能 */
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
  giftName: '',
})
//查询按钮
const querySubmit = () => {
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
      //await 主线程会等待 await的函数 执行完 主线程才会继续执行
  let resp = await myGet("/gift/listGift", params)
  if (resp.data.code == 20000) {
    tableData.tableList = resp.data.returnData
    tableData.pageInfo = resp.data.pageInfo
  } else if (resp.data.code == 20001) {
    tableData.tableList = []
    tableData.pageInfo = {page: 1, pageSize: 3, total: 0}
  }

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

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

/* 礼物价格列美化 */
.gift-price-column .cell {
  font-weight: 600;
  color: #e91e63;
  font-size: 14px;
}

.gift-price-column .cell::before {
  content: "¥";
  margin-right: 2px;
  font-size: 12px;
  opacity: 0.8;
}
</style>
