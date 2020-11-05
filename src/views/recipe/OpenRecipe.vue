<template>
  <page-header-wrapper content="">
    <a-card size="small" class="card" title="患者信息" :bordered="false">
      <repository-form ref="repository" :showSubmit="false" />
    </a-card>
    <a-card size="small" class="card" title="处方信息" :bordered="false">
      <task-form ref="task" :showSubmit="false" />
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
        <template v-for="(col, i) in inputCols" :slot="col" slot-scope="text, record">
          <template v-if="col != 'orderNum'">
            <a-input
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="(e) => handleChange(e.target.value, record.orderNum, col)"
            />
            <template v-else>{{ text }}</template>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template slot="medicinalName" slot-scope="text, record">
          <a-select
            style="width: 100%"
            v-if="record.editable"
            show-search
            key="medicinalName"
            :value="text"
            placeholder="药品名称"
            :default-active-first-option="false"
            :filter-option="false"
            @search="handleSearch"
            @change="(value, option) => handleChange(value, record.orderNum, 'medicinalName', option)"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in selects" :key="d.value" :itemData="d">
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
      <span class="popover-wrapper">
        <a-popover
          title="表单校验信息"
          overlayClassName="antd-pro-pages-forms-style-errorPopover"
          trigger="click"
          :getPopupContainer="(trigger) => trigger.parentNode"
        >
          <template slot="content">
            <li
              v-for="item in errors"
              :key="item.key"
              @click="scrollToField(item.key)"
              class="antd-pro-pages-forms-style-errorListItem"
            >
              <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
              <div class="">{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">
            <a-icon type="exclamation-circle" />{{ errors.length }}
          </span>
        </a-popover>
      </span>
      <a-space>
        <a-button type="danger" @click="validate" :loading="loading">清空</a-button>
        <a-button type="primary" @click="validate" :loading="loading">保存</a-button>
        <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
        <a-button type="primary" @click="validate" :loading="loading">打印药方</a-button>
      </a-space>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import RepositoryForm from './RepositoryForm'
import TaskForm from './TaskForm'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import { medicinalSelect } from '@/api/medicinal'
import { openRecipe } from '@/api/recepeInfo'
const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型'
}

export default {
  name: 'AdvancedForm',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    RepositoryForm,
    TaskForm
  },
  data () {
    return {
      fetching: false,
      loading: false,
      memberLoading: false,
      timeout: null,
      currentValue: null,
      selects: [],
      // table
      inputCols: [
        'orderNum',
        'medicinalCode',
        'medicinalStand',
        'dosage',
        'maxDosage',
        'unit',
        'druggingOrder',
        'toxic'
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'orderNum',
          key: 'orderNum',
          width: 40,
          scopedSlots: { customRender: 'orderNum' }
        },
        {
          title: '药材名称',
          dataIndex: 'medicinalName',
          key: 'medicinalName',
          width: 120,
          scopedSlots: { customRender: 'medicinalName' }
        },
        {
          title: '药材编码',
          dataIndex: 'medicinalCode',
          key: 'medicinalCode',
          width: 80,
          scopedSlots: { customRender: 'medicinalCode' }
        },
        {
          title: '规格',
          dataIndex: 'medicinalStand',
          key: 'medicinalStand',
          width: '10%',
          scopedSlots: { customRender: 'medicinalStand' }
        },
        {
          title: '剂量',
          dataIndex: 'dosage',
          key: 'dosage',
          width: '10%',
          scopedSlots: { customRender: 'dosage' }
        },
        {
          title: '最大剂量',
          dataIndex: 'maxDosage',
          key: 'maxDosage',
          width: '10%',
          scopedSlots: { customRender: 'maxDosage' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '10%',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '下药顺序',
          dataIndex: 'druggingOrder',
          key: 'druggingOrder',
          width: '10%',
          scopedSlots: { customRender: 'druggingOrder' }
        },
        {
          title: '是否毒性',
          dataIndex: 'toxic',
          key: 'toxic',
          width: '10%',
          scopedSlots: { customRender: 'toxic' }
        },
        {
          title: '操作',
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          orderNum: '1',
          medicinalCode: '',
          medicineName: '',
          medicinalStand: '',
          dosage: '',
          maxDosage: '',
          unit: '',
          druggingOrder: '',
          toxic: '',
          editable: true
        }
      ],
      errors: []
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
            console.log(d)
            if (this.currentValue === value) {
              const result = d.data
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
        medicinalCode: '',
        medicineName: '',
        medicinalStand: '',
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
    },
    saveRow (record) {
      console.log(record)
      this.memberLoading = true
      const {
        orderNum,
        medicinalCode,
        medicinalName,
        medicinalStand,
        dosage,
        maxDosage,
        unit,
        druggingOrder,
        toxic
      } = record
      if (
        !toxic ||
        !maxDosage ||
        !unit ||
        !druggingOrder ||
        !orderNum ||
        !medicinalCode ||
        !medicinalName ||
        !medicinalStand ||
        !dosage
      ) {
        this.memberLoading = false
        this.$message.error('请填写完整药品信息!')
        return
      }
      // 模拟网络请求、卡顿 800ms
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
    handleChange (value, orderNum, column) {
      const newData = [...this.data]
      const target = newData.find((item) => orderNum === item.orderNum)
      if (target) {
        target[column] = value
        this.data = newData
      }
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
            values.details = JSON.stringify(this.data)
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
          openRecipe(values[0]).then(res => {
          console.log('res', res)
        })
          $notification['error']({
            message: 'Received values of form:',
            description: JSON.stringify(values)
          })
        })
        .catch(() => {
          const errors = Object.assign({}, repository.form.getFieldsError(), task.form.getFieldsError())
          const tmp = { ...errors }
          this.errorList(tmp)
        })
    },
    errorList (errors) {
      if (!errors || errors.length === 0) {
        return
      }
      this.errors = Object.keys(errors)
        .filter((key) => errors[key])
        .map((key) => ({
          key: key,
          message: errors[key][0],
          fieldLabel: fieldLabels[key]
        }))
    },
    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
