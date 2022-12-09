import {RouteRecordRaw} from "vue-router";

export const Search: RouteRecordRaw = {
  path: '/search',
  component: () => import('@/views/layout/MainLayout.vue'),
  redirect: '/search/condition',
  meta: { icon: 'Search', title: "检索", alwaysShow: true },
  children: [
    {
      path: 'condition',
      component: () => import('@/views/search/SearchItem.vue'),
      meta: { icon: 'Search', title: "检索", hideMenu: true }
    },
    {
      path: 'form',
      component: () => import('@/views/search/Index.vue'),
      meta: { icon: 'Guide', title: "检索表单", hideMenu: true }
    }
  ]
}

// export const Search: RouteRecordRaw = {
//   path: '/search',
//   component: () => import('@/views/layout/MainLayout.vue'),
//   redirect: '/search',
//   meta: { icon: 'Search', title: "检索", alwaysShow: true },
//   children: [
//     {
//       path: '',
//       component: () => import('@/views/search/SearchItem.vue'),
//       meta: { icon: 'Search', title: "检索", hideMenu: true }
//     },
//     {
//       path: 'form',
//       // name:'jump2form',
//       component: () => import('@/views/search/Index.vue'),
//       meta: { icon: 'Guide', title: "检索表单", hideMenu: true }
//     }
//   ]
// }

// {
//   "codeDir": "@/views/search",
//   "searchParams": {
//     "title": "",
//     "author": "",
//     "keywords": []
//   },
//   "fields": [
    
//     // {
//     //   "title": "ID",
//     //   "formDisabled": true,
//     //   "isPrimaryKey": true
//     // },
//     {
//       "field": "author",
//       "title": "作者"
//     },
//     {
//       "field": "title",
//       "title": "标题",
//       "editDisabled": true
//     },
//     {
//       "field": "institution",
//       "title": "机构",
//       "tableDisabled": false
//     },
//     {
//       "field": "source",
//       "title": "领域",
//       "tableDisabled": false
//     },
//     {
//       "field": "time",
//       "title": "发表时间",
//       "tableDisabled": false
//     },
//     {
//       "field": "keywords",
//       "title": "关键字",
//       "tableDisabled": false
//     },
//     {
//       "field": "abstract",
//       "title": "摘要",
//       "tableDisabled": true
//     }
//   ]
// }