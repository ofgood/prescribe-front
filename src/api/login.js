import request from '@/utils/request'

const userApi = {
  Login: '/userInfo/login',
  Logout: '/userInfo/logout',
  ForgePassword: '/userInfo/forge-password',
  UserInfo: '/userInfo/getUserInfo',
  getClinicListByUseName: '/userInfo/getClinicList'
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
