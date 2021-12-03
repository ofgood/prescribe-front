<template>
  <a-modal
    :title="model && model.id > 0 ? '编辑患者': '新建患者'"
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
        <a-form-item label="姓名">
          <a-input v-decorator="['patientName', {rules: [{required: true, message: '请输入患者姓名'}]}]" placeholder="请输入"/>
        </a-form-item>
        <a-form-item label="性别">
          <a-select placeholder="请选择性别" v-decorator="['sex', {rules: [{required: true, message: '请选择性别'}]}]">
            <a-select-option v-for="item in gender" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="出生日期">
          <a-date-picker style="width:100%" placeholder="请选择出生日期" valueFormat="YYYY-MM-DD" v-decorator="['birthday', {rules: [{required: true, message: '请选择出生日期'}]}]" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input placeholder="请输入联系电话" v-decorator="['tel', {rules: [{required: true, message: '请输入联系电话'}]}]" />
        </a-form-item>
        <a-form-item label="配送地址">
          <a-input placeholder="请输入配送地址" v-decorator="['shippingAddress', {rules: [{required: true, message: '请输入配送地址'}]}]" />
        </a-form-item>
        <a-form-item label="居住地址">
          <a-input placeholder="请输入居住地址" v-decorator="['address', {rules: [{required: true, message: '请输入居住地址'}]}]" />
        </a-form-item>
        <a-form-item label="过敏史">
          <a-input placeholder="请输入过敏史:没有填无" v-decorator="['hyperSusceptibility', {rules: [{required: false, message: '请输入过敏史:没有填无'}]}]" />
        </a-form-item>
        <a-form-item label="邮编">
          <a-input placeholder="请输入邮编" v-decorator="['zip', {rules: [{required: false, message: '请输入邮编'}]}]" />
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
import { mapGetters } from 'vuex'

// 表单字段
const fields = ['patientName', 'id', 'sex', 'birthday', 'tel', 'shippingAddress', 'hyperSusceptibility', 'zip', 'idCard', 'address']
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
      formData: {
        'address': 'string',
        'birthday': '2020-10-28T06:55:33.147Z',
        'hyperSusceptibility': 'string',
        'id': 0,
        'idCard': 'string',
        'job': 'string',
        'pageNum': 0,
        'pageSize': 0,
        'patientName': 'string',
        'patientPyCode': 'string',
        'sex': {},
        'status': 'string',
        'tel': 'string',
        'zip': 'string'
      }
    }
  },
   computed: {
     ...mapGetters(['gender'])
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.$nextTick(() => {
      console.log(this.model)
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    })
  }
}
</script>
