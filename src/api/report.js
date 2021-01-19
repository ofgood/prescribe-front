import request from '@/utils/request'

const api = {
    clinicRecipeReport: '/report/clinicRecipeReport', // 处方统计
    medicinalReport: '/report/medicinalReport' // 药品统计
}

export function clinicRecipeReport (parameter) {
    return request({
        url: api.clinicRecipeReport,
        method: 'post',
        data: parameter
    })
}

export function medicinalReport (parameter) {
    return request({
        url: api.medicinalReport,
        method: 'post',
        data: parameter
    })
}
