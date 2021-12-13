<template>
  <div>
    <a-card title="药品报表">
      <div slot="extra">
        <span class="time-type" :class="{active: queryParam.type === item.value}" @click="selectTime(item.value)" v-for="item in timeTypeList" :key="item.value">
          {{ item.label }}
        </span>
        <a-range-picker format="YYYY-MM-DD HH:mm:ss" @change="changeRange" v-model="rangeTime" show-time @ok="changePicker"> </a-range-picker>
      </div>
      <div class="table-operator" style="display:flex">
        <a-button type="primary" @click="downloadReport" icon="export">导出</a-button>
      </div>
      <div>
        <s-table
          ref="table"
          size="default"
          :rowKey="record => record.id"
          :columns="columns"
          :data="loadData"
          showPagination="auto"
        >
        </s-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { medicinalReport, medicinalReportExport } from '@/api/report'
import { STable } from '@/components'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import { downloadFile } from '@/utils/util'
 const timeTypeList = [
      {
        index: 0,
        label: '本周',
        value: 'WEEK'
      },
      {
        index: 1,
        label: '本月',
        value: 'MONTH'
      },
      {
        index: 2,
        label: '本年',
        value: 'YEAR'
      }
    ]

export default {
  name: 'MedicinalChart',
  components: {
    STable
  },
  data () {
    return {
        columns: [
          {
             title: '名称',
             dataIndex: 'medicinalName'
          },
           {
             title: '编号',
             dataIndex: 'medicinalCode'
          },
           {
             title: '用量',
             dataIndex: 'medicinalUseTotal'
          }
        ],
        timeTypeList,
        rangeTime: [],
        pageNum: 1,
        pageSize: 10,
        queryParam: {
          type: 'YEAR', // WEEK  MONTH YEAR
          startTime: null,
          endTime: null,
          pageNum: 1,
          pageSize: 10
        },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return medicinalReport(requestParameters)
          .then(res => {
            return res.data || { data: [] }
          })
      }
    }
  },
  created () {
    // this.getMedicinalReport()
  },
  mounted () {
  },
  methods: {
    downloadReport () {
      medicinalReportExport({
        ...this.queryParam
      }).then(res => {
        console.log(res)
        downloadFile(res)
      })
    },
    changePicker (dateTime) {
      this.queryParam.type = 'TIME'
      const start = dateTime[0]
      const end = dateTime[1]
      this.queryParam.startTime = moment(new Date(start)).format('YYYY-MM-DD HH:mm:ss')
      this.queryParam.endTime = moment(new Date(end)).format('YYYY-MM-DD HH:mm:ss')
    },
    changeRange (dateTime) {
      if (isEmpty(dateTime)) {
         this.queryParam.type = 'WEEK'
         this.queryParam.startTime = ''
         this.queryParam.endTime = ''
      }
    },
    selectTime (type) {
      this.rangeTime = []
      this.queryParam.type = type
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style lang="less" scoped>
.time-type {
  cursor: pointer;
  margin-right: 16px;
  &.active{
    color: red;
  }
}
</style>
