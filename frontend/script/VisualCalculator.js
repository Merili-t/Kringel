
import { LatexCalculator } from "./LatexCalculator.js";

// Disable all MathLive sounds globally
MathfieldElement.soundsDirectory = null;
MathfieldElement.keypressSound = {
  default: null,
  delete:  null,
  return:  null,
  spacebar:null
};
MathfieldElement.plonkSound = null;

export class VisualCalculator {
    constructor(inputId, resultId) {
        // 2) Grab the mathfield
        const mathfield = document.getElementById(inputId);
        if (!mathfield) {
            console.error(`Element with id '${inputId}' not found!`);
            return;
        }
        this.inputField = mathfield;
        this.resultElement = document.getElementById(resultId);
        this.logic = new LatexCalculator();
        this.logic.setContents(this.inputField.value);

        // 3) Prune the built-in context menu
        mathfield.menuItems = mathfield.menuItems.filter(item =>
            item.id === 'insert'
        );

        this.setupButtons();
        // Listen for MathLive input changes
        this.inputField.addEventListener('input', () => {
            const content = this.inputField.value;
            this.logic.setContents(content);
        });

        this.inputField.addEventListener('blur', () => {
        const latex = this.logic.getContents();
        console.log(latex);
        });
    }

    insertToInput(content) {
        this.inputField.insert(content);
        this.inputField.focus();
    }

    setupButtons() {
        var _a, _b, _c, _d, _e;
        document.querySelectorAll('.calc-button').forEach((el) => {
            const button = el;
            button.addEventListener('click', () => {
                const content = button.getAttribute('data-content');
                if (content) {
                    this.insertToInput(content);
                }
            });
        });
        let shiftActive = false;
        const shiftButton = document.getElementById('shift-toggle');
        if (shiftButton) {
            shiftButton.addEventListener('click', () => {
                shiftActive = !shiftActive;
                shiftButton.classList.toggle('active', shiftActive);
                document.querySelectorAll('.calc-button.greek').forEach((el) => {
                    const button = el;
                    const upper = button.getAttribute('data-upper');
                    const lower = button.getAttribute('data-lower');
                    const upperChar = button.getAttribute('data-char-upper');
                    const lowerChar = button.getAttribute('data-char-lower');
                    if (shiftActive && upper && upperChar) {
                        button.innerText = upperChar;
                        button.setAttribute('data-content', upper);
                    } else if (lower && lowerChar) {
                        button.innerText = lowerChar;
                        button.setAttribute('data-content', lower);
                    }
                });
            });
        }
        (_a = document.getElementById('calc-evaluate')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            const result = this.logic.evaluate();
            this.resultElement.textContent = `= ${result}`;
        });
        const clear = () => {
            this.inputField.value = '';
            this.resultElement.textContent = '';
            this.logic.clear();
            this.inputField.focus();
        };
        (_b = document.getElementById('calc-clear')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', clear);
        (_c = document.getElementById('symbol-clear')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', clear);
        const backspace = () => {
            this.inputField.executeCommand('deleteBackward');
            this.inputField.focus();
        };
        (_d = document.getElementById('calc-backspace')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', backspace);
        (_e = document.getElementById('symbol-backspace')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', backspace);
        const symbolToggle = document.getElementById('toggle-symbols');
        const symbolPanel = document.getElementById('symbol-panel');
        const calcButtons = document.querySelector('.calc-buttons');
        const backToCalc = document.getElementById('back-to-calc');
        if (symbolToggle && symbolPanel && calcButtons) {
            symbolToggle.addEventListener('click', () => {
                calcButtons.style.display = 'none';
                symbolPanel.style.display = 'grid';
                symbolToggle.style.display = 'none';
            });
        }
        if (backToCalc && symbolPanel && calcButtons && symbolToggle) {
            backToCalc.addEventListener('click', () => {
                symbolPanel.style.display = 'none';
                calcButtons.style.display = 'grid';
                symbolToggle.style.display = '';
            });
        }
    }
}

console.log("VisualCalculator initialized");
