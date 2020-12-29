import request from '@/utils/request'

const userApi = {
  Login: '/userInfo/login',
  Logout: '/userInfo/logout',
  ForgePassword: '/userInfo/forge-password',
  ResetPasssord: '/userInfo/resetPasssord',
  UserInfo: '/userInfo/getUserInfo',
  getClinicListByUseName: '/userInfo/getClinicList',
  findUserList: '/userInfo/findUserList',
  userInfoSaveOrUpdate: '/userInfo/saveOrUpdate',
  findUserListByKey: '/userInfo/findListByKey',
  adminSettingPassword: '/userInfo/adminSettingPassword'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getClinicListByUseName (parameter) {
  return request({
    url: userApi.getClinicListByUseName,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function resetPasssord (parameter) {
  return request({
    url: userApi.ResetPasssord,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function findUserList (parameter) {
  return request({
    url: userApi.findUserList,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function userInfoSaveOrUpdate (parameter) {
  return request({
    url: userApi.userInfoSaveOrUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function findUserListByKey (parameter) {
  return request({
    url: userApi.findUserListByKey,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function adminSettingPassword (parameter) {
  return request({
    url: userApi.adminSettingPassword,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
