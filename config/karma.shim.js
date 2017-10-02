// Tests are run in an iframe so we expose parent globals required

window.require = window.top.require;
window.process = window.top.process;
window.module = window.top.module;
window.__dirname = window.top.__dirname;
require('module').globalPaths.push('./node_modules');
