import Keyboard from './components/keyboard';
import Textarea from './components/textarea';

window.addEventListener('load', () => {
  const body = document.querySelector('body');
  const workingArea = document.createElement('div');
  workingArea.classList.add('test-zone');
  body.appendChild(workingArea);
  const keyboard = new Keyboard(new Textarea(workingArea));
  keyboard.reset();
});
