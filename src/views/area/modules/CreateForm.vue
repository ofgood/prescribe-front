<template>
  <a-modal
    :title="model && model.id > 0 ? '编辑区域': '新建区域'"
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
        <a-form-item label="区域名称">
          <a-input
            :maxLength="30"
            v-decorator="['area', { rules: [{ required: true, whitespace: true, message: '请输入区域名称' }] }]"
            placeholder="请输入区域名称"
          />
        </a-form-item>
        <a-form-item label="负责人姓名">
          <a-select
            ref="responsibleList"
            style="width: 100%"
            show-search
            key="id"
            @change="changeResponsible"
            mode="multiple"
            placeholder="选择负责人"
            :show-arrow="false"
            :default-active-first-option="false"
            :not-found-content="fetching ? undefined : null"
            :filter-option="false"
            @search="fetchclinics"
            v-decorator="['responsibleList', { rules: [{ required: true, message: '请输选择选择负责人' }] }]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所在省份">
          <a-input
            :maxLength="10"
            v-decorator="['province', { rules: [{ required: true, whitespace: true, message: '请输入所在省份' }] }]"
            placeholder="请输入所在省份"
          />
        </a-form-item>
        <a-form-item label="所在城市">
          <a-input
            :maxLength="10"
            placeholder="请输入所在城市"
            v-decorator="['city', { rules: [{ required: true, whitespace: true, message: '请输入所在城市' }] }]"
          />
        </a-form-item>
        <a-form-item label="所在区(县)">
          <a-input
            :maxLength="10"
            placeholder="所在区(县)"
            v-decorator="['areaName', { rules: [{ required: true, whitespace: true, message: '所在区(县)' }] }]"
          />
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
import { validateCellPhone } from '@/utils/validates'
import { getAreaById } from '@/api/area'
import pick from 'lodash.pick'
import { findUserListByKey } from '@/api/user'
// 表单字段
const fields = ['area', 'province', 'id', 'city', 'responsibleList', 'remark', 'areaName']
export default {
  name: 'CreateAreaForm',
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
      form: this.$form.createForm(this),
      validateCellPhone,
      selects: [],
      responsibles: [],
      responsibleList: [],
      selectResponsibleList: []
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.$nextTick(() => {
        // this.model && this.form.setFieldsValue(pick(this.model, fields))
        if (this.model && this.model.id) {
          this.getAreaById(this.model.id).then((res) => {
            if (res) {
              res.id = this.model.id
              const data = []
              this.responsibleList = []
              this.responsibles = []
              if (Array.isArray(res.responsibles)) {
                this.responsibles = [...res.responsibles]
              }
              res.responsibles.forEach((r) => {
                data.push({
                  value: r['id'],
                  text: r['realName'],
                  ...r
                })
                this.responsibleList.push(r['id'])
              })
              this.selects = data
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
      this.$emit('ok', this.selectResponsibleList)
    },
     fetchclinics (value = '') {
      if (!value) return
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true
      findUserListByKey({ key: value })
        .then((d) => {
          console.log(d)
          if (fetchId !== this.lastFetchId) {
            return
          }
          const result = d.data || []
          console.log(result)
          const data = []
          result.forEach((r) => {
            data.push({
              value: r['id'],
              text: r['realName'],
              ...r
            })
          })
          this.selects = data
          this.responsibles = [...this.responsibles, ...result]
        })
        .finally(() => {
          this.fetching = false
        })
    },
    getAreaById (id) {
      return new Promise((resolve, reject) => {
        getAreaById({ id })
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
    },
    changeResponsible (resIds, option) {
      this.selectResponsibleList = []
      if (resIds.length) {
        for (let i = 0; i < resIds.length; i++) {
          for (let j = 0; j < this.responsibles.length; j++) {
            if (this.responsibles[j].id === resIds[i]) {
              this.selectResponsibleList.push(this.responsibles[j])
              break
            }
          }
        }
      }
    }
  }
}
</script>
