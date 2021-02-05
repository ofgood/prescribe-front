<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="8" :md="12" :sm="24">
        <a-form-item label="模板名称">
          <a-input
            placeholder="请输入模板名称"
            v-decorator="[
              'recipeTemplateName',
              {rules: [{ required: true, message: '请输入模板名称', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="8" :md="12" :sm="24">
        <a-form-item label="处方模板类型">
          <a-select placeholder="请选择处方模板类型" v-decorator="[ 'recipeTemplateType', {rules: [{ required: true, message: '请选择处方模板类型'}]} ]">
            <a-select-option v-for="item in recipeTemplateType" :value="item.value" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :lg="8" :md="12" :sm="24">
        <a-form-item label="病症">
          <a-textarea
            :maxLength="300"
            style="resize: none;width: 97%"
            placeholder="请输入病症"
            v-decorator="['disease', { rules: [{ required: true, message: '请输入病症', whitespace: true }] }]"
          />
        </a-form-item>
      </a-col>
      <a-col :lg="8" :md="12" :sm="24">
        <a-form-item label="备注">
          <a-textarea
            :maxLength="310"
            style="resize: none;width: 98%"
            placeholder="请输入备注"
            v-decorator="['remark', { rules: [{ required: false, message: '请输入用法用量', whitespace: true }] }]"
          />
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
    ...mapGetters(['recipeTemplateType', 'recipeTypes', 'grabMedicineTypes'])
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
    }
  }
}
</script>
