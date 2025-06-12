import { BaseCalculator } from './BaseCalculator.js';
// @ts-ignore: Use the ComputeEngine from the CDN
import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
const ce = new ComputeEngine();
export class LatexCalculator extends BaseCalculator {
    evaluate() {
        const latexInput = this.getContents();
        console.log('Initial latex:', latexInput);
        // Preprocess: Replace * with \cdot for Compute Engine LaTeX compatibility
        let processedInput = latexInput
            .replace(/\*/g, '\\cdot')
            .replace(/−/g, '-') // Unicode minus to ASCII
            .replace(/–/g, '-'); // En dash to ASCII
        // Optionally, remove spaces around operators for stricter parsing
        processedInput = processedInput.replace(/\s*\\cdot\s*/g, '\\cdot');
        processedInput = processedInput.replace(/\s*\+\s*/g, '+');
        processedInput = processedInput.replace(/\s*-\s*/g, '-');
        console.log("Processed latex:", processedInput);
        try {
            const expr = ce.parse(processedInput);
            if (!expr) {
                console.warn('Parse failed');
                return 'Viga: LaTeX ei sobi arvutamiseks';
            }
            const evaluated = expr.evaluate();
            if (!evaluated) {
                console.warn('Evaluation failed');
                return 'Viga: Ei saanud arvutada';
            }
            const numeric = evaluated.N();
            const value = numeric === null || numeric === void 0 ? void 0 : numeric.valueOf();
            // Kui tulemus on massiiv (nt mitu juurt või kompleksarvud)
            if (Array.isArray(value)) {
                const formatted = value.map(v => {
                    if (typeof v === 'number' && isFinite(v)) {
                        return v.toLocaleString('fr-FR');
                    }
                    if (v && typeof v === 'object' && 'im' in v) {
                        const re = v.num || 0;
                        const im = v.im || 0;
                        return `${re.toLocaleString('fr-FR')} ${im >= 0 ? '+' : '-'} ${Math.abs(im).toLocaleString('fr-FR')}i`;
                    }
                    return null;
                }).filter(Boolean);
                return formatted.length > 0 ? formatted.join(', ') : 'Error';
            }
            // Kui tulemus on üksik kompleksarv
            if (value && typeof value === 'object' && 'im' in value) {
                const re = value.num || 0;
                const im = value.im || 0;
                return `${re.toLocaleString('fr-FR')} ${im >= 0 ? '+' : '-'} ${Math.abs(im).toLocaleString('fr-FR')}i`;
            }
            if (typeof value === 'number' && isFinite(value)) {
                return value.toLocaleString('fr-FR');
            }
            // Kui ei ole võimalik teisendada arvuks või kompleksarvuks
            return 'Error';
        }
        catch (err) {
            console.error('Compute Engine error:', err);
            return 'Error: Kontrolli sisestatud valemit';
        }
    }
}
