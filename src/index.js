// fountain-js 0.1.10
// http://www.opensource.org/licenses/mit-license.php
// Copyright (c) 2012 Matt Daly

import parse from './parse';
import parseToJson from './json-parse';

const fountain = function(script, callback) {
  return fountain.parse(script, callback);
};

fountain.parse = function(script, tokens, callback) {
  return parse(script, tokens, callback);
};

fountain.parseJSON = function(script, tokens, callback) {
  return parseToJson(script, tokens, callback);
};

export default fountain;
