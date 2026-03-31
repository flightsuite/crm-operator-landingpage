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
        'faq': '#faq',
        'questions': '#faq',
        'help': '#faq',
        'features': '#capabilities',
        'capabilities': '#capabilities',
        'what can it do': '#capabilities',
        'integrations': '#integrations',
        'crms': '#integrations',
        'roadmap': '#integrations',
        'install': null, // special
        'get started': null,
        'try it': null,
    };

    // --- CRM demo commands (simulate product behavior) ---
    const crmPatterns = [
        { match: /add (.+) as a contact/i, response: (m) => `✓ Creating contact: ${m[1]}` },
        { match: /create (?:a )?contact (?:for )?(.+)/i, response: (m) => `✓ Creating contact: ${m[1]}` },
        { match: /log (?:a )?(?:note|call|meeting)(.*)/i, response: (m) => `✓ Logging${m[1] || ' note'} to CRM...` },
        { match: /move (.+) to (.+)/i, response: (m) => `✓ Moving ${m[1]} → ${m[2]}` },
        { match: /book (?:a )?(?:meeting|demo|call|appointment)(.*)/i, response: (m) => `✓ Booking appointment${m[1] || ''}...` },
        { match: /update (.+)/i, response: (m) => `✓ Updating ${m[1]}...` },
        { match: /send (?:an? )?(?:email|message)(.*)/i, response: (m) => `✓ Sending message${m[1] || ''}...` },
        { match: /schedule (?:a )?(?:follow.?up|reminder)(.*)/i, response: (m) => `✓ Scheduling follow-up${m[1] || ''}...` },
        { match: /tag (.+?) (?:as|with) (.+)/i, response: (m) => `✓ Tagging ${m[1]}: ${m[2]}` },
        { match: /set (.+?) (?:to|as) (.+)/i, response: (m) => `✓ Setting ${m[1]} → ${m[2]}` },
        { match: /find (.+)/i, response: (m) => `✓ Searching CRM for "${m[1]}"...` },
        { match: /search (.+)/i, response: (m) => `✓ Searching CRM for "${m[1]}"...` },
        { match: /(?:had|just had|finished) (?:a )?(?:call|meeting|demo) with (.+)/i, response: (m) => `✓ Logging call with ${m[1]} & updating pipeline` },
        { match: /(.+) (?:wants|interested|asked about) (.+)/i, response: (m) => `✓ Updating ${m[1]}: interested in ${m[2]}` },
        { match: /delete (.+)/i, response: (m) => `✓ Removing ${m[1]}...` },
        { match: /remind me (.+)/i, response: (m) => `✓ Setting reminder: ${m[1]}` },
    ];

    let isOpen = false;

    // --- Cycling placeholder examples ---
    const examples = [
        'Just finished a call with Jessica about the estimate...',
        'New lead from Facebook — Tom Baker...',
        'Mark called back, ready to sign...',
        'Schedule a follow-up with Henderson for Saturday...',
        'Log my call with Rachel about the HVAC install...',
        'Show me the demo',
        'Had a meeting with John, he wants enterprise...',
    ];
    let exampleIdx = 0;
    let charIdx = 0;
    let isTyping = true;
    let pauseTimer = null;
    let typeTimer = null;

    function cycleplaceholder() {
        if (isOpen || document.activeElement === inputEl) return;
        if (isTyping) {
            charIdx++;
            inputEl.placeholder = examples[exampleIdx].substring(0, charIdx);
            if (charIdx >= examples[exampleIdx].length) {
                isTyping = false;
                pauseTimer = setTimeout(cycleplaceholder, 2000);
                return;
            }
            typeTimer = setTimeout(cycleplaceholder, 50 + Math.random() * 40);
        } else {
            charIdx = 0;
            exampleIdx = (exampleIdx + 1) % examples.length;
            isTyping = true;
            inputEl.placeholder = '';
            typeTimer = setTimeout(cycleplaceholder, 400);
        }
    }

    function stopCycling() {
        clearTimeout(pauseTimer);
        clearTimeout(typeTimer);
    }

    function restartCycling() {
        stopCycling();
        if (!isOpen) {
            charIdx = 0;
            isTyping = true;
            typeTimer = setTimeout(cycleplaceholder, 1000);
        }
    }

    // Start cycling after a short delay
    setTimeout(cycleplaceholder, 2000);

    function openBar() {
        stopCycling();
        inputEl.placeholder = 'Type a CRM command...';
        isOpen = true;
        barEl.classList.add('open');
        inputEl.focus();
    }

    function closeBar() {
        isOpen = false;
        barEl.classList.remove('open');
        inputEl.blur();
        inputEl.value = '';
        restartCycling();
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

        // Default: honest fallback — this is a preview, not the real agent
        showCommandFeedback(`This is a preview — install FlightSuite to use the real agent! Try: "Add Sarah as a contact"`);
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
