'use strict'

import moment from 'moment'

export default [{
  name: 'dateFormat',
  func: (date, format, locale) => {
    return moment(date || new Date())
      .locale(locale || 'en')
      .format(format || '')
  }
}, {
  name: 'dateFromNow',
  func: (date, locale) => {
    return moment(date)
      .locale(locale || 'en')
      .fromNow()
  }
}, {
  name: '?',
  func: (conditional, ifTrue, ifFalse) => {
    return conditional ? ifTrue : ifFalse
  }
}]
