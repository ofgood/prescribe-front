import request from '@/utils/request'

const api = {
    areaDelete: '/area/delete',
    getAreaById: '/area/findById',
    areaSaveOrUpdate: '/area/saveOrUpdate',
    areaList: '/area/selectList',
    selectArea: '/area/selectArea'
}

export function areaDelete (parameter) {
    return request({
        url: api.areaDelete,
        method: 'post',
        data: parameter
    })
}

export function getAreaById (parameter) {
    return request({
        url: api.getAreaById,
        method: 'post',
        data: parameter
    })
}

export function areaSaveOrUpdate (parameter) {
    return request({
        url: api.areaSaveOrUpdate,
        method: 'post',
        data: parameter
    })
}

export function areaList (parameter) {
    return request({
        url: api.areaList,
        method: 'post',
        data: parameter
    })
}

export function selectArea (parameter) {
    return request({
        url: api.selectArea,
        method: 'post',
        data: parameter
    })
}
