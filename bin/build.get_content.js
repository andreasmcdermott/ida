'use strict';

const co = require('co');
const fs = require('co-fs');
const getAllFiles = require('../fs/get_all_files');
const stripFolderAndExtension = require('../fs/strip_folder_and_extension');
const marked = require('marked');

module.exports = function(project_root) {
  return co(function *() {
    const content_root = `${project_root}/content`;
    const stats = yield fs.stat(content_root);
    if (!stats.isDirectory()) {
      throw new Error(`"${content_root}" exists, but is not a folder.. That's weird.`);
    }

    const files = yield getAllFiles(content_root);
    const content = [];
    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      const fileContent = yield fs.readFile(file, 'utf8');
      const parsedContent = parseFileContent(fileContent);
      const fileName = file.substr(content_root.length + 1);
      const folders = fileName.split('/').slice(0, -1);
      const name = stripFolderAndExtension(fileName);

      content.push({ 
        name,
        folders,
        config: parsedContent.config || {},
        markdown: parsedContent.markdown || '',
        html: parsedContent.html || '',
        error: parsedContent.error 
      });
    }

    return content;
  })
  .catch(function (err) {
    console.error(err.message);
  });
};

function parseFileContent(fileContent) {
  fileContent = fileContent.trim();
  var parsedContent = { config: null, markdown: null, html: null, error: null };

  if (fileContent.startsWith('{')) {
    try {
      const config = getConfig(fileContent);
      parsedContent.config = JSON.parse(config);
      fileContent = fileContent.substr(config.length);
    } catch(err) {
      parsedContent.error = err;
    }
  }

  parsedContent.markdown = fileContent.trim();
  parsedContent.html = marked(parsedContent.markdown);

  return parsedContent;
}

function getConfig(fileContent) {
  let open = 0;
    
  for (let i = 0; i < fileContent.length; ++i) {
    if (fileContent[i] === '{') {
      ++open;
    } else if (fileContent[i] === '}') {
      --open;

      if (open === 0) {
        return fileContent.substr(0, i + 1);
      }
    }
  }

  throw new Error('Invalid JSON.');
}