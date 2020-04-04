/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */
import DefaultButton from './defaultButton.js';
import {
  StickyButton, ShiftButton, ControlButton, CapsLockButton,
} from './controlButton.js';

class MetaButton extends DefaultButton {}

MetaButton.prototype.perfomAction = function perfomAction() {};

MetaButton.prototype.mouseDown = function mouseDown() {
  this.uiElement.classList.add(this.buttonPressedClassName);
};

MetaButton.prototype.mouseUp = function mouseUp() {
  this.uiElement.classList.remove(this.buttonPressedClassName);
};

class DeleteButton extends DefaultButton {}

DeleteButton.prototype.perfomAction = function perfomAction() {
  this.keyboard.updateTextarea(null, true);
};

class BackspaceButton extends DefaultButton {}

BackspaceButton.prototype.perfomAction = function perfomAction() {
  this.keyboard.updateTextarea(null, false);
};

class VerticalArrowButton extends DefaultButton {
  constructor(code, keyboard, displayValues, className, direction) {
    super(code, keyboard, displayValues, className);
    this.direction = direction;
  }
}

VerticalArrowButton.prototype.perfomAction = function perfomAction() {
  this.keyboard.moveCursorY(this.direction);
};

class HorizontalArrowButton extends DefaultButton {
  constructor(code, keyboard, displayValues, className, direction) {
    super(code, keyboard, displayValues, className);
    this.direction = direction;
  }
}

HorizontalArrowButton.prototype.perfomAction = function perfomAction() {
  this.keyboard.moveCursorX(this.direction);
};

export default {
  Tab: (code, keyboard, displayValues, className) => {
    const retValue = new DefaultButton(code, keyboard, displayValues, className);
    Object.defineProperty(retValue, 'value', { get: () => '\t' });
    return retValue;
  },
  Enter: (code, keyboard, displayValues, className) => {
    const retValue = new DefaultButton(code, keyboard, displayValues, className);
    Object.defineProperty(retValue, 'value', { get: () => '\n' });
    return retValue;
  },
  Delete: (code,
    keyboard,
    displayValues,
    className) => new DeleteButton(code, keyboard, displayValues, className),
  Backspace: (code,
    keyboard,
    displayValues,
    className) => new BackspaceButton(code, keyboard, displayValues, className),
  ArrowLeft: (code,
    keyboard,
    displayValues,
    className) => new HorizontalArrowButton(code, keyboard, displayValues, className, -1),
  ArrowRight: (code,
    keyboard,
    displayValues,
    className) => new HorizontalArrowButton(code, keyboard, displayValues, className, 1),
  ArrowUp: (code,
    keyboard,
    displayValues,
    className) => new VerticalArrowButton(code, keyboard, displayValues, className, -1),
  ArrowDown: (code,
    keyboard,
    displayValues,
    className) => new VerticalArrowButton(code, keyboard, displayValues, className, 1),
  MetaLeft: (code,
    keyboard,
    displayValues,
    className) => new MetaButton(code, keyboard, displayValues, className),
  AltLeft: (code,
    keyboard,
    displayValues,
    className) => new StickyButton(code, keyboard, displayValues, className),
  AltRight: (code,
    keyboard,
    displayValues,
    className) => new StickyButton(code, keyboard, displayValues, className),
  ControlLeft: (code,
    keyboard,
    displayValues,
    className) => new ControlButton(code, keyboard, displayValues, className),
  ControlRight: (code,
    keyboard,
    displayValues,
    className) => new ControlButton(code, keyboard, displayValues, className),
  ShiftLeft: (code,
    keyboard,
    displayValues,
    className) => new ShiftButton(code, keyboard, displayValues, className),
  ShiftRight: (code,
    keyboard,
    displayValues,
    className) => new ShiftButton(code, keyboard, displayValues, className),
  CapsLock: (code,
    keyboard,
    displayValues,
    className) => new CapsLockButton(code, keyboard, displayValues, className),
};
