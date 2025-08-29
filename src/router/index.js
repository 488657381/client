//作为路由的配置⽂件
import {createRouter, createWebHistory} from 'vue-router'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            component: () => import('../views/login.vue'),
            meta: {title: '登录'}
        },
        {
            path: '/main',
            component: () => import('../views/main.vue'),
            children: [
                {
                    path: '/menus',
                    component: () => import('../views/system/menus.vue'),
                    meta: {title: '主页'}
                },
                {
                    path: '/users',
                    component: () => import('../views/system/users.vue'),
                    meta: {title: '用户管理'}
                },
                {
                    path: '/gift/info',
                    component: () => import('../views/system/giftInfo.vue'),
                    meta: {title: '礼物信息'}
                },
                {
                    path: '/room/category',
                    component: () => import('../views/system/roomCategory.vue'),
                    meta: {title: '大厅分类'}
                },
                {
                    path: '/room/info',
                    component: () => import('../views/system/roomInfo.vue'),
                    meta: {title: '大厅信息'}
                },
                {
                    path: '/games/info',
                    component: () => import('../views/system/gamesinfo.vue'),
                    meta: {title: '游戏技能'}
                },
                {
                    path: '/order/info',
                    component: () => import('../views/system/orderinfo.vue'),
                    meta: {title: '订单详情'}
                },
                {
                    path: '/order/commentInfo',
                    component: () => import('../views/system/ordercommentInfo.vue'),
                    meta: {title: '订单评论监控'}
                },
                {
                    path: '/customer/community',
                    component: () => import('../views/system/community.vue'),
                    meta: {title: '公会管理'}
                },
                {
                    path: '/customer/dynamics',
                    component: () => import('../views/system/dynamics.vue'),
                    meta: {title: '用户动态管理'}
                },
                {
                    path: '/customer/godcustomer',
                    component: () => import('../views/system/godcustomer.vue'),
                    meta: {title: '大神用户'}
                },
                {
                    path: '/customer/playcustomer',
                    component: () => import('../views/system/playcustomer.vue'),
                    meta: {title: '普通用户'}
                },
            ]
        },
        //配置项目入口
        {
            path: '/',
            redirect: '/login'
        }

    ]
})
router.beforeEach((to) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
})
export default router