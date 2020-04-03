// eslint-disable-next-line import/extensions
import buttons from './keyboardCodes.js';

const keyboard = document.createElement('div');
const settings = {
  get lang() {
    return localStorage.getItem('virtual-keyboard.lang') || 'ru';
  },
  set lang(value) {
    localStorage.setItem('virtual-keyboard.lang', value);
  },
  shift: 'noshift',
  prevKeyboardCode: null,
  charRepeatTimer: null,
  ctrl: 'noctrl',
  alt: 'noalt',
  capsLock: 'nocaps',
};
const buttonPressedClassName = 'keyboard__btn_pressed';
const keyboardShiftedClassName = 'keyboard_shifted';
let targetControl = null;
const repeatTimeout = 200;

const updateButtons = (cond) => {
  let keysToUpdate = Object.keys(buttons);
  if (cond) {
    keysToUpdate = keysToUpdate.filter(cond);
  }
  keysToUpdate.forEach((x) => {
    buttons[x].uiElement.innerText = buttons[x][settings.lang][settings.shift]
      || buttons[x][settings.lang].default;
  });
  if ((settings.shift === 'shift' && settings.capsLock !== 'caps')
      || (settings.shift !== 'shift' && settings.capsLock === 'caps')) {
    keyboard.classList.add(keyboardShiftedClassName);
  } else {
    keyboard.classList.remove(keyboardShiftedClassName);
  }
};

const setShift = (shift) => {
  if (shift) {
    settings.shift = 'shift';
  } else {
    [buttons.ShiftLeft,
      buttons.ShiftRight].forEach((x) => {
      x.uiElement.classList.remove(buttonPressedClassName);
    });

    settings.shift = 'noshift';
  }
  updateButtons();
};
const setCtrl = (ctrl) => {
  if (ctrl) {
    settings.ctrl = 'ctrl';
  } else {
    [buttons.ControlLeft,
      buttons.ControlRight].forEach((x) => {
      x.uiElement.classList.remove(buttonPressedClassName);
    });

    settings.ctrl = 'noctrl';
  }
  updateButtons();
};
const checkSpecialKeysCombination = () => {
  if (settings.ctrl === 'ctrl' && settings.shift === 'shift') {
    settings.lang = settings.lang === 'ru' ? 'en' : 'ru';
    settings.ctrl = 'noctrl';
    setShift(false);
    setCtrl(false);
    return false;
  }
  return true;
};

// Additional keys processing
const createDefaultControlKeyProcessing = (callback) => () => {
  callback();
  checkSpecialKeysCombination();
  updateButtons((x) => !buttons[x].default);
};

buttons.CapsLock.keyDown = createDefaultControlKeyProcessing(() => { settings.capsLock = 'caps'; });
buttons.CapsLock.keyUp = createDefaultControlKeyProcessing(() => { settings.capsLock = 'nocaps'; });

buttons.ShiftLeft.keyDown = createDefaultControlKeyProcessing(() => { setShift(true); });
buttons.ShiftLeft.keyUp = createDefaultControlKeyProcessing(() => { settings.shift = 'noshift'; });
buttons.ShiftRight.keyDown = createDefaultControlKeyProcessing(() => { setShift(true); });
buttons.ShiftRight.keyUp = createDefaultControlKeyProcessing(() => { settings.shift = 'noshift'; });

buttons.ControlRight.keyDown = createDefaultControlKeyProcessing(() => { settings.ctrl = 'ctrl'; });
buttons.ControlRight.keyUp = createDefaultControlKeyProcessing(() => { settings.ctrl = 'noctrl'; });
buttons.ControlLeft.keyDown = createDefaultControlKeyProcessing(() => { settings.ctrl = 'ctrl'; });
buttons.ControlLeft.keyUp = createDefaultControlKeyProcessing(() => { settings.ctrl = 'noctrl'; });

buttons.AltRight.keyDown = createDefaultControlKeyProcessing(() => { settings.alt = 'alt'; });
buttons.AltRight.keyUp = createDefaultControlKeyProcessing(() => { settings.alt = 'noalt'; });
buttons.AltLeft.keyDown = createDefaultControlKeyProcessing(() => { settings.alt = 'alt'; });
buttons.AltLeft.keyUp = createDefaultControlKeyProcessing(() => { settings.alt = 'noalt'; });

/* removeChar: false - before, true - after */
const updateTextarea = (charToAdd, removeChar) => {
  let positionToRestore = targetControl.selectionStart;
  if (charToAdd) {
    targetControl.value = targetControl.value.substring(0, targetControl.selectionStart)
      + charToAdd
      + targetControl.value.substring(targetControl.selectionEnd);
    positionToRestore += 1;
  }
  if (removeChar !== undefined) {
    if (targetControl.selectionStart !== targetControl.selectionEnd) {
      targetControl.value = targetControl.value.substring(0, targetControl.selectionStart)
        + targetControl.value.substring(targetControl.selectionEnd);
    } else if (removeChar) {
      targetControl.value = targetControl.value.substring(0, targetControl.selectionStart)
        + targetControl.value.substring(targetControl.selectionStart + 1);
    } else {
      targetControl.value = targetControl.value.substring(0, targetControl.selectionStart - 1)
        + targetControl.value.substring(targetControl.selectionStart);
      positionToRestore -= 1;
    }
  }
  targetControl.selectionEnd = positionToRestore;
};

const moveCursorX = (step) => {
  if (targetControl.selectionStart === targetControl.selectionEnd) {
    targetControl.selectionStart += step;
    targetControl.selectionEnd = targetControl.selectionStart;
  } else if (step < 0) {
    targetControl.selectionStart += step;
  } else {
    targetControl.selectionEnd += step;
  }
};

const moveCursorY = (step) => {
  const rows = targetControl.value.split('\n');
  let rowSelectionStart = targetControl.selectionStart;
  let foundRowIdx = -1;
  if (rows.some((x, idx) => {
    if (rowSelectionStart > x.length) {
      rowSelectionStart -= x.length + 1;
      return false;
    }
    foundRowIdx = idx;
    return true;
    // Found selection in row
  })) {
    if (step < 0) {
    // First row and trying to move up - jump to the beginning
      if (foundRowIdx === 0) targetControl.selectionStart = 0;
      else {
        const targetRow = rows[foundRowIdx - 1];
        // Not enough symbols in target row - move to end
        if (targetRow.length <= rowSelectionStart) {
          targetControl.selectionStart -= rowSelectionStart + 1;
        } else targetControl.selectionStart -= targetRow.length + 1;
      }
    } else if (foundRowIdx === rows.length - 1) {
      // Last row and trying to move down - jump to the end
      targetControl.selectionStart = targetControl.value.length;
    } else {
      const targetRow = rows[foundRowIdx + 1];
      if (targetRow.length <= rowSelectionStart) {
        // Not enough symbols in target row - move to end
        targetControl.selectionStart += rows[foundRowIdx].length
            - rowSelectionStart + targetRow.length + 1;
      } else targetControl.selectionStart += rows[foundRowIdx].length + 1;
    }
  }
  targetControl.selectionEnd = targetControl.selectionStart;
};

const setRepeatButton = (callback) => {
  callback();
  if (settings.charRepeatTimer !== null) {
    clearInterval(settings.charRepeatTimer);
  }
  settings.charRepeatTimer = setInterval(
    callback, repeatTimeout,
  );
};

const createBtnMouseDownHandler = (sourceBtn) => () => {
  if (targetControl) {
    if (sourceBtn.type !== 'control') {
      const valueToSet = sourceBtn[settings.lang][settings.shift] || sourceBtn.uiElement.innerText;
      setRepeatButton(() => updateTextarea(valueToSet));
    } else if (sourceBtn.en.noshift === 'Backspace') {
      setRepeatButton(() => updateTextarea(null, false));
    } else if (sourceBtn.en.noshift === 'Del') {
      setRepeatButton(() => updateTextarea(null, true));
    } else if (sourceBtn.en.noshift === 'Enter') {
      setRepeatButton(() => updateTextarea('\n'));
    } else if (sourceBtn.en.noshift === 'Tab') {
      setRepeatButton(() => updateTextarea('\t'));
    } else if (sourceBtn.en.default === '\u2190') {
      setRepeatButton(() => moveCursorX(-1));
    } else if (sourceBtn.en.default === '\u2192') {
      setRepeatButton(() => moveCursorX(1));
    } else if (sourceBtn.en.default === '\u2191') {
      setRepeatButton(() => moveCursorY(-1));
    } else if (sourceBtn.en.default === '\u2193') {
      setRepeatButton(() => moveCursorY(1));
    }

    if (sourceBtn.subtype === 'sticky') {
      if (sourceBtn.uiElement.classList.contains(buttonPressedClassName)) {
        sourceBtn.uiElement.classList.remove(buttonPressedClassName);
        if (sourceBtn.keyUp) sourceBtn.keyUp();
      } else {
        sourceBtn.uiElement.classList.add(buttonPressedClassName);
        if (sourceBtn.keyDown) sourceBtn.keyDown();
      }
    } else {
      sourceBtn.uiElement.classList.add(buttonPressedClassName);
      setShift(false);
      setCtrl(false);
      if (sourceBtn.keyDown) sourceBtn.keyDown();
    }
  }
};

const createBtnMouseUpHandler = (sourceBtn) => () => {
  if (sourceBtn.subtype !== 'sticky') {
    sourceBtn.uiElement.classList.remove(buttonPressedClassName);
    if (settings.charRepeatTimer !== null) {
      clearInterval(settings.charRepeatTimer);
    }
    if (sourceBtn.keyUp) sourceBtn.keyUp();
  }
};

const addButtons = (kbrd) => {
  let row = document.createElement('div');
  row.classList.add('keyboard__row');
  kbrd.appendChild(row);
  let currentRow = 0;
  Object.keys(buttons).forEach((x) => {
    const sourceBtn = buttons[x];
    if (currentRow !== buttons[x].row) {
      row = document.createElement('div');
      row.classList.add('keyboard__row');
      kbrd.appendChild(row);
      currentRow = buttons[x].row;
    }
    const btn = document.createElement('div');
    btn.classList.add('keyboard__btn');
    if (sourceBtn.className) btn.classList.add(sourceBtn.className);
    sourceBtn.uiElement = btn;
    btn.innerText = sourceBtn[settings.lang][settings.shift];
    btn.addEventListener('mousedown', createBtnMouseDownHandler(sourceBtn));
    btn.addEventListener('mouseup', createBtnMouseUpHandler(sourceBtn));
    btn.addEventListener('mouseout', createBtnMouseUpHandler(sourceBtn));
    row.appendChild(btn);
  });
};

const addKeyboard = (body) => {
  keyboard.classList.add('keyboard');
  addButtons(keyboard);
  body.appendChild(keyboard);
};

const processKeyDown = (evt) => {
  if (buttons[evt.code]) {
    if (evt.code === 'CapsLock') {
      if (buttons[evt.code].uiElement.classList.contains(buttonPressedClassName)) {
        buttons[evt.code].uiElement.classList.remove(buttonPressedClassName);
        buttons[evt.code].keyUp(settings);
      } else {
        buttons[evt.code].uiElement.classList.add(buttonPressedClassName);
        buttons[evt.code].keyDown(settings);
      }
    } else {
      if (buttons[evt.code].keyDown) buttons[evt.code].keyDown(settings);
      buttons[evt.code].uiElement.classList.add(buttonPressedClassName);
    }
    settings.prevKeyboardCode = evt.code;
  }
};

const processKeyUp = (evt) => {
  if (buttons[evt.code]) {
    if (evt.code !== 'CapsLock') {
      if (buttons[evt.code].keyDown) buttons[evt.code].keyUp(settings);
      buttons[evt.code].uiElement.classList.remove(buttonPressedClassName);
    }
    settings.prevKeyboardCode = null;
  }
};

const processBlur = () => {
  Object.values(buttons).forEach((x) => x.uiElement.classList.remove(buttonPressedClassName));
  if (settings.charRepeatTimer !== null) {
    clearInterval(settings.charRepeatTimer);
  }
};

const loadKeyboardState = (evt) => {
  if (evt.getModifierState('CapsLock')) processKeyDown({ code: 'CapsLock' });
  document.removeEventListener('mousemove', loadKeyboardState);
};

window.addEventListener('load', () => {
  const body = document.querySelector('body');
  const workingArea = document.createElement('div');
  workingArea.classList.add('test-zone');
  body.appendChild(workingArea);
  targetControl = document.createElement('textarea');
  targetControl.rows = 10;
  targetControl.autofocus = true;
  targetControl.addEventListener('blur', () => targetControl.focus());
  workingArea.appendChild(targetControl);
  targetControl.addEventListener('keydown', processKeyDown);
  targetControl.addEventListener('keyup', processKeyUp);
  document.addEventListener('mousemove', loadKeyboardState);
  document.addEventListener('blur', processBlur);
  addKeyboard(workingArea);
  updateButtons();
  targetControl.placeholder = 'Please note instructions below:'
    + '\nUse arrow buttons to move cursor in the text area'
    + '\nUse Shift+Ctrl to switch language'
    + '\nShift and Ctrl are "sticky" - stays pressed until other button is tapped';
});
