/* const shiftDown = () => (settings) => {
  settings.shift = 'shift';
};

const shiftUp = () => (settings) => {
  settings.shift = 'noshift';
}; */

export default {
  Backquote: { row: 0, ru: { shift: 'Ё', noshift: 'ё' }, en: { shift: '~', noshift: '`' } },
  Digit1: { row: 0, ru: { shift: '!', noshift: '1' }, en: { shift: '!', noshift: '1' } },
  Digit2: { row: 0, ru: { shift: '"', noshift: '2' }, en: { shift: '@', noshift: '2' } },
  Digit3: { row: 0, ru: { shift: '№', noshift: '3' }, en: { shift: '#', noshift: '3' } },
  Digit4: { row: 0, ru: { shift: ';', noshift: '4' }, en: { shift: '$', noshift: '4' } },
  Digit5: { row: 0, ru: { shift: '%', noshift: '5' }, en: { shift: '%', noshift: '5' } },
  Digit6: { row: 0, ru: { shift: ':', noshift: '6' }, en: { shift: '^', noshift: '6' } },
  Digit7: { row: 0, ru: { shift: '?', noshift: '7' }, en: { shift: '&', noshift: '7' } },
  Digit8: { row: 0, ru: { shift: '*', noshift: '8' }, en: { shift: '*', noshift: '8' } },
  Digit9: { row: 0, ru: { shift: '(', noshift: '9' }, en: { shift: '(', noshift: '9' } },
  Digit0: { row: 0, ru: { shift: ')', noshift: '0' }, en: { shift: ')', noshift: '0' } },
  Minus: { row: 0, ru: { shift: '_', noshift: '-' }, en: { shift: '_', noshift: '-' } },
  Equal: { row: 0, ru: { shift: '+', noshift: '=' }, en: { shift: '+', noshift: '=' } },
  Backspace: {
    row: 0, type: 'control', className: 'keyboard__btn_backspace', ru: { shift: 'Backspace', noshift: 'Backspace' }, en: { shift: 'Backspace', noshift: 'Backspace' },
  },
  Tab: {
    row: 1, type: 'control', className: 'keyboard__btn_tab', ru: { shift: 'Tab', noshift: 'Tab' }, en: { shift: 'Tab', noshift: 'Tab' },
  },
  KeyQ: { row: 1, ru: { default: 'й' }, en: { default: 'q' } },
  KeyW: { row: 1, ru: { default: 'ц' }, en: { default: 'w' } },
  KeyE: { row: 1, ru: { default: 'у' }, en: { default: 'e' } },
  KeyR: { row: 1, ru: { default: 'к' }, en: { default: 'r' } },
  KeyT: { row: 1, ru: { default: 'е' }, en: { default: 't' } },
  KeyY: { row: 1, ru: { default: 'н' }, en: { default: 'y' } },
  KeyU: { row: 1, ru: { default: 'г' }, en: { default: 'u' } },
  KeyI: { row: 1, ru: { default: 'ш' }, en: { default: 'i' } },
  KeyO: { row: 1, ru: { default: 'щ' }, en: { default: 'o' } },
  KeyP: { row: 1, ru: { default: 'з' }, en: { default: 'p' } },
  BracketLeft: { row: 1, ru: { default: 'х' }, en: { shift: '[', noshift: '{' } },
  BracketRight: { row: 1, ru: { default: 'ъ' }, en: { shift: ']', noshift: '}' } },
  Backslash: {
    row: 1, ru: { shift: '/', noshift: '\\' }, en: { shift: '|', noshift: '\\' },
  },
  Delete: {
    row: 1, type: 'control', ru: { shift: 'Del', noshift: 'Del' }, en: { shift: 'Del', noshift: 'Del' },
  },

  CapsLock: {
    row: 2, type: 'control', subtype: 'sticky', className: 'keyboard__btn_capslock', ru: { shift: 'Caps Lock', noshift: 'Caps Lock' }, en: { shift: 'Caps Lock', noshift: 'Caps Lock' },
  },
  KeyA: { row: 2, ru: { default: 'ф' }, en: { default: 'a' } },
  KeyS: { row: 2, ru: { default: 'ы' }, en: { default: 's' } },
  KeyD: { row: 2, ru: { default: 'в' }, en: { default: 'd' } },
  KeyF: { row: 2, ru: { default: 'а' }, en: { default: 'f' } },
  KeyG: { row: 2, ru: { default: 'п' }, en: { default: 'g' } },
  KeyH: { row: 2, ru: { default: 'р' }, en: { default: 'h' } },
  KeyJ: { row: 2, ru: { default: 'о' }, en: { default: 'j' } },
  KeyK: { row: 2, ru: { default: 'л' }, en: { default: 'k' } },
  KeyL: { row: 2, ru: { default: 'д' }, en: { default: 'l' } },
  Semicolon: { row: 2, ru: { default: 'ж' }, en: { shift: ':', noshift: ';' } },
  Quote: { row: 2, ru: { default: 'э' }, en: { shift: '"', noshift: '\'' } },
  Enter: {
    row: 2, type: 'control', className: 'keyboard__btn_enter', ru: { shift: 'Enter', noshift: 'Enter' }, en: { shift: 'Enter', noshift: 'Enter' },
  },

  ShiftLeft: {
    row: 3, type: 'control', subtype: 'sticky', /* keyDown: shiftDown, keyUp: shiftUp, */ className: 'keyboard__btn_shift', ru: { shift: 'Shift', noshift: 'Shift' }, en: { shift: 'Shift', noshift: 'Shift' },
  },
  KeyZ: { row: 3, ru: { default: 'я' }, en: { default: 'z' } },
  KeyX: { row: 3, ru: { default: 'ч' }, en: { default: 'x' } },
  KeyC: { row: 3, ru: { default: 'с' }, en: { default: 'c' } },
  KeyV: { row: 3, ru: { default: 'м' }, en: { default: 'v' } },
  KeyB: { row: 3, ru: { default: 'и' }, en: { default: 'b' } },
  KeyN: { row: 3, ru: { default: 'т' }, en: { default: 'n' } },
  KeyM: { row: 3, ru: { default: 'ь' }, en: { default: 'm' } },
  Comma: { row: 3, ru: { default: 'б' }, en: { shift: '<', noshift: ',' } },
  Period: { row: 3, ru: { default: 'ю' }, en: { shift: '>', noshift: '.' } },
  Slash: { row: 3, ru: { shift: ',', noshift: '.' }, en: { shift: '?', noshift: '/' } },
  ArrowUp: {
    row: 3, type: 'control', ru: { default: '\u2191' }, en: { default: '\u2191' },
  },
  ShiftRight: {
    row: 3, type: 'control', subtype: 'sticky', /* keyDown: shiftDown, keyUp: shiftUp, */ ru: { shift: 'Shift', noshift: 'Shift' }, en: { shift: 'Shift', noshift: 'Shift' },
  },

  ControlLeft: {
    row: 4, type: 'control', subtype: 'sticky', className: 'keyboard__btn_ctrl', ru: { shift: 'Ctrl', noshift: 'Ctrl' }, en: { shift: 'Ctrl', noshift: 'Ctrl' },
  },
  MetaLeft: {
    row: 4, type: 'control', ru: { shift: 'Win', noshift: 'Win' }, en: { shift: 'Win', noshift: 'Win' },
  },
  AltLeft: {
    row: 4, type: 'control', className: 'keyboard__btn_alt', ru: { shift: 'Alt', noshift: 'Alt' }, en: { shift: 'Alt', noshift: 'Alt' },
  },
  Space: {
    row: 4, className: 'keyboard__btn_space', ru: { shift: ' ', noshift: ' ' }, en: { shift: ' ', noshift: ' ' },
  },
  AltRight: {
    row: 4, type: 'control', className: 'keyboard__btn_alt', ru: { shift: 'Alt', noshift: 'Alt' }, en: { shift: 'Alt', noshift: 'Alt' },
  },
  ControlRight: {
    row: 4, type: 'control', subtype: 'sticky', className: 'keyboard__btn_ctrl', ru: { shift: 'Ctrl', noshift: 'Ctrl' }, en: { shift: 'Ctrl', noshift: 'Ctrl' },
  },
  ArrowLeft: {
    row: 4, type: 'control', ru: { default: '\u2190' }, en: { default: '\u2190' },
  },
  ArrowDown: {
    row: 4, type: 'control', ru: { default: '\u2193' }, en: { default: '\u2193' },
  },
  ArrowRight: {
    row: 4, type: 'control', ru: { default: '\u2192' }, en: { default: '\u2192' },
  },
};
