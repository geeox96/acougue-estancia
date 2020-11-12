import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/pedidos-cliente',
    name: 'Pedidos',
    component: () => import('../views/Pedidos.vue')
  },
  {
    path: '/table-acougue',
    name: 'Acougue',
    component: () => import('../views/Acougue.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
