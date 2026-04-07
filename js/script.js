/**
 * SULKY_OS v3.0.2 // THE ENTANGLED KERNEL
 * Full Architectural Rebuild: Bit-Exact Line-by-Line Engine
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
            "INIT_KERNEL: v3.0.2",
            "MOUNT_REGISTRY: profile, projects, log",
            "CALIBRATING_D3_FORCE...",
            "READY: ENJOY_THE_ENTANGLEMENT"
        ];
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

        window.addEventListener('resize', () => { 
            updateSize(); 
            simulation.force("center", d3.forceCenter(this.state.width / 2 + 140, this.state.height / 2)).alpha(0.3).restart(); 
        });
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

        let source = "";

        if (section === 'profile') {
            source = `
[TYPE: header] ${portfolioData.about.name}
[TYPE: metadata] ${portfolioData.about.title} // ${portfolioData.about.location}
[TYPE: space]
${portfolioData.about.bio}
[TYPE: space]
${this.state.isCruelMode ? `[TYPE: section-label] CRUEL_STANDARD_MANIFESTO\n[TYPE: data-node] ${portfolioData.about.cruelBio}\n[TYPE: space]` : ''}
[TYPE: section-label] CONTACT_RECORDS
EMAIL: ${portfolioData.about.email}
GITHUB: ${portfolioData.about.social.github}
LINKEDIN: ${portfolioData.about.social.linkedin}
            `;
        } else if (section === 'projects') {
            source = "[TYPE: header] PROJECTS.bin\n[TYPE: space]";
            portfolioData.projects.forEach(p => {
                source += `[TYPE: section-label] ${p.title}\n[TYPE: metadata] ${p.tech} // ${p.link}\n${p.description}\n${this.state.isCruelMode ? `[TYPE: data-node] ${p.cruelDescription}` : ''}\n[TYPE: space]\n`;
            });
        } else if (section === 'experience') {
            source = "[TYPE: header] EXPERIENCE.log\n[TYPE: space]";
            portfolioData.experience.forEach(e => {
                source += `[TYPE: section-label] ${e.duration} // ${e.role}\n[TYPE: metadata] ${e.company}\n${e.description}\n[TYPE: space]\n`;
            });
        } else if (section === 'education') {
            source = "[TYPE: header] EDUCATION.edu\n[TYPE: space]";
            portfolioData.education.forEach(e => {
                source += `[TYPE: section-label] ${e.duration} // ${e.degree}\n[TYPE: metadata] ${e.institution}\n${e.details}\n[TYPE: space]\n`;
            });
        } else if (section === 'skills') {
            source = `[TYPE: header] SKILLS.sys\n[TYPE: space]\n[TYPE: section-label] STACK_INVENTORY\n${portfolioData.skills.join(' // ')}\n[TYPE: space]\n[TYPE: section-label] INTEREST_VECTOR\n${portfolioData.interests.join(' // ')}`;
        } else if (section === 'blog') {
            source = "[TYPE: header] BLOG.log\n[TYPE: space]";
            portfolioData.posts.forEach(p => {
                source += `[TYPE: section-label] ${p.date} // ${p.title}\n${p.summary}\n[TYPE: metadata] READ: ${p.link}\n[TYPE: space]\n`;
            });
        } else if (section === 'publications') {
            source = "[TYPE: header] PUBLICATIONS.bib\n[TYPE: space]";
            portfolioData.publications.forEach(pub => source += `[TYPE: section-label] BIB_ENTRY\n${pub}\n[TYPE: space]\n`);
        } else if (section === 'contact') {
            source = `[TYPE: header] CONTACT.sh\n[TYPE: space]\n[TYPE: section-label] CHANNELS\nEMAIL: ${portfolioData.about.email}\nGITHUB: ${portfolioData.about.social.github}\nLINKEDIN: ${portfolioData.about.social.linkedin}\nTWITTER: ${portfolioData.about.social.twitter}\nHASHNODE: ${portfolioData.about.social.blog}`;
        } else if (section === 'network') {
            source = "[TYPE: header] NETWORK.gml\n[TYPE: space]\n[TYPE: section-label] INTERACTIVE_KNOWLEDGE_GRAPH";
            this.renderInteractiveNetwork(surface);
        } else if (section === 'terminal') {
            this.renderTerminal(surface);
            return;
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
                         (type === 'metadata' || type === 'section-label' || type === 'data-node') ? '0.75rem "IBM Plex Mono"' : '1.15rem "EB Garamond"';
            const lh = type === 'header' ? 70 : LH;

            // CLIFF EXCLUSION LOGIC
            const result = Pretext.layoutWithExclusion(text, width * 0.85, font, currentY, lh, (y) => {
                const dist = Math.abs(y - 500); // Fixed center exclusion
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

    renderTerminal(container) {
        this.renderBitExact(container, "[TYPE: header] TERMINAL.sh\n[TYPE: space]");
        const term = document.createElement('div');
        term.className = 'terminal-block';
        term.style.top = '200px';
        term.innerHTML = `<div id="term-out">SULKY_OS // READY<br>Type 'help'...</div><input type="text" id="term-in" spellcheck="false" style="background:none;border:none;color:inherit;font-family:inherit;width:100%;outline:none;">`;
        container.appendChild(term);
        const input = document.getElementById('term-in');
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim().toLowerCase();
                const out = document.getElementById('term-out');
                out.innerHTML += `<br>> ${cmd}`;
                if (cmd === 'ls') out.innerHTML += `<br>profile.man  projects.bin  skills.sys`;
                else if (cmd === 'help') out.innerHTML += `<br>Available: ls, mode, whoami, clear`;
                else if (cmd === 'clear') out.innerHTML = '';
                else if (cmd === 'mode') { this.toggleMode(); out.innerHTML += `<br>MODE SHIFTED`; }
                else if (cmd === 'whoami') out.innerHTML += `<br>SulkySubject37 // System Engineer`;
                input.value = '';
            }
        };
    },

    renderInteractiveNetwork(container) {
        // SVG placeholder for NETWORK.gml
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
