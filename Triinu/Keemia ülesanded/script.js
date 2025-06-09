class Keyboard {
  constructor(targetElement) {
    this.targetElement = targetElement;
    this.buttons = [];
  }

  addButton(symbol, callback) {
    const button = new KeyboardButton(symbol, callback);
    this.buttons.push(button);
    this.targetElement.appendChild(button.render());
  }
}

class KeyboardButton {
  constructor(symbol, callback) {
    this.symbol = symbol;
    this.callback = callback;
    this.buttonElement = null;
  }

  render() {
    this.buttonElement = document.createElement('div');
    this.buttonElement.classList.add('key');
    this.buttonElement.textContent = this.symbol;
    this.buttonElement.onclick = () => this.callback(this.symbol);
    return this.buttonElement;
  }
}

class ChemistryKeyboard extends Keyboard {
  constructor(targetElement, inputField) {
    super(targetElement);
    this.inputField = inputField;
    this.initializeKeys();
  }

  initializeKeys() {
    const symbols = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₀', '→', '⇌', '↑', '↓', '+', '(', ')', 'Δ', '⁺', '⁻', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁰'];
    symbols.forEach(symbol => {
      this.addButton(symbol, this.addToInputField.bind(this));
    });
  }

  addToInputField(symbol) {
    const input = this.inputField.inputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;

    input.value = text.slice(0, start) + symbol + text.slice(end);
    input.selectionStart = input.selectionEnd = start + symbol.length;
    input.focus();
  }
}

class InputField {
  constructor(inputElement) {
    this.inputElement = inputElement;

    this.inputElement.addEventListener('paste', (e) => {
      e.preventDefault();
      alert('Paste is disabled in this input field.');
    });
  }

  clear() {
    this.inputElement.value = '';
  }

  append(value) {
    const input = this.inputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;

    input.value = text.slice(0, start) + value + text.slice(end);
    input.selectionStart = input.selectionEnd = start + value.length;
    input.focus();
  }
}

window.onload = function () {
  const inputFieldElement = document.getElementById('inputField'); 
  const inputField = new InputField(inputFieldElement);
  const chemistryKeyboardElement = document.getElementById('chemistryKeyboard');
  const chemistryKeyboard = new ChemistryKeyboard(chemistryKeyboardElement, inputField);

  chemistryKeyboardElement.style.display = 'grid';

  document.addEventListener('keydown', function (event) {
    if (event.target.id === 'inputField') return;
    const validKeys = /^[a-zA-Z0-9+\-/*=() ]$/;
    if (validKeys.test(event.key)) {
      event.preventDefault();
      inputField.append(event.key);
    }
  });


  document.addEventListener('paste', (e) => {
    e.preventDefault();
    alert('Paste is disabled.');
  });
};

const input = document.getElementById("inputField");

input.addEventListener("input", () => {
  input.style.height = "auto"; 
  input.style.height = input.scrollHeight + "px"; 
});
