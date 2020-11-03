<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="处方模板类型">
          <a-select placeholder="请选择处方模板类型" v-decorator="[ 'recipeTemplateType', {rules: [{ required: true, message: '请选择处方模板类型'}]} ]">
            <a-select-option v-for="item in recipeTemplateType" :value="item.value" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="处方类型">
          <a-select placeholder="请选择处方类型" v-decorator="[ 'recipeType', {rules: [{ required: true, message: '请选择处方类型'}]} ]">
            <a-select-option v-for="item in recipeType" :value="item.value" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="模板名称">
          <a-input
            placeholder="请输入模板名称"
            v-decorator="[
              'recipeTemplateName',
              {rules: [{ required: true, message: '请输入模板名称', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="每包贴数">
          <a-input
            placeholder="请输入每包贴数"
            v-decorator="[
              'postPackageNumbers',
              {rules: [{ required: true, message: '请输入每包贴数', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="贴数">
          <a-input
            placeholder="请输入贴数"
            v-decorator="[
              'postNumbers',
              {rules: [{ required: true, message: '请输入贴数', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="每包容量">
          <a-input
            placeholder="请输入每包容量"
            v-decorator="[
              'packageCap',
              {rules: [{ required: true, message: '请输入每包容量', whitespace: true}]}
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
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapGetters(['recipeTemplateType', 'recipeType'])
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

<style lang="less">
  .form-row{
    .ant-form-item{
      margin-bottom: 10px;
    }
  }
</style>
