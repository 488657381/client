<template>
  <el-row class="header-row" justify="space-between" align="middle">
    <el-col :span="4">
      <!-- 左侧留空或可添加logo -->
    </el-col>
    <el-col :span="12" class="text-center">
      <span class="sysName">
        <span class="sysName-main">不知所云</span>
        <span class="sysName-sub">管理系统</span>
        <span class="sysName-badge">Pro</span>
      </span>
    </el-col>
    <el-col :span="8" class="text-right">
      <el-button-group class="user-actions">
        <el-button type="primary" plain :icon="UserFilled" class="user-btn">
          <span class="username">{{ username }}</span>
        </el-button>
        <el-button type="primary" plain :icon="PieChart" @click="tomain" class="action-btn"/>
        <el-button type="primary" plain :icon="SwitchButton" @click="logout" class="action-btn"/>
      </el-button-group>
    </el-col>
  </el-row>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {
  UserFilled,
  PieChart,
  SwitchButton
} from '@element-plus/icons-vue'
import router from '@/router'
import {myGet} from '@/myaxios'
import {ElMessage} from 'element-plus'

const username = ref('jack')
const logout = () => {
  myGet("/logout", {})
      .then(resp => {
        ElMessage.success(resp.data.msg)
        router.push('/login')
      })
}
const tomain =async () => {
  await router.push('/main')
}

onMounted(() => {
  const loginUserStr = sessionStorage.getItem("loginUser")
  if (loginUserStr) {
    const loginUser = JSON.parse(loginUserStr)
    username.value = loginUser.username
  }
})
</script>

<style scoped>
.header-row {
  padding: 0 20px;
  height: 60px;
  background: linear-gradient(135deg, #3a4046 0%, #545c64 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.sysName {
  display: inline-flex;
  align-items: baseline;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  cursor: default;
}

.sysName-main {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1px;
  background: linear-gradient(to right, #b3876a, #d8b38c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: all 0.3s ease;
}

.sysName-sub {
  font-size: 18px;
  margin-left: 8px;
  color: rgba(255, 255, 255, 0.8);
}

.sysName-badge {
  font-size: 12px;
  background: linear-gradient(135deg, #ff8a00, #ff4d00);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  position: relative;
  top: -5px;
  font-weight: bold;
}

.user-actions {
  margin-left: auto;
}

.user-btn {
  border: none;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.action-btn {
  border: none;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.username {
  margin-left: 5px;
  font-weight: 500;
}

.el-button:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sysName-main {
    font-size: 20px;
  }

  .sysName-sub {
    font-size: 14px;
  }

  .sysName-badge {
    font-size: 10px;
    padding: 1px 4px;
  }

  .user-actions .el-button {
    padding: 8px 10px;
  }
}
</style>