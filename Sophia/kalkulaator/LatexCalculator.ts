import { BaseCalculator } from './BaseCalculator.js'; 
import { ComputeEngine, BoxedExpression } from '@cortex-js/compute-engine';

const ce = new ComputeEngine();

export class LatexCalculator extends BaseCalculator {
    evaluate(): string | number { 
        const latexInput = this.getContents(); // Eeldame, et see on LaTeX string (nt "\frac{1}{2} + \sqrt{9}")

    try {
      const parsed = ce.parse(latexInput); // Parsib LaTeX väljendi
      const evaluated = parsed.evaluate(); // Hindab (võib olla sümboolne või numbriline tulemus)

      // Kui soovid *ainult* numbrilisi tulemusi:
      const numeric = evaluated.N(); // Jõuga numbriline hindamine

      if (!numeric || numeric.symbol === 'NaN' || numeric.symbol === 'Undefined') {
        return 'Error';
      }

      const result = numeric.valueOf(); // Saame tulemuse JavaScript-arvuna või stringina (nt `1/3` -> 0.333…)

      if (typeof result === 'number' && isFinite(result)) {
        // Vormindame numbrilise tulemuse tühikutega, nt 1 000 000
        return result.toLocaleString('fr-FR');
      }

      // Kui tulemuseks on midagi mitte-numbrilist (nt `\pi^2` või `x`)
      return evaluated.toLatex(); // Või numeric.toLatex(), kui tahad numbrilist versiooni
    } catch (err) {
      console.error('Compute Engine evaluate error:', err);
      return 'Error';
    }
  }
}



