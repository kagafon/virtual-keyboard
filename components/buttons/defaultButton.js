const repeatTimeout = 200;

const setRepeatButton = (callback, repeatTimer) => {
  if (repeatTimer !== null) {
    clearInterval(repeatTimer);
  }
  return setInterval(
    callback, repeatTimeout,
  );
};

export default class DefaultButton {
  constructor(code, keyboard, displayValues, className) {
    this.code = code;
    this.keyboard = keyboard;
    this.displayValues = displayValues;
    this.uiElement = document.createElement('div');
    this.uiElement.classList.add('keyboard__btn');
    this.buttonPressedClassName = 'keyboard__btn_pressed';
    this.mouseOutHandler = this.mouseUp.bind(this);
    if (className) this.uiElement.classList.add(className);
    this.repeatTimer = null;

    this.uiElement.addEventListener('mousedown', this.mouseDown.bind(this));
    this.uiElement.addEventListener('mouseup', this.mouseUp.bind(this));
    this.uiElement.addEventListener('mouseout', this.mouseOutHandler);
    this.update();
  }

  get value() {
    return this.displayValues[this.keyboard.lang][this.keyboard.shift]
    || this.uiElement.innerText;
  }

  update(shift) {
    this.uiElement.innerText = this.displayValues[this.keyboard.lang][shift || this.keyboard.shift]
      || this.displayValues[this.keyboard.lang].default;
  }

  // Reset all states
  reset() {
    this.uiElement.classList.remove(this.buttonPressedClassName);
    if (this.repeatTimer !== null) {
      clearInterval(this.repeatTimer);
    }
  }

  // Process mouseDown event
  mouseDown() {
    if (this.repeatTimer !== null) {
      clearInterval(this.repeatTimer);
    }
    this.repeatTimer = setRepeatButton(this.perfomAction.bind(this));
    this.uiElement.classList.add(this.buttonPressedClassName);
  }

  perfomAction() {
    this.keyboard.updateTextarea(this.value);
  }

  // Process mouseUp event
  mouseUp() {
    if (this.repeatTimer !== null) {
      clearInterval(this.repeatTimer);
      this.repeatTimer = null;
    }
    if (this.uiElement.classList.contains(this.buttonPressedClassName)) {
      this.perfomAction();
      this.uiElement.classList.remove(this.buttonPressedClassName);
      this.keyboard.resetPressedControlButtons();
    }
  }

  mouseOut() {
    this.mouseUp();
    this.uiElement.removeEventListener('mouseout', this.mouseOutHandler);
  }

  // Process keyUp event
  keyUp() {
    if (this.repeatTimer !== null) {
      clearInterval(this.repeatTimer);
      this.repeatTimer = null;
    }
    this.uiElement.classList.remove(this.buttonPressedClassName);
  }

  // Process keyUp event
  keyDown() {
    if (this.repeatTimer !== null) {
      clearInterval(this.repeatTimer);
      this.repeatTimer = null;
    }
    this.perfomAction();
    this.uiElement.classList.add(this.buttonPressedClassName);
  }
}
