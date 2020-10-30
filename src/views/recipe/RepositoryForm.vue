<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item label="患者姓名">
          <a-input
            placeholder="请输入患者姓名"
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入患者姓名', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="患者性别">
          <a-select placeholder="请选择患者性别" v-decorator="['sex', {rules: [{required: true, message: '请选择患者性别'}]}]">
            <a-select-option v-for="item in gender" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="出生年月">
          <a-date-picker style="width:100%" placeholder="请选择出生日期" valueFormat="YYYY-MM-DD" v-decorator="['birthday', {rules: [{message: '请选择出生日期'}]}]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="审批人">
          <a-select placeholder="请选择审批员" v-decorator="[ 'approver', {rules: [{ required: true, message: '请选择审批员'}]} ]">
            <a-select-option value="王晓丽">王晓丽</a-select-option>
            <a-select-option value="李军">李军</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="审批人">
          <a-select placeholder="请选择审批员" v-decorator="[ 'approver', {rules: [{ required: true, message: '请选择审批员'}]} ]">
            <a-select-option value="王晓丽">王晓丽</a-select-option>
            <a-select-option value="李军">李军</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item
          label="出生年月">
          <a-date-picker style="width:100%" placeholder="请选择出生日期" valueFormat="YYYY-MM-DD" v-decorator="['birthday', {rules: [{message: '请选择出生日期'}]}]" />
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
      form: this.$form.createForm(this)
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
