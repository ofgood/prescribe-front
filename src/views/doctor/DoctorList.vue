<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.doctorName" placeholder="请输入医生姓名" />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="联系电话">
                <a-input v-model="queryParam.tel" placeholder="请输入联系电话" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' } || {}">
                <a-button icon="redo" @click="() => (this.queryParam = {})">重置</a-button>
                <a-button
                  icon="search"
                  style="margin-left: 8px"
                  type="primary"
                  @click="$refs.table.refresh(true)"
                >查询</a-button
                >
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button type="danger" icon="user-delete" :disabled="batchBtnDisabled" @click="handleDelBatch">离职</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        :row-selection="{ onChange: onSelectChange }"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span class="main-color" slot="doctorName" slot-scope="text">
          {{ text }}
        </span>
        <span slot="status" slot-scope="text, record">
          <span style="color:green" v-if="record.status === '是'">是</span>
          <span v-else style="color:red">否</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a style="color:red" @click="handleDel(record)">离职</a>
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
import { doctorList, doctorSaveOrUpdate, doctorDelete } from '@/api/doctor'
import { mapGetters } from 'vuex'
import CreateForm from './modules/CreateForm'
import { deepClone } from '@/utils/util'
const columns = [
  {
    title: '姓名',
    dataIndex: 'doctorName',
    scopedSlots: { customRender: 'doctorName' }
  },
  {
    title: '联系电话',
    dataIndex: 'doctorTel'
  },
  {
    title: '住址',
    dataIndex: 'address'
  },
  {
    title: '身份证号',
    dataIndex: 'idCard'
  },
   {
    title: '出生年月',
    dataIndex: 'birthday'
  },
   {
    title: '是否在职',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
   {
    title: '修改时间',
    dataIndex: 'updateTime'
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
      batchBtnDisabled: true,
      rowSelection: {},
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return doctorList(requestParameters)
          .then(res => {
            return res.data || { data: [] }
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
  created () {

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
      this.selectedIds = selectedRowKeys
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      const recordData = deepClone(record)
      recordData.clinicIds = recordData.clinicIds.split(',')
      this.mdl = { ...recordData }
    },
    handleDel (record) {
      this.deleteItem(record.id)
    },
    handleDelBatch () {
      this.deleteItem(this.selectedIds)
    },
    deleteItem (ids) {
      const { $message, $refs } = this
      this.$confirm({
        title: '提示',
        content: '确定离职?',
        onOk () {
          return new Promise((resolve, reject) => {
            doctorDelete({ ids }).then((res) => {
              if (res.success) {
                $message.success(res.message)
                $refs.table.refresh(true)
                return resolve
              } else {
                 $message.info(res.message)
                return reject
              }
            })
          }).catch(() => console.log('Oops errors!'))
        }
      })
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
           // 新增
            // values.clinicIds = values.clinicIds.join(',')
            doctorSaveOrUpdate({ ...values }).then(res => {
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
            // values.clinicIds = values.clinicIds.join(',')
            doctorSaveOrUpdate({ ...values }).then(res => {
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
    }
  }
}
</script>
