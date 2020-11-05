<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item label="患者姓名">
          <a-input
            placeholder="请输入患者姓名"
            v-decorator="[
              'patientId',
              {rules: [{ required: true, message: '请输入患者姓名', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="患者性别">
          <a-select disabled placeholder="请选择患者性别" v-model="patientGender">
            <a-select-option v-for="item in gender" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="电话">
          <a-input
            placeholder="请输入电话"
            v-decorator="[
              'tel',
              {rules: [{ required: true, message: '请输入电话', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="出生年月">
          <a-date-picker v-model="birthday" disabled style="width:100%" placeholder="请选择出生日期" valueFormat="YYYY-MM-DD" />
        </a-form-item>
      </a-col>

    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="过敏史">
          <a-textarea
            style="resize:none"
            placeholder="请输入过敏史"
            v-decorator="[
              'disease',
              {rules: [{ required: false, message: '请输入过敏史', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="家庭住址">
          <a-textarea
            style="resize:none"
            placeholder="请输入家庭住址"
            v-decorator="[
              'address',
              {rules: [{ required: false, message: '请输入家庭住址', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="配送地址">
          <a-textarea
            style="resize:none"
            placeholder="请输入配送地址"
            v-decorator="[
              'shippingAddress',
              {rules: [{ required: false, message: '请输入配送地址', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit" >Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RepositoryForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      patientGender: '',
      birthday: null
    }
  },
  computed: {
    ...mapGetters(['gender'])
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    validate (rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        callback(new Error('需要以 user- 开头'))
      }
      callback()
    }
  }
}
</script>

<style scoped>

</style>
