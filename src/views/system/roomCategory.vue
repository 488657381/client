<template>
  <el-form ref="queryFormRef" :inline="true" :model="queryForm" class="demo-form-inline">
    <el-form-item label="类别名称" prop="categoryName">
      <el-input v-model="queryForm.categoryName" placeholder="请输入" clearable/>
    </el-form-item>
    <el-form-item label="上级编号" prop="parentId">
      <el-select style="width: 180px;"
                 v-model="queryForm.parentId"
                 placeholder="请选择"
                 clearable
      >
        <el-option label="无" :value="0"/>
        <el-option v-for="parent in parentList.parentListData" :label="parent.categoryName" :value="parent.categoryId"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button type="primary" @click="resetSubmit">重置</el-button>
      <el-button type="primary" @click="openInsertDialog">新增</el-button>
      <el-button type="danger" @click="opendeleteDialog">删除</el-button>
    </el-form-item>
  </el-form>
  <!-- 页面展示表格 -->
  <el-table height="300px" :data="tableData.roomCategoryList" ref="tableRef" style="width: 100%">
    <el-table-column type="selection" width="80" align="center"/>
    <el-table-column prop="categoryId" label="类别编号" width="150" align="center"/>
    <el-table-column prop="categoryName" label="类别名称" width="180" align="center"/>
    <el-table-column prop="parentId" label="上级编号" width="180" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.parentId==0"
                type="success"

        >{{ scope.row.parentId }}
        </el-tag>
        <el-tag v-else
                type="warning"

        >{{ scope.row.parentId }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="pName" label="上级名称" width="180" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.parentId==0"
                type="success"

        >{{ scope.row.pName }}
        </el-tag>
        <el-tag v-else
                type="warning"

        >{{ scope.row.pName }}
        </el-tag>
      </template>

    </el-table-column>
    <el-table-column label="操作" width="200" align="center">
      <template #default="scope">
        <el-button @click="openUpdateDialog(scope.row)" type="primary">修改</el-button>
      </template>

    </el-table-column>

  </el-table>
  <!-- 分页组件 -->
  <div style="margin-top: 5px">
    <el-pagination
        v-model:current-page="tableData.pageInfo.page"
        v-model:page-size="tableData.pageInfo.pageSize"
        :page-sizes="[5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pageInfo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

  <!-- 新增对话框 ，里面放新增的表单-->
  <el-dialog
      v-model="insertDialogVisible"
      title="添加大厅"
      width="500"
  >
    <el-form ref="insertFormRef" :inline="true" :model="insertForm" class="demo-form-inline">
      <el-form-item label="类别编号" prop="categoryId">
        <el-input v-model="insertForm.categoryId" placeholder="请输入" clearable style="width:280px ;"
                  @blur="insertChcek"/>
      </el-form-item>
      <el-form-item label="类别名称" prop="categoryName">
        <el-input v-model="insertForm.categoryName" placeholder="请输入" clearable style="width:280px ;"/>
      </el-form-item>
      <el-form-item label="上级编号" prop="parentId">
        <el-select style="width:280px ;"
                   v-model="insertForm.parentId"
                   placeholder="请选择"
                   clearable
        >
          <el-option label="无" :value="0"/>
          <el-option v-for="parent in parentList.parentListData" :label="parent.categoryName"
                     :value="parent.categoryId"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="insertDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="insertSubmit">新增</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 修改对话框 ，里面放修改的表单-->
  <el-dialog
      v-model="updateDialogVisible"
      title="修改大厅"
      width="500"
  >
    <el-form ref="updateFormRef" :inline="true" :model="updateForm.updateFormData" class="demo-form-inline">
      <el-form-item label="类别编号" prop="categoryId">
        <el-input disabled v-model="updateForm.updateFormData.categoryId" placeholder="请输入" clearable
                  style="width:280px ;" @blur="insertChcek"/>
      </el-form-item>
      <el-form-item label="类别名称" prop="categoryName">
        <el-input v-model="updateForm.updateFormData.categoryName" placeholder="请输入" clearable
                  style="width:280px ;"/>
      </el-form-item>
      <el-form-item label="上级编号" prop="parentId">
        <el-select style="width:280px ;"
                   v-model="updateForm.updateFormData.parentId"
                   placeholder="请选择"
                   clearable
        >
          <el-option label="无" :value="0"/>
          <el-option v-for="parent in parentList.parentListData" :label="parent.categoryName"
                     :value="parent.categoryId"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateSubmit">修改</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 删除消息弹出框 -->

</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'

import {Check, Delete, Edit, Message, Search, Star, Share} from '@element-plus/icons-vue'
import {myGet, myPost} from '../../myaxios'
import {ElMessage, ElMessageBox} from 'element-plus'


/**删除功能 */
const opendeleteDialog = () => {
  //console.log(tableRef.value.getSelectionRows().categoryId);
  let selectedRows = tableRef.value.getSelectionRows()
  console.log(selectedRows);
  //存选中的分类id
  let categoryIdList = []
  //存选中的大厅名称
  let showMsg = []

  selectedRows.forEach(ithem => {
    categoryIdList.push(ithem.categoryId)
    showMsg.push(ithem.categoryId + '--' + ithem.categoryName)
  });

  //只有选中了才开框
  if (categoryIdList.length > 0) {
    ElMessageBox.confirm(
        `<h3>确定要删除以下大厅信息吗？</h3>
    [${showMsg}]`

        ,
        '警告',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
          //支持html标签自定义文本内容
          dangerouslyUseHTMLString: true,
        }
    )
        .then(async () => {
          //点击删除，向接口发请求
          //先将数组转化为11，22，23，这类型的字符串
          let categoryIdListStr = categoryIdList.join(",")
          //console.log(categoryIdListStr);

          let resp = await myPost("/room/deleteRoomCategory", {categoryIdListStr: categoryIdListStr})
          if (resp.data.code == 20010) {
            //如果成功弹出提示
            ElMessage({
              type: 'success',
              message: resp.data.msg,
            })
            //同时刷新页面
            //将查询条件和页码都发送
            //先
            let params1 = tableData.pageInfo
            let params2 = queryForm
            let allParam = {...params1, ...params2}
            query(allParam)
            //如果删除了一级大厅，还需要刷新查询列表
            listRoomCategoryLevel1()
            console.log(tableData.pageInfo);


          } else if (resp.data.code == 20011) {
            //失败也提示
            ElMessage({
              type: 'danger',
              message: resp.data.msg,
            })
          }

        })
        .catch(() => {
          /* ElMessage({
            type: 'info',
            message: '按取消按钮的提示',
          }) */
          //点击取消什么也不做
        })

  } else {
    ElMessage({
      type: 'warning',
      message: "请先选择",
    })
  }


}


//table标识
const tableRef = ref()


/**修改功能 */
//修改对话框
const updateDialogVisible = ref(false)

//打开修改对话框
const openUpdateDialog = (currentRow) => {
  updateDialogVisible.value = true
  //将当前行的数据渲染到表单
  //先将当前行数据深拷贝，防止相同地址相互影响

  let currentRowData = JSON.parse(JSON.stringify(currentRow))

  updateForm.updateFormData = currentRowData
}

//修改表单 需要前端覆盖
const updateForm = reactive({
  updateFormData: {
    categoryId: '',
    categoryName: '',
    parentId: ''
  }

})

//提交修改的时候想接口发请求
const updateSubmit = async () => {
  //将数据传给后端
  let resp = await myPost("room/updateRoomCategory", updateForm.updateFormData)
  if (resp.data.code == 20010) {
    //修改成功，提示操作成功并且关框，同时刷新tale，
    ElMessage.success(resp.data.msg)
    updateDialogVisible.value = false
    //刷新表单
    //将查询条件和页码都发送
    let params1 = tableData.pageInfo
    let params2 = queryForm
    let allParam = {...params1, ...params2}
    query(allParam)
    //如果修改了一级大厅，还需要刷新查询列表
    listRoomCategoryLevel1()
  } else if (resp.data.code == 20011) {
    ElMessage.waring(resp.data.msg)
  }

}


/**新增功能 */
//对话框状态
const insertDialogVisible = ref(false)
//新增表单标识
const insertFormRef = ref()
//表单数据，不需要后端覆盖
const insertForm = reactive({
  categoryId: '',
  categoryName: '',
  parentId: ''
})

//点击新增按钮开框
const openInsertDialog = () => {
  insertDialogVisible.value = true
}

//检查主键是否重复防止500
const insertChcek = async () => {
  //像后端发送请求,,将输入的id发给后端
  let categoryId = insertForm.categoryId
  let resp = await myGet("/room/insertCheck", {categoryId: categoryId})
  if (resp.data.code == 20012) {
    //提示
    ElMessage.warning(resp.data.msg)
  }
}

//点击新增按钮后，像后端新增的接口发请求
const insertSubmit = async () => {
  let resp = await myPost("/room/insertRoomCategory", insertForm)
  if (resp.data.code == 20010) {
    //新增成功，提示操作成功并且关框，同时刷新tale，清除表单数据
    ElMessage.success(resp.data.msg)
    insertDialogVisible.value = false
    insertFormRef.value.resetFields()
    //刷新表单
    //将查询条件和页码都发送
    let params1 = tableData.pageInfo
    let params2 = queryForm
    let allParam = {...params1, ...params2}
    query(allParam)
    //如果新增了一级大厅，还需要刷新查询列表
    listRoomCategoryLevel1()
  } else if (resp.data.code == 20011) {
    //操作失败
    ElMessage.warning(resp.data.msg)
  } else if (resp.data.code == 20012) {
    //操作失败,编号重复，提醒
    ElMessage.warning(resp.data.msg)
  }

}


/**查询功能 */
const tableData = reactive({
  roomCategoryList: [],
  pageInfo: {
    page: 1,
    pageSize: 20,
    total: 320
  }
})
//用户选择的记录数改变
const handleSizeChange = (pageSize) => {
  //将页码设置为1
  tableData.pageInfo.page = 1
  tableData.pageInfo.pageSize = pageSize
  //发送请求
  //将查询条件和页码都发送
  let params1 = tableData.pageInfo
  let params2 = queryForm
  let allParam = {...params1, ...params2}
  query(allParam)
}
//用户翻页
const handleCurrentChange = (page) => {
  tableData.pageInfo.page = page
  //发送请求
  //发送请求
  //将查询条件和页码都发送
  let params1 = tableData.pageInfo
  let params2 = queryForm
  let allParam = {...params1, ...params2}
  query(allParam)

}

//查询表单
const queryForm = reactive({
  categoryName: '',
  parentId: ''
})
//展示上级分类
const parentList = reactive({
  parentListData: []
})

//点击查询的按钮发送请求
const querySubmit = () => {
  query(queryForm)
}
//表单ref
const queryFormRef = ref()
//点击重置按钮
const resetSubmit = () => {
  queryFormRef.value.resetFields()
  //同时刷新table
  query({})

}


//封装query
const query = async (params) => {
  let resp = await myGet("/room/listRoomCategory", params);
  // 先判断 resp 和 resp.data 是否存在，避免后续报错
  if (!resp || !resp.data) {
    console.error("接口响应异常，无有效 data", resp);
    return;
  }
  if (resp.data.code === 20000) {
    tableData.roomCategoryList = resp.data.returnData;
    tableData.pageInfo = resp.data.pageInfo;
  } else if (resp.data.code === 20001) {
    tableData.roomCategoryList = [];
    tableData.pageInfo = {page: 1, pageSize: 3, total: 0}
  } else {
    // 其他 code 情况也可补充处理，比如提示
    console.warn("接口返回未知 code", resp.data.code);
  }
};

const listRoomCategoryLevel1 = async () => {
  let resp = await myGet("/room/listRoomCategoryLevel1", {})
  parentList.parentListData = resp.data.returnData
}
//加载DOM树完毕挂载数据
onMounted(() => {
  query({})
  //加载一级分类列表
  listRoomCategoryLevel1()

})

</script>


<style scoped>

</style>