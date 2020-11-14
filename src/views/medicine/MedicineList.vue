<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="药品名称">
                <a-input v-model="queryParam.medicinalName" placeholder="请输入药品名称"/>
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
        <a-upload
          v-if="isManager"
          :headers="headers"
          @change="uploadMedicine"
          name="file"
          :showUploadList="false"
          :action="actionUrl"
        >
          <a-button :loading="importLoading"> <a-icon type="upload" /> 导入药品</a-button>
        </a-upload>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        :row-selection="rowSelection"
        :rowKey="record => record.id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span class="main-color" slot="medicinalName" slot-scope="text">
          {{ text }}
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
import { medicinalList, medicinalInfoSaveOrUpdate } from '@/api/medicinal'
import { mapGetters } from 'vuex'
import CreateForm from './modules/CreateForm'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'
import { roleMixin } from '@/store/role-mixin'

const columns = [
  {
    title: '药品名称',
    dataIndex: 'medicinalName',
    scopedSlots: { customRender: 'medicinalName' }
  },
  {
    title: '拼音码',
    dataIndex: 'medicinalPyCode'
  },
  {
    title: '规格',
    dataIndex: 'medicinalStand'
  },
  {
    title: '来源',
    dataIndex: 'origin'
  },
  {
    title: '价格',
    dataIndex: 'price'
  },
  {
    title: '冲突',
    dataIndex: 'conflictVoList'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  }
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   width: '150px',
  //   scopedSlots: { customRender: 'action' }
  // }
]
export default {
  name: 'DoctorList',
  components: {
    STable,
    Ellipsis,
    CreateForm
  },
  mixins: [roleMixin],
  data () {
    this.columns = columns
    return {
      importLoading: false,
      headers: {
        token: storage.get(ACCESS_TOKEN)
      },
      rowSelection: {},
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        medicinalName: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return medicinalList(requestParameters)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
     ...mapGetters(['genderAll']),
     actionUrl () {
       return process.env.VUE_APP_API_BASE_URL + '/medicinalInfo/importMedicinal'
     }
  },
  methods: {
    uploadMedicine (info) {
      this.importLoading = true
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 导入成功`)
         this.importLoading = false
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 导入失败`)
        this.importLoading = false
      }
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            values.dosage = +values.dosage
            values.maxDosage = +values.maxDosage
            values.price = +values.price
            medicinalInfoSaveOrUpdate({ ...values }).then(res => {
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
