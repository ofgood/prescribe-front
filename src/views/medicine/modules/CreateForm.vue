<template>
  <a-modal
    title="新建药品"
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
        <a-form-item label="药品名称">
          <a-input v-decorator="['medicinalName', {rules: [{required: true, message: '请输入药品名称'}]}]" placeholder="请输入药品名称"/>
        </a-form-item>
        <a-form-item label="药品编码">
          <a-input v-decorator="['medicinalCode', {rules: [{required: true, message: '请输入药品编码'}]}]" placeholder="请输入药品编码"/>
        </a-form-item>
        <a-form-item label="药品规格">
          <a-select placeholder="请选择药品规格" v-decorator="['medicinalStand', {rules: [{required: true, message: '请选择药品规格'}]}]">
            <a-select-option v-for="item in medicinalStands" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="单位">
          <a-input v-decorator="['unit', {rules: [{required: true, message: '请输入单位'}]}]" placeholder="请输入单位"/>
        </a-form-item>
        <a-form-item label="药品价格">
          <a-input placeholder="请输入药品价格" prefix="￥" v-decorator="['price', { initialValue: '0.00', rules: [{required: true, message: '请输入药品价格'}] }]"/>
        </a-form-item>
        <a-form-item label="药品来源">
          <a-input v-decorator="['origin', {rules: [{required: true, message: '请输入药品来源'}]}]" placeholder="请输入药品来源"/>
        </a-form-item>
        <a-form-item label="药品剂量">
          <a-input v-decorator="['dosage']" placeholder="请输入药品剂量"/>
        </a-form-item>
        <a-form-item label="药品最大剂量">
          <a-input v-decorator="['maxDosage']" placeholder="请输入药品最大剂量"/>
        </a-form-item>
        <a-form-item label="药品煎煮顺序">
          <a-select placeholder="请输入药品煎煮顺序" v-decorator="['druggingOrder', {rules: [{required: true, message: '请输入药品煎煮顺序'}]}]">
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
     ...mapGetters(['medicinalStands', 'druggingOrders'])
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    filterOption
  }
}
</script>
