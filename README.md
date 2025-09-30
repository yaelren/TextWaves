# Chatooly Tool Template

**Build web tools with AI assistance - No coding experience needed!**

## 📋 Table of Contents

- [🚀 Quick Start (3 Simple Steps)](#-quick-start-3-simple-steps)
  - [Step 1: Get the Template](#step-1-get-the-template)
  - [Step 2: Open Your Project Files](#step-2-open-your-project-files)
  - [Step 3: Start Building with AI](#step-3-start-building-with-ai)
- [🎨 Testing Your Tool](#-testing-your-tool)
- [💾 Saving Your Progress with Git](#-saving-your-progress-with-git)
- [📤 Publishing Your Tool](#-publishing-your-tool)
- [📚 Want to Know More?](#-want-to-know-more)
  - [Manual Setup Options](#manual-setup-options)
  - [Understanding the Files](#understanding-the-files)
  - [Manual Editing (Advanced)](#manual-editing-advanced)
  - [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start (3 Simple Steps)

### Step 1: Get the Template

Choose one option below:

#### Option A: Download Without Git (Easiest for Beginners)
**What's this?** Simply download the files like any other download - no special tools needed!

1. Go to https://github.com/yaelren/chatooly-template
2. Click the green **Code** button
3. Click **Download ZIP**
4. Extract the ZIP to your desired folder
5. Rename the folder from `chatooly-template-main` to your project name (e.g., `my-tool`)
6. **Open this folder in your IDE** (Cursor or Visual Studio Code)

#### Option B: Clone with Git (Better for Updates)
**What's Git?** A tool that tracks changes to your code and makes it easy to save/share your work. Like Google Docs version history, but for code!

1. **Create a folder** for your projects (e.g., on your Desktop or Documents)
2. **Open that folder in your IDE** (Cursor or Visual Studio Code)
   - File → Open Folder → Select the folder you just created
3. **Open the terminal** in your IDE (Terminal → New Terminal)
4. **Choose how to clone:**

**Option 1: Clone into current folder** (if you already created an empty project folder)
```bash
git clone https://github.com/yaelren/chatooly-template.git .
```

**Option 2: Clone into a new subfolder** (creates a new folder with your chosen name)
```bash
git clone https://github.com/yaelren/chatooly-template.git my-tool
cd my-tool
```
**Important:** Replace `my-tool` with your own project name (e.g., `fisheye-tool`, `color-picker`)

**If you used Option 2:** You created a subfolder, so you need to open it:
- In your IDE: **File → Open Folder** → Select the `my-tool` folder you just created

### Step 2: Open Your Project Files

1. **Open the file viewer** in your IDE to see all the files in your folder
   - In Cursor/VS Code: Look at the left sidebar
   - You should see your project files like `index.html`, `styles.css`, etc.

### Step 3: Start Building with AI

#### For Cursor Users:
1. **Find the `START_HERE.md` file** in your file viewer
2. **Drag and drop** the `START_HERE.md` file into the Cursor Chat window
3. **Type:** "Let's start building" 
4. **Answer the AI's questions** and watch it build your tool!

#### For Claude Code Users:
1. **Open your terminal** in the chatooly-template folder
2. **Type to Claude Code:** "Let's start building a Chatooly tool"
3. **Answer the questions** Claude Code asks you
4. **Describe your tool idea** when prompted
5. **Watch Claude Code build** your tool automatically!

Claude Code will automatically read the CLAUDE.md file and follow all the proper Chatooly development rules.

## 🎨 Testing Your Tool

Once AI builds your tool:
1. Run `npm run dev` in terminal
2. Open http://localhost:8000 in your browser
3. Test your tool and the export button (📥)
4. Ask AI to make any changes you want!

## 💾 Saving Your Progress with Git

**Good news:** Your project is already set up with Git since you cloned it from GitHub!

### Save Your Work (Do This Often!)
```bash
git add .                   # Stage your changes
git commit -m "What you changed"  # Save a snapshot
git push                    # Back up to GitHub
```

That's it! No setup needed - just save and push.

### When to Save?
- ✅ After getting a feature working
- ✅ Before trying something new
- ✅ End of each coding session
- ✅ Before publishing to Chatooly

**Pro tip:** Think of git commits like save points in a video game - save often so you can always go back if needed!

## 📤 Publishing Your Tool

When you're happy with your tool:
1. Save your work first: `git add . && git commit -m "Ready to publish"`
2. Click the export button (📥) in bottom-right
3. Select "📤 Publish"
4. Enter your tool name
5. Your tool goes live at `tools.chatooly.com/your-tool`!

---

## 📚 Want to Know More?

<details>
<summary><b>Manual Setup Options</b></summary>

### Alternative ways to start the server:

**Python:**
```bash
python3 -m http.server 8000
```

**Node.js:**
```bash
npm install -g http-server
http-server -p 8000
```

**VS Code Live Server:**
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
</details>

<details>
<summary><b>Understanding the Files</b></summary>

```
my-tool/
├── START_HERE.md          # Instructions for AI
├── index.html             # Your tool's structure
├── styles.css             # How it looks
├── js/
│   ├── main.js           # How it works
│   └── chatooly-config.js # Tool settings
└── package.json          # Project setup
```
</details>

<details>
<summary><b>Manual Editing (Advanced)</b></summary>

If you want to edit files yourself:

1. **Config**: Edit `js/chatooly-config.js` for tool name and info
2. **Controls**: Add HTML controls in `index.html`
3. **Logic**: Write JavaScript in `js/main.js`
4. **Styles**: Customize appearance in `styles.css`

Remember: Keep visual content inside `#chatooly-canvas` div!
</details>

<details>
<summary><b>Troubleshooting</b></summary>

- **No export button?** Check if server is running
- **Export is blank?** Content must be in `#chatooly-canvas`
- **Can't publish?** Must run locally first (`npm run dev`)
- **Need help?** [Create an issue](https://github.com/yaelren/chatooly-template/issues)
</details>

---

**Built with ❤️ by Yael Renous - Studio Video**