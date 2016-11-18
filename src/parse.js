  import inline from './inline';
  import tokenize from './tokenize';

  const parse = function(script, toks, callback) {

    if (callback === undefined && typeof toks === 'function') {
      callback = toks;
      toks = undefined;
    }

    const tokens = tokenize(script);
    let i = tokens.length;
    let  token;
    let title;
    const titlePage = [];
    const  html = [];

    while (i--) {
      token = tokens[i];
      token.text = inline.lexer(token.text);

      switch (token.type) {
        case 'title': titlePage.push('<h1>' + token.text + '</h1>'); title = token.text.replace('<br />', ' ').replace(/<(?:.|\n)*?>/g, ''); break;
        case 'credit': titlePage.push('<p class=\"credit\">' + token.text + '</p>'); break;
        case 'author': titlePage.push('<p class=\"authors\">' + token.text + '</p>'); break;
        case 'authors': titlePage.push('<p class=\"authors\">' + token.text + '</p>'); break;
        case 'source': titlePage.push('<p class=\"source\">' + token.text + '</p>'); break;
        case 'notes': titlePage.push('<p class=\"notes\">' + token.text + '</p>'); break;
        case 'draft_date': titlePage.push('<p class=\"draft-date\">' + token.text + '</p>'); break;
        case 'date': titlePage.push('<p class=\"date\">' + token.text + '</p>'); break;
        case 'contact': titlePage.push('<p class=\"contact\">' + token.text + '</p>'); break;
        case 'copyright': titlePage.push('<p class=\"copyright\">' + token.text + '</p>'); break;

        case 'scene_heading': html.push('<h3' + (token.scene_number ? ' id=\"' + token.scene_number + '\">' : '>') + token.text + '</h3>'); break;
        case 'transition': html.push('<h2>' + token.text + '</h2>'); break;

        case 'dual_dialogue_begin': html.push('<div class=\"dual-dialogue\">'); break;
        case 'dialogue_begin': html.push('<div class=\"dialogue' + (token.dual ? ' ' + token.dual : '') + '\">'); break;
        case 'character': html.push('<h4>' + token.text + '</h4>'); break;
        case 'parenthetical': html.push('<p class=\"parenthetical\">' + token.text + '</p>'); break;
        case 'dialogue': html.push('<p>' + token.text + '</p>'); break;
        case 'dialogue_end': html.push('</div> '); break;
        case 'dual_dialogue_end': html.push('</div> '); break;

        case 'section': html.push('<p class=\"section\" data-depth=\"' + token.depth + '\">' + token.text + '</p>'); break;
        case 'synopsis': html.push('<p class=\"synopsis\">' + token.text + '</p>'); break;

        case 'note': html.push('<!-- ' + token.text + '-->'); break;
        case 'boneyard_begin': html.push('<!-- '); break;
        case 'boneyard_end': html.push(' -->'); break;

        case 'action': html.push('<p>' + token.text + '</p>'); break;
        case 'centered': html.push('<p class=\"centered\">' + token.text + '</p>'); break;

        case 'page_break': html.push('<hr />'); break;
        case 'line_break': html.push('<br />'); break;

        default: console.log('Unexpected Token type', token.text);
      }
    }

    const output = { title, html: { titlePage: titlePage.join(''), script: html.join('') }, tokens: toks ? tokens.reverse() : undefined };

    if (typeof callback === 'function') {
      return callback(output);
    }

    return output;
  };

  export default parse;
