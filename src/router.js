import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '',
        component: () => import('./views/index.vue')
    },
    {
        path: '/upload',
        name: 'upload',
        component: () => import('./views/upload.vue')
    },
    {
        path: '/video',
        name: 'video',
        component: () => import('./views/video.vue')
    },
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router
