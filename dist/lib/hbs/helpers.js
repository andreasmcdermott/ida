'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [{
  name: 'dateFormat',
  func: function func(date, format, locale) {
    return (0, _moment2.default)(date || new Date()).locale(locale || 'en').format(format || '');
  }
}, {
  name: 'dateFromNow',
  func: function func(date, locale) {
    return (0, _moment2.default)(date).locale(locale || 'en').fromNow();
  }
}, {
  name: '?',
  func: function func(conditional, ifTrue, ifFalse) {
    return conditional ? ifTrue : ifFalse;
  }
}];