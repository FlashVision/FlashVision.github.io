document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavScroll();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initTypingEffect();
    initCategoryFilter();
    initCopyButtons();
});

/* ===== Particle Background ===== */
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }

    const count = Math.min(80, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ===== Nav Scroll ===== */
function initNavScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
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

/* ===== Scroll Reveal ===== */
function initScrollReveal() {
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ===== Animated Counters ===== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-num[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = target * eased;

        if (isDecimal) {
            el.textContent = current.toFixed(1);
        } else {
            el.textContent = Math.floor(current);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = isDecimal ? target.toFixed(1) : target;
        }
    }
    requestAnimationFrame(update);
}

/* ===== Typing Effect ===== */
function initTypingEffect() {
    const cmdEl = document.getElementById('typed-cmd');
    if (!cmdEl) return;

    const commands = [
        'pip install flashdet flashstudio flashseg flashcls',
        'flashdet train --pretrained-coco --lora --epochs 50',
        'flashstudio',
        'flashdet export --format onnx --half',
        'flashdet benchmark --model m --input-size 320'
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = commands[cmdIndex];

        if (!isDeleting) {
            cmdEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === current.length) {
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, 2500);
                return;
            }
            setTimeout(type, 40 + Math.random() * 30);
        } else {
            cmdEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                cmdIndex = (cmdIndex + 1) % commands.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 20);
        }
    }

    setTimeout(type, 1000);
}

/* ===== Category Filter ===== */
function initCategoryFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.mini-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ===== Copy Buttons ===== */
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            if (!code) return;

            navigator.clipboard.writeText(code).then(() => {
                btn.classList.add('copied');
                btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>';

                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
                }, 2000);
            });
        });
    });
}
