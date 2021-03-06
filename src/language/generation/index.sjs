// # module: siren.language.generation
//
// Exposes a way of generating JS from Siren ASTs.

// -- Dependencies -----------------------------------------------------
var { BindingBox, generate } = require('./codegen');
var resolveBindings = require('./resolve-bindings');

// -- Exports ----------------------------------------------------------
module.exports = function(ast) {
  return resolveBindings(['Module'], ast)
      |> λ[generate(new BindingBox(), #)];
}
