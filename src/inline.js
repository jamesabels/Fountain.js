  import regex from './regex';

  const inline = {
    note: '<!-- $1 -->',

    line_break: '<br />',

    bold_italic_underline: '<span class=\"bold italic underline\">$2</span>',
    bold_underline: '<span class=\"bold underline\">$2</span>',
    italic_underline: '<span class=\"italic underline\">$2</span>',
    bold_italic: '<span class=\"bold italic\">$2</span>',
    bold: '<span class=\"bold\">$2</span>',
    italic: '<span class=\"italic\">$2</span>',
    underline: '<span class=\"underline\">$2</span>'
  };

  inline.lexer = function(s) {
    if (!s) {
      return;
    }

    const styles = ['underline', 'italic', 'bold', 'bold_italic', 'italic_underline', 'bold_underline', 'bold_italic_underline'];
    let i = styles.length;
    let style;
    let match;

    s = s.replace(regex.note_inline, inline.note).replace(/\\\*/g, '[star]').replace(/\\_/g, '[underline]').replace(/\n/g, inline.line_break);

    // if (regex.emphasis.test(s)) {                         // this was causing only every other occurence of an emphasis syntax to be parsed
    while (i--) {
      style = styles[i];
      match = regex[style];

      if (match.test(s)) {
        s = s.replace(match, inline[style]);
      }
    }
    // }

    return s.replace(/\[star\]/g, '*').replace(/\[underline\]/g, '_').trim();
  };

  export default inline;
