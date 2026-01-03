document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('boot-screen');
    const loginScreen = document.getElementById('login-screen');
    const desktop = document.getElementById('desktop');
    const progress = document.querySelector('.progress');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password-input');
    const windowsContainer = document.getElementById('windows-container');
    const clockElement = document.getElementById('clock');
    const activeAppName = document.getElementById('active-app-name');

    const bootLog = document.getElementById('boot-log');

    const bootMessages = [
        { text: "[  0.000000] Initializing Sulkysubject37 Kernel v6.12.0...", type: "info" },
        { text: "[  0.452103] Memory: 64GB LPDDR5x detected", type: "info" },
        { text: "[  0.892341] CPU: Apple M3 Max (16-core) optimized for bioinformatics", type: "info" },
        { text: "[  1.234567] Checking file systems... OK", type: "ok" },
        { text: "[  1.567890] Initializing C++20 Runtime Environment...", type: "info" },
        { text: "[  1.901234] Loading R-Project CRAN libraries: annotaR, BioMoR...", type: "info" },
        { text: "[  2.123456] Mounting network volumes: /mnt/projects/jinxembler", type: "info" },
        { text: "[  2.456789] Starting GVAE Neural Engine...", type: "info" },
        { text: "[  2.789012] Applying Cruel Standard security policies...", type: "warn" },
        { text: "[  3.123456] Hallucination prevention active.", type: "ok" },
        { text: "[  3.456789] Initializing Bio-Desktop Environment...", type: "info" },
        { text: "[  3.890123] Starting Sulkysubject37 UI server...", type: "ok" }
    ];

    function runBootLog() {
        let i = 0;
        const interval = setInterval(() => {
            if (i < bootMessages.length) {
                const line = document.createElement('div');
                line.className = `log-line ${bootMessages[i].type}`;
                line.textContent = bootMessages[i].text;
                bootLog.appendChild(line);
                progress.style.width = `${((i + 1) / bootMessages.length) * 100}%`;
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    bootScreen.classList.add('hidden');
                    loginScreen.classList.remove('hidden');
                }, 800);
            }
        }, 300);
    }

    runBootLog();

    // Login Sequence
    function login() {
        loginScreen.classList.add('hidden');
        desktop.classList.remove('hidden');
        updateClock();
        setInterval(updateClock, 1000);
    }

    loginBtn.addEventListener('click', login);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });

    // Top Bar Interactions
    const wifiIcon = document.getElementById('wifi-icon');
    const batteryIcon = document.getElementById('battery-icon');

    if (wifiIcon) {
        wifiIcon.style.cursor = 'pointer';
        wifiIcon.addEventListener('click', () => {
            window.open(portfolioData.about.social.linkedin, '_blank');
        });
    }

    if (batteryIcon) {
        batteryIcon.style.cursor = 'pointer';
        batteryIcon.addEventListener('click', () => {
            window.openApp('battery');
        });
    }

    // Weather
    async function fetchWeather() {
        const weatherElement = document.getElementById('weather-widget');
        if (!weatherElement) {
            const rightMenu = document.querySelector('.right-menu');
            const weatherSpan = document.createElement('span');
            weatherSpan.id = 'weather-widget';
            weatherSpan.className = 'status-icon';
            weatherSpan.innerHTML = '<i class="fas fa-sun"></i> Loading...';
            weatherSpan.style.cursor = 'pointer';
            weatherSpan.addEventListener('click', () => {
                window.openApp('weather');
            });
            rightMenu.insertBefore(weatherSpan, rightMenu.firstChild);
        }

        try {
            // Default to San Francisco if geolocation fails or is denied
            let lat = 37.7749;
            let lon = -122.4194;

            if (navigator.geolocation) {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                    });
                    lat = position.coords.latitude;
                    lon = position.coords.longitude;
                } catch (e) {
                    console.log("Geolocation denied or failed, using default.");
                }
            }

            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await response.json();
            const temp = Math.round(data.current_weather.temperature);

            const weatherWidget = document.getElementById('weather-widget');
            weatherWidget.innerHTML = `<i class="fas fa-cloud-sun"></i> ${temp}°C`;

        } catch (error) {
            console.error("Weather fetch failed:", error);
        }
    }

    // Clock
    function updateClock() {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        clockElement.textContent = now.toLocaleString('en-US', options).replace(',', '');
    }

    // Initial Weather Fetch
    fetchWeather();
    setInterval(fetchWeather, 600000); // Update every 10 minutes

    // Window Management
    let zIndexCounter = 10;

    window.openApp = function (appName) {
        // Check if window already exists
        const existingWindow = document.getElementById(`window-${appName}`);
        if (existingWindow) {
            if (existingWindow.classList.contains('minimized')) {
                existingWindow.classList.remove('minimized');
            }
            bringToFront(existingWindow);
            return;
        }

        const win = document.createElement('div');
        win.classList.add('window');
        win.id = `window-${appName}`;
        win.style.zIndex = ++zIndexCounter;

        // Random position slightly offset
        const offset = document.querySelectorAll('.window').length * 20;
        win.style.top = `${100 + offset}px`;
        win.style.left = `${100 + offset}px`;

        let content = '';
        let title = '';
        let width = '600px';
        let height = '400px';

        switch (appName) {
            case 'finder':
                title = 'About Me - Finder';

                const educationHtml = portfolioData.education.map(edu => `
                    <div style="margin-bottom: 15px;">
                        <strong>${edu.degree}</strong><br>
                        <span style="color: #bbb;">${edu.institution} | ${edu.duration}</span><br>
                        <span style="font-size: 0.9em; color: #ddd;">${edu.details}</span>
                    </div>
                `).join('');

                const publicationsHtml = portfolioData.publications.map(pub => `
                    <li style="margin-bottom: 10px; font-size: 0.9em; color: #ddd;">${pub}</li>
                `).join('');

                const interestsHtml = portfolioData.interests.join(', ');

                content = `
                    <div class="finder-layout">
                        <div class="sidebar">
                            <div class="sidebar-item active"><i class="fas fa-user"></i> Profile</div>
                            <div class="sidebar-item"><i class="fas fa-graduation-cap"></i> Education</div>
                            <div class="sidebar-item"><i class="fas fa-book"></i> Publications</div>
                            <div class="sidebar-item"><i class="fas fa-star"></i> Interests</div>
                        </div>
                        <div class="main-content" style="overflow-y: auto; padding-right: 10px;">
                            <h1>${portfolioData.about.name}</h1>
                            <h3 style="color: #aaa;">${portfolioData.about.title}</h3>
                            <p style="margin-top: 10px; line-height: 1.6;">${portfolioData.about.bio}</p>
                            
                            <div style="margin-top: 20px;">
                                <p><i class="fas fa-map-marker-alt"></i> ${portfolioData.about.location}</p>
                                <p><i class="fas fa-envelope"></i> ${portfolioData.about.email}</p>
                            </div>

                            <div style="margin-top: 20px; display: flex; gap: 15px;">
                                <a href="${portfolioData.about.social.github}" target="_blank" style="color: #fff; font-size: 24px;"><i class="fab fa-github"></i></a>
                                <a href="${portfolioData.about.social.linkedin}" target="_blank" style="color: #fff; font-size: 24px;"><i class="fab fa-linkedin"></i></a>
                                <a href="${portfolioData.about.social.twitter}" target="_blank" style="color: #fff; font-size: 24px;"><i class="fab fa-twitter"></i></a>
                                <a href="${portfolioData.about.social.blog}" target="_blank" style="color: #fff; font-size: 24px;"><i class="fas fa-blog"></i></a>
                            </div>

                            <hr style="margin: 20px 0; border-color: #444;">

                            <h4 style="margin-bottom: 10px; color: #fff;"><i class="fas fa-graduation-cap"></i> Education</h4>
                            <div>
                                ${educationHtml}
                            </div>

                            <hr style="margin: 20px 0; border-color: #444;">

                            <h4 style="margin-bottom: 10px; color: #fff;"><i class="fas fa-book"></i> Publications</h4>
                            <ul style="padding-left: 20px;">
                                ${publicationsHtml}
                            </ul>

                            <hr style="margin: 20px 0; border-color: #444;">

                            <h4 style="margin-bottom: 10px; color: #fff;"><i class="fas fa-star"></i> Interests</h4>
                            <p style="line-height: 1.6;">${interestsHtml}</p>
                        </div>
                    </div>
                `;
                break;
            case 'safari':
                title = 'Projects - Safari';
                width = '800px';
                height = '500px';
                const projectsHtml = portfolioData.projects.map(p => `
                    <div class="project-card">
                        <div class="project-title">${p.title}</div>
                        <div class="project-tech">${p.tech}</div>
                        <div class="project-desc">${p.description}</div>
                    </div>
                `).join('');
                content = `
                    <div class="safari-content">
                        <div class="url-bar">
                            <i class="fas fa-chevron-left" style="color: #888;"></i>
                            <i class="fas fa-chevron-right" style="color: #888;"></i>
                            <div class="url-input">portfolio.com/projects</div>
                            <i class="fas fa-redo" style="color: #888;"></i>
                        </div>
                        <div class="web-page">
                            <h2 style="margin-bottom: 20px;">My Projects</h2>
                            <div class="projects-grid">
                                ${projectsHtml}
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'terminal':
                title = 'Experience - Terminal';
                width = '600px';
                height = '400px';
                const experienceHtml = portfolioData.experience.map(e => `
                    <p><span class="prompt">➜</span> <span class="command">cat ${e.company.replace(/\s+/g, '_').toLowerCase()}.txt</span></p>
                    <p class="output">
                        Role: ${e.role}<br>
                        Duration: ${e.duration}<br>
                        Description: ${e.description}
                    </p>
                    <br>
                `).join('');
                const skillsHtml = portfolioData.skills.map(s => `<span style="margin-right: 10px;">${s}</span>`).join('');
                content = `
                    <div class="terminal-content">
                        <p>Last login: ${new Date().toDateString()} on ttys000</p>
                        <br>
                        ${experienceHtml}
                        <p><span class="prompt">➜</span> <span class="command">ls skills/</span></p>
                        <p class="output">${skillsHtml}</p>
                        <br>
                        <p><span class="prompt">➜</span> <span class="cursor">_</span></p>
                    </div>
                `;
                break;
            case 'rstudio':
                title = 'RStudio - Environment';
                width = '900px';
                height = '600px';
                content = `
                    <div style="height: 100%; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 2px; background: #eee;">
                        <div style="background: #fff; padding: 10px; font-family: monospace; font-size: 12px; color: #333; overflow: auto; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;">
                            <span style="color: #888;"># Source Editor</span><br>
                            <span style="color: #0000FF;">library</span>(annotaR)<br>
                            <span style="color: #0000FF;">library</span>(BioMoR)<br><br>
                            <span style="color: #008000;"># Load and process data</span><br>
                            data <- load_genomic_intervals("hg38")<br>
                            annotated <- annotate_regions(data, dist=5000)<br><br>
                            <span style="color: #008000;"># Plot results</span><br>
                            plot_enrichment(annotated)<br>
                        </div>
                        <div style="background: #fff; padding: 10px; border-bottom: 1px solid #ddd; display: flex; flex-direction: column;">
                            <div style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 5px; font-size: 11px; color: #666;">Global Environment</div>
                            <div style="font-family: monospace; font-size: 11px;">
                                <div style="display: flex; justify-content: space-between;"><span style="color: #333;">data</span> <span style="color: #888;">Large GRanges (1.2 GB)</span></div>
                                <div style="display: flex; justify-content: space-between;"><span style="color: #333;">annotated</span> <span style="color: #888;">List of 4</span></div>
                                <div style="display: flex; justify-content: space-between;"><span style="color: #333;">model_gvae</span> <span style="color: #888;">Module (PyTorch)</span></div>
                            </div>
                        </div>
                        <div style="background: #fff; padding: 10px; font-family: monospace; font-size: 12px; color: #333; border-right: 1px solid #ddd; overflow: auto;">
                            <span style="color: #888;"># Console</span><br>
                            > summary(annotated)<br>
                            &nbsp;&nbsp;Min. 1st Qu.  Median    Mean 3rd Qu.    Max.<br>
                            &nbsp;&nbsp;0.00    2.00    5.00    8.42   12.00  150.00<br>
                            > install.packages("annotaR")<br>
                            Trying URL 'https://cran.r-project.org/bin/macosx/big-sur-arm64/contrib/4.3/annotaR_0.1.0.tgz'<br>
                            Content type 'application/x-gzip' length 245000 bytes (239 KB)<br>
                            ==================================================<br>
                            downloaded 239 KB<br>
                            > _<span class="cursor">|</span>
                        </div>
                        <div style="background: #fff; padding: 10px; display: flex; justify-content: center; align-items: center; background: #f9f9f9;">
                            <div style="width: 200px; height: 150px; border-left: 1px solid #333; border-bottom: 1px solid #333; position: relative;">
                                <div style="position: absolute; bottom: 0; left: 10px; width: 20px; height: 80px; background: #75aadb;"></div>
                                <div style="position: absolute; bottom: 0; left: 40px; width: 20px; height: 120px; background: #75aadb;"></div>
                                <div style="position: absolute; bottom: 0; left: 70px; width: 20px; height: 60px; background: #75aadb;"></div>
                                <div style="position: absolute; bottom: 0; left: 100px; width: 20px; height: 90px; background: #75aadb;"></div>
                                <div style="position: absolute; bottom: 0; left: 130px; width: 20px; height: 40px; background: #75aadb;"></div>
                                <div style="position: absolute; bottom: -20px; width: 100%; text-align: center; font-size: 10px; color: #666;">Genomic Feature Distribution</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'mail':
                title = 'Contact - Mail';
                content = `
                    <div class="mail-layout">
                        <div class="mail-sidebar">
                            <div class="mail-item">
                                <div class="mail-sender">Inbox</div>
                                <div class="mail-subject">1 New Message</div>
                            </div>
                            <div class="mail-item">
                                <div class="mail-sender">Sent</div>
                            </div>
                            <div class="mail-item">
                                <div class="mail-sender">Drafts</div>
                            </div>
                        </div>
                        <div class="mail-view">
                            <div class="contact-form">
                                <h3>Send me a message</h3>
                                <br>
                                <input type="text" placeholder="To: ${portfolioData.about.email}" disabled>
                                <input type="text" placeholder="Subject">
                                <textarea rows="10" placeholder="Message"></textarea>
                                <button onclick="alert('Message sent! (Demo only)')">Send</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'vscode':
                title = 'Source Code - VS Code';
                width = '700px';
                height = '500px';
                content = `
                    <div class="vscode-layout">
                        <div class="vscode-sidebar">
                            <i class="fas fa-copy"></i>
                            <i class="fas fa-search"></i>
                            <i class="fas fa-code-branch"></i>
                        </div>
                        <div class="vscode-editor">
                            <div class="code-line"><span class="comment">// jinxembler: core/assembler.cpp</span></div>
                            <div class="code-line"><span class="keyword">#include</span> <span class="string">"assembler.hpp"</span></div>
                            <div class="code-line"><span class="keyword">#include</span> <span class="string">&lt;omp.h&gt;</span></div>
                            <br>
                            <div class="code-line"><span class="keyword">namespace</span> jinx {</div>
                            <div class="code-line">&nbsp;&nbsp;<span class="keyword">void</span> <span class="function">Assembler::construct_graph</span>(<span class="keyword">const</span> std::vector&lt;Read&gt;&amp; reads) {</div>
                            <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">// O(N) De Bruijn Graph construction with 2-bit encoding</span></div>
                            <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">#pragma</span> omp parallel for</div>
                            <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span> (<span class="keyword">const</span> <span class="keyword">auto</span>&amp; read : reads) {</div>
                            <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">auto</span> kmers = <span class="function">decompose_to_kmers</span>(read.sequence, 31);</div>
                            <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span> (<span class="keyword">auto</span>&amp; kmer : kmers) {</div>
                            <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="function">atomic_add_node</span>(kmer);</div>
                            <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</div>
                            <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;}</div>
                            <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="function">log_info</span>(<span class="string">"Graph construction complete."</span>);</div>
                            <div class="code-line">&nbsp;&nbsp;}</div>
                            <div class="code-line">}</div>
                        </div>
                    </div>
                `;
                break;
            case 'preview':
                title = 'Resume.pdf - Preview';
                content = `
                    <div style="height: 100%; display: flex; justify-content: center; align-items: center; background: #333; color: #fff;">
                        <p>PDF Preview Placeholder</p>
                        <!-- In a real scenario, you'd embed the PDF here -->
                    </div>
                `;
                break;
            case 'trash':
                title = 'Trash - Inspiration';
                width = '400px';
                height = '300px';
                const randomQuote = portfolioData.quotes[Math.floor(Math.random() * portfolioData.quotes.length)];
                content = `
                    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 30px; text-align: center; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); color: #333;">
                        <i class="fas fa-quote-left" style="font-size: 30px; color: #555; margin-bottom: 20px;"></i>
                        <p style="font-size: 18px; font-style: italic; margin-bottom: 20px;">"${randomQuote.text}"</p>
                        <p style="font-weight: bold;">- ${randomQuote.author}</p>
                        <div style="margin-top: 30px; font-size: 12px; color: #666;">
                            <i class="fas fa-recycle"></i> Trash is empty, but your potential is full.
                        </div>
                    </div>
                `;
                break;
            case 'battery':
                title = 'Battery - Power & Bio';
                width = '450px';
                height = '350px';
                const hardWorkQuote = portfolioData.quotes[Math.floor(Math.random() * portfolioData.quotes.length)];
                const bioQuote = portfolioData.bioQuotes[Math.floor(Math.random() * portfolioData.bioQuotes.length)];
                content = `
                    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 30px; text-align: center; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333;">
                        <i class="fas fa-battery-full" style="font-size: 40px; color: #27c93f; margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 15px;">Power Level: 100%</h3>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="font-size: 16px; font-style: italic;">"${hardWorkQuote.text}"</p>
                            <p style="font-weight: bold; font-size: 12px;">- ${hardWorkQuote.author}</p>
                        </div>
                        
                        <div style="border-top: 1px solid rgba(0,0,0,0.1); padding-top: 15px; width: 100%;">
                            <p style="font-size: 14px; font-weight: 600; margin-bottom: 5px;">Bioinformatics Insight:</p>
                            <p style="font-size: 14px; font-style: italic;">"${bioQuote.text}"</p>
                            <p style="font-weight: bold; font-size: 12px;">- ${bioQuote.author}</p>
                        </div>
                    </div>
                `;
                break;
            case 'weather':
                title = 'Weather - Current Status';
                width = '350px';
                height = '250px';
                const currentTemp = document.getElementById('weather-widget') ? document.getElementById('weather-widget').innerText : 'Loading...';
                content = `
                    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 30px; text-align: center; background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); color: #fff;">
                        <i class="fas fa-cloud-sun" style="font-size: 50px; margin-bottom: 20px;"></i>
                        <h2 style="margin-bottom: 10px;">${currentTemp}</h2>
                        <p style="font-size: 18px;">Current Location</p>
                        <p style="font-size: 14px; opacity: 0.8; margin-top: 5px;">(Based on Browser Geolocation)</p>
                    </div>
                `;
                break;
        }

        win.style.width = width;
        win.style.height = height;

        win.innerHTML = `
            <div class="window-header" onmousedown="dragMouseDown(event, '${win.id}')">
                <div class="window-controls">
                    <div class="control close" onclick="closeWindow('${win.id}')"></div>
                    <div class="control minimize" onclick="minimizeWindow('${win.id}')"></div>
                    <div class="control maximize" onclick="maximizeWindow('${win.id}')"></div>
                </div>
                <div class="window-title">${title}</div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        windowsContainer.appendChild(win);
        activeAppName.textContent = appName.charAt(0).toUpperCase() + appName.slice(1);

        // Add click listener to bring to front
        win.addEventListener('mousedown', () => bringToFront(win));
    };

    window.closeWindow = function (id) {
        const win = document.getElementById(id);
        if (win) win.remove();
        activeAppName.textContent = 'Finder';
    };

    window.minimizeWindow = function (id) {
        const win = document.getElementById(id);
        if (win) win.classList.add('minimized');
    };

    window.maximizeWindow = function (id) {
        const win = document.getElementById(id);
        if (win) {
            if (win.style.width === '100%') {
                win.style.width = '600px';
                win.style.height = '400px';
                win.style.top = '100px';
                win.style.left = '100px';
            } else {
                win.style.width = '100%';
                win.style.height = 'calc(100vh - 30px)'; // Minus menu bar
                win.style.top = '30px';
                win.style.left = '0';
            }
        }
    };

    function bringToFront(win) {
        win.style.zIndex = ++zIndexCounter;
        const title = win.querySelector('.window-title').textContent.split(' - ')[1];
        if (title) activeAppName.textContent = title;
    }

    // Draggable Windows
    function dragMouseDown(e, id) {
        e = e || window.event;
        e.preventDefault();
        const win = document.getElementById(id);
        bringToFront(win);

        let pos3 = e.clientX;
        let pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            let pos1 = pos3 - e.clientX;
            let pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            win.style.top = (win.offsetTop - pos2) + "px";
            win.style.left = (win.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Expose drag function to global scope for the inline event handler
    window.dragMouseDown = dragMouseDown;
});
