<template>

  <el-row>
    <el-col :span="4">

    </el-col>
    <el-col :span="12">
      <span class="sysName">xxxx管理系统</span>
    </el-col>
    <el-col :span="8">
      <el-button-group class="ml-4">
        <el-button type="info" plain :icon="UserFilled">{{ username }}</el-button>
        <el-button type="info" plain :icon="PieChart"/>
        <el-button type="info" plain :icon="SwitchButton" @click="logout"/>
      </el-button-group>
    </el-col>
  </el-row>

</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  Share,
  UserFilled,
  PieChart,
  SwitchButton
} from '@element-plus/icons-vue'
import router from '@/router'
import {myGet, myPost} from '@/myaxios'
import {ElMessage, ElMessageBox} from 'element-plus'

const username = ref('jack')
const logout = () => {
  myGet("/logout", {})
      .then(resp => {
        ElMessage.success(resp.data.msg)
        router.push('/login')
      })

}

onMounted(() => {
  let loginUserStr = sessionStorage.getItem("loginUser")
  if (loginUserStr) {
    let loginUser = JSON.parse(loginUserStr)
    //通过sessionStorage 给页面中显示登录用户的位置赋值
    username.value = loginUser.username

  }
})


</script>

<style scoped>
.sysName {
  font-size: 30px;
  color: rgb(53, 54, 54);
}
</style>