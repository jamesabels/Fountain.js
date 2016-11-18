// Fountain-parser.js 0.2.0
// http://www.opensource.org/licenses/mit-license.php
// Copyright (c) 2012 Matt Daly

var script = 'EXT BRICKS HOUSE - NIGHT /n';
var fountain = require('../../dist/fountain-js.min.js');
var fs = require('fs');

var file = fs.readFileSync('/Users/James/Fountain.js/examples/node-test/test-script.fountain', "utf8");
// console.log(file);


// console.log(fountain.parse(file));

fountain.parseJSON(file, true, function(output) {
  console.log(output.script.scenes);
});
