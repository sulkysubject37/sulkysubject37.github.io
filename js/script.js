document.addEventListener('DOMContentLoaded', () => {
    // --- Boot Sequence ---
    const bootOverlay = document.getElementById('boot-overlay');
    const bootBar = document.getElementById('boot-bar');
    const bootPercent = document.getElementById('boot-percent');
    const initLog = document.getElementById('init-log');
    const mainContainer = document.querySelector('.tangle-container');
    const statusBar = document.querySelector('.status-bar');

    let progress = 0.37;
    const target = 37.00;
    
    // Fake boot messages
    const bootLogs = [
        "Initializing SulkyOS Kernel...",
        "Mounting /dev/nvme0n1...",
        "Loading drivers: nvidiagpu, tpu, mlx...",
        "Checking integrity of 'Cruel Standard'...",
        "[OK] Cruel Standard Verified.",
        "Establishing neural link...",
        "Allocating heap memory...",
        "Decompressing bio-modules...",
        "Detecting user entropy...",
        "System state: HAZARDOUS.",
        "Breaking security lock...",
        "Accessing Tangle Interface...",
        "Executing: ./init_shell.sh"
    ];

    function runBoot() {
        const interval = setInterval(() => {
            // Randomize increment for "glitchy" feel
            progress += Math.random() * 0.5;
            
            if (progress >= target) {
                progress = target;
                clearInterval(interval);
                finalizeBoot();
            }

            // Update UI
            bootBar.style.width = `${progress}%`;
            bootPercent.textContent = `${progress.toFixed(2)}%`;

            // Randomly log messages based on progress
            if (Math.random() > 0.8 && bootLogs.length > 0) {
                const msg = bootLogs.shift();
                const p = document.createElement('div');
                p.textContent = `> ${msg}`;
                initLog.prepend(p);
            }

        }, 30);
    }

    function finalizeBoot() {
        // The "Stop" moment
        bootPercent.textContent = "37.00% [THRESHOLD]";
        bootPercent.style.color = "var(--accent-red)";
        
        setTimeout(() => {
            // Fade out boot screen
            bootOverlay.style.opacity = '0';
            bootOverlay.style.transition = 'opacity 0.5s ease-out';
            
            setTimeout(() => {
                bootOverlay.style.display = 'none';
                // Reveal main UI
                mainContainer.style.opacity = '1';
                statusBar.style.opacity = '1';
                log('System boot completed at 37% threshold.', 'warn');
            }, 500);
        }, 800);
    }

    // Start Boot immediately
    runBoot();


    // --- Main Application Logic ---
    const viewportTitle = document.getElementById('viewport-title');
    const viewportContent = document.getElementById('viewport-content');
    const navItems = document.querySelectorAll('.nav-item');
    const logFeed = document.getElementById('log-feed');
    const uptimeElement = document.getElementById('uptime');

    // State
    let currentView = 'profile';
    let isCruelMode = false;
    let projectSearchQuery = '';
    let activeTechFilter = 'ALL';
    const startTime = new Date();

    const modeSwitch = document.getElementById('mode-switch');
    const modeIndicator = document.getElementById('mode-indicator');

    // Konami Code State
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

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

            // Reset filters when switching to projects
            if (item.dataset.target === 'projects') {
                projectSearchQuery = '';
                activeTechFilter = 'ALL';
            }

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
        console.log("Rendering view:", view); // Debug Log
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
            case 'terminal':
                renderTerminal();
                break;
            case 'experience':
                renderExperience();
                break;
            case 'blog':
                renderBlog();
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

    function renderBlog() {
        const html = `
            <div class="man-page">
                <div class="man-section">
                    <div class="section-title">BLOG_ENTRIES (LATEST_FIRST)</div>
                    <div class="blog-list">
                        ${portfolioData.posts.map(post => `
                            <div class="blog-entry" style="margin-bottom: 25px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
                                <div class="blog-date" style="color: var(--text-secondary); font-size: 12px; margin-bottom: 5px;">[${post.date}]</div>
                                <div class="blog-title" style="color: var(--accent-blue); font-weight: bold; font-size: 18px; margin-bottom: 8px;">
                                    <a href="${post.link}" target="_blank" style="color: inherit; text-decoration: none;">${post.title}</a>
                                </div>
                                <div class="blog-summary" style="color: var(--text-primary); font-size: 14px; line-height: 1.5;">
                                    ${post.summary}
                                </div>
                                <div style="margin-top: 10px;">
                                    <a href="${post.link}" target="_blank" style="color: var(--accent-green); text-decoration: none; font-size: 12px;">[READ_FULL_ARTICLE]</a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        viewportContent.innerHTML = html;
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
        // Extract unique tech tags
        const allTech = new Set();
        portfolioData.projects.forEach(p => {
            p.tech.split(',').forEach(t => allTech.add(t.trim()));
        });
        const topTech = ['ALL', 'C++', 'R', 'Python', 'Swift', 'AI', 'Bioinformatics']; // Curated list or dynamic

        const filteredProjects = portfolioData.projects.filter(proj => {
            const matchesSearch = proj.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) || 
                                proj.tech.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                                proj.description.toLowerCase().includes(projectSearchQuery.toLowerCase());
            
            const matchesFilter = activeTechFilter === 'ALL' || proj.tech.includes(activeTechFilter);
            
            return matchesSearch && matchesFilter;
        });

        const rows = filteredProjects.map(proj => {
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
                    <div class="section-title">PROJECT_INDEX [${filteredProjects.length}/${portfolioData.projects.length}]</div>
                    
                    <div class="project-controls">
                        <input type="text" class="search-input" id="project-search" placeholder="SEARCH_PROJECTS..." value="${projectSearchQuery}">
                        <div class="filter-tags">
                            ${topTech.map(tech => `
                                <span class="filter-tag ${activeTechFilter === tech ? 'active' : ''}" data-tech="${tech}">${tech}</span>
                            `).join('')}
                        </div>
                    </div>

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
                            ${rows || '<tr><td colspan="4" style="text-align:center; padding: 20px;">NO_RESULTS_FOUND</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        viewportContent.innerHTML = html;

        // Attach listeners
        const searchInput = document.getElementById('project-search');
        searchInput.focus();
        // Move cursor to end
        searchInput.setSelectionRange(projectSearchQuery.length, projectSearchQuery.length);

        searchInput.addEventListener('input', (e) => {
            projectSearchQuery = e.target.value;
            renderProjects();
        });

        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                activeTechFilter = tag.dataset.tech;
                renderProjects();
            });
        });
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

    function renderTerminal() {
        const html = `
            <div class="terminal-view" id="terminal-view">
                <div class="terminal-output" id="terminal-output">
                    <div class="cmd-response">Welcome to SulkyOS Shell v2.0.1\nType 'help' for available commands.</div>
                </div>
                <div class="cmd-line">
                    <span class="cmd-prompt">user@sulky:~ $</span>
                    <div class="cmd-input-container">
                        <input type="text" class="cmd-input" id="cmd-input" autocomplete="off" autofocus>
                    </div>
                </div>
            </div>
        `;
        viewportContent.innerHTML = html;

        const input = document.getElementById('cmd-input');
        const output = document.getElementById('terminal-output');

        input.focus();
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                if (cmd) {
                    executeCommand(cmd, output);
                }
                input.value = '';
            }
        });
        
        // Keep focus
        document.getElementById('terminal-view').addEventListener('click', () => {
             input.focus();
        });
    }

    function executeCommand(cmd, output) {
        // Echo command
        const cmdNode = document.createElement('div');
        cmdNode.className = 'cmd-line';
        cmdNode.innerHTML = `<span class="cmd-prompt">user@sulky:~ $</span> <span>${cmd}</span>`;
        output.appendChild(cmdNode);

        // Process Command
        let response = '';
        let type = 'cmd-response';
        const parts = cmd.split(' ');
        const baseCmd = parts[0].toLowerCase();

        switch(baseCmd) {
            case 'help':
                response = `Available commands:
  about          Show short bio
  skills         List professional & personal skills
  projects list  Show project index with summaries
  blog           List latest blog posts
  open [name]    Open project link in new tab
  contact        Display email and social protocols
  ls             List files in current directory
  whoami         Display current user session
  clear          Clear the terminal screen
  cat [file]     Display file content`;
                break;
            case 'about':
                response = isCruelMode ? portfolioData.about.cruelBio : portfolioData.about.bio;
                break;
            case 'blog':
                response = portfolioData.posts.map(p => `[${p.date}] ${p.title}`).join('\n');
                break;
            case 'skills':
                response = `PROFESSIONAL:\n${portfolioData.skills.join(', ')}\n\nPERSONAL:\nPhotography, Music Production, Linguistics (Multilingual)`;
                break;
            case 'project':
            case 'projects':
                if (parts[1] === 'list') {
                    response = portfolioData.projects.map(p => `[${p.title}]\n  ${p.description}`).join('\n\n');
                } else {
                    response = "usage: projects list";
                }
                break;
            case 'open':
                const projName = parts.slice(1).join(' ').toLowerCase();
                if (!projName) {
                    response = "usage: open [project_name]";
                } else {
                    const project = portfolioData.projects.find(p => p.title.toLowerCase().includes(projName));
                    if (project && project.link !== '#') {
                        window.open(project.link, '_blank');
                        response = `Opening ${project.title} in new tab...`;
                        type = 'cmd-success';
                    } else if (project) {
                        response = `Project '${project.title}' has no external link available.`;
                        type = 'cmd-error';
                    } else {
                        response = `Project '${projName}' not found. Use 'projects list' to see names.`;
                        type = 'cmd-error';
                    }
                }
                break;
            case 'contact':
                const s = portfolioData.about.social;
                response = `EMAIL: ${portfolioData.about.email}\nGITHUB: ${s.github}\nLINKEDIN: ${s.linkedin}\nTWITTER: ${s.twitter}`;
                break;
            case 'ls':
                response = `Projects:\n${portfolioData.projects.map(p => '  ' + p.title).join('\n')}\n\nFiles:\n  bio.txt\n  skills.json\n  contact.sh`;
                break;
            case 'whoami':
                response = 'guest_user';
                break;
            case 'clear':
                output.innerHTML = '';
                return;
            case 'sudo':
                response = 'user is not in the sudoers file. This incident will be reported.';
                type = 'cmd-error';
                break;
            case 'cat':
                if (parts[1] === 'bio' || parts[1] === 'bio.txt') {
                    response = portfolioData.about.bio;
                } else if (parts[1] === 'skills' || parts[1] === 'skills.json') {
                     response = JSON.stringify(portfolioData.skills, null, 2);
                } else if (parts[1]) {
                    response = `cat: ${parts[1]}: No such file or directory`;
                    type = 'cmd-error';
                } else {
                    response = 'usage: cat [file]';
                }
                break;
            default:
                response = `bash: ${baseCmd}: command not found`;
                type = 'cmd-error';
        }

        const respNode = document.createElement('div');
        respNode.className = type;
        respNode.innerText = response;
        output.appendChild(respNode);
        
        // Auto-scroll
        output.scrollTop = output.scrollHeight;
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

    // Keyboard Navigation & Konami Code
    document.addEventListener('keydown', (e) => {
        // Konami Code Logic
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateGodMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0; // Reset if key doesn't match
        }

        // Arrow Navigation (only if not in terminal)
        if (currentView !== 'terminal') {
            const active = document.querySelector('.nav-item.active');
            if (e.key === 'ArrowDown') {
                const next = active.nextElementSibling;
                if (next) next.click();
            } else if (e.key === 'ArrowUp') {
                const prev = active.previousElementSibling;
                if (prev) prev.click();
            }
        }
    });

    function activateGodMode() {
        document.body.classList.add('god-mode');
        log('GOD MODE ACTIVATED. ACCESS GRANTED.', 'success');
        alert("GOD MODE ACTIVATED // WELCOME TO THE MATRIX");
    }

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
