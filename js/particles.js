/* ================================================================
   FlightSuite — Interactive Particle Background
   Mouse-reactive magnetic vortex + scroll-driven morphing states
   Particles reflect the narrative: chaos → order → convergence
   ================================================================ */

(function() {
    'use strict';

    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let particles = [];
    let animationFrameId;
    const mouse = { x: -1000, y: -1000 };

    // Generative seed integration
    const genSeed = window.__flightSeed || {};
    const driftBias = genSeed.particleDriftBias || 1;
    const vortexDir = genSeed.vortexDirection || 1;

    const PARTICLE_COUNT = window.innerWidth < 768 ? 150 : 300;
    const MAGNETIC_RADIUS = 200;
    const VORTEX_STRENGTH = 0.04;
    const PULL_STRENGTH = 0.06;

    const COLORS = [
        '94, 92, 230',   // purple
        '0, 113, 227',   // blue
        '34, 211, 238',  // cyan
        '255, 255, 255', // white
        '120, 120, 140', // muted
    ];

    // --- Morphing States ---
    // Each section triggers a different particle behavior
    const STATES = {
        hero:         { drift: 0.5,  damping: 0.96, alphaBoost: 0,    gridStrength: 0,   convergeStrength: 0,   expandStrength: 0 },
        pain:         { drift: 0.08, damping: 0.985, alphaBoost: 0.1,  gridStrength: 0,   convergeStrength: 0.3, expandStrength: 0 },
        demo:         { drift: 0.02, damping: 0.99,  alphaBoost: 0.05, gridStrength: 0.6, convergeStrength: 0,   expandStrength: 0 },
        capabilities: { drift: 0.15, damping: 0.97,  alphaBoost: 0.08, gridStrength: 0,   convergeStrength: 0.5, expandStrength: 0 },
        cta:          { drift: 0.3,  damping: 0.95,  alphaBoost: 0.15, gridStrength: 0,   convergeStrength: 0,   expandStrength: 0.4 },
    };

    let currentState = STATES.hero;
    let targetState = STATES.hero;
    let lerpedState = { ...STATES.hero };

    // Smoothly interpolate between states
    function lerpState() {
        const speed = 0.03;
        for (const key in lerpedState) {
            lerpedState[key] += (targetState[key] - lerpedState[key]) * speed;
        }
    }

    // Grid target positions (computed once per resize)
    let gridPositions = [];
    function computeGrid() {
        gridPositions = [];
        const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (width / height)));
        const rows = Math.ceil(PARTICLE_COUNT / cols);
        const cellW = width / cols;
        const cellH = height / rows;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            gridPositions.push({
                x: cellW * (col + 0.5),
                y: cellH * (row + 0.5)
            });
        }
    }

    class Particle {
        constructor(index) {
            this.index = index;
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.3;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.4 + 0.05;
            this.baseAlpha = this.alpha;
            this.frictionGlow = 0;
        }

        update() {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Mouse magnetic interaction
            if (dist < MAGNETIC_RADIUS) {
                const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;
                this.vx += (dx / dist) * force * PULL_STRENGTH;
                this.vy += (dy / dist) * force * PULL_STRENGTH;
                this.vx += (dy / dist) * force * VORTEX_STRENGTH * 8 * vortexDir;
                this.vy -= (dx / dist) * force * VORTEX_STRENGTH * 8 * vortexDir;
                this.frictionGlow = force * 0.6;
            } else {
                this.frictionGlow *= 0.94;
            }

            // Grid pull — particles drift toward grid positions
            if (lerpedState.gridStrength > 0.01 && gridPositions[this.index]) {
                const gp = gridPositions[this.index];
                this.vx += (gp.x - this.x) * lerpedState.gridStrength * 0.01;
                this.vy += (gp.y - this.y) * lerpedState.gridStrength * 0.01;
            }

            // Converge — pull toward center
            if (lerpedState.convergeStrength > 0.01) {
                const cx = width / 2;
                const cy = height / 2;
                this.vx += (cx - this.x) * lerpedState.convergeStrength * 0.002;
                this.vy += (cy - this.y) * lerpedState.convergeStrength * 0.002;
            }

            // Expand — push away from center
            if (lerpedState.expandStrength > 0.01) {
                const cx = width / 2;
                const cy = height / 2;
                const edx = this.x - cx;
                const edy = this.y - cy;
                const eDist = Math.sqrt(edx * edx + edy * edy) || 1;
                this.vx += (edx / eDist) * lerpedState.expandStrength * 0.15;
                this.vy += (edy / eDist) * lerpedState.expandStrength * 0.15;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Damping
            this.vx *= lerpedState.damping;
            this.vy *= lerpedState.damping;

            // Drift
            this.vx += (Math.random() - 0.5) * lerpedState.drift * 0.1 * driftBias;
            this.vy += (Math.random() - 0.5) * lerpedState.drift * 0.1 * driftBias;

            // Wrap edges
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
        }

        draw() {
            this.drawWithEmotion(0);
        }

        drawWithEmotion(warmShift) {
            const a = Math.min(this.baseAlpha + this.frictionGlow + lerpedState.alphaBoost, 0.9);
            const s = this.size + this.frictionGlow * 2;

            // Warm shift: blend color toward amber when scrolling fast
            let color = this.color;
            if (warmShift > 0.05) {
                const parts = this.color.split(',').map(Number);
                // Shift toward warm (increase R, decrease B slightly)
                parts[0] = Math.min(255, parts[0] + Math.round(warmShift * 80));
                parts[2] = Math.max(0, parts[2] - Math.round(warmShift * 30));
                color = parts.join(', ');
            }

            ctx.beginPath();
            ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${a})`;
            ctx.fill();
        }
    }

    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle(i));
        }
        computeGrid();
    }

    function render() {
        lerpState();

        // Emotional physics: trail length varies with scroll speed
        // Fast scroll = longer trails (streaking), slow = crisp dots
        const trailAlpha = 0.12 + (1 - scrollVelocity) * 0.08; // 0.12 (fast) to 0.20 (still)
        ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`;
        ctx.fillRect(0, 0, width, height);

        // Color temperature shift: fast scroll = warm streaks
        const warmShift = scrollVelocity * 0.3;

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].drawWithEmotion(warmShift);
        }

        animationFrameId = requestAnimationFrame(render);
    }

    // --- Section Detection via IntersectionObserver ---
    function initSectionObserver() {
        const sectionMap = [
            { selector: '#hero', state: STATES.hero },
            { selector: '.pain-section', state: STATES.pain },
            { selector: '#demo', state: STATES.demo },
            { selector: '.capabilities-preview', state: STATES.capabilities },
            { selector: '.final-cta', state: STATES.cta },
        ];

        sectionMap.forEach(({ selector, state }) => {
            const el = document.querySelector(selector);
            if (!el) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        targetState = state;
                    }
                });
            }, { threshold: [0.3, 0.6] });

            observer.observe(el);
        });
    }

    // --- Scroll-Speed Emotional Physics ---
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocitySmoothed = 0;

    function trackScrollVelocity() {
        const currentY = window.scrollY;
        const rawVelocity = Math.abs(currentY - lastScrollY);
        lastScrollY = currentY;
        // Smooth the velocity
        scrollVelocitySmoothed += (rawVelocity - scrollVelocitySmoothed) * 0.1;
        scrollVelocity = Math.min(scrollVelocitySmoothed / 30, 1); // 0-1 normalized
    }

    setInterval(trackScrollVelocity, 50);

    // --- Event Listeners ---
    window.addEventListener('resize', () => {
        init();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches[0]) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    // --- Init ---
    init();
    render();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSectionObserver);
    } else {
        initSectionObserver();
    }

    console.log('Particle canvas initialized (morphing states enabled)');
})();
