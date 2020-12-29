/**
 *
    SUPER_USER("SUPER_USER","超级管理员"),
    COMPANY_MANAGER("COMPANY_MANAGER","公司管理员"),
    AREA_MANAGER("AREA_MANAGER","区域管理员"),
    CLINIC_MANAGER("CLINIC_MANAGER","诊所管理员"),
    DOCTOR("DOCTOR","医生"),
    DOCTOR_STAR("DOCTOR_STAR","名医");
 */
export const managerRoles = [
    'SUPER_USER',
    'COMPANY_MANAGER',
    'AREA_MANAGER',
    'CLINIC_MANAGER'
]
export const doctorRoles = [
    'DOCTOR',
    'DOCTOR_STAR'
]

const SUPER_USER_ROUTE = [
    'dashboard',
    'patient',
    'medicine',
    'medicinalConflict',
    'doctor',
    'clinic',
    'recipe',
    'recipeTemplate',
    'customer',
    'createRecipeTemplate',
    'result',
    'exception',
    'recipeAdmin',
    'recipeList',
    'area',
    'recipeTemplate',
    'user'
]
const COMPANY_MANAGER_ROUTE = [
    'dashboard',
    'patient',
    'area',
    'medicine',
    'medicinalConflict',
    'doctor',
    'clinic',
    'customer',
    'createRecipeTemplate',
    'result',
    'exception',
    'recipeAdmin',
    'recipeList',
    'recipeTemplate',
    'user'
]
const AREA_MANAGER_ROUTE = [
    'dashboard',
    'patient',
    'area',
    'medicine',
    'medicinalConflict',
    'doctor',
    'clinic',
    'recipe',
    'recipeTemplate',
    'customer',
    'createRecipeTemplate',
    'result',
    'exception',
    'recipeAdmin',
    'recipeList',
    'recipeTemplate',
    'user'
]
const CLINIC_MANAGER_ROUTE = [
    'dashboard',
    'patient',
    'medicine',
    'medicinalConflict',
    'doctor',
    'clinic',
    'recipe',
    'recipeTemplate',
    'customer',
    'createRecipeTemplate',
    'result',
    'exception',
    'recipeAdmin',
    'recipeList',
    'recipeTemplate',
    'user'
]
const DOCTOR_ROUTE = [
    'recipeAdmin', 'recipe', 'recipeList', 'recipeTemplate', 'dashboard', 'createRecipeTemplate'
]
const DOCTOR_STAR_ROUTE = [
    'recipeAdmin', 'recipe', 'recipeList', 'recipeTemplate', 'dashboard', 'createRecipeTemplate'
]
export const roleConfig = {
    SUPER_USER: SUPER_USER_ROUTE,
    COMPANY_MANAGER: COMPANY_MANAGER_ROUTE,
    AREA_MANAGER: AREA_MANAGER_ROUTE,
    CLINIC_MANAGER: CLINIC_MANAGER_ROUTE,
    DOCTOR: DOCTOR_ROUTE,
    DOCTOR_STAR: DOCTOR_STAR_ROUTE
}
