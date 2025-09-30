# High-Resolution Export Implementation

## 🔥 HIGH-RESOLUTION EXPORT (MANDATORY)

All tools MUST implement `window.renderHighResolution()` for quality exports:

```javascript
window.renderHighResolution = function(targetCanvas, scale) {
    // Validate tool state
    if (!yourTool || !yourTool.isInitialized) {
        console.warn('Tool not ready for high-res export');
        return;
    }
    
    // Set up high-res canvas
    const ctx = targetCanvas.getContext('2d');
    targetCanvas.width = yourTool.canvas.width * scale;
    targetCanvas.height = yourTool.canvas.height * scale;
    
    // Clear and re-render at high resolution
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    
    // Tool-specific high-res rendering here
    // Re-create content from source data, not copy pixels
    
    console.log(`High-res export completed at ${scale}x resolution`);
};
```

## ✅ Export Verification Checklist

### Canvas & Export
- [ ] Canvas uses `id="chatooly-canvas"`
- [ ] High-res export function implemented
- [ ] Exports work at 1x, 2x, 4x resolutions
- [ ] Visual content properly contained

### Testing
- [ ] Works in HD, Square, Portrait modes
- [ ] Export button visible and functional
- [ ] Publishing workflow available in dev mode

### Common Export Issues
- **Blank export?** → Ensure `id="chatooly-canvas"`
- **Wrong proportions?** → Remove wrapper divs
- **Pixelated export?** → Implement proper high-res function