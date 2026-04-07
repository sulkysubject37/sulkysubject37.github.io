/**
 * PRETEXT SHIM 2.0 // SULKY_OS SPECIALIZED
 * Handles bit-exact text measurement and architectural layout.
 */

const Pretext = {
    _canvas: null,
    _ctx: null,

    getCanvas() {
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext('2d');
        }
        return this._ctx;
    },

    measureText(text, font) {
        const ctx = this.getCanvas();
        ctx.font = font;
        return ctx.measureText(text).width;
    },

    /**
     * Lays out text while respecting optional exclusion zones (e.g. around graph nodes)
     */
    layoutWithExclusion(text, maxWidth, font, startY, lineHeight, exclusionFn) {
        const words = text.split(/\s+/);
        const lines = [];
        let currentLine = '';
        let currentY = startY;

        for (let n = 0; n < words.length; n++) {
            const word = words[n];
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            
            // Check for exclusion at this Y
            const exclusion = exclusionFn ? exclusionFn(currentY) : null;
            let effectiveMaxWidth = maxWidth;
            let startX = 0;

            if (exclusion) {
                // If the line intersects an exclusion circle, adjust maxWidth and startX
                const [exStart, exEnd] = exclusion;
                // Simplified wrap logic: if we're in an exclusion zone, we shift to the right of it
                // Or if it's too wide, we stay to the left.
                // For this OS, we'll try to wrap around the center exclusion.
                if (exStart < maxWidth / 2) {
                    startX = exEnd;
                    effectiveMaxWidth = maxWidth - exEnd;
                } else {
                    effectiveMaxWidth = exStart;
                }
            }

            const testWidth = this.measureText(testLine, font);

            if (testWidth > effectiveMaxWidth && n > 0) {
                lines.push({ text: currentLine, y: currentY, x: startX });
                currentLine = word;
                currentY += lineHeight;
            } else {
                currentLine = testLine;
            }
        }
        
        // Final line
        const finalExclusion = exclusionFn ? exclusionFn(currentY) : null;
        let finalX = 0;
        if (finalExclusion && finalExclusion[0] < maxWidth / 2) finalX = finalExclusion[1];
        
        lines.push({ text: currentLine, y: currentY, x: finalX });
        
        return {
            lines: lines,
            endY: currentY + lineHeight
        };
    }
};
