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
                const result = 'Viga: LaTeX ei sobi arvutamiseks'; 
                console.log('Final result:', result);
                return result;
            }

            const evaluated = expr.evaluate();
            if (!evaluated) {
                console.warn('Evaluation failed');
                const result = 'Viga: Ei saanud arvutada';         
                console.log('Final result:', result);            
                return result;
            }

            const numeric = evaluated.N();
            const value = numeric?.valueOf();

            let result;

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
                result = formatted.length > 0 ? formatted.join(', ') : 'Error';
                console.log('Final result:', result);              
                return result;
            }

            // Kui tulemus on üksik kompleksarv
            if (value && typeof value === 'object' && 'im' in value) {
                const re = value.num || 0;
                const im = value.im || 0;
                result = `${re.toLocaleString('fr-FR')} ${im >= 0 ? '+' : '-'} ${Math.abs(im).toLocaleString('fr-FR')}i`;
                console.log('Final result:', result); 
                return result;
            }

            if (typeof value === 'number' && isFinite(value)) {
                result = value.toLocaleString('fr-FR');
                console.log('Final result:', result);            
                return result;
            }

            result = 'Error';
            console.log('Final result:', result);                  
            return result;

        } catch (err) {
            console.error('Compute Engine error:', err);
            const result = 'Error: Kontrolli sisestatud valemit';  
            console.log('Final result:', result);                  
            return result;
        }
    }
}
