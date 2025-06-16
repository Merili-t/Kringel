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

class InputField {
  constructor(inputElement) {
    this.inputElement = inputElement;

    // Disable paste
    this.inputElement.addEventListener('paste', (e) => {
      e.preventDefault();
      alert('Kleepimine on selles väljas keelatud.');
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

class ChemistryKeyboard extends Keyboard {
  constructor(targetElement, inputField) {
    super(targetElement);
    this.inputField = inputField;
    this.initializeKeys();
  }

  initializeKeys() {
    const symbols = [
      '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₀',
      '→', '⇌', '↑', '↓', '+', '(', ')', 'Δ',
      '⁺', '⁻', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁰'
    ];

    symbols.forEach(symbol => {
      this.addButton(symbol, this.addToInputField.bind(this));
    });
  }

  addToInputField(symbol) {
    this.inputField.append(symbol);
  }
}

// Automaatne initsialiseerimine (nt iframe-is)
window.addEventListener('DOMContentLoaded', () => {
  const inputFieldElement = document.getElementById('inputField');
  const keyboardElement = document.getElementById('chemistryKeyboard');

  if (!inputFieldElement || !keyboardElement) return;

  const inputField = new InputField(inputFieldElement);
  const chemistryKeyboard = new ChemistryKeyboard(keyboardElement, inputField);

  keyboardElement.style.display = 'grid';

  // Automaatselt textarea kõrguse muutmine sisestamisel
  inputFieldElement.addEventListener('input', () => {
    inputFieldElement.style.height = 'auto';
    inputFieldElement.style.height = inputFieldElement.scrollHeight + 'px';
  });

  // Logi blur-hetkel sisend
  inputFieldElement.addEventListener('blur', () => {
    const message = {
    type: 'chemistry-balance-answer',
    value: inputFieldElement.value
  };
  window.parent.postMessage(message, '*');
  });

  // Välise klaviatuuri sisend
  document.addEventListener('keydown', (event) => {
    if (event.target === inputFieldElement) return;
    const validKeys = /^[a-zA-Z0-9+\-/*=() ]$/;
    if (validKeys.test(event.key)) {
      event.preventDefault();
      inputField.append(event.key);
    }
  });

  // Prevent paste outside inputField as well (global)
  document.addEventListener('paste', (e) => {
    if (e.target === inputFieldElement) return;
    e.preventDefault();
    alert('Kleepimine on keelatud.');
  });
});

