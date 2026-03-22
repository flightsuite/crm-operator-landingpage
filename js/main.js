console.log('✅ FlightSuite script loading...');

// Web Audio API - Premium Sound Effects (with error handling)
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = null;
let soundEnabled = true;

try {
    audioContext = new AudioContext();
    console.log('✅ Audio context initialized');
} catch (e) {
    console.warn('Audio context failed:', e);
    soundEnabled = false;
}

// Toggle Sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    const toggle = document.getElementById('soundToggle');
    const icon = document.getElementById('soundIcon');

    if (soundEnabled) {
        toggle.classList.remove('muted');
        icon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        `;
        playSuccessSound();
    } else {
        toggle.classList.add('muted');
        icon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
        `;
    }
}

// Toggle Font Size
function toggleFontSize() {
    playClickSound();
    const body = document.body;
    const toggle = document.getElementById('fontToggle');

    body.classList.toggle('large-font');

    if (body.classList.contains('large-font')) {
        toggle.classList.add('active');
    } else {
        toggle.classList.remove('active');
    }
}

// Set large font as default for mobile devices
function initMobileFontSize() {
    if (isMobile()) {
        document.body.classList.add('large-font');
        const toggle = document.getElementById('fontToggle');
        if (toggle) {
            toggle.classList.add('active');
        }
    }
}

// Initialize mobile font size on page load
window.addEventListener('DOMContentLoaded', initMobileFontSize);

// Add demo hint to first button on page load
window.addEventListener('DOMContentLoaded', () => {
    const firstButton = document.querySelector('.suggestion-chip:not(:disabled)');
    if (firstButton) {
        firstButton.classList.add('demo-hint');
    }
});

// User count animation
window.addEventListener('DOMContentLoaded', () => {
    const userCountEl = document.getElementById('userCount');
    if (!userCountEl) return;

    const targetCount = 100;
    let hasAnimated = false;

    const animateCount = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        let current = 0;
        const duration = 1200;
        const startTime = performance.now();

        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            current = Math.round(easeOutQuart(progress) * targetCount);
            userCountEl.textContent = current + '+';

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    // Start animation after badge fades in (0.7s delay + 0.8s animation)
    setTimeout(animateCount, 1500);
});

// Subtle Click Sound (General buttons) - Soft tap
function playClickSound() {
    if (!soundEnabled || !audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(520, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, audioContext.currentTime + 0.05);
    gain.gain.setValueAtTime(0.04, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.05);
}

// Success Sound (Form submissions) - Gentle chime
function playSuccessSound() {
    if (!soundEnabled || !audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
    osc.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.08); // G5
    gain.gain.setValueAtTime(0.05, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.2);
}

// Select Sound (Demo commands) - Satisfying bloop
function playSelectSound() {
    if (!soundEnabled || !audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.04); // A5
    osc.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.08);
    gain.gain.setValueAtTime(0.06, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
}

// Modal Sound (Opening modals) - Warm rise
function playModalSound() {
    if (!soundEnabled || !audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(330, audioContext.currentTime); // E4
    osc.frequency.exponentialRampToValueAtTime(494, audioContext.currentTime + 0.08); // B4
    gain.gain.setValueAtTime(0.04, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.12);
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRequired(value) {
    return value.trim().length > 0;
}

function showError(errorId) {
    document.getElementById(errorId).classList.add('show');
}

function hideError(errorId) {
    document.getElementById(errorId).classList.remove('show');
}

// Enable Enter key to submit forms
function enableEnterKeySubmit(inputId, submitFunction) {
    setTimeout(() => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitFunction();
                }
            });
            // Auto-focus the input for better UX
            input.focus();
        }
    }, 100); // Small delay to ensure DOM is updated
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// FAQ Toggle
function toggleFaq(button) {
    const answer = button.nextElementSibling;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-question').forEach(q => {
        if (q !== button) {
            q.setAttribute('aria-expanded', 'false');
            q.nextElementSibling.classList.remove('open');
        }
    });

    button.setAttribute('aria-expanded', !isExpanded);
    answer.classList.toggle('open');
}

// Install CTA — navigates to guide on desktop, email capture on mobile
function openInstallModal() {
    window.location.href = 'installation-guide.html';
}

function openCrmRequestModal() {
    playModalSound();
    document.getElementById('crmRequestModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    resetCrmRequestForm();
}

function closeModal(modalId) {
    playClickSound();
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

function openModal(modalId) {
    playClickSound();
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}


// Mobile Detection & Email Capture
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

// On mobile, intercept install CTA links to show email capture instead
document.addEventListener('click', function(e) {
    const installLink = e.target.closest('[data-event="install_click"]');
    if (installLink && isMobile()) {
        e.preventDefault();
        openMobileEmailModal();
    }
});

function openMobileEmailModal() {
    playClickSound();
    document.getElementById('mobileEmailModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    resetMobileEmailForm();
}

function resetMobileEmailForm() {
    mobileEmailStep = 0;
    mobileEmailData = {};
    document.getElementById('mobileEmailChat').innerHTML = `
        <div class="message ai" style="margin-bottom: 16px;">
            <div class="message-avatar">FS</div>
            <div class="message-content">
                <div class="message-bubble">
                    FlightSuite is a Chrome extension that works best on desktop. I can email you the installation link! What's your name?
                </div>
            </div>
        </div>
    `;
    document.getElementById('mobileEmailForm').innerHTML = `
        <input type="text" class="form-input" id="mobileName" placeholder="Your name">
        <div class="form-error" id="mobileNameError">Please enter your name</div>
        <button class="form-submit" onclick="submitMobileName()">Continue</button>
    `;
    enableEnterKeySubmit('mobileName', submitMobileName);
}

// Mobile Email Form Logic
let mobileEmailStep = 0;
let mobileEmailData = {};

function submitMobileName() {
    const name = document.getElementById('mobileName').value.trim();
    const nameInput = document.getElementById('mobileName');

    if (!validateRequired(name)) {
        nameInput.classList.add('error');
        showError('mobileNameError');
        return;
    }

    nameInput.classList.remove('error');
    hideError('mobileNameError');
    playSuccessSound();
    mobileEmailData.name = name;

    const chatMessages = document.getElementById('mobileEmailChat');
    chatMessages.innerHTML += `
        <div class="message user" style="margin-bottom: 16px;">
            <div class="message-avatar">You</div>
            <div class="message-content">
                <div class="message-bubble">${name}</div>
            </div>
        </div>
        <div class="message ai" style="margin-bottom: 16px;">
            <div class="message-avatar">FS</div>
            <div class="message-content">
                <div class="message-bubble">
                    Great! What's your email address?
                </div>
            </div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    document.getElementById('mobileEmailForm').innerHTML = `
        <input type="email" class="form-input" id="mobileEmail" placeholder="your@email.com">
        <div class="form-error" id="mobileEmailError">Please enter a valid email</div>
        <button class="form-submit" onclick="submitMobileEmail()">Send Link</button>
    `;
    enableEnterKeySubmit('mobileEmail', submitMobileEmail);
}

function submitMobileEmail() {
    const email = document.getElementById('mobileEmail').value.trim();
    const emailInput = document.getElementById('mobileEmail');

    if (!validateEmail(email)) {
        emailInput.classList.add('error');
        showError('mobileEmailError');
        return;
    }

    emailInput.classList.remove('error');
    hideError('mobileEmailError');
    playSuccessSound();
    mobileEmailData.email = email;

    const chatMessages = document.getElementById('mobileEmailChat');
    chatMessages.innerHTML += `
        <div class="message user" style="margin-bottom: 16px;">
            <div class="message-avatar">You</div>
            <div class="message-content">
                <div class="message-bubble">${email}</div>
            </div>
        </div>
        <div class="message ai" style="margin-bottom: 16px;">
            <div class="message-avatar">FS</div>
            <div class="message-content">
                <div class="message-bubble">
                    Perfect! I've sent the installation link to ${email}. Check your inbox!
                </div>
                <div class="message-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: var(--color-success);">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Email sent
                </div>
            </div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    document.getElementById('mobileEmailForm').innerHTML = `
        <button class="form-submit" onclick="closeModal('mobileEmailModal')">Close</button>
    `;

    // Submit to Airtable
    console.log('Mobile Email Capture:', mobileEmailData);
    mobileEmailData.timestamp = new Date().toISOString();

    // Send to Airtable
    submitMobileEmailCapture(mobileEmailData)
        .then(() => console.log('✅ Mobile Email submission successful'))
        .catch(error => console.error('❌ Mobile Email submission failed:', error));
}

// CRM Request Form Logic
let crmFormStep = 0;
let crmFormData = {};

function resetCrmRequestForm() {
    crmFormStep = 0;
    crmFormData = {};
    document.getElementById('crmChatMessages').innerHTML = `
        <div class="message ai" style="margin-bottom: 16px;">
            <div class="message-avatar">FS</div>
            <div class="message-content">
                <div class="message-bubble">
                    We're adding support for more CRMs! What's your name?
                </div>
            </div>
        </div>
    `;
    document.getElementById('crmRequestForm').innerHTML = `
        <input type="text" class="form-input" id="crmName" placeholder="Your name">
        <div class="form-error" id="crmNameError">Please enter your name</div>
        <button class="form-submit" onclick="submitCrmName()">Continue</button>
    `;
    enableEnterKeySubmit('crmName', submitCrmName);
}

function submitCrmName() {
    const name = document.getElementById('crmName').value.trim();
    const nameInput = document.getElementById('crmName');

    if (!validateRequired(name)) {
        nameInput.classList.add('error');
        showError('crmNameError');
        return;
    }

    nameInput.classList.remove('error');
    hideError('crmNameError');
    playSuccessSound();
    crmFormData.name = name;

    const chatMessages = document.getElementById('crmChatMessages');
    chatMessages.innerHTML += `
        <div class="message user" style="margin-bottom: 16px;">
            <div class="message-avatar">You</div>
            <div class="message-content">
                <div class="message-bubble">${name}</div>
            </div>
        </div>
        <div class="message ai" style="margin-bottom: 16px;">
            <div class="message-avatar">FS</div>
            <div class="message-content">
                <div class="message-bubble">
                    Great! What's your email?
                </div>
            </div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    document.getElementById('crmRequestForm').innerHTML = `
        <input type="email" class="form-input" id="crmEmail" placeholder="your@email.com">
        <div class="form-error" id="crmEmailError">Please enter a valid email</div>
        <button class="form-submit" onclick="submitCrmEmail()">Continue</button>
    `;
    enableEnterKeySubmit('crmEmail', submitCrmEmail);
}

function submitCrmEmail() {
    const email = document.getElementById('crmEmail').value.trim();
    const emailInput = document.getElementById('crmEmail');

    if (!validateEmail(email)) {
        emailInput.classList.add('error');
        showError('crmEmailError');
        return;
    }

    emailInput.classList.remove('error');
    hideError('crmEmailError');
    playSuccessSound();
    crmFormData.email = email;

    const chatMessages = document.getElementById('crmChatMessages');
    chatMessages.innerHTML += `
        <div class="message user" style="margin-bottom: 16px;">
            <div class="message-avatar">You</div>
            <div class="message-content">
                <div class="message-bubble">${email}</div>
            </div>
        </div>
        <div class="message ai" style="margin-bottom: 16px;">
            <div class="message-avatar">FS</div>
            <div class="message-content">
                <div class="message-bubble">
                    Which CRM do you use?
                </div>
            </div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    document.getElementById('crmRequestForm').innerHTML = `
        <input type="text" class="form-input" id="crmType" placeholder="e.g., Salesforce, HubSpot">
        <div class="form-error" id="crmTypeError">Please enter your CRM name</div>
        <button class="form-submit" onclick="submitCrmType()">Submit</button>
    `;
    enableEnterKeySubmit('crmType', submitCrmType);
}

function submitCrmType() {
    const crm = document.getElementById('crmType').value.trim();
    const crmInput = document.getElementById('crmType');

    if (!validateRequired(crm)) {
        crmInput.classList.add('error');
        showError('crmTypeError');
        return;
    }

    crmInput.classList.remove('error');
    hideError('crmTypeError');
    playSuccessSound();
    crmFormData.crm = crm;

    const chatMessages = document.getElementById('crmChatMessages');
    chatMessages.innerHTML += `
        <div class="message user" style="margin-bottom: 16px;">
            <div class="message-avatar">You</div>
            <div class="message-content">
                <div class="message-bubble">${crm}</div>
            </div>
        </div>
        <div class="message ai" style="margin-bottom: 16px;">
            <div class="message-avatar">FS</div>
            <div class="message-content">
                <div class="message-bubble">
                    Thanks ${crmFormData.name}! We'll reach out about adding ${crm} support.
                </div>
                <div class="message-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: var(--color-success);">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Request submitted
                </div>
            </div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    document.getElementById('crmRequestForm').innerHTML = `
        <button class="form-submit" onclick="closeModal('crmRequestModal')">Close</button>
    `;

    // Submit to Airtable
    console.log('CRM Request:', crmFormData);
    crmFormData.timestamp = new Date().toISOString();

    // Send to Airtable
    submitCrmWaitlist(crmFormData)
        .then(() => console.log('✅ CRM Waitlist submission successful'))
        .catch(error => console.error('❌ CRM Waitlist submission failed:', error));
}

// Demo Functionality - Simplified
let currentDemoStep = 0;

const demoData = [
    {
        user: "Add Jane Doe as a new contact with email jane@company.com",
        ai: "Done. I've added Jane Doe to your CRM.",
        confirmation: "Contact created",
        action: () => showContact()
    },
    {
        user: "Log a note for Jane: Discussed pricing for enterprise plan",
        ai: "Logged. Note added to Jane's contact.",
        confirmation: "Note added",
        action: () => addNote()
    },
    {
        user: "Move Jane to Discovery stage",
        ai: "Updated. Jane is now in Discovery.",
        confirmation: "Stage updated",
        action: () => updateStage()
    },
    {
        user: "What's Jane's email address?",
        ai: "Jane's email is jane@company.com",
        confirmation: null,
        action: () => highlightEmail()
    },
    {
        user: "Show all my contacts",
        ai: "Here are your contacts:",
        confirmation: "3 contacts found",
        action: () => showAllContacts()
    }
];

async function runDemoCommand(index) {
    if (index !== currentDemoStep) return;

    const cmd = demoData[index];
    playSelectSound();

    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '';

    addMessage('user', cmd.user);

    await showTypingIndicator();

    playSuccessSound();
    addMessage('ai', cmd.ai, cmd.confirmation);

    if (cmd.action) {
        setTimeout(() => cmd.action(), 600);
    }

    currentDemoStep++;

    // Enable next button, disable current, and move demo hint
    const buttons = document.querySelectorAll('.suggestion-chip');
    buttons[index].disabled = true;
    buttons[index].classList.remove('demo-hint');
    if (buttons[index + 1]) {
        buttons[index + 1].disabled = false;
        buttons[index + 1].classList.add('demo-hint');
    }

    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 200);
}

function addMessage(type, text, confirmation) {
    const messagesContainer = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'ai' ? 'FS' : 'You';

    const content = document.createElement('div');
    content.className = 'message-content';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;

    content.appendChild(bubble);

    if (confirmation) {
        const check = document.createElement('div');
        check.className = 'message-check';
        check.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: var(--color-success);">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            ${confirmation}
        `;
        content.appendChild(check);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
}

function showTypingIndicator() {
    return new Promise((resolve) => {
        const messagesContainer = document.getElementById('chatMessages');

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai';
        messageDiv.id = 'typingIndicator';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = 'FS';

        const content = document.createElement('div');
        content.className = 'message-content';

        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

        content.appendChild(typing);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setTimeout(() => {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) {
                indicator.remove();
            }
            resolve();
        }, 1500);
    });
}

// CRM Actions
function showContact() {
    const crmContent = document.getElementById('crmContent');
    crmContent.innerHTML = `
        <div class="contact-card">
            <div class="contact-header">
                <div>
                    <div class="contact-name">Jane Doe</div>
                </div>
                <div class="contact-stage" id="contactStage">New Lead</div>
            </div>
            <div class="contact-field" id="emailField">
                <div class="field-label">Email</div>
                <div class="field-value">jane@company.com</div>
            </div>
            <div class="contact-field">
                <div class="field-label">Phone</div>
                <div class="field-value">Not provided</div>
            </div>
            <div class="contact-notes" id="contactNotes" style="display: none;">
                <div class="notes-header">Notes</div>
                <div id="notesList"></div>
            </div>
        </div>
    `;
}

function addNote() {
    const notesSection = document.getElementById('contactNotes');
    const notesList = document.getElementById('notesList');
    notesSection.style.display = 'block';
    const note = document.createElement('div');
    note.className = 'note-item';
    note.textContent = 'Discussed pricing for enterprise plan';
    notesList.appendChild(note);
}

function updateStage() {
    const stageEl = document.getElementById('contactStage');
    if (stageEl) {
        stageEl.textContent = 'Discovery';
        stageEl.classList.add('discovery');
    }
}

function highlightEmail() {
    const emailField = document.getElementById('emailField');
    if (emailField) {
        emailField.classList.add('highlighted');
        setTimeout(() => {
            emailField.classList.remove('highlighted');
        }, 2000);
    }
}

function showAllContacts() {
    const crmContent = document.getElementById('crmContent');
    crmContent.innerHTML = `
        <div class="contact-list">
            <div class="contact-list-item">
                <div class="contact-info">
                    <div class="contact-list-name">Jane Doe</div>
                    <div class="contact-list-email">jane@company.com</div>
                </div>
                <div class="contact-list-stage">Discovery</div>
            </div>
            <div class="contact-list-item">
                <div class="contact-info">
                    <div class="contact-list-name">John Smith</div>
                    <div class="contact-list-email">john@acme.com</div>
                </div>
                <div class="contact-list-stage">Proposal</div>
            </div>
            <div class="contact-list-item">
                <div class="contact-info">
                    <div class="contact-list-name">Sarah Johnson</div>
                    <div class="contact-list-email">sarah@techcorp.com</div>
                </div>
                <div class="contact-list-stage">New Lead</div>
            </div>
        </div>
    `;
}

// ===== PARTICLE FUSION ANIMATION - CRM + AI SYNERGY =====
const fusionContainer = document.getElementById('fusionContainer');
const fusionCore = document.getElementById('fusionCore');

// Configuration
const FUSION_CONFIG = {
    desktop: {
        particlesPerStream: 3,
        streamInterval: 2500,
        maxConcurrent: 60
    },
    mobile: {
        particlesPerStream: 2,
        streamInterval: 3500,
        maxConcurrent: 30
    }
};

// State management
let fusionIntervalId = null;
let activeParticleCount = 0;
let isPageVisible = true;
let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getConfig() {
    return window.innerWidth < 768 ? FUSION_CONFIG.mobile : FUSION_CONFIG.desktop;
}

function incrementParticleCount() {
    activeParticleCount++;
}

function decrementParticleCount() {
    activeParticleCount--;
}

// Create a single fusion particle
function createFusionParticle(side) {
    if (!fusionContainer || prefersReducedMotion || !isPageVisible) return;

    const config = getConfig();
    if (activeParticleCount >= config.maxConcurrent) return;

    const particle = document.createElement('div');
    particle.className = `fusion-particle ${side}`;

    const containerRect = fusionContainer.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    // Start position: left or right edge with vertical variance
    const startX = side === 'crm' ? -10 : containerRect.width + 10;
    const startY = centerY + (Math.random() - 0.5) * containerRect.height * 0.6;

    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.opacity = '0';

    fusionContainer.appendChild(particle);
    incrementParticleCount();

    // Animate particle along curved path to center
    const duration = 2500 + Math.random() * 1000; // 2.5-3.5s
    const start = performance.now();

    // Control points for bezier-like curve
    const controlY = startY + (Math.random() - 0.5) * 100;

    function animate(currentTime) {
        if (!isPageVisible || prefersReducedMotion) {
            particle.remove();
            decrementParticleCount();
            return;
        }

        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-in-out for smooth flow
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Calculate position along curved path
        const t = easeProgress;
        const currentX = startX + (centerX - startX) * t;

        // Bezier-like curve for Y
        const y1 = startY;
        const y2 = controlY;
        const y3 = centerY;
        const currentY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * y2 + t * t * y3;

        // Opacity: fade in, stay visible, fade out near center
        let opacity;
        if (progress < 0.1) {
            opacity = progress * 10; // Fade in
        } else if (progress > 0.85) {
            opacity = (1 - progress) / 0.15; // Fade out
        } else {
            opacity = 1;
        }

        // Scale decreases as approaching center
        const scale = 1 - progress * 0.3;

        particle.style.left = currentX + 'px';
        particle.style.top = currentY + 'px';
        particle.style.opacity = opacity;
        particle.style.transform = `scale(${scale})`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
            decrementParticleCount();

            // Trigger core pulse when particle reaches center
            triggerCorePulse();
        }
    }

    requestAnimationFrame(animate);
}

// Pulse the fusion core when particles merge
let pulseTimeout = null;
function triggerCorePulse() {
    if (!fusionCore || prefersReducedMotion) return;

    // Debounce rapid pulses
    if (pulseTimeout) return;

    fusionCore.classList.add('pulse');
    pulseTimeout = setTimeout(() => {
        fusionCore.classList.remove('pulse');
        pulseTimeout = null;
    }, 600);
}

// Launch a stream of particles from both sides
function launchFusionStream() {
    if (prefersReducedMotion || !isPageVisible) return;

    const config = getConfig();
    if (activeParticleCount >= config.maxConcurrent) return;

    // Launch particles from both sides with staggered timing
    for (let i = 0; i < config.particlesPerStream; i++) {
        setTimeout(() => {
            if (isPageVisible && !prefersReducedMotion) {
                createFusionParticle('crm'); // Blue from left
            }
        }, i * 200);

        setTimeout(() => {
            if (isPageVisible && !prefersReducedMotion) {
                createFusionParticle('ai'); // Purple from right
            }
        }, i * 200 + 100);
    }
}

// Start fusion animation system
function startFusion() {
    if (fusionIntervalId) {
        clearInterval(fusionIntervalId);
    }

    if (prefersReducedMotion) {
        console.log('Fusion animation disabled: user prefers reduced motion');
        return;
    }

    // Initial launch with delay
    setTimeout(() => {
        if (isPageVisible && !prefersReducedMotion) {
            launchFusionStream();
        }
    }, 800);

    // Periodic launches
    const config = getConfig();
    fusionIntervalId = setInterval(() => {
        launchFusionStream();
    }, config.streamInterval);

    console.log('Fusion animation started');
}

// Stop fusion animation system
function stopFusion() {
    if (fusionIntervalId) {
        clearInterval(fusionIntervalId);
        fusionIntervalId = null;
        console.log('Fusion animation stopped');
    }
}

// Page Visibility API - pause/resume animations when tab visibility changes
document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;

    if (document.hidden) {
        stopFusion();
    } else {
        startFusion();
    }
});

// Cleanup on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
    stopFusion();
});

// Listen for reduced motion preference changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
        stopFusion();
    } else {
        startFusion();
    }
});

// Initialize fusion animation system
startFusion();

// Demo buttons are now in HTML - no initialization needed
console.log('✅ Demo initialized with hardcoded buttons');

// Close modals when clicking outside
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// ═══ MOBILE CTA → PHONE CAPTURE ═══
(function() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
    if (!isMobile) return;

    // Intercept all install CTAs on mobile
    document.querySelectorAll('[data-event="install_click"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openMobileCapture();
        });
    });
})();

function openMobileCapture() {
    const modal = document.getElementById('mobileCaptureModal');
    if (modal) {
        modal.classList.add('show');
        setTimeout(() => {
            const phone = document.getElementById('mcPhone');
            if (phone) phone.focus();
        }, 400);
    }
}

function closeMobileCapture() {
    const modal = document.getElementById('mobileCaptureModal');
    if (modal) modal.classList.remove('show');
}

async function submitMobileCapture() {
    const country = (document.getElementById('mcCountry').value || '+1').trim();
    const phone = (document.getElementById('mcPhone').value || '').trim();
    const errEl = document.getElementById('mcError');
    const btn = document.getElementById('mcSubmit');

    // Validate
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7) {
        errEl.textContent = 'Please enter a valid phone number';
        errEl.style.display = 'block';
        return;
    }
    errEl.style.display = 'none';

    const fullNumber = country + digits;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
        const API = 'https://api.flightsuite.ai/api/v1';
        const r = await fetch(API + '/leads/sms-setup-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: fullNumber }),
        });

        if (r.status === 429) {
            errEl.textContent = 'Link already sent! Check your messages.';
            errEl.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Text me the link';
            return;
        }

        if (!r.ok) {
            const d = await r.json().catch(() => ({}));
            throw new Error(d.detail || 'Could not send SMS');
        }

        // Success
        document.getElementById('mobileCaptureForm').style.display = 'none';
        document.getElementById('mobileCaptureSuccess').style.display = 'flex';
    } catch (e) {
        errEl.textContent = e.message || 'Something went wrong. Try again.';
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Text me the link';
    }
}

// Close mobile capture on overlay click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('mobileCaptureModal');
    if (modal && e.target === modal) closeMobileCapture();
});

// Capture referral code from URL for attribution across page loads
(function() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
        localStorage.setItem('fs_ref', ref);
    }
})();

console.log('✅ FlightSuite script fully loaded - All systems ready!');
