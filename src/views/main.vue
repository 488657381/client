<template>
  <el-container class="mainPanel">
    <el-header>
      <TOP></TOP>
    </el-header>
    <el-container>
      <el-aside style="box-shadow: var(--el-box-shadow-dark);background-color: #FAFAFA;" width="240px">
        <LEFT></LEFT>
      </el-aside>
      <el-main>
        <!-- 配合子路由做局部替换  -->
        <router-view></router-view>

      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {Check, Delete, Edit, Message, Search, Star, Share} from '@element-plus/icons-vue'
import TOP from '@/components/top.vue'
import LEFT from '@/components/left.vue'


</script>

<style scoped>
.mainPanel {
  width: 100vw;
  height: 100vh;
  background-color: rgb(255, 255, 255);
}

.el-header {
  background-image: url(../assets/logo2.png);
  height: 96px;
  line-height: 96px;
  text-align: center;
}

</style>