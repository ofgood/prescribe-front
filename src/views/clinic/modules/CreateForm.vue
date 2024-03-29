<template>
  <a-modal
    :title="model && model.id > 0 ? '编辑诊所' : '新建诊所'"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="confirm"
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
        <a-form-item label="诊所名称">
          <a-input
            :maxLength="50"
            v-decorator="['clinicName', { rules: [{ required: true, message: '请输入诊所名称' }] }]"
            placeholder="请输入诊所名称"
          />
        </a-form-item>
        <a-form-item label="区域">
          <a-select
            style="width: 100%"
            show-search
            placeholder="请输入关键字查找区域"
            :show-arrow="false"
            :default-active-first-option="false"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            optionLabelProp="label"
            @search="fetcharea"
            @focus="fetcharea"
            v-decorator="['areaId', { rules: [{ required: true, message: '请输选择区域' }] }]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.value" :label="d.text">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="诊所地址">
          <a-input
            :maxLength="50"
            v-decorator="['address', { rules: [{ required: true, message: '请输入诊所地址' }] }]"
            placeholder="请输入诊所地址"
          />
        </a-form-item>
        <a-form-item label="诊所电话">
          <a-input
            :maxLength="20"
            v-decorator="[
              'clinicTel',
              { rules: [{ required: true, message: '请输入诊所电话' }, { validator: validatePhone }], trigger: 'blur' },
            ]"
            placeholder="请输入诊所电话"
          />
        </a-form-item>
        <a-form-item label="负责人姓名">
          <a-select
            ref="responsibleList"
            style="width: 100%"
            show-search
            key="id"
            mode="multiple"
            placeholder="选择负责人"
            :show-arrow="false"
            :default-active-first-option="false"
            :not-found-content="respfetching ? undefined : null"
            :filter-option="false"
            @search="fetchResponsible"
            v-decorator="['responsibleList', { rules: [{ required: true, message: '请输选择选择负责人' }] }]"
          >
            <a-spin v-if="respfetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in respSelects" :key="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea
            :auto-size="{ minRows: 2, maxRows: 3 }"
            :maxLength="300"
            v-decorator="['remark']"
            placeholder="请输入备注"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
import { validateCellPhone, validatePhone } from '@/utils/validates'
import { selectArea, getAreaById } from '@/api/area'
import { clinicFindById } from '@/api/clinic'
import { findUserListByKey } from '@/api/user'
import debounce from 'lodash/debounce'
// 表单字段
const fields = ['clinicName', 'id', 'responsibleList', 'clinicTel', 'address', 'areaId', 'remark']
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
    this.lastFetchId = 0
    this.resLastFetchId = 0
    this.fetcharea = debounce(this.fetcharea, 500)
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
      respfetching: false,
      selects: [],
      respSelects: [],
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
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      console.log(this.model)
      this.$nextTick(() => {
        // this.fetcharea()
        if (this.model && this.model.id) {
          // this.getAreaList(this.model.areaId)
          this.getClinicById(this.model.id).then((res) => {
            if (res) {
              const data = []
              res.areaInfoSelectListVos.forEach((r) => {
                data.push({
                  value: r['id'],
                  text: r['areaPath'],
                  ...r
                })
              })
              this.selects = data
              // res.clinicIds = res.clinicIds.split(',')
              res.id = this.model.id
              const respData = []
              this.responsibleList = []
              console.log(res.responsibles)
              res.responsibles.forEach((r) => {
                respData.push({
                  value: r['id'],
                  text: r['realName'],
                  ...r
                })
                this.responsibleList.push(r['id'])
              })
              this.respSelects = respData
              res.responsibleList = this.responsibleList
              this.form.setFieldsValue(pick(res, fields))
            }
          })
        }
      })
    })
  },
  methods: {
    confirm () {
      this.$emit('ok', this.respSelects)
    },
     fetchResponsible (value = '') {
      if (!value) return
      this.resLastFetchId += 1
      const fetchId = this.resLastFetchId
      this.respfetching = true
      findUserListByKey({ key: value })
        .then((d) => {
          if (fetchId !== this.resLastFetchId) {
            return
          }
          const result = d.data || []
          const data = []
          result.forEach((r) => {
            data.push({
              value: r['id'],
              text: r['realName'],
              ...r
            })
          })
          this.respSelects = data
        })
        .finally(() => {
          this.respfetching = false
        })
    },
    fetcharea (value = '') {
      if (!value) {
        return
      }
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      console.log('fetchId', fetchId)
      console.log('this.lastFetchId', this.lastFetchId)
      this.data = []
      this.fetching = true

      selectArea({ key: value })
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
              text: r['province'] + '/' + r['city'] + '/' + r['area'],
              ...r
            })
          })
          this.selects = data
        })
        .finally(() => {
          this.fetching = false
        })
    },
    getAreaList (id = '') {
      getAreaById({ id }).then((res) => {
        let data = []
        if (res.data) {
          const { id, province, city, area } = res.data
          data = [
            {
              value: id,
              text: province + '/' + city + '/' + area
            }
          ]
        }
        this.selects = data
      })
    },
    handleSearch (value) {
      this.fetch(value, (data) => (this.selects = data))
    },
    getClinicById (id) {
      return new Promise((resolve, reject) => {
        clinicFindById({ id })
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
