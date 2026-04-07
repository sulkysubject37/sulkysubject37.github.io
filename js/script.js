/**
 * SULKY_OS v3.0 // THE ENTANGLED KERNEL
 * Core Engine: D3 Graph + Rigid Flow Architecture
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
            "MOUNTING_REGISTRY: 0x00 -> 0x08",
            "LOADING_GRAPH_ENGINE: D3.force",
            "COMPILING_PROSE_SHIM: Pretext 2.0",
            "DECODING_BIO_METADATA: resED // VECTORIA // tangle",
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
                }, 800);
            }
        }, 150);
    },

    // --- LAYER 0: THE BACKGROUND GRAPH ---
    setupGraph() {
        const canvas = document.getElementById('graph-canvas');
        const context = canvas.getContext('2d');
        
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();

        // High-density nodes for background texture
        const nodes = [
            { id: 'me', label: 'MD. ARSHAD', group: 'core' },
            ...portfolioData.projects.map(p => ({ id: p.title, label: p.title, group: 'project' })),
            ...portfolioData.skills.map(s => ({ id: s, label: s, group: 'skill' })),
            ...portfolioData.education.map(e => ({ id: e.degree, label: e.degree, group: 'edu' }))
        ];

        const links = [];
        portfolioData.projects.forEach(p => {
            links.push({ source: 'me', target: p.title });
            p.tech.split(', ').forEach(t => {
                if (nodes.find(n => n.id === t)) links.push({ source: p.title, target: t });
            });
        });

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(220))
            .force("charge", d3.forceManyBody().strength(-600))
            .force("center", d3.forceCenter(canvas.width / 2 + 100, canvas.height / 2))
            .on("tick", () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                context.beginPath();
                context.strokeStyle = "#1a1a1815"; // Visible but background
                links.forEach(d => {
                    context.moveTo(d.source.x, d.source.y);
                    context.lineTo(d.target.x, d.target.y);
                });
                context.stroke();

                nodes.forEach(d => {
                    context.beginPath();
                    context.fillStyle = d.group === 'core' ? "#60708044" : "#1a1a1822";
                    context.arc(d.x, d.y, 2.5, 0, 2 * Math.PI);
                    context.fill();

                    context.font = "9px IBM Plex Mono";
                    context.fillStyle = "#1a1a1833";
                    context.fillText(d.label, d.x + 10, d.y + 3);
                });
            });

        window.addEventListener('resize', () => {
            updateSize();
            simulation.force("center", d3.forceCenter(canvas.width / 2 + 100, canvas.height / 2));
            simulation.alpha(0.3).restart();
        });
    },

    // --- LAYER 2: CONTENT INJECTION ---
    injectContent(section) {
        const surface = document.getElementById('text-surface');
        const pathDisplay = document.getElementById('active-path');
        surface.innerHTML = '';
        pathDisplay.textContent = `~/${section}.man`;

        this.logEvent(`READING_BLOCK: 0x0 -> ${section}`);

        let prose = "";

        if (section === 'profile') {
            prose = `
[TYPE: header] ${portfolioData.about.name}
[TYPE: metadata] ${portfolioData.about.title} // ${portfolioData.about.location}
[TYPE: space]
[TYPE: body-text] ${portfolioData.about.bio}
[TYPE: space]
[TYPE: section-label] CRUEL_STANDARD_MANIFESTO
[TYPE: data-node] ${portfolioData.about.cruelBio}
            `;
        } else if (section === 'projects') {
            prose = "[TYPE: header] PROJECTS.bin\n";
            portfolioData.projects.forEach(p => {
                prose += `
[TYPE: section-label] ${p.title}
[TYPE: metadata] ${p.tech} // LINK: ${p.link}
[TYPE: body-text] ${p.description}
[TYPE: data-node] ${p.cruelDescription}
[TYPE: space]
                `;
            });
        } else if (section === 'experience') {
            prose = "[TYPE: header] EXPERIENCE.log\n";
            portfolioData.experience.forEach(e => {
                prose += `
[TYPE: section-label] ${e.duration} // ${e.role}
[TYPE: metadata] COMPANY: ${e.company}
[TYPE: body-text] ${e.description}
[TYPE: space]
                `;
            });
        } else if (section === 'education') {
            prose = "[TYPE: header] EDUCATION.edu\n";
            portfolioData.education.forEach(e => {
                prose += `
[TYPE: section-label] ${e.duration} // ${e.degree}
[TYPE: metadata] INSTITUTION: ${e.institution}
[TYPE: body-text] ${e.details}
[TYPE: space]
                `;
            });
        } else if (section === 'skills') {
            prose = "[TYPE: header] SKILLS.sys\n";
            prose += "[TYPE: section-label] STACK_INVENTORY\n";
            prose += `[TYPE: body-text] ${portfolioData.skills.join(" // ")}\n`;
            prose += "[TYPE: space]\n[TYPE: section-label] INTEREST_VECTOR\n";
            prose += `[TYPE: body-text] ${portfolioData.interests.join(" // ")}\n`;
        } else if (section === 'blog') {
            prose = "[TYPE: header] BLOG.log\n";
            portfolioData.posts.forEach(p => {
                prose += `
[TYPE: section-label] ${p.date} // ${p.title}
[TYPE: body-text] ${p.summary}
[TYPE: metadata] SOURCE: ${p.link}
[TYPE: space]
                `;
            });
        } else if (section === 'publications') {
            prose = "[TYPE: header] PUBLICATIONS.bib\n";
            portfolioData.publications.forEach(pub => {
                prose += `
[TYPE: section-label] BIB_ENTRY
[TYPE: body-text] ${pub}
[TYPE: space]
                `;
            });
        } else if (section === 'contact') {
            prose = `
[TYPE: header] CONTACT.sh
[TYPE: section-label] COMMUNICATION_CHANNELS
[TYPE: metadata] EMAIL: ${portfolioData.about.email}
[TYPE: space]
[TYPE: section-label] SOCIAL_NODES
[TYPE: body-text] GITHUB: ${portfolioData.about.social.github}
[TYPE: body-text] LINKEDIN: ${portfolioData.about.social.linkedin}
[TYPE: body-text] TWITTER: ${portfolioData.about.social.twitter}
[TYPE: body-text] HASHNODE: ${portfolioData.about.social.blog}
            `;
        } else if (section === 'network') {
            prose = `
[TYPE: header] NETWORK.gml
[TYPE: section-label] SYSTEMS_BIOLOGY_GRAPH
[TYPE: body-text] Interactive knowledge graph of projects, skills, and technical dependencies. Drag to explore nodes.
            `;
            this.renderProse(surface, prose);
            this.renderInteractiveNetwork(surface);
            return;
        }

        this.renderProse(surface, prose);
    },

    renderProse(container, source) {
        source.trim().split('\n').forEach(block => {
            const trimmed = block.trim();
            if (!trimmed) return;

            let type = 'body-text';
            let text = trimmed;

            if (trimmed.startsWith('[TYPE:')) {
                const match = trimmed.match(/\[TYPE:\s*([^\]]+)\](?:\s*(.*))?/);
                if (match) {
                    type = match[1].toLowerCase();
                    text = match[2] || '';
                }
            }

            const el = document.createElement('div');
            el.className = type;
            if (type !== 'space') {
                el.innerHTML = text;
            }
            container.appendChild(el);
        });
    },

    renderInteractiveNetwork(container) {
        const netDiv = document.createElement('div');
        netDiv.id = 'interactive-network';
        container.appendChild(netDiv);

        const width = netDiv.offsetWidth;
        const height = 600;

        const svg = d3.select("#interactive-network").append("svg")
            .attr("width", "100%")
            .attr("height", height)
            .call(d3.zoom().on("zoom", (event) => {
                g.attr("transform", event.transform);
            }));

        const g = svg.append("g");

        const nodes = [
            { id: 'me', label: 'MD. ARSHAD', group: 'core', val: 10 },
            ...portfolioData.projects.map(p => ({ id: p.title, label: p.title, group: 'project', val: 6 })),
            ...portfolioData.skills.map(s => ({ id: s, label: s, group: 'skill', val: 4 }))
        ];

        const links = [];
        portfolioData.projects.forEach(p => {
            links.push({ source: 'me', target: p.title });
            p.tech.split(', ').forEach(t => {
                if (nodes.find(n => n.id === t)) links.push({ source: p.title, target: t });
            });
        });

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = g.append("g")
            .attr("stroke", "#1a1a1822")
            .selectAll("line")
            .data(links)
            .join("line");

        const node = g.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(d3.drag()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x; d.fy = d.y;
                })
                .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null; d.fy = null;
                }));

        node.append("circle")
            .attr("r", d => d.val)
            .attr("fill", d => d.group === 'core' ? "#607080" : "#1a1a18");

        node.append("text")
            .text(d => d.label)
            .attr("x", 12)
            .attr("y", 4)
            .attr("font-family", "IBM Plex Mono")
            .attr("font-size", "10px")
            .attr("fill", "#666");

        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });
    },

    // --- UTILS ---
    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.onclick = () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.injectContent(item.dataset.target);
                document.getElementById('text-surface').scrollTop = 0;
            };
        });

        window.onmousemove = (e) => {
            const telemetry = document.getElementById('coord-telemetry');
            const surface = document.getElementById('text-surface');
            telemetry.textContent = `X: ${String(e.clientX).padStart(3,'0')} | Y: ${String(Math.round(surface.scrollTop + e.clientY)).padStart(3,'0')}`;
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
