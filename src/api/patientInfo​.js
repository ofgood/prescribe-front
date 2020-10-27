import request from '@/utils/request'

const api = {
  findPatient: '/patientInfo​/findPatient', // 根据编号查询患者信息
  findSelect: '/patientInfo/findSelect', // 医生查询患者
  patientList: '/patientInfo/patientList', // 查询患者列表
  saveOrUpdate: '/patientInfo/saveOrUpdate' // 新增|编辑
}

export function findPatient (parameter) {
  return request({
    url: api.findPatient,
    method: 'post',
    data: parameter
  })
}

export function findSelect (parameter) {
  return request({
    url: api.findSelect,
    method: 'post',
    data: parameter
  })
}

export function patientList (parameter) {
  return request({
    url: api.patientList,
    method: 'post',
    data: parameter
  })
}

export function saveOrUpdate (parameter) {
    return request({
      url: api.saveOrUpdate,
      method: 'post',
      data: parameter
    })
}
