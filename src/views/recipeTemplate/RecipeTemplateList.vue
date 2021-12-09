<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模板名称">
                <a-input @pressEnter="$refs.table.refresh(true)" v-model="queryParam.recipeTemplateName	" placeholder="请输入模板名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="处方模板类型">
                <a-select v-model="queryParam.recipeTemplateType" placeholder="请选择处方模板类型">
                  <a-select-option v-for="item in recipeTypeAll" :value="item.value" :key="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' } || {} ">
                <a-button icon="redo" @click="() => this.queryParam = {}">重置</a-button>
                <a-button icon="search" style="margin-left: 8px" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button type="danger" icon="delete" :disabled="batchBtnDisabled" @click="handleDelBatch">删除</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        :row-selection="{ onChange: onSelectChange }"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span class="main-color" slot="recipeTemplateName" slot-scope="text">
          {{ text }}
        </span>
        <div slot="expandedRowRender" slot-scope="text">
          <a-table
            :rowKey="record => record.medicinalCode"
            :columns="innerColumns"
            :data-source="innerData(text)"
            :pagination="false"
          >
          </a-table>
        </div>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a class="danger-color" @click="handleDel(record)">删除</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { recipeTemplateList, recipeTemplateDelete } from '@/api/recipeTemplate'
import { mapGetters } from 'vuex'
import CreateForm from './modules/CreateForm'
const innerColumns = [
  { title: '序号', dataIndex: 'orderNum', key: 'orderNum' },
  { title: '药材名称', dataIndex: 'medicinalName', key: 'medicinalName' },
  { title: '剂量', dataIndex: 'dosage', key: 'dosage' },
  { title: '下药顺序', dataIndex: 'druggingOrder', key: 'druggingOrder' },
  { title: '是否毒性', dataIndex: 'toxic', key: 'toxic' },
  { title: '最大剂量', dataIndex: 'maxDosage', key: 'maxDosage' },
  { title: '单位', dataIndex: 'unit', key: 'unit' },
  { title: '价格', dataIndex: 'price', key: 'price' }
]
const columns = [
  {
    title: '模板名称',
    dataIndex: 'recipeTemplateName',
    scopedSlots: { customRender: 'recipeTemplateName' }
  },
  {
    title: '处方模板类型',
    dataIndex: 'recipeTemplateType'
  },
  {
    title: '病症',
    dataIndex: 'disease'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'DoctorList',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    this.columns = columns
    return {
      batchBtnDisabled: true,
      rowSelection: {},
      // create model
      visible: false,
      confirmLoading: false,
      innerColumns,
      mdl: null,
      // 查询参数
      queryParam: {
        recipeType: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return recipeTemplateList(requestParameters)
          .then(res => {
            return res.data || { data: [] }
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      selectedIds: ''
    }
  },
  computed: {
     ...mapGetters(['recipeTypeAll', 'druggingOrders'])
  },
  watch: {
    selectedRowKeys (keys) {
      this.batchBtnDisabled = !keys.length
    }
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedIds = selectedRowKeys.join(',')
    },
    handleDel (record) {
      this.deleteItem(record.id)
    },
    handleDelBatch () {
      this.deleteItem(this.selectedIds)
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
      // this.$router.push({
      //   name: 'create-recipe-template'
      // })
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
     deleteItem (ids) {
      const { $message, $refs } = this
      const that = this
      this.$confirm({
        title: '提示',
        content: '确定删除?',
        onOk () {
          return new Promise((resolve, reject) => {
            recipeTemplateDelete({ ids }).then((res) => {
              if (res.success) {
                console.log(this)
                that.selectedRowKeys = []
                $message.success(res.message)
                $refs.table.refresh(true)
                resolve(true)
              } else {
                $message.info(res.message)
                reject(new Error('删除失败'))
              }
            })
          }).catch(() => console.log('Oops errors!'))
        }
      })
    },
    handleOk () {
      this.visible = false
      this.$refs.table.refresh(true)
    },
    handleCancel () {
      this.visible = false
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
    innerData (text) {
      const details = JSON.parse(text.details)
      details.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key === 'druggingOrder') {
            item[key] = this.orderFilter(item[key])
          }
        })
      })
      return details
    },
     orderFilter (druggingOrder) {
      const druggingOrderText = this.druggingOrders.filter(item => item.value === druggingOrder)[0]
      return druggingOrderText && druggingOrderText.label || ''
    }
  }
}
</script>
