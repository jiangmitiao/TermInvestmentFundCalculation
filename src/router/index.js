import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HuShen300 from '@/components/HuShen300'
import ShangZheng50 from '@/components/ShangZheng50'
import Index from '@/components/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/HuShen300',
      name: 'HuShen300',
      component: HuShen300
    },
    {
      path: '/ShangZheng50',
      name: 'ShangZheng50',
      component: ShangZheng50
    }
  ]
})
