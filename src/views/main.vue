<template>
  <el-container class="mainPanel" >
    <el-header class="header-container" align="center">
      <div class="header-content">
        <TOP/>

      </div>
    </el-header>
    <el-container class="content-container">
      <el-aside
          :style="{
          boxShadow: 'var(--el-box-shadow-dark)',
          backgroundColor: '#545c64',
          transition: 'width 0.3s',
          position: 'relative'
        }"
          :width="isCollapse ? '64px' : '240px'"
      >
        <LEFT :isCollapse="isCollapse"/>
        <div class="collapse-btn" @click="toggleCollapse">
          <el-icon :size="20" color="#fff">
            <component :is="isCollapse ? ArrowRight : ArrowLeft"/>
          </el-icon>
        </div>
      </el-aside>
      <el-main class="main-content">
        <el-card class="main-card">
          <div class="card-content">
            <router-view/>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {ref} from 'vue'
import {ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
import TOP from '@/components/top.vue'
import LEFT from '@/components/left.vue'

const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.mainPanel {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(@/assets/pic1.png);
  display: flex;
  flex-direction: column;
}

.header-container {
  padding-left: 250px;
  background: linear-gradient(135deg, #545c64 0%, #3a4046 190%);
  height: 96px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}

.header-content {
  width: 150vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.content-container {
  flex: 1;
  overflow: hidden;
}

.main-content {
  padding: 16px;
  display: flex;

}

.main-card {
  border-radius: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  overflow: hidden;
}

.main-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

/* 侧边栏和折叠按钮样式保持不变 */
.collapse-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #545c64;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
}

.collapse-btn:hover {
  background-color: #434a50;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    padding: 8px;
  }

  .card-content {
    padding: 15px;
  }

  .header-container {
    height: 80px;
  }
}
</style>