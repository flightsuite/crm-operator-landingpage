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
            text: 'Just finished a walkthrough with the Hendersons. They love the kitchen layout. Schedule follow-up for Saturday.',
            cards: [
                { label: 'Note Logged', name: 'Henderson Walkthrough', detail: 'Kitchen layout positive feedback', color: '#0071E3' },
                { label: 'Pipeline Updated', name: 'Henderson → Showing Complete', detail: 'From: Scheduled', color: '#30D158' },
                { label: 'Follow-up Set', name: 'Henderson Family', detail: 'Saturday, 11:00 AM', color: '#FF9F0A' }
            ]
        },
        {
            text: 'New lead from Google Ads — Rachel Torres, (980) 555-0233, wants a quote on full HVAC install.',
            cards: [
                { label: 'Contact Created', name: 'Rachel Torres', detail: '(980) 555-0233', color: '#5E5CE6' },
                { label: 'Source Tagged', name: 'Inbound: Google Ads', detail: 'Full HVAC Install', color: '#30D158' }
            ]
        },
        {
            text: 'Kevin confirmed the $8,500 contract. Move to Closed Won. Send him the onboarding email.',
            cards: [
                { label: 'Deal Closed', name: 'Kevin Park → Closed Won', detail: '$8,500', color: '#30D158' },
                { label: 'Email Sent', name: 'Onboarding Welcome', detail: 'Sent to kevin@parkdesign.com', color: '#0071E3' }
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
