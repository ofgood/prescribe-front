const echarts = require('echarts')
const MyEcharts = {}
MyEcharts.install = function (Vue, options) {
  Vue.prototype.$echarts = echarts
}
export default MyEcharts
