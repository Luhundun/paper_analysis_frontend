import {RouteRecordRaw} from "vue-router";

export const DrawPic: RouteRecordRaw = {
  path: '/draw',
  component: () => import('@/views/layout/MainLayout.vue'),
  redirect: '/draw/sequence',
  meta: {icon: 'Picture', title: "图表分析"},
  children: [
    {
      path: 'sequence',
      component: () => import('@/views/draw/SequenceItem.vue'),
      meta: { title: "时序图"}
    },
    {
      path: 'author',
      component: () => import('@/views/draw/AuthorItem.vue'),
      meta: {title: "作者图"},
    },
    {
      path: 'institute',
      component: () => import('@/views/draw/InsItem.vue'),
      meta: { title: "机构图" },
    },
    {
      path: 'keyword',
      component: () => import('@/views/draw/KeywordItem.vue'),
      meta: { title: "关键字图" },
    },
    {
      path: 'sigma',
      component: () => import('@/views/draw/testSigma/SigmaItem.vue'),
      meta: { title: "测试" },
    },
  ]
}
