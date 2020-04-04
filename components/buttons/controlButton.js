/* eslint-disable max-classes-per-file */
// eslint-disable-next-line import/extensions
import DefaultButton from './defaultButton.js';

class StickyButton extends DefaultButton {}

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
  this.keyboard.checkSpecialKeys();
};

StickyButton.prototype.keyUp = function keyUp() {
  this.perfomAction();
  this.uiElement.classList.remove(this.buttonPressedClassName);
};

StickyButton.prototype.keyDown = function keyDown() {
  if (!this.uiElement.classList.contains(this.buttonPressedClassName)) {
    this.perfomAction();
    this.uiElement.classList.add(this.buttonPressedClassName);
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
  this.keyboard.ctrl = this.keyboard.ctrl === 'ctrl' ? 'noctrl' : 'ctrl';
  this.keyboard.update();
};

class ShiftButton extends StickyButton {}
ShiftButton.prototype.perfomAction = function perfomAction() {
  this.keyboard.shift = this.keyboard.shift === 'shift' ? 'noshift' : 'shift';
  this.keyboard.update();
};

export {
  StickyButton, ShiftButton, ControlButton, CapsLockButton,
};
