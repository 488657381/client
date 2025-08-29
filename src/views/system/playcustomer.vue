<template>
  <el-form ref="queryFormRef" :model="queryForm" :inline="true">
    <el-form-item label="客户名称" prop="nickname">
      <el-input v-model="queryForm.nickname" style="width: 240px;" placeholder="nickname" clearable/>
    </el-form-item>
    <el-form-item label="VIP等级" prop="vipGrade">
      <el-input v-model="queryForm.vipGrade" style="width: 240px;" placeholder="vipGrade" clearable/>
    </el-form-item>
    <el-form-item label="贵族等级" prop="loadGrade">
      <el-input v-model="queryForm.loadGrade" style="width: 240px;" placeholder="loadGrade" clearable/>
    </el-form-item>
    <el-form-item label="客户类型" prop="godStatus">
      <el-select v-model="queryForm.godStatus" placeholder="请选择客户类型" style="width: 240px;" clearable>
        <el-option v-for="option in userTypeOptions" :key="option.value" :label="option.label" :value="option.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="封停状态" prop="lockoutStatus">
      <el-select v-model="queryForm.lockoutStatus" placeholder="请选择封停状态" style="width: 240px;" clearable>
        <el-option label="正常" value="1"/>
        <el-option label="已封停" value="0"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="querySubmit">查询</el-button>
      <el-button @click="queryReset">重置</el-button>
      <el-button type="primary" @click="insertDialogVisible = true">添加</el-button>
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


  <el-table ref="tableRef" height="530" :data="tableData.dataList" style="width: 100%">
    <el-table-column prop="uid" label="用户编号" width="100"/>
    <el-table-column prop="nickname" label="用户名称" width="100"/>
    <el-table-column prop="vipGrade" label="VIP级别" width="100"/>
    <el-table-column prop="loadGrade" label="贵族等级" width="100"/>
    <el-table-column prop="godStatus" label="客户类型" width="100">
      <template #default="scope">
        <el-tag v-if="scope.row.godStatus == 0" type="info">
          普通用户
        </el-tag>
        <el-tag v-else type="warning">
          大神用户
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="ipAddress" label="IP所在地" width="100"/>
    <el-table-column prop="hobbyGame" label="爱玩游戏" width="100"/>
    <el-table-column prop="hobbyMusic" label="喜欢音乐" width="100"/>
    <el-table-column fixed="right" label="操作" width="180">
      <template #default="scope">
        <el-button type="primary" @click="openUpdate(scope.row)">修改</el-button>
        <el-button type="primary" @click="openDelete(scope.row.uid)">删除</el-button>
      </template>

    </el-table-column>
    <el-table-column prop="lockoutStatus" label="封禁状态" width="100">
      <!-- <template #default="scope">
              <el-tag v-if="scope.row.lockoutStatus == 0" type="info">
                  封停
              </el-tag>
              <el-tag v-else type="warning">
                  正常
              </el-tag>
          </template> -->

      <template #default="scope">
        <el-switch v-model="scope.row.lockoutStatus"
                   inline-prompt active-text="正常"
                   inactive-text="封停"
                   :active-value="'1'"
                   :inactive-value="'0'"
                   style="--el-switch-on-color: #13ce66;
                    --el-switch-off-color: #ff4949"
                   @change="changeLockSwitch(scope.row)"/>
      </template>


    </el-table-column>

    <el-table-column prop="lockoutTime" label="解封时间" width="200"/>
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


  <!--
     el-dialog：自定义弹窗
     v-model="insertDialogVisible":使用布尔值设置自定义弹窗是否开启或者关闭
 -->
  <el-dialog v-model="insertDialogVisible" title="添加" width="500">
    <el-form ref="insertFormRef" :rules="insertRules" status-icon :model="insertForm" label-width="auto"
             style="max-width: 600px">
      <el-form-item label="用户姓名" prop="nickname">
        <el-input v-model="insertForm.nickname"/>
      </el-form-item>
      <el-form-item label="VIP等级" prop="vipGrade">
        <el-input v-model="insertForm.vipGrade"/>
      </el-form-item>
      <el-form-item label="贵族等级" prop="loadGrade">
        <el-input v-model="insertForm.loadGrade"/>
      </el-form-item>
      <el-form-item label="客户类型" prop="godStatus">
        <el-select v-model="insertForm.godStatus" placeholder="请选择客户类型" style="width: 240px;" clearable>
          <el-option v-for="option in userTypeOptions" :key="option.value" :label="option.label" :value="option.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="ip地址" prop="ipAddress">
        <el-input v-model="insertForm.ipAddress"/>
      </el-form-item>
      <el-form-item label="封停状态" prop="lockoutStatus">
        <el-select v-model="insertForm.lockoutStatus" placeholder="请选择封停状态" style="width: 240px;" clearable>
          <el-option label="正常" value="1"/>
          <el-option label="封停" value="0"/>
        </el-select>
      </el-form-item>
      <!-- 添加prop，配合验证规则 -->
      <!-- 正常（value=1）时禁用，封停（value=0）时启用 -->
      <el-form-item label="解封时间" prop="lockoutTime">
        <el-date-picker
            v-model="insertForm.lockoutTime"
            type="datetime"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
            :disabled="insertForm.lockoutStatus == 1"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="insertDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="insertSubmit">保存</el-button>
      </span>
    </template>

  </el-dialog>


  <!-- 修改的弹窗 -->
  <el-drawer title="修改" size="30%" v-model="updateVisable" direction="rtl">
    <el-form :model="editForm.editData" label-width="70"
             style="max-width: 600px">
      <el-form-item label="客户编号">
        <el-input disabled v-model="editForm.editData.uid"/>
      </el-form-item>
      <el-form-item label="客户姓名">
        <el-input v-model="editForm.editData.nickname"/>
      </el-form-item>
      <el-form-item label="VIP等级">
        <el-input v-model="editForm.editData.vipGrade"/>
      </el-form-item>
      <el-form-item label="贵族等级">
        <el-input v-model="editForm.editData.loadGrade"/>
      </el-form-item>
      <el-form-item label="ip地址">
        <el-input v-model="editForm.editData.ipAddress"/>
      </el-form-item>
      <el-form-item label="游戏爱好">
        <el-input v-model="editForm.editData.hobbyGame"/>
      </el-form-item>
      <el-form-item label="音乐爱好">
        <el-input v-model="editForm.editData.hobbyMusic"/>
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


  <!--  用户状态 -->
  <!-- 封停对话框  -->
  <el-dialog v-model="lockoutDialogVisible" title="修改用户状态" width="400" @close="lockoutFormCancel">
    <div v-if="lockoutForm.lockoutStatus == '1'">
      <h3>确认解封[{{ lockoutForm.uid }}]用户?</h3>
    </div>
    <div v-else>
      <el-form-item label="解封时间" prop="lockoutTime">
        <el-date-picker style="width: 100%;" v-model="lockoutForm.lockoutTime" type="datetime" placeholder="解封时间"
                        value-format="YYYY-MM-DD HH:mm:ss"/>

      </el-form-item>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="lockoutDialogVisible = false;">取消</el-button>
        <el-button type="primary" @click="lockoutFormSubmit">
          保存
        </el-button>
      </div>
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


/**封停功能 */
const lockoutDialogVisible = ref(false)
const lockoutForm = reactive({
  uid: '',
  lockoutStatus: '',
  lockoutTime: '',
})
const lockoutFormSubmit = async () => {

  if (lockoutForm.lockoutStatus === '1') {
    lockoutForm.lockoutTime = ''
    await myPost("/webuser/updateWebUserStatus", lockoutForm)
  } else {
    if (lockoutForm.lockoutTime == '' || lockoutForm.lockoutTime == undefined) {
      ElMessage.error('请选择解封时间！');
      return;
    }
    if (new Date(lockoutForm.lockoutTime).getTime() <= new Date().getTime()) {
      ElMessage.error('不能小于当前时间！');
      return;
    }
    await myPost("/webuser/updateWebUserStatus", lockoutForm)
  }
  lockoutDialogVisible.value = false;
}
const lockoutFormCancel = () => {
  let allParam = {...tableData.pageInfo, ...queryForm};
  myQuery(allParam);
}


const changeLockSwitch = (row) => {
  lockoutDialogVisible.value = true;

  lockoutForm.uid = row.uid;
  lockoutForm.lockoutStatus = row.lockoutStatus;
  lockoutForm.lockoutTime = '';
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
        let resp = await myPost("/webuser/deleteWebUser", {uid: uid})
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
  let resp = await myPost("/webuser/updateWebUser", editForm.editData)
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
    nickname: '',
    vipGrade: '',
    uid: '',
    loadGrade: '',
    godStatus: '',
    fansNum: '',
    ipAddress: '',
    hobbyGame: '',
    hobbyMusic: ''
  }
})


/** 添加功能 */
// 添加对话框  显示/隐藏
const insertDialogVisible = ref(false)
// 添加表单对象
const insertForm = reactive({
  nickname: '',
  vipGrade: '',
  loadGrade: '',
  godStatus: '',
  ipAddress: '',
  lockoutStatus: '',
  lockoutTime: ''
})


// 表单同意校验  如果有错误信息，不许提交
// 添加表单方法
const insertFormRef = ref()

const insertSubmit = () => {
  insertFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 1. 关键：先定义 submitData 并组装提交数据
      const submitData = {
        ...insertForm, // 复制表单基础数据
        // 处理数字类型字段（避免后端接收字符串）
        vipGrade: insertForm.vipGrade ? Number(insertForm.vipGrade) : 0,
        loadGrade: insertForm.loadGrade ? Number(insertForm.loadGrade) : 0,
        // 处理解封时间：正常状态设为 null（兼容后端 datetime 类型）
        lockoutTime: insertForm.lockoutStatus === '1' ? null : insertForm.lockoutTime
      };

      // 2. 后续使用 submitData 发起请求（此时变量已定义，不会报错）
      myPost('/webuser/addWebUser', submitData)
          .then(resp => {
            if (resp.data.code === 20010) {
              insertDialogVisible.value = false;
              ElMessage.success(resp.data.msg || '添加客户成功');
              // 刷新表格数据
              const allParam = {...tableData.pageInfo, ...queryForm};
              myQuery(allParam);
              // 重置表单
              insertFormRef.value.resetFields();
            } else {
              ElMessage.warning(resp.data.msg || '添加失败，请重试');
            }
          })
          .catch(error => {
            ElMessage.error('网络错误，添加失败');
            console.error('添加客户报错：', error);
          });
    } else {
      ElMessage.warning('请完善表单必填项');
      console.error('表单校验失败：', fields);
    }
  });
}

//  定义表单验证规则：关键控制封停时lockoutTime必填
const insertRules = reactive({
  nickname: [
    {required: true, message: '请输入用户姓名', trigger: 'blur'},
    {min: 1, max: 20, message: '姓名长度需在1-20个字符之间', trigger: 'blur'}
  ],
  // 客户类型：必填
  godStatus: [
    {required: true, message: '请选择客户类型', trigger: 'change'}
  ],
  lockoutStatus: [
    {required: true, message: '请选择封停状态', trigger: 'change'}
  ],
  lockoutTime: [
    {
      validator: (rule, value, callback) => {
        // 只有当封停状态明确为0（封停）且未选择时间时，才提示错误
        if (insertForm.lockoutStatus === '0') {
          if (!value) {
            callback(new Error('请选择解封时间'));
          } else {
            callback();
          }
        }
        // 正常状态或未选择状态时，不校验
        else {
          callback();
        }
      },
      trigger: ['change', 'blur']
    }
  ]
})


// 监听封停状态变化，重新校验解封时间（确保切换时规则生效）
watch(
    () => insertForm.lockoutStatus,
    () => {
      if (insertFormRef.value) {
        insertFormRef.value.validateField('lockoutTime');  // 切换状态时重新校验解封时间
      }
    }
)


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
  myGet("/webuser/listAllInfo", params)
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
  godStatus: '',
  loadGrade: '',
  lockoutStatus: '',
  nickname: '',
  vipGrade: ''
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


// 客户类型下拉选项
const userTypeOptions = ref([
  {label: '普通用户', value: 0},
  {label: '大神用户', value: 1}
])

onMounted(() => {
  myQuery({})
})
</script>


<style scoped>

</style>