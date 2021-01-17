import request from '@/utils/request'

const api = {
    recipeLogInfoList: '/recipeLogInfo/recipeLogInfoList' // 操作記錄
}

export function recipeLogInfoList (parameter) {
  return request({
    url: api.recipeLogInfoList,
    method: 'post',
    data: parameter
  })
}
