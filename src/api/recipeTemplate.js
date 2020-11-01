import request from '@/utils/request'

const api = {
  recipeTemplateDelete: '/recipeTemplate/delete', // 删除处方模板
  recipeTemplateFindById: '/recipeTemplate/findById', // 根据编号查询处方模板
  recipeTemplateList: '/recipeTemplate/findList', // 查询处方模板列表
  recipeTemplateSelect: '/recipeTemplate/findSelect', // 下拉框查询处方模板(供医生开方使用)
  recipeTemplateSaveOrUpdate: '/recipeTemplate/saveOrUpdate'// 新增|编辑
}

export function recipeTemplateDelete (parameter) {
  return request({
    url: api.recipeTemplateDelete,
    method: 'post',
    data: parameter
  })
}

export function recipeTemplateFindById (parameter) {
  return request({
    url: api.recipeTemplateFindById,
    method: 'post',
    data: parameter
  })
}

export function recipeTemplateList (parameter) {
  return request({
    url: api.recipeTemplateList,
    method: 'post',
    data: parameter
  })
}

export function recipeTemplateSelect (parameter) {
    return request({
      url: api.recipeTemplateSelect,
      method: 'post',
      data: parameter
    })
}

export function recipeTemplateSaveOrUpdate (parameter) {
    return request({
      url: api.recipeTemplateSaveOrUpdate,
      method: 'post',
      data: parameter
    })
}
