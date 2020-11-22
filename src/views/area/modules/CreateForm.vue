<template>
  <a-modal
    title="新建区域"
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
        <a-form-item label="区域名称">
          <a-input
            :maxLength="30"
            v-decorator="['area', { rules: [{ required: true, whitespace: true, message: '请输入区域名称' }] }]"
            placeholder="请输入区域名称"
          />
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
        <a-form-item label="负责人姓名">
          <a-input
            placeholder="请输入负责人姓名"
            :maxLength="10"
            v-decorator="[
              'responsible',
              { rules: [{ required: true, whitespace: true, message: '请输入负责人姓名' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="负责人电话">
          <a-input
            placeholder="请输入负责人电话"
            v-decorator="[
              'responsibleTel',
              {
                trigger: 'blur',
                rules: [
                  { required: true, whitespace: true, message: '请输入手机号' },
                  { validator: validateCellPhone },
                ],
              },
            ]"
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
import pick from 'lodash.pick'
// 表单字段
const fields = ['area', 'province', 'id', 'city', 'responsible', 'responsibleTel', 'remark']
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
      validateCellPhone
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.$nextTick(() => {
        this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    })
  }
}
</script>
