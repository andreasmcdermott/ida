'use strict';

const co = require('co');
const fs = require('co-fs');
const marked = require('marked');

module.exports = {
  get_settings: function (project_root) {
    return co(function *() {
      const json = yield fs.readFile(`${project_root}/ida.json`);
      return JSON.parse(json);
    })
    .catch(err => {
      throw new Error(`"ida.json" was not found in "${project_root}". Are you sure this is the project root?`);
    });
  },
  get_layout_folder: function (project_root, settings) {
    return co(function *() {
      const pathToLayout = settings.template ? 
        `${project_root}/templates/${settings.template}` :
        `${project_root}/layout`;
      
      const stats = yield fs.stat(pathToLayout);
      if (!stats.isDirectory()) {
        throwError();
      }

      return pathToLayout;
    })
    .catch(function (err) {
      throwError();
    });

    function throwError() {
      if (settings.template) {
        throw new Error(`Couldn't find template "${settings.template}" in folder "${project_root}/templates.`);
      } else {
        throw new Error(`Couldn't find folder "${project_root}/layout".`);
      }
    }
  },
  get_content: function(project_root) {
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
                const parsedContent = parseFileContent(fileContent.trim());
                console.log(file, parsedContent);
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
  }
};

function parseFileContent(fileContent) {
  var parsedContent = { config: null, markdown: null, html: null, error: null };
  if (fileContent.startsWith('{')) {
    let open = 0;
    
    for (let i = 0; i < fileContent.length; ++i) {
      if (fileContent[i] === '{') {
        ++open;
      } else if (fileContent[i] === '}') {
        --open;
        if (open === 0) {
          try {
            parsedContent.config = JSON.parse(fileContent.substr(0, i + 1));
          } catch(err) {
            parsedContent.error = `Invalid JSON: ${err}`;
            return parsedContent;  
          }

          fileContent = fileContent.substr(i + 1);
          break;
        }
      }
    }

    if (open !== 0) {
      parsedContent.error = 'Invalid JSON config.';
      return parsedContent;
    }
  }

  parsedContent.markdown = fileContent.trim();
  parsedContent.html = marked(parsedContent.markdown);

  return parsedContent;
}