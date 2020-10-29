import request from '@/utils/request'

const api = {
  medicinalConflictInfoDelete: '/medicinalConflictInfo/delete', // 删除药品冲突信息
  findMedicinalConflict: '/medicinalConflictInfo/findMedicinal', // 根据编号查询药品信息
  importMedicinalConflict: '/medicinalConflictInfo/importMedicinalConflict', // 导入药品冲突信息
  medicinalConflictList: '/medicinalConflictInfo/medicinalConflictList', // 查询药品列表
  medicinalConflictSaveOrUpdate: '​/medicinalConflictInfo​/saveOrUpdate'// 新增|编辑
}

export function medicinalConflictInfoDelete (parameter) {
  return request({
    url: api.medicinalConflictInfoDelete,
    method: 'post',
    data: parameter
  })
}

export function findMedicinalConflict (parameter) {
  return request({
    url: api.findMedicinalConflict,
    method: 'post',
    data: parameter
  })
}

export function importMedicinalConflict (parameter) {
  return request({
    url: api.importMedicinalConflict,
    method: 'post',
    data: parameter
  })
}

export function medicinalConflictList (parameter) {
    return request({
      url: api.medicinalConflictList,
      method: 'post',
      data: parameter
    })
}

export function medicinalConflictSaveOrUpdate (parameter) {
    return request({
      url: api.medicinalConflictSaveOrUpdate,
      method: 'post',
      data: parameter
    })
}
