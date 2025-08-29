<template>

  <el-menu
      active-text-color="#606266"
      background-color="#FAFAFA"
      text-color="#909399"
      router
      unique-opened
  ><!--unique-opened 只展开一个功能-->

    <el-sub-menu v-for="menu in menuList" :index="menu.mid+''">
      <template #title>
        <el-icon>
          <component :is="menu.glyphicon"></component>
        </el-icon>
        <span>{{ menu.menuname }}</span>
      </template>
      <el-menu-item v-for="subm in menu.subMenu" :index="subm.url">
        <el-icon>
          <component :is="subm.glyphicon"></component>
        </el-icon>
        {{ subm.menuname }}
      </el-menu-item>


    </el-sub-menu>

  </el-menu>

</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {Check, Delete, Edit, Message, Search, Star, Share} from '@element-plus/icons-vue'

//菜单列表
const menuList = ref([])


onMounted(() => {
  let loginUserStr = sessionStorage.getItem("loginUser")
  if (loginUserStr) {
    let loginUser = JSON.parse(loginUserStr)
    //通过sessionStorage 给页面中菜单数据赋值
    menuList.value = loginUser.loginUserMenus

  }
})


</script>

<style scoped>

</style>