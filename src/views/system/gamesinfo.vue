<template>

  <el-form ref="queryFormRef" :model="queryForm" :inline="true">
    <el-form-item label="游戏名称" prop="gameName">
      <el-input v-model="queryForm.gameName" style="width: 240px;" placeholder="请输入游戏名称" clearable/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="queryReset">重置</el-button>
      <el-button type="primary" @click="openInsert()">添加</el-button>
    </el-form-item>
  </el-form>

  <el-table height="450" :data="tableData.tableList" style="width: 100%">
    <el-table-column prop="gameId" fixed label="ID" width="150" align="center"/>
    <el-table-column prop="gameName" label="游戏名称" width="200" align="center">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>游戏名称：{{ scope.row.gameName }}</div>
          </template>
          <template #reference>
            <el-tag>{{ scope.row.gameName }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="gameName" label="区服信息" width="200" align="center">
      <template #default="scope">
        <el-button type="primary" @click="opengameServer(scope.row)" plain>区服信息</el-button>
      </template>
    </el-table-column>

    <el-table-column prop="gameLevel" label="段位信息" width="200" align="center">
      <template #default="scope">
        <el-button type="info" plain @click="openRankInfo(scope.row)">段位信息</el-button>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="280" align="center">
      <template #default="scope">
        <el-button type="primary" @click="openUpdate(scope.row)">修改</el-button>
        <el-button type="primary" @click="openDelete(scope.row.gameId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
      v-model:current-page="tableData.pageInfo.page"
      v-model:page-size="tableData.pageInfo.pageSize"
      :total="tableData.pageInfo.total"
      :page-sizes="[3, 6, 9]"
      layout="total, sizes, prev, pager, next, jumper"

      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />

  <!--  gameId: '',
      gameLogo: '',
      gameName: '',
      gamePrice: '',
      gameRatio: '',-->
  <el-drawer title="添加" size="35%" v-model="drawerVisable" direction="btt">
    <el-form ref="insertFromRef" :model="insertForm" label-width="70"
             style="max-width: 600px">
      <el-form-item label="游戏编号" prop="gameId">
        <el-input v-model="insertForm.gameId"/>
      </el-form-item>
      <el-form-item label="游戏名称" prop="gameName">
        <el-input v-model="insertForm.gameName"/>
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
      <el-form-item label="游戏编号" prop="gameId">
        <el-input v-model="editForm.editData.gameId" :disabled="true"/>
      </el-form-item>
      <el-form-item label="游戏名称" prop="gameName">
        <el-input v-model="editForm.editData.gameName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <!-- 游戏区服管理 -->
  <el-drawer title="游戏区服管理" size="55%" v-model="gameServer" direction="btt">
    <el-text type="primary">{{ currentGame.gameName }}</el-text>
    <el-divider/>
    <el-button type="primary" @click="openServerInsert(currentGame)">添加</el-button>
    <el-divider/>
    <el-table height="250" :data="gameServerFrom.serverList" style="width: 100%">
      <el-table-column prop="gameId" fixed label="游戏编号" width="250" align="center"/>
      <el-table-column prop="serverId" label="区服编号" width="350" align="center">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>游戏名称：{{ scope.row.serverId }}</div>
            </template>
            <template #reference>
              <el-tag>{{ scope.row.serverId }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="serverName" label="区服名称" width="350" align="center">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>游戏名称：{{ scope.row.serverName }}</div>
            </template>
            <template #reference>
              <el-tag>{{ scope.row.serverName }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="380" align="center">
        <template #default="scope">
          <el-button type="primary" @click="DeleteServer(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>

  <el-drawer title="区服添加" size="35%" v-model="ServerInsert" direction="btt">
    <el-form ref="insertFromRef" :model="insertForm" label-width="70"
             style="max-width: 600px">
      <el-form-item label="游戏编号" prop="gameId">
        <el-input v-model="insertServerForm.gameId" :disabled="true"/>
      </el-form-item>
      <el-form-item label="区服编号" prop="serverId">
        <el-input v-model="insertServerForm.serverId"/>
      </el-form-item>
      <el-form-item label="区服名称" prop="serverName">
        <el-input v-model="insertServerForm.serverName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="insertServerSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <!-- 段位信息管理 -->
  <el-drawer title="段位信息管理" size="65%" v-model="RankInfo" direction="btt">
    <el-text type="primary">{{ currentRank.gameName }}</el-text>
    <el-divider/>
    <el-button type="primary" @click="openRankInsert(currentRank)">添加</el-button>
    <el-divider/>
    <el-table height="250" :data="RankFrom.levelList" style="width: 100%">
      <el-table-column prop="gameId" fixed label="游戏编号" width="250" align="center"/>
      <el-table-column prop="gameLevelId" label="段位编号" width="350" align="center">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>游戏名称：{{ scope.row.gameLevelId }}</div>
            </template>
            <template #reference>
              <el-tag>{{ scope.row.gameLevelId }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="gameLevelName" label="段位名称" width="350" align="center">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>游戏名称：{{ scope.row.gameLevelName }}</div>
            </template>
            <template #reference>
              <el-tag>{{ scope.row.gameLevelName }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="380" align="center">
        <template #default="scope">
          <el-button type="primary" @click="DeleteRank(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
  <el-drawer title="段位添加" size="35%" v-model="RankInsert" direction="btt">
    <el-form ref="insertFromRef" :model="insertRankForm" label-width="70"
             style="max-width: 600px">
      <el-form-item label="游戏编号" prop="gameId">
        <el-input v-model="insertRankForm.gameId" :disabled="true"/>
      </el-form-item>
      <el-form-item label="段位编号" prop="serverId">
        <el-input v-model="insertRankForm.gameLevelId"/>
      </el-form-item>
      <el-form-item label="段位名称" prop="serverName">
        <el-input v-model="insertRankForm.gameLevelName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="insertRankSubmit">保存</el-button>
      </el-form-item>
    </el-form>
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
  insertForm.gameLogo = resp.data.returnData
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
  editForm.editData.gameLogo = resp.data.returnData
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
        let resp = await myPost("/game/deleteGame", {gameId: uid})
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
/**段位信息管理*/
const RankInfo = ref(false)
const openRankInfo = async (row) => {
  RankInfo.value = true
  // console.log(row)
  currentRank.gameId = row.gameId
  currentRank.gameName = row.gameName
  await updateRank()
}
//储存当前打开的区服信息
const currentRank = reactive({
  gameId: '',
  gameName: '',
})
//如果有操作改变rank
const updateRank = async () => {
  let resp = await myPost("/game/findLevel", {gameId: currentRank.gameId})
  RankFrom.levelList = resp.data.returnData
}
const RankFrom = reactive({
  levelList: []
})
//添加段位表单
const RankInsert = ref(false)
//添加区服信息表单
const insertRankForm = reactive({
  gameId: '',
  gameLevelId: '',
  gameLevelName: ''
})
//打开添加段位窗口
const openRankInsert = (game) => {
  RankInsert.value = true
  insertRankForm.gameId = game.gameId
}
//添加提交段位
const insertRankSubmit = async () => {
  let resp = await myPost('/game/insertGameLevel', insertRankForm);
  if (resp.data.code == 20010) {
    RankInsert.value = false
    ElMessage.success(resp.data.msg)
    await updateRank()
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
//段位删除
const DeleteRank = (row) => {
  ElMessageBox.confirm(
      `确定要删除编号为[${row.gameLevelName}]记录么?`,
      '注意',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //发送请求
        let resp = await myPost("/game/deleteGameLevel", {gameId: row.gameId, gameLevelId: row.gameLevelId})
        if (resp.data.code == 20010) {
          ElMessage.success(resp.data.msg)
          await updateRank()
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
/**游戏区服管理 */
const gameServer = ref(false)
const opengameServer = async (row) => {
  gameServer.value = true
  currentGame.gameId = row.gameId
  currentGame.gameName = row.gameName
  await updateData()
}
//区服信息储存
const gameServerFrom = reactive({
  serverList: []
})
const ServerInsert = ref(false)
//区服信息表单
const insertServerForm = reactive({
  gameId: '',
  serverId: '',
  serverName: ''
})
//储存当前打开的区服信息
const currentGame = reactive({
  gameId: '',
  gameName: '',
})
//打开添加区服窗口
const openServerInsert = (game) => {
  ServerInsert.value = true
  insertServerForm.gameId = game.gameId
}
//添加提交
const insertServerSubmit = async () => {
  let resp = await myPost('/game/insertGameServer', insertServerForm);
  if (resp.data.code == 20010) {
    ServerInsert.value = false
    ElMessage.success(resp.data.msg)
    await updateData()
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
//区服删除
const DeleteServer = (row) => {
  ElMessageBox.confirm(
      `确定要删除编号为[${row.serverName}]记录么?`,
      '注意',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //发送请求
        let resp = await myPost("/game/deleteGameServer", {gameId: row.gameId, serverId: row.serverId})
        if (resp.data.code == 20010) {
          ElMessage.success(resp.data.msg)
          await updateData()
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
//更新数据 在储存当前id中获取gameId，然后查询
const updateData = async () => {
  let resp = await myPost("/game/findServer", {gameId: currentGame.gameId})
  gameServerFrom.serverList = resp.data.returnData
}
/**修改功能 */
//修改抽屉显示 隐藏
const updateVisable = ref(false)
//修改表单对象
const editForm = reactive({
  editData: {
    gameId: '',
    gameName: '',
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
  }
}
//提交修改
const updateSubmit = async () => {
  let resp = await myPost("/game/updateGame", editForm.editData)
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
  gameId: '',
  gameName: '',
  version: ''
})

//添加表单对象
const insertFromRef = ref()

//添加提交
const insertSubmit = async () => {
  let resp = await myPost('/game/insertGame', insertForm);
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
  gameName: '',
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
      //await 主线程会等待 await的函数 执行完 主线程才会继续执

  let resp = await myGet("/game/listGame", params)
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

/* 游戏价格列美化 */
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
