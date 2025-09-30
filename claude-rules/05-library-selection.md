# Library Selection & Setup

## 🎯 Library Selection Guide

Claude Code automatically selects the best library:

| **Tool Type** | **Library** | **CDN** |
|--------------|------------|---------|
| **Animations** | GSAP | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js` |
| **Creative Coding** | p5.js | `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js` |
| **Vector Graphics** | Paper.js | `https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.17/paper-full.min.js` |
| **3D Graphics** | Three.js | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` |
| **Data Visualization** | Chart.js | `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js` |
| **Image Processing** | Canvas API | Native |

## Library-Specific Setup

### Three.js (CRITICAL):
```javascript
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('chatooly-canvas'),
    antialias: true, 
    preserveDrawingBuffer: true  // REQUIRED for exports
});
```

### p5.js:
```javascript
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('chatooly-canvas'); // Connect to export system
}
```

### GSAP:
```javascript
// Target elements within chatooly-canvas
gsap.to('#chatooly-canvas .element', {duration: 2, x: 100});
```

### Paper.js:
```javascript
paper.install(window);
paper.setup('chatooly-canvas');
```

### Chart.js:
```javascript
const ctx = document.getElementById('chatooly-canvas').getContext('2d');
const chart = new Chart(ctx, config);
```