// # module: siren
//
// A small object oriented language for teaching.

// -- Dependencies -----------------------------------------------------
var Parser = require('./language/parser').SirenParser;
var generate = require('./language/generation');
var escodegen = require('escodegen');
var path = require('path');
var fs = require('fs');
var vm = require('vm');

exports.parse = parse;
function parse(text) {
  return Parser.matchAll(text, 'program');
}

exports.toJsAst = toJsAst;
function toJsAst(ast) {
  return generate(ast);
}

exports.generateJs = generateJs;
function generateJs(ast) {
  return escodegen.generate(ast.toObject());
}

exports.makeRuntime = makeRuntime;
function makeRuntime() {
  installExtensions();
  var prelude = path.join(__dirname, '../runtime');
  return require(prelude);
}

exports.run = run;
function run(source, runtime, filename) {
  global.Siren = runtime;
  return filename && filename !== '<stdin>'?
    require(filename).exports
  : vm.runInThisContext(source, { filename: filename });
}

exports.installExtensions = installExtensions;
function installExtensions() {
  if (!require.extensions['.siren']) {
    require.extensions['.siren'] = function(module, filename) {
      var code = fs.readFileSync(filename, 'utf8');
      module._compile(compile(code), filename);
    };
  }
}

var compile = exports.compile = parse ->> toJsAst ->> generateJs;
