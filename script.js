// eslint-disable-next-line import/extensions
import buttons from './keyboardCodes.js';

const keyboard = document.createElement('div');
const settings = {
  lang: 'ru',
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
const checkSpecialKeysCombination = () => {
  if (settings.ctrl === 'ctrl' && settings.shift === 'shift') {
    settings.lang = settings.lang === 'ru' ? 'en' : 'ru';
    settings.ctrl = 'noctrl';
    setShift(false);
    [buttons.ControlLeft,
      buttons.ControlRight].forEach((x) => {
      x.uiElement.classList.remove(buttonPressedClassName);
    });
    return false;
  }
  return true;
};

// Additional keys processing
const shiftDown = () => {
  setShift(true);
  checkSpecialKeysCombination();
  updateButtons((x) => !buttons[x].default);
};

const shiftUp = () => {
  settings.shift = 'noshift';
  updateButtons((x) => !buttons[x].default);
};

const ctrlDown = () => {
  settings.ctrl = 'ctrl';
  checkSpecialKeysCombination();
  updateButtons((x) => !buttons[x].default);
};

const ctrlUp = () => {
  settings.ctrl = 'noctrl';
  updateButtons((x) => !buttons[x].default);
};

const altDown = () => {
  settings.ctrl = 'alt';
  updateButtons((x) => !buttons[x].default);
};

const altUp = () => {
  settings.ctrl = 'noalt';
  updateButtons((x) => !buttons[x].default);
};

const capsLockDown = () => {
  settings.capsLock = 'caps';
  updateButtons((x) => !buttons[x].default);
};

const capsLockUp = () => {
  settings.capsLock = 'nocaps';
  updateButtons((x) => !buttons[x].default);
};

buttons.CapsLock.keyDown = capsLockDown;
buttons.CapsLock.keyUp = capsLockUp;

buttons.ShiftLeft.keyDown = shiftDown;
buttons.ShiftLeft.keyUp = shiftUp;
buttons.ShiftRight.keyDown = shiftDown;
buttons.ShiftRight.keyUp = shiftUp;

buttons.ControlRight.keyDown = ctrlDown;
buttons.ControlRight.keyUp = ctrlUp;
buttons.ControlLeft.keyDown = ctrlDown;
buttons.ControlLeft.keyUp = ctrlUp;

buttons.AltRight.keyDown = altDown;
buttons.AltRight.keyUp = altUp;
buttons.AltLeft.keyDown = altDown;
buttons.AltLeft.keyUp = altUp;

/* removeChar: false - before, true - after */
const updateTextarea = (charToAdd, removeChar) => {
  if (charToAdd) {
    targetControl.value += charToAdd;
  }
  if (removeChar !== undefined) {
    let positionToRestore = targetControl.selectionStart;
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
    targetControl.selectionEnd = positionToRestore;
  }
};

const createBtnMouseDownHandler = (sourceBtn) => () => {
  if (targetControl) {
    if (sourceBtn.type !== 'control') {
      updateTextarea(sourceBtn[settings.lang][settings.shift] || sourceBtn.uiElement.innerText);
      settings.charRepeatTimer = setInterval(
        () => updateTextarea(sourceBtn[settings.lang][settings.shift]
                  || sourceBtn[settings.lang].default), 200,
      );
    } else if (sourceBtn.en.noshift === 'Backspace') {
      updateTextarea(null, false);
      settings.charRepeatTimer = setInterval(
        () => updateTextarea(null, false), 200,
      );
    } else if (sourceBtn.en.noshift === 'Del') {
      updateTextarea(null, true);
      settings.charRepeatTimer = setInterval(
        () => updateTextarea(null, true), 200,
      );
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
    if (buttons[evt.code].keyDown) buttons[evt.code].keyDown(settings);

    if (evt.code === 'CapsLock') {
      buttons[evt.code].uiElement.classList.toggle(buttonPressedClassName);
      // keyboard.classList.toggle(keyboardShiftedClassName);
    } else {
      buttons[evt.code].uiElement.classList.add(buttonPressedClassName);
    }
    settings.prevKeyboardCode = evt.code;
  }
};

const processKeyUp = (evt) => {
  if (buttons[evt.code]) {
    if (buttons[evt.code].keyDown) buttons[evt.code].keyUp(settings);
    settings.prevKeyboardCode = null;
    if (evt.code !== 'CapsLock') {
      buttons[evt.code].uiElement.classList.remove(buttonPressedClassName);
    }
  }
};

const processBlur = () => {
  Object.values(buttons).forEach((x) => x.uiElement.classList.remove(buttonPressedClassName));
  if (settings.charRepeatTimer !== null) {
    clearInterval(settings.charRepeatTimer);
  }
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
  document.addEventListener('blur', processBlur);
  addKeyboard(workingArea);
  updateButtons();
});
