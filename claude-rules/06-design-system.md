# Chatooly Design System

## 🎨 Chatooly Design System

### Automatic Styling
The CDN automatically styles all standard HTML elements:

```html
<!-- All automatically styled with dark theme -->
<input type="text" placeholder="Enter text">
<input type="range" min="0" max="100">
<input type="color" value="#ff0000">
<select><option>Option</option></select>
<button>Click Me</button>
```

### CSS Variables
Use Chatooly variables for custom styling:

```css
.custom-element {
    background: var(--chatooly-color-primary);
    color: var(--chatooly-color-text);
    border: var(--chatooly-border-width) solid var(--chatooly-color-border);
    font-family: var(--chatooly-font-family);
}
```

### Live CSS References
- [CSS Variables](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css)
- [Components](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css)
- [Base Styles](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/base.css)

### Design Principles
- Dark theme by default
- Consistent spacing and typography
- Accessible color contrast
- Mobile-responsive components
- Minimal, modern aesthetic