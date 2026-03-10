/* ================================================================
   FlightSuite — CRM Universe
   The particle field IS the CRM universe.
   Stars = cosmic background. Planets = CRM platforms with real logos.
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
    let animationFrameId;
    const mouse = { x: -1000, y: -1000 };

    const isMobile = window.innerWidth < 768;
    const genSeed = window.__flightSeed || {};
    const driftBias = genSeed.particleDriftBias || 1;
    const vortexDir = genSeed.vortexDirection || 1;

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

    // --- Logo Preloading ---
    const LOGO_SOURCES = {
        'GoHighLevel': 'Assets/GoHighLevel.svg',
        'HubSpot': 'Assets/hubspot.svg',
        'Salesforce': 'Assets/Salesforce.com_logo.svg.png',
        'WhatsApp': 'Assets/whatsapp.svg',
        'Zoho': 'Assets/zoho-logo-512.png',
    };

    const logoImages = {};
    let logosReady = false;

    function preloadLogos() {
        let loaded = 0;
        const total = Object.keys(LOGO_SOURCES).length;

        Object.entries(LOGO_SOURCES).forEach(([name, src]) => {
            const img = new Image();
            img.onload = () => {
                logoImages[name] = img;
                loaded++;
                if (loaded >= total) logosReady = true;
            };
            img.onerror = () => {
                loaded++;
                if (loaded >= total) logosReady = true;
            };
            img.src = src;
        });
    }

    preloadLogos();

    // --- CRM Planets ---
    // Sized for logo visibility — larger than before
    const CRM_PLANETS = [
        {
            name: 'GoHighLevel',
            color: '40, 167, 69',
            glowColor: '40, 167, 69',
            size: isMobile ? 40 : 55,
            mass: 3,
        },
        {
            name: 'HubSpot',
            color: '255, 122, 89',
            glowColor: '255, 122, 89',
            size: isMobile ? 36 : 50,
            mass: 2.8,
        },
        {
            name: 'Salesforce',
            color: '0, 161, 224',
            glowColor: '0, 161, 224',
            size: isMobile ? 32 : 45,
            mass: 2.5,
        },
        {
            name: 'WhatsApp',
            color: '37, 211, 102',
            glowColor: '34, 211, 238',
            size: isMobile ? 28 : 38,
            mass: 2,
        },
        {
            name: 'Zoho',
            color: '220, 38, 38',
            glowColor: '220, 38, 38',
            size: isMobile ? 26 : 35,
            mass: 1.8,
        },
    ];

    // --- Morphing States ---
    const STATES = {
        hero: {
            starDrift: 0.5, starDamping: 0.96, starAlphaBoost: 0,
            planetSpread: 1.0, planetDrift: 0.3, planetDamping: 0.985,
            connectionStrength: 0, convergeStrength: 0, orbitStrength: 0,
            expandStrength: 0, gridStrength: 0, logoVisibility: 0.45,
        },
        pain: {
            starDrift: 0.08, starDamping: 0.985, starAlphaBoost: 0.05,
            planetSpread: 1.4, planetDrift: 0.15, planetDamping: 0.99,
            connectionStrength: 0, convergeStrength: 0, orbitStrength: 0,
            expandStrength: 0.3, gridStrength: 0, logoVisibility: 0.35,
        },
        demo: {
            starDrift: 0.02, starDamping: 0.99, starAlphaBoost: 0.05,
            planetSpread: 0.8, planetDrift: 0.05, planetDamping: 0.99,
            connectionStrength: 0.8, convergeStrength: 0.15, orbitStrength: 0,
            expandStrength: 0, gridStrength: 0.4, logoVisibility: 0.55,
        },
        capabilities: {
            starDrift: 0.15, starDamping: 0.97, starAlphaBoost: 0.08,
            planetSpread: 0.5, planetDrift: 0.08, planetDamping: 0.99,
            connectionStrength: 0.5, convergeStrength: 0.3, orbitStrength: 0.6,
            expandStrength: 0, gridStrength: 0, logoVisibility: 0.7,
        },
        cta: {
            starDrift: 0.08, starDamping: 0.97, starAlphaBoost: 0.2,
            planetSpread: 0.15, planetDrift: 0.02, planetDamping: 0.995,
            connectionStrength: 1.0, convergeStrength: 0.7, orbitStrength: 0.3,
            expandStrength: 0, gridStrength: 0, logoVisibility: 0.85,
        },
    };

    let targetState = STATES.hero;
    let lerpedState = { ...STATES.hero };

    // Adaptive lerp — ease-out feel: fast when far, settles gently
    function lerpState() {
        for (const key in lerpedState) {
            const diff = targetState[key] - lerpedState[key];
            const speed = 0.06 * (1 + Math.abs(diff) * 3);
            lerpedState[key] += diff * Math.min(speed, 0.15);
        }
    }

    // Grid positions for stars (demo section)
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
    // Now gravitationally attracted to nearby planets
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
            // Mouse interaction
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

            // Gravitational pull toward nearest planet — creates "one body" cohesion
            if (planets.length > 0) {
                let nearestDist = Infinity;
                let nearestPlanet = null;
                for (let p = 0; p < planets.length; p++) {
                    const pdx = planets[p].x - this.x;
                    const pdy = planets[p].y - this.y;
                    const pd = pdx * pdx + pdy * pdy; // squared for speed
                    if (pd < nearestDist) {
                        nearestDist = pd;
                        nearestPlanet = planets[p];
                    }
                }
                nearestDist = Math.sqrt(nearestDist);
                const gravRadius = nearestPlanet.config.size * 7;
                if (nearestPlanet && nearestDist < gravRadius && nearestDist > nearestPlanet.config.size) {
                    const gravForce = (gravRadius - nearestDist) / gravRadius;
                    const pdx = nearestPlanet.x - this.x;
                    const pdy = nearestPlanet.y - this.y;
                    const gStrength = gravForce * gravForce * 0.004 * nearestPlanet.config.mass;
                    this.vx += (pdx / nearestDist) * gStrength;
                    this.vy += (pdy / nearestDist) * gStrength;
                    // Subtle orbital tendency — stars swirl around planets
                    this.vx += (pdy / nearestDist) * gStrength * 0.3 * vortexDir;
                    this.vy -= (pdx / nearestDist) * gStrength * 0.3 * vortexDir;
                    // Color bleed — stars near planets take on their hue
                    this.color = nearestPlanet.config.color;
                    this.frictionGlow = Math.max(this.frictionGlow, gravForce * 0.2);
                }
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
    // PLANET — CRM orb with real logo + atmosphere
    // =============================================
    class Planet {
        constructor(config, index) {
            this.config = config;
            this.index = index;
            this.phase = (index / CRM_PLANETS.length) * Math.PI * 2;
            this.orbitAngle = this.phase;
            this.trail = [];
            this.logoOpacity = 0;
            this.breathe = Math.random() * Math.PI * 2;
            this.reset();
        }

        reset() {
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
            this.trail = [];
        }

        update() {
            const cx = width / 2;
            const cy = height / 2;
            const spread = Math.min(width, height) * 0.35 * lerpedState.planetSpread;

            let targetX, targetY;

            if (lerpedState.orbitStrength > 0.1) {
                this.orbitAngle += 0.003 * (1 / this.config.mass);
                targetX = cx + Math.cos(this.orbitAngle) * spread;
                targetY = cy + Math.sin(this.orbitAngle) * spread * 0.6;
            } else {
                targetX = cx + Math.cos(this.phase) * spread;
                targetY = cy + Math.sin(this.phase) * spread * 0.8;
            }

            if (lerpedState.convergeStrength > 0.1) {
                targetX = targetX + (cx - targetX) * lerpedState.convergeStrength;
                targetY = targetY + (cy - targetY) * lerpedState.convergeStrength;
            }

            // Pull toward target — heavier planets move slower
            const pullStrength = 0.01 / this.config.mass;
            this.vx += (targetX - this.x) * pullStrength;
            this.vy += (targetY - this.y) * pullStrength;

            // Expand (pain)
            if (lerpedState.expandStrength > 0.01) {
                const edx = this.x - cx;
                const edy = this.y - cy;
                const eDist = Math.sqrt(edx * edx + edy * edy) || 1;
                this.vx += (edx / eDist) * lerpedState.expandStrength * 0.03;
                this.vy += (edy / eDist) * lerpedState.expandStrength * 0.03;
            }

            // Mouse repulsion (gentle push)
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

            // Continuous breathing — planets are alive
            this.breathe += 0.008;
            this.glowPulse += 0.015;

            // Logo visibility — always somewhat visible for recognition
            this.logoOpacity += (lerpedState.logoVisibility - this.logoOpacity) * 0.04;

            // Record trail for afterimage
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 0.15) {
                this.trail.push({ x: this.x, y: this.y, alpha: 0.4, size: this.config.size * 0.4 });
            }
            if (this.trail.length > 15) this.trail.shift();
            for (let t = 0; t < this.trail.length; t++) {
                this.trail[t].alpha *= 0.88;
                this.trail[t].size *= 0.96;
            }

            // Soft bounds
            const pad = this.config.size * 2;
            if (this.x < pad) this.vx += 0.05;
            if (this.x > width - pad) this.vx -= 0.05;
            if (this.y < pad) this.vy += 0.05;
            if (this.y > height - pad) this.vy -= 0.05;
        }

        draw() {
            const s = this.config.size;
            const breatheScale = Math.sin(this.breathe) * 0.03 + 1;
            const effectiveSize = s * breatheScale;
            const pulse = Math.sin(this.glowPulse) * 0.15 + 0.85;

            // --- Orbital trail ---
            for (let t = 0; t < this.trail.length; t++) {
                const tr = this.trail[t];
                if (tr.alpha < 0.02) continue;
                const trailGrad = ctx.createRadialGradient(tr.x, tr.y, 0, tr.x, tr.y, tr.size);
                trailGrad.addColorStop(0, `rgba(${this.config.glowColor}, ${tr.alpha * 0.12})`);
                trailGrad.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(tr.x, tr.y, tr.size, 0, Math.PI * 2);
                ctx.fillStyle = trailGrad;
                ctx.fill();
            }

            // --- Outer atmospheric glow ---
            const glowSize = effectiveSize * (2.5 + pulse * 0.5);
            const outerGlow = ctx.createRadialGradient(this.x, this.y, effectiveSize * 0.3, this.x, this.y, glowSize);
            outerGlow.addColorStop(0, `rgba(${this.config.glowColor}, ${0.14 * pulse})`);
            outerGlow.addColorStop(0.4, `rgba(${this.config.glowColor}, ${0.06 * pulse})`);
            outerGlow.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = outerGlow;
            ctx.fill();

            // --- Planet body — more solid for logo backdrop ---
            const bodyGrad = ctx.createRadialGradient(
                this.x - effectiveSize * 0.2, this.y - effectiveSize * 0.2, effectiveSize * 0.1,
                this.x, this.y, effectiveSize
            );
            bodyGrad.addColorStop(0, `rgba(${this.config.color}, ${0.5 * pulse})`);
            bodyGrad.addColorStop(0.5, `rgba(${this.config.color}, ${0.3 * pulse})`);
            bodyGrad.addColorStop(0.85, `rgba(${this.config.color}, ${0.12})`);
            bodyGrad.addColorStop(1, `rgba(${this.config.color}, ${0.02})`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, effectiveSize, 0, Math.PI * 2);
            ctx.fillStyle = bodyGrad;
            ctx.fill();

            // --- CRM Logo (image) ---
            const logo = logoImages[this.config.name];
            if (logo && this.logoOpacity > 0.03) {
                ctx.save();
                // Circular clip
                ctx.beginPath();
                ctx.arc(this.x, this.y, effectiveSize * 0.72, 0, Math.PI * 2);
                ctx.clip();

                ctx.globalAlpha = this.logoOpacity * pulse;

                // Draw logo centered, filling the clip circle
                const logoSize = effectiveSize * 1.44; // slightly larger than clip for edge-to-edge fill
                ctx.drawImage(
                    logo,
                    this.x - logoSize / 2,
                    this.y - logoSize / 2,
                    logoSize,
                    logoSize
                );
                ctx.restore();
            }

            // --- Bright core highlight (on top of logo for depth) ---
            const coreGrad = ctx.createRadialGradient(
                this.x - effectiveSize * 0.15, this.y - effectiveSize * 0.2, 0,
                this.x, this.y, effectiveSize * 0.5
            );
            coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.08 * pulse})`);
            coreGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(this.x, this.y, effectiveSize * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = coreGrad;
            ctx.fill();

            // --- Rim light (subtle ring for 3D pop) ---
            ctx.beginPath();
            ctx.arc(this.x, this.y, effectiveSize * 0.75, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${this.config.color}, ${0.08 * pulse})`;
            ctx.lineWidth = 1;
            ctx.stroke();
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
                    const mx = (a.x + b.x) / 2 + (a.y - b.y) * 0.05;
                    const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.05;
                    ctx.quadraticCurveTo(mx, my, b.x, b.y);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.5 + lerpedState.connectionStrength;
                    ctx.stroke();
                }
            }
        }

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
            const mx = (from.x + to.x) / 2 + (from.y - to.y) * 0.05;
            const my = (from.y + to.y) / 2 + (to.x - from.x) * 0.05;
            const x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * mx + t * t * to.x;
            const y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * my + t * t * to.y;

            ctx.beginPath();
            ctx.arc(x, y, dp.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * alpha})`;
            ctx.fill();

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

        // Trail effect
        const trailAlpha = 0.12 + (1 - scrollVelocity) * 0.08;
        ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`;
        ctx.fillRect(0, 0, width, height);

        const warmShift = scrollVelocity * 0.3;

        // Stars (desktop only)
        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            stars[i].draw(warmShift);
        }

        // Connection lines
        drawConnections();

        // Planets
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

    console.log(`CRM Universe initialized (${STAR_COUNT} stars, ${CRM_PLANETS.length} planets, logos loading...)`);
})();
