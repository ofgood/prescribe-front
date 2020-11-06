<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="5" :md="12" :sm="24">
        <a-form-item label="患者姓名">
          <a-select
            show-search
            label-in-value
            placeholder="请输入患者姓名或拼音"
            style="width: 100%"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchUser"
            @change="handleChange"
            v-decorator="[
              'patientId',
              {rules: [{ required: true, message: '请输入患者姓名'}]}
            ]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in data" :value="d.value" :key="d.value">
              {{ d.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="5" :md="12" :sm="24">
        <a-form-item
          label="患者性别">
          <a-select disabled :show-arrow="false" placeholder="请选择患者性别" v-model="patientGender">
            <a-select-option v-for="item in gender" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="5" :md="12" :sm="24">
        <a-form-item
          label="电话">
          <a-input
            placeholder="请输入电话"
            v-decorator="[
              'tel',
              {rules: [{ required: true, message: '请输入电话', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="5" :md="12" :sm="24">
        <a-form-item
          label="出生年月">
          <a-date-picker v-model="birthday" disabled style="width:100%" placeholder="请选择出生日期" valueFormat="YYYY-MM-DD" />
        </a-form-item>
      </a-col>

    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="5" :md="12" :sm="24">
        <a-form-item
          label="过敏史">
          <a-textarea
            style="resize:none"
            placeholder="请输入过敏史"
            v-decorator="[
              'hyperSusceptibility',
              {rules: [{ required: false, message: '请输入过敏史', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="5" :md="12" :sm="24">
        <a-form-item
          label="家庭住址">
          <a-textarea
            style="resize:none"
            placeholder="请输入家庭住址"
            v-decorator="[
              'address',
              {rules: [{ required: false, message: '请输入家庭住址', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="5" :md="12" :sm="24">
        <a-form-item
          label="配送地址">
          <a-textarea
            style="resize:none"
            placeholder="请输入配送地址"
            v-decorator="[
              'shippingAddress',
              {rules: [{ required: true, message: '请输入配送地址'}]}
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit" >Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import { findPatientSelect } from '@/api/patientInfo​'
export default {
  name: 'RepositoryForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
    return {
      form: this.$form.createForm(this),
      patientGender: '',
      birthday: null,
      data: [],
      fetching: false
    }
  },
  computed: {
    ...mapGetters(['gender'])
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    validate (rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        callback(new Error('需要以 user- 开头'))
      }
      callback()
    },
     fetchUser (value) {
      console.log('fetching user', value)
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true
     findPatientSelect({
       key: value
     }).then(res => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }
          const data = res.data.map(user => ({
            label: user.patientName,
            value: user.idCard
          }))
          this.data = data
          this.fetching = false
        })
    },
    handleChange (value) {
      console.log(value)
      Object.assign(this, {
        data: [],
        fetching: false
      })
    }
  }
}
</script>

<style scoped>

</style>
