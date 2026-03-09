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

    // --- Hero entrance animation ---
    const heroTimeline = gsap.timeline({ delay: 0.2 });

    heroTimeline
        .from('.hero-badge', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out'
        })
        .from('.hero-title', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.hero-subtitle', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-cta-group', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.cta-trust', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.2')
        .from('.hero-stats .hero-stat', {
            opacity: 0,
            y: 15,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.2');

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
    const cardGroups = document.querySelectorAll('.channel-cards, .bento-grid, .press-cards, .pain-grid');
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

    // --- Parallax on gradient orbs ---
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, i) => {
        gsap.to(orb, {
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            },
            y: (i + 1) * -150,
            ease: 'none'
        });
    });

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
