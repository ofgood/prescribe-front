<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="管理员登录">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px" :message="errMessage" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="请输入帐号"
              v-decorator="[
                'username',
                { rules: [{ required: true, message: '请输入帐号' }], validateTrigger: 'blur' },
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              placeholder="请输入密码"
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' },
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="医生登录">
          <a-form-item>
            <a-input-group style="display: inline-block; vertical-align: middle" :compact="true">
              <a-select size="large" v-model="doctorType" style="width: 100px">
                <a-select-option value="DOCTOR">医生</a-select-option>
                <a-select-option value="DOCTOR_STAR">名医</a-select-option>
              </a-select>
              <a-input
                size="large"
                type="text"
                placeholder="请输入帐号"
                @blur="changeUserName"
                :style="{ width: 'calc(100% - 100px)' }"
                v-decorator="[
                  'username',
                  { rules: [{ required: true, message: '请输入帐号' }], validateTrigger: 'change' },
                ]"
              >
                <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
            </a-input-group>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              placeholder="请输入密码"
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' },
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-select
              size="large"
              placeholder="请选择药店"
              v-decorator="['clinic', { rules: [{ required: true, message: '请选择药店' }], validateTrigger: 'blur' }]"
            >
              <a-select-option v-for="item in clinics" :value="item.id" :key="item.id">{{
                item.clinicName
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <span class="forge-password" style="float: right" @click="forgotPassword">忘记密码</span>
      </a-form-item>

      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getClinicListByUseName } from '@/api/login'
import storage from 'store'
import { CLINIC_ID } from '@/config/storageTypes'
export default {
  name: 'Login',
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      isLoginError: false,
      form: this.$form.createForm(this),
      doctorType: 'DOCTOR',
      state: {
        time: 60,
        loginBtn: false
      },
      clinics: []
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleTabClick (key) {
      this.customActiveKey = key
      this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        doctorType,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey =
        customActiveKey === 'tab1' ? ['username', 'password'] : ['username', 'password', 'clinic']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = { ...values }
          loginParams.password = md5(values.password)
          if (customActiveKey === 'tab2') {
            loginParams.userType = doctorType
            storage.set(CLINIC_ID, loginParams.clinic)
          }
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch((err) => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      if (res.success) {
        this.$router.push({ path: '/' })
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 1000)
        this.isLoginError = false
      } else {
        this.errMessage = res.message
        this.isLoginError = true
      }
    },
    requestFailed (err) {
      console.log(err)
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    },
    forgotPassword () {
      this.$message.info('请联系管理员')
    },
    changeUserName () {
      console.log(this.form.getFieldValue('username'))
      getClinicListByUseName({
        username: this.form.getFieldValue('username')
      }).then((res) => {
        if (res.success) {
          this.clinics = res.data || []
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
    line-height: 20px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
