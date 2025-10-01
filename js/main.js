/*
 * Text Waves - Main Logic
 * Create animated text flowing along customizable wave patterns
 */

const canvas = document.getElementById('chatooly-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 1200;
canvas.height = 800;

// Text Waves Tool State
const tool = {
    text: 'WAVE TEXT ANIMATION',
    splitMode: 'character',
    waveTypeX: 'sine',
    waveTypeY: 'sine',
    amplitudeX: 50,
    amplitudeY: 50,
    frequencyX: 0.02,
    frequencyY: 0.02,
    speedX: 1,
    speedY: 1,
    repetitions: 3,
    textColors: ['#ffffff', '#ff00ff', '#00ffff'], // Array of colors
    blendMode: 'source-over',
    fontFamily: 'Arial',
    fontSize: 24,
    bgColor: '#000000',
    bgImage: null,
    bgFit: 'cover',
    segmentIcon: null,
    iconSize: 20,
    rotateText: true,
    direction: 'right', // 'right', 'left', or 'none'
    showWavePath: false,
    waveShape: 'circle',
    waveColor: '#ff00ff',
    waveMarkerSize: 5,
    timeX: 0,
    timeY: 0
};

// Wave calculation functions
function calculateWave(type, value) {
    switch(type) {
        case 'sine':
            return Math.sin(value);
        case 'cosine':
            return Math.cos(value);
        case 'tangent':
            // Clamp tangent to prevent extreme values
            const tan = Math.tan(value);
            return Math.max(-2, Math.min(2, tan));
        case 'none':
            return 0;
        default:
            return 0;
    }
}

// Calculate wave derivative for rotation
function calculateWaveDerivative(type, value, amplitude, frequency) {
    switch(type) {
        case 'sine':
            return Math.cos(value) * amplitude * frequency;
        case 'cosine':
            return -Math.sin(value) * amplitude * frequency;
        case 'tangent':
            const sec = 1 / Math.cos(value);
            return Math.max(-2, Math.min(2, sec * sec * amplitude * frequency));
        case 'none':
            return 0;
        default:
            return 0;
    }
}

// Split text based on mode
function splitText(text, mode) {
    switch(mode) {
        case 'character':
            return text.split('');
        case 'word':
            return text.split(/(\s+)/);
        case 'sentence':
            return text.split(/([.!?]+\s*)/);
        default:
            return text.split('');
    }
}

// Draw background with proper fit
function drawBackground() {
    if (tool.bgImage) {
        const imgAspect = tool.bgImage.width / tool.bgImage.height;
        const canvasAspect = canvas.width / canvas.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (tool.bgFit === 'cover') {
            if (imgAspect > canvasAspect) {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgAspect;
                offsetX = -(drawWidth - canvas.width) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgAspect;
                offsetX = 0;
                offsetY = -(drawHeight - canvas.height) / 2;
            }
        } else if (tool.bgFit === 'contain') {
            if (imgAspect > canvasAspect) {
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgAspect;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgAspect;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }
            ctx.fillStyle = tool.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else { // fill (stretch)
            drawWidth = canvas.width;
            drawHeight = canvas.height;
            offsetX = 0;
            offsetY = 0;
        }

        ctx.drawImage(tool.bgImage, offsetX, offsetY, drawWidth, drawHeight);
    } else {
        ctx.fillStyle = tool.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Draw wave marker shapes
function drawWaveMarker(x, y, shape, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    switch(shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'square':
            ctx.fillRect(x - size, y - size, size * 2, size * 2);
            break;
        case 'cross':
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x, y + size);
            ctx.moveTo(x - size, y);
            ctx.lineTo(x + size, y);
            ctx.stroke();
            break;
        case 'rhombus':
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y);
            ctx.lineTo(x, y + size);
            ctx.lineTo(x - size, y);
            ctx.closePath();
            ctx.fill();
            break;
    }

    ctx.restore();
}

// Render function
function render() {
    // Clear canvas with background
    drawBackground();

    // Set text properties
    ctx.font = `${tool.fontSize}px ${tool.fontFamily}, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.globalCompositeOperation = tool.blendMode;

    // Split text
    const parts = splitText(tool.text, tool.splitMode);

    // Calculate total text width for centering
    const spacing = tool.fontSize * 0.6;
    let totalWidth = 0;
    parts.forEach(part => {
        totalWidth += ctx.measureText(part).width + spacing;
    });

    // Add icon size to spacing if icon exists
    const iconSpacing = tool.segmentIcon ? tool.iconSize + spacing : 0;

    // Start from left to center the entire animation
    const startX = canvas.width / 2 - (totalWidth * tool.repetitions) / 2;

    // Track segment index for color cycling
    let segmentIndex = 0;

    // Render text with repetitions
    for (let rep = 0; rep < tool.repetitions; rep++) {
        let xOffset = 0;

        parts.forEach((part, i) => {
            const partWidth = ctx.measureText(part).width;
            const baseX = startX + rep * totalWidth + xOffset + partWidth / 2;

            // Calculate wave offsets for X and Y
            const waveInputX = baseX * tool.frequencyX + tool.timeX;
            const waveInputY = baseX * tool.frequencyY + tool.timeY;

            const offsetX = calculateWave(tool.waveTypeX, waveInputX) * tool.amplitudeX;
            const offsetY = calculateWave(tool.waveTypeY, waveInputY) * tool.amplitudeY;

            // Calculate final position
            const x = baseX + offsetX;
            const y = canvas.height / 2 + offsetY;

            // Draw wave path visualization
            if (tool.showWavePath) {
                drawWaveMarker(x, y, tool.waveShape, tool.waveMarkerSize, tool.waveColor);
            }

            // Calculate rotation if enabled
            let rotation = 0;
            if (tool.rotateText) {
                const dxX = calculateWaveDerivative(tool.waveTypeX, waveInputX, tool.amplitudeX, tool.frequencyX);
                const dxY = calculateWaveDerivative(tool.waveTypeY, waveInputY, tool.amplitudeY, tool.frequencyY);
                rotation = Math.atan2(dxY, 1 + dxX);
            }

            // Get color for this segment (cycle through colors array)
            const colorIndex = segmentIndex % tool.textColors.length;
            ctx.fillStyle = tool.textColors[colorIndex];

            // Draw text part with rotation
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillText(part, 0, 0);
            ctx.restore();

            // Draw segment icon after text
            if (tool.segmentIcon && part.trim().length > 0) {
                const iconX = x + partWidth / 2 + iconSpacing / 2;
                const iconY = y;

                ctx.save();
                ctx.translate(iconX, iconY);
                ctx.rotate(rotation);
                ctx.drawImage(
                    tool.segmentIcon,
                    -tool.iconSize / 2,
                    -tool.iconSize / 2,
                    tool.iconSize,
                    tool.iconSize
                );
                ctx.restore();
            }

            xOffset += partWidth + spacing + iconSpacing;

            // Only increment segment index for non-whitespace parts
            if (part.trim().length > 0) {
                segmentIndex++;
            }
        });
    }

    // Reset blend mode
    ctx.globalCompositeOperation = 'source-over';

    // Update time for both axes based on direction
    if (tool.direction === 'right') {
        tool.timeX += 0.02 * tool.speedX;
        tool.timeY += 0.02 * tool.speedY;
    } else if (tool.direction === 'left') {
        tool.timeX -= 0.02 * tool.speedX;
        tool.timeY -= 0.02 * tool.speedY;
    }
    // If direction is 'none', don't update time (static)
}

// Animation loop
function animate() {
    render();
    requestAnimationFrame(animate);
}
animate();

// ===== Color Management UI =====
function renderColorInputs() {
    const container = document.getElementById('text-colors-container');
    container.innerHTML = '';

    tool.textColors.forEach((color, index) => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = color;
        colorInput.addEventListener('input', (e) => {
            tool.textColors[index] = e.target.value;
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.type = 'button';
        removeBtn.addEventListener('click', () => {
            if (tool.textColors.length > 1) {
                tool.textColors.splice(index, 1);
                renderColorInputs();
            }
        });

        colorItem.appendChild(colorInput);
        colorItem.appendChild(removeBtn);
        container.appendChild(colorItem);
    });
}

// Initialize color inputs
renderColorInputs();

// Add color button
document.getElementById('add-color-btn').addEventListener('click', () => {
    tool.textColors.push('#ffffff');
    renderColorInputs();
});

// Event Listeners
document.getElementById('text-input').addEventListener('input', (e) => {
    tool.text = e.target.value || 'WAVE TEXT ANIMATION';
});

document.getElementById('split-mode').addEventListener('change', (e) => {
    tool.splitMode = e.target.value;
});

document.getElementById('wave-type-x').addEventListener('change', (e) => {
    tool.waveTypeX = e.target.value;
});

document.getElementById('wave-type-y').addEventListener('change', (e) => {
    tool.waveTypeY = e.target.value;
});

// Amplitude X
document.getElementById('amplitude-x').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    tool.amplitudeX = value;
    document.getElementById('amplitude-x-input').value = value;
});
document.getElementById('amplitude-x-input').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    tool.amplitudeX = value;
    document.getElementById('amplitude-x').value = value;
});

// Amplitude Y
document.getElementById('amplitude-y').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    tool.amplitudeY = value;
    document.getElementById('amplitude-y-input').value = value;
});
document.getElementById('amplitude-y-input').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    tool.amplitudeY = value;
    document.getElementById('amplitude-y').value = value;
});

// Speed X
document.getElementById('speed-x').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    tool.speedX = value;
    document.getElementById('speed-x-input').value = value;
});
document.getElementById('speed-x-input').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    tool.speedX = value;
    document.getElementById('speed-x').value = value;
});

// Speed Y
document.getElementById('speed-y').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    tool.speedY = value;
    document.getElementById('speed-y-input').value = value;
});
document.getElementById('speed-y-input').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    tool.speedY = value;
    document.getElementById('speed-y').value = value;
});

// Frequency X
document.getElementById('frequency-x').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    tool.frequencyX = value;
    document.getElementById('frequency-x-input').value = value;
});
document.getElementById('frequency-x-input').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    tool.frequencyX = value;
    document.getElementById('frequency-x').value = value;
});

// Frequency Y
document.getElementById('frequency-y').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    tool.frequencyY = value;
    document.getElementById('frequency-y-input').value = value;
});
document.getElementById('frequency-y-input').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    tool.frequencyY = value;
    document.getElementById('frequency-y').value = value;
});

document.getElementById('repetitions').addEventListener('input', (e) => {
    tool.repetitions = parseInt(e.target.value);
    document.getElementById('repetitions-value').textContent = tool.repetitions;
});

document.getElementById('rotate-text').addEventListener('change', (e) => {
    tool.rotateText = e.target.checked;
});

document.getElementById('direction').addEventListener('change', (e) => {
    tool.direction = e.target.value;
});

document.getElementById('show-wave-path').addEventListener('change', (e) => {
    tool.showWavePath = e.target.checked;
});

document.getElementById('wave-shape').addEventListener('change', (e) => {
    tool.waveShape = e.target.value;
});

document.getElementById('wave-color').addEventListener('input', (e) => {
    tool.waveColor = e.target.value;
});

// Wave Marker Size
document.getElementById('wave-marker-size').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    tool.waveMarkerSize = value;
    document.getElementById('wave-marker-size-input').value = value;
});
document.getElementById('wave-marker-size-input').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 2;
    tool.waveMarkerSize = value;
    document.getElementById('wave-marker-size').value = value;
});

document.getElementById('blend-mode').addEventListener('change', (e) => {
    tool.blendMode = e.target.value;
});

document.getElementById('font-family').addEventListener('change', (e) => {
    tool.fontFamily = e.target.value;
});

// Font Size
document.getElementById('font-size').addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    tool.fontSize = value;
    document.getElementById('font-size-input').value = value;
});
document.getElementById('font-size-input').addEventListener('input', (e) => {
    const value = parseInt(e.target.value) || 12;
    tool.fontSize = value;
    document.getElementById('font-size').value = value;
});

document.getElementById('bg-color').addEventListener('input', (e) => {
    tool.bgColor = e.target.value;
});

document.getElementById('bg-fit').addEventListener('change', (e) => {
    tool.bgFit = e.target.value;
});

document.getElementById('bg-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                tool.bgImage = img;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('segment-icon').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                tool.segmentIcon = img;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Icon Size
document.getElementById('icon-size').addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    tool.iconSize = value;
    document.getElementById('icon-size-input').value = value;
});
document.getElementById('icon-size-input').addEventListener('input', (e) => {
    const value = parseInt(e.target.value) || 10;
    tool.iconSize = value;
    document.getElementById('icon-size').value = value;
});

// High-resolution export function (MANDATORY)
window.renderHighResolution = function(targetCanvas, scale) {
    const exportCtx = targetCanvas.getContext('2d');
    targetCanvas.width = canvas.width * scale;
    targetCanvas.height = canvas.height * scale;

    exportCtx.scale(scale, scale);

    // Draw background
    if (tool.bgImage) {
        const imgAspect = tool.bgImage.width / tool.bgImage.height;
        const canvasAspect = canvas.width / canvas.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (tool.bgFit === 'cover') {
            if (imgAspect > canvasAspect) {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgAspect;
                offsetX = -(drawWidth - canvas.width) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgAspect;
                offsetX = 0;
                offsetY = -(drawHeight - canvas.height) / 2;
            }
        } else if (tool.bgFit === 'contain') {
            if (imgAspect > canvasAspect) {
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgAspect;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgAspect;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }
            exportCtx.fillStyle = tool.bgColor;
            exportCtx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            drawWidth = canvas.width;
            drawHeight = canvas.height;
            offsetX = 0;
            offsetY = 0;
        }

        exportCtx.drawImage(tool.bgImage, offsetX, offsetY, drawWidth, drawHeight);
    } else {
        exportCtx.fillStyle = tool.bgColor;
        exportCtx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Set text properties
    exportCtx.font = `${tool.fontSize}px ${tool.fontFamily}, sans-serif`;
    exportCtx.textBaseline = 'middle';
    exportCtx.textAlign = 'center';
    exportCtx.globalCompositeOperation = tool.blendMode;

    // Split text
    const parts = splitText(tool.text, tool.splitMode);

    // Calculate total text width
    const spacing = tool.fontSize * 0.6;
    let totalWidth = 0;
    parts.forEach(part => {
        totalWidth += exportCtx.measureText(part).width + spacing;
    });

    const iconSpacing = tool.segmentIcon ? tool.iconSize + spacing : 0;
    const startX = canvas.width / 2 - (totalWidth * tool.repetitions) / 2;

    // Track segment index for color cycling
    let segmentIndex = 0;

    // Render text with repetitions (capture current frame)
    for (let rep = 0; rep < tool.repetitions; rep++) {
        let xOffset = 0;

        parts.forEach((part, i) => {
            const partWidth = exportCtx.measureText(part).width;
            const baseX = startX + rep * totalWidth + xOffset + partWidth / 2;

            const waveInputX = baseX * tool.frequencyX + tool.timeX;
            const waveInputY = baseX * tool.frequencyY + tool.timeY;

            const offsetX = calculateWave(tool.waveTypeX, waveInputX) * tool.amplitudeX;
            const offsetY = calculateWave(tool.waveTypeY, waveInputY) * tool.amplitudeY;

            const x = baseX + offsetX;
            const y = canvas.height / 2 + offsetY;

            // Draw wave path visualization
            if (tool.showWavePath) {
                exportCtx.save();
                exportCtx.fillStyle = tool.waveColor;
                exportCtx.strokeStyle = tool.waveColor;
                exportCtx.lineWidth = 2;

                switch(tool.waveShape) {
                    case 'circle':
                        exportCtx.beginPath();
                        exportCtx.arc(x, y, tool.waveMarkerSize, 0, Math.PI * 2);
                        exportCtx.fill();
                        break;
                    case 'square':
                        exportCtx.fillRect(x - tool.waveMarkerSize, y - tool.waveMarkerSize,
                                         tool.waveMarkerSize * 2, tool.waveMarkerSize * 2);
                        break;
                    case 'cross':
                        exportCtx.beginPath();
                        exportCtx.moveTo(x, y - tool.waveMarkerSize);
                        exportCtx.lineTo(x, y + tool.waveMarkerSize);
                        exportCtx.moveTo(x - tool.waveMarkerSize, y);
                        exportCtx.lineTo(x + tool.waveMarkerSize, y);
                        exportCtx.stroke();
                        break;
                    case 'rhombus':
                        exportCtx.beginPath();
                        exportCtx.moveTo(x, y - tool.waveMarkerSize);
                        exportCtx.lineTo(x + tool.waveMarkerSize, y);
                        exportCtx.lineTo(x, y + tool.waveMarkerSize);
                        exportCtx.lineTo(x - tool.waveMarkerSize, y);
                        exportCtx.closePath();
                        exportCtx.fill();
                        break;
                }

                exportCtx.restore();
            }

            let rotation = 0;
            if (tool.rotateText) {
                const dxX = calculateWaveDerivative(tool.waveTypeX, waveInputX, tool.amplitudeX, tool.frequencyX);
                const dxY = calculateWaveDerivative(tool.waveTypeY, waveInputY, tool.amplitudeY, tool.frequencyY);
                rotation = Math.atan2(dxY, 1 + dxX);
            }

            // Get color for this segment (cycle through colors array)
            const colorIndex = segmentIndex % tool.textColors.length;
            exportCtx.fillStyle = tool.textColors[colorIndex];

            exportCtx.save();
            exportCtx.translate(x, y);
            exportCtx.rotate(rotation);
            exportCtx.fillText(part, 0, 0);
            exportCtx.restore();

            if (tool.segmentIcon && part.trim().length > 0) {
                const iconX = x + partWidth / 2 + iconSpacing / 2;
                const iconY = y;

                exportCtx.save();
                exportCtx.translate(iconX, iconY);
                exportCtx.rotate(rotation);
                exportCtx.drawImage(
                    tool.segmentIcon,
                    -tool.iconSize / 2,
                    -tool.iconSize / 2,
                    tool.iconSize,
                    tool.iconSize
                );
                exportCtx.restore();
            }

            xOffset += partWidth + spacing + iconSpacing;

            // Only increment segment index for non-whitespace parts
            if (part.trim().length > 0) {
                segmentIndex++;
            }
        });
    }

    // Reset blend mode
    exportCtx.globalCompositeOperation = 'source-over';

    console.log(`High-res export completed at ${scale}x resolution`);
};
