import { BaseCalculator } from './BaseCalculator.js'; 
//import { ComputeEngine } from './ComputeEngine.js';
const ce = new ComputeEngine();
//Latex into javascript
export class LatexCalculator extends BaseCalculator {
    evaluate(): string | number { 
        let expr = this.getContents();
        expr = expr
            .replace(/\\cdot/g, '*') 
            // Astendamise fix kui kümnend murrud jms
            .replace(/(\d+)\^(\d+)\s*\*\s*\1\^(\d+)/g, '($1**$2)*($1**$3)')
            // Keerukam astendamine  ^ → ** (nt x^2 või x^{2+1} või 2^1.5)
            .replace(/([a-zA-Z0-9.\)\]]+)\s*\^\s*(?:{([^}]+)}|([0-9.\-+*/a-zA-Z()]+))/g, (_, base, exp1, exp2) => {
                const exponent = exp1 || exp2;
                return `(${base})**(${exponent})`;
            })
            // Lihtne ^ → ** (nt 2^3 või (1+2)^4.5)
            .replace(/(\d+(\.\d+)?|\([^()]+\))\s*\^\s*([-\d.]+)/g, '($1)**($3)')

            // 9\cos(9) -> 9*Math.cos(9) sin cos tan 
            .replace(/([\d.]+)\s*\\(sin|cos|tan)\s*\(([^)]*)\)/g, '($1)*Math.$2($3)')
            .replace(/([\d.]+)\s*\\(sin|cos|tan)\s*{([^}]*)}/g, '($1)*Math.$2($3)')
            //tavaline \cos 9 -> Math.cos(9)
            .replace(/\\(sin|cos|tan)\s*\(([^)]*)\)/g, 'Math.$1($2)')
            .replace(/\\(sin|cos|tan)\s*{([^}]*)}/g, 'Math.$1($2)')

            // ln ja log koos eesoleva arvuga (nt 2\ln(5))
            .replace(/([\d.]+)\s*\\ln\s*\(([^)]+)\)/g, '($1)*Math.log($2)')
            .replace(/([\d.]+)\s*\\ln\s*{([^}]+)}/g, '($1)*Math.log($2)')
            .replace(/([\d.]+)\s*\\log\s*\(([^)]+)\)/g, '($1)*Math.log10($2)')
            .replace(/([\d.]+)\s*\\log\s*{([^}]+)}/g, '($1)*Math.log10($2)')

            // Tavaline ln ja log ilma ees oleva arvuta
            .replace(/\\ln\s*\(([^)]*)\)/g, 'Math.log($1)')
            .replace(/\\ln\s*{([^}]*)}/g, 'Math.log($1)')
            .replace(/\\log\s*\(([^)]*)\)/g, 'Math.log10($1)')
            .replace(/\\log\s*{([^}]*)}/g, 'Math.log10($1)') 

            // \sqrt{9} -> Math.sqrt(9)
            .replace(/\\sqrt\s*{([^}]*)}/g, 'Math.sqrt($1)')
            // \sqrt9 (tühi ruutjuur) ilma sulgudeta, d - number
            .replace(/\\sqrt\s*(\d+(\.\d+)?)/g, 'Math.sqrt($1)')
            .replace(/([\d.]+)\s*\\sqrt\s*{([^}]*)}/g, '($1)*Math.sqrt($2)')
            .replace(/([\d.]+)\s*\\sqrt\s*(\d+(\.\d+)?)/g, '($1)*Math.sqrt($2)')

            // 5\pi või 5pi või 2.5pii -> 5 * Math.PI
            .replace(/([\d.]+)\s*(\\?pi{1,2})\b/g, (_, num, piPart) => {
                return `(${num})*Math.PI`;
            })
            // tavaline \pi -> Math.PI
            .replace(/\\pi/g, 'Math.PI')

            // \frac93 → (9)/(3)
            .replace(/\\frac\s*(\d+)\s*(\d+)/g, '($1)/($2)')
            // korralik \frac{a}{b}
            .replace(/\\frac\s*{([^}]*)}{([^}]*)}/g, (match, a, b) => {
            if (!a || !b || a.trim() === '' || b.trim() === '') return '(0)/(1)';
            return `(${a})/(${b})`;
            })

            // eemalda \left ja \right tühikud
            .replace(/\\left|\\right/g, '')
            .replace(/\\(sin|cos|tan)\s+([a-zA-Z0-9]+)/g, 'Math.$1($2)') // \cos x ilma sulgudeta
            .replace(/[^\x20-\x7E]/g, ''); //eemalda mittestandardsed märgid MathLive vahest lisab unicode märke

        try {
            console.log('Evaluated expression:', expr);

            const fn = new Function('Math', `return ${expr}`); // turvaline eval() arvutus, piirab ligipääsu math objektile
            const result = fn(Math);
    
            if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
            // Vorminda tuhandete kaupa tühikutega, nt "1 000 000"
                const formatted = result.toLocaleString('fr-FR'); 
                return formatted; //hetkel result numbrina kuid saaks salvestada nt latex kujul inputis: return `\\[ ${latexInput} = ${result} \\]`;
            }

            return 'Error';
        } catch (e) {
            console.error('Eval error:', e);
            return 'Error';
        }
    }
}


