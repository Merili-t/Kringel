// Klaviatuuri klasside definitsioon
class Keyboard {
  constructor(targetElement) {
    this.targetElement = targetElement;
    this.buttons = [];
  }

  // Nupu lisamine klaviatuurile
  addButton(symbol, callback) {
    const button = new KeyboardButton(symbol, callback);
    this.buttons.push(button);
    this.targetElement.appendChild(button.render());
  }
}

// Klaviatuuri nupu klass
class KeyboardButton {
  constructor(symbol, callback) {
    this.symbol = symbol;
    this.callback = callback;
    this.buttonElement = null;
  }

  // Nupu renderdamine DOM-i
  render() {
    this.buttonElement = document.createElement('div');
    this.buttonElement.classList.add('key');
    this.buttonElement.textContent = this.symbol;
    this.buttonElement.onclick = () => this.callback(this.symbol);
    return this.buttonElement;
  }
}

// Keemia klaviatuur (laiendatud klaviatuuri alamklass)
class ChemistryKeyboard extends Keyboard {
  constructor(targetElement, inputField) {
    super(targetElement);
    this.inputField = inputField;
    this.initializeKeys();
  }

  // Keemia sümbolite lisamine klaviatuurile
  initializeKeys() {
    const symbols = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₀', '→', '⇌', '↑', '↓', '+', '(', ')', 'Δ', '⁺', '⁻', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁰'];
    symbols.forEach(symbol => {
      this.addButton(symbol, this.addToInputField.bind(this));
    });
  }

  // Sümboli lisamine sisestusväljale
  addToInputField(symbol) {
    const input = this.inputField.inputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;

    // Lisab sümboli kursoripositsioonile
    input.value = text.slice(0, start) + symbol + text.slice(end);
    input.selectionStart = input.selectionEnd = start + symbol.length;
    input.focus();
  }
}

// Kalkulaatori sisestusvälja klass
class InputField {
  constructor(inputElement) {
    this.inputElement = inputElement;

    // Paste sündmuse blokeerimine
    this.inputElement.addEventListener('paste', (e) => {
      e.preventDefault();
      alert('Paste is disabled in this input field.');
    });
  }

  // Välja tühjendamine
  clear() {
    this.inputElement.value = '';
  }

  // Sümboli või märgi lisamine kursori kohale
  append(value) {
    const input = this.inputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;

    // Lisab väärtuse õigesse kohta
    input.value = text.slice(0, start) + value + text.slice(end);
    input.selectionStart = input.selectionEnd = start + value.length;
    input.focus();
  }
}

// Kui leht on täielikult laetud
window.onload = function () {
  const inputFieldElement = document.getElementById('inputField'); // Tekstiala viide
  const inputField = new InputField(inputFieldElement);
  const chemistryKeyboardElement = document.getElementById('chemistryKeyboard');
  const chemistryKeyboard = new ChemistryKeyboard(chemistryKeyboardElement, inputField);

  // Näitab keemiaklaviatuuri
  chemistryKeyboardElement.style.display = 'grid';

  // Tavalise klaviatuuri sisestuse kuulamine
  document.addEventListener('keydown', function (event) {
    if (event.target.id === 'inputField') return;
    const validKeys = /^[a-zA-Z0-9+\-/*=() ]$/;
    if (validKeys.test(event.key)) {
      event.preventDefault();
      inputField.append(event.key);
    }
  });


  // Üldine paste blokeerimine kogu lehel (valikuline, võib eemaldada)
  document.addEventListener('paste', (e) => {
    e.preventDefault();
    alert('Paste is disabled.');
  });
};

const input = document.getElementById("inputField");

input.addEventListener("input", () => {
  input.style.height = "auto"; // lähtesta kõrgus
  input.style.height = input.scrollHeight + "px"; // aseta vastavalt sisule
});
