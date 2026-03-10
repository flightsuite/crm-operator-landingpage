/* ================================================================
   FlightSuite — Data Flow Scene
   Auto-playing animated demo: terminal → energy → CRM cards
   Inspired by dark futuristic workspace mockups
   ================================================================ */

(function() {
    'use strict';

    const typedEl = document.getElementById('dataflowTyped');
    const outputEl = document.getElementById('dataflowOutput');
    const statusDot = document.querySelector('.dataflow-status-dot');
    const statusText = document.querySelector('.dataflow-status-text');
    const brain = document.querySelector('.dataflow-brain');
    const paths = document.querySelectorAll('.dataflow-path');

    if (!typedEl || !outputEl) return;

    const sequences = [
        {
            text: 'Had a call with Sarah Chen. She wants the enterprise plan. Move her to Discovery.',
            cards: [
                { label: 'Contact Updated', name: 'Sarah Chen', detail: 'Enterprise Plan Interest', color: '#5E5CE6' },
                { label: 'Note Logged', name: 'Call Summary', detail: 'Discussed enterprise pricing', color: '#0071E3' },
                { label: 'Pipeline Moved', name: 'Sarah Chen → Discovery', detail: 'From: New Lead', color: '#30D158' }
            ]
        },
        {
            text: 'Create a contact for Mike Johnson at Acme Corp. Email mike@acme.com, phone (704) 555-0142.',
            cards: [
                { label: 'Contact Created', name: 'Mike Johnson', detail: 'Acme Corp', color: '#5E5CE6' },
                { label: 'Details Added', name: 'mike@acme.com', detail: '(704) 555-0142', color: '#0071E3' }
            ]
        },
        {
            text: 'Book a demo for Lisa Park next Tuesday at 2pm. She found us through the blog.',
            cards: [
                { label: 'Appointment Booked', name: 'Lisa Park — Demo', detail: 'Tuesday, 2:00 PM', color: '#FF9F0A' },
                { label: 'Source Tagged', name: 'Inbound: Blog', detail: 'Attribution tracked', color: '#30D158' }
            ]
        }
    ];

    let currentSequence = 0;

    function setStatus(text, active) {
        if (statusDot) statusDot.classList.toggle('active', active);
        if (statusText) {
            statusText.textContent = text;
            statusText.classList.toggle('active', active);
        }
    }

    function setFlowActive(active) {
        paths.forEach(p => p.classList.toggle('active', active));
        if (brain) brain.classList.toggle('active', active);
    }

    function typeText(text) {
        return new Promise(resolve => {
            typedEl.textContent = '';
            let i = 0;
            const speed = 28 + Math.random() * 12;

            function tick() {
                if (i < text.length) {
                    typedEl.textContent += text[i];
                    i++;
                    const delay = '.!?,'.includes(text[i - 1]) ? speed * 5 : speed;
                    setTimeout(tick, delay);
                } else {
                    resolve();
                }
            }
            tick();
        });
    }

    function materializeCards(cards) {
        outputEl.innerHTML = '';
        cards.forEach((card, i) => {
            const el = document.createElement('div');
            el.className = 'dataflow-card';
            el.innerHTML = `
                <div class="dataflow-card-header">
                    <div class="dataflow-card-dot" style="background:${card.color}; box-shadow: 0 0 6px ${card.color}"></div>
                    <div class="dataflow-card-label">${card.label}</div>
                </div>
                <div class="dataflow-card-name">${card.name}</div>
                <div class="dataflow-card-detail">${card.detail}</div>
            `;
            outputEl.appendChild(el);

            setTimeout(() => el.classList.add('visible'), 200 + i * 350);
        });
    }

    function clearCards() {
        const cards = outputEl.querySelectorAll('.dataflow-card');
        cards.forEach(c => {
            c.style.opacity = '0';
            c.style.transform = 'translateX(20px)';
        });
        setTimeout(() => { outputEl.innerHTML = ''; }, 400);
    }

    async function runSequence() {
        const seq = sequences[currentSequence];

        // Phase 1: Typing
        setStatus('Listening...', false);
        setFlowActive(false);
        await typeText(seq.text);

        // Phase 2: Processing — energy flows activate
        setStatus('Processing...', true);
        setFlowActive(true);
        await new Promise(r => setTimeout(r, 800));

        // Phase 3: CRM cards materialize
        setStatus('CRM Updated', true);
        materializeCards(seq.cards);

        // Hold for reading
        await new Promise(r => setTimeout(r, 4500));

        // Reset
        clearCards();
        setFlowActive(false);
        setStatus('Ready', false);
        await new Promise(r => setTimeout(r, 800));

        currentSequence = (currentSequence + 1) % sequences.length;
        runSequence();
    }

    // Start after delay
    function init() {
        setTimeout(runSequence, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('Data Flow scene loaded');
})();
