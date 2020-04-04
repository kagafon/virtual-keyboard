/* eslint-disable import/extensions */
import DefaultButton from './buttons/defaultButton.js';
import SpecialButtons from './buttons/specialButton.js';
import buttonKeys from './keyboardCodes.js';

const keyboardShiftedClassName = 'keyboard_shifted';

export default class Keyboard {
  constructor(targetControl) {
    this.charRepeatTimer = null;
    this.targetControl = targetControl;
    this.controlButtonsPressed = {};
    // Attach events
    document.addEventListener('blur', this.reset.bind(this));
    window.addEventListener('blur', this.reset.bind(this));
    targetControl.uiElement.addEventListener('keydown', this.physicalKeyDown.bind(this));
    targetControl.uiElement.addEventListener('keyup', this.physicalKeyUp.bind(this));

    // Create keyboard
    this.uiElement = document.createElement('div');
    this.buttons = {};
    this.uiElement.classList.add('keyboard');

    // Add buttons
    let row = document.createElement('div');
    row.classList.add('keyboard__row');
    this.uiElement.appendChild(row);
    let currentRow = 0;
    Object.keys(buttonKeys).forEach((x) => {
      const sourceBtn = buttonKeys[x];
      if (currentRow !== buttonKeys[x].row) {
        row = document.createElement('div');
        row.classList.add('keyboard__row');
        this.uiElement.appendChild(row);
        currentRow = sourceBtn.row;
      }
      const btn = SpecialButtons[x]
        ? SpecialButtons[x](x,
          this,
          { ru: sourceBtn.ru, en: sourceBtn.en },
          sourceBtn.className)
        : new DefaultButton(x,
          this,
          { ru: sourceBtn.ru, en: sourceBtn.en },
          sourceBtn.className);
      this.buttons[x] = btn;
      row.appendChild(btn.uiElement);
    });
    targetControl.uiElement.parentElement.appendChild(this.uiElement);
    this.reset();
  }

  physicalKeyDown(evt) {
    if (this.buttons[evt.code]) {
      this.buttons[evt.code].keyDown();
      evt.preventDefault();
    }
  }

  physicalKeyUp(evt) {
    if (this.buttons[evt.code]) {
      this.buttons[evt.code].keyUp();
      evt.preventDefault();
    }
  }

  reset() {
    Object.values(this.buttons).forEach((x) => x.reset());
    Object.keys(this.controlButtonsPressed).forEach((x) => {
      if (this.controlButtonsPressed[x]) {
        this.controlButtonsPressed[x] = false;
      }
    });
    this.rshift = 'noshift';
    this.lshift = 'noshift';
    this.rctrl = 'noctrl';
    this.lctrl = 'noctrl';
    this.alt = 'noalt';
    this.update();
  }

  resetPressedControlButtons() {
    Object.keys(this.controlButtonsPressed).forEach((x) => {
      if (this.controlButtonsPressed[x]) {
        this.buttons[x].mouseDown();
        this.controlButtonsPressed[x] = false;
      }
    });
  }

  checkSpecialKeys() {
    if (this.shift === 'shift' && this.ctrl === 'ctrl') {
      this.lang = this.lang === 'ru' ? 'en' : 'ru';
      this.update();
      return true;
    }
    return false;
  }

  update() {
    if ((this.shift === 'shift' && this.capsLock !== 'caps')
    || (this.shift !== 'shift' && this.capsLock === 'caps')) {
      this.uiElement.classList.add(keyboardShiftedClassName);
      Object.values(this.buttons).forEach((x) => x.update());
    } else {
      this.uiElement.classList.remove(keyboardShiftedClassName);
      Object.values(this.buttons).forEach((x) => x.update());
    }
  }

  loadKeyboardState(evt) {
    if (evt.getModifierState('CapsLock')) this.buttons.CapsLock.mouseUp();
    document.removeEventListener('mousemove', this.loadKeyboardState);
  }

  /* removeChar: false - before, true - after */
  updateTextarea(charToAdd, removeChar) {
    let positionToRestore = this.targetControl.selectionStart;
    let newValue = this.targetControl.value;
    if (charToAdd) {
      newValue = newValue.substring(0, this.targetControl.selectionStart)
      + charToAdd
      + newValue.substring(this.targetControl.selectionEnd);
      positionToRestore += 1;
    }
    if (removeChar !== undefined) {
      if (this.targetControl.selectionStart !== this.targetControl.selectionEnd) {
        newValue = newValue.substring(0, this.targetControl.selectionStart)
        + newValue.substring(this.targetControl.selectionEnd);
      } else if (removeChar) {
        newValue = newValue.substring(0, this.targetControl.selectionStart)
        + newValue.substring(this.targetControl.selectionStart + 1);
      } else {
        newValue = newValue.substring(0, this.targetControl.selectionStart - 1)
        + newValue.substring(this.targetControl.selectionStart);
        positionToRestore -= 1;
      }
    }
    this.targetControl.value = newValue;
    this.targetControl.selectionEnd = positionToRestore;
  }

  moveCursorY(step) {
    const rows = this.targetControl.value.split('\n');
    let rowSelectionStart = this.targetControl.selectionStart;
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
        if (foundRowIdx === 0) this.targetControl.selectionStart = 0;
        else {
          const targetRow = rows[foundRowIdx - 1];
          // Not enough symbols in target row - move to end
          if (targetRow.length <= rowSelectionStart) {
            this.targetControl.selectionStart -= rowSelectionStart + 1;
          } else this.targetControl.selectionStart -= targetRow.length + 1;
        }
      } else if (foundRowIdx === rows.length - 1) {
        // Last row and trying to move down - jump to the end
        this.targetControl.selectionStart = this.targetControl.value.length;
      } else {
        const targetRow = rows[foundRowIdx + 1];
        if (targetRow.length <= rowSelectionStart) {
          // Not enough symbols in target row - move to end
          this.targetControl.selectionStart += rows[foundRowIdx].length
              - rowSelectionStart + targetRow.length + 1;
        } else this.targetControl.selectionStart += rows[foundRowIdx].length + 1;
      }
    }
    this.targetControl.selectionEnd = this.targetControl.selectionStart;
  }

  moveCursorX(step) {
    if (this.targetControl.selectionStart === this.targetControl.selectionEnd) {
      this.targetControl.selectionStart += step;
      this.targetControl.selectionEnd = this.targetControl.selectionStart;
    } else if (step < 0) {
      this.targetControl.selectionStart += step;
    } else {
      this.targetControl.selectionEnd += step;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get lang() {
    return localStorage.getItem('virtual-keyboard.lang') || 'ru';
  }

  // eslint-disable-next-line class-methods-use-this
  set lang(value) {
    localStorage.setItem('virtual-keyboard.lang', value);
  }

  get shift() {
    if (this.rshift === 'shift' || this.lshift === 'shift') return 'shift';
    return 'noshift';
  }

  get ctrl() {
    if (this.rctrl === 'ctrl' || this.lctrl === 'ctrl') return 'ctrl';
    return 'noctrl';
  }
}
