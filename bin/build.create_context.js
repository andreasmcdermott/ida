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
  let currentDate = new Date();
  content.forEach(item => {
    if (item.error) {
      console.error(item.error);
      hasError = true;
    }

    let contentItem = createContentItem(item, settings);

    if (contentItem.draft || (contentItem.date && new Date(contentItem.date) > currentDate)) {
      return;
    }

    let parent = context;
    item.folders.forEach(folder => {
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

  let path = item.folders.length ? `/${item.folders.join('/')}/` : '/';
  let extension = settings.prettyUrls ? '' : '.html';
  let slug = contentItem.slug === 'index' ? '' : contentItem.slug;
  contentItem.url = `${path}${slug}${extension}`;

  Object.keys(item.config).forEach(key => {
    if (Object.hasOwnProperty.call(item.config, key)) {
      contentItem[key] = item.config[key];
    }
  });

  return contentItem;
}