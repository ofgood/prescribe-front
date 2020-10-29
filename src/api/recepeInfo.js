import request from '@/utils/request'

const api = {
  openRecipe: '/recepeInfo/openRecipe' //  开药方
}

export function openRecipe (parameter) {
  return request({
    url: api.openRecipe,
    method: 'post',
    data: parameter
  })
}
