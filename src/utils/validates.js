
// 手机号(最宽松)
export const validateCellPhone = (rule, value, callback) => {
  const regex = /^(?:(?:\+|00)86)?1\d{10}$/
  if (value && !regex.test(value)) {
    callback(new Error('手机号码格式不正确'))
  }
  callback()
}

// 座机号码
export const validateTelPhone = (rule, value, callback) => {
  const regex = /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/
  if (value && !regex.test(value)) {
    callback(new Error('座机号码格式不正确'))
  }
  callback()
}

// 只校验数字或者横杠
export const validatePhone = (rule, value, callback) => {
  const regex = /^([0-9-]+)$/
  if (value && !regex.test(value)) {
    callback(new Error('电话号码格式不正确'))
  }
  callback()
}

// 身份证
export const validateIdCard = (rule, value, callback) => {
  const regex = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
  if (value && !regex.test(value)) {
    callback(new Error('身份证号码格式不正确'))
  }
  callback()
}

// 价格(正整数,或小数点后一位或两位)
export const validatePrice = (rule, value, callback) => {
  const regex = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
  if (value && !regex.test(value)) {
    callback(new Error('请输入正确的价格格式'))
  }
  callback()
}
