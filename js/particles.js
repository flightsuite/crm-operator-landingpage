/* ================================================================
   FlightSuite — CRM Universe
   The particle field IS the CRM universe.
   Stars = cosmic background. Planets = CRM platforms.
   Scroll drives the narrative: chaos → connection → convergence.

   Hero:         Vast star field, planets scattered & disconnected
   Pain:         Planets drift apart, data particles scatter & fade
   Demo:         FlightSuite connects — data pathways form between planets
   Capabilities: Planets orbit a common center — organized system
   CTA:          All planets converge — one universe, one agent

   Mobile: Stars replaced by planets only — fewer, larger, cinematic
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
    let stars = [];
    let planets = [];
    let dataTrails = [];
    let animationFrameId;
    const mouse = { x: -1000, y: -1000 };

    const isMobile = window.innerWidth < 768;
    const genSeed = window.__flightSeed || {};
    const driftBias = genSeed.particleDriftBias || 1;
    const vortexDir = genSeed.vortexDirection || 1;

    // Stars: many small dots (desktop only)
    // Planets: few large orbs (both desktop and mobile)
    const STAR_COUNT = isMobile ? 0 : 250;

    const MAGNETIC_RADIUS = 200;
    const VORTEX_STRENGTH = 0.04;
    const PULL_STRENGTH = 0.06;

    const STAR_COLORS = [
        '94, 92, 230',   // purple
        '0, 113, 227',   // blue
        '34, 211, 238',  // cyan
        '255, 255, 255', // white
        '120, 120, 140', // muted
    ];

    // --- CRM Planets ---
    // Each planet represents a CRM platform in the universe
    const CRM_PLANETS = [
        {
            name: 'GoHighLevel',
            letter: 'G',
            color: '40, 167, 69',        // green
            glowColor: '40, 167, 69',
            size: isMobile ? 35 : 50,
            mass: 3,
        },
        {
            name: 'HubSpot',
            letter: 'H',
            color: '255, 122, 89',        // orange/coral
            glowColor: '255, 122, 89',
            size: isMobile ? 32 : 45,
            mass: 2.8,
        },
        {
            name: 'Salesforce',
            letter: 'S',
            color: '0, 161, 224',          // blue
            glowColor: '0, 161, 224',
            size: isMobile ? 28 : 40,
            mass: 2.5,
        },
        {
            name: 'WhatsApp',
            letter: 'W',
            color: '37, 211, 102',         // WhatsApp green
            glowColor: '34, 211, 238',     // cyan glow (channel, not CRM)
            size: isMobile ? 22 : 30,
            mass: 2,
        },
        {
            name: 'Zoho',
            letter: 'Z',
            color: '220, 38, 38',          // red
            glowColor: '220, 38, 38',
            size: isMobile ? 20 : 28,
            mass: 1.8,
        },
    ];

    // --- Morphing States ---
    // Stars and planets respond to these differently
    const STATES = {
        hero: {
            starDrift: 0.5, starDamping: 0.96, starAlphaBoost: 0,
            planetSpread: 1.0, planetDrift: 0.3, planetDamping: 0.985,
            connectionStrength: 0, convergeStrength: 0, orbitStrength: 0,
            expandStrength: 0, gridStrength: 0,
        },
        pain: {
            starDrift: 0.08, starDamping: 0.985, starAlphaBoost: 0.05,
            planetSpread: 1.4, planetDrift: 0.15, planetDamping: 0.99,
            connectionStrength: 0, convergeStrength: 0, orbitStrength: 0,
            expandStrength: 0.3, gridStrength: 0,
        },
        demo: {
            starDrift: 0.02, starDamping: 0.99, starAlphaBoost: 0.05,
            planetSpread: 0.8, planetDrift: 0.05, planetDamping: 0.99,
            connectionStrength: 0.8, convergeStrength: 0.15, orbitStrength: 0,
            expandStrength: 0, gridStrength: 0.4,
        },
        capabilities: {
            starDrift: 0.15, starDamping: 0.97, starAlphaBoost: 0.08,
            planetSpread: 0.5, planetDrift: 0.08, planetDamping: 0.99,
            connectionStrength: 0.5, convergeStrength: 0.3, orbitStrength: 0.6,
            expandStrength: 0, gridStrength: 0,
        },
        cta: {
            starDrift: 0.08, starDamping: 0.97, starAlphaBoost: 0.2,
            planetSpread: 0.15, planetDrift: 0.02, planetDamping: 0.995,
            connectionStrength: 1.0, convergeStrength: 0.7, orbitStrength: 0.3,
            expandStrength: 0, gridStrength: 0,
        },
    };

    let targetState = STATES.hero;
    let lerpedState = { ...STATES.hero };

    function lerpState() {
        const speed = 0.025;
        for (const key in lerpedState) {
            lerpedState[key] += (targetState[key] - lerpedState[key]) * speed;
        }
    }

    // Grid positions for stars (demo section order)
    let gridPositions = [];
    function computeGrid() {
        gridPositions = [];
        const cols = Math.ceil(Math.sqrt(STAR_COUNT * (width / height)));
        const rows = Math.ceil(STAR_COUNT / cols);
        const cellW = width / cols;
        const cellH = height / rows;
        for (let i = 0; i < STAR_COUNT; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            gridPositions.push({
                x: cellW * (col + 0.5),
                y: cellH * (row + 0.5)
            });
        }
    }

    // =============================================
    // STAR — Small background particle (desktop)
    // =============================================
    class Star {
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
            this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
            this.alpha = Math.random() * 0.4 + 0.05;
            this.baseAlpha = this.alpha;
            this.frictionGlow = 0;
        }

        update() {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

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

            // Grid pull
            if (lerpedState.gridStrength > 0.01 && gridPositions[this.index]) {
                const gp = gridPositions[this.index];
                this.vx += (gp.x - this.x) * lerpedState.gridStrength * 0.01;
                this.vy += (gp.y - this.y) * lerpedState.gridStrength * 0.01;
            }

            // Converge
            if (lerpedState.convergeStrength > 0.01) {
                this.vx += (width / 2 - this.x) * lerpedState.convergeStrength * 0.002;
                this.vy += (height / 2 - this.y) * lerpedState.convergeStrength * 0.002;
            }

            // Expand (pain)
            if (lerpedState.expandStrength > 0.01) {
                const edx = this.x - width / 2;
                const edy = this.y - height / 2;
                const eDist = Math.sqrt(edx * edx + edy * edy) || 1;
                this.vx += (edx / eDist) * lerpedState.expandStrength * 0.15;
                this.vy += (edy / eDist) * lerpedState.expandStrength * 0.15;
            }

            this.x += this.vx;
            this.y += this.vy;
            this.vx *= lerpedState.starDamping;
            this.vy *= lerpedState.starDamping;
            this.vx += (Math.random() - 0.5) * lerpedState.starDrift * 0.1 * driftBias;
            this.vy += (Math.random() - 0.5) * lerpedState.starDrift * 0.1 * driftBias;

            // Wrap edges
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
        }

        draw(warmShift) {
            const a = Math.min(this.baseAlpha + this.frictionGlow + lerpedState.starAlphaBoost, 0.9);
            const s = this.size + this.frictionGlow * 2;

            let color = this.color;
            if (warmShift > 0.05) {
                const parts = this.color.split(',').map(Number);
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

    // =============================================
    // PLANET — Large CRM orb with atmosphere
    // =============================================
    class Planet {
        constructor(config, index) {
            this.config = config;
            this.index = index;
            this.phase = (index / CRM_PLANETS.length) * Math.PI * 2; // Even distribution
            this.orbitAngle = this.phase;
            this.reset();
        }

        reset() {
            // Scatter planets across viewport with spread
            const angle = this.phase;
            const spread = Math.min(width, height) * 0.35;
            this.homeX = width / 2 + Math.cos(angle) * spread;
            this.homeY = height / 2 + Math.sin(angle) * spread;
            this.x = this.homeX + (Math.random() - 0.5) * 100;
            this.y = this.homeY + (Math.random() - 0.5) * 100;
            this.vx = 0;
            this.vy = 0;
            this.currentSize = this.config.size;
            this.glowPulse = Math.random() * Math.PI * 2;
            this.logoOpacity = 0;
        }

        update() {
            const cx = width / 2;
            const cy = height / 2;
            const spread = Math.min(width, height) * 0.35 * lerpedState.planetSpread;

            // Compute target position based on current state
            let targetX, targetY;

            if (lerpedState.orbitStrength > 0.1) {
                // Orbital motion
                this.orbitAngle += 0.003 * (1 / this.config.mass);
                targetX = cx + Math.cos(this.orbitAngle) * spread;
                targetY = cy + Math.sin(this.orbitAngle) * spread * 0.6; // Elliptical
            } else {
                // Home position with spread
                targetX = cx + Math.cos(this.phase) * spread;
                targetY = cy + Math.sin(this.phase) * spread * 0.8;
            }

            // Converge toward center
            if (lerpedState.convergeStrength > 0.1) {
                targetX = targetX + (cx - targetX) * lerpedState.convergeStrength;
                targetY = targetY + (cy - targetY) * lerpedState.convergeStrength;
            }

            // Pull toward target (heavy — planets have mass)
            const pullStrength = 0.008 / this.config.mass;
            this.vx += (targetX - this.x) * pullStrength;
            this.vy += (targetY - this.y) * pullStrength;

            // Expand (pain — planets drift apart)
            if (lerpedState.expandStrength > 0.01) {
                const edx = this.x - cx;
                const edy = this.y - cy;
                const eDist = Math.sqrt(edx * edx + edy * edy) || 1;
                this.vx += (edx / eDist) * lerpedState.expandStrength * 0.03;
                this.vy += (edy / eDist) * lerpedState.expandStrength * 0.03;
            }

            // Mouse interaction (gentle push — planets are heavy)
            const mdx = this.x - mouse.x;
            const mdy = this.y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < MAGNETIC_RADIUS * 1.5 && mDist > 0) {
                const force = (MAGNETIC_RADIUS * 1.5 - mDist) / (MAGNETIC_RADIUS * 1.5);
                this.vx += (mdx / mDist) * force * 0.02;
                this.vy += (mdy / mDist) * force * 0.02;
            }

            // Gentle drift
            this.vx += (Math.random() - 0.5) * lerpedState.planetDrift * 0.02;
            this.vy += (Math.random() - 0.5) * lerpedState.planetDrift * 0.02;

            this.vx *= lerpedState.planetDamping;
            this.vy *= lerpedState.planetDamping;
            this.x += this.vx;
            this.y += this.vy;

            // Glow pulse
            this.glowPulse += 0.015;

            // Logo visibility: fades in during capabilities and CTA
            const targetLogo = (lerpedState.orbitStrength > 0.2 || lerpedState.convergeStrength > 0.4) ? 0.6 : 0.15;
            this.logoOpacity += (targetLogo - this.logoOpacity) * 0.02;

            // Soft bounds
            const pad = this.config.size * 2;
            if (this.x < pad) this.vx += 0.05;
            if (this.x > width - pad) this.vx -= 0.05;
            if (this.y < pad) this.vy += 0.05;
            if (this.y > height - pad) this.vy -= 0.05;
        }

        draw() {
            const s = this.config.size;
            const pulse = Math.sin(this.glowPulse) * 0.15 + 0.85;
            const glowSize = s * (2.5 + pulse * 0.5);

            // Outer atmospheric glow
            const outerGlow = ctx.createRadialGradient(this.x, this.y, s * 0.3, this.x, this.y, glowSize);
            outerGlow.addColorStop(0, `rgba(${this.config.glowColor}, ${0.12 * pulse})`);
            outerGlow.addColorStop(0.4, `rgba(${this.config.glowColor}, ${0.06 * pulse})`);
            outerGlow.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = outerGlow;
            ctx.fill();

            // Planet body — radial gradient for 3D depth
            const bodyGrad = ctx.createRadialGradient(
                this.x - s * 0.25, this.y - s * 0.25, s * 0.1,
                this.x, this.y, s
            );
            bodyGrad.addColorStop(0, `rgba(${this.config.color}, ${0.35 * pulse})`);
            bodyGrad.addColorStop(0.6, `rgba(${this.config.color}, ${0.18 * pulse})`);
            bodyGrad.addColorStop(1, `rgba(${this.config.color}, ${0.03})`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
            ctx.fillStyle = bodyGrad;
            ctx.fill();

            // Inner bright core
            const coreGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, s * 0.4);
            coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.15 * pulse})`);
            coreGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(this.x, this.y, s * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = coreGrad;
            ctx.fill();

            // CRM letter — appears on orbit/converge
            if (this.logoOpacity > 0.05) {
                ctx.save();
                ctx.font = `${Math.round(s * 0.5)}px "Space Grotesk", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = `rgba(255, 255, 255, ${this.logoOpacity * pulse})`;
                ctx.fillText(this.config.letter, this.x, this.y);
                ctx.restore();
            }
        }
    }

    // =============================================
    // DATA TRAILS — Connection lines between planets
    // =============================================
    function drawConnections() {
        if (lerpedState.connectionStrength < 0.05) return;

        const alpha = lerpedState.connectionStrength * 0.12;

        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const a = planets[i];
                const b = planets[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = Math.min(width, height) * 0.7;

                if (dist < maxDist) {
                    const strength = (1 - dist / maxDist) * alpha;
                    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                    grad.addColorStop(0, `rgba(${a.config.glowColor}, ${strength})`);
                    grad.addColorStop(0.5, `rgba(255, 255, 255, ${strength * 0.5})`);
                    grad.addColorStop(1, `rgba(${b.config.glowColor}, ${strength})`);

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    // Slight curve via midpoint offset
                    const mx = (a.x + b.x) / 2 + (a.y - b.y) * 0.05;
                    const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.05;
                    ctx.quadraticCurveTo(mx, my, b.x, b.y);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.5 + lerpedState.connectionStrength;
                    ctx.stroke();
                }
            }
        }

        // Data particles traveling along connections
        drawDataParticles();
    }

    // Small bright dots traveling between connected planets
    let dataParticles = [];

    function initDataParticles() {
        dataParticles = [];
        for (let i = 0; i < 8; i++) {
            dataParticles.push({
                fromPlanet: Math.floor(Math.random() * planets.length),
                toPlanet: Math.floor(Math.random() * planets.length),
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.004,
                size: 1.5 + Math.random() * 1.5,
            });
        }
    }

    function drawDataParticles() {
        if (lerpedState.connectionStrength < 0.2) return;

        const alpha = Math.min((lerpedState.connectionStrength - 0.2) * 1.5, 1);

        for (const dp of dataParticles) {
            if (dp.fromPlanet === dp.toPlanet) continue;

            dp.progress += dp.speed;
            if (dp.progress > 1) {
                dp.progress = 0;
                dp.fromPlanet = dp.toPlanet;
                dp.toPlanet = Math.floor(Math.random() * planets.length);
            }

            const from = planets[dp.fromPlanet];
            const to = planets[dp.toPlanet];
            if (!from || !to) continue;

            const t = dp.progress;
            // Quadratic bezier interpolation
            const mx = (from.x + to.x) / 2 + (from.y - to.y) * 0.05;
            const my = (from.y + to.y) / 2 + (to.x - from.x) * 0.05;
            const x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * mx + t * t * to.x;
            const y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * my + t * t * to.y;

            // Bright traveling dot
            ctx.beginPath();
            ctx.arc(x, y, dp.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * alpha})`;
            ctx.fill();

            // Tiny glow
            ctx.beginPath();
            ctx.arc(x, y, dp.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 211, 238, ${0.15 * alpha})`;
            ctx.fill();
        }
    }

    // =============================================
    // INIT & RENDER
    // =============================================
    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(new Star(i));
        }

        planets = [];
        for (let i = 0; i < CRM_PLANETS.length; i++) {
            planets.push(new Planet(CRM_PLANETS[i], i));
        }

        if (STAR_COUNT > 0) computeGrid();
        initDataParticles();
    }

    function render() {
        lerpState();

        // Trail effect — accumulating semi-transparent black
        const trailAlpha = 0.12 + (1 - scrollVelocity) * 0.08;
        ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`;
        ctx.fillRect(0, 0, width, height);

        const warmShift = scrollVelocity * 0.3;

        // Draw stars (desktop only — STAR_COUNT is 0 on mobile)
        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            stars[i].draw(warmShift);
        }

        // Draw connection lines between planets
        drawConnections();

        // Draw planets (always — this is the CRM Universe)
        for (let i = 0; i < planets.length; i++) {
            planets[i].update();
            planets[i].draw();
        }

        animationFrameId = requestAnimationFrame(render);
    }

    // --- Section Detection ---
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

    // --- Scroll Velocity ---
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocitySmoothed = 0;

    function trackScrollVelocity() {
        const currentY = window.scrollY;
        const rawVelocity = Math.abs(currentY - lastScrollY);
        lastScrollY = currentY;
        scrollVelocitySmoothed += (rawVelocity - scrollVelocitySmoothed) * 0.1;
        scrollVelocity = Math.min(scrollVelocitySmoothed / 30, 1);
    }

    setInterval(trackScrollVelocity, 50);

    // --- Events ---
    window.addEventListener('resize', init);

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

    console.log(`CRM Universe initialized (${STAR_COUNT} stars, ${CRM_PLANETS.length} planets)`);
})();
