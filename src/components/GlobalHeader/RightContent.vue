<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
    <create-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import { mapGetters, mapActions } from 'vuex'
import CreateForm from '@/views/account/settings/ResetPassword.vue'
import md5 from 'md5'
export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
    CreateForm
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {},
      visible: false,
      confirmLoading: false,
      mdl: null
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    },
    ...mapGetters(['userInfo'])
  },
  mounted () {
    setTimeout(() => {
      this.currentUser = {
        name: this.userInfo.userName
      }
    }, 500)
  },
  methods: {
    ...mapActions(['ResetPasssord']),
    handleCancel () {
      this.visible = false
    },
     handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
           // 新增
           const params = { ...values }
           params.confirmPassword = md5(values.confirmPassword)
           params.newPassword = md5(values.newPassword)
           params.oldPassword = md5(values.oldPassword)
            this.ResetPasssord({ ...params }).then(res => {
              console.log('res', res)
              if (res.success) {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                this.$router.push({
                  name: 'login'
                })
              } else {
                this.$message.info(res.message)
                this.confirmLoading = false
              }
            })
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
