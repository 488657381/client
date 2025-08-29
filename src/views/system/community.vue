<template>
  <el-form ref="queryFormRef" :model="queryForm" :inline="true">
    <el-form-item label="会长名称" prop="nickname">
      <el-input v-model="queryForm.nickname" style="width: 240px;" placeholder="nickname" clearable/>
    </el-form-item>
    <el-form-item label="公会名称" prop="communityName">
      <el-input v-model="queryForm.communityName" style="width: 240px;" placeholder="communityName" clearable/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="queryReset">重置</el-button>
      <el-button type="primary" @click="openInsert()">添加</el-button>
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


  <el-table ref="tableRef" height="300" :data="tableData.dataList" style="width: 100%">
    <el-table-column prop="communityId" label="公会编号" width="180"/>
    <el-table-column prop="communityName" label="公会名称" width="180"/>
    <el-table-column prop="communityLogo" label="公会logo" width="180"/>
    <el-table-column prop="communityLeader" label="会长编号" width="180"/>
    <el-table-column prop="webUserInfo.nickname" label="会长名称" width="180"/>
    <el-table-column fixed="right" label="操作" width="180">
      <template #default="scope">
        <el-button type="primary" @click="openUpdate(scope.row)">修改</el-button>
        <el-button type="primary" @click="openDelete(scope.row.communityId)">删除</el-button>
      </template>
    </el-table-column>
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

  <el-drawer title="添加" size="35%" v-model="drawerVisable" direction="rtl">
    <el-form ref="insertFromRef" :model="insertForm" label-width="70"
             style="max-width: 600px">
      <el-form-item label="公会名称" prop="communityName">
        <el-input v-model="insertForm.communityName"/>
      </el-form-item>
      <el-form-item label="公会图标" prop="communityLogo">
        <el-input v-model="insertForm.communityLogo"/>
      </el-form-item>
      <el-form-item label="会长编号" prop="communityLeader">
        <el-input v-model="insertForm.communityLeader"/>
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


  <!-- communityId:'',
      communityName:'',
      communityLogo:'',
      communityLeader:'', -->

  <el-drawer title="修改" size="30%" v-model="updateVisable" direction="rtl">
    <el-form :model="editForm.editData" label-width="70"
             style="max-width: 600px">
      <el-form-item label="公会编号">
        <el-input disabled v-model="editForm.editData.communityId"/>
      </el-form-item>
      <el-form-item label="公会名称">
        <el-input v-model="editForm.editData.communityName"/>
      </el-form-item>
      <el-form-item label="公会图标">
        <el-input v-model="editForm.editData.communityLogo"/>
      </el-form-item>
      <el-form-item label="会长编号">
        <el-input v-model="editForm.editData.communityLeader"/>
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


/**删除功能 */
const openDelete = (communityId) => {
  ElMessageBox.confirm(
      `确定要删除编号为[${communityId}]记录么?`,
      '注意',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //发送请求
        let resp = await myPost("/godCommunity/deleteGodCommunity", {communityId: communityId})
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
    communityId: '',
    communityName: '',
    communityLogo: '',
    communityLeader: '',
  }
})

//打开修改框
const openUpdate = (currentRow) => {
  updateVisable.value = true
  // console.log(currentRow);
  // console.log(JSON.parse(JSON.stringify(currentRow))  );
  //需要做对象复制 不能直接传引用
  editForm.editData = JSON.parse(JSON.stringify(currentRow))

}
//提交修改
const updateSubmit = async () => {
  let resp = await myPost("/godCommunity/updateGodCommunity", editForm.editData)
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
  communityName: '',
  communityLogo: '',
  communityLeader: ''
})

//添加表单对象
const insertFromRef = ref()

//添加提交
const insertSubmit = async () => {
  let resp = await myPost('/godCommunity/insertGodCommunity', insertForm);
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


// 查询功能

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
  myGet("/godCommunity/listGodCommunity", params)
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
  communityName: ''
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

</style>