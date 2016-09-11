'use strict';

const co = require('co');
const fs = require('co-fs');
const marked = require('marked');

module.exports = function(project_root) {
  return co(function *() {
    const content_root = `${project_root}/content`;
    const stats = yield fs.stat(content_root);
    if (!stats.isDirectory()) {
      throw new Error(`"${content_root}" exists, but is not a folder.. That's weird.`);
    }

    function iterateFiles(subPath, content) {
      return co(function *() {
        const path = !subPath ? content_root : `${content_root}/${subPath}`;
        const files = yield fs.readdir(path);
        for (let i = 0; i < files.length; ++i) {
          const file = files[i];
          const filePath = `${path}/${file}`;
          yield co(function *() {
            const stats = yield fs.stat(filePath);
            if (stats.isFile()) {
              const fileContent = yield fs.readFile(filePath, 'utf8');
              const parsedContent = parseFileContent(fileContent);
              content.files.push( { 
                filename: file, 
                config: parsedContent.config,
                markdown: parsedContent.markdown,
                html: parsedContent.html,
                error: parsedContent.error 
              });
            } else if (stats.isDirectory()) {
              content.folders[file] = yield iterateFiles(`${subPath}${file}`, { files: [], folders: {} });
            }
          });
        };

        return content;
      });
    }

    return iterateFiles('', { files: [], folders: {} });
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

  console.log(parsedContent);

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

  throw new Error('Invalid JSON. Closing brackets ("}") need to match opening brackets ("{"}).');
}