<template>
  <div>
    <a-table
      size="middle"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      :rowKey="(record, index) => index"
      :loading="memberLoading"
    >
      <template slot="druggingOrder" slot-scope="text, record">
        <a-select
          style="width: 100%"
          :value="text"
          key="druggingOrder"
          placeholder="选择下药顺序"
          v-if="record.editable"
          @change="(value) => handleChange(value, record.orderNum, 'druggingOrder')"
        >
          <a-select-option v-for="item in druggingOrders" :value="item.value" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
        <template v-else>{{ orderFilter(text) }}</template>
      </template>
      <template slot="dosage" slot-scope="text, record">
        <a-input
          key="dosage"
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          placeholder="请输入剂量"
          @change="(e) => handleChange(e.target.value, record.orderNum, 'dosage')"
        />
        <template v-else>{{ text }}</template>
      </template>
      <template slot="medicinalName" slot-scope="text, record">
        <a-select
          style="width: 100%"
          v-if="record.editable"
          show-search
          key="medicinalName"
          :value="text"
          placeholder="药品名称"
          :show-arrow="false"
          :default-active-first-option="false"
          :not-found-content="fetching ? undefined : null"
          :filter-option="false"
          @search="handleSearch"
          @change="(value, option) => handleChange(value, record.orderNum, 'medicinalName', option)"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="d in selects" :key="d.id" :itemData="d">
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { medicinalSelect } from '@/api/medicinal'
export default {
  name: 'MedicineList',
  data () {
    return {
      selects: [],
      memberLoading: false,
      fetching: false,
      // table
      columns: [
        {
          title: '序号',
          dataIndex: 'orderNum',
          key: 'orderNum',
          align: 'center',
          width: 50
        },
        {
          title: '药材名称',
          dataIndex: 'medicinalName',
          key: 'medicinalName',
          width: '18%',
          scopedSlots: { customRender: 'medicinalName' },
          align: 'center'
        },
        {
          title: '剂量',
          dataIndex: 'dosage',
          key: 'dosage',
          width: '10%',
          scopedSlots: { customRender: 'dosage' },
          align: 'center'
        },
        {
          title: '下药顺序',
          dataIndex: 'druggingOrder',
          key: 'druggingOrder',
          width: '10%',
          scopedSlots: { customRender: 'druggingOrder' },
          align: 'center'
        },
        {
          title: '是否毒性',
          dataIndex: 'toxic',
          key: 'toxic',
          width: '10%',
          align: 'center'
        },
        {
          title: '最大剂量',
          dataIndex: 'maxDosage',
          key: 'maxDosage',
          width: '10%',
          align: 'center'
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '8%',
          align: 'center'
        },
        {
          title: '价格',
          dataIndex: 'price',
          key: 'price',
          width: '8%',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 140,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          medicinalCode: '',
          orderNum: 1,
          medicinalName: undefined,
          dosage: '',
          maxDosage: '',
          unit: '',
          druggingOrder: undefined,
          toxic: '',
          editable: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['druggingOrders']),
    hasPrescriptionNo () {
      return !!this.prescriptionNo
    }
  },
  methods: {
    orderFilter (druggingOrder) {
      const druggingOrderText = this.druggingOrders.filter((item) => item.value === druggingOrder)[0]
      return druggingOrderText.label
    },
    handleSearch (value) {
      this.fetch(value, (data) => (this.selects = data))
    },
    toggle (orderNum) {
      const target = this.data.find((item) => item.orderNum === orderNum)
      target._originalData = { ...target }
      target.editable = !target.editable
    },
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
            if (this.currentValue === value) {
              const result = d.data || []
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
    newMember () {
      const length = this.data.length
      this.data.push({
        orderNum: length === 0 ? '1' : (parseInt(this.data[length - 1].orderNum) + 1).toString(),
        medicinalName: undefined,
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
      this.data.forEach((item, index) => {
        item.orderNum = index + 1
      })
    },
    saveRow (record) {
      console.log(record)
      this.memberLoading = true
      const { orderNum, medicinalName, dosage, druggingOrder } = record
      if (!druggingOrder || !medicinalName || !dosage) {
        this.memberLoading = false
        this.$message.error('请填写完整药品信息!')
        return
      }
      const target = this.data.find((item) => item.orderNum === orderNum)
      target.editable = false
      target.isNew = false
      this.memberLoading = false
    },
    cancel (orderNum) {
      const target = this.data.find((item) => item.orderNum === orderNum)
      Object.keys(target).forEach((orderNum) => {
        target[orderNum] = target._originalData[orderNum]
      })
      target._originalData = undefined
    },
    handleChange (value, orderNum, column, option) {
      const newData = [...this.data]
      const target = newData.find((item) => orderNum === item.orderNum)
      if (column === 'medicinalName') {
        const { itemData } = option.data.attrs
        target.editable = true
        target.dosage = itemData.dosage
        target.druggingOrder = itemData.druggingOrder
        target.medicinalCode = itemData.medicinalCode
        target.medicinalName = itemData.medicinalName
        target.toxic = itemData.toxic
        target.medicinalPyCode = itemData.medicinalPyCode
        target.price = itemData.price
        target.unit = itemData.unit
        this.data = newData
      } else {
        if (target) {
          target[column] = value
          this.data = newData
        }
      }
    }
  }
}
</script>
<style lang="less">
</style>
