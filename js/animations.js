/* ================================================================
   FlightSuite — GSAP Scroll Animations
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for GSAP to load
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded, skipping animations');
        // Show all elements without animation
        document.querySelectorAll('.reveal').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.querySelectorAll('.reveal').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    // --- Character-split hero title animation ---
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        const words = text.split(' ');
        heroTitle.innerHTML = '';
        heroTitle.style.opacity = '1';

        words.forEach((word, wi) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';

            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.className = 'hero-char';
                charSpan.style.display = 'inline-block';
                charSpan.style.opacity = '0';
                charSpan.style.transform = 'translateY(60px) rotateX(-40deg)';
                wordSpan.appendChild(charSpan);
            });

            heroTitle.appendChild(wordSpan);
            if (wi < words.length - 1) {
                const space = document.createTextNode(' ');
                heroTitle.appendChild(space);
            }
        });
    }

    // --- Hero entrance animation ---
    const heroTimeline = gsap.timeline({ delay: 0.3 });

    heroTimeline
        .from('.hero-badge', {
            opacity: 0,
            y: 20,
            scale: 0.9,
            duration: 0.6,
            ease: 'power3.out'
        })
        .to('.hero-char', {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.03,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.2')
        .from('.hero-subtitle', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.hero-cta-group', {
            opacity: 0,
            y: 25,
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-trust-row', {
            opacity: 0,
            y: 15,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.3');

    // After hero animation, add shimmer sweep
    heroTimeline.call(() => {
        if (heroTitle) heroTitle.classList.add('shimmer-active');
    });

    // --- Scroll reveal for sections ---
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        });
    });

    // --- Section titles slide up ---
    const sectionTitles = document.querySelectorAll('.section-title, .demo-title, .social-proof-title, .faq-title, .press-title, .value-props-title, .roadmap-title, .final-cta-title');
    sectionTitles.forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true
            },
            opacity: 0,
            y: 40,
            duration: 0.7,
            ease: 'power3.out'
        });
    });

    // --- Stagger cards ---
    const cardGroups = document.querySelectorAll('.channel-cards, .bento-grid, .press-cards, .press-grid, .pain-grid');
    cardGroups.forEach(group => {
        const cards = group.children;
        gsap.from(cards, {
            scrollTrigger: {
                trigger: group,
                start: 'top 80%',
                toggleActions: 'play none none none',
                once: true
            },
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out'
        });
    });

    // --- Counter animation for stats ---
    const statNumbers = document.querySelectorAll('.stat-number[data-count], .pain-stat-number[data-count], .hero-stat-number[data-count]');
    statNumbers.forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(el, {
                    duration: 1.2,
                    ease: 'power2.out',
                    onUpdate: function() {
                        const progress = this.progress();
                        el.textContent = prefix + Math.round(progress * target) + suffix;
                    }
                });
            }
        });
    });

    // --- Depth-parallax on background layers ---
    // Each orb moves at a different speed for layered depth
    const orbs = document.querySelectorAll('.gradient-orb');
    const orbSpeeds = [-200, -350, -120]; // different depths
    const orbScales = [1.15, 0.9, 1.05];
    orbs.forEach((orb, i) => {
        gsap.to(orb, {
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5
            },
            y: orbSpeeds[i] || (i + 1) * -150,
            scale: orbScales[i] || 1,
            ease: 'none'
        });
    });

    // Grid pattern parallax — moves slower than content for depth
    const animBg = document.querySelector('.animated-bg');
    if (animBg) {
        gsap.to(animBg, {
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: '30% top',
                scrub: 1
            },
            '--grid-y': '80px',
            ease: 'none'
        });
    }

    // Hero content parallax — text lifts away as user scrolls down
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        gsap.to(heroContent, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8
            },
            y: -80,
            opacity: 0.3,
            ease: 'none'
        });
    }

    // --- Scroll-driven color temperature shifts ---
    // Creates ambient color changes as user scrolls through narrative sections
    const animatedBg = document.querySelector('.animated-bg');
    if (animatedBg) {
        const tempSections = [
            { selector: '.pain-section',        color: 'rgba(255, 80, 50, 0.06)',   opacity: 0.8  },
            { selector: '#demo',                color: 'rgba(94, 92, 230, 0.04)',    opacity: 0.3  },
            { selector: '.value-props-section',  color: 'rgba(0, 180, 255, 0.06)',   opacity: 0.7  },
            { selector: '.capabilities-preview', color: 'rgba(34, 211, 238, 0.06)',  opacity: 0.8  },
            { selector: '.roadmap-section',      color: 'rgba(94, 92, 230, 0.05)',   opacity: 0.6  },
            { selector: '.final-cta',            color: 'rgba(160, 60, 255, 0.08)',  opacity: 1.0  },
        ];

        tempSections.forEach(({ selector, color, opacity }) => {
            const el = document.querySelector(selector);
            if (!el) return;

            ScrollTrigger.create({
                trigger: el,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => {
                    animatedBg.style.setProperty('--temp-color', color);
                    animatedBg.style.setProperty('--temp-opacity', opacity);
                },
                onEnterBack: () => {
                    animatedBg.style.setProperty('--temp-color', color);
                    animatedBg.style.setProperty('--temp-opacity', opacity);
                },
            });
        });

        // Reset to neutral when back at hero
        ScrollTrigger.create({
            trigger: '#hero',
            start: 'top 20%',
            onEnterBack: () => {
                animatedBg.style.setProperty('--temp-opacity', '0');
            },
        });
    }

    // --- Cursor glow on hero ---
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            hero.style.setProperty('--cursor-x', x + 'px');
            hero.style.setProperty('--cursor-y', y + 'px');

            // Move the ::after glow (via CSS custom properties)
            const afterEl = hero;
            afterEl.style.setProperty('--glow-left', x + 'px');
            afterEl.style.setProperty('--glow-top', y + 'px');
        });
    }

    // --- FAQ accordion with GSAP ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(other => {
                    if (other !== item && other.classList.contains('active')) {
                        other.classList.remove('active');
                        gsap.to(other.querySelector('.faq-answer'), {
                            maxHeight: 0,
                            duration: 0.3,
                            ease: 'power2.inOut'
                        });
                    }
                });

                // Toggle current
                if (isActive) {
                    item.classList.remove('active');
                    gsap.to(answer, { maxHeight: 0, duration: 0.3, ease: 'power2.inOut' });
                } else {
                    item.classList.add('active');
                    gsap.to(answer, {
                        maxHeight: answer.scrollHeight + 20,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }
            });
        }
    });

    console.log('GSAP animations initialized');
});
