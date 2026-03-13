/* ================================================================
   FlightSuite — Generative Unique-Per-Visit System
   Timestamp seed influences particle config, gradient accent,
   animation timing. No two visits are exactly alike.
   ================================================================ */

(function() {
    'use strict';

    // Seed from timestamp — changes every ~10 minutes
    const seed = Math.floor(Date.now() / 600000);

    // Seeded pseudo-random (deterministic per visit window)
    function seededRandom(s) {
        let x = Math.sin(s * 9301 + 49297) * 49297;
        return x - Math.floor(x);
    }

    // Generate variation values from seed
    const v1 = seededRandom(seed);
    const v2 = seededRandom(seed + 1);
    const v3 = seededRandom(seed + 2);
    const v4 = seededRandom(seed + 3);
    const v5 = seededRandom(seed + 4);

    // --- Accent Color Shift ---
    // Subtle hue rotation on the accent purple (±15deg)
    const hueShift = Math.round((v1 - 0.5) * 30); // -15 to +15
    const accentH = 243 + hueShift; // base purple is ~243
    const accentS = 72 + Math.round((v2 - 0.5) * 10); // ±5% saturation
    const accentL = 63 + Math.round((v3 - 0.5) * 8); // ±4% lightness

    // Apply to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--gen-accent', `hsl(${accentH}, ${accentS}%, ${accentL}%)`);
    root.style.setProperty('--gen-accent-glow', `hsla(${accentH}, ${accentS}%, ${accentL}%, 0.3)`);
    root.style.setProperty('--gen-hue-shift', `${hueShift}deg`);

    // --- Gradient Orb Position Shift ---
    // Hero background orbs shift position slightly each visit
    const orbX = 45 + Math.round(v4 * 10); // 45-55%
    const orbY = 25 + Math.round(v5 * 15); // 25-40%
    root.style.setProperty('--gen-orb-x', `${orbX}%`);
    root.style.setProperty('--gen-orb-y', `${orbY}%`);

    // --- Animation Timing Variation ---
    // Slight speed variation on marquee and auto-animations
    const speedFactor = 0.9 + v1 * 0.2; // 0.9x to 1.1x
    root.style.setProperty('--gen-speed', speedFactor.toFixed(3));
    root.style.setProperty('--gen-marquee-duration', `${Math.round(40 + v2 * 15)}s`); // 40-55s

    // --- Expose to particle system ---
    window.__flightSeed = {
        seed: seed,
        hueShift: hueShift,
        particleColorBias: Math.floor(v3 * 5), // Which color gets extra weight
        particleDriftBias: 0.8 + v4 * 0.4,     // 0.8x to 1.2x drift multiplier
        vortexDirection: v5 > 0.5 ? 1 : -1,    // Clockwise or counter-clockwise
        orbitalSpeed: 0.8 + v1 * 0.4,           // 0.8x to 1.2x
    };

    console.log(`Generative seed: ${seed} | Hue shift: ${hueShift}° | Vortex: ${window.__flightSeed.vortexDirection > 0 ? 'CW' : 'CCW'}`);
})();
