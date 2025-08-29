<template>

  <el-form ref="queryFormRef" :model="queryForm" :inline="true">
    <el-form-item label="菜单名称" prop="menuname">
      <el-input v-model="queryForm.menuname" style="width: 240px;" placeholder="Approved by" clearable/>
    </el-form-item>
    <el-form-item label="上级菜单" prop="pid">
      <el-select v-model="queryForm.pid" placeholder="请选择" style="width: 240px;" clearable>
        <!-- 1.写死数据 -->
        <!-- 2.动态加载  配一个菜单数据接口 -->
        <el-option label="无" value="0"/>
        <el-option v-for="option in menuList" :label="option.menuname" :value="option.mid"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="queryReset">重置</el-button>
      <el-button type="primary" @click="insertDialogVisible = true">添加</el-button>
      <el-button type="danger" @click="openDeleteDialog">删除</el-button>
    </el-form-item>
  </el-form>


  <el-table ref="tableRef" height="530" :data="tableData.dataList" style="width: 100%">
    <el-table-column type="selection" width="55"/>
    <el-table-column prop="mid" label="菜单编号" width="80"/>
    <el-table-column prop="menuname" label="菜单名称"/>
    <el-table-column prop="pid" label="上级编号">
      <!--  通过自定义列信息 美化页面  scope.row 当前行的所有数据   -->
      <template #default="scope">
        <el-tag v-if="scope.row.pid == 0" type="success">
          {{ scope.row.pid }}
        </el-tag>
        <el-tag v-else type="warning">
          {{ scope.row.pid }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="pname" label="上级名称">
      <template #default="scope">
        <el-tag v-if="scope.row.pid == 0" type="success">
          {{ scope.row.pname }}
        </el-tag>
        <el-tag v-else type="warning">
          {{ scope.row.pname }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="url" label="访问地址"/>
    <el-table-column prop="glyphicon" label="图标">
      <template #default="scope">
        <el-tag type="primary">
          <el-icon>
            <component :is="scope.row.glyphicon"></component>
          </el-icon>

        </el-tag>
        <el-tag type="primary">
          {{ scope.row.glyphicon }}

        </el-tag>

      </template>


    </el-table-column>
    <!-- table多加一列 操作列 -->
    <el-table-column prop="menuname" label="操作">
      <template #default="scope">
        <el-button type="primary" @click="openUpdateDialog(scope.row)">修改</el-button>
      </template>
    </el-table-column>

  </el-table>

  <el-pagination v-model:current-page="tableData.pageInfo.page" v-model:page-size="tableData.pageInfo.pageSize"
                 :total="tableData.pageInfo.total" :page-sizes="[10, 20, 30]"
                 layout="total, sizes, prev, pager, next, jumper"
                 @current-change="handlePageChange" @size-change="handleSizeChange"/>


  <el-dialog v-model="insertDialogVisible" title="添加" width="500">
    <!--    没有使用elementPlus表单校验
            <el-form :model="insertForm" label-width="auto" style="max-width: 600px">
            <el-form-item label="菜单编号">
                <el-input v-model="insertForm.mid" @blur="insertCheck"/>
            </el-form-item>
            <el-form-item label="菜单名称">
                <el-input v-model="insertForm.menuname" />
            </el-form-item>
            <el-form-item label="上级编号">
                <el-input v-model="insertForm.pid" />
            </el-form-item>
            <el-form-item label="访问地址">
                <el-input v-model="insertForm.url" />
            </el-form-item>
            <el-form-item label="菜单图标">
                <el-input v-model="insertForm.glyphicon" />
            </el-form-item>
    </el-form> -->
    <el-form ref="insertFromRef" status-icon :rules="rules" :model="insertForm" label-width="auto"
             style="max-width: 600px">
      <el-form-item label="菜单编号" prop="mid">
        <el-input v-model="insertForm.mid"/>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuname">
        <el-input v-model="insertForm.menuname"/>
      </el-form-item>
      <el-form-item label="上级编号" prop="pid">
        <!-- <el-input v-model="insertForm.pid" /> -->
        <el-select v-model="insertForm.pid" placeholder="请选择" style="width: 100%;">
          <el-option label="无" value="0"/>
          <el-option v-for="option in menuList" :label="option.menuname" :value="option.mid"/>
        </el-select>
      </el-form-item>
      <el-form-item label="访问地址" prop="url">
        <el-input v-model="insertForm.url"/>
      </el-form-item>
      <el-form-item label="菜单图标" prop="glyphicon">
        <!-- <el-input v-model="insertForm.glyphicon" /> -->
        <el-select v-model="insertForm.glyphicon" placeholder="请选择" style="width: 100%;">
          <el-option value="User">
            <el-icon>
              <User/>
            </el-icon>
            User
          </el-option>
          <el-option value="More">
            <el-icon>
              <More/>
            </el-icon>
            More
          </el-option>
          <el-option value="ZoomIn">
            <el-icon>
              <ZoomIn/>
            </el-icon>
            ZoomIn
          </el-option>
          <el-option value="TurnOff">
            <el-icon>
              <TurnOff/>
            </el-icon>
            TurnOff
          </el-option>

        </el-select>

      </el-form-item>
    </el-form>


    <template #footer>
      <div class="dialog-footer">
        <el-button @click="insertDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="insertSubmit">保存</el-button>
      </div>
    </template>
  </el-dialog>


  <!-- 修改对话框 -->
  <el-dialog v-model="updateDialogVisible" title="修改" width="500">

    <el-form :model="updateForm.updateData" label-width="auto"
             style="max-width: 600px">
      <el-form-item label="菜单编号" prop="mid">
        <el-input disabled v-model="updateForm.updateData.mid"/>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuname">
        <el-input v-model="updateForm.updateData.menuname"/>
      </el-form-item>
      <el-form-item label="上级编号" prop="pid">

        <el-select v-model="updateForm.updateData.pid" placeholder="请选择" style="width: 100%;">
          <el-option label="无" :value="0"/>
          <el-option v-for="option in menuList" :label="option.menuname" :value="option.mid"/>
        </el-select>
      </el-form-item>
      <el-form-item label="访问地址" prop="url">
        <el-input v-model="updateForm.updateData.url"/>
      </el-form-item>
      <el-form-item label="菜单图标" prop="glyphicon">

        <el-select v-model="updateForm.updateData.glyphicon" placeholder="请选择" style="width: 100%;">
          <el-option value="User">
            <el-icon>
              <User/>
            </el-icon>
            User
          </el-option>
          <el-option value="More">
            <el-icon>
              <More/>
            </el-icon>
            More
          </el-option>
          <el-option value="ZoomIn">
            <el-icon>
              <ZoomIn/>
            </el-icon>
            ZoomIn
          </el-option>
          <el-option value="TurnOff">
            <el-icon>
              <TurnOff/>
            </el-icon>
            TurnOff
          </el-option>

        </el-select>

      </el-form-item>
    </el-form>


    <template #footer>
      <div class="dialog-footer">
        <el-button @click="updateDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="updateSubmit">保存</el-button>
      </div>
    </template>
  </el-dialog>


</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {Check, Delete, Edit, Message, Search, Star, Share} from '@element-plus/icons-vue'
import {myGet, myPost} from '@/myaxios'
import {ElMessage, ElMessageBox} from 'element-plus'


/**删除功能 */
//table对象
const tableRef = ref()


//删除开框
const openDeleteDialog = () => {
  let currentRows = tableRef.value.getSelectionRows()
  console.log(currentRows);
  if (currentRows.length > 0) {
    //显示信息用的
    let showMsg = []
    //发送mid用的
    let listmid = []
    //从页面table取dao的数据 组织不同的数据集合
    currentRows.forEach(data => {
      showMsg.push(`${data.mid}-${data.menuname}`)
      listmid.push(data.mid)
    })


    //确认框
    ElMessageBox.confirm(
        `<h3 style='margin:5px'>确定要删除以下数据么?</h3>
            [${showMsg}]
            `,
        '警告',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
          //支持html标签自定义文本内容
          dangerouslyUseHTMLString: true,
        }
    )
        .then(() => {
          console.log("发请求删除");
          myPost("/menus/deleteMenu", {listMid: listmid.join(",")})
              .then(resp => {
                if (resp.data.code == 20010) {
                  //显示操作结果
                  ElMessage.success(resp.data.msg)
                  //刷新数据 保留当前页码和查询条件
                  //把改后的page 作为参数 通过请求传走
                  let params1 = tableData.pageInfo;
                  let params2 = queryForm;
                  //json对象组合语法
                  let allParam = {...params1, ...params2}
                  //发送请求
                  myQuery(allParam)
                  queryMenuLevel1()
                  //直接重新查询
                  //myQuery({})
                }
              })
        })
        .catch(() => {
          console.log("啥都不干");
        })
  } else {
    ElMessage.warning("请先选择数据......")
  }


}


/**修改功能 */

//修改提交
const updateSubmit = () => {


  //发请求处理数据
  myPost('/menus/updateMenu', updateForm.updateData)
      .then(resp => {
        console.log(resp.data);
        if (resp.data.code == 20010) {
          //关框
          updateDialogVisible.value = false
          //显示操作结果
          ElMessage.success(resp.data.msg)
          //刷新数据 保留当前页码和查询条件
          //把改后的page 作为参数 通过请求传走
          let params1 = tableData.pageInfo;
          let params2 = queryForm;
          //json对象组合语法
          let allParam = {...params1, ...params2}
          //发送请求
          myQuery(allParam)
          queryMenuLevel1()
          //直接重新查询
          //myQuery({})
        } else if (resp.data.code == 20013) {
          ElMessage.warning(resp.data.msg)
          //刷新数据 保留当前页码和查询条件
          //把改后的page 作为参数 通过请求传走
          let params1 = tableData.pageInfo;
          let params2 = queryForm;
          //json对象组合语法
          let allParam = {...params1, ...params2}
          //发送请求
          myQuery(allParam)
          queryMenuLevel1()

          //重新获取updateform的数据
          myGet("/menus/updateMenuInfo", {mid: updateForm.updateData.mid})
              .then(resp => {
                console.log(resp.data.returnData);
                //把后端读到的完整数据 加载到updateForm上
                updateForm.updateData = resp.data.returnData
              })

        }
      })

}

//修改开框
const openUpdateDialog = (currentRow) => {
  console.log(currentRow);
  //加载修改数据
  myGet("/menus/updateMenuInfo", {mid: currentRow.mid})
      .then(resp => {
        console.log(resp.data.returnData);
        //把后端读到的完整数据 加载到updateForm上
        updateForm.updateData = resp.data.returnData
      })
  //打开弹出框
  updateDialogVisible.value = true
}
//对话框显示/隐藏 bol值
const updateDialogVisible = ref(false)
//修改表单数据
const updateForm = reactive({
  updateData: {
    mid: '',
    menuname: '',
    pid: '',
    url: '',
    glyphicon: '',
    version: ''
  }
})


/**添加功能 */
//添加对话框 显示/隐藏
const insertDialogVisible = ref(false)

//添加表单对象
const insertForm = reactive({
  mid: '',
  menuname: '',
  pid: '',
  url: '',
  glyphicon: ''
})

/**没有使用elementPlus表单校验 */
// //添加数据校验 mid字段
// const insertCheck = ()=>{
//     myGet('/menus/insertCheck',{mid:insertForm.mid})
//     .then(resp=>{
//         if(resp.data.code == 20012){
//             ElMessage.warning('菜单编号重复  ' + resp.data.msg)
//         }
//     })
// }

// //添加提交
// const insertSubmit = ()=>{

//     let params = insertForm
//     //发请求处理数据
//     myPost('/menus/insertMenu',params)
//     .then(resp=>{
//         console.log(resp.data);
//         if(resp.data.code == 20010){
//             //关框
//             insertDialogVisible.value = false

//             //显示操作结果
//             ElMessage.success(resp.data.msg)
//             //刷新数据 保留当前页码和查询条件
//             //把改后的page 作为参数 通过请求传走
//             let params1 = tableData.pageInfo;
//             let params2 = queryForm;
//             //json对象组合语法
//             let allParam = {...params1,...params2}

//             //发送请求
//             myQuery(allParam)
//             //直接重新查询
//             //myQuery({})
//         }else if(resp.data.code == 20012){
//             ElMessage.warning('菜单编号重复  ' + resp.data.msg)
//         }
//     })

// }

//输入框的值  用于输出错误信息
const validateMid = (rule, value, callback) => {
  myGet('/menus/insertCheck', {mid: value})
      .then(resp => {
        if (resp.data.code == 20012) {
          callback(new Error(resp.data.msg))
        } else if (resp.data.code == 20000) {
          callback()
        }
      })
}
//form校验规则 使用自定义校验
const rules = reactive({
  mid: [{validator: validateMid, trigger: 'blur'}],
})

//表单统一校验 如果有红框 不让提交
//添加表单对象
const insertFromRef = ref()

const insertSubmit = () => {
  insertFromRef.value.validate((valid, fields) => {
    if (valid) {
      console.log("提交表单数据", insertForm);
      //let params = insertForm
      //发请求处理数据
      myPost('/menus/insertMenu', insertForm)
          .then(resp => {
            console.log(resp.data);
            if (resp.data.code == 20010) {
              //关框
              insertDialogVisible.value = false

              //显示操作结果
              ElMessage.success(resp.data.msg)
              //刷新数据 保留当前页码和查询条件
              //把改后的page 作为参数 通过请求传走
              let params1 = tableData.pageInfo;
              let params2 = queryForm;
              //json对象组合语法
              let allParam = {...params1, ...params2}

              //发送请求
              myQuery(allParam)
              queryMenuLevel1()
              //直接重新查询
              //myQuery({})
              //清空表单的数据
              insertFromRef.value.resetFields()
            }
          })

    }
  })
}


/**查询功能 */
//如果有后端数据 需要覆盖 为了保持响应时对象 需要这样建立
//table数据     dataList 
//页码信息数据   pageInfo
const tableData = reactive({
  dataList: [],
  pageInfo: {
    page: 4,
    pageSize: 20,
    total: 78
  }
})
//查询表单
const queryForm = reactive({
  menuname: '',
  pid: ''
})

//查询表单对象
const queryFormRef = ref()

//查询表单 下拉列表数据
const menuList = ref([])


//提交查询
const querySubmit = () => {
  let params = queryForm;
  //发送请求
  myQuery(params)

}
//重置查询
const queryReset = () => {
  queryFormRef.value.resetFields()
  //重新查询数据
  myQuery({})
}

//page改变
const handlePageChange = (currentPage) => {


  console.log(currentPage);
  //修改page页面参数
  tableData.pageInfo.page = currentPage;
  //把改后的page 作为参数 通过请求传走
  let params1 = tableData.pageInfo;
  let params2 = queryForm;
  //json对象组合语法
  let allParam = {...params1, ...params2}

  //发送请求
  myQuery(allParam)
}
//pageSiez改变
const handleSizeChange = (currentPageSize) => {
  //修改page页面参数
  tableData.pageInfo.page = 1;
  tableData.pageInfo.pageSize = currentPageSize;

  //把改后的page 作为参数 通过请求传走
  let params1 = tableData.pageInfo;
  let params2 = queryForm;
  //json对象组合语法
  let allParam = {...params1, ...params2}
  //发送请求
  myQuery(allParam)

}

//查询公共方法
const myQuery = (params) => {
  myGet("/menus/listMenu", params)
      .then(resp => {
        //多做日志输出     定位错误
        //打断点 分析错误  debugger
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
//查询一级菜单下拉列表
const queryMenuLevel1 = () => {
  myGet("/menus/listMenuLevel1", {})
      .then(resp => {
        menuList.value = resp.data.returnData
      })
}


onMounted(() => {
  myQuery({})
  queryMenuLevel1()


})
</script>

<style scoped></style>