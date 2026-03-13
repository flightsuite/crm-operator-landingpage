/* ================================================================
   FlightSuite — Hero Live Demo
   The product IS the hero. Types real commands, materializes CRM cards.
   ================================================================ */

(function() {
    'use strict';

    const typedEl = document.getElementById('heroTypedText');
    const outputEl = document.getElementById('heroDemoOutput');
    const trailCanvas = document.getElementById('hero-trail-canvas');
    if (!typedEl || !outputEl) return;

    // --- Demo sequences: real CRM commands → real CRM results ---
    const sequences = [
        {
            text: 'Had a call with Sarah Chen. She wants the enterprise plan. Move her to Discovery.',
            cards: [
                { type: 'contact', label: 'Contact Updated', name: 'Sarah Chen', detail: 'Enterprise Plan Interest', color: '#5E5CE6' },
                { type: 'note', label: 'Note Logged', name: 'Call Summary', detail: 'Discussed enterprise pricing and timeline', color: '#0071E3' },
                { type: 'pipeline', label: 'Pipeline Moved', name: 'Sarah Chen → Discovery', detail: 'From: New Lead', color: '#30D158' }
            ]
        },
        {
            text: 'Create a contact for Mike Johnson at Acme Corp. Email mike@acme.com, phone (704) 555-0142.',
            cards: [
                { type: 'contact', label: 'Contact Created', name: 'Mike Johnson', detail: 'Acme Corp', color: '#5E5CE6' },
                { type: 'detail', label: 'Details Added', name: 'mike@acme.com', detail: '(704) 555-0142', color: '#0071E3' }
            ]
        },
        {
            text: 'Book a demo for Lisa Park next Tuesday at 2pm. She found us through the blog.',
            cards: [
                { type: 'appointment', label: 'Appointment Booked', name: 'Lisa Park — Demo', detail: 'Tuesday, 2:00 PM', color: '#FF9F0A' },
                { type: 'source', label: 'Source Tagged', name: 'Inbound: Blog', detail: 'Attribution tracked', color: '#30D158' }
            ]
        }
    ];

    let currentSequence = 0;
    let isTyping = false;

    // --- Typewriter engine ---
    function typeText(text, callback) {
        isTyping = true;
        typedEl.textContent = '';
        let i = 0;
        const speed = 28 + Math.random() * 15; // Human-like variance

        function tick() {
            if (i < text.length) {
                typedEl.textContent += text[i];
                i++;
                // Slight pause on punctuation
                const delay = '.!?,'.includes(text[i - 1]) ? speed * 6 : speed;
                setTimeout(tick, delay);
            } else {
                isTyping = false;
                if (callback) callback();
            }
        }
        tick();
    }

    // --- Card materialization ---
    function materializeCards(cards) {
        outputEl.innerHTML = '';
        cards.forEach((card, i) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'hero-crm-card';
            cardEl.innerHTML = `
                <div class="hero-crm-card-header">
                    <span class="hero-crm-card-dot" style="background:${card.color}"></span>
                    <span class="hero-crm-card-label">${card.label}</span>
                </div>
                <div class="hero-crm-card-name">${card.name}</div>
                <div class="hero-crm-card-detail">${card.detail}</div>
            `;
            outputEl.appendChild(cardEl);

            // Stagger the materialization
            setTimeout(() => {
                cardEl.classList.add('visible');
            }, 300 + i * 400);
        });
    }

    // --- Particle trail effect (text → cards) ---
    let trailCtx = null;
    let trails = [];

    function initTrailCanvas() {
        if (!trailCanvas) return;
        trailCtx = trailCanvas.getContext('2d');
        resizeTrailCanvas();
        window.addEventListener('resize', resizeTrailCanvas);
    }

    function resizeTrailCanvas() {
        if (!trailCanvas || !trailCtx) return;
        const container = trailCanvas.parentElement;
        trailCanvas.width = container.offsetWidth;
        trailCanvas.height = container.offsetHeight;
    }

    function spawnTrails(cardCount) {
        if (!trailCtx) return;
        trails = [];
        const w = trailCanvas.width;
        const h = trailCanvas.height;

        for (let i = 0; i < cardCount * 8; i++) {
            trails.push({
                x: w * 0.2 + Math.random() * w * 0.1,
                y: h * 0.3 + Math.random() * h * 0.4,
                targetX: w * 0.6 + Math.random() * w * 0.3,
                targetY: (h / (cardCount + 1)) * ((i % cardCount) + 1),
                progress: 0,
                speed: 0.008 + Math.random() * 0.008,
                size: 1.5 + Math.random() * 2,
                alpha: 0.4 + Math.random() * 0.4,
                color: ['#5E5CE6', '#0071E3', '#30D158', '#FF9F0A'][i % 4]
            });
        }
        animateTrails();
    }

    function animateTrails() {
        if (!trailCtx || trails.length === 0) return;
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        let active = false;
        trails.forEach(t => {
            if (t.progress >= 1) return;
            active = true;
            t.progress += t.speed;
            const p = t.progress;
            // Bezier curve path
            const cp1x = t.x + (t.targetX - t.x) * 0.3;
            const cp1y = t.y - 30;
            const cp2x = t.x + (t.targetX - t.x) * 0.7;
            const cp2y = t.targetY + 20;
            const bz = bezierPoint(t.x, t.y, cp1x, cp1y, cp2x, cp2y, t.targetX, t.targetY, p);

            trailCtx.beginPath();
            trailCtx.arc(bz.x, bz.y, t.size * (1 - p * 0.5), 0, Math.PI * 2);
            trailCtx.fillStyle = t.color;
            trailCtx.globalAlpha = t.alpha * (1 - p);
            trailCtx.fill();
        });
        trailCtx.globalAlpha = 1;

        if (active) requestAnimationFrame(animateTrails);
    }

    function bezierPoint(x0, y0, cx1, cy1, cx2, cy2, x3, y3, t) {
        const u = 1 - t;
        return {
            x: u*u*u*x0 + 3*u*u*t*cx1 + 3*u*t*t*cx2 + t*t*t*x3,
            y: u*u*u*y0 + 3*u*u*t*cy1 + 3*u*t*t*cy2 + t*t*t*y3
        };
    }

    // --- Run a full demo sequence ---
    function runSequence() {
        const seq = sequences[currentSequence];

        // Clear previous
        outputEl.innerHTML = '';
        if (trailCtx) trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        typeText(seq.text, () => {
            // After typing completes, spawn particle trails then materialize cards
            spawnTrails(seq.cards.length);
            setTimeout(() => materializeCards(seq.cards), 200);

            // After cards are visible, wait then move to next sequence
            setTimeout(() => {
                currentSequence = (currentSequence + 1) % sequences.length;
                // Fade out current cards
                const cards = outputEl.querySelectorAll('.hero-crm-card');
                cards.forEach(c => c.classList.remove('visible'));
                setTimeout(runSequence, 800);
            }, 5000);
        });
    }

    // --- Init ---
    function init() {
        initTrailCanvas();
        // Start demo after a short delay for page load
        setTimeout(runSequence, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('Hero demo loaded');
})();
