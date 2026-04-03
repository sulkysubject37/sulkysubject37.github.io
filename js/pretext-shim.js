/**
 * SulkyOS: En-tangled (v3.0.1) - Pretext Pro Engine
 * Advanced text measurement with Dynamic Occlusion & Flow.
 */

const Pretext = (() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return {
        measure: (text, font) => {
            ctx.font = font;
            return ctx.measureText(text).width;
        },

        /**
         * Layout text with exclusion zones (shapes).
         * @param {string} text 
         * @param {number} maxWidth 
         * @param {string} font 
         * @param {number} startY - Starting Y coordinate
         * @param {number} lineHeight 
         * @param {Function} exclusionFn - Returns [xStart, xEnd] forbidden for a given Y
         */
        layoutWithExclusion: (text, maxWidth, font, startY, lineHeight, exclusionFn) => {
            const words = text.split(' ');
            const lines = [];
            let currentLine = "";
            let currentY = startY;

            let i = 0;
            while (i < words.length) {
                const exclusion = exclusionFn(currentY); // [forbiddenXStart, forbiddenXEnd]
                let availableRanges = [[0, maxWidth]];

                if (exclusion) {
                    const [exStart, exEnd] = exclusion;
                    availableRanges = [];
                    if (exStart > 0) availableRanges.push([0, exStart - 10]); // 10px padding
                    if (exEnd < maxWidth) availableRanges.push([exEnd + 10, maxWidth]);
                }

                // Try to fit words into the first available range
                let fitted = false;
                for (let range of availableRanges) {
                    const [rStart, rEnd] = range;
                    const rWidth = rEnd - rStart;
                    
                    let lineCandidate = words[i];
                    let j = i + 1;
                    
                    if (Pretext.measure(lineCandidate, font) > rWidth) continue;

                    while (j < words.length) {
                        const nextWord = words[j];
                        if (Pretext.measure(lineCandidate + " " + nextWord, font) <= rWidth) {
                            lineCandidate += " " + nextWord;
                            j++;
                        } else {
                            break;
                        }
                    }

                    lines.push({
                        text: lineCandidate,
                        x: rStart,
                        y: currentY,
                        width: Pretext.measure(lineCandidate, font)
                    });
                    
                    i = j;
                    fitted = true;
                    break;
                }

                if (!fitted) {
                    // Word too long for any range or no range available, skip Y
                }
                
                currentY += lineHeight;
            }

            return { lines, endY: currentY };
        }
    };
})();

window.Pretext = Pretext;
