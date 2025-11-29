import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router";

import App from './App.vue'
import './assets/assets-theme.css'
import './assets/assets-style.css'
import './assets/assets-fonts.css'

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: { title: 'Home | APlcexenicesetrl' },
        component: () => import('./views/Home/index.vue')
    },
    {
        path: '/about',
        name: 'About',
        meta: { title: 'About Us | APlcexenicesetrl' },
        component: () => import('./views/About/index.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        meta: { title: '404 Page Not Found | Apps APlcexenicesetrl' },
        component: () => import('./views/Error/404.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App).use(router).mount('#app')
