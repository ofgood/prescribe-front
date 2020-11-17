
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
