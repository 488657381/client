<template>
  <el-form ref="queryFormRef" :model="queryForm" :inline="true">
    <el-form-item label="客户名称" prop="nickname">
      <el-input v-model="queryForm.nickname" style="width: 240px;" placeholder="nickname" clearable/>
    </el-form-item>
    <el-form-item label="工会名称" prop="communityName">
      <el-input v-model="queryForm.communityName" style="width: 240px;" placeholder="communityName" clearable/>
    </el-form-item>

    <el-form-item label="接单资质" prop="skillOpen">
      <el-select v-model="queryForm.skillOpen" placeholder="skillOpen" style="width: 240px;" clearable>
        <el-option label="开启" value="1"/>
        <el-option label="关闭" value="0"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="queryReset">重置</el-button>
    </el-form-item>
  </el-form>


  <el-table ref="tableRef" height="300" :data="tableData.dataList" style="width: 100%">
    <el-table-column prop="uid" label="大神编号" width="120"  align="center"/>
    <el-table-column prop="webUserInfo.nickname" label="大神名称" width="120"  align="center"/>
    <el-table-column prop="communityId" label="公会编号" width="100"  align="center"/>
    <el-table-column prop="godCommunity.communityName" label="公会名称" width="120"  align="center"/>
    <el-table-column prop="withdrawDetail" label="收款账号" width="120"  align="center"/>
    <el-table-column prop="skillOpen" label="接单资质" width="120"  align="center"/>
    <el-table-column fixed="right" label="操作" width="180">
      <template #default="scope">
        <el-button type="primary" @click="openUpdate(scope.row)">修改</el-button>
      </template>

    </el-table-column>
  </el-table>


  <!-- 
            分页组件：
    -->
  <div style="margin-top: 5px">
  <el-pagination

      v-model:current-page="tableData.pageInfo.page"
      v-model:page-size="tableData.pageInfo.pageSize"
      :total="tableData.pageInfo.total"
      :page-sizes="[10, 20, 30]"
      layout="total,sizes, prev, pager, next,jumper"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"

  />
  </div>

  <!-- 修改的弹窗 -->
  <el-drawer title="修改" size="30%" v-model="updateVisable" direction="rtl">
    <el-form :model="editForm.editData" label-width="70"
             style="max-width: 600px">
      <el-form-item label="大神编号">
        <el-input disabled v-model="editForm.editData.uid"/>
      </el-form-item>
      <el-form-item label="公会编号">
        <el-input disabled v-model="editForm.editData.communityId"/>
      </el-form-item>
      <el-form-item label="收款账号">
        <el-input v-model="editForm.editData.withdrawDetail"/>
      </el-form-item>
      <!-- <el-form-item label="接单资质">
          <el-input v-model="editForm.editData.skillOpen" />
      </el-form-item> -->
      <el-form-item label="接单资质">
        <el-select v-model="editForm.editData.skillOpen" placeholder="请选择">
          <el-option label="关闭" :value="0"/>
          <el-option label="开启" :value="1"/>
        </el-select>
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


/**修改功能 */
//修改抽屉显示 隐藏
const updateVisable = ref(false)
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
  let resp = await myPost("/godUser/updateGodUser", editForm.editData)
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


// 修改表单数据
const editForm = reactive({
  editData: {
    uid: '',
    skillOpen: '',
    communityId: '',
    withdrawDetail: ''
  }
})


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
  myGet("/godUser/listGodUser", params)
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

//查询表单对象
const queryFormRef = ref()


//查询表单
const queryForm = reactive({
  nickname: '',
  communityName: '',
  skillOpen: ''
})

//提交查询
const querySubmit = () => {
  let params = queryForm;
  myQuery(params)
}


//查询重置
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