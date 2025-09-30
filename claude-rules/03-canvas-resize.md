# Canvas Resize & Mouse Coordinate Handling

## 🚨 CRITICAL: Canvas Resize & Mouse Coordinate Handling

**MANDATORY FOR ALL CANVAS-BASED TOOLS**: Implement proper resize event handling and mouse coordinate mapping.

### ⚡ Essential Implementation Code:

```javascript
// 1. Constructor - track dimensions
constructor() {
    this.previousCanvasSize = { width: 0, height: 0 };
}

// 2. Event listeners
setupEventListeners() {
    document.addEventListener('chatooly:canvas-resized', (e) => this.onCanvasResized(e));
}

// 3. Resize handler - scale elements
onCanvasResized(e) {
    if (!this.hasContent) return;
    
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
    
    // Scale ALL interactive elements
    this.interactiveElements.forEach(element => {
        element.x *= scaleX;
        element.y *= scaleY;
        if (element.radius) element.radius *= Math.min(scaleX, scaleY);
    });
    
    this.previousCanvasSize = { width: newWidth, height: newHeight };
    this.redrawContent();
}

// 4. Mouse coordinate mapping
onMouseClick(e) {
    const coords = window.Chatooly ? 
        window.Chatooly.utils.mapMouseToCanvas(e, this.canvas) :
        this.fallbackMouseMapping(e);
    
    const x = coords.x;
    const y = coords.y;
}

// 5. Fallback mapping
fallbackMouseMapping(e) {
    const rect = this.canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return { x: displayX * scaleX, y: displayY * scaleY };
}
```

### Common Interaction Issues
- **Content disappears on resize?** → Add resize event handler
- **Mouse clicks misaligned?** → Use `mapMouseToCanvas()`
- **Elements jump positions?** → Implement scaling in resize handler