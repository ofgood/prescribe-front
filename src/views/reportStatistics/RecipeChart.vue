<template>
  <div>
    <a-card title="处方报表分析">
      <div slot="extra">
        <span class="time-type" :class="{active: type === item.value}" @click="selectTime(item.value)" v-for="item in timeTypeList" :key="item.value">
          {{ item.label }}
        </span>
        <a-range-picker format="YYYY-MM-DD HH:mm:ss" @change="changeRange" v-model="rangeTime" show-time @ok="changePicker"> </a-range-picker>
      </div>
      <div>
        <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { clinicRecipeReport } from '@/api/report'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
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
  name: 'RecipeChart',
  data () {
    return {
        timeTypeList,
        startTime: '',
        endTime: '',
        type: 'WEEK', // WEEK  MONTH YEAR
        xAxisData: [],
        seriesData: [],
        rangeTime: []
    }
  },
  created () {
    this.getClinicRecipeReport()
  },
  mounted () {
  },
  methods: {
    changePicker (dateTime) {
      this.type = 'TIME'
      const start = dateTime[0]
      const end = dateTime[1]
      this.startTime = moment(new Date(start)).format('YYYY-MM-DD HH:mm:ss')
      this.endTime = moment(new Date(end)).format('YYYY-MM-DD HH:mm:ss')
      this.getClinicRecipeReport()
    },
     changeRange (dateTime) {
      if (isEmpty(dateTime)) {
         this.type = 'WEEK'
         this.startTime = ''
         this.endTime = ''
         this.getClinicRecipeReport()
      }
    },
    getClinicRecipeReport () {
      clinicRecipeReport({
      startTime: this.startTime,
      endTime: this.endTime,
      type: this.type
      }).then((res) => {
        if (res.success) {
          const clinicRecipeReportData = res.data || []
          this.xAxisData = clinicRecipeReportData.map(item => item.clinicName)
          this.seriesData = clinicRecipeReportData.map(item => item.recipeCount)
          this.drawLine(this.xAxisData, this.seriesData)
        }
      })
    },
    selectTime (type) {
      this.type = type
      this.getClinicRecipeReport()
    },
     drawLine (xAxisData, seriesData) {
        const myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
            title: { text: '' },
            tooltip: {},
            xAxis: {
                data: xAxisData
            },
            yAxis: {},
            series: [{
                name: '处方量',
                type: 'bar',
                data: seriesData
            }],
            dataZoom: [{
              type: 'slider',
              show: true,
              start: 0, // 数据窗口范围的起始百分比,表示30%
              end: 100 // 数据窗口范围的结束百分比,表示70%
            }]
        })
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
