<template>
  <a-modal
    title="新建药品冲突"
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
          <a-select
            v-decorator="['medicinalName', {rules: [{required: true, message: '请输药品名称'}]}]"
            show-search
            :value="value"
            placeholder="请输药品名称"
            style="width: 200px"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSearch('')"
            @change="handleChange"
          >
            <a-select-option v-for="d in data" :key="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
          <a-input v-decorator="['medicinalName', {rules: [{required: true, message: '请输药品名称'}]}]" placeholder="请输入药品名称"/>
        </a-form-item>
        <a-form-item label="冲突药品名称">
          <a-input placeholder="请输入冲突药品名称" v-decorator="['conflictMedicinalName', {rules: [{required: true, message: '请输入冲突药品名称'}]}]" />
        </a-form-item>
        <a-form-item label="冲突类型">
          <a-select placeholder="请选择冲突类型" v-decorator="['conflictType', {rules: [{required: true, message: '请选择冲突类型'}]}]">
            <a-select-option v-for="item in conflictType" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea
            v-decorator="['remark', {rules: [{required: false, message: ''}]}]"
            placeholder="请输入备注"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
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
     ...mapGetters(['conflictType'])
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
