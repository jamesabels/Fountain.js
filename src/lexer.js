import Regex from './regex';

const lexer = function(script) {
  return script.replace(Regex.boneyard, '\n$1\n')
    .replace(Regex.standardizer, '\n')
    .replace(Regex.cleaner, '')
    .replace(Regex.whitespacer, '');
};

export default lexer;
