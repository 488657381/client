import { createApp } from 'vue'
import App from './App.vue'
//默认找目录下的index.js
import router from './router'

//配置elementPlus
//引入js
import ElementPlus from 'element-plus'
///引入样式
import 'element-plus/dist/index.css'
//引入语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//引入图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'




const myVue = createApp(App)
//启用router插件
myVue.use(router)
//启用elementPlus插件 并设置语言版本
myVue.use(ElementPlus, {
    locale: zhCn,
  })
//配置图标 让vue动态生成图标时可以正确生成
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    //生成vue自定义组件
    myVue.component(key, component)
}



myVue.mount('#app')
