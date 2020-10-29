<template>
  <a-modal
    title="新建诊所"
    :width="640"
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
        <a-form-item label="诊所名称">
          <a-input v-decorator="['clinicName', {rules: [{required: true, message: '请输入诊所名称'}]}]" placeholder="请输入诊所名称"/>
        </a-form-item>
        <a-form-item label="诊所地址">
          <a-input v-decorator="['address', {rules: [{required: true, message: '请输入诊所地址'}]}]" placeholder="请输入诊所地址"/>
        </a-form-item>
        <a-form-item label="诊所电话">
          <a-input v-decorator="['clinicTel', {rules: [{required: true, message: '请输入诊所电话'}]}]" placeholder="请输入诊所电话"/>
        </a-form-item>
        <a-form-item label="负责人">
          <a-input v-decorator="['responsible', {rules: [{required: true, message: '请输入负责人姓名'}]}]" placeholder="请输入负责人姓名"/>
        </a-form-item>
        <a-form-item label="负责人电话">
          <a-input v-decorator="['responsibleTel', {rules: [{required: true, message: '请输入负责人电话'}]}]" placeholder="请输入负责人电话"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'

// 表单字段
const fields = ['description', 'id']
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
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
