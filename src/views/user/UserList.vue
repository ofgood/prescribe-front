<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input
                  @pressEnter="$refs.table.refresh(true)"
                  :maxLength="20"
                  v-model="queryParam.userName"
                  placeholder="请输入用户名"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="真实姓名">
                <a-input
                  @pressEnter="$refs.table.refresh(true)"
                  :maxLength="10"
                  v-model="queryParam.realName"
                  placeholder="请输入联系人姓名"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="请选择用户状态" v-model="queryParam.status">
                  <a-select-option v-for="item in userStatus" :key="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
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
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span class="main-color" slot="customerName" slot-scope="text">
          {{ text }}
        </span>
        <span slot="customerStatus" slot-scope="text, record">
          <span style="color: green" v-if="record.status === 'Y'">启用</span>
          <span style="color: red" v-else>禁用</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" style="margin-right: 10px">编辑</a>
          </template>
          <template v-if="currentUserRole === 'COMPANY_MANAGER' && currentUserId !== record.id">
            <a-popconfirm
              ok-text="是"
              cancel-text="否"
              @confirm="confirmResetPassword(record)"
              @cancel="cancelResetPassword"
            >
              <span slot="title">
                确定要重置 <span class="main-color">{{ record.realName }}</span> 的密码?
              </span>
              <a>重置密码</a>
            </a-popconfirm>
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
import { findUserList, userInfoSaveOrUpdate, adminSettingPassword } from '@/api/user'
import { mapGetters } from 'vuex'
import CreateForm from './modules/CreateForm'
import { roleMixin } from '@/store/role-mixin'
const columns = [
  {
    title: '用户名',
    dataIndex: 'userName',
    scopedSlots: { customRender: 'customerName' }
  },
  {
    title: '真实姓名',
    dataIndex: 'realName'
  },
   {
    title: '工号',
    dataIndex: 'jobNum'
  },
  {
    title: '用户类型',
    dataIndex: 'userTypeStr'
  },
  {
    title: '联系电话',
    dataIndex: 'tel'
  },
  {
    title: '联系地址',
    dataIndex: 'address'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'customerStatus' }
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
const userStatus = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '启用',
    value: 'Y'
  },
  {
    label: '禁用',
    value: 'N'
  }
]
export default {
  name: 'DoctorList',
  mixins: [roleMixin],
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      rowSelection: {},
      userStatus,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return findUserList(requestParameters).then((res) => {
          return res.data || {
            data: []
          }
        })
      },
      selectedRowKeys: [],
      selectedRows: []
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
    ...mapGetters(['genderAll'])
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    async confirmResetPassword (record) {
      const res = await adminSettingPassword({ id: record['id'] })
      if (res.success) {
        this.$message.success('重置密码成功!')
      } else {
        this.$message.success('重置密码失败!')
      }
    },
    cancelResetPassword () {},
    handleDel (record) {
      console.log(record)
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            userInfoSaveOrUpdate({ ...values }).then((res) => {
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
            userInfoSaveOrUpdate({ ...values }).then((res) => {
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
