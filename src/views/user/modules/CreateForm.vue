<template>
  <a-modal
    :title="model && model.id > 0 ? '编辑用户': '新建用户'"
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
        <a-form-item label="工号">
          <a-input :disabled="model && model.id > 0" :maxLength="20" v-decorator="['jobNum', {rules: [{required: true, message: '请输入工号'}]}]" placeholder="请输入工号"/>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input :maxLength="20" v-decorator="['userName', {rules: [{required: true, message: '请输入用户名'}]}]" placeholder="请输入用户名"/>
        </a-form-item>
        <a-form-item label="用户类型">
          <a-select
            @change="changeUserType"
            placeholder="请选择用户类型"
            v-decorator="['userType', { rules: [{ required: true, message: '请选择用户类型' }] }]"
          >
            <a-select-option v-for="item in userTypes" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="isShowClinic" label="诊所">
          <a-select
            style="width: 100%"
            show-search
            key="id"
            mode="multiple"
            placeholder="选择诊所(输入关键字搜索)"
            :show-arrow="false"
            :default-active-first-option="false"
            :not-found-content="fetching ? undefined : null"
            :filter-option="false"
            @search="fetchclinics"
            v-decorator="['clinicIds', { rules: [{ required: true, message: '请输选择诊所' }] }]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否启用">
          <a-select
            placeholder="请选择用户状态"
            v-decorator="['status',{initialValue: 'Y'}, { rules: [{ required: true, message: '请选择用户状态' }] }]"
          >
            <a-select-option v-for="item in userStatus" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="真实姓名">
          <a-input :maxLength="10" placeholder="请输入联系人姓名" v-decorator="['realName', {rules: [{required: true, message: '请输入真实姓名'}]}]" />
        </a-form-item>
        <a-form-item label="出生日期">
          <a-date-picker style="width:100%" placeholder="请选择出生日期" valueFormat="YYYY-MM-DD" v-decorator="['birthday', {rules: [{required: true, message: '请选择出生日期'}]}]" />
        </a-form-item>
        <a-form-item label="身份证号">
          <a-input
            placeholder="请输入身份证号"
            v-decorator="[
              'idCard',
              { trigger: 'blur', rules: [{ required: false, message: '' }, { validator: validateIdCard }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="联系地址">
          <a-input
            :maxLength="30"
            placeholder="请输入联系地址"
            v-decorator="['address', { rules: [{ required: true, message: '请输入联系地址' }] }]"
          />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input placeholder="请输入联系电话" v-decorator="['tel', {rules: [{required: true, message: '请输入联系电话'},{validator: validateCellPhone}],trigger: 'blur'}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { validatePhone, validateCellPhone, validateIdCard } from '@/utils/validates'
import { mapGetters } from 'vuex'
import { clinicSelect } from '@/api/clinic'
import debounce from 'lodash/debounce'
// 表单字段
const fields = [
  'jobNum',
  'userName',
  'userType',
  'status',
  'realName',
  'id',
  'birthday',
  'tel',
  'idCard',
  'address'
]
export default {
  name: 'CreateUserForm',
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
    this.lastFetchId = 0
    this.fetchclinics = debounce(this.fetchclinics, 500)
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
      userStatus: [
        {
          label: '启用',
          value: 'Y'
        },
        {
          label: '禁用',
          value: 'N'
        }
      ],
      validatePhone,
      validateCellPhone,
      validateIdCard,
      form: this.$form.createForm(this),
      selects: [],
      userType: ''
    }
  },
  computed: {
    ...mapGetters(['userTypes']),
    isShowClinic () {
      return this.userType === 'DOCTOR' || this.userType === 'DOCTOR_STAR'
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
  },
  methods: {
     fetchclinics (value = '') {
      if (!value) return
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true
      clinicSelect({ key: value })
        .then((d) => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }
          const result = d.data || []
          const data = []
          result.forEach((r) => {
            data.push({
              value: r['id'],
              text: r['clinicName'],
              ...r
            })
          })
          this.selects = data
        })
        .finally(() => {
          this.fetching = false
        })
    },
    changeUserType (data) {
      console.log(data)
      this.userType = data
    }
  }
}
</script>
