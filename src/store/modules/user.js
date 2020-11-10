import storage from 'store'
import { login, getInfo, logout, resetPasssord } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { DOCTOR_ID, CLINIC_ID } from '@/config/storageTypes'
import { welcome } from '@/utils/util'
import { roleConfig, managerRoles, doctorRoles } from '@/config/roleConfig'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    role: '',
    info: {},
    isDoctor: false,
    isManager: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLE: (state, roles) => {
      state.role = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_IS_DOCTOR: (state, isDoctor) => {
      state.isDoctor = isDoctor
    },
    SET_IS_MANAGER: (state, isManager) => {
      state.isDoctor = isManager
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve(result)
          window.location.reload()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          console.log('response', response)
          const result = response.data

          if (result.userType) {
            const userType = result.userType
            result.role = {}
            result.role.permissionList = roleConfig[userType]
            commit('SET_ROLES', result.role)
            commit('SET_ROLE', result.userType)
            commit('SET_INFO', result)
            commit('SET_IS_DOCTOR', doctorRoles.includes(result.userType))
            commit('SET_IS_MANAGER', managerRoles.includes(result.userType))
            storage.set(DOCTOR_ID, result.id)
          } else {
            reject(new Error('用户角色类型不能为空!'))
          }

          commit('SET_NAME', { name: result.userName, welcome: welcome() })
          commit('SET_AVATAR', result.avatar || '')

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          storage.remove(CLINIC_ID)
          storage.remove(DOCTOR_ID)
        })
      })
    },
    // 重置密码
    ResetPasssord ({ commit, state }, data) {
      return new Promise((resolve) => {
        resetPasssord(data).then((res) => {
          if (res.success) {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            storage.remove(ACCESS_TOKEN)
            storage.remove(CLINIC_ID)
            storage.remove(DOCTOR_ID)
          }
          resolve(res)
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
