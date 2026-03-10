/* ================================================================
   FlightSuite — Command Bar (Typing-as-Navigation)
   The navigation IS the product. Type to navigate OR demo CRM actions.
   ================================================================ */

(function() {
    'use strict';

    const barEl = document.getElementById('commandBar');
    const inputEl = document.getElementById('commandBarInput');
    if (!barEl || !inputEl) return;

    // --- Navigation commands ---
    const navCommands = {
        'demo': '#demo',
        'show me the demo': '#demo',
        'watch demo': '#demo',
        'pricing': '#pricing',
        'how much': '#pricing',
        'plans': '#pricing',
        'faq': '#faq',
        'questions': '#faq',
        'help': '#faq',
        'features': '#capabilities',
        'capabilities': '#capabilities',
        'what can it do': '#capabilities',
        'integrations': '#integrations',
        'crms': '#integrations',
        'testimonials': '#press',
        'reviews': '#press',
        'press': '#press',
        'install': null, // special
        'get started': null,
        'try it': null,
    };

    // --- CRM demo commands (simulate product behavior) ---
    const crmPatterns = [
        { match: /add (.+) as a contact/i, response: (m) => `Creating contact: ${m[1]}...` },
        { match: /create contact (.+)/i, response: (m) => `Creating contact: ${m[1]}...` },
        { match: /log (?:a )?note/i, response: () => 'Logging note to CRM...' },
        { match: /move (.+) to (.+)/i, response: (m) => `Moving ${m[1]} to ${m[2]}...` },
        { match: /book (?:a )?(?:meeting|demo|call)/i, response: () => 'Booking appointment...' },
        { match: /update (.+)/i, response: (m) => `Updating ${m[1]}...` },
    ];

    let isOpen = false;

    function openBar() {
        isOpen = true;
        barEl.classList.add('open');
        inputEl.focus();
    }

    function closeBar() {
        isOpen = false;
        barEl.classList.remove('open');
        inputEl.blur();
        inputEl.value = '';
    }

    function handleCommand(raw) {
        const cmd = raw.trim().toLowerCase();
        if (!cmd) return;

        // Check navigation commands
        for (const [key, target] of Object.entries(navCommands)) {
            if (cmd.includes(key)) {
                if (target === null) {
                    // Install action
                    closeBar();
                    if (typeof openInstallModal === 'function') {
                        openInstallModal();
                    }
                    return;
                }
                // Scroll to section
                const el = document.querySelector(target);
                if (el) {
                    closeBar();
                    el.scrollIntoView({ behavior: 'smooth' });
                    return;
                }
            }
        }

        // Check CRM demo patterns
        for (const pattern of crmPatterns) {
            const match = cmd.match(pattern.match);
            if (match) {
                showCommandFeedback(pattern.response(match));
                return;
            }
        }

        // Default: treat as search/navigation hint
        showCommandFeedback(`Try: "show me the demo" or "Add John as a contact"`);
    }

    function showCommandFeedback(text) {
        // Show inline feedback in the command bar
        const feedback = document.createElement('div');
        feedback.className = 'command-bar-feedback';
        feedback.innerHTML = `<span class="command-bar-feedback-dot"></span>${text}`;
        barEl.appendChild(feedback);

        requestAnimationFrame(() => feedback.classList.add('visible'));

        setTimeout(() => {
            feedback.classList.remove('visible');
            setTimeout(() => feedback.remove(), 300);
        }, 2500);

        inputEl.value = '';
    }

    // --- Keyboard shortcut: ⌘K / Ctrl+K ---
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (isOpen) {
                closeBar();
            } else {
                openBar();
            }
        }
        if (e.key === 'Escape' && isOpen) {
            closeBar();
        }
    });

    // --- Enter to execute ---
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand(inputEl.value);
        }
    });

    // --- Click on bar opens it ---
    barEl.addEventListener('click', (e) => {
        if (!isOpen) openBar();
    });

    // --- Click outside closes ---
    document.addEventListener('click', (e) => {
        if (isOpen && !barEl.contains(e.target)) {
            closeBar();
        }
    });

    console.log('Command Bar loaded');
})();
