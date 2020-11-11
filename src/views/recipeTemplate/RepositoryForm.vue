<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item label="模板名称">
          <a-input
            placeholder="请输入模板名称"
            v-decorator="[
              'recipeTemplateName',
              {rules: [{ required: true, message: '请输入模板名称', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item label="处方类型">
          <a-select placeholder="请选择处方类型" v-decorator="[ 'recipeType', {rules: [{ required: true, message: '请选择处方类型'}]} ]">
            <a-select-option v-for="item in recipeTypes" :value="item.value" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item label="抓药方式">
          <a-select
            placeholder="请选择抓药方式"
            v-decorator="['grabMedicineType', { rules: [{ required: true, message: '请选择抓药方式' }] }]"
          >
            <a-select-option v-for="item in grabMedicineTypes" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item label="贴数">
          <a-input-number
            :min="1"
            style="width: 100%"
            placeholder="请填写贴数"
            v-decorator="['postNumbers', { rules: [{ required: true, message: '请填写贴数' }] }]"
          >
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item label="每贴包数">
          <a-select
            placeholder="请选择每贴包数"
            v-decorator="['postPackageNumbers', { rules: [{ required: true, message: '请选择每贴包数' }] }]"
          >
            <a-select-option :value="1">1</a-select-option>
            <a-select-option :value="2">2</a-select-option>
            <a-select-option :value="3">3</a-select-option>
            <a-select-option :value="4">4</a-select-option>
            <a-select-option :value="5">5</a-select-option>
            <a-select-option :value="6">6</a-select-option>
            <a-select-option :value="7">7</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="4" :md="12" :sm="24">
        <a-form-item label="每包容量(ml)">
          <a-select
            placeholder="请选择每包容量"
            v-decorator="['packageCap', { rules: [{ required: true, message: '请选择每包容量' }] }]"
          >
            <a-select-option :value="100">100</a-select-option>
            <a-select-option :value="120">120</a-select-option>
            <a-select-option :value="150">150</a-select-option>
            <a-select-option :value="200">200</a-select-option>
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
        <a-form-item label="用法用量">
          <a-textarea
            :maxLength="300"
            style="resize: none;width: 97%"
            placeholder="请输入用法用量"
            v-decorator="['usage', { rules: [{ required: true, message: '请输入用法用量', whitespace: true }] }]"
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
