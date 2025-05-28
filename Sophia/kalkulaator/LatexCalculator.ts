import { BaseCalculator } from './BaseCalculator.js'; //RUN "npx tsc" not separately filenameiga muidu vale compile tuleb
//Latex into javascript
export class LatexCalculator extends BaseCalculator { //Tegelik arvutamise loogika siin 
    evaluate(): string | number { //isendimeetod
        let expr = this.getContents(); //Latexi kujul string

        expr = expr
            // Keerukam astendamine  ^ → ** (nt x^2 või x^{2+1} või 2^1.5)               //täielik vaste, astendatav, astendaja sulgudega, tavaline astendaja
            .replace(/([a-zA-Z0-9.\)\]]+)\s*\^\s*(?:{([^}]+)}|([0-9.\-+*/a-zA-Z()]+))/g, (_, base, exp1, exp2) => {
                const exponent = exp1 || exp2; //võtab selle mis leidub
                return `(${base})**(${exponent})`;
            })
            // Lihtne ^ → ** (nt 2^3 või (1+2)^4.5)
            .replace(/(\d+(\.\d+)?|\([^()]+\))\s*\^\s*([-\d.]+)/g, '($1)**($3)') // $ tähistab gruppi eraldatakse sugludega

            // 9\cos(9) -> 9*Math.cos(9) sin cos tan 
            .replace(/(\d+)\s*\\(sin|cos|tan)\s*\(([^)]*)\)/g, '($1)*Math.$2($3)')  // ()
            .replace(/(\d+)\s*\\(sin|cos|tan)\s*{([^}]*)}/g, '($1)*Math.$2($3)') // {}
            //tavaline \cos 9 -> Math.cos(9)
            .replace(/\\(sin|cos|tan)\s*\(([^)]*)\)/g, 'Math.$1($2)')
            .replace(/\\(sin|cos|tan)\s*{([^}]*)}/g, 'Math.$1($2)')

            // ln ja log käsitlemine
            .replace(/\\ln\s*\(([^)]*)\)/g, 'Math.log($1)')
            .replace(/\\ln\s*{([^}]*)}/g, 'Math.log($1)')
            .replace(/\\log\s*\(([^)]*)\)/g, 'Math.log10($1)')
            .replace(/\\log\s*{([^}]*)}/g, 'Math.log10($1)')

            // \sqrt{9} -> Math.sqrt(9)
            .replace(/\\sqrt\s*{([^}]*)}/g, 'Math.sqrt($1)')
            // \sqrt9 (tühi ruutjuur) ilma sulgudeta, d - number
            .replace(/\\sqrt\s*(\d+(\.\d+)?)/g, 'Math.sqrt($1)')

            // \pi -> Math.PI
            .replace(/\\pi/g, 'Math.PI')

            // \frac93 → (9)/(3)
            .replace(/\\frac\s*(\d+)\s*(\d+)/g, '($1)/($2)')
            // korralik \frac{a}{b}
            .replace(/\\frac\s*{([^}]*)}{([^}]*)}/g, (match, a, b) => {
            if (!a || !b || a.trim() === '' || b.trim() === '') return '(0)/(1)'; //kontroll kas a ja b olemas, g asendab kõik mitte esimese leitud
            return `(${a})/(${b})`;
            })

            // eemalda \left ja \right tühikud
            .replace(/\\left|\\right/g, '')
            .replace(/\\(sin|cos|tan)\s+([a-zA-Z0-9]+)/g, 'Math.$1($2)') // \cos x ilma sulgudeta
            .replace(/[^\x20-\x7E]/g, ''); // eemalda mittestandardsed märgid MathLive vahest lisab unicode märke

        try {
            console.log('Evaluated expression:', expr);

            const fn = new Function('Math', `return ${expr}`); // turvaline eval() arvutus, piirab ligipääsu math objektile
            const result = fn(Math);
            //Turvakontroll:
            if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
                return result; //hetkel result numbrina kuid saaks salvestada nt latex kujul inputis: return `\\[ ${latexInput} = ${result} \\]`;
            }
            return 'Error';
        } catch (e) {
            console.error('Eval error:', e);
            return 'Error';
        }
    }
}


