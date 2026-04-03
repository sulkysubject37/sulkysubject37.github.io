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

        layoutWithExclusion: (text, maxWidth, font, startY, lineHeight, exclusionFn) => {
            const words = text.split(' ');
            const lines = [];
            let currentY = startY;
            let i = 0;
            let safetyCounter = 0;

            while (i < words.length && safetyCounter < 10000) {
                safetyCounter++;
                const exclusion = exclusionFn ? exclusionFn(currentY) : null;
                let availableRanges = [[0, maxWidth]];

                if (exclusion) {
                    const [exStart, exEnd] = exclusion;
                    availableRanges = [];
                    // Padding of 20px around shapes
                    if (exStart > 40) availableRanges.push([0, exStart - 20]);
                    if (exEnd < maxWidth - 40) availableRanges.push([exEnd + 20, maxWidth]);
                }

                let fitted = false;
                for (let range of availableRanges) {
                    const [rStart, rEnd] = range;
                    const rWidth = rEnd - rStart;
                    
                    if (i >= words.length) break;
                    let lineCandidate = words[i];
                    
                    if (Pretext.measure(lineCandidate, font) > rWidth) continue;

                    let j = i + 1;
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

                // Move to next line whether we fitted text or not
                currentY += lineHeight;
                
                // If we hit a total dead zone where no words fit for 100 lines, skip the word
                if (!fitted && safetyCounter % 100 === 0) {
                    i++; 
                }
            }

            return { lines, endY: currentY };
        }
    };
})();

window.Pretext = Pretext;
