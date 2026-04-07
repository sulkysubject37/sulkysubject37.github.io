/**
 * SULKY_OS v3.0 // THE ENTANGLED KERNEL
 */

const SulkyOS = {
    state: {
        activeSection: 'profile',
        isBooted: false,
        isCruelMode: false,
        terminalHistory: [
            "SULKY_OS v3.0.1_STABLE",
            "Type 'help' for available commands."
        ]
    },

    init() {
        this.runBootSequence();
        this.setupGraph();
        this.setupEventListeners();
        this.updateClock();
    },

    runBootSequence() {
        const progress = document.getElementById('boot-progress');
        const log = document.getElementById('boot-log');
        const overlay = document.getElementById('boot-overlay');
        const messages = ["INIT_KERNEL", "MOUNT_REGISTRY", "LOAD_GRAPH", "SYSTEM_READY"];
        let i = 0;
        const interval = setInterval(() => {
            if (i < messages.length) {
                const entry = document.createElement('div');
                entry.textContent = `[OK] ${messages[i]}`;
                log.appendChild(entry);
                progress.style.width = `${(i + 1) * 25}%`;
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => { overlay.style.display = 'none'; this.state.isBooted = true; this.injectContent('profile'); }, 500);
                }, 500);
            }
        }, 150);
    },

    setupGraph() {
        const canvas = document.getElementById('graph-canvas');
        const context = canvas.getContext('2d');
        const updateSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        updateSize();

        const nodes = [{ id: 'me', label: 'MD. ARSHAD', group: 'core' }, ...portfolioData.projects.map(p => ({ id: p.title, label: p.title, group: 'project' }))];
        const links = [];
        portfolioData.projects.forEach(p => links.push({ source: 'me', target: p.title }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(200))
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(canvas.width / 2 + 140, canvas.height / 2))
            .on("tick", () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.strokeStyle = this.state.isCruelMode ? "#00ff4115" : "#1a1a1810";
                links.forEach(d => { context.moveTo(d.source.x, d.source.y); context.lineTo(d.target.x, d.target.y); });
                context.stroke();
                nodes.forEach(d => {
                    context.beginPath();
                    context.fillStyle = this.state.isCruelMode ? "#00ff4133" : "#1a1a1822";
                    context.arc(d.x, d.y, 2, 0, 2 * Math.PI);
                    context.fill();
                });
            });

        window.addEventListener('resize', () => { updateSize(); simulation.force("center", d3.forceCenter(canvas.width / 2 + 140, canvas.height / 2)).alpha(0.3).restart(); });
    },

    toggleMode() {
        this.state.isCruelMode = !this.state.isCruelMode;
        document.body.classList.toggle('cruel-mode', this.state.isCruelMode);
        const btn = document.getElementById('mode-toggle');
        btn.textContent = this.state.isCruelMode ? '[ SHIFT_TO_NORMAL ]' : '[ SHIFT_TO_CRUEL ]';
        this.logEvent(`SYSTEM_MODE_CHANGE: ${this.state.isCruelMode ? 'CRUEL' : 'NORMAL'}`);
        this.injectContent(this.state.activeSection);
    },

    injectContent(section) {
        this.state.activeSection = section;
        const surface = document.getElementById('text-surface');
        const pathDisplay = document.getElementById('active-path');
        surface.innerHTML = '';
        pathDisplay.textContent = `~/${section}.${section === 'blog' ? 'log' : section === 'projects' ? 'bin' : 'man'}`;

        this.logEvent(`READ_BLOCK: 0x0 -> ${section}`);

        if (section === 'profile') {
            this.renderProse(surface, `
[TYPE: header] ${portfolioData.about.name}
[TYPE: metadata] ${portfolioData.about.title} // ${portfolioData.about.location}
[TYPE: space]
[TYPE: body-text] ${this.state.isCruelMode ? portfolioData.about.cruelBio : portfolioData.about.bio}
            `);
        } else if (section === 'projects') {
            this.renderProse(surface, "[TYPE: header] PROJECTS.bin");
            portfolioData.projects.forEach(p => {
                this.renderProse(surface, `
[TYPE: section-label] ${p.title}
[TYPE: metadata] ${p.tech} // <a href="${p.link}" target="_blank" style="color:inherit">LINK</a>
[TYPE: body-text] ${p.description}
${this.state.isCruelMode ? `[TYPE: data-node] ${p.cruelDescription}` : ''}
[TYPE: space]
                `);
            });
        } else if (section === 'blog') {
            this.renderProse(surface, "[TYPE: header] BLOG.log");
            portfolioData.posts.forEach(p => {
                const card = document.createElement('div');
                card.className = 'blog-card';
                card.innerHTML = `
                    <div class="section-label">${p.date}</div>
                    <div class="body-text" style="font-weight:700; font-size:1.4rem;">${p.title}</div>
                    <div class="body-text">${p.summary}</div>
                    <a href="${p.link}" class="read-btn">Read Entry</a>
                `;
                surface.appendChild(card);
            });
        } else if (section === 'terminal') {
            this.injectTerminal(surface);
        } else if (section === 'experience') {
            this.renderProse(surface, "[TYPE: header] EXPERIENCE.log");
            portfolioData.experience.forEach(e => {
                this.renderProse(surface, `[TYPE: section-label] ${e.duration} // ${e.role}\n[TYPE: metadata] ${e.company}\n[TYPE: body-text] ${e.description}\n[TYPE: space]`);
            });
        } else if (section === 'education') {
            this.renderProse(surface, "[TYPE: header] EDUCATION.edu");
            portfolioData.education.forEach(e => {
                this.renderProse(surface, `[TYPE: section-label] ${e.duration} // ${e.degree}\n[TYPE: metadata] ${e.institution}\n[TYPE: body-text] ${e.details}\n[TYPE: space]`);
            });
        } else if (section === 'skills') {
            this.renderProse(surface, `
[TYPE: header] SKILLS.sys
[TYPE: section-label] STACK_INVENTORY
[TYPE: body-text] ${portfolioData.skills.join(' // ')}
[TYPE: space]
[TYPE: section-label] INTEREST_VECTOR
[TYPE: body-text] ${portfolioData.interests.join(' // ')}
            `);
        } else if (section === 'publications') {
            this.renderProse(surface, "[TYPE: header] PUBLICATIONS.bib");
            portfolioData.publications.forEach(pub => { this.renderProse(surface, `[TYPE: section-label] BIB_ENTRY\n[TYPE: body-text] ${pub}\n[TYPE: space]`); });
        } else if (section === 'contact') {
            this.renderProse(surface, `[TYPE: header] CONTACT.sh\n[TYPE: section-label] COMMUNICATION_CHANNELS\n[TYPE: metadata] EMAIL: ${portfolioData.about.email}\n[TYPE: space]\n[TYPE: section-label] SOCIAL_NODES\n[TYPE: body-text] GITHUB: ${portfolioData.about.social.github}<br>LINKEDIN: ${portfolioData.about.social.linkedin}<br>TWITTER: ${portfolioData.about.social.twitter}<br>HASHNODE: ${portfolioData.about.social.blog}`);
        } else if (section === 'network') {
            this.renderProse(surface, "[TYPE: header] NETWORK.gml\n[TYPE: section-label] SYSTEMS_BIOLOGY_GRAPH");
            this.renderInteractiveNetwork(surface);
        }
    },

    injectTerminal(container) {
        const term = document.createElement('div');
        term.className = 'terminal-block';
        term.innerHTML = `
            <div class="terminal-output" id="term-out"></div>
            <div class="terminal-input-wrap">
                <input type="text" id="term-input" spellcheck="false" autofocus>
            </div>
        `;
        container.appendChild(term);

        const input = document.getElementById('term-input');
        const output = document.getElementById('term-out');

        this.state.terminalHistory.forEach(line => this.addTerminalLine(output, line));

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim().toLowerCase();
                this.addTerminalLine(output, cmd, true);
                this.handleTerminalCommand(cmd, output);
                input.value = '';
                output.scrollTop = output.scrollHeight;
            }
        };
        
        term.onclick = () => input.focus();
    },

    addTerminalLine(container, text, isCmd = false) {
        const line = document.createElement('div');
        line.className = isCmd ? 'terminal-line cmd' : 'terminal-line';
        line.textContent = text;
        container.appendChild(line);
    },

    handleTerminalCommand(cmd, output) {
        if (cmd === 'help') {
            this.addTerminalLine(output, "Available: ls, clear, status, mode, whoami");
        } else if (cmd === 'ls') {
            this.addTerminalLine(output, "Files: profile.man, projects.bin, skills.sys, blog.log");
        } else if (cmd === 'clear') {
            output.innerHTML = '';
        } else if (cmd === 'whoami') {
            this.addTerminalLine(output, "User: SulkySubject37 // Role: System Engineer");
        } else if (cmd === 'status') {
            this.addTerminalLine(output, `Kernel: v3.0.1 // Mode: ${this.state.isCruelMode ? 'CRUEL' : 'NORMAL'}`);
        } else if (cmd === 'mode') {
            this.toggleMode();
            this.addTerminalLine(output, `System shifted to ${this.state.isCruelMode ? 'CRUEL' : 'NORMAL'} mode.`);
        } else if (cmd) {
            this.addTerminalLine(output, `Command not found: ${cmd}`);
        }
    },

    renderProse(container, source) {
        source.trim().split('\n').forEach(block => {
            const trimmed = block.trim();
            if (!trimmed) return;
            let type = 'body-text', text = trimmed;
            if (trimmed.startsWith('[TYPE:')) {
                const match = trimmed.match(/\[TYPE:\s*([^\]]+)\](?:\s*(.*))?/);
                if (match) { type = match[1].toLowerCase(); text = match[2] || ''; }
            }
            const el = document.createElement('div');
            el.className = type;
            if (type !== 'space') el.innerHTML = text;
            container.appendChild(el);
        });
    },

    renderInteractiveNetwork(container) {
        const netDiv = document.createElement('div'); netDiv.id = 'interactive-network'; container.appendChild(netDiv);
        const width = netDiv.offsetWidth, height = 600;
        const svg = d3.select("#interactive-network").append("svg").attr("width", "100%").attr("height", height).call(d3.zoom().on("zoom", (e) => g.attr("transform", e.transform)));
        const g = svg.append("g");
        const nodes = [{ id: 'me', label: 'MD. ARSHAD', group: 'core', val: 10 }, ...portfolioData.projects.map(p => ({ id: p.title, label: p.title, group: 'project', val: 6 }))];
        const links = []; portfolioData.projects.forEach(p => links.push({ source: 'me', target: p.title }));
        const simulation = d3.forceSimulation(nodes).force("link", d3.forceLink(links).id(d => d.id).distance(100)).force("charge", d3.forceManyBody().strength(-300)).force("center", d3.forceCenter(width / 2, height / 2));
        const link = g.append("g").attr("stroke", this.state.isCruelMode ? "#00ff4122" : "#1a1a1822").selectAll("line").data(links).join("line");
        const node = g.append("g").selectAll("g").data(nodes).join("g").call(d3.drag().on("start", (ev, d) => { if (!ev.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }).on("drag", (ev, d) => { d.fx = ev.x; d.fy = ev.y; }).on("end", (ev, d) => { if (!ev.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));
        node.append("circle").attr("r", d => d.val).attr("fill", d => d.group === 'core' ? (this.state.isCruelMode ? "#00ff41" : "#607080") : (this.state.isCruelMode ? "#ffb000" : "#1a1a18"));
        node.append("text").text(d => d.label).attr("x", 12).attr("y", 4).attr("font-family", "IBM Plex Mono").attr("font-size", "10px").attr("fill", this.state.isCruelMode ? "#00ff4188" : "#666");
        simulation.on("tick", () => { link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y); node.attr("transform", d => `translate(${d.x},${d.y})`); });
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => { item.onclick = () => { document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active')); item.classList.add('active'); this.injectContent(item.dataset.target); document.getElementById('text-surface').scrollTop = 0; }; });
        document.getElementById('mode-toggle').onclick = () => this.toggleMode();
        window.onmousemove = (e) => { document.getElementById('coord-telemetry').textContent = `X: ${String(e.clientX).padStart(3,'0')} | Y: ${String(Math.round(document.getElementById('text-surface').scrollTop + e.clientY)).padStart(3,'0')}`; };
    },

    logEvent(msg) {
        const feed = document.getElementById('log-feed'); const entry = document.createElement('div'); const time = new Date().toTimeString().split(' ')[0];
        entry.className = 'log-entry'; entry.innerHTML = `<span class="timestamp">[${time}]</span> <span class="log-msg">${msg}</span>`; feed.prepend(entry);
    },

    updateClock() { setInterval(() => { document.getElementById('uptime-clock').textContent = new Date().toTimeString().split(' ')[0]; }, 1000); }
};

SulkyOS.init();
