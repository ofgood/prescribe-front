<template>
  <page-header-wrapper content="">
    <a-card size="small" class="card" title="患者信息" :bordered="false">
      <repository-form ref="repository" :showSubmit="false" />
    </a-card>
    <a-card size="small" class="card" title="处方信息" :bordered="false">
      <task-form ref="task" :showSubmit="false" @selectTemplate="getTemplateData" />
    </a-card>
    <a-card size="small" class="card" title="药品列表">
      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :rowKey="(record, index) => index"
        :loading="memberLoading"
      >
        <template slot="druggingOrder" slot-scope="text, record">
          <a-select
            style="width: 100%"
            :value="text"
            key="druggingOrder"
            placeholder="选择下药顺序"
            v-if="record.editable"
            @change="(value) => handleChange(value, record.orderNum, 'druggingOrder')"
          >
            <a-select-option v-for="item in druggingOrders" :value="item.value" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
          <template v-else>{{ orderFilter(text) }}</template>
        </template>
        <template slot="dosage" slot-scope="text, record">
          <a-input
            key="dosage"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            placeholder="请输入剂量"
            @change="(e) => handleChange(e.target.value, record.orderNum, 'dosage')"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="medicinalName" slot-scope="text, record">
          <a-select
            style="width: 100%"
            v-if="record.editable"
            show-search
            key="medicinalName"
            :value="text"
            placeholder="药品名称"
            :show-arrow="false"
            :default-active-first-option="false"
            :not-found-content="fetching ? undefined : null"
            :filter-option="false"
            @search="handleSearch"
            @change="(value, option) => handleChange(value, record.orderNum, 'medicinalName', option)"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.id" :itemData="d">
              {{ d.text }}
            </a-select-option>
          </a-select>
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.orderNum)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.orderNum)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.orderNum)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.orderNum)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newMember"
      >新增</a-button
      >
    </a-card>
    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-space>
        <!-- <a-button type="danger" icon="redo" @click="clearData" :loading="loading">清空</a-button> -->
        <a-button type="primary" icon="save" @click="save" :loading="loading">{{ '保存' }}</a-button>
        <a-button type="primary" icon="cloud-upload" @click="submit" :loading="loading">提交</a-button>
        <a-button type="primary" icon="printer" @click="printRecipe" :loading="loading">打印药方</a-button>
      </a-space>
    </footer-tool-bar>
    <a-modal
      wrapClassName="print-modal"
      title="打印处方"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="recipe-wrap" ref="printSection">
        <div class="recipte-top">
          <img id="barcode" />
        </div>
        <div class="recipe-title">
          处方笺
          <span class="recipe-name">{{ clinicInfoVo.clinicName }}</span>
        </div>
        <div class="recipe-num">
          <div><span class="recipe-label">开具日期:</span> {{ recipeInfoListVo.sickTime }}</div>
          <div><span class="recipe-label">处方号:</span> {{ recipeInfoListVo.prescriptionNo }}</div>
        </div>
        <div class="divide-line"></div>
        <div class="patient-info">
          <div class="patient-info-row">
            <div class="patient-info-item">
              <span class="recipe-label">姓名:</span>
              {{ patientInfoVo.patientName }}
            </div>
            <div class="patient-info-item">
              <span class="recipe-label">性别:</span>
              {{ patientInfoVo.sexStr }}
            </div>
            <div class="patient-info-item">
              <span class="recipe-label">年龄:</span>
              {{ patientInfoVo.age }}
            </div>
          </div>
          <div class="patient-info-row">
            <div class="patient-info-item">
              <span class="recipe-label">地址:</span>
              {{ patientInfoVo.address }}
            </div>
            <div class="patient-info-item">
              <span class="recipe-label">电话:</span>
              {{ patientInfoVo.tel }}
            </div>
          </div>
          <div class="patient-info-row">
            <div class="patient-info-item">
              <span class="recipe-label">临床病症:</span>
              {{ recipeInfoListVo.diease }}
            </div>
          </div>
          <div class="divide-line"></div>
          <div class="medicine-list">
            <ul>
              <li v-for="item in medicinalListVoList" :key="item.medicinalCode">
                <span class="mainSpan"> {{ item.medicinalName }}</span>
                <span class="unitSPan">{{ item.dosage }}{{ item.unit }}</span>
              </li>
            </ul>
          </div>
          <div class="divide-line"></div>
          <div class="recipe-bottom">
            <div>
              <span> <span class="recipe-label">医师:</span> {{ doctorInfoVo.doctorName }}</span>
              &nbsp; &nbsp;
              <span><span class="recipe-label">药品总价:</span> {{ medicinalPriceTotal }}</span>
            </div>
          </div>
        </div>
      </div></a-modal
    >
  </page-header-wrapper>
</template>

<script>
import RepositoryForm from './RepositoryForm'
import TaskForm from './TaskForm'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import { medicinalSelect } from '@/api/medicinal'
import { openRecipe, getPrintRecipeInfo, submitRecipeInfo } from '@/api/recepeInfo'
import storage from 'store'
import { DOCTOR_ID, CLINIC_ID } from '@/config/storageTypes'
import { mapGetters } from 'vuex'
import JsBarcode from 'jsbarcode'
import { accAdd, addClass } from '@/utils/util'
export default {
  name: 'OpenRecipe',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    RepositoryForm,
    TaskForm
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      fetching: false,
      loading: false,
      memberLoading: false,
      timeout: null,
      currentValue: null,
      selects: [],
      prescriptionNo: '',
      clinicInfoVo: '',
      doctorInfoVo: '',
      medicinalListVoList: '',
      patientInfoVo: '',
      recipeInfoListVo: '',
      medicinalPriceTotal: 0,
      // table
      columns: [
        {
          title: '序号',
          dataIndex: 'orderNum',
          key: 'orderNum',
          align: 'center',
          width: 50
        },
        {
          title: '药材名称',
          dataIndex: 'medicinalName',
          key: 'medicinalName',
          width: '18%',
          scopedSlots: { customRender: 'medicinalName' },
          align: 'center'
        },
        {
          title: '剂量',
          dataIndex: 'dosage',
          key: 'dosage',
          width: '10%',
          scopedSlots: { customRender: 'dosage' },
          align: 'center'
        },
        {
          title: '下药顺序',
          dataIndex: 'druggingOrder',
          key: 'druggingOrder',
          width: '10%',
          scopedSlots: { customRender: 'druggingOrder' },
          align: 'center'
        },
        {
          title: '是否毒性',
          dataIndex: 'toxic',
          key: 'toxic',
          width: '10%',
          align: 'center'
        },
        {
          title: '最大剂量',
          dataIndex: 'maxDosage',
          key: 'maxDosage',
          width: '10%',
          align: 'center'
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '8%',
          align: 'center'
        },
        {
          title: '价格',
          dataIndex: 'price',
          key: 'price',
          width: '8%',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 140,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          medicinalCode: '',
          orderNum: 1,
          medicinalName: undefined,
          dosage: '',
          maxDosage: '',
          unit: '',
          druggingOrder: undefined,
          toxic: '',
          editable: true
        }
      ],
      errors: []
    }
  },
  computed: {
    ...mapGetters(['druggingOrders']),
    hasPrescriptionNo () {
      return !!this.prescriptionNo
    }
  },
  methods: {
    fetch (value, callback) {
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
    },
    handleSubmit (e) {
      e.preventDefault()
    },
    newMember () {
      const length = this.data.length
      this.data.push({
        orderNum: length === 0 ? '1' : (parseInt(this.data[length - 1].orderNum) + 1).toString(),
        medicinalName: undefined,
        dosage: '',
        maxDosage: '',
        unit: '',
        druggingOrder: '',
        toxic: '',
        editable: true,
        isNew: true
      })
    },
    remove (orderNum) {
      const newData = this.data.filter((item) => item.orderNum !== orderNum)
      this.data = newData
      this.data.forEach((item, index) => {
        item.orderNum = index + 1
      })
    },
    saveRow (record) {
      console.log(record)
      this.memberLoading = true
      const { orderNum, medicinalName, dosage, druggingOrder } = record
      if (!druggingOrder || !medicinalName || !dosage) {
        this.memberLoading = false
        this.$message.error('请填写完整药品信息!')
        return
      }
      const target = this.data.find((item) => item.orderNum === orderNum)
      target.editable = false
      target.isNew = false
      this.memberLoading = false
    },
    toggle (orderNum) {
      const target = this.data.find((item) => item.orderNum === orderNum)
      target._originalData = { ...target }
      target.editable = !target.editable
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
    handleChange (value, orderNum, column, option) {
      console.log('value', value)
      const newData = [...this.data]
      const target = newData.find((item) => orderNum === item.orderNum)
      if (column === 'medicinalName') {
        const { itemData } = option.data.attrs
        target.editable = true
        target.dosage = itemData.dosage
        target.druggingOrder = itemData.druggingOrder
        target.medicinalCode = itemData.medicinalCode
        target.medicinalName = itemData.medicinalName
        target.toxic = itemData.toxic
        target.medicinalPyCode = itemData.medicinalPyCode
        target.price = itemData.price
        target.unit = itemData.unit
        this.data = newData
      } else {
        if (target) {
          target[column] = value
          this.data = newData
        }
      }
    },
    getTemplateData (data) {
      this.data = data
    },
    // 最终全页面提交
    validate () {
      const {
        $refs: { repository, task },
        $notification
      } = this
      const repositoryForm = new Promise((resolve, reject) => {
        repository.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          } else {
            const medicinalList = [...this.data]
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
          params.patientId = params.patientId.key
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
    orderFilter (druggingOrder) {
      const druggingOrderText = this.druggingOrders.filter((item) => item.value === druggingOrder)[0]
      return druggingOrderText.label
    },
    printRecipe () {
      const { $notification } = this
      if (this.prescriptionNo) {
        getPrintRecipeInfo({
          prescriptionNo: this.prescriptionNo
        }).then((res) => {
          if (res.success) {
            let totalPrice = 0
            const { clinicInfoVo, doctorInfoVo, medicinalListVoList, patientInfoVo, recipeInfoListVo } = res.data
            this.clinicInfoVo = clinicInfoVo
            this.doctorInfoVo = doctorInfoVo
            this.medicinalListVoList = medicinalListVoList
            this.patientInfoVo = patientInfoVo
            this.recipeInfoListVo = recipeInfoListVo
            medicinalListVoList.forEach((item) => {
              totalPrice = accAdd(totalPrice, item.price)
            })
            this.medicinalPriceTotal = totalPrice
            this.showModel()
            this.$nextTick(() => {
              JsBarcode('#barcode', recipeInfoListVo.prescriptionNo)
            })
          }
        })
      } else {
        $notification['error']({
          message: '请先保存药方之后打印'
        })
      }
    },
    showModel () {
      this.visible = true
    },
    handleOk () {
      this.$nextTick(() => {
       const antModalHeader = document.querySelector('.print-modal').querySelector('.ant-modal-header')
       const antModalFooter = document.querySelector('.print-modal').querySelector('.ant-modal-footer')
       const antModalClose = document.querySelector('.print-modal').querySelector('.ant-modal-close')
       const antNotification = document.querySelector('.ant-notification')
       addClass(antModalHeader, 'no-print')
       addClass(antModalFooter, 'no-print')
       addClass(antModalClose, 'no-print')
       addClass(antNotification, 'no-print')
       this.$print(this.$refs.printSection)
      })
    },
    handleCancel () {
      this.visible = false
    },
    save () {
      this.validate()
    },
    submit () {
      const { $notification } = this
      if (this.prescriptionNo) {
        submitRecipeInfo({
          prescriptionNo: this.prescriptionNo
        }).then(res => {
           $notification['success']({
          message: res.message
        })
        })
      } else {
        $notification['error']({
          message: '请先保存药方之后再提交'
        })
      }
    },
    clearData () {
      Object.assign(this.$data, this.$options.data())
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
