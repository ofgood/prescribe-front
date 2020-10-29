import request from '@/utils/request'

const api = {
  medicinalInfoDelete: '/medicinalInfo/delete', // 删除药品信息
  findMedicinal: '/medicinalInfo/findMedicinal', // 根据编号查询药品信息
  importMedicinal: '/medicinalInfo/importMedicinal', // 导入药品信息
  medicinalList: '/medicinalInfo/medicinalList', // 查询药品列表
  medicinalSelect: '/medicinalInfo/medicinalSelect', // 根据关键字查询
  medicinalInfoSaveOrUpdate: '/medicinalInfo/saveOrUpdate'// 新增|编辑
}

export function medicinalInfoDelete (parameter) {
  return request({
    url: api.medicinalInfoDelete,
    method: 'post',
    data: parameter
  })
}

export function findMedicinal (parameter) {
  return request({
    url: api.findMedicinal,
    method: 'post',
    data: parameter
  })
}

export function importMedicinal (parameter) {
  return request({
    url: api.importMedicinal,
    method: 'post',
    data: parameter
  })
}

export function medicinalList (parameter) {
    return request({
      url: api.medicinalList,
      method: 'post',
      data: parameter
    })
}

export function medicinalSelect (parameter) {
    return request({
      url: api.medicinalSelect,
      method: 'post',
      data: parameter
    })
}

export function medicinalInfoSaveOrUpdate (parameter) {
    return request({
      url: api.medicinalSelect,
      method: 'post',
      data: parameter
    })
}
