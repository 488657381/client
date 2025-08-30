<template>
  <el-card class="loginPanel" style="max-width: 399px">
    <div class="card-header" style="margin-bottom: 5px">
      <img
          src="../assets/pic3.png"
          alt="卡片头图"
          class="header-image"
          loading="lazy"
      />
    </div>

    <el-form ref="formRef" hide-required-asterisk :rules="rules" :model="loginForm" label-width="60"
             style="max-width: 380px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" :suffix-icon="User"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" show-password v-model="loginForm.password" :suffix-icon="Lock"/>
      </el-form-item>

      <el-form-item>
        <el-button plain color="#626aef" @click="loginSubmit">登录</el-button>
        <el-button plain color="#626aef" @click="loginReset">重置</el-button>
      </el-form-item>
    </el-form>


  </el-card>


  <Vcode :show="isShow" @success="onSuccess" @close="onClose"/>


</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {Check, Delete, Edit, Message, Search, Star, Share, User, Lock} from '@element-plus/icons-vue'
import router from '@/router'
import {ElMessage, ElMessageBox} from 'element-plus'

import {myGet, myPost} from '@/myaxios'


import Vcode from "vue3-puzzle-vcode";

/** 测试验证码... */
//控制验证码弹出框显示.隐藏
const isShow = ref(false);


//关框
const onClose = () => {
  isShow.value = false;
};

//拖动成功
const onSuccess = () => {
  onClose(); // 验证成功，需要手动关闭模态框
  console.log("提交表单数据", loginForm);
  myGet("/login", loginForm)
      .then(resp => {

        console.log(resp.data);

        if (resp.data.code == 10010) {
          ElMessage.success(resp.data.msg)
          //在前端缓存数据
          sessionStorage.setItem("loginUser", JSON.stringify(resp.data.returnData))
          //跳转到主页面
          router.push("/main")
        } else if (resp.data.code == 10011) {
          ElMessage.error(resp.data.msg)
        } else if (resp.data.code == 10012) {
          ElMessage.warning(resp.data.msg)
        } else if (resp.data.code == 10013) {
          ElMessage.info(resp.data.msg)
        }

      })

};


const loginForm = reactive({
  username: '',
  password: ''
})

const formRef = ref()

const loginReset = () => {
  formRef.value.resetFields()
}
const loginSubmit = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      //验证通过开框
      isShow.value = true

    }
  })
}

const rules = reactive({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 4, max: 8, message: '长度4-8位之间', trigger: 'blur'},
  ]
})


/*
 跨域(domain)请求
 当产生了 从一个网站 访问另一个网站数据 会出现跨域请求 CORS 会通知浏览器做访问限制
 默认不然产生跨域数据访问
 符合CORS 在服务端 设置允许访问

 浏览器对跨域的限定
    http:// 127.0.0.1 :  8080
    协议     地址        端口号
    浏览器自动发送预检请求 method options 检测响应头 是否符合CORS要求 
    通过后会缓存一定事件 




*/


// onMounted(()=>{
//     myGet("/login",{username:'aa',password:'bbb'})

// })


</script>

<style scoped>
/* scoped只对当前vue文件生效  */

.loginPanel {
  margin: 300px auto;
  background-color: rgba(219, 219, 219, 0.541);
}
.card-header {
  /* 容器样式 */
  position: relative;
  height: 120px; /* 根据需求调整 */
  overflow: hidden;
  border-radius: 12px 12px 12px 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* 渐变遮罩 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  }
}

.header-image {
  /* 图片样式 */
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  /* 悬停效果 */
  &:hover {
    transform: scale(1.05);
  }

  /* 暗色模式适配 */
  @media (prefers-color-scheme: dark) {
    filter: brightness(0.9);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .card-header {
    height: 150px;
    border-radius: 8px 8px 0 0;
  }
}
</style>