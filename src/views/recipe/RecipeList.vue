<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="患者名称">
                <a-input @pressEnter="$refs.table.refresh(true)" v-model="queryParam.patientName" placeholder="请输入患者名称" />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="处方类型">
                <!-- <a-input v-model="queryParam.recipeType" placeholder="请输入处方类型"/> -->
                <a-select v-model="queryParam.recipeType" placeholder="请选择处方类型">
                  <a-select-option v-for="item in recipeAllTypes" :value="item.value" :key="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' } || {}">
                <a-button icon="redo" @click="() => this.queryParam = {}">重置</a-button>
                <a-button icon="search" style="margin-left: 8px" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="middle"
        :row-selection="rowSelection"
        @expand="expand"
        @expandedRowsChange="expand"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <div slot="expandedRowRender" slot-scope="text">
          <a-card title="处方信息" size="small" style="margin-bottom: 10px">
            <a-descriptions title="" :column="4">
              <a-descriptions-item label="抓药方式">
                {{ text.grabMedicineType }}
              </a-descriptions-item>
              <a-descriptions-item label="处方类型">
                {{ text.recipeType }}
              </a-descriptions-item>
              <a-descriptions-item label="贴数">
                {{ text.postNumbers }}
              </a-descriptions-item>
              <a-descriptions-item label="每贴包数">
                {{ text.postPackageNumbers }}
              </a-descriptions-item>
              <a-descriptions-item label="每包容量(ml)">
                {{ text.packageCap }}
              </a-descriptions-item>
              <a-descriptions-item :span="3" label="用法用量">
                {{ text.usage }}
              </a-descriptions-item>
              <a-descriptions-item :span="5" label="病症">
                {{ text.disease }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
          <a-card title="药品列表" size="small">
            <a-table :columns="innerColumns" :rowKey="(record) => record.medicinalCode" :data-source="innerDataMap[text.id]" :pagination="false"> </a-table>
          </a-card>
        </div>
        <span class="main-color" slot="prescriptionNo" slot-scope="text">
          {{ text }}
        </span>
        <!-- <div slot-scope="text,record" slot="action">
          <a style="margin-right: 10px" @click="handleEdit(record)">编辑</a>
          <a v-if="!record.hasSubmit" @click="submitRecipe(record.prescriptionNo)">提交</a>
        </div> -->
      </s-table>
    </a-card>
    <create-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { recipeInfoList, getRecipeMedicinalList, submitRecipeInfo } from '@/api/recepeInfo'
import { mapGetters } from 'vuex'
import CreateForm from './modules/CreateForm'
const innerColumns = [
  { title: '序号', dataIndex: 'orderNum', key: 'orderNum' },
  { title: '药材名称', dataIndex: 'medicinalName', key: 'medicinalName' },
  { title: '剂量', dataIndex: 'dosage', key: 'dosage' },
   { title: '单位', dataIndex: 'unit', key: 'unit' },
  { title: '下药顺序', dataIndex: 'druggingOrder', key: 'druggingOrder' },
  { title: '是否毒性', dataIndex: 'toxic', key: 'toxic' },
  { title: '最大剂量', dataIndex: 'maxDosage', key: 'maxDosage' },
  { title: '价格', dataIndex: 'price', key: 'price' }
]
const columns = [
  {
    title: '处方号',
    dataIndex: 'prescriptionNo',
    scopedSlots: { customRender: 'prescriptionNo' }
  },
  {
    title: '医生',
    dataIndex: 'doctorName',
    width: 100
  },
  {
    title: '患者姓名',
    dataIndex: 'patientName',
    width: 100
  },
  {
    title: '诊所',
    dataIndex: 'clinicName'
  },
  {
    title: '支付状态',
    dataIndex: 'payStatus',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '100px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'RecipeList',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    this.columns = columns
    return {
      visible: false,
      confirmLoading: false,
      rowSelection: {},
      innerData: [],
      innerDataMap: {},
      innerColumns,
      mdl: null,
      // 查询参数
      queryParam: {
        recipeType: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return recipeInfoList(requestParameters).then((res) => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters(['recipeTypeAll', 'druggingOrders', 'recipeAllTypes'])
  },
  methods: {
    handleEdit (record) {
      console.log(record)
      this.visible = true
      this.mdl = { ...record }
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      this.visible = false
    },
    handleAdd () {
      // this.mdl = null
      // this.visible = true
      this.$router.push({
        name: 'create-recipe-template'
      })
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    expand (expanded, record) {
      if (expanded) {
        const { id } = record
        getRecipeMedicinalList({
          id
        }).then((res) => {
          console.log(res)
          res.data.forEach((item, index) => {
            item.orderNum = index + 1
          })
          // this.innerData = res.data || []
          this.$nextTick(() => {
            this.innerDataMap[id] = res.data || []
            this.$forceUpdate()
          })
        })
      } else {
        this.innerData = []
      }
    },
    submitRecipe (prescriptionNo) {
     const { $notification } = this
      if (prescriptionNo) {
        submitRecipeInfo({
          prescriptionNo
        }).then(res => {
           $notification['success']({
          message: res.message
        })
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>
