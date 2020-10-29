/**
 *
    SUPER_USER("SUPER_USER","超级管理员"),
    COMPANY_MANAGER("COMPANY_MANAGER","公司管理员"),
    AREA_MANAGER("AREA_MANAGER","区域管理员"),
    CLINIC_MANAGER("CLINIC_MANAGER","诊所管理员"),
    DOCTOR("DOCTOR","医生"),
    DOCTOR_STAR("DOCTOR_STAR","名医");
 */
const allRoute = [
      'dashboard',
      'analysis',
      'patient',
      'prescription',
      'medicine',
      'medicinalConflict',
      'doctor',
      'table'
]
export const roleConfig = {
    SUPER_USER: allRoute,
    COMPANY_MANAGER: allRoute,
    AREA_MANAGER: allRoute,
    CLINIC_MANAGER: allRoute,
    DOCTOR: allRoute,
    DOCTOR_STAR: allRoute
}
