import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HuShen300 from '@/components/HuShen300'
import ShangZheng50 from '@/components/ShangZheng50'
import Index from '@/components/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        title: '指数基金模拟定投计算器'
      }
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/HuShen300',
      name: 'HuShen300',
      component: HuShen300,
      meta: {
        title: '沪深300 --指数基金模拟定投计算器'
      }
    },
    {
      path: '/ShangZheng50',
      name: 'ShangZheng50',
      component: ShangZheng50,
      meta: {
        title: '上证50 --指数基金模拟定投计算器'
      }
    }
  ]
})
