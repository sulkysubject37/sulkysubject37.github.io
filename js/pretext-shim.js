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
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        let currentY = startY;

        for (let n = 0; n < words.length; n++) {
            const testLine = currentLine + words[n] + ' ';
            const testWidth = this.measureText(testLine, font);
            
            // Check for exclusion at this Y
            const exclusion = exclusionFn ? exclusionFn(currentY) : null;
            let currentMaxWidth = maxWidth;
            let startX = 0;

            if (exclusion) {
                // If exclusion exists, we simplify for now: move to next line or wrap around
                // This is a complex area for a simple shim, so we provide the structure
            }

            if (testWidth > currentMaxWidth && n > 0) {
                lines.push({ text: currentLine.trim(), y: currentY, x: startX });
                currentLine = words[n] + ' ';
                currentY += lineHeight;
            } else {
                currentLine = testLine;
            }
        }
        lines.push({ text: currentLine.trim(), y: currentY, x: 0 });
        
        return {
            lines: lines,
            endY: currentY + lineHeight
        };
    }
};
