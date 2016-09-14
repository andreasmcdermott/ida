'use strict';

const moment = require('moment');

module.exports = [{
  name: 'dateFormat',
  func: function (date, format, locale) {
    return moment(date || new Date())
      .locale(locale || 'en')
      .format(format || '');
  }
}, {
  name: 'dateFromNow',
  func: function (date, locale) {
    return moment(date)
      .locale(locale || 'en')
      .fromNow();
  }
}, {
  name: '?',
  func: function (conditional, ifTrue, ifFalse) {
    return conditional ? ifTrue : ifFalse;
  }
}];