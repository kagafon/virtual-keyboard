/* eslint-disable max-classes-per-file */
// eslint-disable-next-line import/extensions
import DefaultButton from './defaultButton.js';

class StickyButton extends DefaultButton {
  constructor(code, keyboard, displayValues, className, side) {
    super(code, keyboard, displayValues, className);
    this.side = side;
  }
}

StickyButton.prototype.perfomAction = function perfomAction() {};

StickyButton.prototype.mouseDown = function mouseDown() {
  if (this.uiElement.classList.contains(this.buttonPressedClassName)) {
    this.uiElement.classList.remove(this.buttonPressedClassName);
    this.keyboard.controlButtonsPressed[this.code] = false;
  } else {
    this.uiElement.classList.add(this.buttonPressedClassName);
    this.keyboard.controlButtonsPressed[this.code] = true;
  }
  this.perfomAction();
};

StickyButton.prototype.mouseUp = function mouseUp() {
  if (this.keyboard.checkSpecialKeys()) {
    this.keyboard.resetPressedControlButtons();
  }
};
class CapsLockButton extends StickyButton {}
CapsLockButton.prototype.perfomAction = function perfomAction() {
  this.keyboard.capsLock = this.keyboard.capsLock === 'caps' ? 'nocaps' : 'caps';
  this.keyboard.update();
};

CapsLockButton.prototype.mouseDown = function mouseDown() {
  if (this.uiElement.classList.contains(this.buttonPressedClassName)) {
    this.uiElement.classList.remove(this.buttonPressedClassName);
  } else {
    this.uiElement.classList.add(this.buttonPressedClassName);
  }
  this.perfomAction();
};

CapsLockButton.prototype.keyUp = function keyUp() {};

CapsLockButton.prototype.reset = function reset() {};

CapsLockButton.prototype.keyDown = function keyDown() {
  this.mouseDown();
};

class ControlButton extends StickyButton {}

ControlButton.prototype.perfomAction = function perfomAction() {
  this.keyboard[this.side] = this.keyboard[this.side] === 'ctrl' ? 'noctrl' : 'ctrl';
  this.keyboard.update();
};

ControlButton.prototype.keyUp = function keyUp() {
  this.keyboard.checkSpecialKeys();
  this.keyboard[this.side] = 'noctrl';
  this.uiElement.classList.remove(this.buttonPressedClassName);
  this.keyboard.update();
};

ControlButton.prototype.keyDown = function keyDown() {
  this.keyboard[this.side] = 'ctrl';
  this.uiElement.classList.add(this.buttonPressedClassName);
  this.keyboard.update();
};

class ShiftButton extends StickyButton {}

ShiftButton.prototype.perfomAction = function perfomAction() {
  this.keyboard[this.side] = this.keyboard[this.side] === 'shift' ? 'noshift' : 'shift';
  this.keyboard.update();
};

ShiftButton.prototype.keyUp = function keyUp() {
  this.keyboard.checkSpecialKeys();
  this.keyboard[this.side] = 'noshift';
  this.uiElement.classList.remove(this.buttonPressedClassName);
  this.keyboard.update();
};

ShiftButton.prototype.keyDown = function keyDown() {
  this.keyboard[this.side] = 'shift';
  this.uiElement.classList.add(this.buttonPressedClassName);
  this.keyboard.update();
};

export {
  StickyButton, ShiftButton, ControlButton, CapsLockButton,
};
