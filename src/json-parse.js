import tokenize from './tokenize';
import inline from './inline';

const pushToArray = function(maybeArray, stuffToPush) {
  if (typeof maybeArray == 'undefined') {
    maybeArray = [];
  }

  if (Array.isArray(maybeArray)) {
    maybeArray.push(stuffToPush);
  } else {
    console.trace();
    throw 'First parameter to this function must be a proper array. Instead got: ' + JSON.stringify(maybeArray);
  }

  return maybeArray;
};

const parseToJson = function(script, toks, callback) {
  if (callback === undefined && typeof toks === 'function') {
    callback = toks;
    toks = undefined;
  }

  const tokens = tokenize(script);
  let i = tokens.length;
  let token;
  const output = {};


  output.title_page = {};
  output.script = {}; // script is an array of scenes

  output.tokens = toks ? tokens.reverse() : undefined;

  let scene = []; // the current running scene
  let dialogue = {
    type: 'unknown'
  }; // the current running dialogue
  let character = {
    type: 'unknown'
  }; // the current running character

  while (i--) {
    token = tokens[i];
    token.text = inline.lexer(token.text);

    switch (token.type) {
      case 'title':
        output.title = token.text.replace('<br />', ' ').replace(/<(?:.|\n)*?>/g, '');
        output.title_page.title = pushToArray(output.title_page.title, output.title);
        break;
      case 'credit':
        output.title_page.credit = pushToArray(output.title_page.credit, token.text);
        break;
      case 'author':
      case 'authors':
        output.title_page.authors = pushToArray(output.title_page.authors, token.text);
        break;
      case 'source':
        output.title_page.source = pushToArray(output.title_page.source, token.text);
        break;
      case 'notes':
        output.title_page.notes = pushToArray(output.title_page.notes, token.text);
        break;
      case 'draft_date':
        output.title_page.draftdate = pushToArray(output.title_page.draftdate, token.text);
        break;
      case 'date':
        output.title_page.date = pushToArray(output.title_page.date, token.text);
        break;
      case 'contact':
        output.title_page.contact = pushToArray(output.title_page.contact, token.text);
        break;
      case 'copyright':
        output.title_page.copyright = pushToArray(output.title_page.copyright, token.text);
        break;

      case 'scene_heading':
        output.script.scenes = pushToArray(output.script.scenes, scene);
        scene = [];
        scene = pushToArray(scene, {
          type: 'heading',
          scene_number: token.scene_number,
          heading: token.text
        });
        break;

      case 'transition':
        // push the current running scene onto the list, and begin a new one
        scene = pushToArray(scene, {
          type: 'transition',
          text: token.text
        });
        break;


      case 'dual_dialogue_begin':
        dialogue.characters = pushToArray(dialogue.characters, character);
        character = {
          type: 'unkown'
        };
        scene = pushToArray(scene, dialogue);
        dialogue = {
          type: 'dialogue-dual'
        };
        break;
      case 'dialogue_begin':
        dialogue.characters = pushToArray(dialogue.characters, character);
        character = {
          type: 'unkown'
        };
        scene = pushToArray(scene, dialogue);
        dialogue = {
          type: (token.dual ? 'dialogue-dual' : 'dialogue-single')
        };
        break;
      case 'character':
        dialogue.characters = pushToArray(dialogue.characters, character);
        character = {
          type: 'character',
          name: token.text
        };
        break;
      case 'parenthetical':
        character.lines = pushToArray(character.lines, {
          type: 'parenthetical',
          text: token.text
        });
        break;
      case 'dialogue':
        character.lines = pushToArray(character.lines, {
          type: 'line',
          text: token.text
        });
        break;
      case 'dialogue_end':
      case 'dual_dialogue_end':
        dialogue.characters = pushToArray(dialogue.characters, character);
        scene = pushToArray(scene, dialogue);
        dialogue = {
          type: 'dialogue-single'
        };
        break;

      case 'section':
        scene = pushToArray(scene, {
          type: 'section',
          name: token.text
        });
        break;
      case 'synopsis':
        scene = pushToArray(scene, {
          type: 'synopsis',
          text: token.text
        });
        break;

      case 'note':
      case 'boneyard_begin':
      case 'boneyard_end':
        // NO OP
        break;

      case 'action':
      case 'centered':
        scene = pushToArray(scene, {
          type: 'action',
          text: token.text
        });
        break;

      case 'page_break':
      case 'line_break':

        // NO OP
        break;
      default: console.log('Unexpected Token type', token.type, token.text);
    }
  }

  // ensure we track any dangling state:
  dialogue.characters = pushToArray(dialogue.characters, character);
  scene = pushToArray(scene, dialogue);
  output.script.scenes = pushToArray(output.script.scenes, scene);

  if (typeof callback === 'function') {
    return callback(output);
  }

  return output;
};

export default parseToJson;
