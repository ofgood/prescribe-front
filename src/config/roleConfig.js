/**
 *
    SUPER_USER("SUPER_USER","超级管理员"),
    COMPANY_MANAGER("COMPANY_MANAGER","公司管理员"),
    AREA_MANAGER("AREA_MANAGER","区域管理员"),
    CLINIC_MANAGER("CLINIC_MANAGER","诊所管理员"),
    DOCTOR("DOCTOR","医生"),
    DOCTOR_STAR("DOCTOR_STAR","名医");
 */

export const roleConfig = {
    SUPER_USER: [
        'dashboard',
        'form'
    ],
    COMPANY_MANAGER: [
      'dashboard'
    ],
    AREA_MANAGER: [
      'dashboard'
    ],
    CLINIC_MANAGER: [
      'dashboard'
    ],
    DOCTOR: [
      'dashboard'
    ],
    DOCTOR_STAR: [
      'dashboard'
    ]
}
