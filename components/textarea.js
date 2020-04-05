export default class Textarea {
  constructor(parentControl) {
    this.uiElement = document.createElement('textarea');
    this.uiElement.rows = 10;
    this.uiElement.autofocus = true;
    this.uiElement.addEventListener('blur', (evt) => evt.currentTarget.focus());
    this.instructions = {
      en: ['Please note instructions below:',
        'Use arrow buttons to move cursor in the text area',
        'Shift and Ctrl screen buttons stay "pressed" until other button is clicked ("sticky")',
        'Use Shift+Ctrl to switch language ("pressed" state is removed in this case)',
        '',
        'Note: long-click on screen button will continiously insert symbols into textarea',
        '',
        'Designed for MS Windows',
        'Нажмите Ctrl+Shift для инструкции на русском языке'].join('\n'),
      ru: ['Инструкции:',
        'Используйте стрелки для перемещения курсора в поле ввода',
        'Ctrl и Shift остаются активными до следующего нажатия кнопки ("липкие клавиши")',
        'Для переключения языка используйте Ctrl+Shift',
        '',
        'Удерживание клавиши нажатой на экране будет добавлять символы в поле ввода',
        '',
        'Сделано для MS Windows',
        'For English instructions press Ctrl+Shift',
      ].join('\n'),
    };
    parentControl.appendChild(this.uiElement);
  }

  setInstructions(lang) {
    this.uiElement.placeholder = this.instructions[lang];
  }

  get value() { return this.uiElement.value; }

  set value(val) { this.uiElement.value = val; }

  get selectionStart() { return this.uiElement.selectionStart; }

  set selectionStart(val) { this.uiElement.selectionStart = val; }

  get selectionEnd() { return this.uiElement.selectionEnd; }

  set selectionEnd(val) { this.uiElement.selectionEnd = val; }
}
