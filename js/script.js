/**
 * SULKY_OS v3.0 // THE ENTANGLED KERNEL
 * Core Engine: D3 Graph + Pretext Architectural Prose
 */

const SulkyOS = {
    state: {
        activeSection: 'profile',
        isBooted: false,
        nodes: [],
        links: []
    },

    init() {
        this.runBootSequence();
        this.setupGraph();
        this.setupEventListeners();
        this.updateClock();
    },

    // --- BOOT SEQUENCE ---
    runBootSequence() {
        const progress = document.getElementById('boot-progress');
        const log = document.getElementById('boot-log');
        const overlay = document.getElementById('boot-overlay');
        
        const messages = [
            "INIT_KERNEL: SULKY_OS v3.0.1",
            "CHECKING_FILESYSTEM... OK",
            "MOUNTING_REGISTRY: posts/ js/ assets/",
            "LOADING_GRAPH_ENGINE: D3.force",
            "COMPILING_PROSE_SHIM: Pretext 2.0",
            "DECODING_BIO_METADATA: resED // VECTORIA // tangle",
            "LIQUIDATING_NARRATIVE_SLOP...",
            "SYSTEM_READY: ENJOY_THE_ENTANGLEMENT"
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < messages.length) {
                const entry = document.createElement('div');
                entry.textContent = `[OK] ${messages[i]}`;
                log.appendChild(entry);
                progress.style.width = `${(i + 1) * (100 / messages.length)}%`;
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
                }, 1000);
            }
        }, 300);
    },

    // --- LAYER 0: THE GRAPH ENGINE ---
    setupGraph() {
        const canvas = document.getElementById('graph-canvas');
        const context = canvas.getContext('2d');
        const container = document.getElementById('graph-container');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Create nodes from portfolioData
        const nodes = [
            { id: 'me', label: 'MD. ARSHAD', group: 'core' },
            ...portfolioData.projects.map(p => ({ id: p.title, label: p.title, group: 'project' })),
            ...portfolioData.skills.map(s => ({ id: s, label: s, group: 'skill' }))
        ];

        // Create links
        const links = [];
        portfolioData.projects.forEach(p => {
            links.push({ source: 'me', target: p.title });
            p.tech.split(', ').forEach(t => {
                if (nodes.find(n => n.id === t)) {
                    links.push({ source: p.title, target: t });
                }
            });
        });

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", () => {
                context.clearRect(0, 0, width, height);
                
                // Draw links
                context.beginPath();
                context.strokeStyle = "#1a1a1822";
                links.forEach(d => {
                    context.moveTo(d.source.x, d.source.y);
                    context.lineTo(d.target.x, d.target.y);
                });
                context.stroke();

                // Draw nodes
                nodes.forEach(d => {
                    context.beginPath();
                    context.fillStyle = d.group === 'core' ? "#607080" : "#1a1a1844";
                    context.arc(d.x, d.y, 4, 0, 2 * Math.PI);
                    context.fill();

                    context.font = "10px IBM Plex Mono";
                    context.fillStyle = "#1a1a1822";
                    context.fillText(d.label, d.x + 8, d.y + 4);
                });
            });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            simulation.force("center", d3.forceCenter(width / 2, height / 2));
        });
    },

    // --- LAYER 2: CONTENT INJECTION ---
    injectContent(section) {
        const surface = document.getElementById('text-surface');
        const pathDisplay = document.getElementById('active-path');
        surface.innerHTML = '';
        pathDisplay.textContent = `~/${section}.man`;

        this.logEvent(`TRAVERSING_GRAPH: 0x0 -> ${section}`);

        if (section === 'profile') {
            this.renderProse(surface, `
[TYPE: header] ${portfolioData.about.name}
[TYPE: metadata] ${portfolioData.about.title} // ${portfolioData.about.location}
[TYPE: space]
${portfolioData.about.bio}
[TYPE: space]
[TYPE: section-label] CRUEL_STANDARD_MANIFESTO
${portfolioData.about.cruelBio}
            `);
        } else if (section === 'projects') {
            let prose = "[TYPE: header] PROJECTS.bin\n";
            portfolioData.projects.forEach(p => {
                prose += `
[TYPE: section-label] ${p.title}
[TYPE: metadata] ${p.tech}
${p.cruelDescription}
[TYPE: space]
                `;
            });
            this.renderProse(surface, prose);
        } else if (section === 'blog') {
            let prose = "[TYPE: header] BLOG.log\n";
            portfolioData.posts.forEach(p => {
                prose += `
[TYPE: section-label] ${p.date} // ${p.title}
${p.summary}
[TYPE: metadata] LINK: ${p.link}
[TYPE: space]
                `;
            });
            this.renderProse(surface, prose);
        }
    },

    renderProse(container, source) {
        const width = container.offsetWidth;
        let currentY = 0;

        source.trim().split('\n').forEach(block => {
            if (!block.trim()) { currentY += 32; return; }

            let type = 'body';
            let text = block;
            if (block.startsWith('[TYPE:')) {
                const match = block.match(/\[TYPE: (.*?)\] (.*)/);
                if (match) { type = match[1]; text = match[2]; }
            }

            const font = type === 'header' ? '900 3.5rem Playfair Display' : 
                         type === 'metadata' ? '0.75rem IBM Plex Mono' : 
                         type === 'section-label' ? 'bold 0.7rem IBM Plex Mono' : '1.15rem EB Garamond';
            const lh = type === 'header' ? 70 : 32;

            // Simplified Pretext logic
            const result = Pretext.layoutWithExclusion(text, width * 0.8, font, currentY, lh, null);
            
            result.lines.forEach(l => {
                const el = document.createElement('div');
                el.className = `line ${type}`;
                el.textContent = l.text;
                el.style.top = `${l.y}px`;
                el.style.left = `0px`;
                el.style.font = font;
                container.appendChild(el);
            });
            currentY = result.endY + 10;
        });
    },

    // --- UTILS ---
    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.onclick = () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.injectContent(item.dataset.target);
            };
        });

        window.onmousemove = (e) => {
            const telemetry = document.getElementById('coord-telemetry');
            telemetry.textContent = `X: ${String(e.clientX).padStart(3,'0')} | Y: ${String(Math.round(window.scrollY + e.clientY)).padStart(3,'0')}`;
        };
    },

    logEvent(msg) {
        const feed = document.getElementById('log-feed');
        const entry = document.createElement('div');
        const time = new Date().toTimeString().split(' ')[0];
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="timestamp">[${time}]</span> <span class="log-msg">${msg}</span>`;
        feed.prepend(entry);
    },

    updateClock() {
        setInterval(() => {
            const now = new Date();
            document.getElementById('uptime-clock').textContent = now.toTimeString().split(' ')[0];
        }, 1000);
    }
};

// Start OS
SulkyOS.init();
