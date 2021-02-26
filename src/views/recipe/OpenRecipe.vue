<template>
  <div>
    <a-card size="small" class="card" title="患者信息" :bordered="false">
      <repository-form ref="repository" :showSubmit="false" @refresh="reRender" @selectHistory="selectHistory" />
    </a-card>
    <a-card size="small" class="card" title="处方信息" :bordered="false">
      <task-form v-if="refresh" ref="task" :showSubmit="false" @selectTemplate="getTemplateData" />
    </a-card>
    <a-card size="small" class="card" title="药品列表">
      <medicine-list v-if="refresh" ref="medicineList"></medicine-list>
    </a-card>

    <!-- 打印弹窗 -->
    <printModal :visible="printVisible" :prescriptionNo="prescriptionNo" @cancel="cancelPrint"> </printModal>
    <!-- 底部按钮 -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-space>
        <a-button type="primary" icon="save" @click="save" :loading="loading">{{ '保存' }}</a-button>
        <a-button
          type="primary"
          v-if="isShowPrintBtn"
          icon="cloud-upload"
          @click="submit"
          :loading="loading"
        >提交</a-button
        >
        <a-button
          v-if="isShowPrintBtn"
          type="primary"
          icon="printer"
          @click="printRecipe"
          :loading="loading"
        >打印药方</a-button
        >
      </a-space>
    </footer-tool-bar>
  </div>
</template>

<script>
import RepositoryForm from './RepositoryForm'
import TaskForm from './TaskForm'
import MedicineList from './MedicineList'
import PrintModal from './modules/printModal'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import { openRecipe, submitRecipeInfo } from '@/api/recepeInfo'
import storage from 'store'
import { DOCTOR_ID, CLINIC_ID } from '@/config/storageTypes'
import { mapGetters } from 'vuex'
export default {
  name: 'OpenRecipe',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    RepositoryForm,
    MedicineList,
    PrintModal,
    TaskForm
  },
  data () {
    return {
      refresh: true,
      isEeditable: false,
      printVisible: false,
      visible: false,
      confirmLoading: false,
      fetching: false,
      loading: false,
      memberLoading: false,
      timeout: null,
      currentValue: null,
      prescriptionNo: '',
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

    getTemplateData (data) {
      this.data = data
    },
    selectHistory (data) {
      data.medicinalListVos.forEach((item, index) => {
        item.druggingOrder = item.druggingOrderCode
        item.orderNum = index + 1
      })
      const {
        $refs: { task, medicineList }
      } = this
      medicineList.data = data.medicinalListVos
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
            }).then((res) => {
              if (res.success) {
                $notification['success']({
                  message: res.message
                })
              }
              return resolve(true)
            }).catch((e) => { reject(e) })
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
