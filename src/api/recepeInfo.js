import request from '@/utils/request'

const api = {
  openRecipe: '/recipeInfo/openRecipe', //  开药方
  findDoctorRecipeCount: '/recipeInfo/findDoctorRecipeCount', //  查询医生总的处方量
  findDoctorRecipeToday: '/recipeInfo/findDoctorRecipeToday', //  查询医当天的处方量
  getPrintRecipeInfo: '/recipeInfo/getPrintRecipeInfo', //  获取打印信息
  recipeInfoList: '/recipeInfo/recipeInfoList', //  获取打印信息
  getRecipeMedicinalList: '/recipeInfo/getRecipeMedicinalList' //  获取打印信息

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
export function recipeInfoList (parameter) {
  return request({
    url: api.recipeInfoList,
    method: 'post',
    data: parameter
  })
}
export function getRecipeMedicinalList (parameter) {
  return request({
    url: api.getRecipeMedicinalList,
    method: 'post',
    data: parameter
  })
}
