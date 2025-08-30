<template>

  <el-form ref="queryFormRef" :model="queryForm" :inline="true">
    <el-form-item label="用户名称" prop="username">
      <el-input v-model="queryForm.username" style="width: 240px;" placeholder="username" clearable/>
    </el-form-item>
    <el-form-item label="用户状态" prop="isvalid">
      <el-select v-model="queryForm.isvalid" placeholder="请选择" style="width: 240px;" clearable>
        <el-option label="离职" :value="0"/>
        <el-option label="在职" :value="1"/>
        <el-option label="休假" :value="2"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="queryReset">重置</el-button>
      <el-button type="primary" @click="openInsert()">添加</el-button>
    </el-form-item>
  </el-form>

  <el-table height="450"  :data="tableData.tableList" style="width: 100%">
    <el-table-column prop="uid" fixed label="编号" width="70" align="center"/>
    <el-table-column prop="username" label="用户名" width="100" align="center"/>
    <el-table-column prop="password" label="密码" width="100" align="center">
      <template #default="scope">
        <el-text type="info">{{ transPassword(scope.row.password) }}</el-text>

      </template>

    </el-table-column>
    <el-table-column prop="isvalid" label="用户状态" width="120" align="center">
      <template #default="scope">
        <el-text v-if="scope.row.isvalid == 1" type="success">在职</el-text>
        <el-text v-else-if="scope.row.isvalid == 0" type="danger">离职</el-text>
        <el-text v-else-if="scope.row.isvalid == 2" type="warning">休假</el-text>

      </template>

    </el-table-column>
    <el-table-column prop="createUid" label="创建人" width="120" align="center"/>
    <el-table-column prop="createUname" label="创建名称" width="120" align="center"/>
    <el-table-column prop="regTime" label="注册时间" width="150" align="center">
      <template #default="scope">
        <el-tag type="primary">{{ scope.row.regTime }}</el-tag>

      </template>

    </el-table-column>
    <el-table-column prop="loginTime" label="最后登录时间" width="150" align="center">
      <template #default="scope">
        <el-tag type="primary">{{ scope.row.loginTime }}</el-tag>

      </template>

    </el-table-column>
    <el-table-column prop="headImg" label="头像详细" width="120" align="center">
      <template #default="scope">
        <img :src="scope.row.headImg"></img>

      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="280" align="center">
      <template #default="scope">
        <el-button type="primary" @click="openUpdate(scope.row)">修改</el-button>
        <el-button type="primary" @click="openDelete(scope.row.uid)">删除</el-button>
        <el-button type="primary" @click="openAuth(scope.row.uid)">授权</el-button>
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

  <el-drawer title="添加" size="30%" v-model="drawerVisable" direction="rtl">
    <el-form ref="insertFromRef" :model="insertForm" label-width="70"
             style="max-width: 600px">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="insertForm.username"/>
      </el-form-item>
      <el-form-item label="头像详细" prop="headImg">
        <!-- <el-input v-model="insertForm.headImg" /> -->
        <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="addUpload"
        >
          <img v-if="insertForm.headImg" :src="insertForm.headImg" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
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
      <el-form-item label="用户编号">
        <el-input disabled v-model="editForm.editData.uid"/>
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input v-model="editForm.editData.username"/>
      </el-form-item>
      <el-form-item label="用户密码">
        <el-input v-model="editForm.editData.password"/>
      </el-form-item>
      <el-form-item label="注册时间">
        <!-- <el-input v-model="editForm.editData.regTime" /> -->
        <el-date-picker
            v-model="editForm.editData.regTime"
            type="datetime"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="用户状态">
        <el-select v-model="editForm.editData.isvalid" placeholder="请选择">
          <el-option label="离职" :value="0"/>
          <el-option label="在职" :value="1"/>
          <el-option label="休假" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="头像地址">
        <!-- <el-input v-model="editForm.editData.headImg" /> -->
        <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="updateUpload"
        >
          <img v-if="editForm.editData.headImg" :src="editForm.editData.headImg" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
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


  <el-drawer title="授权" size="35%" v-model="authVisable" direction="rtl">
    <el-form :model="authForm" label-width="70"
             style="max-width: 600px">
      <el-form-item label="用户编号">
        <el-input v-model="authForm.uid" disabled/>
      </el-form-item>

      <el-form-item label="用户权限">
        <el-tree
            ref="treeRef"
            style="max-width: 500px"
            :data="treeList.treeData"
            show-checkbox
            default-expand-all
            node-key="mid"
            highlight-current
            :props="defaultProps"
        />
      </el-form-item>


    </el-form>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="authVisable=false">关闭</el-button>
        <el-button type="primary" @click="authSubmit">保存</el-button>
      </div>
    </template>
  </el-drawer>


</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {Check, Delete, Edit, Message, Search, Star, Share} from '@element-plus/icons-vue'
import {myGet, myPost} from '@/myaxios'
import {ElMessage, ElMessageBox} from 'element-plus'
import axios from 'axios'

/**上传函数 */
const addUpload = async (rawFile) => {
  //1找到文件
  let curretFile = rawFile.file
  //2创建formData 把文件放进去
  let formData = new FormData()
  formData.append("myfile", curretFile)
  let resp = await axios.post("http://localhost:8080/baseProj/upload", formData)
  //给上传组件 配置图片显示的路径
  insertForm.headImg = resp.data.returnData
}

const updateUpload = async (rawFile) => {
  //1找到文件
  let curretFile = rawFile.file
  //2创建formData 把文件放进去
  let formData = new FormData()
  formData.append("myfile", curretFile)
  let resp = await axios.post("http://localhost:8080/baseProj/upload", formData)
  //给上传组件 配置图片显示的路径
  editForm.editData.headImg = resp.data.returnData

}


/**授权功能 */
const authVisable = ref(false)

//tree的数据对象
const treeList = reactive({treeData: []})

//tree组件对象
const treeRef = ref()

//授权表单对象
const authForm = reactive({
  uid: '',
  listMid: ''
})

//自定义映射 tree读取的key
const defaultProps = {
  children: 'subMenu',
  label: 'menuname',
}
//打开授权抽屉
const openAuth = async (uid) => {
  authVisable.value = true
  let resp = await myGet('/users/listMenuForAuth', {'uid': uid})
  console.log(resp.data.returnData);
  treeList.treeData = resp.data.returnData.listAllMenu
  treeRef.value.setCheckedKeys(resp.data.returnData.listUserMenuId, false)
  //给界面uid赋值
  authForm.uid = uid

}
//授权提交
const authSubmit = async () => {
  let checkedMenuList = treeRef.value.getCheckedKeys(true)
  console.log(checkedMenuList);
  //选中的数组做成字符串
  authForm.listMid = checkedMenuList.join(",")
  //authForm 需要提交的授权数据对象

  let resp = await myPost("/users/updateAuth", authForm)
  if (resp.data.code == 20010) {
    //关框
    authVisable.value = false
    //弹窗结果
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
        let resp = await myPost("/users/deleteUser", {uid: uid})
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
    uid: '',
    username: '',
    password: '',
    regTime: '',
    isvalid: '',
    headImg: '',
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
  let resp = await myPost("/users/updateUser", editForm.editData)
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
  username: '',
  headImg: ''
})

//添加表单对象
const insertFromRef = ref()

//添加提交
const insertSubmit = async () => {
  let resp = await myPost('/users/insertUser', insertForm);
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
  username: '',
  isvalid: ''
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


/**公共函数 */
//密码脱敏(把密码字段通过程序逻辑做部分隐藏)
const transPassword = (pwd) => {
  let pwdStart = pwd.substr(0, 1)
  let pwdEnd = pwd.substr(pwd.length - 1, 1)
  return `${pwdStart}***${pwdEnd}`;
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
  let resp = await myGet("/users/listUser", params)
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
</style>
