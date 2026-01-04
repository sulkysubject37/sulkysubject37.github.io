document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const viewportTitle = document.getElementById('viewport-title');
    const viewportContent = document.getElementById('viewport-content');
    const navItems = document.querySelectorAll('.nav-item');
    const logFeed = document.getElementById('log-feed');
    const uptimeElement = document.getElementById('uptime');

    // State
    let currentView = 'profile';
    let isCruelMode = false;
    const startTime = new Date();

    const modeSwitch = document.getElementById('mode-switch');
    const modeIndicator = document.getElementById('mode-indicator');

    // Toggle Mode
    if (modeSwitch) {
        modeSwitch.addEventListener('click', () => {
            console.log("Mode switch clicked. Current state:", isCruelMode);
            isCruelMode = !isCruelMode;
            
            if (isCruelMode) {
                modeIndicator.textContent = 'CRUEL';
                document.body.classList.add('cruel-theme');
                log('WARNING: CRUEL MODE ENGAGED. RAW DATA EXPOSED.', 'error');
            } else {
                modeIndicator.textContent = 'NORMAL';
                document.body.classList.remove('cruel-theme');
                log('System restored to safe mode.');
            }

            // Re-render current view
            renderView(currentView);
        });
    } else {
        console.error("Critical: Mode switch element not found.");
    }

    // 1. Navigation Logic
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update Active State
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Render Content
            const target = item.dataset.target;
            currentView = target;
            renderView(target);
            
            // Log Action
            log(`Navigation: Switched to ~/${target}`);
        });
    });

    // 2. Rendering Engine
    function renderView(view) {
        viewportContent.innerHTML = ''; // Clear
        viewportTitle.textContent = `~/${view}`;

        switch(view) {
            case 'profile':
                renderProfile();
                break;
            case 'projects':
                renderProjects();
                break;
            case 'network':
                renderNetwork();
                break;
            case 'experience':
                renderExperience();
                break;
            case 'publications':
                renderPublications();
                break;
            case 'contact':
                renderContact();
                break;
            default:
                viewportContent.innerHTML = '<div class="man-text text-red">Error: File not found.</div>';
        }
    }

    function renderProfile() {
        const p = portfolioData.about;
        const bioText = isCruelMode ? p.cruelBio : p.bio;
        const html = `
            <div class="man-page">
                <div class="man-header">
                    <div class="man-title">${p.name.toUpperCase()}</div>
                    <div class="man-subtitle">${p.title}</div>
                    <div class="man-text"><i class="fas fa-map-marker-alt"></i> ${p.location}</div>
                </div>
                
                <div class="man-section">
                    <div class="section-title">SYNOPSIS</div>
                    <p class="man-text ${isCruelMode ? 'text-red' : ''}">${bioText}</p>
                </div>

                <div class="man-section">
                    <div class="section-title">SKILLS</div>
                    <div class="man-text" style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${portfolioData.skills.map(s => `<span style="background: #30363d; padding: 2px 6px; border-radius: 4px;">${s}</span>`).join('')}
                    </div>
                </div>

                <div class="man-section">
                    <div class="section-title">EDUCATION</div>
                    ${portfolioData.education.map(edu => `
                        <div style="margin-bottom: 15px;">
                            <div style="color: var(--accent-blue); font-weight: bold;">${edu.degree}</div>
                            <div style="color: var(--text-secondary);">${edu.institution} // ${edu.duration}</div>
                            <div style="font-size: 13px; margin-top: 4px;">${edu.details}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        viewportContent.innerHTML = html;
    }

    function renderProjects() {
        const rows = portfolioData.projects.map(proj => {
            const desc = isCruelMode ? (proj.cruelDescription || proj.description) : proj.description;
            const descClass = isCruelMode && proj.cruelDescription ? 'text-red' : 'text-primary';
            
            return `
            <tr>
                <td style="font-weight: bold; color: var(--accent-blue);">${proj.title}</td>
                <td>${proj.tech.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('')}</td>
                <td class="${descClass}">${desc}</td>
                <td style="text-align: right;"><a href="${proj.link}" target="_blank" style="color: var(--accent-green); text-decoration: none;">[LINK]</a></td>
            </tr>
        `}).join('');

        const html = `
            <div class="man-page">
                 <div class="man-section">
                    <div class="section-title">PROJECT_INDEX</div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>STACK</th>
                                <th>DESCRIPTION</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        viewportContent.innerHTML = html;
    }

    function renderNetwork() {
        // Construct Graph Data
        const nodes = [];
        const links = [];
        const skillsMap = new Map();

        // Add Center Node
        nodes.push({ id: "Arshad", group: 1, r: 10 });

        // Add Projects and Skills
        portfolioData.projects.forEach(p => {
            nodes.push({ id: p.title, group: 2, r: 7 });
            links.push({ source: "Arshad", target: p.title });
            
            p.tech.split(',').forEach(t => {
                const skill = t.trim();
                if (!skillsMap.has(skill)) {
                    skillsMap.set(skill, true);
                    nodes.push({ id: skill, group: 3, r: 5 });
                }
                links.push({ source: p.title, target: skill });
            });
        });

        // Add Graph Container
        viewportContent.innerHTML = '<div id="network-graph" class="network-container"></div>';
        
        // Initialize D3
        const width = viewportContent.clientWidth;
        const height = viewportContent.clientHeight;

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(d => d.r + 5));

        const svg = d3.select("#network-graph").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(d3.zoom().on("zoom", (event) => {
                g.attr("transform", event.transform);
            }));

        const g = svg.append("g");

        const link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke", "#30363d")
            .attr("stroke-width", 1.5);

        const node = g.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(nodes)
            .enter().append("g")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("circle")
            .attr("r", d => d.r)
            .attr("fill", d => {
                if(d.group === 1) return "#238636"; // Green (You)
                if(d.group === 2) return "#58a6ff"; // Blue (Projects)
                return "#d29922"; // Yellow (Skills)
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);

        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(d => d.id)
            .attr("fill", "#c9d1d9");

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }

    function renderExperience() {
        const html = `
            <div class="man-page">
                <div class="man-section">
                    <div class="section-title">SYSTEM_LOGS (EXPERIENCE)</div>
                    <div style="font-family: monospace;">
                        ${portfolioData.experience.map(exp => `
                            <div style="margin-bottom: 20px; border-left: 2px solid var(--border-color); padding-left: 15px;">
                                <div style="color: var(--accent-yellow);">[${exp.duration}] PROCESS_START: ${exp.company}</div>
                                <div style="color: var(--accent-blue); font-weight: bold; margin: 5px 0;">ROLE: ${exp.role}</div>
                                <div style="color: var(--text-primary);">> ${exp.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        viewportContent.innerHTML = html;
    }

    function renderPublications() {
         const html = `
            <div class="man-page">
                <div class="man-section">
                    <div class="section-title">BIBLIOGRAPHY</div>
                    <ul style="list-style: none;">
                        ${portfolioData.publications.map((pub, idx) => `
                            <li style="margin-bottom: 15px; display: flex; gap: 10px;">
                                <span style="color: var(--text-secondary);">[${idx + 1}]</span>
                                <span style="color: var(--text-primary);">${pub}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        viewportContent.innerHTML = html;
    }

    function renderContact() {
        const s = portfolioData.about.social;
        const html = `
             <div class="man-page">
                <div class="man-section">
                    <div class="section-title">CONNECT.SH</div>
                    <p style="margin-bottom: 20px;">Execute the following protocols to establish communication:</p>
                    
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px; align-items: center;">
                        <span style="color: var(--accent-blue);">EMAIL:</span>
                        <a href="mailto:${portfolioData.about.email}" style="color: var(--text-primary); text-decoration: none; border-bottom: 1px dashed var(--text-secondary);">${portfolioData.about.email}</a>

                        <span style="color: var(--accent-blue);">GITHUB:</span>
                        <a href="${s.github}" target="_blank" style="color: var(--text-primary); text-decoration: none; border-bottom: 1px dashed var(--text-secondary);">git clone sulkysubject37</a>

                        <span style="color: var(--accent-blue);">LINKEDIN:</span>
                        <a href="${s.linkedin}" target="_blank" style="color: var(--text-primary); text-decoration: none; border-bottom: 1px dashed var(--text-secondary);">/in/subjects</a>

                         <span style="color: var(--accent-blue);">TWITTER:</span>
                        <a href="${s.twitter}" target="_blank" style="color: var(--text-primary); text-decoration: none; border-bottom: 1px dashed var(--text-secondary);">@sulkysubject</a>
                    </div>
                </div>
            </div>
        `;
        viewportContent.innerHTML = html;
    }


    // 3. System Utilities
    function log(msg, type = 'info') {
        const time = new Date().toLocaleTimeString('en-GB');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="timestamp">[${time}]</span> <span class="log-msg ${type === 'error' ? 'error' : ''}">${msg}</span>`;
        logFeed.insertBefore(entry, logFeed.firstChild);
    }

    function updateUptime() {
        const now = new Date();
        const diff = now - startTime;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        uptimeElement.textContent = `${h}:${m}:${s}`;
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        const active = document.querySelector('.nav-item.active');
        if (e.key === 'ArrowDown') {
            const next = active.nextElementSibling;
            if (next) next.click();
        } else if (e.key === 'ArrowUp') {
            const prev = active.previousElementSibling;
            if (prev) prev.click();
        }
    });

    // Init
    try {
        if (typeof portfolioData === 'undefined') {
            throw new Error("Critical: portfolioData is undefined. Check data.js loading.");
        }
        console.log("Portfolio Data Loaded:", portfolioData);
        renderView('profile');
        setInterval(updateUptime, 1000);
        log('System initialized. Welcome, user.');
        log('Loaded portfolioData from data.js');
    } catch (e) {
        console.error(e);
        viewportContent.innerHTML = `<div class="man-text text-red">FATAL ERROR: ${e.message}</div>`;
        log(`FATAL ERROR: ${e.message}`, 'error');
    }
});