<template>
  <div class="analysis-warp">
    <!-- <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总销售额" total="￥126,560">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>
          <template slot="footer">日均销售额<span>￥ 234.56</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总处方量" :total="recipeTotal | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template
            slot="footer"
          >当天处方量<span> {{ recipeToday | NumberFormat }}</span></template
          >
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="支付笔数" :total="6560 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">转化率 <span>60%</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="运营活动效果" total="78%">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row> -->

    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <!-- <div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" /> -->
          </div>
          <a-tab-pane loading="true" tab="药品使用量统计" key="1">
            <div style="padding:20px">
              <a-row>
                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                  <bar :data="medicineBarData" />
                </a-col>
                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <div class="ant-table-wrapper">
                    <s-table
                      :showSizeChanger="false"
                      style="height:400px"
                      row-key="id"
                      size="small"
                      :columns="medicineTableColumns"
                      showPagination="auto"
                      :data="loadData"
                    >
                    <!-- <span slot="range" slot-scope="text, record">
                      <trend :flag="record.status === 0 ? 'up' : 'down'"> {{ text }}% </trend>
                    </span> -->
                    </s-table>
                  </div>
                </a-col>
              </a-row>
            </div>

          </a-tab-pane>
          <a-tab-pane tab="诊所药品使用排行" key="2" v-if="isManager">
            <div style="padding:20px">
              <a-row>
                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                  <bar :data="clinicData" title="" />
                </a-col>
                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <div class="ant-table-wrapper">
                    <s-table
                      :showSizeChanger="false"
                      style="height:400px"
                      row-key="id"
                      size="small"
                      :columns="clinicColumns"
                      showPagination="auto"
                      :data="loadClinicData"
                    >
                    <!-- <span slot="range" slot-scope="text, record">
                      <trend :flag="record.status === 0 ? 'up' : 'down'"> {{ text }}% </trend>
                    </span> -->
                    </s-table>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { roleMixin } from '@/store/role-mixin'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea,
  STable
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
import { getMedicinalUsed } from '@/api/medicinal'
import { getClinicSaleReport } from '@/api/clinic'
const barData = []
const barData2 = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }
]
// const searchData = []
// for (let i = 0; i < 50; i += 1) {
//   searchData.push({
//     index: i + 1,
//     keyword: `搜索关键词-${i}`,
//     count: Math.floor(Math.random() * 1000),
//     range: Math.floor(Math.random() * 100),
//     status: Math.floor((Math.random() * 10) % 2)
//   })
// }

const DataSet = require('@antv/data-set')

const sourceData = [
  { item: '家用电器', count: 32.2 },
  { item: '食用酒水', count: 21 },
  { item: '个护健康', count: 17 },
  { item: '服饰箱包', count: 13 },
  { item: '母婴产品', count: 9 },
  { item: '其他', count: 7.8 }
]

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
})
const pieData = dv.rows

export default {
  name: 'Analysis',
  mixins: [baseMixin, roleMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
    STable
  },
  props: {
    recipeToday: {
      default: 0,
      type: Number
    },
    recipeTotal: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      loading: true,
      rankList,

      // 搜索用户数
      searchUserData,
      searchUserScale,
      queryParam: {},
      medicineTableColumns: [
        {
          dataIndex: 'medicinalName',
          title: '药品名称'
        },
        {
          dataIndex: 'useTotal',
          title: '使用量',
          width: 90
        }
      ],
      medicineData: [],
      clinicColumns: [
        {
          dataIndex: 'clinicName',
          title: '诊所名称'
        },
        {
          dataIndex: 'useTotal',
          title: '使用量',
          width: 90
        }
      ],
      clinicData: [],
      barData,
      medicineBarData: [],
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 500)
  },
  methods: {
    loadData (parameter) {
        const requestParameters = Object.assign({}, parameter)
        return getMedicinalUsed(requestParameters).then((res) => {
        const data = []
        res.data.data.forEach(el => {
         data.push({
            x: el.medicinalName,
            y: el.useTotal
         })
        })
        this.medicineBarData = data
        return res.data
      })
    },
    loadClinicData (parameter) {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getClinicSaleReport(requestParameters).then((res) => {
        const data = []
        res.data.data.forEach(el => {
         data.push({
            x: el.clinicName,
            y: el.useTotal
         })
        })
        this.clinicData = data
        return res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
<style lang="less">
  .analysis-warp {
    .ant-table-content{
      height: 417px;
    }
    .ant-table-body{
      border-bottom: 1px solid #e8e8e8;
    }
  }
</style>
