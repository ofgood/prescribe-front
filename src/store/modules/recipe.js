import { clinicSelect } from '@/api/clinic'
const user = {
  state: {
    clinics: []
  },

  mutations: {
    SET_CLINICS: (state, clinics) => {
      state.clinics = clinics
    }
  },

  actions: {
    // 获取诊所列表
    GetClinicList ({ commit }) {
      return new Promise((resolve, reject) => {
        clinicSelect().then(response => {
          console.log('response', response)
          const result = response.data
          if (response.success) {
            commit('SET_CLINICS', result || [])
          } else {
            reject(new Error(response.message))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}

export default user
