import request from '@/utils/request'

const api = {
  clinicList: '/clinic/clinicList', // 查询诊所列表
  clinicDelete: '/clinic/delete', // 删除诊所信息
  clinicFindById: '/clinic/findById', // 根据编号查询诊所信息
  importClinic: '/clinic/importClinic', // 导入诊所列表
  clinicSaveOrUpdate: '/clinic/saveOrUpdate', // 新增|编辑,
  clinicSelect: '/clinic/clinicSelect', // 新增|编辑,
  clinicSaleReport: '/clinic/clinicSaleReport'
}

export function clinicList (parameter) {
  return request({
    url: api.clinicList,
    method: 'post',
    data: parameter
  })
}

export function clinicDelete (parameter) {
  return request({
    url: api.clinicDelete,
    method: 'post',
    data: parameter
  })
}

export function clinicFindById (parameter) {
  return request({
    url: api.clinicFindById,
    method: 'post',
    data: parameter
  })
}

export function importClinic (parameter) {
    return request({
      url: api.importClinic,
      method: 'post',
      data: parameter
    })
}

export function clinicSaveOrUpdate (parameter) {
    return request({
      url: api.clinicSaveOrUpdate,
      method: 'post',
      data: parameter
    })
}

export function clinicSelect (parameter) {
  return request({
    url: api.clinicSelect,
    method: 'post',
    data: parameter
  })
}

export function getClinicSaleReport (parameter) {
  return request({
    url: api.clinicSaleReport,
    method: 'post',
    data: parameter
  })
}
