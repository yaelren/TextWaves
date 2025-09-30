# Core Chatooly Development Rules

## 🚨 MANDATORY DEVELOPMENT RULES

### Critical Rules Claude Code MUST Follow:

1. **EXPORT CONTAINER RULE** (MOST IMPORTANT)
   - ALL visual content MUST be inside `<div id="chatooly-canvas">`
   - NEVER create visual elements outside this container
   - NEVER rename or remove the #chatooly-canvas ID

2. **CDN SCRIPT RULE**
   - NEVER modify: `<script src="https://yaelren.github.io/chatooly-cdn/js/core.min.js"></script>`
   - This handles all export and publishing functionality
   - Auto-updates when CDN is updated

3. **EXPORT BUTTON RULE**
   - NEVER create custom export buttons
   - CDN automatically adds the export button
   - Position controlled by `buttonPosition` in config

4. **CANVAS SIZE RULE**
   - Visual area minimum 800x600px
   - Must be responsive for mobile

5. **CSS VARIABLE RULE**
   - ALWAYS use Chatooly CSS variables
   - NEVER hardcode colors/fonts/spacing
   - Check live CSS before ANY styling change

### Verification After EVERY Change:
✓ All visual content inside #chatooly-canvas
✓ CDN script intact and loading
✓ Export button appears correctly
✓ Tool exports properly
✓ No JavaScript console errors
✓ Mobile responsive

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