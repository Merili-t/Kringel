import { LatexCalculator } from "./LatexCalculator.js";
export class VisualCalculator {
    constructor(inputId, resultId) {
        this.inputField = document.getElementById(inputId);
        this.resultElement = document.getElementById(resultId);
        this.logic = new LatexCalculator();
        this.setupButtons();
        // Kuula MathLive input muutusi
        this.inputField.addEventListener('input', () => {
            const content = this.inputField.value;
            this.logic.setContents(content);
        });
    }
    insertToInput(content) {
        this.inputField.insert(content); //Mathlive
        this.inputField.focus(); //kasutaja saab kohe edasi sisestada
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
        (_a = document.getElementById('calc-evaluate')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            const result = this.logic.evaluate();
            this.resultElement.textContent = `= ${result}`;
        });
        (_b = document.getElementById('calc-clear')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            this.inputField.value = ''; //Mathlive 
            this.resultElement.textContent = '';
            this.logic.clear();
            this.inputField.focus();
        });
        (_c = document.getElementById('symbol-clear')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
            this.inputField.value = ''; //Mathlive 
            this.resultElement.textContent = '';
            this.logic.clear();
            this.inputField.focus();
        });
        (_d = document.getElementById('calc-backspace')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
            this.inputField.executeCommand('deleteBackward');
            this.inputField.focus();
        });
        (_e = document.getElementById('symbol-backspace')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
            this.inputField.executeCommand('deleteBackward');
            this.inputField.focus();
        });
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
console.log("test");
