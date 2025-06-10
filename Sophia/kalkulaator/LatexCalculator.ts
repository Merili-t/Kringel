import { BaseCalculator } from './BaseCalculator.js';
// @ts-ignore
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';


const ce = new ComputeEngine();

export class LatexCalculator extends BaseCalculator {
  evaluate(): string {
    const latexInput = this.getContents(); // LaTeX string, nt "\frac{1}{2} + \sqrt{9}"
    console.log('Inital latex:', latexInput);
    try {
      const expr = ce.parse(latexInput);
      if (!expr) {
        console.warn('Parse failed');
        return 'Error';
      }

      const evaluated = expr.evaluate();
      if (!evaluated) {
        console.warn('Evaluation failed');
        return 'Error';
      }

      // Proovime .N() ja .valueOf()
      const numeric = evaluated.N();
      const value = numeric?.valueOf();

      if (typeof value === 'number' && isFinite(value)) {
        return value.toLocaleString('fr-FR'); // Vormindame nt "1 234,56"
      }

      // Kui .N() ei andnud sobivat, siis tagasta sümboolne kujul
      const symbolicLatex = evaluated.toLatex?.();
      if (typeof symbolicLatex === 'string') {
        return symbolicLatex;
      }

      // Fallback – ürita stringina
      return evaluated.toString();
    } catch (err) {
      console.error('Compute Engine error:', err);
      return 'Error';
    }
  }
}




