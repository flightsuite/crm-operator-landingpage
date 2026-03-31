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
            text: 'Just got off the phone with Jessica about the roofing estimate. She wants to move forward. Schedule follow-up for Thursday.',
            cards: [
                { type: 'note', label: 'Note Logged', name: 'Call with Jessica', detail: 'Roofing estimate — wants to move forward', color: '#0071E3' },
                { type: 'pipeline', label: 'Pipeline Moved', name: 'Jessica Baker → Estimate Sent', detail: 'From: New Lead', color: '#30D158' },
                { type: 'appointment', label: 'Follow-up Set', name: 'Jessica Baker', detail: 'Thursday, 10:00 AM', color: '#FF9F0A' }
            ],
            timeSaved: '3 actions in 2.4 seconds — would take ~4 minutes manually'
        },
        {
            text: 'New lead from Facebook — Tom Baker, (704) 555-0199, interested in the HVAC maintenance plan.',
            cards: [
                { type: 'contact', label: 'Contact Created', name: 'Tom Baker', detail: '(704) 555-0199', color: '#5E5CE6' },
                { type: 'source', label: 'Source Tagged', name: 'Inbound: Facebook', detail: 'HVAC Maintenance Plan', color: '#30D158' }
            ],
            timeSaved: '2 actions in 1.8 seconds — would take ~3 minutes manually'
        },
        {
            text: 'Mark called back. He\'s ready to sign. Move him to Closed Won and log the $4,200 deal.',
            cards: [
                { type: 'pipeline', label: 'Deal Closed', name: 'Mark Rivera → Closed Won', detail: '$4,200', color: '#30D158' },
                { type: 'note', label: 'Note Logged', name: 'Mark Rivera', detail: 'Called back, ready to sign', color: '#0071E3' }
            ],
            timeSaved: '2 actions in 1.5 seconds — would take ~3 minutes manually'
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
    function materializeCards(cards, timeSaved) {
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

            // Clean 200ms stagger
            setTimeout(() => {
                cardEl.classList.add('visible');
            }, 200 + i * 200);
        });

        // Show time-saved counter after all cards visible
        if (timeSaved) {
            const delay = 200 + cards.length * 200 + 400;
            setTimeout(() => {
                const counterEl = document.createElement('div');
                counterEl.className = 'hero-time-saved';
                counterEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${timeSaved}`;
                outputEl.appendChild(counterEl);
                setTimeout(() => counterEl.classList.add('visible'), 50);
            }, delay);
        }
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
            // After typing completes, materialize cards cleanly
            setTimeout(() => materializeCards(seq.cards, seq.timeSaved), 200);

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
