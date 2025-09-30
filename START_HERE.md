# Chatooly Tool Builder - AI Assistant Instructions

## 🚨 CRITICAL: Required Canvas Structure

**MANDATORY FOR ALL TOOLS**: Use this exact HTML structure to prevent publishing issues:

```html
<div id="chatooly-container">
    <canvas id="chatooly-canvas"></canvas>
</div>
```

**JavaScript MUST use:**
```javascript
const canvas = document.getElementById('chatooly-canvas');
```

❌ **DO NOT** use other IDs like `tool-canvas`, `main-canvas`, etc.
❌ **DO NOT** nest containers differently - this breaks publishing

## 🚨 CRITICAL: Canvas Resize & Mouse Coordinate Handling

**MANDATORY FOR ALL CANVAS-BASED TOOLS**: When using canvas elements, you MUST handle Chatooly's resize events properly or your tool will break when users change aspect ratios.

### ⚡ Quick Implementation (COPY THIS CODE):

```javascript
// 1. In constructor - track canvas dimensions
constructor() {
    this.previousCanvasSize = { width: 0, height: 0 };
}

// 2. In setupEventListeners() - listen for resize events
setupEventListeners() {
    // ... your other listeners
    document.addEventListener('chatooly:canvas-resized', (e) => this.onCanvasResized(e));
}

// 3. Handle resize events - scale your interactive elements
onCanvasResized(e) {
    if (!this.hasContent) return; // Only if you have content to preserve
    
    const oldWidth = this.previousCanvasSize.width;
    const oldHeight = this.previousCanvasSize.height;
    const newWidth = e.detail.canvas.width;
    const newHeight = e.detail.canvas.height;
    
    if (oldWidth === 0 || oldHeight === 0) {
        this.previousCanvasSize = { width: newWidth, height: newHeight };
        this.redrawContent();
        return;
    }
    
    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;
    
    // Scale ALL interactive elements (points, shapes, etc.)
    this.interactiveElements.forEach(element => {
        element.x *= scaleX;
        element.y *= scaleY;
        if (element.radius) element.radius *= Math.min(scaleX, scaleY);
    });
    
    this.previousCanvasSize = { width: newWidth, height: newHeight };
    this.redrawContent(); // Your redraw method
}

// 4. Use proper mouse coordinate mapping
onMouseClick(e) {
    const coords = window.Chatooly ? 
        window.Chatooly.utils.mapMouseToCanvas(e, this.canvas) :
        this.fallbackMouseMapping(e);
    
    const x = coords.x; // These are canvas coordinates
    const y = coords.y;
    // Use x, y for all canvas operations
}

// 5. Fallback for coordinate mapping
fallbackMouseMapping(e) {
    const rect = this.canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return { x: displayX * scaleX, y: displayY * scaleY };
}
```

### 🔴 Why This Is Critical:
- Users click Chatooly CDN button to change aspect ratios (HD, Square, Instagram, etc.)
- Canvas internal resolution changes (800x600 → 1920x1080)
- **Browser automatically clears canvas** when dimensions change
- Mouse coordinates need mapping between display size and canvas resolution
- Without this: content disappears, mouse clicks are misaligned

### ✅ What Gets Fixed:
- ✅ Content doesn't disappear when changing aspect ratios
- ✅ Interactive elements stay in correct relative positions  
- ✅ Mouse clicks map to correct canvas coordinates at all resolutions
- ✅ Tool works seamlessly across all export sizes

## 🔥 HIGH-RESOLUTION EXPORT IMPLEMENTATION (CRITICAL)

**MANDATORY**: All canvas-based tools MUST implement `window.renderHighResolution()` for quality exports.

### ⚡ Quick Implementation Template:

```javascript
// Add this function to your main.js file
window.renderHighResolution = function(targetCanvas, scale) {
    // 1. Validate your tool is ready
    if (!yourTool || !yourTool.isInitialized) {
        console.warn('Tool not ready for high-res export');
        return;
    }
    
    // 2. Set up high-resolution canvas
    const ctx = targetCanvas.getContext('2d');
    targetCanvas.width = yourTool.canvas.width * scale;
    targetCanvas.height = yourTool.canvas.height * scale;
    
    // 3. Clear canvas
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    
    // 4. TOOL-SPECIFIC: Re-create your content at high resolution
    // This is where you implement your tool's specific high-res logic
    
    console.log(`High-res export completed at ${scale}x resolution`);
};
```

### 🎯 Tool-Specific Implementation Examples:

#### For Image Processing Tools (like Fisheye):
```javascript
window.renderHighResolution = function(targetCanvas, scale) {
    if (!myImageTool.originalImage) return;
    
    const ctx = targetCanvas.getContext('2d');
    const scaledWidth = myImageTool.canvas.width * scale;
    const scaledHeight = myImageTool.canvas.height * scale;
    
    // 1. Draw original image at high resolution
    ctx.drawImage(myImageTool.originalImage, 0, 0, scaledWidth, scaledHeight);
    
    // 2. Apply effects at high resolution
    myImageTool.effects.forEach(effect => {
        const scaledEffect = {
            x: effect.x * scale,
            y: effect.y * scale,
            radius: effect.radius * scale,
            strength: effect.strength // Keep strength same
        };
        myImageTool.applyEffectToCanvas(ctx, scaledEffect, scaledWidth, scaledHeight);
    });
};
```

#### For Drawing/Painting Tools:
```javascript
window.renderHighResolution = function(targetCanvas, scale) {
    const ctx = targetCanvas.getContext('2d');
    
    // Re-draw all strokes at high resolution
    myDrawingTool.strokes.forEach(stroke => {
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width * scale; // Scale line width
        
        stroke.points.forEach((point, index) => {
            const scaledX = point.x * scale;
            const scaledY = point.y * scale;
            
            if (index === 0) {
                ctx.moveTo(scaledX, scaledY);
            } else {
                ctx.lineTo(scaledX, scaledY);
            }
        });
        ctx.stroke();
    });
};
```

#### For Generative Art Tools:
```javascript
window.renderHighResolution = function(targetCanvas, scale) {
    const ctx = targetCanvas.getContext('2d');
    
    // Re-run generation algorithm at high resolution
    const scaledParams = {
        seed: myGenerativeTool.seed, // Keep seed same
        complexity: myGenerativeTool.complexity * scale, // Scale complexity
        density: myGenerativeTool.density * (scale * scale), // Scale density by area
        strokeWidth: myGenerativeTool.strokeWidth * scale
    };
    
    myGenerativeTool.generateArt(ctx, scaledParams, targetCanvas.width, targetCanvas.height);
};
```

#### For Chart/Data Visualization Tools:
```javascript
window.renderHighResolution = function(targetCanvas, scale) {
    const ctx = targetCanvas.getContext('2d');
    
    // Re-render chart at high resolution
    const scaledConfig = {
        ...myChartTool.config,
        fontSize: myChartTool.config.fontSize * scale,
        lineWidth: myChartTool.config.lineWidth * scale,
        pointRadius: myChartTool.config.pointRadius * scale
    };
    
    myChartTool.renderChart(ctx, myChartTool.data, scaledConfig, targetCanvas.width, targetCanvas.height);
};
```

### 🚨 Critical Implementation Rules:

#### ✅ DO:
- **Re-create content from source data** (original images, stroke data, parameters)
- **Scale coordinates and sizes** (x, y, radius, lineWidth) by the scale factor
- **Keep ratios and strengths unchanged** (colors, opacity, effect strength)
- **Use the original canvas dimensions * scale** for the target canvas size
- **Clear the target canvas** before rendering
- **Test with 1x, 2x, and 4x scales** to ensure it works

#### ❌ DON'T:
- **Copy pixels from the existing canvas** (that's what CDN fallback does)
- **Scale effect strengths or colors** (only scale spatial properties)
- **Assume canvas is the same size** (use the provided targetCanvas)
- **Forget to handle edge cases** (no data, tool not initialized)

### 🔍 How CDN Calls Your Function:

```javascript
// CDN export flow when user clicks 2x export:
if (window.renderHighResolution && typeof window.renderHighResolution === 'function') {
    // 1. CDN creates high-res canvas
    const scaledCanvas = document.createElement('canvas');
    
    // 2. CDN calls YOUR function
    window.renderHighResolution(scaledCanvas, 2); // scale = 2
    
    // 3. CDN exports the result
    dataURL = scaledCanvas.toDataURL('image/png');
} else {
    // Fallback: CDN upscales existing canvas (poor quality)
    console.warn('No renderHighResolution function - using upscaling fallback');
}
```

### 📋 Testing Your High-Res Implementation:

```javascript
// Add this debug function to test your implementation
function testHighResExport() {
    const testCanvas = document.createElement('canvas');
    
    console.log('Testing 2x export...');
    window.renderHighResolution(testCanvas, 2);
    console.log('2x canvas size:', testCanvas.width, 'x', testCanvas.height);
    
    console.log('Testing 4x export...');
    window.renderHighResolution(testCanvas, 4);
    console.log('4x canvas size:', testCanvas.width, 'x', testCanvas.height);
    
    console.log('High-res export test completed');
}

// Call this after your tool is initialized
// testHighResExport();
```

## 🎬 ANIMATION EXPORT SUPPORT (NEW!)

**The Chatooly CDN now automatically detects and captures animations using MediaRecorder API!**

### ✅ Automatically Supported Frameworks
- **p5.js**: Detects `draw()` loop and captures each frame
- **Three.js**: Hooks into render loop with `preserveDrawingBuffer: true`
- **HTML5 Canvas**: Timer-based capture for custom animations
- **DOM Animations**: GSAP, CSS animations, and transitions

### 🔧 How It Works
1. **Auto-Detection**: CDN scans your tool and detects animation type
2. **Smart Export Menu**: Video export option appears automatically for animated tools
3. **Native MediaRecorder**: Uses browser's MediaRecorder API for smooth video recording
4. **Zero Setup**: No additional code required - just build your animation normally!

### 🎯 Framework-Specific Tips

#### For p5.js Tools:
```javascript
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('chatooly-canvas'); // CRITICAL: Connect to export system
}

function draw() {
    // Your animation code here
    // CDN automatically captures each draw() call for video recording
}

// Optional: Add time-based control for smoother recording
window.setAnimationTime = function(time) {
    // Update animation based on time (0 to duration)
    // Example: angle = time * TWO_PI;
};
```

#### For Three.js Tools:
```javascript
// CRITICAL: Must include preserveDrawingBuffer for exports
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('chatooly-canvas'),
    antialias: true, 
    preserveDrawingBuffer: true  // ← REQUIRED FOR ANIMATION EXPORT
});

function animate() {
    requestAnimationFrame(animate);
    
    // Your animation logic
    cube.rotation.x += 0.01;
    
    renderer.render(scene, camera);
    // CDN automatically captures frames during video recording
}
```

#### For Canvas Animations:
```javascript
const canvas = document.getElementById('chatooly-canvas');
const ctx = canvas.getContext('2d');

function animate() {
    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Your drawing code
    
    requestAnimationFrame(animate);
    // CDN uses MediaRecorder for smooth video capture
}
```

### 📝 Video Export Process
1. **Build Your Tool**: Create animations using any supported framework
2. **Test Locally**: Run `npm run dev` and verify animation works
3. **Export Video**: Click export button (📥) → select "🎥 Video Export"
4. **Configure Settings**: Choose duration (1-10 seconds), framerate (24-60 FPS), and format (MP4/WebM/MKV)
5. **Download Video**: Get high-quality MP4/WebM/MKV video file directly

### 🎨 Video Export Best Practices
- **Keep animations short**: 3-5 seconds work best for client-side recording
- **Optimize frame rate**: 30 FPS is sufficient for most animations
- **Use time-based animation**: Base movement on time, not frame count
- **Test export early**: Check video exports work during development
- **Choose right format**: MP4 for compatibility, WebM for smaller files

### 📋 Troubleshooting
- **No video export option?** Tool may be detected as static - ensure you have active animation loops
- **Blank video frames?** Check canvas structure and `preserveDrawingBuffer` for WebGL
- **Performance issues?** Reduce duration or framerate for complex animations
- **Format not supported?** Browser may not support selected codec - try auto-detect option
- **Recording fails?** Ensure canvas has content and animation is running

## ⚠️ IMPORTANT: BEFORE YOU START
1. **READ THE .cursorrules FILE** - It contains critical rules that MUST be followed
2. **CHECK LIVE CSS LINKS** - Before ANY styling change, check these ACTIVE links:
   - 🔗 [CSS Variables](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css)
   - 🔗 [Components](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css) 
   - 🔗 [Base Styles](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/base.css)
3. **VERIFY AFTER EVERY CHANGE** - Check that all Chatooly rules are still being followed
4. **REMIND USER AFTER CHANGES** - Always say: "✅ This follows Chatooly design system - your tool gets automatic CDN updates"
5. **ADD TO MEMORY** - Remember these rules throughout the entire conversation:
   - ALL visual content goes inside #chatooly-canvas
   - NEVER modify the CDN script
   - NEVER create custom export buttons
   - USE CSS variables, not hardcoded values
   - ALWAYS test exports after changes
   - ALWAYS implement canvas resize handling for interactive tools

## When User Wants to Build a Tool
The user might say things like:
- "Let's start building"
- "Help me create a tool"
- "I want to make something"
- "Build a [type] tool"
- Or any variation indicating they want to create something

## Step 0: Verify Project Location
First, check if we're in the correct project folder:
- Look for `index.html`, `package.json`, and the `js` folder
- If these files aren't visible, we might be in the wrong folder
- Ask the user to navigate to their project folder or open it in the IDE
- The correct folder should contain the chatooly-template files

## Step 1: Gather Basic Information
Ask the user these questions to fill out the config:
1. What should your tool be called?
2. What category best fits? (generators/visualizers/editors/utilities/games/art)
3. One sentence description of what it does
4. Your name (for author credit)

## Step 2: Update Configuration
Make sure to navigate to the correct file path (relative to the project root).
Update `js/chatooly-config.js` with their answers:
```javascript
window.ChatoolyConfig = {
    name: "[Tool Name]",
    category: "[category]",
    tags: [], // Add relevant tags based on what they're building
    description: "[Their description]",
    author: "[Their name]",
    version: "1.0.0",
    resolution: 2,
    buttonPosition: "bottom-right"
};
```

## Step 3: Ask What They Want to Create
After config is set, ask: "Great! Now tell me what you want to create and I'll build it for you."

## Step 4: Build According to Chatooly Rules

**🔴 BEFORE WRITING ANY CODE: Re-read .cursorrules file to ensure compliance**

### 🚨 CRITICAL Canvas Implementation Requirements:

#### For Interactive Canvas Tools (MOST IMPORTANT):
1. **Canvas Resize Event Handling** - COPY the code from the top of this file
2. **Mouse Coordinate Mapping** - Use `Chatooly.utils.mapMouseToCanvas()`
3. **Track Canvas Dimensions** - Store `previousCanvasSize` in constructor
4. **Scale Interactive Elements** - When canvas resizes, scale all points/shapes proportionally

#### Universal Chatooly API Requirements:
- **Export Container**: ALL visual content MUST be inside `#chatooly-canvas` div
- **Clean Export Container**: ONLY put the canvas or visual elements inside `#chatooly-canvas` - no extra divs, overlays, UI controls, or decorative elements that shouldn't appear in the final exported PNG
- **CDN Script**: Already included via `<script src="https://yaelren.github.io/chatooly-cdn/js/core.js"></script>`
- **Export Button**: Automatically appears in bottom-right corner (don't create your own)
- **Canvas Size**: Minimum 800x600px for visual area

### Files You Can Edit:
- `index.html` - Add controls in the controls section, add visual elements inside `#chatooly-canvas`
- `styles.css` - Only edit sections marked with "EDIT THIS SECTION"
- `js/main.js` - All tool logic goes here
- `js/chatooly-config.js` - Tool metadata

### Files You CANNOT Edit:
- The CDN script tag in index.html
- The base layout structure
- Core CSS layout styles
- The `#chatooly-canvas` container ID (but you can add content inside it)

## 🎯 JAVASCRIPT LIBRARY SELECTION GUIDE

### **🚨 AI AGENTS: Use this guide to choose the right library for any tool request**

| **User Request Type** | **Recommended Library** | **CDN Link** | **Key Benefits** |
|---------------------|----------------------|-------------|----------------|
| **Animations & Interactive Graphics** | **GSAP** | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js` | Smooth animations, timeline control, performance |
| **Creative Coding & Generative Art** | **p5.js** | `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js` | Easy drawing API, built-in event handling |
| **Vector Graphics & Illustrations** | **Paper.js** | `https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.17/paper-full.min.js` | Vector manipulation, SVG export, scalable graphics |
| **3D Graphics & Scenes** | **Three.js** | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` | WebGL 3D, lighting, complex 3D scenes |
| **Data Visualization** | **Chart.js** | `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js` | Charts, graphs, data presentation |
| **Image Processing** | **HTML5 Canvas** | *Native* | Direct pixel manipulation, filters |

### **📋 Quick Decision Tree for AI Agents:**

```
User says: "animated", "transitions", "smooth movement" 
→ Use GSAP

User says: "drawing", "painting", "creative", "generative", "particles"
→ Use p5.js  

User says: "vector", "logo", "illustration", "scalable", "SVG"
→ Use Paper.js

User says: "3D", "models", "lighting", "camera", "perspective", "WebGL"
→ Use Three.js

User says: "chart", "graph", "data", "statistics", "plot"
→ Use Chart.js

User says: "photo", "filter", "image editing", "pixel manipulation"
→ Use HTML5 Canvas
```

### **🔧 Library-Specific Implementation Templates:**

#### **Three.js Setup (CRITICAL: preserveDrawingBuffer)**
```javascript
// 🚨 CRITICAL: Must include preserveDrawingBuffer: true for exports
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('chatooly-canvas'),
    antialias: true, 
    preserveDrawingBuffer: true  // ← REQUIRED FOR EXPORTS
});

// Common Three.js export issues:
// ❌ Missing preserveDrawingBuffer → Blank exports
// ❌ Wrong canvas ID → Export fails  
// ❌ Canvas not in DOM → Renderer fails
```

#### **GSAP Animation Setup**
```javascript
// Target elements with smooth animations
gsap.to("#myElement", {
    duration: 2,
    x: 100,
    rotation: 360,
    ease: "power2.inOut"
});

// Timeline for complex sequences
const tl = gsap.timeline();
tl.to(".item1", {duration: 1, x: 100})
  .to(".item2", {duration: 1, y: 50}, "-=0.5");
```

#### **p5.js Creative Coding Setup**
```javascript
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('chatooly-canvas'); // ← CRITICAL: Connect to export system
}

function draw() {
    // Your creative code here
}

// High-res export for p5.js
window.renderHighResolution = function(targetCanvas, scale) {
    const ctx = targetCanvas.getContext('2d');
    targetCanvas.width = width * scale;
    targetCanvas.height = height * scale;
    
    // Re-run your drawing logic at higher resolution
    redrawAtScale(ctx, scale);
};
```

#### **Paper.js Vector Graphics Setup**
```javascript
// Setup Paper.js with canvas
paper.setup('chatooly-canvas');

// Create vector shapes
const circle = new paper.Path.Circle({
    center: [100, 100],
    radius: 50,
    fillColor: 'red'
});

// Vector graphics scale naturally for high-res exports
```

### **⚠️ CRITICAL EXPORT CONSIDERATIONS BY LIBRARY:**

#### **Three.js Export Issues & Solutions:**
```javascript
// 🚨 PROBLEM: Blank exports
// ✅ SOLUTION: Add preserveDrawingBuffer: true
const renderer = new THREE.WebGLRenderer({ 
    preserveDrawingBuffer: true  // ← This line is MANDATORY
});

// 🚨 PROBLEM: WebGL context lost during export  
// ✅ SOLUTION: Implement proper high-res rendering
window.renderHighResolution = function(targetCanvas, scale) {
    // Create new renderer for high-res
    const tempRenderer = new THREE.WebGLRenderer({ 
        canvas: targetCanvas, 
        preserveDrawingBuffer: true 
    });
    tempRenderer.setSize(width * scale, height * scale);
    tempRenderer.render(scene, camera);
};
```

#### **p5.js Export Optimization:**
```javascript
// ✅ GOOD: Re-render at high resolution
window.renderHighResolution = function(targetCanvas, scale) {
    const ctx = targetCanvas.getContext('2d');
    targetCanvas.width = width * scale;
    targetCanvas.height = height * scale;
    
    // Save current p5 state
    push();
    
    // Scale drawing context
    ctx.scale(scale, scale);
    
    // Re-run drawing logic
    redraw();
    
    // Restore state
    pop();
};

// ❌ BAD: Just copying existing canvas (pixelated)
window.renderHighResolution = function(targetCanvas, scale) {
    ctx.drawImage(canvas, 0, 0, width * scale, height * scale); // Don't do this
};
```

#### **Paper.js Vector Export Benefits:**
```javascript
// ✅ ADVANTAGE: Vectors scale perfectly
// Paper.js handles high-resolution automatically since it's vector-based
window.renderHighResolution = function(targetCanvas, scale) {
    targetCanvas.width = paper.view.size.width * scale;
    targetCanvas.height = paper.view.size.height * scale;
    
    const ctx = targetCanvas.getContext('2d');
    ctx.scale(scale, scale);
    
    // Re-export vector content at higher resolution
    paper.view.draw();
};
```

### **🛠️ Library CDN Integration Template:**

```html
<!-- Add to index.html head section -->
<!-- GSAP for Animations -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<!-- p5.js for Creative Coding -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>

<!-- Paper.js for Vector Graphics -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.17/paper-full.min.js"></script>

<!-- Three.js for 3D Graphics -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- Chart.js for Data Visualization -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
```

### **🎯 AI Agent Library Selection Checklist:**

Before choosing a library, ask:
- [ ] **Does the user want animations?** → GSAP or p5.js
- [ ] **Does the user want 3D graphics?** → Three.js + `preserveDrawingBuffer: true`
- [ ] **Does the user want vector graphics?** → Paper.js  
- [ ] **Does the user want data charts?** → Chart.js
- [ ] **Does the user want creative/generative art?** → p5.js
- [ ] **Does the user want simple drawing/image editing?** → HTML5 Canvas

### Library Integration Examples:

#### For p5.js tools:
```javascript
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('chatooly-canvas'); // CRITICAL: Put canvas in export container
}
```

#### For Three.js tools:
```javascript
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600);
document.getElementById('chatooly-canvas').appendChild(renderer.domElement);
```

#### For regular canvas (MANDATORY STRUCTURE):
```html
<!-- REQUIRED: Use this exact structure -->
<div id="chatooly-container">
    <canvas id="chatooly-canvas" width="800" height="600"></canvas>
</div>
```

```javascript
// JavaScript setup - MUST use chatooly-canvas ID
const canvas = document.getElementById('chatooly-canvas');
const ctx = canvas.getContext('2d');
```

🚨 **CRITICAL**: 
- Container MUST be `id="chatooly-container"`
- Canvas MUST be `id="chatooly-canvas"`
- This structure prevents publishing issues

#### For DOM-based tools:
```html
<div id="chatooly-canvas">
    <div class="design-output">
        <!-- Visual elements here -->
    </div>
</div>
```

### ❌ WHAT NOT TO PUT IN #chatooly-canvas:
```html
<!-- DON'T DO THIS - UI controls should be outside -->
<div id="chatooly-canvas">
    <canvas id="myCanvas"></canvas>
    <button>Download</button>  <!-- NO! -->
    <div class="controls">     <!-- NO! -->
        <input type="range">   <!-- NO! -->
    </div>
</div>

<!-- DON'T DO THIS - decorative elements -->
<div id="chatooly-canvas">
    <div class="fancy-border">  <!-- NO! -->
        <canvas id="myCanvas"></canvas>
        <div class="watermark">Made with MyTool</div>  <!-- NO! -->
    </div>
</div>
```

### ✅ CORRECT WAY:
```html
<!-- Controls outside export container -->
<div class="controls">
    <button>Download</button>
    <input type="range">
</div>

<!-- Only visual content inside -->
<div id="chatooly-canvas">
    <canvas id="myCanvas"></canvas>
</div>
```

## Step 5: Testing & Viewing
Tell the user:
- Make sure you're in the project root folder (where package.json is located)
- Run `npm run dev` to start the local server
- If the command fails, navigate to the correct folder first
- Open http://localhost:8000 to see your tool
- The export button (📥) appears automatically in the bottom-right corner
- Click it to test PNG export at different resolutions (1x, 2x, 4x)

## Step 6: Saving Your Progress with Git

### Why Use Git?
Since the user cloned this template from GitHub, they already have git set up! Git lets them:
- Save snapshots of their work at any point
- Go back to earlier versions if something breaks
- Push changes back to their GitHub repository
- Keep their work safe in the cloud

### The Git Setup is Already Done!
The user's project is already connected to their GitHub repository because they cloned the template. They can start saving right away!

### Saving Work Locally (do this regularly):
```bash
git add .  # Stage your changes
git commit -m "Added new feature"  # Save a snapshot with a description
```

### Pushing to GitHub (to backup in the cloud):
```bash
git push  # Send your latest commits to GitHub
```

That's it! Since they cloned the template, the connection to GitHub is already set up.

### When to Save with Git:
Tell the user to commit their work:
- After getting something working
- Before making big changes
- At the end of each coding session
- Before publishing to Chatooly

### Simple Git Workflow for Beginners:
1. Make changes to your tool
2. Test that it works
3. Save with git:
   ```bash
   git add .
   git commit -m "Describe what you changed"
   git push  # If you have GitHub set up
   ```

## Step 7: Publishing
When the user is ready to publish, explain:
1. First, save your work with git: `git add . && git commit -m "Ready to publish"`
2. Make sure the tool is running locally (`npm run dev`)
3. Click the export button (📥) in the bottom-right corner
4. Select "📤 Publish" from the menu (only available in development mode)
5. Enter your tool name when prompted
6. The tool uploads to staging for review
7. After approval, it goes live at `tools.chatooly.com/[tool-name]`

## Step 8: Iteration
After initial build:
- Remind user to save progress: `git add . && git commit -m "Description of changes"`
- Ask "What would you like to change or add?"
- **BEFORE making changes: Review .cursorrules file**
- Make adjustments based on feedback
- **AFTER making changes: Verify all Chatooly rules are still followed**
- Always test export functionality after changes
- Ensure tool works well at different screen sizes
- Encourage regular git commits after each successful change

## 🔴 VERIFICATION AFTER EVERY CHANGE
After ANY code modification, check:
1. **Canvas Resize Handling**: Is the resize event listener implemented?
2. **Mouse Coordinate Mapping**: Are you using `mapMouseToCanvas()` for mouse events?
3. **Export Container**: Is all visual content still inside #chatooly-canvas?
4. **CDN Script**: Is the CDN script intact?
5. **Export Button**: Does the export button still work?
6. **Console Errors**: Are there any console errors?
7. **Export Quality**: Does the tool still export correctly?
8. **Aspect Ratio Test**: Test changing aspect ratios - does content stay in place?

If any check fails, immediately fix it before proceeding!

## 🎨 CSS Styling with CDN v2.0 (NEW!)

### ✅ AUTOMATICALLY STYLED ELEMENTS
These HTML elements get the Chatooly design system automatically (no classes needed):

```html
<!-- Form Controls - Automatically styled -->
<input type="text" placeholder="Enter text">     <!-- ✅ Dark theme input -->
<input type="range" min="0" max="100">           <!-- ✅ Dark theme slider -->
<input type="color" value="#ff0000">             <!-- ✅ Dark theme color picker -->
<select><option>Option 1</option></select>       <!-- ✅ Dark theme dropdown -->
<textarea placeholder="Description"></textarea>   <!-- ✅ Dark theme textarea -->
<button>Click Me</button>                        <!-- ✅ Dark theme button -->

<!-- Typography - Automatically styled -->
<h1>Tool Title</h1>                             <!-- ✅ Lucida Console font -->
<h2>Section Title</h2>                          <!-- ✅ Proper sizing -->
<p>Description text</p>                          <!-- ✅ White text on dark -->
<label>Input Label</label>                       <!-- ✅ Consistent labels -->
```

### 🎨 ENHANCED CHATOOLY CLASSES (Optional)
Use these for additional styling options:

```html
<!-- Button Variants -->
<button class="btn-secondary">Secondary</button>
<button class="btn-success">Success</button>
<button class="btn-danger">Delete</button>
<button class="btn-outline">Outline Style</button>

<!-- Layout Classes -->
<div class="chatooly-app-container">             <!-- Full app layout -->
<div class="chatooly-controls-panel">            <!-- Left sidebar -->
<div class="chatooly-preview-panel">             <!-- Right canvas area -->
<div class="chatooly-control-group">             <!-- Control wrapper -->

<!-- Utility Classes -->
<p class="chatooly-text-muted">Muted text</p>
<p class="chatooly-text-small">Small text</p>
<div class="chatooly-mt-3">Add margin top</div>
<div class="chatooly-p-2">Add padding</div>
```

### 🔧 CUSTOM STYLING (Use CSS Variables)
When you need custom styles, use Chatooly CSS variables for consistency:

```css
/* ✅ GOOD: Uses design system variables */
.my-special-button {
  background: var(--chatooly-color-primary);
  color: var(--chatooly-color-text);
  border: var(--chatooly-border-width) solid var(--chatooly-color-border);
  border-radius: var(--chatooly-border-radius);
  padding: var(--chatooly-spacing-2) var(--chatooly-spacing-4);
  font-family: var(--chatooly-font-family);
}

/* ❌ BAD: Hard-coded values break theme consistency */
.my-button {
  background: #ff0000;        /* Won't match theme */
  color: blue;               /* Wrong text color */
  font-family: Arial;        /* Wrong font */
}
```

### 📋 LIVE CSS REFERENCE - CHECK BEFORE EVERY STYLING CHANGE

🚨 **MANDATORY: Check these ACTIVE links before making ANY styling decisions:**

🔗 **[LIVE CSS Variables](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css)** - All colors, fonts, spacing, breakpoints
🔗 **[LIVE Components](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css)** - Buttons, forms, cards, tabs, dropdowns  
🔗 **[LIVE Base Styles](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/base.css)** - Typography, forms, universal styling
🔗 **[LIVE Layout Classes](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/layouts/sidebar.css)** - Sidebar, responsive grid, containers

**🔗 Complete Variable List:** [View all CSS variables](https://github.com/yaelren/chatooly-cdn/blob/main/css/variables.css)

The CDN provides 100+ CSS variables for consistent styling. Most commonly used:

```css
/* Most commonly used variables */
--chatooly-color-text: #ffffff           /* Main text color */
--chatooly-color-background: #2b2b2b     /* Page background */
--chatooly-color-border: #ffffff         /* Borders */
--chatooly-color-primary: #007bff        /* Accent color */

--chatooly-font-family: 'Lucida Console', Monaco, monospace
--chatooly-font-size-base: 14px          /* Default text size */

--chatooly-spacing-2: 8px                /* Small spacing */
--chatooly-spacing-3: 12px               /* Medium spacing */
--chatooly-spacing-4: 16px               /* Large spacing */

--chatooly-border-radius: 0px            /* Sharp corners */
--chatooly-border-width: 2px             /* Standard border */
```

**📖 View Complete CSS Source Files:**
- [variables.css](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css) - All design variables (LIVE LINK)
- [base.css](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/base.css) - Element styling (LIVE LINK)
- [components.css](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css) - UI components (LIVE LINK)

### ⚡ AUTOMATIC STYLING ACTIVATION
The CDN automatically injects styles when you include the script:

```html
<!-- This script automatically styles your entire page -->
<script src="https://yaelren.github.io/chatooly-cdn/js/core.min.js"></script>
```

### 🎯 STYLING EXAMPLE
Here's how to build a tool with consistent styling:

```html
<!-- Controls (automatically styled) -->
<div class="controls-section">
  <h2>Settings</h2>
  <div class="chatooly-control-group">
    <label>Background Color</label>
    <input type="color" id="bgColor" value="#000000">
  </div>
  <div class="chatooly-control-group">
    <label>Size</label>
    <input type="range" id="size" min="10" max="100" value="50">
  </div>
  <button id="generateBtn">Generate</button>
</div>

<!-- Canvas (put visual output here) -->
<div id="chatooly-canvas">
  <canvas id="myCanvas" width="800" height="600"></canvas>
</div>
```

All inputs, buttons, and text will automatically use the dark Chatooly theme!

## What Chatooly Handles Automatically:
- ✅ **Design System Injection** - Dark theme, fonts, colors applied automatically
- ✅ **Canvas Resize Events** - Dispatches `chatooly:canvas-resized` with scale info
- ✅ **Mouse Coordinate Utilities** - `Chatooly.utils.mapMouseToCanvas()` 
- ✅ **Zoom/Pan Controls** - Ctrl+scroll to zoom, **spacebar + drag** to pan (no conflicts)
- ✅ **Automatic Scrollbars** - Appear when zoomed content exceeds canvas area
- ✅ **Smart Export Detection** - Automatically finds the best export target using priority order:
  1. `canvas#chatooly-canvas` (HIGHEST PRIORITY - direct canvas export)
  2. Canvas inside `div#chatooly-canvas` (finds any canvas inside)  
  3. Largest standalone canvas element
  4. DOM containers as fallback
- ✅ Export button creation and positioning
- ✅ PNG export at multiple resolutions
- ✅ **Video export** (MP4/WebM/MKV) using MediaRecorder API
- ✅ File downloads
- ✅ Publishing workflow
- ✅ Staging upload (in dev mode)

## What You Must Ensure:
- 🚨 **Canvas resize event handling** - Listen for `chatooly:canvas-resized` event
- 🚨 **Proper mouse coordinate mapping** - Use `mapMouseToCanvas()` for all mouse events
- 🚨 **Interactive element scaling** - Scale points/shapes when canvas resizes
- ✅ All visual content is inside `#chatooly-canvas`
- ✅ Only visual content (no UI controls or decorative elements) is inside `#chatooly-canvas`
- ✅ ChatoolyConfig is properly configured
- ✅ Canvas/visual area is at least 800x600px
- ✅ Tool works on both desktop and mobile
- ✅ Export produces the expected visual output (no unwanted UI elements)

## Common Issues & Solutions:

### **🎯 Canvas Export Issues (MOST COMMON)**
- **Export shows blank/background instead of canvas?** 
  - ✅ **SOLUTION**: Use `<canvas id="chatooly-canvas">` directly for highest export priority
  - ❌ **AVOID**: `<canvas id="my-canvas">` inside `<div id="chatooly-canvas">` 
  - ❌ **AVOID**: Canvas with `display: none` during export
- **Export has wrong proportions?** 
  - ✅ **SOLUTION**: Remove wrapper divs, use direct canvas structure
  - ❌ **AVOID**: Multiple nested containers around canvas

### **🔄 Canvas Resize & Interaction Issues**
- **Image disappears when changing aspect ratios?** Missing canvas resize event handling - implement the code from top of this file
- **Mouse clicks don't align with canvas?** Not using `mapMouseToCanvas()` - use proper coordinate mapping
- **Interactive elements jump to wrong positions?** Not scaling elements on resize - implement scaling in `onCanvasResized()`
- **Pan conflicts with canvas interactions?** CDN now requires **spacebar + click** to pan when zoomed - canvas interactions work normally without spacebar

### **🎨 General Export Issues**
- **No scrollbars when zoomed?** Scrollbars appear automatically when content exceeds canvas area bounds
- **No export button?** Check if CDN script loaded, verify no JS errors
- **Export is blank?** Ensure content is inside `#chatooly-canvas`
- **Export has unwanted UI elements?** Make sure only visual content is inside `#chatooly-canvas` - move controls outside
- **"Insecure connection" error during export?** Normal when running locally on HTTP - exports still work, just ignore the console warning
- **Button in wrong position?** Adjust `buttonPosition` in ChatoolyConfig
- **Publishing not available?** Must be running on localhost (dev mode)

## Development Flow:
1. Update config file first
2. Add HTML controls based on user needs
3. **Implement canvas resize handling** (if using interactive canvas)
4. **Use proper mouse coordinate mapping** (for all mouse events)
5. Implement functionality in main.js
6. **Implement `window.renderHighResolution()` function** (for quality exports)
7. Style with CSS as needed
8. **Test with different aspect ratios** (HD, Square, Portrait, etc.)
9. **Test export functionality works** (1x, 2x, 4x resolutions)
10. Keep asking user for feedback and iterate

Remember: The Chatooly CDN handles all export and publishing functionality automatically. Focus on building the tool's core functionality and ensuring all visual content is properly contained within the export container.

## 🎯 FINAL CHECKLIST FOR AI AGENTS:
Before completing any tool implementation, verify:

### **🎨 Canvas Setup & Export**
- [ ] **Canvas ID**: Use `<canvas id="chatooly-canvas">` for direct export (RECOMMENDED)
- [ ] **Canvas Structure**: Avoid nested wrappers around canvas that affect export
- [ ] **High-Res Function**: Implemented `window.renderHighResolution(targetCanvas, scale)` 
- [ ] **Export Test**: Verify exported image shows canvas content, not background
- [ ] **Quality Test**: Test 1x, 2x, 4x exports - high-res should be crisp, not pixelated

### **🔄 Canvas Interactions**
- [ ] Canvas resize event listener added
- [ ] Mouse coordinate mapping implemented  
- [ ] Interactive elements scale properly on resize
- [ ] All visual content in export container
- [ ] Export button works at all aspect ratios

### **🧪 Final Validation**
- [ ] No console errors during export
- [ ] Tool tested with HD, Square, and Portrait modes
- [ ] High-res export produces sharp, detailed images
- [ ] Tool handles edge cases (no data, initialization states)