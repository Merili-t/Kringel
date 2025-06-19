import { VisualCalculator } from './VisualCalculator.js';

window.addEventListener('DOMContentLoaded', () => {
  new VisualCalculator('latexInput', 'resultArea');

  const latexInput = document.getElementById("latexInput");
  if (latexInput) {
    latexInput.addEventListener("blur", () => {
      const value = latexInput.value || '';
      window.parent.postMessage({
        type: "CALCULATOR_ANSWER",
        payload: value
      }, "*");
    });
  }
});
