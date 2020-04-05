/* eslint-disable import/extensions */
import Keyboard from './components/keyboard.js';
import Textarea from './components/textarea.js';

window.addEventListener('load', () => {
  const body = document.querySelector('body');
  const workingArea = document.createElement('div');
  workingArea.classList.add('test-zone');
  body.appendChild(workingArea);
  const keyboard = new Keyboard(new Textarea(workingArea));
  keyboard.reset();
});
