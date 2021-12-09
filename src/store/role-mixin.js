import { mapState } from 'vuex'

const roleMixin = {
  computed: {
    ...mapState({
      currentUserId: state => state.user.info.id,
      currentUserRole: state => state.user.role,
      isDoctor: state => state.user.isDoctor,
      isManager: state => state.user.isManager,
      isClinicManager: state => state.user.isClinicManager
    })
  }
}

export { roleMixin }
