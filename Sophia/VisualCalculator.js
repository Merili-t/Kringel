import { LatexCalculator } from "./LatexCalculator.js";
export class VisualCalculator {
    constructor(inputId, resultId) {
        this.plusCounter = 0;
        this.inputField = document.getElementById(inputId);
        this.resultElement = document.getElementById(resultId);
        this.logic = new LatexCalculator();
        this.plusCounterElement = document.getElementById('plus-counter');
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
        if (content === '+') {
            this.plusCounter++;
            this.updatePlusCounter();
        }
    }
    updatePlusCounter() {
        if (this.plusCounterElement) {
            this.plusCounterElement.textContent = `Plussmärgid: ${this.plusCounter}`;
        }
    }
    setupButtons() {
        var _a, _b, _c;
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
            this.plusCounter = 0;
            this.updatePlusCounter();
        });
        (_c = document.getElementById('calc-backspace')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
            this.inputField.executeCommand('deleteBackward'); //MathLive oma, mathlive nõuab korrektse latexi säilitamiseks
            this.inputField.focus(); //focus teeb, et sisestus jääks aktiivseks / klaviatuur kinni ei läheks
        });
    }
}
console.log("test");
