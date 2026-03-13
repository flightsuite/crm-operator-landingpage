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

    // Touch events — only trigger on the slider handle, not the whole comparison
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        compRect = comparison.getBoundingClientRect();
        e.preventDefault();
    }, { passive: false });

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

    // One-shot entrance: animate to 50% when section enters, then hand off to user
    let hasAnimated = false;
    if (typeof gsap !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    gsap.fromTo(
                        { pct: 30 },
                        { pct: 30 },
                        {
                            pct: 50,
                            duration: 1.2,
                            ease: 'power2.out',
                            onUpdate: function() {
                                if (!isDragging) {
                                    const p = this.targets()[0].pct;
                                    before.style.width = p + '%';
                                    slider.style.left = p + '%';
                                }
                            }
                        }
                    );
                }
            });
        }, { threshold: 0.3 });
        observer.observe(comparison);
    }

    console.log('Before/After drag reveal loaded');
})();
