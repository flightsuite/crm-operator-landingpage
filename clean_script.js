// FlightSuite Landing Page - Clean JavaScript
console.log('✅ FlightSuite script loaded');

// ============================================
// AUDIO SYSTEM
// ============================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
let soundEnabled = true;

function toggleSound() {
    soundEnabled = !soundEnabled;
    const toggle = document.getElementById('soundToggle');
    const icon = document.getElementById('soundIcon');

    if (soundEnabled) {
        toggle?.classList.remove('muted');
        if (icon) {
            icon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            `;
        }
        playSuccessSound();
    } else {
        toggle?.classList.add('muted');
        if (icon) {
            icon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            `;
        }
    }
}

function toggleFontSize() {
    playClickSound();
    const body = document.body;
    const toggle = document.getElementById('fontToggle');

    body.classList.toggle('large-font');

    if (body.classList.contains('large-font')) {
        toggle?.classList.add('active');
    } else {
        toggle?.classList.remove('active');
    }
}

// Sound Effects
function playClickSound() {
    if (!soundEnabled) return;
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

function playSuccessSound() {
    if (!soundEnabled) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(659.25, audioContext.currentTime);
    osc.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.08);
    gain.gain.setValueAtTime(0.05, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.2);
}

function playSelectSound() {
    if (!soundEnabled) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(440, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.04);
    osc.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.08);
    gain.gain.setValueAtTime(0.06, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
}

function playModalSound() {
    if (!soundEnabled) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(330, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(494, audioContext.currentTime + 0.08);
    gain.gain.setValueAtTime(0.04, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.12);
}

console.log('✅ Audio system initialized');
