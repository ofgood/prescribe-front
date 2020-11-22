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
        <a-form-item v-show="false" v-if="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="诊所名称">
          <a-input :maxLength="50" v-decorator="['clinicName', {rules: [{required: true, message: '请输入诊所名称'}]}]" placeholder="请输入诊所名称"/>
        </a-form-item>
        <a-form-item label="区域">
          <a-select
            style="width: 100%"
            show-search
            key="medicinalName"
            placeholder="选择区域"
            :show-arrow="false"
            :default-active-first-option="false"
            :not-found-content="fetching ? undefined : null"
            :filter-option="false"
            @search="handleSearch"
            v-decorator="['areaId', {rules: [{required: true, message: '请输选择区域'}]}]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.value" :itemData="d">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="诊所地址">
          <a-input :maxLength="50" v-decorator="['address', {rules: [{required: true, message: '请输入诊所地址'}]}]" placeholder="请输入诊所地址"/>
        </a-form-item>
        <a-form-item label="诊所电话">
          <a-input :maxLength="20" v-decorator="['clinicTel', {rules: [{required: true, message: '请输入诊所电话'}, {validator: validatePhone}],trigger: 'blur'}]" placeholder="请输入诊所电话"/>
        </a-form-item>
        <a-form-item label="负责人">
          <a-input :maxLength="10" v-decorator="['responsible', {rules: [{required: true, message: '请输入负责人姓名'}]}]" placeholder="请输入负责人姓名"/>
        </a-form-item>
        <a-form-item label="负责人电话">
          <a-input v-decorator="['responsibleTel', {rules: [{required: true, message: '请输入负责人电话'}, {validator: validateCellPhone}],trigger: 'blur'}]" placeholder="请输入负责人电话"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
import { validateCellPhone, validatePhone } from '@/utils/validates'
import { medicinalSelect } from '@/api/medicinal'
// 表单字段
const fields = ['clinicName', 'id', 'responsible', 'responsibleTel', 'clinicTel', 'address']
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
      fetching: false,
      selects: [],
      validateCellPhone,
      validatePhone,
      form: this.$form.createForm(this)
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
      console.log(this.model)
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
     fetch (value, callback) {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.fetching = true
      this.currentValue = value
      const fake = () => {
        const params = {
          key: value
        }
        medicinalSelect(params)
          .then((d) => {
            if (this.currentValue === value) {
              const result = d.data || []
              const data = []
              result.forEach((r) => {
                data.push({
                  value: r['medicinalCode'],
                  text: r['medicinalName'],
                  ...r
                })
              })
              callback(data)
            }
          })
          .finally(() => {
            this.fetching = false
          })
      }
      this.timeout = setTimeout(fake, 300)
    },
    handleSearch (value) {
      this.fetch(value, (data) => (this.selects = data))
    }
  }
}
</script>
