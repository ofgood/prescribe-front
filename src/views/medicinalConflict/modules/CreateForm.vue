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
            key="medicinalName"
            placeholder="药品名称"
            :show-arrow="false"
            :default-active-first-option="false"
            :not-found-content="fetching ? undefined : null"
            :filter-option="false"
            @search="handleSearch"
            v-decorator="[
              'medicinalName',
              {rules: [{ required: true, message: '请输入药品名称'}]}
            ]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.value" :itemData="d">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="冲突药品名称">
          <a-select
            show-search
            key="medicinalName"
            placeholder="请输入冲突药品名称"
            :show-arrow="false"
            :default-active-first-option="false"
            :not-found-content="fetching ? undefined : null"
            :filter-option="false"
            @search="handleSearch"
            v-decorator="[
              'conflictMedicinalName',
              {rules: [{ required: true, message: '请输入冲突药品名称'}]}
            ]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.value" :itemData="d">
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
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    })
    this.GetClinicList()
  },
  methods: {
    ...mapActions(['GetClinicList']),
    filterOption,
     fetch (value, callback) {
       if (!value) {
         return
       }
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
