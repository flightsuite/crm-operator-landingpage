/* ================================================================
   FlightSuite — Before/After Drag Reveal
   Draggable split screen between CRM pain and FlightSuite solution.
   User physically controls the reveal — proof you can touch.
   ================================================================ */

(function() {
    'use strict';

    const comparison = document.getElementById('baComparison');
    const slider = document.getElementById('baSlider');
    if (!comparison || !slider) return;

    const before = comparison.querySelector('.ba-before');
    if (!before) return;

    let isDragging = false;
    let compRect;

    function updatePosition(clientX) {
        if (!compRect) compRect = comparison.getBoundingClientRect();
        const x = clientX - compRect.left;
        const pct = Math.max(0, Math.min(100, (x / compRect.width) * 100));

        before.style.width = pct + '%';
        slider.style.left = pct + '%';
    }

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        compRect = comparison.getBoundingClientRect();
        e.preventDefault();
    });

    comparison.addEventListener('mousedown', (e) => {
        isDragging = true;
        compRect = comparison.getBoundingClientRect();
        updatePosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updatePosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        compRect = comparison.getBoundingClientRect();
        e.preventDefault();
    }, { passive: false });

    comparison.addEventListener('touchstart', (e) => {
        isDragging = true;
        compRect = comparison.getBoundingClientRect();
        if (e.touches[0]) updatePosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        if (e.touches[0]) updatePosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Recalc on resize
    window.addEventListener('resize', () => {
        compRect = null;
    });

    // Scroll-triggered entrance animation — slide from 30% to 50%
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: comparison,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
            onUpdate: (self) => {
                if (!isDragging) {
                    const pct = 30 + self.progress * 20; // 30% → 50%
                    before.style.width = pct + '%';
                    slider.style.left = pct + '%';
                }
            }
        });
    }

    console.log('Before/After drag reveal loaded');
})();
