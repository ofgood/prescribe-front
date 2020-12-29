// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '主页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard/workplace',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Workplace'),
        meta: { title: '总览', keepAlive: true, icon: 'home', permission: [ 'dashboard' ] }
      },
      {
        path: '/customer',
        name: 'customer',
        component: RouteView,
        redirect: '/customer/customer-list',
        meta: { title: '客户管理', icon: 'team', permission: [ 'customer' ] },
        children: [
          {
            path: '/customer/customer-list/:pageNo([1-9]\\d*)?',
            name: 'customer-list',
            hideChildrenInMenu: true,
            component: () => import('@/views/customer/CustomerList'),
            meta: { title: '客户列表', keepAlive: true, permission: [ 'customer' ] }
          }
        ]
      },
      {
        path: '/user',
        name: 'user',
        component: RouteView,
        redirect: '/user/user-list',
        meta: { title: '用户管理', icon: 'team', permission: [ 'user' ] },
        children: [
          {
            path: '/user/user-list/:pageNo([1-9]\\d*)?',
            name: 'user-list',
            hideChildrenInMenu: true,
            component: () => import('@/views/user/UserList'),
            meta: { title: '用户列表', keepAlive: true, permission: [ 'user' ] }
          }
        ]
      },
      {
        path: '/area',
        name: 'area',
        component: RouteView,
        redirect: '/area/area-list',
        meta: { title: '区域管理', icon: 'cluster', permission: [ 'area' ] },
        children: [
          {
            path: '/area/area-list',
            name: 'area-list',
            hideChildrenInMenu: true,
            component: () => import('@/views/area/AreaList'),
            meta: { title: '区域列表', keepAlive: true, permission: [ 'area' ] }
          }
        ]
      },
      {
        path: '/clinic',
        name: 'clinic',
        component: RouteView,
        redirect: '/clinic/clinic-list',
        meta: { title: '诊所管理', icon: 'bank', permission: [ 'clinic' ] },
        children: [
          {
            path: '/clinic/clinic-list',
            name: 'clinic-list',
            hideChildrenInMenu: true,
            component: () => import('@/views/clinic/ClinicList'),
            meta: { title: '诊所列表', keepAlive: true, permission: [ 'clinic' ] }
          }
        ]
      },
      // {
      //   path: '/doctor',
      //   name: 'doctor',
      //   component: RouteView,
      //   redirect: '/doctor/doctor-list',
      //   meta: { title: '医生管理', icon: 'fork', permission: [ 'doctor' ] },
      //   children: [
      //     {
      //       path: '/doctor/doctor-list/:pageNo([1-9]\\d*)?',
      //       name: 'doctor-list',
      //       hideChildrenInMenu: true,
      //       component: () => import('@/views/doctor/DoctorList'),
      //       meta: { title: '医生列表', keepAlive: true, permission: [ 'doctor' ] }
      //     }
      //   ]
      // },
      {
        path: '/patient',
        name: 'patient',
        component: RouteView,
        redirect: '/patient/patient-list',
        meta: { title: '患者管理', icon: 'solution', permission: [ 'patient' ] },
        children: [
          {
            path: '/patient/patient-list/:pageNo([1-9]\\d*)?',
            name: 'patient-list',
            hideChildrenInMenu: true,
            component: () => import('@/views/patient/PatientList'),
            meta: { title: '患者列表', keepAlive: true, permission: [ 'patient' ] }
          }
        ]
      },
      {
        path: '/recipe',
        name: 'recipe',
        component: RouteView,
        redirect: '/recipe/open-recipe',
        meta: { title: '处方管理', icon: 'file-done', permission: [ 'recipeAdmin' ] },
        children: [
          {
            path: '/recipe/open-recipe',
            name: 'openRecipe',
            component: () => import('@/views/recipe/OpenRecipe'),
            meta: { title: '开处方', keepAlive: true, permission: [ 'recipe' ] }
          },
          {
            path: '/recipe/recipe-list',
            name: 'recipeList',
            component: () => import('@/views/recipe/RecipeList'),
            meta: { title: '处方列表', keepAlive: true, permission: [ 'recipeList' ] }
          }
        ]
      },
      {
        path: '/recipeTemplate',
        name: 'recipeTemplate',
        component: RouteView,
        redirect: '/recipeTemplate/recipe-template-list',
        meta: { title: '处方模板管理', icon: 'profile', permission: [ 'recipeTemplate' ] },
        children: [
          {
            path: '/recipeTemplate/recipe-template-list/:pageNo([1-9]\\d*)?',
            name: 'recipe-template-list',
            component: () => import('@/views/recipeTemplate/RecipeTemplateList'),
            hideChildrenInMenu: true,
            meta: { title: '处方模板列表', keepAlive: true, permission: [ 'recipeTemplate' ] }
          },
          {
            path: '/recipeTemplate/create-recipe-template',
            name: 'create-recipe-template',
            // hidden: true,
            component: () => import('@/views/recipeTemplate/CreateRecipeTemplate'),
            meta: { title: '创建处方模板', keepAlive: true, permission: [ 'createRecipeTemplate' ] }
          }
        ]
      },
      {
        path: '/medicine',
        name: 'medicine',
        component: RouteView,
        redirect: '/medicine/medicine-list',
        meta: { title: '药品管理', icon: 'medicine-box', permission: [ 'medicine' ] },
        children: [
          {
            path: '/medicine/medicine-list',
            name: 'medicine-list',
            component: () => import('@/views/medicine/MedicineList'),
            meta: { title: '药品列表', keepAlive: true, permission: [ 'medicine' ] }
          }
        ]
      },
      {
        path: '/medicinalConflict',
        name: 'medicinalConflict',
        component: RouteView,
        redirect: '/medicinalConflict/medicinalConflict-list',
        meta: { title: '药品冲突管理', icon: 'exception', permission: [ 'medicinalConflict' ] },
        children: [
          {
            path: '/medicinalConflict/medicinalConflict-list',
            name: 'medicinalConflictList',
            component: () => import('@/views/medicinalConflict/MedicinalConflictList'),
            meta: { title: '药品冲突列表', keepAlive: true, permission: [ 'medicinalConflict' ] }
          }
        ]
      },

      // profile
      {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: '详情页', icon: 'profile', permission: [ 'profile' ] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic'),
            meta: { title: '基础详情页', permission: [ 'profile' ] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '高级详情页', permission: [ 'profile' ] }
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        hidden: true,
        component: RouteView,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'result' ] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        hidden: true,
        meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'exception' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'exception' ] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'exception' ] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          // {
          //   path: '/account/center',
          //   name: 'center',
          //   component: () => import('@/views/account/center'),
          //   meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
          // },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
            redirect: '/account/settings/security',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              }
              // {
              //   path: '/account/settings/base',
              //   name: 'BaseSettings',
              //   component: () => import('@/views/account/settings/BaseSetting'),
              //   meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
              // },
              // {
              //   path: '/account/settings/custom',
              //   name: 'CustomSettings',
              //   component: () => import('@/views/account/settings/Custom'),
              //   meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              // },
              // {
              //   path: '/account/settings/binding',
              //   name: 'BindingSettings',
              //   component: () => import('@/views/account/settings/Binding'),
              //   meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'user' ] }
              // },
              // {
              //   path: '/account/settings/notification',
              //   name: 'NotificationSettings',
              //   component: () => import('@/views/account/settings/Notification'),
              //   meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'user' ] }
              // }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
