<template>
  <a-drawer
    :title="model && model.id > 0 ? '编辑处方' : '新建处方'"
    width="80%"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok')
      }
    "
    @close="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-card size="small" class="card" title="患者信息" :bordered="false">
      <repository-form
        :isEditor="true"
        ref="repository"
        :showSubmit="false"
        @refresh="reRender"
      />
    </a-card>
    <a-card v-if="refresh" size="small" class="card" title="处方信息" :bordered="false">
      <task-form ref="task" :showSubmit="false" @selectTemplate="getTemplateData" />
    </a-card>
    <a-card size="small" class="card" title="药品列表">
      <medicine-list v-if="refresh" ref="medicineList"></medicine-list>
    </a-card>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-space>
        <!-- <a-button type="danger" icon="redo" @click="clearData" :loading="loading">清空</a-button> -->
        <a-button type="primary" icon="save" @click="save" :loading="footerBtnloading">{{ '保存' }}</a-button>
        <a-button type="primary" icon="cloud-upload" @click="submit" :loading="footerBtnloading">提交</a-button>
        <a-button type="primary" icon="printer" @click="printRecipe" :loading="footerBtnloading">打印药方</a-button>
      </a-space>
    </div>
  </a-drawer>
</template>
<script>
import RepositoryForm from '../RepositoryForm'
import TaskForm from '../TaskForm'
import MedicineList from '../MedicineList'
import PrintModal from './printModal'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import { openRecipe, submitRecipeInfo, getRecipeInfoFindById, getRecipeMedicinalList } from '@/api/recepeInfo'
import storage from 'store'
import { DOCTOR_ID, CLINIC_ID } from '@/config/storageTypes'
import { mapGetters } from 'vuex'
export default {
  name: 'CreateRecipeForm',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    RepositoryForm,
    MedicineList,
    PrintModal,
    TaskForm
  },
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
      refresh: true,
      isEeditable: false,
      printVisible: false,
      confirmLoading: false,
      fetching: false,
      memberLoading: false,
      timeout: null,
      currentValue: null,
      prescriptionNo: '',
      footerBtnloading: false,
      errors: []
    }
  },
  computed: {
    ...mapGetters(['druggingOrders']),
    hasPrescriptionNo () {
      return !!this.prescriptionNo
    },
    isShowPrintBtn () {
      return this.prescriptionNo
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
    handleSubmit (e) {
      e.preventDefault()
    },
    getRowByKey (orderNum, newData) {
      const data = this.data
      return (newData || data).find((item) => item.orderNum === orderNum)
    },
    cancel (orderNum) {
      const target = this.data.find((item) => item.orderNum === orderNum)
      Object.keys(target).forEach((orderNum) => {
        target[orderNum] = target._originalData[orderNum]
      })
      target._originalData = undefined
    },
    getRecipeInfo (id) {
      getRecipeInfoFindById({
        id
      }).then((res) => {
        this.$nextTick(() => {
          this.$refs.repository.initPatientInfo(res.data.patientInfoVo)
          this.getRecipeMedicinalList(res.data, id)
        })
      })
    },
    getTemplateData (data) {
      this.data = data
    },
  getRecipeMedicinalList (data, id) {
      getRecipeMedicinalList({
          id
        }).then((res) => {
          this.selectHistory(data, res.data)
        })
    },
    selectHistory (data, medicinalListVos) {
      medicinalListVos.forEach((item, index) => {
        item.druggingOrder = item.druggingOrderCode
        item.orderNum = index + 1
      })
      const {
        $refs: { task, medicineList }
      } = this
      medicineList.data = medicinalListVos
      const { setFieldsValue } = task.form
      const { grabMedicineType, postPackageNumbers, recipeType, postNumbers, packageCap, disease, usage } = data
      setFieldsValue({
        postPackageNumbers,
        grabMedicineType,
        recipeType,
        postNumbers,
        packageCap,
        disease,
        usage
      })
    },
    // 最终全页面提交
    validate () {
      const {
        $refs: { repository, task, medicineList },
        $notification
      } = this
      const repositoryForm = new Promise((resolve, reject) => {
        repository.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          } else {
            const medicinalList = [...medicineList.data]
            values.medicinalList = medicinalList
          }
          resolve(values)
        })
      })
      const taskForm = new Promise((resolve, reject) => {
        task.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })

      // clean this.errors
      this.errors = []
      Promise.all([repositoryForm, taskForm])
        .then((values) => {
          console.log(values)
          const params = Object.assign({}, values[0], values[1])
          params.clinicId = storage.get(CLINIC_ID)
          params.doctorId = storage.get(DOCTOR_ID)
          openRecipe(params).then((res) => {
            if (res.success) {
              this.prescriptionNo = res.data.prescriptionNo || ''
              $notification['success']({
                message: res.message
              })
              this.$parent.$refs.table.refresh(true)
              this.$emit('ok')
            } else {
              $notification['error']({
                message: res.message
              })
            }
          })
        })
        .catch(() => {
          $notification['error']({
            message: '操作失败'
          })
        })
    },
    showModel () {
      this.visible = true
    },
    save () {
      this.validate()
    },
    submit () {
      const { $notification, $confirm } = this
      const that = this
      $confirm({
        title: '确定提交处方?',
        content: '处方提交之后将无法更改',
        onOk () {
          return new Promise((resolve, reject) => {
            submitRecipeInfo({
              prescriptionNo: that.prescriptionNo
            })
              .then((res) => {
                if (res.success) {
                  $notification['success']({
                    message: res.message
                  })
                }
                return resolve(true)
              })
              .catch((e) => {
                reject(e)
              })
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {}
      })
    },
    clearData () {
      Object.assign(this.$data, this.$options.data())
    },
    reRender () {
      this.refresh = false
      setTimeout(() => {
        this.refresh = true
        this.clearData()
      }, 200)
    },
    printRecipe () {
      this.printVisible = true
    },
    cancelPrint () {
      this.printVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.medicine-list {
  ul {
    li {
      display: inline-block;
      width: 50%;
      margin-bottom: 5px;
    }
  }
}
.recipte-top {
  height: 44px;
  img {
    height: 44px;
  }
}
.medicine-list {
  height: 300px;
}
.mainSpan {
  font-size: 16px;
}
.unitSPan {
  font-size: 12px;
  vertical-align: sub;
}
.divide-line {
  border-bottom: 1px solid #666;
  width: 100%;
  margin: 5px 0;
}
.recipe-title {
  width: 100%;
  position: relative;
  text-align: center;
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
  .recipe-name {
    position: absolute;
    right: 10px;
    top: 0;
  }
}
.recipe-num {
  display: flex;
  justify-content: space-between;
}
.recipe-label {
  color: #333;
}
.patient-info-item {
  min-width: 100px;
  display: inline-block;
  .info-item-label {
    color: #333;
  }
}
.card {
  margin-bottom: 24px;
}
.popover-wrapper {
  /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}
.antd-pro-pages-forms-style-errorIcon {
  user-select: none;
  margin-right: 24px;
  color: #f5222d;
  cursor: pointer;
  i {
    margin-right: 4px;
  }
}
.antd-pro-pages-forms-style-errorListItem {
  padding: 8px 16px;
  list-style: none;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }
  .antd-pro-pages-forms-style-errorIcon {
    float: left;
    margin-top: 4px;
    margin-right: 12px;
    padding-bottom: 22px;
    color: #f5222d;
  }
  .antd-pro-pages-forms-style-errorField {
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
</style>
