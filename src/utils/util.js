export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () { }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function filterOption (input, option) {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

/**
* 加法
* @param arg1
* @param arg2
* @returns
*/
export function accAdd (arg1, arg2) {
  var r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 };
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 };
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

/**
* 减法
* @param arg1
* @param arg2
* @returns
*/
export function accSubtr (arg1, arg2) {
  var r1, r2, m, n
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

/***
* 乘法，获取精确乘法的结果值
* @param arg1
* @param arg2
* @returns
*/
export function accMul (arg1, arg2) {
  var m = 0; var s1 = arg1.toString(); var s2 = arg2.toString()
  try { m += s1.split('.')[1].length } catch (e) { };
  try { m += s2.split('.')[1].length } catch (e) { };
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/***
* 除法，获取精确除法的结果值
* @param arg1
* @param arg2
* @returns
*/
export function accDivCoupon (arg1, arg2) {
  var t1 = 0; var t2 = 0; var r1; var r2
  try { t1 = arg1.toString().split('.')[1].length } catch (e) { }
  try { t2 = arg2.toString().split('.')[1].length } catch (e) { }
    r1 = Number(arg1.toString().replace('.', ''))
    r2 = Number(arg2.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
}

/**
 * hasClass
 * @param {*} elem 元素
 * @param {*} cls class名称
 */
export function hasClass (elem, cls) {
  cls = cls || ''
  if (cls.replace(/\s/g, '').length === 0) return false // 当cls没有参数时，返回false
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ')
}
/**
 * addClass
 * @param {*} elem 元素
 * @param {*} cls class名称
 */
export function addClass (ele, cls) {
  if (!hasClass(ele, cls)) {
    console.log(ele)
    ele.className = ele.className === '' ? cls : ele.className + ' ' + cls
  }
}
