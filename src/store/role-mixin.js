import { mapState } from 'vuex'

const roleMixin = {
  computed: {
    ...mapState({
      isDoctor: state => state.user.isDoctor,
      isManager: state => state.user.isManager
    })
  }
}

export { roleMixin }
