<template>
  <a-modal
    :title="model && model.id > 0 ? '编辑药品冲突': '新建药品冲突'"
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
          <a-select
            show-search
            placeholder="药品名称"
            :show-arrow="false"
            labelInValue
            :default-active-first-option="false"
            :not-found-content="fetching ? undefined : null"
            :filter-option="false"
            optionLabelProp="label"
            @search="fetchMedicineConflict"
            v-decorator="[
              'medicinalName',
              {rules: [{ required: true, message: '请输入药品名称'}]}
            ]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.id" :label="d.text">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="冲突药品名称">
          <a-select
            show-search
            placeholder="请输入冲突药品名称"
            :show-arrow="false"
            labelInValue
            :default-active-first-option="false"
            :not-found-content="fetching ? undefined : null"
            :filter-option="false"
            @search="fetchMedicineConflict"
            v-decorator="[
              'conflictMedicinalName',
              {rules: [{ required: true, message: '请输入冲突药品名称'}]}
            ]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.id">
              {{ d.text }}
            </a-select-option>
          </a-select>
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
            :maxLength="300"
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
import { medicinalSelect } from '@/api/medicinal'
import debounce from 'lodash/debounce'
// 表单字段
const fields = ['medicinalName', 'id', 'conflictMedicinalName', 'conflictType', 'remark']
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
    this.fetchMedicineConflict = debounce(this.fetchMedicineConflict, 500)
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
      fetching: false,
      selects: []
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
      this.$nextTick(() => {
        if (this.model && this.model.id) {
            this.model.conflictMedicinalName = {
              key: this.model.conflictMedicinalCode,
              label: this.model.conflictMedicinalName
            }
            this.model.medicinalName = {
              key: this.model.medicinalCode,
              label: this.model.medicinalName
            }
        }
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    })
    this.GetClinicList()
  },
  methods: {
    ...mapActions(['GetClinicList']),
    filterOption,
     fetchMedicineConflict (value = '', type) {
      if (!value) {
        return
      }
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      console.log('fetchId', fetchId)
      console.log('this.lastFetchId', this.lastFetchId)
      this.data = []
      this.fetching = true

      medicinalSelect({ key: value })
        .then((d) => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }
          const result = d.data || []
          const data = []
          result.forEach((r) => {
                data.push({
                  value: r['medicinalCode'],
                  text: r['medicinalName'],
                  ...r
                })
          })
          this.selects = data
        })
        .finally(() => {
          this.fetching = false
        })
    }
  }
}
</script>
