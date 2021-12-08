<template>
  <a-modal
    :title="model && model.id > 0 ? '编辑客户': '新建客户'"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="false" v-if="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="客户名称">
          <a-input :maxLength="20" v-decorator="['customerName', {rules: [{required: true, message: '请输入客户名称'}]}]" placeholder="请输入客户名称"/>
        </a-form-item>
        <a-form-item label="工号">
          <a-input :disabled="model && model.id > 0" :maxLength="20" v-decorator="['jobNumber', {rules: [{required: true, message: '请输入工号'}]}]" placeholder="请输入工号"/>
        </a-form-item>
        <a-form-item label="客户电话">
          <a-input :maxLength="20" v-decorator="['customerPhone',{rules: [{validator: validatePhone}],trigger: 'blur'}]" placeholder="请输入客户电话"/>
        </a-form-item>
        <a-form-item label="联系人">
          <a-input :maxLength="10" placeholder="请输入联系人姓名" v-decorator="['linkMen', {rules: [{required: true, message: '请输入联系人姓名'}]}]" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input placeholder="请输入联系电话" v-decorator="['linkTel', {rules: [{required: true, message: '请输入联系电话'},{validator: validateCellPhone}],trigger: 'blur'}]" />
        </a-form-item>
        <a-form-item label="法人姓名">
          <a-input :maxLength="10" placeholder="请输入法人姓名" v-decorator="['legalPerson', {rules: [{required: true, message: '请输入法人姓名'}]}]" />
        </a-form-item>
        <a-form-item label="合作开始时间">
          <a-date-picker style="width:100%" placeholder="请选择合作开始时间" valueFormat="YYYY-MM-DD" v-decorator="['cooperationStartTime', {rules: [{required: true, message: '请选择出生日期'}]}]" />
        </a-form-item>
        <a-form-item label="合作结束时间">
          <a-date-picker style="width:100%" placeholder="请选择合作结束时间" valueFormat="YYYY-MM-DD" v-decorator="['cooperationEndTime', {rules: [{required: true, message: '请选择出生日期'}]}]" />
        </a-form-item>
        <a-form-item label="地址">
          <a-textarea :auto-size="{ minRows: 2, maxRows: 3 }" :maxLength="30" placeholder="请输入地址" v-decorator="['address', {rules: [{required: true, message: '请输入地址'}]}]" />
        </a-form-item>
        <a-form-item label="是否禁用">
          <a-select
            placeholder="是否禁用"
            v-decorator="['disableStatus', { initialValue:false }, { rules: [{ required: true, message: '请选择是否禁用' }] }]"
          >
            <a-select-option v-for="item in disableStatusList" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { validatePhone, validateCellPhone } from '@/utils/validates'
// 表单字段
const fields = [
  'jobNumber',
  'customerName',
  'customerPhone',
  'disableStatus',
  'id',
  'linkMen',
  'linkTel',
  'legalPerson',
  'cooperationStartTime',
  'cooperationEndTime',
  'address'
]
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
      disableStatusList: [
        {
          label: '否',
          value: false
        },
        {
          label: '是',
          value: true
        }
      ],
      validatePhone,
      validateCellPhone,
      form: this.$form.createForm(this)
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.$nextTick(() => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    })
  }
}
</script>
