import request from '@/utils/request'

const api = {
  doctorDelete: '/doctor/delete', // 删除医生信息（离职）
  doctorList: '/doctor/doctorList', // 查询医生列表
  findDoctor: '/doctor/findDoctor', // 根据编号查询医生信息
  doctorSaveOrUpdate: '/doctor/saveOrUpdate' // 新增|编辑
}

export function doctorDelete (parameter) {
  return request({
    url: api.doctorDelete,
    method: 'post',
    data: parameter
  })
}

export function doctorList (parameter) {
  return request({
    url: api.doctorList,
    method: 'post',
    data: parameter
  })
}

export function findDoctor (parameter) {
  return request({
    url: api.findDoctor,
    method: 'post',
    data: parameter
  })
}

export function doctorSaveOrUpdate (parameter) {
    return request({
      url: api.doctorSaveOrUpdate,
      method: 'post',
      data: parameter
    })
}
