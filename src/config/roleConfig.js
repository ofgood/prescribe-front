/**
 *
    SUPER_USER("SUPER_USER","超级管理员"),
    COMPANY_MANAGER("COMPANY_MANAGER","公司管理员"),
    AREA_MANAGER("AREA_MANAGER","区域管理员"),
    CLINIC_MANAGER("CLINIC_MANAGER","诊所管理员"),
    DOCTOR("DOCTOR","医生"),
    DOCTOR_STAR("DOCTOR_STAR","名医");
 */
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
    'exception'
]
const COMPANY_MANAGER_ROUTE = [
    'dashboard',
    'patient',
    'medicine',
    'medicinalConflict',
    'doctor',
    'clinic',
    'customer',
    'createRecipeTemplate',
    'result',
    'exception'
]
const AREA_MANAGER_ROUTE = [
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
    'exception'
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
    'exception'
]
const DOCTOR_ROUTE = [
    'recipe', 'recipeTemplate', 'dashboard', 'createRecipeTemplate'
]
const DOCTOR_STAR_ROUTE = [
    'recipe', 'recipeTemplate', 'dashboard', 'createRecipeTemplate'
]
export const roleConfig = {
    SUPER_USER: SUPER_USER_ROUTE,
    COMPANY_MANAGER: COMPANY_MANAGER_ROUTE,
    AREA_MANAGER: AREA_MANAGER_ROUTE,
    CLINIC_MANAGER: CLINIC_MANAGER_ROUTE,
    DOCTOR: DOCTOR_ROUTE,
    DOCTOR_STAR: DOCTOR_STAR_ROUTE
}
