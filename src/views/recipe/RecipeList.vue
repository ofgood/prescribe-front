<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="患者名称">
                <a-input v-model="queryParam.patientName" placeholder="请输入患者名称" />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="处方类型">
                <!-- <a-input v-model="queryParam.recipeType" placeholder="请输入处方类型"/> -->
                <a-select v-model="queryParam.recipeType" placeholder="请选择处方类型">
                  <a-select-option v-for="item in recipeTypeAll" :value="item.value" :key="item.value">
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

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        :row-selection="rowSelection"
        @expand="expand"
        @expandedRowsChange="expand"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <div slot="expandedRowRender" slot-scope="text">
          <a-table :columns="innerColumns" :rowKey="(record) => record.medicinalCode" :data-source="innerDataMap[text.id]" :pagination="false"> </a-table>
        </div>
        <!-- <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">配置</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">订阅报警</a>
          </template>
        </span> -->
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { recipeInfoList, getRecipeMedicinalList } from '@/api/recepeInfo'
import { mapGetters } from 'vuex'
const innerColumns = [
  { title: '序号', dataIndex: 'orderNum', key: 'orderNum' },
  { title: '药材名称', dataIndex: 'medicinalName', key: 'medicinalName' },
  { title: '剂量', dataIndex: 'dosage', key: 'dosage' },
  { title: '下药顺序', dataIndex: 'druggingOrder', key: 'druggingOrder' },
  { title: '是否毒性', dataIndex: 'toxic', key: 'toxic' },
  { title: '规格', dataIndex: 'medicinalStand', key: 'medicinalStand' },
  { title: '最大剂量', dataIndex: 'maxDosage', key: 'maxDosage' },
  { title: '单位', dataIndex: 'unit', key: 'unit' },
  { title: '价格', dataIndex: 'price', key: 'price' }
]
const columns = [
  {
    title: '处方号',
    dataIndex: 'prescriptionNo'
  },
  {
    title: '医生',
    dataIndex: 'doctorName'
  },
  {
    title: '患者姓名',
    dataIndex: 'patientName'
  },
  {
    title: '诊所',
    dataIndex: 'clinicName'
  },
  {
    title: '处方类型',
    dataIndex: 'recipeType'
  },
  {
    title: '抓药方式',
    dataIndex: 'grabMedicineType'
  },
  {
    title: '贴数',
    dataIndex: 'postNumbers'
  },
  {
    title: '每贴包数',
    dataIndex: 'postPackageNumbers'
  },
  {
    title: '病症',
    dataIndex: 'disease'
  },
  {
    title: '支付状态',
    dataIndex: 'payStatus'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  }
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   width: '150px',
  //   scopedSlots: { customRender: 'action' }
  // }
]
export default {
  name: 'RecipeList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
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
    ...mapGetters(['recipeTypeAll', 'druggingOrders'])
  },
  methods: {
    handleAdd () {
      // this.mdl = null
      // this.visible = true
      this.$router.push({
        name: 'create-recipe-template'
      })
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
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
    }
  }
}
</script>
