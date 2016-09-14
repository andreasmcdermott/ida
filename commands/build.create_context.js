'use strict';

module.exports = function (content, settings) {
  const context = {
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

  let hasError = false;
  content.forEach(item => {
    if (item.error) {
      console.error(item.error);
      hasError = true;
    }

    let parent = context;
    item.folders.forEach(folder => {
      if (!parent[folder]) {
        parent[folder] = {};
      }
      parent = parent[folder];
    });
    parent[item.name] = createContentItem(item, settings);
  });

  return hasError ? null : context;
};

function createContentItem(item, settings) {
  const nameParts = item.name.split('--');
  let date = null;
  if (nameParts.length > 1) {
    date = nameParts.shift();
  }

  const contentItem = {
    author: settings.author,
    content: item.html,
    date,
    slug: nameParts.shift(),
  };

  contentItem.url = `/${contentItem.slug}${settings.prettyUrls ? '' : '.html'}`;

  Object.keys(item.config).forEach(key => {
    if (Object.hasOwnProperty.call(item.config, key)) {
      contentItem[key] = item.config[key];
    }
  });

  return contentItem;
}