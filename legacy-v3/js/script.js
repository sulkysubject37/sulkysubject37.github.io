/**
 * SULKY_OS v3.0.3 // THE ENTANGLED KERNEL
 * Final Stabilization: 37% Boot Logic + Restored High-Fidelity Views
 */

const SulkyOS = {
    state: {
        activeSection: 'profile',
        isBooted: false,
        isCruelMode: false,
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
        const messages = [
            "KERNEL_INIT: SulkyOS_v3.0",
            "MAPPING_VIRTUAL_MEMORY...",
            "REACHING_CRITICAL_THRESHOLD...",
            "BUFFER_READY // SULKY_37"
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < messages.length) {
                const entry = document.createElement('div');
                entry.textContent = `[OK] ${messages[i]}`;
                log.appendChild(entry);
                // Progress halts at 37% as requested
                progress.style.width = `${(i + 1) * 9.25}%`; 
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    log.innerHTML += `<div style="color:var(--accent)">[NOTICE] LOADING_COMPLETE_AT_37_PERCENT</div>`;
                    setTimeout(() => {
                        overlay.style.opacity = '0';
                        setTimeout(() => { 
                            overlay.style.display = 'none'; 
                            this.state.isBooted = true; 
                            this.injectContent('profile'); 
                        }, 500);
                    }, 800);
                }, 500);
            }
        }, 300);
    },

    setupGraph() {
        const canvas = document.getElementById('graph-canvas');
        const context = canvas.getContext('2d');
        const updateSize = () => { 
            this.state.width = canvas.width = window.innerWidth; 
            this.state.height = canvas.height = window.innerHeight; 
        };
        updateSize();

        const nodes = [{ id: 'me' }, ...portfolioData.projects.map(p => ({ id: p.title }))];
        const links = portfolioData.projects.map(p => ({ source: 'me', target: p.title }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(250))
            .force("charge", d3.forceManyBody().strength(-800))
            .force("center", d3.forceCenter(this.state.width / 2 + 140, this.state.height / 2))
            .on("tick", () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.strokeStyle = this.state.isCruelMode ? "#00ff4110" : "#1a1a1808";
                links.forEach(d => { context.moveTo(d.source.x, d.source.y); context.lineTo(d.target.x, d.target.y); });
                context.stroke();
                nodes.forEach(d => {
                    context.beginPath();
                    context.fillStyle = this.state.isCruelMode ? "#00ff4122" : "#1a1a1815";
                    context.arc(d.x, d.y, 2.5, 0, 2 * Math.PI);
                    context.fill();
                });
            });

        window.addEventListener('resize', () => { updateSize(); simulation.force("center", d3.forceCenter(this.state.width / 2 + 140, this.state.height / 2)).alpha(0.3).restart(); });
    },

    toggleMode() {
        this.state.isCruelMode = !this.state.isCruelMode;
        document.body.classList.toggle('cruel-mode', this.state.isCruelMode);
        document.getElementById('mode-toggle').textContent = this.state.isCruelMode ? '[ SHIFT_TO_NORMAL ]' : '[ SHIFT_TO_CRUEL ]';
        this.logEvent(`MODE_CHANGE: ${this.state.isCruelMode ? 'CRUEL' : 'NORMAL'}`);
        this.injectContent(this.state.activeSection);
    },

    injectContent(section) {
        this.state.activeSection = section;
        const surface = document.getElementById('text-surface');
        surface.innerHTML = '';
        document.getElementById('active-path').textContent = `~/${section}.${this.getExtension(section)}`;

        this.logEvent(`READ_BLOCK: 0x0 -> ${section}`);

        if (section === 'blog') {
            this.renderBitExact(surface, "[TYPE: header] BLOG.log\n[TYPE: space]");
            portfolioData.posts.forEach((p, idx) => {
                const card = document.createElement('div');
                card.className = 'blog-card-wrap';
                card.style.top = `${250 + (idx * 220)}px`;
                card.innerHTML = `
                    <div class="section-label">${p.date}</div>
                    <div class="header" style="font-size:1.5rem; margin: 0.5rem 0;">${p.title}</div>
                    <div class="body-text" style="font-family:var(--serif); font-size:1rem; margin-bottom:1rem;">${p.summary}</div>
                    <a href="${p.link}" target="_blank" class="mode-btn" style="text-decoration:none; padding: 0.4rem 1rem; display:inline-block;">READ_ENTRY</a>
                `;
                surface.appendChild(card);
            });
            surface.style.height = `${250 + (portfolioData.posts.length * 220) + 200}px`;
            return;
        }

        if (section === 'terminal') {
            this.renderBitExact(surface, "[TYPE: header] TERMINAL.sh\n[TYPE: space]");
            const term = document.createElement('div');
            term.className = 'terminal-block';
            term.style.top = '220px';
            term.innerHTML = `<div id="term-out">SULKY_OS // READY<br>Type 'help' for commands...</div><div style="display:flex; gap:0.5rem"><span>></span><input type="text" id="term-in" spellcheck="false" style="background:none;border:none;color:inherit;font-family:inherit;width:100%;outline:none;"></div>`;
            surface.appendChild(term);
            const input = document.getElementById('term-in');
            const out = document.getElementById('term-out');
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    const cmd = input.value.trim().toLowerCase();
                    out.innerHTML += `<br>> ${cmd}`;
                    if (cmd === 'help') out.innerHTML += `<br>Available: ls, whoami, mode, clear`;
                    else if (cmd === 'ls') out.innerHTML += `<br>profile.man  projects.bin  blog.log`;
                    else if (cmd === 'whoami') out.innerHTML += `<br>SulkySubject37 // System Engineer`;
                    else if (cmd === 'mode') { this.toggleMode(); out.innerHTML += `<br>SYSTEM_MODE_SHIFTED`; }
                    else if (cmd === 'clear') out.innerHTML = 'TERMINAL_CLEARED';
                    input.value = '';
                }
            };
            surface.style.height = '1000px';
            return;
        }

        if (section === 'network') {
            this.renderBitExact(surface, "[TYPE: header] NETWORK.gml\n[TYPE: section-label] INTERACTIVE_SYSTEM_GRAPH\n[TYPE: space]");
            const net = document.createElement('div');
            net.id = 'interactive-network';
            net.style.top = '250px';
            surface.appendChild(net);
            this.renderInteractiveNetwork();
            surface.style.height = '1000px';
            return;
        }

        let source = "";
        if (section === 'profile') {
            source = `
[TYPE: header] ${portfolioData.about.name}
[TYPE: metadata] ${portfolioData.about.title} // ${portfolioData.about.location}
[TYPE: space]
${portfolioData.about.bio}
[TYPE: space]
[TYPE: section-label] EDUCATION_RECORD
${portfolioData.education.map(e => `${e.duration} // ${e.degree} // ${e.institution}\n${e.details}`).join('\n\n')}
[TYPE: space]
${this.state.isCruelMode ? `[TYPE: section-label] CRUEL_STANDARD_MANIFESTO\n[TYPE: data-node] ${portfolioData.about.cruelBio}\n[TYPE: space]` : ''}
            `;
        } else if (section === 'projects') {
            source = "[TYPE: header] PROJECTS.bin\n[TYPE: space]";
            portfolioData.projects.forEach(p => {
                source += `[TYPE: section-label] ${p.title}\n[TYPE: metadata] ${p.tech}\n${p.description}\n${this.state.isCruelMode ? `[TYPE: data-node] ${p.cruelDescription}` : ''}\n[TYPE: space]\n`;
            });
        } else if (section === 'experience') {
            source = "[TYPE: header] EXPERIENCE.log\n[TYPE: space]";
            portfolioData.experience.forEach(e => {
                source += `[TYPE: section-label] ${e.duration} // ${e.role}\n[TYPE: metadata] COMPANY: ${e.company}\n${e.description}\n[TYPE: space]\n`;
            });
        } else if (section === 'education') {
            source = "[TYPE: header] EDUCATION.edu\n[TYPE: space]";
            portfolioData.education.forEach(e => {
                source += `[TYPE: section-label] ${e.duration} // ${e.degree}\n[TYPE: metadata] ${e.institution}\n${e.details}\n[TYPE: space]\n`;
            });
        } else if (section === 'skills') {
            source = `[TYPE: header] SKILLS.sys\n[TYPE: space]\n[TYPE: section-label] STACK_INVENTORY\n${portfolioData.skills.join(' // ')}\n[TYPE: space]\n[TYPE: section-label] INTEREST_VECTOR\n${portfolioData.interests.join(' // ')}`;
        } else if (section === 'publications') {
            source = "[TYPE: header] PUBLICATIONS.bib\n[TYPE: space]";
            portfolioData.publications.forEach(pub => source += `[TYPE: section-label] BIB_ENTRY\n${pub}\n[TYPE: space]\n`);
        } else if (section === 'contact') {
            source = `[TYPE: header] CONTACT.sh\n[TYPE: space]\n[TYPE: section-label] CHANNELS\nEMAIL: ${portfolioData.about.email}\nGITHUB: ${portfolioData.about.social.github}\nLINKEDIN: ${portfolioData.about.social.linkedin}`;
        }

        this.renderBitExact(surface, source);
    },

    getExtension(section) {
        const maps = { profile: 'man', projects: 'bin', experience: 'log', education: 'edu', skills: 'sys', blog: 'log', publications: 'bib', contact: 'sh', network: 'gml', terminal: 'sh' };
        return maps[section] || 'txt';
    },

    renderBitExact(container, source) {
        const width = container.offsetWidth;
        let currentY = 80;
        const LH = 28;

        source.trim().split('\n').forEach(block => {
            const trimmed = block.trim();
            if (!trimmed) { currentY += LH; return; }

            let type = 'body', text = trimmed;
            if (trimmed.startsWith('[TYPE:')) {
                const match = trimmed.match(/\[TYPE:\s*([^\]]+)\](?:\s*(.*))?/);
                if (match) { type = match[1].toLowerCase(); text = match[2] || ''; }
            }

            if (type === 'space') { currentY += 40; return; }

            const font = type === 'header' ? '900 3.5rem "Playfair Display"' : 
                         (type === 'metadata' || type === 'section-label' || type === 'data-node') ? '0.7rem "IBM Plex Mono"' : '1.15rem "EB Garamond"';
            const lh = type === 'header' ? 70 : LH;

            const result = Pretext.layoutWithExclusion(text, width * 0.85, font, currentY, lh, (y) => {
                const dist = Math.abs(y - 500); 
                if (dist < 150) {
                    const span = Math.sqrt(150**2 - dist**2);
                    return [(width/2) - span, (width/2) + span];
                }
                return null;
            });

            result.lines.forEach(l => {
                const el = document.createElement('div');
                el.className = `line ${type}`;
                el.textContent = l.text;
                el.style.top = `${l.y}px`;
                el.style.left = `${l.x + (width * 0.075)}px`;
                el.style.font = font;
                container.appendChild(el);
            });
            currentY = result.endY + 8;
        });
        container.style.height = `${currentY + 400}px`;
    },

    renderInteractiveNetwork() {
        const netDiv = document.getElementById('interactive-network');
        const width = netDiv.offsetWidth, height = 500;
        const svg = d3.select("#interactive-network").append("svg").attr("width", "100%").attr("height", height);
        const g = svg.append("g");
        
        const nodes = [{ id: 'me', label: 'MD. ARSHAD', group: 'core' }, ...portfolioData.projects.map(p => ({ id: p.title, label: p.title, group: 'project' }))];
        const links = portfolioData.projects.map(p => ({ source: 'me', target: p.title }));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = g.append("g").attr("stroke", "#1a1a1822").selectAll("line").data(links).join("line");
        const node = g.append("g").selectAll("circle").data(nodes).join("circle").attr("r", 6).attr("fill", d => d.group === 'core' ? "#607080" : "#1a1a18")
            .call(d3.drag().on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }).on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; }).on("end", (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));

        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
            node.attr("cx", d => d.x).attr("cy", d => d.y);
        });
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.onclick = () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.injectContent(item.dataset.target);
                document.getElementById('text-surface').scrollTop = 0;
            };
        });
        document.getElementById('mode-toggle').onclick = () => this.toggleMode();
        window.onmousemove = (e) => {
            document.getElementById('coord-telemetry').textContent = `X: ${String(e.clientX).padStart(3,'0')} | Y: ${String(Math.round(document.getElementById('text-surface').scrollTop + e.clientY)).padStart(3,'0')}`;
        };
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
