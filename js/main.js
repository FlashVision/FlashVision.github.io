document.addEventListener('DOMContentLoaded', () => {
    initGraphBackground();
    initNavScroll();
    initMobileMenu();
    initCategoryFilter();
    initBarChart();
    initGraphTooltip();
    initTypingEffect();
    initClusterEdges();
});

/* ===== Animated Node-Edge Background ===== */
function initGraphBackground() {
    const canvas = document.getElementById('graph-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
    const count = Math.min(60, Math.floor(w / 25));

    for (let i = 0; i < count; i++) {
        nodes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // Draw edges
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (const node of nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Move
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > w) node.vx *= -1;
            if (node.y < 0 || node.y > h) node.vy *= -1;
        }

        requestAnimationFrame(draw);
    }
    draw();
}

/* ===== Nav Scroll ===== */
function initNavScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* ===== Category Filter (removed - using clusters now) ===== */
function initCategoryFilter() {}

/* ===== Cluster Edge Drawing (Canvas) ===== */
function initClusterEdges() {
    const clusters = document.querySelectorAll('.cluster');
    clusters.forEach(cluster => {
        const canvas = document.createElement('canvas');
        canvas.className = 'cluster-canvas';
        cluster.prepend(canvas);

        const color = cluster.dataset.color;
        const hub = cluster.querySelector('.cluster-hub');
        const nodes = cluster.querySelectorAll('.gnode');

        function drawEdges() {
            const rect = cluster.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const hubRect = hub.getBoundingClientRect();
            const hubX = hubRect.left - rect.left + hubRect.width / 2;
            const hubY = hubRect.top - rect.top + hubRect.height;

            const time = Date.now() * 0.002;

            nodes.forEach((node, i) => {
                const nodeRect = node.getBoundingClientRect();
                const nodeX = nodeRect.left - rect.left + nodeRect.width / 2;
                const nodeY = nodeRect.top - rect.top + 18;

                // Draw curved edge
                ctx.beginPath();
                const cpY = hubY + (nodeY - hubY) * 0.4;
                ctx.moveTo(hubX, hubY);
                ctx.quadraticCurveTo(hubX + (nodeX - hubX) * 0.2, cpY, nodeX, nodeY);
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.25;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Animated data particle along the edge
                ctx.globalAlpha = 0.8;
                const t = ((time + i * 0.8) % 3) / 3;
                const px = hubX + (nodeX - hubX) * t + Math.sin(t * Math.PI) * (nodeX - hubX) * 0.1 * (1 - t);
                const py = hubY + (nodeY - hubY) * t;
                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // Glow on particle
                ctx.beginPath();
                ctx.arc(px, py, 5, 0, Math.PI * 2);
                ctx.globalAlpha = 0.2;
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        }

        function animate() {
            drawEdges();
            requestAnimationFrame(animate);
        }

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animate();
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        observer.observe(cluster);
    });
}

/* ===== Bar Chart Animation ===== */
function initBarChart() {
    const bars = document.querySelectorAll('.bench-bar[data-width]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    bars.forEach(bar => observer.observe(bar));
}

/* ===== Graph Tooltip ===== */
function initGraphTooltip() {
    const svg = document.getElementById('ecosystem-graph');
    const tooltip = document.getElementById('graph-tooltip');
    if (!svg || !tooltip) return;

    const nodes = svg.querySelectorAll('.graph-node');
    nodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            const name = node.dataset.name || node.dataset.label || '';
            if (!name) return;
            tooltip.textContent = name;
            tooltip.style.opacity = '1';
            const rect = svg.getBoundingClientRect();
            const nodeRect = node.getBoundingClientRect();
            tooltip.style.left = (nodeRect.left - rect.left + nodeRect.width / 2) + 'px';
            tooltip.style.top = (nodeRect.top - rect.top - 36) + 'px';
        });
        node.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // Animate particles along edges
    initGraphParticles(svg);
}

/* ===== Animated Particles Flowing Along Edges ===== */
function initGraphParticles(svg) {
    const wrapper = svg.closest('.graph-wrapper');
    if (!wrapper) return;

    let particleCanvas = wrapper.querySelector('.graph-particles');
    if (!particleCanvas) {
        particleCanvas = document.createElement('canvas');
        particleCanvas.className = 'graph-particles';
        wrapper.appendChild(particleCanvas);
    }

    const edges = [
        {x1:450,y1:260,x2:200,y2:120,color:'#6366f1'},
        {x1:450,y1:260,x2:700,y2:120,color:'#06b6d4'},
        {x1:450,y1:260,x2:150,y2:380,color:'#f59e0b'},
        {x1:450,y1:260,x2:750,y2:380,color:'#10b981'},
        {x1:450,y1:260,x2:450,y2:470,color:'#ec4899'},
        {x1:200,y1:120,x2:80,y2:60,color:'#6366f1'},
        {x1:200,y1:120,x2:120,y2:180,color:'#6366f1'},
        {x1:200,y1:120,x2:280,y2:50,color:'#6366f1'},
        {x1:200,y1:120,x2:310,y2:160,color:'#6366f1'},
        {x1:700,y1:120,x2:620,y2:50,color:'#06b6d4'},
        {x1:700,y1:120,x2:790,y2:55,color:'#06b6d4'},
        {x1:700,y1:120,x2:820,y2:160,color:'#06b6d4'},
        {x1:700,y1:120,x2:610,y2:175,color:'#06b6d4'},
        {x1:150,y1:380,x2:60,y2:340,color:'#f59e0b'},
        {x1:150,y1:380,x2:80,y2:440,color:'#f59e0b'},
        {x1:150,y1:380,x2:250,y2:430,color:'#f59e0b'},
        {x1:750,y1:380,x2:830,y2:330,color:'#10b981'},
        {x1:750,y1:380,x2:850,y2:420,color:'#10b981'},
        {x1:750,y1:380,x2:680,y2:440,color:'#10b981'},
        {x1:450,y1:470,x2:370,y2:500,color:'#ec4899'},
        {x1:450,y1:470,x2:530,y2:500,color:'#ec4899'},
    ];

    const particles = edges.map((e, i) => ({
        edge: e,
        t: (i * 0.15) % 1,
        speed: 0.003 + Math.random() * 0.004,
        size: 2 + Math.random() * 1.5
    }));

    function resize() {
        const rect = wrapper.getBoundingClientRect();
        particleCanvas.width = rect.width - 48;
        particleCanvas.height = rect.height - 48;
    }
    resize();
    window.addEventListener('resize', resize);

    const ctx = particleCanvas.getContext('2d');
    const svgVB = {w: 900, h: 520};

    function draw() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        const scaleX = particleCanvas.width / svgVB.w;
        const scaleY = particleCanvas.height / svgVB.h;

        particles.forEach(p => {
            p.t += p.speed;
            if (p.t > 1) p.t = 0;

            const x = (p.edge.x1 + (p.edge.x2 - p.edge.x1) * p.t) * scaleX;
            const y = (p.edge.y1 + (p.edge.y2 - p.edge.y1) * p.t) * scaleY;

            // Particle glow
            ctx.beginPath();
            ctx.arc(x, y, p.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = p.edge.color;
            ctx.globalAlpha = 0.15;
            ctx.fill();

            // Particle core
            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.edge.color;
            ctx.globalAlpha = 0.9;
            ctx.fill();

            // Trail
            const trail = 0.05;
            const tx = (p.edge.x1 + (p.edge.x2 - p.edge.x1) * Math.max(0, p.t - trail)) * scaleX;
            const ty = (p.edge.y1 + (p.edge.y2 - p.edge.y1) * Math.max(0, p.t - trail)) * scaleY;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(x, y);
            ctx.strokeStyle = p.edge.color;
            ctx.globalAlpha = 0.4;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }

    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            draw();
            obs.disconnect();
        }
    }, {threshold: 0.1});
    obs.observe(wrapper);
}

/* ===== Typing Effect ===== */
function initTypingEffect() {
    const el = document.getElementById('typed-cmd');
    if (!el) return;
    // No typing effect in this version - keeping it clean
}
