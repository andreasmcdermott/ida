'use strict';

var Handlebars = require('handlebars');
var helpers = require('../lib/hbs_helpers');

module.exports = function (templates, partials) {
  registerHandlebarsPartials(partials);
  registerHandlebarsHelpers();
  return compileHandlebarsTemplates(templates);
};

function compileHandlebarsTemplates(templates) {
  var compiled = {};
  templates.forEach(function (template) {
    var parent = compiled;
    template.folders.forEach(function (folder) {
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
  partials.forEach(function (partial) {
    var template = Handlebars.compile(partial.template);
    Handlebars.registerPartial(partial.name, template);
  });
}

function registerHandlebarsHelpers() {
  helpers.forEach(function (helper) {
    Handlebars.registerHelper(helper.name, helper.func);
  });
}