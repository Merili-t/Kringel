import { LatexCalculator } from "./LatexCalculator.js";

export class VisualCalculator {
    private inputField: any; // MathField
    private resultElement: HTMLElement;
    private logic: LatexCalculator;

    constructor(inputId: string, resultId: string) {
        this.inputField = document.getElementById(inputId);
        this.resultElement = document.getElementById(resultId) as HTMLElement;
        this.logic = new LatexCalculator();
        this.setupButtons();

        
        // Kuula MathLive input muutusi
        this.inputField.addEventListener('input', () => {
            const content = this.inputField.value;
            this.logic.setContents(content);
        });
    }

    insertToInput(content: string) { //valemisse lisamiseks 
        this.inputField.insert(content); //Mathlive
        this.inputField.focus(); //kasutaja saab kohe edasi sisestada
    }

    setupButtons() {
        document.querySelectorAll('.calc-button').forEach((el) => { //seob nupud vajutustega 
            const button = el as HTMLButtonElement;
            button.addEventListener('click', () => {
                const content = button.getAttribute('data-content');
                if (content) {
                    this.insertToInput(content);
                }
            });
        });

        document.getElementById('calc-evaluate')?.addEventListener('click', () => {
            const result = this.logic.evaluate();
            this.resultElement.textContent = `= ${result}`;
        });

        document.getElementById('calc-clear')?.addEventListener('click', () => {
            this.inputField.value = ''; //Mathlive 
            this.resultElement.textContent = '';
            this.logic.clear();
            this.inputField.focus();
        });

        document.getElementById('calc-backspace')?.addEventListener('click', () => {
            this.inputField.executeCommand('deleteBackward'); //MathLive oma, mathlive nõuab korrektse latexi säilitamiseks
            this.inputField.focus(); //focus teeb, et sisestus jääks aktiivseks / klaviatuur kinni ei läheks
        });
    }
}

console.log("test");
