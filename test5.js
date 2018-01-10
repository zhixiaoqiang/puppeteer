// disabledDate (time, type, current) {
//   let formData = this.props.form.getFieldsValue()
//   if (time === 'endTime') { // 'createTime'
//     if (type) {
//       if (formData.endTimeBe) {
//         return current && (current <= moment(formData.endTimeBe) || current > moment(new Date()))
//       }
//       return current && current > moment(new Date())
//     } else {
//       if (formData.endTimeAf) {
//         return current && current > moment(formData.endTimeAf).endOf('day')
//       }
//       return current && current > moment(new Date())
//     }
//   } else {
//     if (type) {
//       if (formData.createTimeBe) {
//         return current && (current <= moment(formData.createTimeBe) || current > moment(new Date()))
//       }
//       return current && current > moment(new Date())
//     } else {
//       if (formData.createTimeAf) {
//         return current && current > moment(formData.createTimeAf).endOf('day')
//       }
//       return current && current > moment(new Date())
//     }
//   }
// }

function disabledDate (time, type, current) {
  let formData = this.props.form.getFieldsValue()
  let time = {
    before: time === 'endTime' ? format.endTimeBe : format.createTimeBe,
    after: time === 'endTime' ? format.endTimeAf : format.createTimeAf
  }
  if (type) {
    if (time.before) return current && (current <= moment(time.before) || current > moment(new Date()))
  } else {
    if (time.after) return current && current > moment(time.after).endOf('day')
  }
  return current && current > moment(new Date())
}

disabledDate (time, type, current) {
  let formData = this.props.form.getFieldsValue()
  const before = time + 'Be', after = time + 'Af', curDate = moment(new Date())
  if (type && formData[before]) return current && (current <= moment(formData[before]) || current > curDate)
  if (!type && formData[after]) return current && current > moment(formData[after]).endOf('day')
  return current && current > curDate
}