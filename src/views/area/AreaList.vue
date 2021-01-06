<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="区域名称">
                <a-input @pressEnter="$refs.table.refresh(true)" v-model="queryParam.area" placeholder="请输入区域名称"/>
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
        @expand="expand"
        @expandedRowsChange="expand"
        :row-selection="{ onChange: onSelectChange }"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span class="main-color" slot="area" slot-scope="text">
          {{ text }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a class="danger-color" @click="handleDel(record)">删除</a>
          </template>
        </span>
        <div slot="expandedRowRender" slot-scope="text">
          <a-table
            :rowKey="record => record.medicinalCode"
            :columns="innerColumns"
            :data-source="innerDataMap[text.id].responsibles"
            :pagination="false"
          >
          </a-table>
        </div>
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
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { areaList, areaSaveOrUpdate, areaDelete, getAreaById } from '@/api/area'
import { mapGetters } from 'vuex'
import CreateForm from './modules/CreateForm'
const innerColumns = [
  {
    title: '负责人姓名',
    dataIndex: 'realName'
  },
  {
    title: '负责人电话',
    dataIndex: 'tel'
  },
  {
    title: '负责人地址',
    dataIndex: 'address'
  },
  {
    title: '负责人出生日期',
    dataIndex: 'birthday'
  }
]
const columns = [
  {
    title: '名称',
    dataIndex: 'area',
    scopedSlots: { customRender: 'area' }
  },
  {
    title: '所在省份',
    dataIndex: 'province'
  },
  {
    title: '所在城市',
    dataIndex: 'city'
  },
  {
    title: '备注',
    dataIndex: 'remark'
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

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}
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
      innerData: [],
      innerDataMap: {},
      innerColumns,
      // create model
      batchBtnDisabled: true,
      visible: false,
      confirmLoading: false,
      mdl: null,
      rowSelection: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return areaList(requestParameters)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      selectedIds: ''
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  computed: {
     ...mapGetters(['genderAll'])
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
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      console.log('record', record)
      this.mdl = { ...record }
    },
    handleDel (record) {
      this.deleteItem(record.id)
    },
    handleDelBatch () {
      this.deleteItem(this.selectedIds)
    },
    deleteItem (ids) {
      const { $message, $refs } = this
      const that = this
      this.$confirm({
        title: '提示',
        content: '确定要删除?',
        onOk () {
          return new Promise((resolve, reject) => {
            areaDelete({ ids }).then((res) => {
              if (res.success) {
                $message.success(res.message)
                that.selectedRowKeys = []
                $refs.table.refresh(true)
                return resolve(true)
              } else {
                 $message.info(res.message)
                 return resolve(true)
              }
            })
          }).catch(() => console.log('Oops errors!'))
        }
      })
    },
    handleOk (selects) {
      console.log('selects', selects)
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          const responsibles = []
          const { responsibleList } = values
          selects.forEach(item => {
            responsibleList.forEach(el => {
              if (item.id === el) {
                responsibles.push(
                  item
                )
              }
            })
          })
          values.responsibles = responsibles
          if (values.id > 0) {
            // 修改 e.g.
              areaSaveOrUpdate({ ...values }).then(res => {
              if (res.success) {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('修改成功')
              } else {
                this.$message.info(res.message)
                this.confirmLoading = false
              }
            })
          } else {
            // 新增
            areaSaveOrUpdate({ ...values }).then(res => {
              if (res.success) {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()

                this.$message.info('新增成功')
              } else {
                this.$message.info(res.message)
                this.confirmLoading = false
              }
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
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
        getAreaById({
          id
        }).then((res) => {
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
