<template>
  <a-modal
    :title="model && model.id > 0 ? '编辑医生': '新建医生'"
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
          <a-input :maxLength="10" v-decorator="['doctorName', {rules: [{required: true, message: '请输入医生姓名'}]}]" placeholder="请输入医生姓名"/>
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input placeholder="请输入联系电话" v-decorator="['doctorTel', {trigger:'blur',rules: [{required: true, message: '请输入联系电话'},{validator: validateCellPhone}]}]" />
        </a-form-item>
        <a-form-item label="医生类别">
          <a-select placeholder="请选择医生类别" v-decorator="['doctorType', {rules: [{required: true, message: '请选择医生类别'}]}]">
            <a-select-option v-for="item in doctorType" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="诊所">
          <a-select
            style="width: 100%"
            show-search
            key="id"
            mode="multiple"
            placeholder="选择诊所"
            :show-arrow="false"
            :default-active-first-option="false"
            :not-found-content="fetching ? undefined : null"
            :filter-option="false"
            @search="handleSearch"
            v-decorator="['clinicIds', {rules: [{required: true, message: '请输选择诊所'}]}]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.value" :itemData="d">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="工号">
          <a-input :maxLength="10" v-decorator="['jobNum', {rules: [{required: true, message: '请输入医生工号'}]}]" placeholder="请输入医生工号"/>
        </a-form-item>
        <a-form-item label="联系地址">
          <a-input :maxLength="30" placeholder="请输入联系地址" v-decorator="['address', {rules: [{required: true, message: '请输入联系地址'}]}]" />
        </a-form-item>
        <a-form-item label="出生日期">
          <a-date-picker style="width:100%" placeholder="请选择出生日期" valueFormat="YYYY-MM-DD" v-decorator="['birthday', {rules: [{message: '请选择出生日期'}]}]" />
        </a-form-item>
        <a-form-item label="身份证号">
          <a-input placeholder="请输入身份证号" v-decorator="['idCard', {trigger: 'blur',rules: [{required: false, message: ''}, {validator: validateIdCard}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters, mapActions } from 'vuex'
import { filterOption } from '@/utils/util'
import { validateCellPhone, validateIdCard } from '@/utils/validates'
import { clinicSelect } from '@/api/clinic'
// 表单字段
const fields = ['doctorName', 'id', 'doctorTel', 'doctorType', 'clinicIds', 'jobNum', 'address', 'birthday', 'idCard']
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
      fetching: false,
      validateIdCard,
      validateCellPhone,
      form: this.$form.createForm(this),
      selects: []
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
      this.$nextTick(() => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    })
    // this.GetClinicList()
  },
  methods: {
    ...mapActions(['GetClinicList']),
    filterOption,
     handleSearch (value) {
      this.fetch(value, (data) => (this.selects = data))
    },
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
        clinicSelect(params)
          .then((d) => {
            if (this.currentValue === value) {
              const result = d.data || []
              const data = []
              result.forEach((r) => {
                data.push({
                  value: r['id'],
                  text: r['clinicName'],
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
    }
  }
}
</script>
