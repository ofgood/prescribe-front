<template>
  <a-modal
    :title="model && model.id > 0 ? '编辑药品': '新建药品'"
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
        <a-form-item label="药品名称">
          <a-input :maxLength="20" v-decorator="['medicinalName', {rules: [{required: true, message: '请输入药品名称'}]}]" placeholder="请输入药品名称"/>
        </a-form-item>
        <a-form-item label="药品编码">
          <a-input :maxLength="20" v-decorator="['medicinalCode', {rules: [{required: true, message: '请输入药品编码'}]}]" placeholder="请输入药品编码"/>
        </a-form-item>
        <a-form-item label="单位">
          <a-input :maxLength="10" v-decorator="['unit', {initialValue: 'g'} , {rules: [{required: true, message: '请输入单位'}]}]" placeholder="请输入单位"/>
        </a-form-item>
        <a-form-item label="药品价格">
          <a-input placeholder="请输入药品价格" prefix="￥" v-decorator="['price', { initialValue: '0.00', trigger:'blur', rules: [{required: true, message: '请输入药品价格'},{validator: validatePrice}] }]"/>
        </a-form-item>
        <a-form-item label="药品来源">
          <a-input :maxLength="30" v-decorator="['origin', {rules: [{required: false, message: '请输入药品来源'}]}]" placeholder="请输入药品来源"/>
        </a-form-item>
        <a-form-item label="药品规格" v-show="false">
          <a-input :maxLength="30" v-decorator="['medicinalStand',{ initialValue:'1' }]" placeholder="请输入药品来源"/>
        </a-form-item>
        <a-form-item label="药品剂量">
          <a-input :maxLength="10" v-decorator="['dosage']" placeholder="请输入药品剂量"/>
        </a-form-item>
        <a-form-item label="药品单贴最大允许剂量">
          <a-input :maxLength="10" v-decorator="['maxDosage']" placeholder="请输入药品最大剂量"/>
        </a-form-item>
        <a-form-item label="药品处理方式">
          <a-select placeholder="请输入药品处理方式" v-decorator="['druggingOrder', {rules: [{required: false, message: '请输入药品煎煮顺序'}]}]">
            <a-select-option v-for="item in druggingOrders" :key="item.value">
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
import { mapGetters } from 'vuex'
import { filterOption } from '@/utils/util'
import { validatePrice } from '@/utils/validates'
// 表单字段
const fields = ['medicinalName', 'id', 'medicinalCode', 'medicinalStand', 'unit', 'price', 'origin', 'dosage', 'maxDosage', 'druggingOrder']
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
      validatePrice,
      form: this.$form.createForm(this)
    }
  },
  computed: {
     ...mapGetters(['medicinalStands', 'druggingOrders'])
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
  },
  methods: {
    filterOption
  }
}
</script>
