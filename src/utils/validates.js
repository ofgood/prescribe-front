
// 手机号(最宽松)
export const validateCellPhone = (rule, value, callback) => {
  const regex = /^(?:(?:\+|00)86)?1\d{10}$/
  if (value && !regex.test(value)) {
    callback(new Error('手机号码格式不正确'))
  }
  callback()
}
