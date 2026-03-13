/* ================================================================
   FlightSuite — Ghost Agent
   Persistent AI activity indicator — product proof through behavior.
   Shows CRM actions completing while user browses the site.
   ================================================================ */

(function() {
    'use strict';

    const ghostEl = document.getElementById('ghostAgent');
    const feedEl = document.getElementById('ghostAgentFeed');
    if (!ghostEl || !feedEl) return;

    // --- CRM actions the agent "performs" as user browses ---
    const actions = [
        { text: 'Contact synced — Sarah Chen', icon: '✓', delay: 0 },
        { text: 'Note logged — Call summary', icon: '✓', delay: 0 },
        { text: 'Pipeline updated — Discovery', icon: '✓', delay: 0 },
        { text: 'Scanning for new leads...', icon: '◌', delay: 0 },
        { text: 'Appointment created — Demo call', icon: '✓', delay: 0 },
        { text: 'Email tagged — Follow-up', icon: '✓', delay: 0 },
        { text: 'Duplicate merged — 2 contacts', icon: '✓', delay: 0 },
        { text: 'Task created — Send proposal', icon: '✓', delay: 0 },
        { text: 'Deal value updated — $24,000', icon: '✓', delay: 0 },
        { text: 'Activity logged — LinkedIn visit', icon: '✓', delay: 0 },
        { text: 'Smart tag applied — Enterprise', icon: '✓', delay: 0 },
        { text: 'Contact enriched — Company data', icon: '✓', delay: 0 },
    ];

    let actionIndex = 0;
    let isVisible = false;
    let cycleTimer = null;

    function showAgent() {
        if (isVisible) return;
        isVisible = true;
        ghostEl.classList.add('active');
    }

    function hideAgent() {
        if (!isVisible) return;
        isVisible = false;
        ghostEl.classList.remove('active');
    }

    function addAction() {
        const action = actions[actionIndex];
        actionIndex = (actionIndex + 1) % actions.length;

        const item = document.createElement('div');
        item.className = 'ghost-agent-item';
        item.innerHTML = `<span class="ghost-agent-icon">${action.icon}</span><span>${action.text}</span>`;

        feedEl.appendChild(item);

        // Animate in
        requestAnimationFrame(() => {
            item.classList.add('visible');
        });

        // Keep only last 3 items visible
        const items = feedEl.querySelectorAll('.ghost-agent-item');
        if (items.length > 3) {
            const old = items[0];
            old.classList.add('exiting');
            setTimeout(() => old.remove(), 300);
        }
    }

    // --- Scroll-aware: agent appears after user scrolls past hero ---
    function initScrollBehavior() {
        const hero = document.getElementById('hero');
        if (!hero) {
            // Fallback: show after delay
            setTimeout(() => {
                showAgent();
                startCycle();
            }, 5000);
            return;
        }

        let hasTriggered = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && !hasTriggered) {
                    // User scrolled past hero
                    hasTriggered = true;
                    showAgent();
                    startCycle();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(hero);
    }

    function startCycle() {
        // First action immediately
        addAction();

        // Then every 3-5 seconds
        function scheduleNext() {
            const delay = 3000 + Math.random() * 2000;
            cycleTimer = setTimeout(() => {
                addAction();
                scheduleNext();
            }, delay);
        }
        scheduleNext();
    }

    // --- Click to dismiss ---
    ghostEl.addEventListener('click', () => {
        hideAgent();
        if (cycleTimer) clearTimeout(cycleTimer);
    });

    // --- Init ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollBehavior);
    } else {
        initScrollBehavior();
    }

    console.log('Ghost Agent loaded');
})();
