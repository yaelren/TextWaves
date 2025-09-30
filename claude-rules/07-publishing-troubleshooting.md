# Publishing & Troubleshooting

## 🚀 Publishing Your Tool

1. **Save with Git**
   ```bash
   git add .
   git commit -m "Ready to publish"
   git push
   ```

2. **Test Locally**
   ```bash
   npm run dev
   # Open http://localhost:8000
   ```

3. **Publish via CDN**
   - Click export button (📥) in bottom-right
   - Select "📤 Publish" from menu
   - Enter tool name
   - Tool uploads to staging
   - After approval: live at `tools.chatooly.com/[tool-name]`

## 🔴 Common Issues & Solutions

### Canvas Export Issues
- **Blank export?** → Ensure `id="chatooly-canvas"`
- **Wrong proportions?** → Remove wrapper divs
- **Pixelated export?** → Implement proper high-res function

### Interaction Issues
- **Content disappears on resize?** → Add resize event handler
- **Mouse clicks misaligned?** → Use `mapMouseToCanvas()`
- **Elements jump positions?** → Implement scaling in resize handler

### Development Issues
- **No export button?** → Check CDN script loaded
- **Publishing unavailable?** → Must run on localhost
- **Console errors?** → Check browser developer tools

## 🛠️ Claude Code Best Practices

### Task Management
Claude Code uses TodoWrite to track all tasks:
```
✅ Configuration updated
🔄 Building main functionality
⏳ Testing exports
```

### Multi-File Operations
Claude Code uses efficient tools:
- **MultiEdit** for multiple file changes
- **Parallel operations** for independent tasks
- **MCP servers** for specialized functionality

### Error Handling
Claude Code automatically:
- Validates changes before execution
- Tests functionality after implementation
- Runs lint/typecheck when available
- Provides detailed error messages

## 💡 Quick Tips for Claude Code Users

1. **Start Simple**: Build MVP first, then iterate
2. **Use TodoWrite**: Track all tasks systematically
3. **Test Often**: Export at each milestone
4. **Save Progress**: Regular git commits
5. **Ask for Help**: Claude Code can explain any aspect