import request from '@/utils/request'

const api = {
  customerList: '/customer/customerList', // 查询客户信息列表
  customerRegister: '/customer/register' // 新增客户或者修改客户信息
}

export function customerList (parameter) {
  return request({
    url: api.customerList,
    method: 'post',
    data: parameter
  })
}

export function customerRegister (parameter) {
  return request({
    url: api.customerRegister,
    method: 'post',
    data: parameter
  })
}
