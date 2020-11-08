import request from '@/utils/request'

const api = {
  openRecipe: '/recipeInfo/openRecipe', //  开药方
  findDoctorRecipeCount: '/recipeInfo/findDoctorRecipeCount', //  查询医生总的处方量
  findDoctorRecipeToday: '/recipeInfo/findDoctorRecipeToday', //  查询医生总的处方量
  getPrintRecipeInfo: '/recipeInfo/getPrintRecipeInfo' //  查询医生总的处方量

}

export function openRecipe (parameter) {
  return request({
    url: api.openRecipe,
    method: 'post',
    data: parameter
  })
}

export function findDoctorRecipeCount (parameter) {
  return request({
    url: api.findDoctorRecipeCount,
    method: 'post',
    data: parameter
  })
}

export function findDoctorRecipeToday (parameter) {
  return request({
    url: api.findDoctorRecipeToday,
    method: 'post',
    data: parameter
  })
}
export function getPrintRecipeInfo (parameter) {
  return request({
    url: api.getPrintRecipeInfo,
    method: 'post',
    data: parameter
  })
}
