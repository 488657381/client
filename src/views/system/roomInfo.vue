<template>

  <!--
<el-table-column fixed="right" prop="roomOpenStatus" label="开播状态" />
  <el-table-column fixed="right" prop="roomSpeechStatus" label="禁言状态" />

  -->

  <el-form ref="queryFormRef" :inline="true" :model="queryForm" class="demo-form-inline">
    <el-form-item label="大厅名称" prop="roomName">
      <el-input v-model="queryForm.roomName" placeholder="请输入大厅" clearable/>
    </el-form-item>
    <el-form-item label="房主名称" prop="nikeName">
      <el-input v-model="queryForm.nikeName" placeholder="请输入房主" clearable/>
    </el-form-item>
    <el-form-item label="一级大厅" prop="categoryNameLevel1">
      <el-select
          v-model="queryForm.categoryNameLevel1"
          placeholder="请选择"
          style="width: 125px;"
          @change="loadCategory2(queryForm.categoryNameLevel1)"
      >
        <el-option v-for="level1 in level1List.level1ListData" :label="level1.categoryName"
                   :value="level1.categoryName"/>
      </el-select>
    </el-form-item>
    <el-form-item label="二级大厅" prop="categoryNameLevel2">
      <el-select
          v-model="queryForm.categoryNameLevel2"
          placeholder="请选择"
          style="width: 125px;"
      >
        <el-option
            v-for="(level2, index) in level2List"
            :key="index"
            :label="level2.categoryName"
            :value="level2.categoryName"
        />

        <!--<el-option v-for="level2 in level2List.levle2ListData" :label="level2.subRoomCategories.categoryName" :value="level2.subRoomCategories.categoryName" /> -->
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="resetQueryForm">重置</el-button>
      <el-button @click="openInsertDialog">新增</el-button>
    </el-form-item>
  </el-form>


  <el-table height="550" :data="tableData.roomInfoList" style="width: 100%">
    <el-table-column prop="roomId" label="大厅编号" width="100"  align="center">
      <template #default="scope">
        <el-tag type="success">{{ scope.row.roomId }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="roomName" label="大厅名称" width="100"  align="center"/>
    <el-table-column prop="roomCategoryL1" label="一级编号" width="80"  align="center"/>
    <el-table-column prop="categoryNameLevel1" label="一级名称" width="80"  align="center">
      <template #default="scope">
        <el-tag type="warning">{{ scope.row.categoryNameLevel1 }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="roomCategoryL2" label="二级编号" width="80"  align="center"/>
    <el-table-column prop="categoryNameLevel2" label="二级名称" width="100"  align="center">
      <template #default="scope">
        <el-tag type="info">{{ scope.row.categoryNameLevel2 }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="roomOwnerCustomer" label="房主编号" width="100"  align="center"/>
    <el-table-column prop="nickname" label="房主名称" width="80"  align="center"/>
    <el-table-column prop="roomNotice" label="房间公告" width="180"  align="center">
      <template #default="scope">
        <!-- 用容器包裹内容，通过CSS固定高度和截断 -->
        <div class="notice-content ellipsis">
          <el-link @click="showNotice(scope.row.roomNotice)" type="primary">{{ scope.row.roomNotice }}</el-link>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="roomPush" label="推荐状态" width="120"  align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.roomPush==1" type="success">正常</el-tag>
        <el-tag v-else-if="scope.row.roomPush==2" type="primary">首页推荐</el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" prop="roomOpenStatus" label="开播状态" width="100"  align="center">
      <template #default="scope">
        <el-switch
            ref="OpenStatusSwitchRef"
            v-model="scope.row.roomOpenStatus"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;width: 50px;"

            active-text="正常"
            inactive-text="禁止"
            :active-value="1"
            :inactive-value="0"

            @change="handleSwitchChange(scope.row, 'roomOpenStatus')"
        />

      </template>

    </el-table-column>
    <el-table-column fixed="right" prop="roomSpeechStatus" label="禁言状态" width="100"  align="center">
      <template #default="scope">
        <el-switch
            v-model="scope.row.roomSpeechStatus"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"

            active-text="正常"
            inactive-text="禁止"
            :active-value="1"
            :inactive-value="0"
            @change="handleSwitchChange(scope.row, 'roomSpeechStatus')"
        />


      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right"  width="160" align="center">
      <template #default="scope">
        <el-button  type="info" @click="openUpdateDialog(scope.row)">修改</el-button>
        <el-button  type="info" @click="openDeleteTip(scope.row.roomId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 5px">
  <el-pagination
      v-model:current-page="tableData.pageInfo.page"
      v-model:page-size="tableData.pageInfo.pageSize"
      :page-sizes="[8, 16, 24]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.pageInfo.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
  </div>
  <!-- 公告提示框 -->
  <el-dialog
      v-model="noticeDialog"
      title="大厅公告"
      width="500"
      center
      class="dialog-bottom"
  >
    <span>{{ notice }}</span>
  </el-dialog>

  <el-dialog
      v-model="insertDialogVisible"
      title="新增大厅"
      width="700"
  >
    <!-- 用栅格系统实现两列布局 -->
    <el-row :gutter="20">
      <!-- 左列 -->
      <el-col :span="12">
        <el-form :model="insertForm" label-width="auto" ref="insertFormLeftRef">
          <el-form-item label="大厅编号" prop="roomId">
            <el-input v-model="insertForm.roomId"/>
          </el-form-item>
          <el-form-item label="房主编号" prop="roomOwnerCustomer">
            <el-input v-model="insertForm.roomOwnerCustomer"/>
          </el-form-item>
          <el-form-item label="大厅大类" prop="category1">
            <el-select v-model="insertForm.category1" placeholder="请选择">
              <el-option @click="loadCategory2(level1.categoryName)" v-for="level1 in level1List.level1ListData"
                         :label="level1.categoryName" :value="level1.categoryId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="开播状态" prop="roomOpenStatus">
            <el-select v-model="insertForm.roomOpenStatus" placeholder="请选择">
              <el-option label="正常" :value="1"/>
              <el-option label="禁用" :value="0"/>
            </el-select>
          </el-form-item>

        </el-form>
      </el-col>

      <!-- 右列 -->
      <el-col :span="12">
        <el-form :model="insertForm" label-width="auto" ref="insertFormRightRef">
          <el-form-item label="大厅名称" prop="roomName">
            <el-input v-model="insertForm.roomName"/>
          </el-form-item>
          <el-form-item label="推荐级别" prop="roomPush">
            <el-select v-model="insertForm.roomPush" placeholder="选择级别">
              <el-option label="首页推荐" :value="2"/>
              <el-option label="正常" :value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="大厅小类" prop="category2">
            <el-select v-model="insertForm.category2" placeholder="请选择">
              <el-option
                  v-for="(level2, index) in level2List"
                  :key="index"
                  :label="level2.categoryName"
                  :value="level2.categoryId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="禁言状态" prop="roomSpeechStatus">
            <el-select v-model="insertForm.roomSpeechStatus" placeholder="请选择">
              <el-option label="正常" :value="1"/>
              <el-option label="禁用" :value="0"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-form :model="insertForm" ref="noticeFormRef">
      <el-form-item label="大厅公告" prop="roomNotice">
        <el-input v-model="insertForm.roomNotice" type="textarea"/>
      </el-form-item>
    </el-form>


    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clear">取消</el-button>
        <el-button type="primary" @click="insertSumbit">确定</el-button>
      </div>
    </template>
  </el-dialog>


  <!-- 修改弹出框 -->
  <el-dialog
      v-model="updateDialogVisible"
      title="修改"
      width="500"
  >
    <!-- 用栅格系统实现两列布局 -->
    <el-row :gutter="20">
      <!-- 左列 -->
      <el-col :span="12">
        <el-form :model="updateForm.updateData" label-width="auto" ref="insertFormLeftRef">
          <el-form-item label="大厅编号" prop="roomId">
            <el-input disabled v-model="updateForm.updateData.roomId"/>
          </el-form-item>
          <el-form-item label="房主编号" prop="roomOwnerCustomer">
            <el-input v-model="updateForm.updateData.roomOwnerCustomer"/>
          </el-form-item>

        </el-form>
      </el-col>

      <!-- 右列 -->
      <el-col :span="12">
        <el-form :model="updateForm.updateData" label-width="auto" ref="insertFormRightRef">
          <el-form-item label="大厅名称" prop="roomName">
            <el-input v-model="updateForm.updateData.roomName"/>
          </el-form-item>
          <el-form-item label="推荐级别" prop="roomPush">
            <el-select v-model="updateForm.updateData.roomPush" placeholder="选择级别">
              <el-option label="首页推荐" :value="2"/>
              <el-option label="正常" :value="1"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-form :model="updateForm.updateData" ref="noticeFormRef">
      <el-form-item label="大厅公告" prop="roomNotice">
        <el-input v-model="updateForm.updateData.roomNotice" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateSubmit">修改</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 修改开播状态提醒 -->
  <!-- <el-dialog
    v-model="updateRoomOpenStatusDialogVisible"
    title="警告"
    width="500"
    class="custom-center-dialog"
  >
    {{ showOpenMsg }}
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancleUpdateOpenStatus">取消</el-button>
        <el-button type="primary" @click="updateOpenStatusSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
 -->
  <!-- 通用确认弹窗（同时服务于两个开关） -->
  <el-dialog
      v-model="confirmDialogVisible"
      title="操作确认"
      width="400px"
      @close="handleDialogClose"
  >
    <p>
      确定要将【{{ currentContext.row && currentContext.row.roomName }}】的
      {{ currentContext.field === 'roomOpenStatus' ? '开播状态' : '禁言状态' }}
      修改为{{ currentContext.newStatus === 1 ? '正常' : '禁止' }}吗？
    </p>
    <template #footer>
      <el-button @click="cancelChange">取消</el-button>
      <el-button type="primary" @click="confirmChange">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'

import {Check, Delete, Edit, Message, Search, Star, Share} from '@element-plus/icons-vue'
import {myGet, myPost} from '../../myaxios'
import {ElMessage, ElMessageBox} from 'element-plus'


/**修改操作之开播与禁播，禁言状态 */

// 弹窗控制
const confirmDialogVisible = ref(false);

// 核心：保存当前操作的上下文（区分两个开关）
const currentContext = reactive({
  row: null,         // 当前行数据
  field: '',         // 字段名：roomOpenStatus 或 roomSpeechStatus
  originalStatus: 0, // 原始状态（用于回滚）
  newStatus: 0       // 切换后的新状态
});

// 标记是否已确认（用于判断是否需要回滚）
const isConfirmed = ref(false);

/**
 * 处理开关状态变化（通用方法，同时支持两个开关）
 * @param {Object} row - 当前行数据
 * @param {String} field - 字段名（roomOpenStatus / roomSpeechStatus）
 */
const handleSwitchChange = (row, field) => {
  console.log(row.roomOpenStatus);

  // 保存当前操作的上下文
  //将地址赋值。
  currentContext.row = row;
  currentContext.field = field;
  currentContext.originalStatus = row[field] === 1 ? 0 : 1; // 计算原始值
  currentContext.newStatus = row[field]; // 新值（v-model已更新）

  // 打开弹窗，重置确认状态
  isConfirmed.value = false;
  confirmDialogVisible.value = true;
};

/**
 * 取消修改（关闭弹窗并触发回滚）
 */
const cancelChange = () => {
  isConfirmed.value = false;
  confirmDialogVisible.value = false;
};

/**
 * 确认修改（调用接口提交）
 */
const confirmChange = async () => {
  try {
    const {row, field, newStatus} = currentContext;
    // 1. 构造表单参数（URLSearchParams 适配 application/x-www-form-urlencoded）
    let formData = new URLSearchParams();
    formData.append('roomId', row.roomId.toString()); // 转字符串，避免类型问题
    formData.append('field', field);                  // 动态字段名（roomOpenStatus/roomSpeechStatus）
    formData.append('value', newStatus.toString());   // 状态值（0/1）

    // 2. 调用 Servlet 接口
    let resp = await myPost(
        'room/updateRoomStatus', // 接口地址（和 Servlet @WebServlet 一致）
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // 必须设置表单格式
          }
        }
    );

    // 3. 处理响应
    if (resp.data.code === 20010) {
      ElMessage.success(resp.data.msg);
      isConfirmed.value = true;
      //刷新表单
      //刷新表单
      let params1 = queryForm
      let params2 = tableData.pageInfo
      let allParam = {...params1, ...params2}
      query(allParam)
    } else {
      ElMessage.warning(resp.data.msg || '修改失败');
      isConfirmed.value = false;
    }
  } catch (error) {
    ElMessage.error('网络异常');
    isConfirmed.value = false;
  } finally {
    confirmDialogVisible.value = false;
  }
};

/**
 * 所有场景关闭弹窗时的统一处理
 * （包括：点击取消、点击×、按ESC、点击遮罩）
 */
const handleDialogClose = () => {
  // 未确认修改时才回滚
  if (!isConfirmed.value && currentContext.row) {
    // 根据字段名回滚对应状态
    currentContext.row[currentContext.field] = currentContext.originalStatus;
  }
  // 重置上下文，避免影响下次操作
  Object.assign(currentContext, {
    row: null,
    field: '',
    originalStatus: 0,
    newStatus: 0
  });
};


/**修改操作之点击修改按钮 */

//对话框
const updateDialogVisible = ref(false)
//开框
const openUpdateDialog = (currentRow) => {
  console.log(currentRow);
  updateDialogVisible.value = true
  //将当前行的数据覆盖。
  let currentData = JSON.parse(JSON.stringify(currentRow))
  updateForm.updateData = currentData

}
//修改表单容器,需要覆盖
const updateForm = reactive({
  updateData: {
    roomoId: '',
    roomoNotice: '',
    roomoName: '',
    roomOwnerCustomer: '',
    roomPush: '',
  }
})
//点击修改按钮之后
const updateSubmit = async () => {
  let resp = await myPost("/room/updateRoom", updateForm.updateData)
  if (resp.data.code == 20010) {
    ElMessage.success(resp.data.msg)
    //关框，刷页面
    updateDialogVisible.value = false
    //刷新表单
    //刷新表单
    let params1 = queryForm
    let params2 = tableData.pageInfo
    let allParam = {...params1, ...params2}
    query(allParam)
  } else if (resp.data.code == 20011) {
    ElMessage.warning(resp.data.msg)
  }
}


/**删除功能 */
const openDeleteTip = (roomId) => {
  //开提醒框
  ElMessageBox.confirm(
      `<h4>确定要删除该条记录吗？</h4>
    大厅编号${roomId}`,
      '删除警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true,

      }
  )
      .then(async () => {
        let resp = await myPost("/room/deleteRoomById", {roomId: roomId})
        if (resp.data.code == 20010) {
          ElMessage.success(resp.data.msg)
          //刷新表单
          //刷新表单
          let params1 = queryForm
          let params2 = tableData.pageInfo
          let allParam = {...params1, ...params2}
          query(allParam)
          //
        } else if (resp.data.code == 20011) {
          ElMessage.warning(resp.data.msg)
        }
      })
      .catch(() => {
        //什么也不干
      })

}


/**添加功能 */
const insertDialogVisible = ref(false)
//点击新增，打开新增表单对话框
const openInsertDialog = async () => {
  insertDialogVisible.value = true
  //同时将一级大厅渲染到表单
  listRoomCategoryLevel1()
  //先清空二级大厅列表，防止在查询的时候就有值
  level2List.length = 0


}
//表单标识
const insertFormLeftRef = ref()
const insertFormRightRef = ref()
const noticeFormRef = ref()


//点取消
const clear = () => {
  //二级大厅清0
  level2List.length = 0
  //清空表单
  insertFormLeftRef.value.resetFields()
  insertFormRightRef.value.resetFields()
  noticeFormRef.value.resetFields()
  //关闭对话框
  insertDialogVisible.value = false
}
//点击表单中的新增，向后端接口发请求
const insertSumbit = async () => {

  let resp = await myPost("/room/insertRoom", insertForm)
  if (resp.data.code == 20010) {
    //新增成功就重置表单并且刷新table同时关闭页面
    console.log(resp.data);

    ElMessage.success(resp.data.msg)
    //刷新表单
    let params1 = queryForm
    let params2 = tableData.pageInfo
    let allParam = {...params1, ...params2}
    query(allParam)
    //关框
    insertDialogVisible.value = false
    //清空表单
    insertFormLeftRef.value.resetFields()
    insertFormRightRef.value.resetFields()
    noticeFormRef.value.resetFields()
  } else if (resp.data.code == 20011) {
    ElMessage.warning(resp.data.msg)
  } else if (resp.data.code == 20012) {
    ElMessage.warning(resp.data.msg)
  }


}

//新增表单容器  向后端传，不需要覆盖
const insertForm = reactive({
  roomId: '',
  roomName: '',
  roomOwnerCustomer: '',
  roomPush: 1,
  category1: '',
  category2: '',
  roomOpenStatus: 1,
  roomSpeechStatus: 1,
  roomNotice: '',

})


/**查询功能 */

//分页
const handleSizeChange = (pageSize) => {
  tableData.pageInfo.page = 1
  tableData.pageInfo.pageSize = pageSize
  let params1 = queryForm
  let params2 = tableData.pageInfo
  let allParam = {...params1, ...params2}
  query(allParam)

}
const handleCurrentChange = (page) => {
  tableData.pageInfo.page = page
  let params1 = queryForm
  let params2 = tableData.pageInfo
  let allParam = {...params1, ...params2}
  query(allParam)


}

//查询表单
const queryForm = reactive({
  roomName: '',
  nikeName: '',
  categoryNameLevel1: '',
  categoryNameLevel2: ''
})
//点击查询按钮
const querySubmit = () => {
  //向后端接口发送请求
  query(queryForm)
}
//一级大厅名称
const level1List = reactive({
  level1ListData: {}
})


//定义二级大厅容器 需要覆盖
const level2List = reactive([]);
//当选择了一级大厅
const loadCategory2 = async (pname) => {
  let resp = await myGet("/room/getSubRoomCategory", {parentName: pname})
  if (resp.data.code == 20000) {
    //将数据覆盖到二级查询大厅选项中

    level2List.splice(0, level2List.length, ...resp.data.returnData[0]?.subRoomCategories || []);
    console.log(level2List);
    //console.log(level2List.levle2ListData);

    /**
     *   let selectedLevel1 = resp.data.returnData.find(
     item => item.categoryId === pid
     );

     level2List.levle2ListData = selectedLevel1.subRoomCategories;
     */

  }
}


//当一级菜单发生改变的时候就重新加载二级大厅


//表单标识
const queryFormRef = ref()
//点击重置表单
const resetQueryForm = () => {
  queryFormRef.value.resetFields()
  //重新查询
  //刷新table
  query({})
  //二级大厅清除
  level2List.length = 0
}
//公告对话框
const noticeDialog = ref(false)
const notice = ref('')
//当点击的时候打开一个提示框，弹出公告
const showNotice = (currentNotice) => {
  noticeDialog.value = true
  notice.value = currentNotice

}


//开播的状态控制

//禁言的状态控制


//表格容器
const tableData = reactive({
  roomInfoList: [],
  pageInfo: {
    page: 1,
    pageSize: 2,
    total: 2
  }
})
//封装query
const query = async (params) => {
  let resp = await myGet("/room/listRoomInfo", params)
  if (resp.data.code == 20000) {
    tableData.roomInfoList = resp.data.returnData
    tableData.pageInfo = resp.data.pageInfo
  } else if (resp.data.code == 20001) {
    tableData.roomInfoList = []
    tableData.pageInfo = {page: 1, pageSize: 3, total: 0}
  }
}

//查询一级大厅
const listRoomCategoryLevel1 = async () => {
  let resp = await myGet("/room/listRoomCategoryLevel1", {})
  level1List.level1ListData = resp.data.returnData
}

//挂载的时候加载
onMounted(() => {
  query({})
  listRoomCategoryLevel1()
})
</script>

<style scoped>
.notice-content.ellipsis {
  height: 30px; /* 固定高度 */
  line-height: 30px; /* 垂直居中 */
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
  max-width: 100%; /* 限制最大宽度为列宽 */
}


</style>
<style>
.dialog-bottom {
  /* 取消默认居中，改为距离顶部70%（值越大越靠下） */
  margin-top: 20% !important;
}


.custom-center-dialog {
  /* 取消默认居中，改为距离顶部70%（值越大越靠下） */
  margin-top: 20% !important;
}
</style>