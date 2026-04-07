/**
 * SULKY_OS v3.0 // THE ENTANGLED KERNEL
 * Core Engine: Architectural Prose (Pretext) + D3 Graph
 */

const SulkyOS = {
    state: {
        activeSection: 'profile',
        isBooted: false,
        isCruelMode: false,
        nodes: [],
        links: [],
        width: 0,
        height: 0
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
        const messages = ["INIT_KERNEL", "MOUNT_REGISTRY", "LOAD_GRAPH_CORE", "SYSTEM_READY"];
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
                    setTimeout(() => { 
                        overlay.style.display = 'none'; 
                        this.state.isBooted = true; 
                        this.injectContent('profile'); 
                    }, 500);
                }, 500);
            }
        }, 150);
    },

    setupGraph() {
        const canvas = document.getElementById('graph-canvas');
        const context = canvas.getContext('2d');
        const updateSize = () => { 
            this.state.width = canvas.width = window.innerWidth; 
            this.state.height = canvas.height = window.innerHeight; 
        };
        updateSize();

        const nodes = [{ id: 'me', label: 'MD. ARSHAD', group: 'core' }, ...portfolioData.projects.map(p => ({ id: p.title, label: p.title, group: 'project' }))];
        const links = [];
        portfolioData.projects.forEach(p => links.push({ source: 'me', target: p.title }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(250))
            .force("charge", d3.forceManyBody().strength(-800))
            .force("center", d3.forceCenter(this.state.width / 2 + 140, this.state.height / 2))
            .on("tick", () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.strokeStyle = this.state.isCruelMode ? "#00ff4115" : "#1a1a1810";
                links.forEach(d => { context.moveTo(d.source.x, d.source.y); context.lineTo(d.target.x, d.target.y); });
                context.stroke();
                nodes.forEach(d => {
                    context.beginPath();
                    context.fillStyle = this.state.isCruelMode ? "#00ff4133" : "#1a1a1822";
                    context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
                    context.fill();
                });
                this.state.nodes = nodes;
            });

        window.addEventListener('resize', () => { 
            updateSize(); 
            simulation.force("center", d3.forceCenter(this.state.width / 2 + 140, this.state.height / 2)).alpha(0.3).restart(); 
        });
    },

    toggleMode() {
        this.state.isCruelMode = !this.state.isCruelMode;
        document.body.classList.toggle('cruel-mode', this.state.isCruelMode);
        document.getElementById('mode-toggle').textContent = this.state.isCruelMode ? '[ SHIFT_TO_NORMAL ]' : '[ SHIFT_TO_CRUEL ]';
        this.logEvent(`SYSTEM_MODE_CHANGE: ${this.state.isCruelMode ? 'CRUEL' : 'NORMAL'}`);
        this.injectContent(this.state.activeSection);
    },

    injectContent(section) {
        this.state.activeSection = section;
        const surface = document.getElementById('text-surface');
        surface.innerHTML = '';
        document.getElementById('active-path').textContent = `~/${section}.${section === 'blog' ? 'log' : section === 'projects' ? 'bin' : 'man'}`;

        this.logEvent(`READ_BLOCK: 0x0 -> ${section}`);

        let source = "";

        if (section === 'profile') {
            source = `
[TYPE: header] ${portfolioData.about.name}
[TYPE: metadata] ${portfolioData.about.title} // ${portfolioData.about.location}
[TYPE: space]
${portfolioData.about.bio}
[TYPE: space]
${this.state.isCruelMode ? `[TYPE: section-label] CRUEL_STANDARD_MANIFESTO\n[TYPE: data-node] ${portfolioData.about.cruelBio}` : ''}
            `;
        } else if (section === 'projects') {
            source = "[TYPE: header] PROJECTS.bin\n";
            portfolioData.projects.forEach(p => {
                source += `[TYPE: section-label] ${p.title}\n[TYPE: metadata] ${p.tech}\n${p.description}\n${this.state.isCruelMode ? `[TYPE: data-node] ${p.cruelDescription}` : ''}\n[TYPE: space]\n`;
            });
        } else if (section === 'experience') {
            source = "[TYPE: header] EXPERIENCE.log\n";
            portfolioData.experience.forEach(e => {
                source += `[TYPE: section-label] ${e.duration} // ${e.role}\n[TYPE: metadata] ${e.company}\n${e.description}\n[TYPE: space]\n`;
            });
        } else if (section === 'education') {
            source = "[TYPE: header] EDUCATION.edu\n";
            this.renderArchitecturalProse(surface, source);
            portfolioData.education.forEach(e => {
                this.renderDataGrid(surface, [
                    { label: "Duration", val: e.duration },
                    { label: "Degree", val: e.degree },
                    { label: "Institution", val: e.institution },
                    { label: "Details", val: e.details }
                ]);
            });
            return;
        } else if (section === 'skills') {
            source = `[TYPE: header] SKILLS.sys\n`;
            this.renderArchitecturalProse(surface, source);
            this.renderDataGrid(surface, [
                { label: "Stack", val: portfolioData.skills.join(" // ") },
                { label: "Interests", val: portfolioData.interests.join(" // ") }
            ]);
            return;
        } else if (section === 'blog') {
            source = "[TYPE: header] BLOG.log\n";
            portfolioData.posts.forEach(p => {
                source += `[TYPE: section-label] ${p.date} // ${p.title}\n${p.summary}\n[TYPE: metadata] LINK: <a href="${p.link}" style="color:inherit" target="_blank">READ_ENTRY</a>\n[TYPE: space]\n`;
            });
        } else if (section === 'publications') {
            source = "[TYPE: header] PUBLICATIONS.bib\n";
            portfolioData.publications.forEach(pub => source += `[TYPE: section-label] BIB_ENTRY\n${pub}\n[TYPE: space]\n`);
        } else if (section === 'contact') {
            source = `[TYPE: header] CONTACT.sh\n`;
            this.renderArchitecturalProse(surface, source);
            this.renderDataGrid(surface, [
                { label: "Email", val: portfolioData.about.email },
                { label: "Github", val: portfolioData.about.social.github },
                { label: "Linkedin", val: portfolioData.about.social.linkedin },
                { label: "Twitter", val: portfolioData.about.social.twitter }
            ]);
            return;
        } else if (section === 'terminal') {
            this.injectTerminal(surface);
            return;
        }

        this.renderArchitecturalProse(surface, source);
    },

    renderArchitecturalProse(container, source) {
        const viewportWidth = container.offsetWidth;
        let currentY = container.children.length > 0 ? container.lastChild.offsetTop + container.lastChild.offsetHeight + 20 : 100;
        const LINE_HEIGHT = 28;

        source.trim().split('\n').forEach(block => {
            const trimmed = block.trim();
            if (!trimmed) { currentY += LINE_HEIGHT; return; }

            let type = 'body';
            let text = trimmed;
            if (trimmed.startsWith('[TYPE:')) {
                const match = trimmed.match(/\[TYPE:\s*([^\]]+)\](?:\s*(.*))?/);
                if (match) { type = match[1].toLowerCase(); text = match[2] || ''; }
            }

            if (type === 'space') { currentY += 40; return; }

            const font = type === 'header' ? '900 3rem "Playfair Display"' : 
                         (type === 'metadata' || type === 'section-label' || type === 'data-node') ? '0.7rem "IBM Plex Mono"' : '1.1rem "EB Garamond"';
            const lh = type === 'header' ? 60 : LINE_HEIGHT;

            const result = Pretext.layoutWithExclusion(text, viewportWidth * 0.85, font, currentY, lh, (y) => {
                const centerY = 500; // Simulated center
                const dist = Math.abs(y - centerY);
                if (dist < 150) {
                    const span = Math.sqrt(150**2 - dist**2);
                    return [(viewportWidth/2) - span, (viewportWidth/2) + span];
                }
                return null;
            });

            result.lines.forEach(l => {
                const el = document.createElement('div');
                el.className = `line ${type}`;
                el.innerHTML = l.text;
                el.style.top = `${l.y}px`;
                el.style.left = `${l.x + (viewportWidth * 0.075)}px`;
                el.style.font = font;
                container.appendChild(el);
            });
            currentY = result.endY + 10;
        });
        container.style.height = `${Math.max(container.offsetHeight, currentY + 300)}px`;
    },

    renderDataGrid(container, items) {
        let currentY = container.children.length > 0 ? parseInt(container.lastChild.style.top) + 60 : 150;
        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'data-grid';
            el.style.top = `${currentY}px`;
            el.innerHTML = `<div class="grid-label">${item.label}</div><div class="grid-val">${item.val}</div>`;
            container.appendChild(el);
            currentY += 60; // Approximate height
        });
        container.style.height = `${currentY + 200}px`;
    },

    injectTerminal(container) {
        const term = document.createElement('div');
        term.className = 'terminal-block';
        term.style.top = '100px';
        term.innerHTML = `<div id="term-out">SULKY_OS // TERMINAL READY<br>Type 'help'...</div><input type="text" id="term-in" style="background:none;border:none;color:#00ff41;width:100%;outline:none;font-family:inherit;">`;
        container.appendChild(term);
        const input = document.getElementById('term-in');
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim().toLowerCase();
                const out = document.getElementById('term-out');
                out.innerHTML += `<br>> ${cmd}`;
                if (cmd === 'ls') out.innerHTML += `<br>profile.man projects.bin skills.sys`;
                else if (cmd === 'help') out.innerHTML += `<br>ls, mode, clear, whoami`;
                else if (cmd === 'whoami') out.innerHTML += `<br>SulkySubject37 // System Engineer`;
                else if (cmd === 'mode') { this.toggleMode(); out.innerHTML += `<br>MODE SHIFTED`; }
                else if (cmd === 'clear') out.innerHTML = '';
                input.value = '';
            }
        };
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.onclick = () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.injectContent(item.dataset.target);
            };
        });
        document.getElementById('mode-toggle').onclick = () => this.toggleMode();
    },

    logEvent(msg) {
        const feed = document.getElementById('log-feed');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="timestamp">[${new Date().toTimeString().split(' ')[0]}]</span><span class="log-msg">${msg}</span>`;
        feed.prepend(entry);
    },

    updateClock() {
        setInterval(() => { 
            document.getElementById('uptime-clock').textContent = new Date().toTimeString().split(' ')[0]; 
        }, 1000);
    }
};

SulkyOS.init();
