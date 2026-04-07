/**
 * SULKY_OS v3.0 // THE ENTANGLED KERNEL
 * Core Engine: Architectural Prose (Cliff) + Robust Data Grids
 */

const SulkyOS = {
    state: {
        activeSection: 'profile',
        isBooted: false,
        isCruelMode: false,
        terminalHistory: ["KERNEL_READY // Type 'help'"]
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
        const updateSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        updateSize();

        const nodes = [{ id: 'me', group: 'core' }, ...portfolioData.projects.map(p => ({ id: p.title, group: 'project' }))];
        const links = portfolioData.projects.map(p => ({ source: 'me', target: p.title }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(250))
            .force("charge", d3.forceManyBody().strength(-800))
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
                    context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
                    context.fill();
                });
            });

        window.addEventListener('resize', () => { updateSize(); simulation.force("center", d3.forceCenter(canvas.width / 2 + 140, canvas.height / 2)).alpha(0.3).restart(); });
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

        if (section === 'profile') {
            this.renderProse(surface, `
[TYPE: header] ${portfolioData.about.name}
[TYPE: metadata] ${portfolioData.about.title} // ${portfolioData.about.location}
[TYPE: space]
${portfolioData.about.bio}
[TYPE: space]
${this.state.isCruelMode ? `[TYPE: section-label] CRUEL_STANDARD_MANIFESTO\n[TYPE: data-node] ${portfolioData.about.cruelBio}` : ''}
            `);
        } else if (section === 'projects') {
            this.renderProse(surface, "[TYPE: header] PROJECTS.bin");
            portfolioData.projects.forEach(p => {
                this.renderProse(surface, `
[TYPE: section-label] ${p.title}
[TYPE: metadata] ${p.tech} // <a href="${p.link}" target="_blank" style="color:inherit">LINK</a>
${p.description}
${this.state.isCruelMode ? `[TYPE: data-node] ${p.cruelDescription}` : ''}
[TYPE: space]
                `);
            });
        } else if (section === 'skills') {
            this.renderProse(surface, "[TYPE: header] SKILLS.sys");
            this.renderDataTable(surface, [
                { key: "Stack", val: portfolioData.skills.join(" // ") },
                { key: "Interests", val: portfolioData.interests.join(" // ") }
            ]);
        } else if (section === 'education') {
            this.renderProse(surface, "[TYPE: header] EDUCATION.edu");
            portfolioData.education.forEach(e => {
                this.renderDataTable(surface, [
                    { key: "Duration", val: e.duration },
                    { key: "Degree", val: e.degree },
                    { key: "Institution", val: e.institution },
                    { key: "Details", val: e.details }
                ]);
            });
        } else if (section === 'experience') {
            this.renderProse(surface, "[TYPE: header] EXPERIENCE.log");
            portfolioData.experience.forEach(e => {
                this.renderDataTable(surface, [
                    { key: "Duration", val: e.duration },
                    { key: "Role", val: e.role },
                    { key: "Company", val: e.company },
                    { key: "Context", val: e.description }
                ]);
            });
        } else if (section === 'blog') {
            this.renderProse(surface, "[TYPE: header] BLOG.log");
            portfolioData.posts.forEach(p => {
                this.renderProse(surface, `
[TYPE: section-label] ${p.date} // ${p.title}
${p.summary}
[TYPE: metadata] <a href="${p.link}" target="_blank" style="color:inherit">READ_ENTRY</a>
[TYPE: space]
                `);
            });
        } else if (section === 'publications') {
            this.renderProse(surface, "[TYPE: header] PUBLICATIONS.bib");
            portfolioData.publications.forEach(pub => {
                this.renderProse(surface, `[TYPE: section-label] BIB_ENTRY\n${pub}\n[TYPE: space]`);
            });
        } else if (section === 'contact') {
            this.renderProse(surface, "[TYPE: header] CONTACT.sh");
            this.renderDataTable(surface, [
                { key: "Email", val: portfolioData.about.email },
                { key: "Github", val: `<a href="${portfolioData.about.social.github}" target="_blank" style="color:inherit">@Sulkysubject37</a>` },
                { key: "LinkedIn", val: `<a href="${portfolioData.about.social.linkedin}" target="_blank" style="color:inherit">/in/subjects</a>` },
                { key: "Hashnode", val: `<a href="${portfolioData.about.social.blog}" target="_blank" style="color:inherit">subconc.hashnode.dev</a>` }
            ]);
        } else if (section === 'terminal') {
            this.injectTerminal(surface);
        } else if (section === 'network') {
            this.renderProse(surface, "[TYPE: header] NETWORK.gml\n[TYPE: section-label] INTERACTIVE_KNOWLEDGE_GRAPH");
            this.renderInteractiveNetwork(surface);
        }
    },

    renderProse(container, source) {
        const viewportWidth = container.offsetWidth;
        const currentY = container.children.length > 0 ? container.scrollHeight + 40 : 100;
        
        source.trim().split('\n').forEach((block, i) => {
            const trimmed = block.trim();
            if (!trimmed) return;

            let type = 'body', text = trimmed;
            if (trimmed.startsWith('[TYPE:')) {
                const match = trimmed.match(/\[TYPE:\s*([^\]]+)\](?:\s*(.*))?/);
                if (match) { type = match[1].toLowerCase(); text = match[2] || ''; }
            }

            if (type === 'space') {
                const sp = document.createElement('div'); el.className = 'space'; container.appendChild(sp);
                return;
            }

            const font = type === 'header' ? '900 3.5rem "Playfair Display"' : 
                         (type === 'metadata' || type === 'section-label' || type === 'data-node') ? '0.7rem "IBM Plex Mono"' : '1.15rem "EB Garamond"';
            const lh = type === 'header' ? 70 : 32;

            const result = Pretext.layoutWithExclusion(text, viewportWidth * 0.85, font, currentY, lh, (y) => {
                const dist = Math.abs(y - 500);
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
        });
    },

    renderDataTable(container, rows) {
        const wrap = document.createElement('div');
        wrap.className = 'data-table';
        // Position data tables based on content height
        wrap.style.marginTop = '2rem';
        wrap.style.marginLeft = '7.5%';
        wrap.style.width = '85%';
        rows.forEach(r => {
            wrap.innerHTML += `<div class="data-key">${r.key}</div><div class="data-val">${r.val}</div>`;
        });
        container.appendChild(wrap);
    },

    injectTerminal(container) {
        const term = document.createElement('div');
        term.className = 'terminal-block';
        term.style.marginTop = '4rem';
        term.innerHTML = `<div class="term-out" id="term-out"></div><div style="display:flex;gap:0.5rem"><span>></span><input type="text" id="term-input" autofocus spellcheck="false"></div>`;
        container.appendChild(term);
        const out = document.getElementById('term-out');
        const input = document.getElementById('term-input');
        
        this.state.terminalHistory.forEach(line => out.innerHTML += `<div>${line}</div>`);

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const val = input.value.trim().toLowerCase();
                out.innerHTML += `<div>> ${val}</div>`;
                if (val === 'help') out.innerHTML += "<div>Available: ls, mode, clear, whoami</div>";
                else if (val === 'ls') out.innerHTML += "<div>profile.man projects.bin skills.sys blog.log</div>";
                else if (val === 'mode') { this.toggleMode(); out.innerHTML += "<div>SYSTEM MODE TOGGLED</div>"; }
                else if (val === 'clear') out.innerHTML = '';
                else if (val === 'whoami') out.innerHTML += "<div>User: SulkySubject37 // Role: System Engineer</div>";
                input.value = '';
                out.scrollTop = out.scrollHeight;
            }
        };
    },

    renderInteractiveNetwork(container) {
        const net = document.createElement('div'); net.id = 'interactive-network'; net.style.marginTop = '4rem'; container.appendChild(net);
        const width = net.offsetWidth, height = 500;
        const svg = d3.select("#interactive-network").append("svg").attr("width", "100%").attr("height", height);
        // Add zoomable SVG graph here...
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
        entry.innerHTML = `<span class="log-ts">[${new Date().toTimeString().split(' ')[0]}]</span><span class="log-msg">${msg}</span>`;
        feed.prepend(entry);
    },

    updateClock() {
        setInterval(() => {
            document.getElementById('uptime-clock').textContent = new Date().toTimeString().split(' ')[0];
        }, 1000);
    }
};

SulkyOS.init();
