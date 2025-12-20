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
        component: () => import('./views/Home/index.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('./views/About/index.vue')
    },
    {
        path: '/level',
        name: 'Level',
        component: () => import('./views/Game/level.vue')
    },
    {
        path: '/a',
        name: 'A',
        component: () => import('./views/Game/audio.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: () => import('./views/Error/404.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App).use(router).mount('#app')
