document.addEventListener('DOMContentLoaded', () => {
    initGraphBackground();
    initHeroParticles();
    initClusterCanvases();
    initBenchmarkCanvas();
    initPipelineCanvas();
    initNavScroll();
});

/* ====== Full-page Network Background ====== */
function initGraphBackground() {
    const canvas = document.getElementById('graph-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight * 3;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
    const count = Math.min(80, Math.floor(w / 20));

    for (let i = 0; i < count; i++) {
        nodes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            r: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.04 * (1 - dist / 180)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        for (const node of nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.globalAlpha = 0.25;
            ctx.fill();
            ctx.globalAlpha = 1;

            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > w) node.vx *= -1;
            if (node.y < 0 || node.y > h) node.vy *= -1;
        }

        requestAnimationFrame(draw);
    }
    draw();
}

/* ====== Hero Edge Particles ====== */
function initHeroParticles() {
    const canvas = document.getElementById('hero-edges-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const svgVB = { w: 1200, h: 700 };

    const edges = [
        { x1: 600, y1: 350, x2: 280, y2: 180, color: '#6366f1' },
        { x1: 600, y1: 350, x2: 920, y2: 180, color: '#06b6d4' },
        { x1: 600, y1: 350, x2: 200, y2: 520, color: '#f59e0b' },
        { x1: 600, y1: 350, x2: 1000, y2: 520, color: '#10b981' },
        { x1: 600, y1: 350, x2: 600, y2: 620, color: '#ec4899' },
        { x1: 280, y1: 180, x2: 130, y2: 90, color: '#6366f1' },
        { x1: 280, y1: 180, x2: 100, y2: 180, color: '#6366f1' },
        { x1: 280, y1: 180, x2: 140, y2: 270, color: '#6366f1' },
        { x1: 280, y1: 180, x2: 340, y2: 70, color: '#6366f1' },
        { x1: 280, y1: 180, x2: 420, y2: 110, color: '#6366f1' },
        { x1: 280, y1: 180, x2: 400, y2: 240, color: '#6366f1' },
        { x1: 280, y1: 180, x2: 220, y2: 290, color: '#6366f1' },
        { x1: 280, y1: 180, x2: 180, y2: 310, color: '#6366f1' },
        { x1: 920, y1: 180, x2: 820, y2: 80, color: '#06b6d4' },
        { x1: 920, y1: 180, x2: 1020, y2: 80, color: '#06b6d4' },
        { x1: 920, y1: 180, x2: 1060, y2: 180, color: '#06b6d4' },
        { x1: 920, y1: 180, x2: 1040, y2: 270, color: '#06b6d4' },
        { x1: 920, y1: 180, x2: 820, y2: 280, color: '#06b6d4' },
        { x1: 920, y1: 180, x2: 920, y2: 290, color: '#06b6d4' },
        { x1: 200, y1: 520, x2: 80, y2: 450, color: '#f59e0b' },
        { x1: 200, y1: 520, x2: 70, y2: 560, color: '#f59e0b' },
        { x1: 200, y1: 520, x2: 150, y2: 630, color: '#f59e0b' },
        { x1: 200, y1: 520, x2: 300, y2: 620, color: '#f59e0b' },
        { x1: 200, y1: 520, x2: 330, y2: 480, color: '#f59e0b' },
        { x1: 1000, y1: 520, x2: 1100, y2: 440, color: '#10b981' },
        { x1: 1000, y1: 520, x2: 1120, y2: 560, color: '#10b981' },
        { x1: 1000, y1: 520, x2: 1050, y2: 630, color: '#10b981' },
        { x1: 1000, y1: 520, x2: 910, y2: 620, color: '#10b981' },
        { x1: 600, y1: 620, x2: 510, y2: 670, color: '#ec4899' },
        { x1: 600, y1: 620, x2: 690, y2: 670, color: '#ec4899' },
    ];

    const particles = [];
    edges.forEach((e, i) => {
        particles.push({
            edge: e,
            t: (i * 0.07) % 1,
            speed: 0.003 + Math.random() * 0.004,
            size: 2 + Math.random() * 1.5
        });
        if (i < 5) {
            particles.push({
                edge: e,
                t: ((i * 0.07) + 0.5) % 1,
                speed: 0.002 + Math.random() * 0.003,
                size: 2.5 + Math.random() * 1.5
            });
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scaleX = canvas.width / svgVB.w;
        const scaleY = canvas.height / svgVB.h;

        particles.forEach(p => {
            p.t += p.speed;
            if (p.t > 1) p.t = 0;

            const x = (p.edge.x1 + (p.edge.x2 - p.edge.x1) * p.t) * scaleX;
            const y = (p.edge.y1 + (p.edge.y2 - p.edge.y1) * p.t) * scaleY;

            ctx.beginPath();
            ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = p.edge.color;
            ctx.globalAlpha = 0.1;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.edge.color;
            ctx.globalAlpha = 0.9;
            ctx.fill();

            const trail = 0.06;
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
    draw();
}

/* ====== Cluster Mini-Graph Canvases ====== */
function initClusterCanvases() {
    const categoryData = {
        vision: { color: '#6366f1', nodes: ['Det', 'Seg', 'Cls', 'OCR', 'Pose', 'Track', 'Depth', 'Face'] },
        genai: { color: '#06b6d4', nodes: ['LLM', 'VLM', 'Diff', 'Video', '3D', 'Audio'] },
        infra: { color: '#f59e0b', nodes: ['Optim', 'Edge', 'Infer', 'DownUP', 'Fusion'] },
        applied: { color: '#10b981', nodes: ['Med', 'RAG', 'Agent', 'RL'] },
        tools: { color: '#ec4899', nodes: ['Train', 'Studio'] }
    };

    document.querySelectorAll('.cluster-canvas').forEach(canvas => {
        const cat = canvas.dataset.category;
        const data = categoryData[cat];
        if (!data) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);

        const cw = rect.width;
        const ch = rect.height;
        const cx = cw / 2;
        const cy = ch / 2;
        const hubR = 18;
        const leafR = 12;
        const orbitR = Math.min(cw, ch) * 0.35;

        const leafNodes = data.nodes.map((name, i) => {
            const angle = (i / data.nodes.length) * Math.PI * 2 - Math.PI / 2;
            return {
                x: cx + Math.cos(angle) * orbitR,
                y: cy + Math.sin(angle) * orbitR,
                name
            };
        });

        const particles = leafNodes.map((_, i) => ({
            t: (i * 0.15) % 1,
            speed: 0.004 + Math.random() * 0.003
        }));

        function draw() {
            ctx.clearRect(0, 0, cw, ch);

            ctx.beginPath();
            ctx.arc(cx, cy, orbitR + 20, 0, Math.PI * 2);
            ctx.fillStyle = data.color + '06';
            ctx.fill();

            leafNodes.forEach(leaf => {
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(leaf.x, leaf.y);
                ctx.strokeStyle = data.color;
                ctx.globalAlpha = 0.2;
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
            });

            particles.forEach((p, i) => {
                p.t += p.speed;
                if (p.t > 1) p.t = 0;
                const leaf = leafNodes[i % leafNodes.length];
                const px = cx + (leaf.x - cx) * p.t;
                const py = cy + (leaf.y - cy) * p.t;

                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = data.color;
                ctx.globalAlpha = 0.8;
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            ctx.beginPath();
            ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
            ctx.fillStyle = '#0c0d14';
            ctx.fill();
            ctx.strokeStyle = data.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = data.color;
            ctx.font = '600 8px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cat.toUpperCase(), cx, cy);

            leafNodes.forEach(leaf => {
                ctx.beginPath();
                ctx.arc(leaf.x, leaf.y, leafR, 0, Math.PI * 2);
                ctx.fillStyle = '#111218';
                ctx.fill();
                ctx.strokeStyle = data.color;
                ctx.lineWidth = 1.2;
                ctx.stroke();

                ctx.fillStyle = '#ccc';
                ctx.font = '500 7px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(leaf.name, leaf.x, leaf.y);
            });

            requestAnimationFrame(draw);
        }
        draw();
    });
}

/* ====== Benchmark Scatter/Node Canvas ====== */
function initBenchmarkCanvas() {
    const canvas = document.getElementById('bench-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const cw = rect.width;
    const ch = rect.height;

    const models = [
        { name: 'FlashCls-M', fps: 245, params: 0.58, color: '#06b6d4' },
        { name: 'FlashOCR-M', fps: 156, params: 0.82, color: '#10b981' },
        { name: 'FlashDet-M', fps: 142, params: 0.95, color: '#6366f1' },
        { name: 'FlashSeg-M', fps: 118, params: 1.1, color: '#f59e0b' },
        { name: 'FlashDet-1.5x', fps: 97, params: 2.44, color: '#ec4899' }
    ];

    const maxFps = 245;
    const maxParams = 2.5;
    const padding = 50;

    const nodePositions = models.map(m => ({
        x: padding + ((m.params / maxParams) * (cw - padding * 2)),
        y: ch - padding - ((m.fps / maxFps) * (ch - padding * 2)),
        r: 10 + (m.fps / maxFps) * 25,
        ...m
    }));

    const particles = [];
    for (let i = 0; i < nodePositions.length - 1; i++) {
        particles.push({
            from: nodePositions[i],
            to: nodePositions[i + 1],
            t: Math.random(),
            speed: 0.005 + Math.random() * 0.003
        });
    }

    let time = 0;

    function draw() {
        time += 0.02;
        ctx.clearRect(0, 0, cw, ch);

        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i / 5) * (ch - padding * 2);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(cw - padding, y);
            ctx.stroke();
        }
        for (let i = 0; i <= 5; i++) {
            const x = padding + (i / 5) * (cw - padding * 2);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, ch - padding);
            ctx.stroke();
        }

        ctx.fillStyle = '#4b5563';
        ctx.font = '500 9px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Params (M) →', cw / 2, ch - 12);
        ctx.save();
        ctx.translate(14, ch / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('FPS →', 0, 0);
        ctx.restore();

        for (let i = 0; i < nodePositions.length - 1; i++) {
            const a = nodePositions[i];
            const b = nodePositions[i + 1];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        particles.forEach(p => {
            p.t += p.speed;
            if (p.t > 1) p.t = 0;
            const px = p.from.x + (p.to.x - p.from.x) * p.t;
            const py = p.from.y + (p.to.y - p.from.y) * p.t;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#6366f1';
            ctx.globalAlpha = 0.7;
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        nodePositions.forEach(node => {
            const pulse = 1 + Math.sin(time + node.x * 0.01) * 0.08;

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r * pulse * 1.4, 0, Math.PI * 2);
            ctx.fillStyle = node.color + '15';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r * pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#0c0d14';
            ctx.fill();
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#f0f0f5';
            ctx.font = '600 8px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.fps + '', node.x, node.y - 4);
            ctx.fillStyle = '#9ca3af';
            ctx.font = '400 6px Inter';
            ctx.fillText('FPS', node.x, node.y + 7);
        });

        requestAnimationFrame(draw);
    }
    draw();
}

/* ====== Pipeline Particle Canvas ====== */
function initPipelineCanvas() {
    const container = document.querySelector('.pipeline-graph');
    const canvas = document.getElementById('pipeline-canvas');
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

    const particles = [];
    for (let i = 0; i < 3; i++) {
        for (let seg = 0; seg < 3; seg++) {
            particles.push({
                seg,
                t: (i * 0.33) % 1,
                speed: 0.006 + Math.random() * 0.004,
                size: 2 + Math.random() * 1.5
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const nodes = document.querySelectorAll('.pipeline-circle');
        if (nodes.length < 4) { requestAnimationFrame(draw); return; }

        const positions = Array.from(nodes).map(n => {
            const r = n.getBoundingClientRect();
            const cr = container.getBoundingClientRect();
            return {
                x: r.left - cr.left + r.width / 2,
                y: r.top - cr.top + r.height / 2
            };
        });

        for (let i = 0; i < positions.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[i + 1].x, positions[i + 1].y);
            ctx.strokeStyle = colors[i] + '20';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        particles.forEach(p => {
            p.t += p.speed;
            if (p.t > 1) p.t = 0;
            const a = positions[p.seg];
            const b = positions[p.seg + 1];
            if (!a || !b) return;
            const px = a.x + (b.x - a.x) * p.t;
            const py = a.y + (b.y - a.y) * p.t;

            ctx.beginPath();
            ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = colors[p.seg];
            ctx.globalAlpha = 0.15;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fillStyle = colors[p.seg];
            ctx.globalAlpha = 0.9;
            ctx.fill();

            ctx.globalAlpha = 1;
        });

        requestAnimationFrame(draw);
    }
    draw();
}

/* ====== Nav Scroll Behavior ====== */
function initNavScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > 100) {
            nav.style.background = 'rgba(10, 11, 16, 0.95)';
            nav.style.borderColor = 'rgba(255,255,255,0.1)';
        } else {
            nav.style.background = 'rgba(10, 11, 16, 0.8)';
            nav.style.borderColor = 'rgba(255,255,255,0.06)';
        }
        lastScroll = current;
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
