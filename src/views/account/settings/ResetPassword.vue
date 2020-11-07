<template>
  <a-modal
    title="重置密码"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok')
      }
    "
    @cancel="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-alert v-if="isResetError" type="error" showIcon style="margin-bottom: 24px" message="账号或密码错误" />
        <a-form-item label="旧密码">
          <a-input-password
            size="large"
            placeholder="请输入旧密码"
            v-decorator="[
              'oldPassword',
              { rules: [{ required: true, message: '请输入旧密码' }], validateTrigger: 'blur' },
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input-password>
        </a-form-item>
        <a-form-item label="新密码">
          <a-input-password
            size="large"
            placeholder="请输入新密码"
            @blur="comparePassword"
            v-decorator="[
              'newPassword',
              { rules: [{ required: true, message: '请输入新密码' }], validateTrigger: 'blur' },
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input-password>
        </a-form-item>
        <a-form-item label="重复输入新密码">
          <a-input-password
            size="large"
            @blur="comparePassword"
            placeholder="请重复输入新密码"
            v-decorator="[
              'confirmPassword',
              { rules: [{ required: true, message: '请重复输入新密码' }], validateTrigger: 'blur' },
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input-password>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
const fields = ['confirmPassword', 'newPassword', 'oldPassword']
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      isResetError: false
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    comparePassword () {
      const { newPassword, confirmPassword } = this.form.getFieldsValue()
      if (confirmPassword) {
        if (newPassword !== confirmPassword) {
          this.isResetError = true
        } else {
          this.isResetError = false
        }
      }
    }
  }
}
</script>
