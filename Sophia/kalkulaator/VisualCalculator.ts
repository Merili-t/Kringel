import { LatexCalculator } from "./LatexCalculator.js";
import type { MathfieldElement } from 'mathlive';

export class VisualCalculator {
    private inputField: MathfieldElement;
    private resultElement: HTMLElement;
    private logic: LatexCalculator;

    constructor(inputId: string, resultId: string) {
        const mathfield = document.getElementById(inputId) as MathfieldElement;
        this.inputField = mathfield;
        this.resultElement = document.getElementById(resultId) as HTMLElement;
        this.logic = new LatexCalculator();
        this.logic.setContents(this.inputField.value);
        if (!mathfield) {
        console.error(`Element with id '${inputId}' not found!`);
        }
        this.inputField = mathfield!;

        this.setupButtons();

        // Kuula MathLive input muutusi
        this.inputField.addEventListener('input', () => {
            const content = this.inputField.value;
            this.logic.setContents(content);
        });
    }

    insertToInput(content: string) {
        this.inputField.insert(content);
        this.inputField.focus();
    }

    setupButtons() {
        document.querySelectorAll('.calc-button').forEach((el) => {
            const button = el as HTMLButtonElement;
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
                    const button = el as HTMLButtonElement;
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

        document.getElementById('calc-evaluate')?.addEventListener('click', () => {
            const result = this.logic.evaluate();
            this.resultElement.textContent = `= ${result}`;
        });

        const clear = () => {
            this.inputField.value = '';
            this.resultElement.textContent = '';
            this.logic.clear();
            this.inputField.focus();
        };

        document.getElementById('calc-clear')?.addEventListener('click', clear);
        document.getElementById('symbol-clear')?.addEventListener('click', clear);

        const backspace = () => {
            this.inputField.executeCommand('deleteBackward');
            this.inputField.focus();
        };

        document.getElementById('calc-backspace')?.addEventListener('click', backspace);
        document.getElementById('symbol-backspace')?.addEventListener('click', backspace);

        const symbolToggle = document.getElementById('toggle-symbols');
        const symbolPanel = document.getElementById('symbol-panel');
        const calcButtons = document.querySelector('.calc-buttons') as HTMLElement | null;
        const backToCalc = document.getElementById('back-to-calc');

        if (symbolToggle && symbolPanel && calcButtons) {
            symbolToggle.addEventListener('click', () => {
                calcButtons.style.display = 'none';
                (symbolPanel as HTMLElement).style.display = 'grid';
                symbolToggle.style.display = 'none';
            });
        }

        if (backToCalc && symbolPanel && calcButtons && symbolToggle) {
            backToCalc.addEventListener('click', () => {
                (symbolPanel as HTMLElement).style.display = 'none';
                calcButtons.style.display = 'grid';
                symbolToggle.style.display = '';
            });
        }
    }
}

console.log("test");
