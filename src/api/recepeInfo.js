import request from '@/utils/request'

const api = {
  openRecipe: '/recipeInfo/openRecipe' //  开药方
}

export function openRecipe (parameter) {
  return request({
    url: api.openRecipe,
    method: 'post',
    data: parameter
  })
}
