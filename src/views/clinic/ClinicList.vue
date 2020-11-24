<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="诊所名称">
                <a-input v-model="queryParam.clinicName" placeholder="请输入诊所名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="负责人姓名">
                <a-input v-model="queryParam.responsible" placeholder="请输入联系电话" />
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
        <a-button type="danger" icon="delete" :disabled="batchBtnDisabled" @click="handleDelBatch">删除</a-button>
        <a-upload
          v-if="isManager"
          :headers="headers"
          @change="uploadClinic"
          name="file"
          :showUploadList="false"
          :action="actionUrl"
        >
          <a-button :loading="importLoading"> <a-icon type="upload" /> 导入诊所</a-button>
        </a-upload>
      </div>

      <s-table
        :row-selection="{ onChange: onSelectChange }"
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span class="main-color" slot="clinicName" slot-scope="text, record">
          {{ record.clinicName }}
        </span>
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
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { clinicList, clinicSaveOrUpdate, clinicDelete } from '@/api/clinic'
import { mapGetters } from 'vuex'
import CreateForm from './modules/CreateForm'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'
import { roleMixin } from '@/store/role-mixin'
const columns = [
  {
    title: '诊所名称',
    dataIndex: 'clinicName',
    scopedSlots: { customRender: 'clinicName' }
  },
  {
    title: '诊所电话',
    dataIndex: 'clinicTel'
  },
  {
    title: '地址',
    dataIndex: 'address'
  },
  {
    title: '负责人',
    dataIndex: 'responsible'
  },
  {
    title: '负责人电话',
    dataIndex: 'responsibleTel'
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
  name: 'ClinicList',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  mixins: [roleMixin],
  data () {
    this.columns = columns
    return {
      batchBtnDisabled: true,
      importLoading: false,
      headers: {
        token: storage.get(ACCESS_TOKEN)
      },
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return clinicList(requestParameters).then((res) => {
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
  created () {},
  computed: {
    ...mapGetters(['genderAll']),
    actionUrl () {
      return process.env.VUE_APP_API_BASE_URL + '/clinic/importClinic'
    }
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
      this.mdl = {}
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
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
      this.$confirm({
        title: '提示',
        content: '确定要删除?',
        onOk () {
          return new Promise((resolve, reject) => {
            clinicDelete({ ids }).then((res) => {
              if (res.success) {
                 $message.success(res.message)
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
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改
            clinicSaveOrUpdate({ ...values }).then((res) => {
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
            clinicSaveOrUpdate({ ...values }).then((res) => {
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
    uploadClinic (info) {
      this.importLoading = true
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 导入成功`)
        this.importLoading = false
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 导入失败`)
        this.importLoading = false
      }
    }
  }
}
</script>
