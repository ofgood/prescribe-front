<template>
  <a-modal
    title="新建处方模板"
    width="80%"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-if="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="模板名称">
          <a-input v-decorator="['recipeTemplateName', {rules: [{required: true, message: '请输入模板名称'}]}]" placeholder="请输入"/>
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input placeholder="请输入联系电话" v-decorator="['doctorTel', {rules: [{required: true, message: '请输入联系电话'}]}]" />
        </a-form-item>
        <a-form-item label="医生类别">
          <a-select placeholder="请选择医生类别" v-decorator="['doctorType', {rules: [{required: true, message: '请选择医生类别'}]}]">
            <a-select-option v-for="item in doctorType" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="诊所">
          <a-select mode="multiple" placeholder="请选择诊所" :filterOption="filterOption" v-decorator="['clinicIds', {rules: [{required: true, message: '请选择诊所'}]}]">
            <a-select-option v-for="item in clinics" :key="item.id">
              {{ item.clinicName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系地址">
          <a-input placeholder="请输入联系地址" v-decorator="['address', {rules: [{required: true, message: '请输入联系地址'}]}]" />
        </a-form-item>
        <a-form-item label="出生日期">
          <a-date-picker style="width:100%" placeholder="请选择出生日期" valueFormat="YYYY-MM-DD" v-decorator="['birthday', {rules: [{message: '请选择出生日期'}]}]" />
        </a-form-item>
        <a-form-item label="身份证号">
          <a-input placeholder="请输入" v-decorator="['idCard', {rules: [{required: false, message: ''}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters, mapActions } from 'vuex'
import { filterOption } from '@/utils/util'
// 表单字段
const fields = ['description', 'id']
export default {
  name: 'CreateDoctorForm',
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
      form: this.$form.createForm(this)
    }
  },
  computed: {
     ...mapGetters(['doctorType', 'clinics'])
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
    this.GetClinicList()
  },
  methods: {
    ...mapActions(['GetClinicList']),
    filterOption
  }
}
</script>
