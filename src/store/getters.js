const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  gender: state => state.dicData.gender,
  genderAll: state => state.dicData.genderAll,
  whether: state => state.dicData.whether,
  whetherAll: state => state.dicData.whetherAll,
  doctorType: state => state.dicData.doctorType,
  clinics: state => state.recipe.clinics,
  medicinalStands: state => state.dicData.medicinalStands,
  conflictType: state => state.dicData.conflictType,
  recipeTemplateType: state => state.dicData.recipeTemplateType,
  recipeType: state => state.dicData.recipeType,
  recipeTypeAll: state => state.dicData.recipeTypeAll,
  recipeAllTypes: state => state.dicData.recipeAllTypes,
  recipeTypes: state => state.dicData.recipeTypes,
  druggingOrders: state => state.dicData.druggingOrders,
  grabMedicineTypes: state => state.dicData.grabMedicineTypes
}

export default getters
