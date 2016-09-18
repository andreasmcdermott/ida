'use strict';

const Handlebars = require('handlebars');
const helpers = require('../lib/hbs_helpers');

module.exports = function (templates, partials) {
  registerHandlebarsPartials(partials);
  registerHandlebarsHelpers();
  return compileHandlebarsTemplates(templates);
};

function compileHandlebarsTemplates(templates) {
  const compiled = {};
  templates.forEach(template => {
    let parent = compiled;
    template.folders.forEach(folder => {
      if (!parent[folder]) {
        parent[folder] = {};
      }
      parent = parent[folder];
    });
    parent[template.name] = Handlebars.compile(template.template);
  });
  return compiled;
}

function registerHandlebarsPartials(partials) {
  partials.forEach(partial => {
    let template = Handlebars.compile(partial.template);
    Handlebars.registerPartial(partial.name, template);
  });
}

function registerHandlebarsHelpers() {
  helpers.forEach(helper => {
    Handlebars.registerHelper(helper.name, helper.func);
  });
}