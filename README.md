# SulkyOS // The Tangle Interface

> "Systems must fail loudly and safely." — The Cruel Standard

This is the source code for my personal portfolio, reimagined as **SulkyOS**: a web-based **Text User Interface (TUI)** designed for high-performance navigation and rigorous data presentation.

**Live Node:** [sulkysubject37.github.io](https://sulkysubject37.github.io)

## ⚡ Core Philosophy
I am a Systems Biologist and C++ Engineer. Standard web portfolios are bloated, passive, and hide the machinery. **SulkyOS** is designed to look and feel like the tools I actually build: robust, data-dense, and keyboard-centric.

## 🛠️ Features

### 1. The Tangle Layout
A 3-pane tiling window manager layout (Registry, Viewport, Telemetry) built with pure **CSS Grid**. No heavy UI frameworks. Responsive and lightweight.

### 2. Cruel Mode 💀
A toggle in the status bar that switches the interface from "Safe Mode" (recruiter-friendly) to **"Cruel Mode"**.
*   **Visuals:** Shifts accent colors from Bioluminescent Green/Blue to Hazardous Red.
*   **Data:** Replaces polished descriptions with raw engineering logs, revealing implementation details, memory management strategies, and known bugs.

### 3. Interactive Network Graph
A force-directed graph visualization of my project ecosystem, built with **D3.js**.
*   **Nodes:** Projects and Skills.
*   **Edges:** Technologies used in specific projects.
*   **Physics:** Real-time collision and charge simulation.

### 4. SulkyOS Shell (`terminal.sh`)
A fully functional mock CLI environment.
*   Try commands: `ls`, `help`, `whoami`, `cat bio.txt`, `sudo`.

### 5. God Mode (Easter Egg)
There is a hidden sequence (Konami Code) that unlocks a retro amber monochrome theme.
`↑ ↑ ↓ ↓ ← → ← → B A`

## 🔧 Tech Stack
*   **Frontend:** Vanilla JavaScript (ES6+), HTML5.
*   **Styling:** CSS3 Variables, CSS Grid, Flexbox.
*   **Visualization:** D3.js (v7).
*   **Fonts:** JetBrains Mono (Nerd Fonts patched).
*   **Build:** None. No webpack, no npm. Just raw code.

## 🚀 Deployment
Hosted on GitHub Pages.
1.  Push to `main`.
2.  Assets versioned via query params (e.g., `script.js?v=3.0.0`) for aggressive cache busting.

---
*© 2026 MD. Arshad (Sulkysubject37). MIT License.*
