import regex from './regex';

const lexer = function(script) {
  return script.replace(regex.boneyard, '\n$1\n')
    .replace(regex.standardizer, '\n')
    .replace(regex.cleaner, '')
    .replace(regex.whitespacer, '');
};

export default lexer;
