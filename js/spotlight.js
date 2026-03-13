/* ================================================================
   FlightSuite — Spotlight Cards + 3D Tilt Effect
   Mouse-reactive radial gradient glow + perspective transforms
   ================================================================ */

(function() {
    'use strict';

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // --- Spotlight glow effect on cards ---
    function initSpotlightCards() {
        const cards = document.querySelectorAll('.spotlight-card');
        if (!cards.length) return;

        cards.forEach(card => {
            const glowEl = document.createElement('div');
            glowEl.className = 'spotlight-glow';
            card.appendChild(glowEl);

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                glowEl.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(94, 92, 230, 0.15), transparent 40%)`;
                glowEl.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                glowEl.style.opacity = '0';
            });
        });
    }

    // --- 3D Tilt effect on cards ---
    function initTiltCards() {
        const cards = document.querySelectorAll('.tilt-card');
        if (!cards.length) return;

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Remove transition on enter so tilt tracking is instant
                card.style.transition = 'none';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
            });

            card.addEventListener('mouseleave', () => {
                // Smooth return to rest position
                card.style.transition = 'transform 0.5s var(--ease-out)';
                card.style.transform = '';
            });
        });
    }

    // --- Animated gradient borders ---
    function initGlowBorders() {
        const cards = document.querySelectorAll('.glow-border');
        if (!cards.length) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                card.style.setProperty('--glow-x', x + '%');
                card.style.setProperty('--glow-y', y + '%');
            });
        });
    }

    // --- Magnetic button effect ---
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.cta-primary, .cta-header');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // --- Scroll-driven text reveal (word-by-word) ---
    function initTextReveal() {
        const elements = document.querySelectorAll('.text-reveal');
        if (!elements.length) return;
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        elements.forEach(el => {
            const text = el.textContent;
            const words = text.split(' ');
            el.innerHTML = '';

            words.forEach((word, i) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                span.style.opacity = '0.15';
                span.style.transition = 'opacity 0.3s ease';
                span.className = 'reveal-word';
                el.appendChild(span);
            });

            const wordSpans = el.querySelectorAll('.reveal-word');

            ScrollTrigger.create({
                trigger: el,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: 0.5,
                onUpdate: (self) => {
                    const progress = self.progress;
                    wordSpans.forEach((span, i) => {
                        const wordProgress = i / wordSpans.length;
                        if (progress > wordProgress) {
                            span.style.opacity = '1';
                        } else {
                            span.style.opacity = '0.15';
                        }
                    });
                }
            });
        });
    }

    // Initialize all effects
    document.addEventListener('DOMContentLoaded', () => {
        initSpotlightCards();
        initTiltCards();
        initGlowBorders();
        initMagneticButtons();
        // Text reveal needs GSAP, so delay slightly
        setTimeout(initTextReveal, 500);
    });

    console.log('Spotlight + Tilt + Magnetic effects loaded');
})();
