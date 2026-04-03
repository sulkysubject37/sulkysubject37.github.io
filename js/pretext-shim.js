/**
 * SulkyOS: En-tangled (v3.0.1) - Pretext Shim
 * Minimal high-performance text measurement and layout engine.
 * Governed, Not Generated.
 */

const Pretext = (() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return {
        measure: (text, font) => {
            ctx.font = font;
            return ctx.measureText(text).width;
        },

        // Breaks text into lines based on a max width without touching the DOM
        layout: (text, maxWidth, font) => {
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = Pretext.measure(currentLine + " " + word, font);
                if (width < maxWidth) {
                    currentLine += " " + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        },

        // "Shrink-wrap" finds the tightest width for a multiline block
        shrinkWrap: (lines, font) => {
            let maxW = 0;
            lines.forEach(l => {
                const w = Pretext.measure(l, font);
                if (w > maxW) maxW = w;
            });
            return maxW;
        }
    };
})();

window.Pretext = Pretext;
