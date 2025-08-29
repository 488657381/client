<template>
  <el-menu
      :collapse="isCollapse"
      active-text-color="#ffd04b"
      background-color="#545c64"
      text-color="#fff"
      router
      unique-opened
      :collapse-transition="false"
  >
    <el-sub-menu
        v-for="menu in menuList"
        :index="menu.mid+''"
        :key="menu.mid"
    >
      <template #title>
        <el-icon>
          <component :is="menu.glyphicon" />
        </el-icon>
        <span>{{ menu.menuname }}</span>
      </template>
      <el-menu-item
          v-for="subm in menu.subMenu"
          :index="subm.url"
          :key="subm.mid"
      >
        <el-icon>
          <component :is="subm.glyphicon" />
        </el-icon>
        <span>{{ subm.menuname }}</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Check, Delete, Edit, Message,
  Search, Star, Share
} from '@element-plus/icons-vue'

defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const menuList = ref([])

onMounted(() => {
  const loginUserStr = sessionStorage.getItem("loginUser")
  if (loginUserStr) {
    const loginUser = JSON.parse(loginUserStr)
    menuList.value = loginUser.loginUserMenus || []
  }
})
</script>

<style scoped>
.el-menu {
  border-right: none;
  height: 100%;
}

.el-menu:not(.el-menu--collapse) {
  width: 100%;
}

.el-menu-item, .el-sub-menu__title {
  transition: all 0.3s;
}

.el-menu-item:hover, .el-sub-menu__title:hover {
  background-color: #434a50 !important;
}

.el-menu-item.is-active {
  background-color: #0d47a1 !important;
}
</style>