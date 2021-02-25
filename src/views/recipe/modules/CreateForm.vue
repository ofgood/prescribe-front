<template>
  <a-drawer
    :title="model && model.id > 0 ? '编辑处方模板': '新建处方模板'"
    width="80%"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @close="() => { $emit('cancel') }"
  >
  </a-drawer>
</template>
<script>
import { getRecipeInfoFindById } from '@/api/recepeInfo'
export default {
  name: 'CreateRecipeForm',
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
    return {
    }
  },
  created () {
       // 防止表单未注册
    // templateInfoFields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.$nextTick(() => {
      if (this.model && this.model.id > 0) {
        this.getRecipeInfo(this.model.id)
      } else {

      }
    })
    })
  },
  methods: {
    getRecipeInfo (id) {
      getRecipeInfoFindById({ id }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
