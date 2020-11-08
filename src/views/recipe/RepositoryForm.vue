<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="5" :md="12" :sm="24">
        <a-form-item label="患者姓名">
          <a-input-group compact>
            <a-select
              show-search
              label-in-value
              placeholder="请输入患者姓名或拼音"
              style="width: 80%"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchUser"
              @change="(value,option) => handleChange(value,option)"
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
            <a-tooltip placement="top">
              <template slot="title">
                <span>添加新患者</span>
              </template>
              <a-button style="width: 20%" @click="showCreateModal"><a-icon type="plus" /></a-button>
            </a-tooltip>
          </a-input-group>
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
            :maxLength="300"
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
            :maxLength="300"
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
            :maxLength="300"
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
    <create-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-form>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import { findPatientSelect, saveOrUpdate } from '@/api/patientInfo​'
import CreateForm from '../patient/modules/CreateForm'

export default {
  name: 'RepositoryForm',
  components: {
    CreateForm
  },
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
      fetching: false,
      visible: false,
      confirmLoading: false,
      mdl: null
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
          const data = res.data && res.data.map(user => ({
            label: user.patientName,
            value: user.id,
            birthday: user.birthday,
            address: user.address,
            hyperSusceptibility: user.hyperSusceptibility,
            tel: user.tel,
            sex: user.sex
          }))
          this.data = data
          this.fetching = false
        })
    },
    handleChange (value, option) {
      const { form: { setFieldsValue } } = this
      const patientInfo = this.data.filter(item => item.value === value.key)
      const { address, birthday, hyperSusceptibility, tel, sex } = patientInfo[0]
      this.patientGender = sex
      this.birthday = birthday
      setFieldsValue({
        hyperSusceptibility,
        tel,
        address
      })
      Object.assign(this, {
        fetching: false
      })
    },
     handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            saveOrUpdate({ ...values }).then(res => {
              if (res.success) {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('新增成功')
              } else {
                this.$message.info(res.message)
                this.confirmLoading = false
              }
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    showCreateModal () {
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
