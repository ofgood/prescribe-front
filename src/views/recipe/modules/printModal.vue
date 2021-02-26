<template>
  <a-modal
    wrapClassName="print-modal"
    title="打印处方"
    :visible="visible"
    :maskClosable="false"
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
          <div class="patient-info-item">
            <span class="recipe-label">电话:</span>
            {{ patientInfoVo.tel }}
          </div>
        </div>
        <div class="patient-info-row">
          <div class="patient-info-item" style="margin-right: 10px">
            <span class="recipe-label">地址:</span>
            {{ patientInfoVo.address }}
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
            <span> <span class="recipe-label">医师:</span> {{ doctorInfoVo.userName }}</span>
            &nbsp; &nbsp;
            <span><span class="recipe-label">药品总价:</span> {{ medicinalPriceTotal }}</span>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { getPrintRecipeInfo } from '@/api/recepeInfo'
import JsBarcode from 'jsbarcode'
import { accAdd, addClass } from '@/utils/util'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    prescriptionNo: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      confirmLoading: false,
      clinicInfoVo: '',
      doctorInfoVo: '',
      medicinalListVoList: '',
      patientInfoVo: '',
      recipeInfoListVo: '',
      medicinalPriceTotal: 0
    }
  },
  created () {
    this.$watch('visible', (newVal) => {
      if (newVal) {
        this.printRecipe()
      }
    })
  },
  methods: {
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
      this.$emit('cancel')
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
    }
  }
}
</script>
<style lang="less">
.medicine-list {
  ul {
    li {
      display: inline-block;
      width: 49%;
      margin-bottom: 4px;
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
  min-width: 80px;
  margin-right: 10px;
  margin-bottom: 4px;
  display: inline-block;
  .info-item-label {
    color: #333;
  }
}
</style>
