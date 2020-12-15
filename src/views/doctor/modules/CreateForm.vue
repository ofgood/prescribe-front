<template>
  <a-modal
    :title="model && model.id > 0 ? '编辑医生' : '新建医生'"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok')
      }
    "
    @cancel="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="false" v-if="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input
            :maxLength="10"
            v-decorator="['doctorName', { rules: [{ required: true, message: '请输入医生姓名' }] }]"
            placeholder="请输入医生姓名"
          />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input
            placeholder="请输入联系电话"
            v-decorator="[
              'doctorTel',
              {
                trigger: 'blur',
                rules: [{ required: true, message: '请输入联系电话' }, { validator: validateCellPhone }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="医生类别">
          <a-select
            placeholder="请选择医生类别"
            v-decorator="['doctorType', { rules: [{ required: true, message: '请选择医生类别' }] }]"
          >
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
            @search="fetchclinics"
            v-decorator="['clinicIds', { rules: [{ required: true, message: '请输选择诊所' }] }]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="工号">
          <a-input
            :maxLength="10"
            v-decorator="['jobNum', { rules: [{ required: true, message: '请输入医生工号' }] }]"
            placeholder="请输入医生工号"
          />
        </a-form-item>
        <a-form-item label="联系地址">
          <a-input
            :maxLength="30"
            placeholder="请输入联系地址"
            v-decorator="['address', { rules: [{ required: true, message: '请输入联系地址' }] }]"
          />
        </a-form-item>
        <a-form-item label="出生日期">
          <a-date-picker
            style="width: 100%"
            placeholder="请选择出生日期"
            valueFormat="YYYY-MM-DD"
            v-decorator="['birthday', { rules: [{ message: '请选择出生日期' }] }]"
          />
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
import { findDoctor } from '@/api/doctor'
import debounce from 'lodash/debounce'
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
    fields.forEach((v) => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.$nextTick(() => {
        // this.fetchclinics()
        console.log(this.model)
        if (this.model && this.model.id) {
          this.getDoctorById(this.model.id).then((res) => {
            if (res) {
              const data = []
              res.clinicInfoVos.forEach((r) => {
                data.push({
                  value: r['id'],
                  text: r['clinicName'],
                  ...r
                })
              })
              this.selects = data
              res.clinicIds = res.clinicIds.split(',')
              res.id = this.model.id
              this.form.setFieldsValue(pick(res, fields))
            }
          })
        }
      })
    })
    // this.GetClinicList()
  },
  methods: {
    ...mapActions(['GetClinicList']),
    filterOption,
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
    getDoctorById (id) {
      return new Promise((resolve, reject) => {
        findDoctor({ id })
          .then((res) => {
            if (res.data) {
              resolve(res.data)
            } else {
              reject(res)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
}
</script>
