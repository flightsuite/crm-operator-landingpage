/* ================================================================
   FlightSuite — CTA Convergence Effect
   Particles drift inward toward center, creating a "resolution"
   moment as user reaches the final call-to-action.
   Triggered by IntersectionObserver when section enters viewport.
   ================================================================ */

(function() {
    'use strict';

    const canvas = document.getElementById('convergence-canvas');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let particles = [];
    let animId;
    let active = false;
    let convergenceProgress = 0; // 0 = scattered, 1 = converged

    const COUNT = window.innerWidth < 768 ? 60 : 120;
    const COLORS = [
        '94, 92, 230',
        '0, 113, 227',
        '34, 211, 238',
        '255, 255, 255',
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            // Start scattered across canvas
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.homeX = this.x;
            this.homeY = this.y;
            this.size = Math.random() * 2 + 0.5;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.phase = Math.random() * Math.PI * 2;
        }

        update() {
            const cx = width / 2;
            const cy = height / 2;
            const p = convergenceProgress;

            // Target: blend between home position and center
            const targetX = this.homeX + (cx - this.homeX) * p;
            const targetY = this.homeY + (cy - this.homeY) * p;

            // Pull toward target
            this.vx += (targetX - this.x) * 0.008;
            this.vy += (targetY - this.y) * 0.008;

            // Add orbital motion when converging
            if (p > 0.3) {
                const dx = this.x - cx;
                const dy = this.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const orbital = p * 0.02;
                this.vx += (-dy / dist) * orbital;
                this.vy += (dx / dist) * orbital;
            }

            // Gentle drift
            this.vx += Math.sin(this.phase + Date.now() * 0.001) * 0.01;
            this.vy += Math.cos(this.phase + Date.now() * 0.0012) * 0.01;

            this.vx *= 0.96;
            this.vy *= 0.96;

            this.x += this.vx;
            this.y += this.vy;
        }

        draw() {
            const dx = this.x - width / 2;
            const dy = this.y - height / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = Math.sqrt(width * width + height * height) / 2;
            const proximity = 1 - Math.min(dist / maxDist, 1);

            // Brighter as they converge to center
            const a = this.alpha + proximity * convergenceProgress * 0.5;
            const s = this.size + proximity * convergenceProgress * 2;

            ctx.beginPath();
            ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${Math.min(a, 0.9)})`;
            ctx.fill();
        }
    }

    function resize() {
        const section = canvas.parentElement;
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Central glow that intensifies with convergence
        if (convergenceProgress > 0.2) {
            const glow = convergenceProgress * 0.15;
            const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, 200);
            gradient.addColorStop(0, `rgba(94, 92, 230, ${glow})`);
            gradient.addColorStop(0.5, `rgba(0, 113, 227, ${glow * 0.5})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        animId = requestAnimationFrame(render);
    }

    // Scroll-driven convergence via GSAP if available
    function setupScrollTrigger() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: canvas.parentElement,
                start: 'top 80%',
                end: 'center center',
                scrub: 1,
                onUpdate: (self) => {
                    convergenceProgress = self.progress;
                },
                onEnter: () => {
                    active = true;
                    init();
                    render();
                },
                onLeaveBack: () => {
                    convergenceProgress = 0;
                }
            });
        } else {
            // Fallback: use IntersectionObserver
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        active = true;
                        convergenceProgress = 0.6;
                        init();
                        render();
                    } else {
                        active = false;
                        if (animId) cancelAnimationFrame(animId);
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(canvas.parentElement);
        }
    }

    window.addEventListener('resize', resize);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupScrollTrigger);
    } else {
        setupScrollTrigger();
    }

    console.log('Convergence canvas loaded');
})();
