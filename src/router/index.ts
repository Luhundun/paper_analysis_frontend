import {Common} from "./modules/common"
import {Dashboard} from "./modules/dashboard"
import {System} from "./modules/sysyem"
import {DrawPic} from "./modules/drawPic"
import { Search } from "./modules/search"
import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

//这里可以根据权限做动态路由
const menuRoute: RouteRecordRaw[] = [
  Dashboard,
  System,
  DrawPic,
  Search,
]

const jump: RouteRecordRaw[] = [
  // {
  //   path: '/search/form',
  //   name:'jump2form',
  //   component: () => import('@/views/search/Index.vue'),
  //   meta: { icon: 'Guide', title: "表单", hideMenu: true }
  // }
]


const whiteList: string[] = ['/login']//不需要登录也能查看的路由,最少需要'/login'，要不然会一直重定向到login

export default createRouter({
  history: createWebHashHistory(),
  routes:[...menuRoute, ...Common, ...jump]
})

export {menuRoute,whiteList}
