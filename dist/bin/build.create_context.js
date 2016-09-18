'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (content, settings) {
  var context = {
    build: {
      date: new Date()
    },
    site: {
      title: settings.title,
      description: settings.description,
      author: settings.author,
      language: settings.language,
      url: settings.url
    }
  };

  var hasError = false;
  var currentDate = new Date();
  content.forEach(function (item) {
    if (item.error) {
      console.error(item.error);
      hasError = true;
    }

    var contentItem = createContentItem(item, settings);

    if (contentItem.draft || contentItem.date && new Date(contentItem.date) > currentDate) {
      return;
    }

    var parent = context;
    item.folders.forEach(function (folder) {
      if (!parent[folder]) {
        parent[folder] = {};
      }
      parent = parent[folder];
    });

    parent[item.name] = contentItem;
  });

  return hasError ? null : context;
};

function createContentItem(item, settings) {
  var nameParts = item.name.split('--');
  var date = null;
  if (nameParts.length > 1) {
    date = nameParts.shift();
  }

  var contentItem = {
    author: settings.author,
    content: item.html,
    date: date,
    slug: nameParts.shift()
  };

  var path = item.folders.length ? '/' + item.folders.join('/') + '/' : '/';
  var extension = settings.prettyUrls ? '' : '.html';
  var slug = contentItem.slug === 'index' ? '' : contentItem.slug;
  contentItem.url = '' + path + slug + extension;

  (0, _keys2.default)(item.config).forEach(function (key) {
    if (Object.hasOwnProperty.call(item.config, key)) {
      contentItem[key] = item.config[key];
    }
  });

  return contentItem;
}