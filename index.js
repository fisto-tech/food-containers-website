window.addEventListener('load', () => {
    // Preloader Exit Animation
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        const circles = document.querySelectorAll('.ripple-circle');
        const tl = gsap.timeline();

        // Step 1: Stop the CSS pulse animation and make all circles visible
        tl.set(circles, { animation: 'none', opacity: 1 })

        // Step 2: Each circle expands one after another
        .to('.r-1', {
            scale: 80,
            backgroundColor: '#1a1a2e',
            duration: 0.6,
            ease: 'power2.in'
        })
        .to('.r-2', {
            scale: 50,
            opacity: 1,
            backgroundColor: '#0c3c50',
            duration: 0.5,
            ease: 'power2.in'
        }, '-=0.35')
        .to('.r-3', {
            scale: 40,
            opacity: 1,
            backgroundColor: '#050608',
            duration: 0.5,
            ease: 'power2.in'
        }, '-=0.3')

        // Step 3: Preloader slides up to reveal the website
        .to('.preloader', {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                preloader.style.display = 'none';
            }
        }, '-=0.1');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. LENIS SMOOTH SCROLL INITIALIZATION
    // -----------------------------------------------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // -----------------------------------------------------------------
    // 2. CUSTOM CURSOR & MAGNETIC BUTTONS
    // -----------------------------------------------------------------
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorText = document.querySelector('.cursor-text');

    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3,
            ease: 'power2.out'
        });
        gsap.to(cursorDot, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // Hover interactions for cursor
    const charWrappers = document.querySelectorAll('.char-wrapper');
    charWrappers.forEach(char => {
        const theme = char.closest('.slide-panel').getAttribute('data-theme');
        let accentColor = '#ffffff';
        if (theme === 'tamper-evident') accentColor = 'var(--tamper-accent)';
        if (theme === 'ice-cream') accentColor = 'var(--icecream-accent)';
        if (theme === 'sweet-box') accentColor = 'var(--sweetbox-accent)';
        if (theme === 'oval') accentColor = 'var(--oval-accent)';
        if (theme === 'round-square') accentColor = 'var(--roundsquare-accent)';
        if (theme === 'rectangle') accentColor = 'var(--rectangle-accent)';
        if (theme === 'round') accentColor = 'var(--round-accent)';

        char.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursorText.textContent = "TICKLE";
            gsap.to(cursor, {
                borderColor: accentColor,
                backgroundColor: `${accentColor}10`,
                scale: 1.1
            });
            gsap.to(cursorDot, {
                backgroundColor: accentColor,
                scale: 1.5
            });
        });

        char.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            gsap.to(cursor, {
                borderColor: 'rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.03)',
                scale: 1
            });
            gsap.to(cursorDot, {
                backgroundColor: '#ffffff',
                scale: 1
            });
        });
    });

    // Slider Cursor Trail Effect
    let lastTrailTime = 0;
    const sliderSection = document.querySelector('.slider-section-pinned');

    if (sliderSection) {
        sliderSection.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTrailTime < 150) return; // limit spawn rate (reduced frequency)
            lastTrailTime = now;

            // Only spawn if slider is active/visible
            if (!sliderSection.classList.contains('active') && window.scrollY < window.innerHeight / 2) return;

            const currentTheme = panels[currentIndex] ? panels[currentIndex].getAttribute('data-theme') : 'round';
            let imgSrc = 'strawberry.webp'; // Default round

            if (currentTheme === 'round-square') imgSrc = 'green-chilli.webp';
            else if (currentTheme === 'rectangle') imgSrc = 'leg-piece.webp';
            else if (currentTheme === 'sweet-box') imgSrc = 'laddoo.webp';
            else if (currentTheme === 'oval') imgSrc = 'thean-mittai.webp';
            else if (currentTheme === 'tamper-evident') imgSrc = 'sweet.webp';
            else if (currentTheme === 'ice-cream') imgSrc = 'ice-cream.webp';

            const trail = document.createElement("img");
            trail.classList.add("cursor-trail-item");
            trail.src = `assets/images/ingredients-webp-images/${imgSrc}`;
            trail.style.left = e.clientX + "px";
            trail.style.top = e.clientY + "px";

            document.body.appendChild(trail);

            setTimeout(() => {
                trail.remove();
            }, 1500);
        });
    }

    // -----------------------------------------------------------------
    // 3. GSAP HORIZONTAL SCROLL & HERO PARALLAX
    // -----------------------------------------------------------------
    // Hero elements parallax
    gsap.to('.hero-title', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Horizontal scroll panels
    // Horizontal scroll panels (Auto-playing & Button-controlled)
    const panels = gsap.utils.toArray('.slide-panel');
    const wrapper = document.querySelector('.horizontal-scroll-wrapper');

    // Toggle Fixed Bottom Nav & Side Arrows visibility + Pin the section
    ScrollTrigger.create({
        trigger: '.slider-section-pinned',
        start: 'top top',
        end: '+=100%', // Pin the slider for 1.5x screen height to lock it
        pin: true,
        onEnter: () => {
            document.querySelector('.fixed-bottom-nav').classList.add('active');
            document.getElementById('prev-slide-btn').classList.add('active');
            document.getElementById('next-slide-btn').classList.add('active');
        },
        onLeave: () => {
            document.querySelector('.fixed-bottom-nav').classList.remove('active');
            document.getElementById('prev-slide-btn').classList.remove('active');
            document.getElementById('next-slide-btn').classList.remove('active');
        },
        onEnterBack: () => {
            document.querySelector('.fixed-bottom-nav').classList.add('active');
            document.getElementById('prev-slide-btn').classList.add('active');
            document.getElementById('next-slide-btn').classList.add('active');
        },
        onLeaveBack: () => {
            document.querySelector('.fixed-bottom-nav').classList.remove('active');
            document.getElementById('prev-slide-btn').classList.remove('active');
            document.getElementById('next-slide-btn').classList.remove('active');
        },
    });

    let currentIndex = 0;
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    let autoPlayTimer;

    // Reset initial states for animations
    panels.forEach((panel) => {
        const title = panel.querySelector('.slide-title');
        const img = panel.querySelector('.main-product-img');
        const char = panel.querySelector('.char-wrapper');
        const sweetPink = panel.querySelector('.sweet-pink');

        if (title) gsap.set(title, { x: -80, opacity: 0 });
        if (img) gsap.set(img, { scale: 0.7, opacity: 0, rotation: 15 });
        if (char) gsap.set(char, { scale: 0.7, opacity: 0, rotation: 15 });
        if (sweetPink) gsap.set(sweetPink, { scale: 0, opacity: 0 });
    });

    function animatePanel(index) {
        const panel = panels[index];
        const title = panel.querySelector('.slide-title');
        const img = panel.querySelector('.main-product-img');
        const char = panel.querySelector('.char-wrapper');
        const sweetPink = panel.querySelector('.sweet-pink');

        const tl = gsap.timeline();
        if (title) tl.to(title, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0);
        if (img) tl.to(img, { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'back.out(1.2)' }, 0.2);
        if (char) tl.to(char, { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'back.out(1.2)' }, 0.4);
        if (sweetPink) tl.to(sweetPink, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0.5);
    }

    function updateArrows() {
        // Arrows are always active for infinite looping
        prevBtn.classList.remove('disabled');
        nextBtn.classList.remove('disabled');
    }

    function goToSlide(index, autoPlay = false) {
        // Handle looping boundaries
        if (index < 0) index = panels.length - 1;
        if (index >= panels.length) index = 0;

        // Hide previous panel elements
        const prevPanel = panels[currentIndex];
        const prevTitle = prevPanel.querySelector('.slide-title');
        const prevImg = prevPanel.querySelector('.main-product-img');
        const prevChar = prevPanel.querySelector('.char-wrapper');
        const prevSweetPink = prevPanel.querySelector('.sweet-pink');

        if (prevTitle) gsap.to(prevTitle, { x: -80, opacity: 0, duration: 0.4, ease: 'power2.in' });
        if (prevImg) gsap.to(prevImg, { scale: 0.7, opacity: 0, rotation: 15, duration: 0.4, ease: 'power2.in' });
        if (prevChar) gsap.to(prevChar, { scale: 0.7, opacity: 0, rotation: 15, duration: 0.4, ease: 'power2.in' });
        if (prevSweetPink) gsap.to(prevSweetPink, { scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' });

        currentIndex = index;
        updateArrows();

        const currentPanel = panels[currentIndex];
        const theme = currentPanel.getAttribute('data-theme');
        let newAccent = '#17B8FF';
        if (theme === 'tamper-evident') newAccent = 'var(--tamper-accent)';
        if (theme === 'ice-cream') newAccent = 'var(--icecream-accent)';
        if (theme === 'sweet-box') newAccent = 'var(--sweetbox-accent)';
        if (theme === 'oval') newAccent = 'var(--oval-accent)';
        if (theme === 'round-square') newAccent = 'var(--roundsquare-accent)';
        if (theme === 'rectangle') newAccent = 'var(--rectangle-accent)';
        if (theme === 'round') newAccent = 'var(--round-accent)';

        gsap.to('.icon-accent-stroke', { stroke: newAccent, duration: 0.8, ease: 'power2.inOut' });
        gsap.to('.shop-now-btn', { backgroundColor: newAccent, duration: 0.8, ease: 'power2.inOut' });

        // Slide the wrapper
        gsap.to(wrapper, {
            x: `-${100 * currentIndex}vw`,
            duration: 1,
            ease: 'power3.inOut',
            onComplete: () => {
                animatePanel(currentIndex);
            }
        });

        if (!autoPlay) resetAutoPlay();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1, true);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    // Initialize arrows state and first panel
    updateArrows();
    gsap.set(wrapper, { x: 0 });
    animatePanel(0);
    resetAutoPlay();

    // Click events for navigation arrows
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

    // -----------------------------------------------------------------
    // 4. CHARACTER FACE CREATION & INTERACTIVE ANIMATIONS
    // -----------------------------------------------------------------
    const facesConfig = {
        'sweet': {
            tx: 50, ty: 48, scale: 0.95,
            leftEyeNormal: '<path class="eye-outer" d="M -5 0 Q 0 -4 5 0" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',
            rightEyeNormal: '<circle class="eye-outer" cx="0" cy="0" r="6.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="-1.5" cy="2" r="2.2" fill="white" /><circle class="eye-pupil-sub" cx="-2.5" cy="3" r="0.8" fill="white" />',
            mouthNormal: '<path class="char-mouth" d="M -6 2 Q 0 2 6 2" stroke="#2a2a2a" stroke-width="3.5" fill="none" stroke-linecap="round" /><path class="tongue-path" d="M -3 3 C -3 8, 3 8, 3 3 Z" />',

            leftEyeHover: '<circle class="eye-outer" cx="0" cy="0" r="6.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="2.2" fill="white" />',
            rightEyeHover: '<circle class="eye-outer" cx="0" cy="0" r="6.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="2.2" fill="white" />',
            mouthHover: '<path class="char-mouth" d="M -7 -1 Q 0 8 7 -1" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',

            leftEyeClick: '<path class="eye-outer" d="M -6 0 Q 0 -5 6 0" stroke="#2a2a2a" stroke-width="4.5" fill="none" stroke-linecap="round" />',
            rightEyeClick: '<circle class="eye-outer" cx="0" cy="0" r="8" fill="#2a2a2a" /><circle class="eye-pupil" cx="-2.5" cy="2.5" r="2.8" fill="white" />',
            mouthClick: '<path class="char-mouth" d="M -8 1 Q 0 2 8 1" stroke="#2a2a2a" stroke-width="4" fill="none" stroke-linecap="round" /><path class="tongue-path" d="M -5 2 C -5 14, 5 14, 5 2 Z" />',

            eyeScale: { x: 1, y: 1 },
            eyeScaleHover: { x: 1.1, y: 1.1 },
            eyeScaleClick: { x: 1.2, y: 1.2 }
        },
        'ice-cream': {
            tx: 50, ty: 40, scale: 0.95,
            leftEyeNormal: '<circle class="eye-outer" cx="0" cy="0" r="6.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="-1.5" cy="-2" r="2.2" fill="white" />',
            rightEyeNormal: '<circle class="eye-outer" cx="0" cy="0" r="6.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="-1.5" cy="-2" r="2.2" fill="white" />',
            mouthNormal: '<path class="char-mouth" d="M -6 0 Q 0 5 6 0" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',

            leftEyeHover: '<circle class="eye-outer" cx="0" cy="0" r="7" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="2.5" fill="white" />',
            rightEyeHover: '<circle class="eye-outer" cx="0" cy="0" r="7" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="2.5" fill="white" />',
            mouthHover: '<path class="char-mouth" d="M -7 -2 Q 0 8 7 -2" stroke="#2a2a2a" stroke-width="3.5" fill="none" stroke-linecap="round" />',

            leftEyeClick: '<circle class="eye-outer" cx="0" cy="0" r="8" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="3" fill="white" />',
            rightEyeClick: '<circle class="eye-outer" cx="0" cy="0" r="8" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="3" fill="white" />',
            mouthClick: '<path class="char-mouth" d="M -9 -3 Q 0 15 9 -3 Z" fill="#2a2a2a" />',

            eyeScale: { x: 1, y: 1 },
            eyeScaleHover: { x: 1.1, y: 1.1 },
            eyeScaleClick: { x: 1.3, y: 1.3 }
        },
        'laddoo': {
            tx: 52, ty: 48, scale: 1.1,
            leftEyeNormal: '<circle class="eye-outer" cx="0" cy="0" r="7.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="2.2" fill="white" />',
            rightEyeNormal: '<circle class="eye-outer" cx="0" cy="0" r="7.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="2.2" fill="white" />',
            mouthNormal: '<circle class="char-mouth" cx="0" cy="4" r="4.5" fill="#2a2a2a" />',

            leftEyeHover: '<circle class="eye-outer" cx="0" cy="0" r="8.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="2.5" fill="white" />',
            rightEyeHover: '<circle class="eye-outer" cx="0" cy="0" r="8.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="2.5" fill="white" />',
            mouthHover: '<circle class="char-mouth" cx="0" cy="5" r="6" fill="#2a2a2a" />',

            leftEyeClick: '<circle class="eye-outer" cx="0" cy="0" r="10" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="3.5" fill="white" />',
            rightEyeClick: '<circle class="eye-outer" cx="0" cy="0" r="10" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="0" r="3.5" fill="white" />',
            mouthClick: '<circle class="char-mouth" cx="0" cy="6" r="9" fill="#2a2a2a" />',

            eyeScale: { x: 1, y: 1 },
            eyeScaleHover: { x: 1.2, y: 1.2 },
            eyeScaleClick: { x: 1.4, y: 1.4 }
        },
        'thean-mittai': {
            tx: 50, ty: 48, scale: 0.95,
            leftEyeNormal: '<path class="eye-outer" d="M -5 2 Q 0 -3 5 2" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',
            rightEyeNormal: '<path class="eye-outer" d="M -5 2 Q 0 -3 5 2" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',
            mouthNormal: '<path class="char-mouth" d="M -6 0 Q 0 5 6 0" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',

            leftEyeHover: '<path class="eye-outer" d="M -6 3 Q 0 -4 6 3" stroke="#2a2a2a" stroke-width="4" fill="none" stroke-linecap="round" />',
            rightEyeHover: '<path class="eye-outer" d="M -6 3 Q 0 -4 6 3" stroke="#2a2a2a" stroke-width="4" fill="none" stroke-linecap="round" />',
            mouthHover: '<path class="char-mouth" d="M -7 -1 Q 0 7 7 -1" stroke="#2a2a2a" stroke-width="3.5" fill="none" stroke-linecap="round" />',

            leftEyeClick: '<path class="eye-outer" d="M -8 4 Q 0 -6 8 4" stroke="#2a2a2a" stroke-width="5.5" fill="none" stroke-linecap="round" />',
            rightEyeClick: '<path class="eye-outer" d="M -8 4 Q 0 -6 8 4" stroke="#2a2a2a" stroke-width="5.5" fill="none" stroke-linecap="round" />',
            mouthClick: '<path class="char-mouth" d="M -9 -2 Q 0 14 9 -2 Z" fill="#2a2a2a" />',

            eyeScale: { x: 1, y: 1 },
            eyeScaleHover: { x: 1.1, y: 1.1 },
            eyeScaleClick: { x: 1.3, y: 1.3 }
        },
        'green-chilli': {
            tx: 45, ty: 50, scale: 0.85,
            leftEyeNormal: '<path class="eye-outer" d="M -5 -2 L 5 2 M -5 2 L 5 -2" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',
            rightEyeNormal: '<path class="eye-outer" d="M -5 -2 L 5 2 M -5 2 L 5 -2" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',
            mouthNormal: '<path class="char-mouth" d="M -7 2 Q 0 -3 7 2" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',

            leftEyeHover: '<path class="eye-outer" d="M -6 -3 L 6 3 M -6 3 L 6 -3" stroke="#2a2a2a" stroke-width="3.5" stroke-linecap="round" />',
            rightEyeHover: '<path class="eye-outer" d="M -6 -3 L 6 3 M -6 3 L 6 -3" stroke="#2a2a2a" stroke-width="3.5" stroke-linecap="round" />',
            mouthHover: '<circle class="char-mouth" cx="0" cy="5" r="5" fill="#2a2a2a" />',

            leftEyeClick: '<path class="eye-outer" d="M -7 -4 L 7 4 M -7 4 L 7 -4" stroke="#2a2a2a" stroke-width="4.5" stroke-linecap="round" /><path class="tear-path" d="M -3 0 Q -5 10 -8 15 Q -10 18 -6 18 Q -2 18 -3 10 Z" />',
            rightEyeClick: '<path class="eye-outer" d="M -7 -4 L 7 4 M -7 4 L 7 -4" stroke="#2a2a2a" stroke-width="4.5" stroke-linecap="round" /><path class="tear-path" d="M 3 0 Q 5 10 8 15 Q 10 18 6 18 Q 2 18 3 10 Z" />',
            mouthClick: '<circle class="char-mouth" cx="0" cy="5" r="8" fill="#2a2a2a" /><path class="flame-path" d="M -12 -5 Q -15 -25 0 -35 Q 15 -25 12 -5 Q 5 -12 0 -5 Z" />',

            eyeScale: { x: 1, y: 1 },
            eyeScaleHover: { x: 1.1, y: 1.1 },
            eyeScaleClick: { x: 1.3, y: 1.3 }
        },
        'leg-piece': {
            tx: 40, ty: 70, scale: 0.9,
            leftEyeNormal: '<circle class="eye-outer" cx="0" cy="0" r="6.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="2" cy="-2" r="2.2" fill="white" />',
            rightEyeNormal: '<circle class="eye-outer" cx="0" cy="0" r="6.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="2" cy="-2" r="2.2" fill="white" />',
            mouthNormal: '<path class="char-mouth" d="M -6 0 Q 0 5 6 0" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',

            leftEyeHover: '<circle class="eye-outer" cx="0" cy="0" r="7.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="2.5" cy="-2.5" r="2.5" fill="white" />',
            rightEyeHover: '<circle class="eye-outer" cx="0" cy="0" r="7.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="2.5" cy="-2.5" r="2.5" fill="white" />',
            mouthHover: '<path class="char-mouth" d="M -7 -1 Q 0 8 7 -1" stroke="#2a2a2a" stroke-width="3.5" fill="none" stroke-linecap="round" />',

            leftEyeClick: '<circle class="eye-outer" cx="0" cy="0" r="9" fill="#2a2a2a" /><circle class="eye-pupil" cx="3" cy="-3" r="3.2" fill="white" />',
            rightEyeClick: '<circle class="eye-outer" cx="0" cy="0" r="9" fill="#2a2a2a" /><circle class="eye-pupil" cx="3" cy="-3" r="3.2" fill="white" />',
            mouthClick: '<path class="char-mouth" d="M -9 -2 Q 0 13 9 -2 Z" fill="#2a2a2a" />',

            eyeScale: { x: 1, y: 1 },
            eyeScaleHover: { x: 1.1, y: 1.1 },
            eyeScaleClick: { x: 1.3, y: 1.3 }
        },
        'strawberry': {
            tx: 50, ty: 55, scale: 0.85,
            leftEyeNormal: '<circle class="eye-outer" cx="0" cy="0" r="6.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="-1" cy="-1.5" r="2.2" fill="white" />',
            rightEyeNormal: '<path class="eye-outer" d="M -5 -1 Q 0 -5 5 -1" stroke="#2a2a2a" stroke-width="3.2" fill="none" stroke-linecap="round" />',
            mouthNormal: '<path class="char-mouth" d="M -6 -1 Q 0 4 6 -1" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round" />',

            leftEyeHover: '<circle class="eye-outer" cx="0" cy="0" r="7.5" fill="#2a2a2a" /><circle class="eye-pupil" cx="0" cy="-2" r="2.5" fill="white" />',
            rightEyeHover: '<path class="eye-outer" d="M -6 -1 Q 0 -6 6 -1" stroke="#2a2a2a" stroke-width="4.2" fill="none" stroke-linecap="round" />',
            mouthHover: '<path class="char-mouth" d="M -7 -2 Q 2 6 7 -2" stroke="#2a2a2a" stroke-width="3.5" fill="none" stroke-linecap="round" />',

            leftEyeClick: '<circle class="eye-outer" cx="0" cy="0" r="9" fill="#2a2a2a" /><circle class="eye-pupil" cx="1" cy="-3" r="3" fill="white" />',
            rightEyeClick: '<path class="eye-outer" d="M -8 -1 Q 0 -8 8 -1" stroke="#2a2a2a" stroke-width="5.5" fill="none" stroke-linecap="round" />',
            mouthClick: '<path class="char-mouth" d="M -8 -2 Q 0 11 8 -2" stroke="#2a2a2a" stroke-width="4" fill="none" stroke-linecap="round" />',

            eyeScale: { x: 1, y: 1 },
            eyeScaleHover: { x: 1, y: 0.8 },
            eyeScaleClick: { x: 1.2, y: 0.3 }
        }
    };

    // Helper to dynamically render/transition facial states
    function setFaceState(char, charName, state) {
        const config = facesConfig[charName];
        const leftEyeGroup = char.querySelector('.left-eye-group');
        const rightEyeGroup = char.querySelector('.right-eye-group');
        const mouthGroup = char.querySelector('.mouth-group');
        if (!leftEyeGroup || !rightEyeGroup || !mouthGroup) return;

        if (state === 'normal') {
            leftEyeGroup.innerHTML = config.leftEyeNormal;
            rightEyeGroup.innerHTML = config.rightEyeNormal;
            mouthGroup.innerHTML = config.mouthNormal;
            gsap.to(leftEyeGroup, { scaleX: config.eyeScale.x, scaleY: config.eyeScale.y, duration: 0.2 });
            gsap.to(rightEyeGroup, { scaleX: config.eyeScale.x, scaleY: config.eyeScale.y, duration: 0.2 });
        } else if (state === 'hover') {
            leftEyeGroup.innerHTML = config.leftEyeHover;
            rightEyeGroup.innerHTML = config.rightEyeHover;
            mouthGroup.innerHTML = config.mouthHover;
            gsap.to(leftEyeGroup, { scaleX: config.eyeScaleHover.x, scaleY: config.eyeScaleHover.y, duration: 0.2 });
            gsap.to(rightEyeGroup, { scaleX: config.eyeScaleHover.x, scaleY: config.eyeScaleHover.y, duration: 0.2 });
        } else if (state === 'click') {
            leftEyeGroup.innerHTML = config.leftEyeClick;
            rightEyeGroup.innerHTML = config.rightEyeClick;
            mouthGroup.innerHTML = config.mouthClick;
            gsap.to(leftEyeGroup, { scaleX: config.eyeScaleClick.x, scaleY: config.eyeScaleClick.y, duration: 0.1 });
            gsap.to(rightEyeGroup, { scaleX: config.eyeScaleClick.x, scaleY: config.eyeScaleClick.y, duration: 0.1 });
        }
    }

    // Dynamically inject faces into character SVGs
    Object.keys(facesConfig).forEach(charName => {
        const charWrapper = document.querySelector(`[data-character="${charName}"]`);
        if (!charWrapper) return;

        const svg = charWrapper.querySelector('.char-face-svg');
        const config = facesConfig[charName];

        let extraG = '';
        if (charName === 'thean-mittai') {
            extraG = `
                <g class="extra-lines">
                    <path class="expr-line" d="M -12 -25 Q -8 -30 -4 -26" />
                    <path class="expr-line" d="M -3 -27 Q 0 -33 3 -28" />
                    <path class="expr-line" d="M 4 -26 Q 8 -30 12 -25" />
                </g>
            `;
        }

        svg.innerHTML = `
            <g class="face-group" transform="translate(${config.tx}, ${config.ty}) scale(${config.scale})">
                <!-- Cheeks Blush -->
                <circle class="blush blush-left" cx="-17" cy="4" r="5" fill="#ff4d6d" opacity="0.15" />
                <circle class="blush blush-right" cx="17" cy="4" r="5" fill="#ff4d6d" opacity="0.15" />
                
                <!-- Eyebrows -->
                <g class="eyebrows-group">
                    <path class="eyebrow eyebrow-left" d="M -16 -13 Q -11 -15 -6 -12" stroke="#2a2a2a" stroke-width="1.5" fill="none" stroke-linecap="round" />
                    <path class="eyebrow eyebrow-right" d="M 6 -12 Q 11 -15 16 -13" stroke="#2a2a2a" stroke-width="1.5" fill="none" stroke-linecap="round" />
                </g>

                <!-- Left Eye Group -->
                <g class="eye-group left-eye-group" transform="translate(-11, -5)">
                    ${config.leftEyeNormal}
                </g>
                
                <!-- Right Eye Group -->
                <g class="eye-group right-eye-group" transform="translate(11, -5)">
                    ${config.rightEyeNormal}
                </g>

                <!-- Mouth Group -->
                <g class="mouth-group" transform="translate(0, 4)">
                    ${config.mouthNormal}
                </g>

                <!-- Extra decorations -->
                ${extraG}
            </g>
        `;
    });

    // -----------------------------------------------------------------
    // 5. INTERACTION LOGIC (MOUSE MOVE & HOVER & CLICK)
    // -----------------------------------------------------------------
    let ambientIntervals = {};

    charWrappers.forEach(char => {
        const charName = char.getAttribute('data-character');
        const config = facesConfig[charName];
        const bubble = char.querySelector('.char-bubble');
        const productImg = char.closest('.product-showcase').querySelector('.main-product-img');

        let isClicked = false;

        // Custom Bubble Phrases on click/hover
        const hoverPhrases = {
            'green-chilli': 'Spicy! 🌶️',
            'ice-cream': 'So Cold! ❄️',
            'laddoo': 'Happy! 🍯',
            'leg-piece': 'Juicy! 🍗',
            'strawberry': 'Shy.. 🍓',
            'sweet': 'Sweet! 🍬',
            'thean-mittai': 'Drippy! 🍊'
        };

        const clickPhrases = {
            'green-chilli': ['TOO HOT!! 🔥', 'SPICY RAGE!! 🌋', 'MY EYES!! 🥵'],
            'ice-cream': ['FREEZING!! 🥶', 'ICE AGE!! 🧊', 'BRRRRR!! ❄️'],
            'laddoo': ['BOUNCY HIT!! 🎉', 'SUGAR RUSH!! 🚀', 'OH YEAH!! 🍯'],
            'leg-piece': ['DON\'T EAT ME! 🍗', 'SAVORY FLAVOR! 🤤', 'RUNNING CHICKEN! 🐔'],
            'strawberry': ['KYAAAA!! 🌸', 'CHIBI BLUSH! 💕', 'OH MY! 🍓'],
            'sweet': ['SWEET BLAST!! 🍬', 'ENERGY LEVEL 999! ⚡', 'DELICIOUS! 🎂'],
            'thean-mittai': ['HONEY EXPLOSION! 🍯', 'SWEET JUICE! 💦', 'POP CANDY! 🍬']
        };

        // 1. Mouse Tracking (Pupils follow mouse cursor)
        char.addEventListener('mousemove', (e) => {
            if (isClicked) return;
            const rect = char.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

            const pupils = char.querySelectorAll('.eye-pupil, .eye-pupil-sub');
            gsap.to(pupils, {
                x: x * 2.2,
                y: y * 2.2,
                duration: 0.1,
                overwrite: 'auto'
            });
        });

        // 2. Hover State (Mild Reaction)
        char.addEventListener('mouseenter', () => {
            if (isClicked) return;
            bubble.textContent = hoverPhrases[charName];
            setFaceState(char, charName, 'hover');

            // Small hover scale for container
            gsap.to(productImg, { scale: 0.95, duration: 0.4 });
        });

        char.addEventListener('mouseleave', () => {
            if (isClicked) return;
            setFaceState(char, charName, 'normal');

            // Reset pupils and image scale
            const pupils = char.querySelectorAll('.eye-pupil, .eye-pupil-sub');
            gsap.to(pupils, { x: 0, y: 0, duration: 0.3 });
            gsap.to(productImg, { scale: 0.9, duration: 0.5 });
        });

        // 3. Click State (Extreme Reaction!)
        char.addEventListener('click', () => {
            if (isClicked) return;
            isClicked = true;

            const phrases = clickPhrases[charName];
            bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];

            // Fun 3D Flip & Bounce for the main product image
            gsap.to(productImg, {
                rotationY: "+=360",
                rotationZ: gsap.utils.random(-10, 10),
                scale: 1.15,
                y: -40,
                duration: 0.7,
                ease: 'back.out(1.5)',
                onComplete: () => {
                    gsap.to(productImg, {
                        rotationY: 0, rotationZ: 0, scale: 0.9, y: 0,
                        duration: 0.6, ease: 'bounce.out'
                    });
                }
            });

            // Extreme jump, squash & stretch spin for character
            gsap.timeline()
                .to(char.querySelector('.char-base-img'), {
                    scaleX: 0.8,
                    scaleY: 1.3,
                    duration: 0.1
                })
                .to(char, {
                    y: "-=120",
                    rotation: "+=720",
                    scale: 1.4,
                    duration: 0.6,
                    ease: 'power2.out'
                }, "<")
                .to(char.querySelector('.char-base-img'), {
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                })
                .to(char, {
                    y: "+=120",
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: 'bounce.out',
                    onComplete: () => {
                        isClicked = false;
                        const isHovered = char.parentElement.querySelector(':hover') === char;
                        if (!isHovered) {
                            setFaceState(char, charName, 'normal');
                            bubble.textContent = hoverPhrases[charName];
                        } else {
                            setFaceState(char, charName, 'hover');
                            bubble.textContent = hoverPhrases[charName];
                        }
                    }
                }, "-=0.4");

            // Extreme face expression
            setFaceState(char, charName, 'click');

            // Apply special overlay effect on character image
            let flashClass = '';
            if (charName === 'green-chilli') flashClass = 'spicy-red-glow';
            if (charName === 'ice-cream') flashClass = 'frozen-blue-glow';
            if (charName === 'strawberry') flashClass = 'blush-pink-glow';
            if (charName === 'sweet') flashClass = 'sugar-purple-glow';
            if (charName === 'thean-mittai') flashClass = 'honey-gold-glow';

            if (flashClass) {
                char.classList.add(flashClass);
                setTimeout(() => char.classList.remove(flashClass), 800);
            }

            // Explode a massive batch of particles!
            spawnParticleExplosion(char, charName);
        });

        // 4. Continuous Ambient Floating Animation
        gsap.to(char, {
            y: "-=15",
            rotation: gsap.utils.random(-3, 3),
            duration: gsap.utils.random(1.5, 2.5),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 1)
        });

        // Start constant ambient particles for this character
        startAmbientParticles(char, charName);
    });

    // -----------------------------------------------------------------
    // 6. PARTICLES ENGINE (AMBIENT & BURST)
    // -----------------------------------------------------------------

    function startAmbientParticles(charElement, charName) {
        if (ambientIntervals[charName]) return;

        ambientIntervals[charName] = setInterval(() => {
            createParticle(charElement, charName, false);
        }, 800); // Slowed down from 300 to 800 for continuous ambient
    }

    function stopAmbientParticles(charElement) {
        const charName = charElement.getAttribute('data-character');
        if (ambientIntervals[charName]) {
            clearInterval(ambientIntervals[charName]);
            delete ambientIntervals[charName];
        }
    }

    function spawnParticleExplosion(charElement, charName) {
        for (let i = 0; i < 20; i++) {
            createParticle(charElement, charName, true);
        }
    }

    function createParticle(parent, charName, isExplosion = false) {
        const particle = document.createElement('div');
        particle.className = 'char-particle';

        let content = '';
        let color = '#fff';

        switch (charName) {
            case 'green-chilli':
                content = ['🔥', '🌶️', '💥'][Math.floor(Math.random() * 3)];
                color = '#ff3f3f';
                break;
            case 'ice-cream':
                content = ['❄️', '🥶', '💧', '💎'][Math.floor(Math.random() * 4)];
                color = '#00d2ff';
                break;
            case 'laddoo':
                content = ['✨', '⭐️', '🍯', '☀️'][Math.floor(Math.random() * 4)];
                color = '#ff9f00';
                break;
            case 'leg-piece':
                content = ['🤤', '🍗', '✨', '🍖'][Math.floor(Math.random() * 4)];
                color = '#ff6b35';
                break;
            case 'strawberry':
                content = ['❤️', '💕', '🍓', '🌸'][Math.floor(Math.random() * 4)];
                color = '#ff4081';
                break;
            case 'sweet':
                content = ['🍬', '🍭', '🍥', '✨'][Math.floor(Math.random() * 4)];
                color = '#e040fb';
                break;
            case 'thean-mittai':
                content = ['💦', '💧', '🍊', '🍯'][Math.floor(Math.random() * 4)];
                color = '#ffd54f';
                break;
        }

        particle.textContent = content;
        particle.style.position = 'absolute';
        particle.style.pointerEvents = 'none';
        particle.style.fontSize = isExplosion ? `${gsap.utils.random(1.2, 2.2)}rem` : `${gsap.utils.random(0.8, 1.4)}rem`;
        particle.style.color = color;
        particle.style.zIndex = '5';
        particle.style.textShadow = `0 0 10px ${color}80`;

        parent.appendChild(particle);

        const startX = parent.offsetWidth / 2;
        const startY = parent.offsetHeight / 2;

        if (isExplosion) {
            const angle = gsap.utils.random(0, Math.PI * 2);
            const force = gsap.utils.random(50, 150);
            const targetX = startX + Math.cos(angle) * force;
            const targetY = startY + Math.sin(angle) * force;

            gsap.fromTo(particle,
                { x: startX, y: startY, scale: 0, opacity: 1 },
                {
                    x: targetX,
                    y: targetY - gsap.utils.random(20, 80),
                    scale: gsap.utils.random(0.5, 1.2),
                    opacity: 0,
                    rotation: gsap.utils.random(-180, 180),
                    duration: gsap.utils.random(0.8, 1.5),
                    ease: 'power3.out',
                    onComplete: () => particle.remove()
                }
            );
        } else {
            const driftX = gsap.utils.random(-40, 40);
            const driftY = gsap.utils.random(-80, -150);

            gsap.fromTo(particle,
                { x: startX + gsap.utils.random(-20, 20), y: startY + 10, scale: 0.5, opacity: 0 },
                {
                    x: startX + driftX,
                    y: startY + driftY,
                    scale: gsap.utils.random(1, 1.5),
                    opacity: gsap.utils.random(0.7, 1),
                    rotation: gsap.utils.random(-45, 45),
                    duration: gsap.utils.random(1.5, 2.5),
                    ease: 'sine.out',
                    onComplete: () => {
                        gsap.to(particle, {
                            opacity: 0,
                            scale: 0.2,
                            duration: 0.4,
                            onComplete: () => particle.remove()
                        });
                    }
                }
            );
        }
    }

    // -----------------------------------------------------------------
    // 7. AUTO IDLE REACTIONS & BLINK MECHANISM
    // -----------------------------------------------------------------
    function triggerIdleReactions() {
        const wrappers = Array.from(charWrappers);

        // Auto Blink Loop
        setInterval(() => {
            const randomChar = wrappers[Math.floor(Math.random() * wrappers.length)];
            const leftEyeOuter = randomChar.querySelectorAll('.left-eye-group .eye-outer');
            const rightEyeOuter = randomChar.querySelectorAll('.right-eye-group .eye-outer');
            const leftPupils = randomChar.querySelectorAll('.left-eye-group circle');
            const rightPupils = randomChar.querySelectorAll('.right-eye-group circle');

            if (leftEyeOuter.length === 0 || rightEyeOuter.length === 0) return;

            const isHovered = randomChar.parentElement.querySelector(':hover') === randomChar;
            if (isHovered) return;

            const blinkTl = gsap.timeline();
            blinkTl.to([...leftEyeOuter, ...rightEyeOuter], { scaleY: 0.1, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center center' })
                .to([...leftPupils, ...rightPupils], { scaleY: 0.1, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center center' }, 0);

        }, 3000);

        // Auto Random Emotional Reactions + Particles
        setInterval(() => {
            const randomChar = wrappers[Math.floor(Math.random() * wrappers.length)];
            const charName = randomChar.getAttribute('data-character');

            const isHovered = randomChar.parentElement.querySelector(':hover') === randomChar;
            if (isHovered) return;

            // Pick a random exciting face state
            const states = ['hover', 'click'];
            const randomState = states[Math.floor(Math.random() * states.length)];

            // Pop some cute emojis
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    if (document.contains(randomChar)) createParticle(randomChar, charName, false);
                }, i * 250);
            }

            // Change face state briefly
            setFaceState(randomChar, charName, randomState);

            // Give a cute little hop
            gsap.to(randomChar, {
                y: -15,
                rotation: gsap.utils.random(-8, 8),
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
            });

            // Revert face after a short delay
            setTimeout(() => {
                const stillHovered = randomChar.parentElement.querySelector(':hover') === randomChar;
                if (!stillHovered) {
                    setFaceState(randomChar, charName, 'normal');
                }
            }, 1800);

        }, 4500);
    }
    triggerIdleReactions();

    // -----------------------------------------------------------------
    // 8. FORM & INTERACTIVITY POLISH
    // -----------------------------------------------------------------
    const scrollTriggerBtn = document.querySelector('.scroll-trigger-btn');
    if (scrollTriggerBtn) {
        scrollTriggerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector(scrollTriggerBtn.getAttribute('href'));
            lenis.scrollTo(targetSection);
        });
    }

    // Nav links scrolling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') {
                lenis.scrollTo(0);
            } else {
                const targetSec = document.querySelector(targetId);
                lenis.scrollTo(targetSec);
            }
        });
    });

    // Update active nav link based on scroll section
    ScrollTrigger.create({
        trigger: '#home',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveLink('#home'),
        onEnterBack: () => setActiveLink('#home')
    });

    ScrollTrigger.create({
        trigger: '.slider-section-pinned',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveLink('#explore'),
        onEnterBack: () => setActiveLink('#explore')
    });

    ScrollTrigger.create({
        trigger: '#features',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveLink('#features'),
        onEnterBack: () => setActiveLink('#features')
    });

    function setActiveLink(href) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // -----------------------------------------------------------------
    // 9. INLINE TEXT IMAGE REVEAL ANIMATION (STATEMENT SECTION)
    // -----------------------------------------------------------------
    const statementSection = document.querySelector('.statement-section');
    if (statementSection) {
        const wrappers = statementSection.querySelectorAll('.inline-img-wrapper');

        // Ensure they are closed initially
        gsap.set(wrappers, {
            width: 0,
            margin: '0 0em',
            opacity: 0
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: statementSection,
                start: 'top 75%',
                end: 'bottom 25%',
                toggleActions: 'play reverse play reverse',
            }
        })
            .to(wrappers, {
                width: '2.4em',
                margin: '0 0.35em',
                opacity: 1,
                duration: 2,
                stagger: 0.35,
                ease: 'power3.out'
            });
    }

    // -----------------------------------------------------------------
    // 10. ABOUT US SECTION ANIMATIONS (handled in section 18 below)
    // -----------------------------------------------------------------

    // -----------------------------------------------------------------
    // 11. MANUFACTURING PROCESS SECTION ANIMATIONS
    // -----------------------------------------------------------------
    const processSection = document.querySelector('.process-section');
    if (processSection) {
        const title = processSection.querySelector('.process-main-title');
        const subtitle = processSection.querySelector('.process-subtitle');
        const steps = processSection.querySelectorAll('.process-step');
        const arrows = processSection.querySelectorAll('.process-arrow');

        // Set initial states
        gsap.set([title, subtitle], { opacity: 0, y: 60, scale: 0.95 });
        gsap.set(steps, { opacity: 0, x: -50, scale: 0.8, rotationY: -20 });
        gsap.set(arrows, { opacity: 0, scale: 0, x: -20 });

        const processTl = gsap.timeline({
            scrollTrigger: {
                trigger: processSection,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        processTl.to([title, subtitle], { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: 'expo.out' })
            .to(steps, { opacity: 1, x: 0, scale: 1, rotationY: 0, duration: 1.2, stagger: 0.2, ease: 'back.out(1.5)' }, '-=0.8')
            .to(arrows, { opacity: 0.8, scale: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'elastic.out(1, 0.5)' }, '-=1.2');
    }

    // -----------------------------------------------------------------
    // 12. PRODUCT CATEGORIES SECTION ANIMATIONS
    // -----------------------------------------------------------------
    const categoriesSection = document.querySelector('.categories-section');
    if (categoriesSection) {
        const subtitle = categoriesSection.querySelector('.categories-subtitle');
        const title = categoriesSection.querySelector('.categories-main-title');
        const line = categoriesSection.querySelector('.categories-title-line');
        const cards = categoriesSection.querySelectorAll('.category-card-wrapper');

        // Set initial states
        gsap.set([subtitle, title], { opacity: 0, y: 50, skewY: 2 });
        gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(cards, { opacity: 0, y: 100, rotationX: 15, scale: 0.9 });

        const categoriesTl = gsap.timeline({
            scrollTrigger: {
                trigger: categoriesSection,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        categoriesTl.to([subtitle, title], { opacity: 1, y: 0, skewY: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out' })
            .to(line, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, '-=0.8')
            .to(cards, { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1.4, stagger: 0.15, ease: 'expo.out' }, '-=0.8');
    }

    // -----------------------------------------------------------------
    // 13. BENEFITS SECTION ANIMATIONS
    // -----------------------------------------------------------------
    const benefitsSection = document.querySelector('.benefits-section');
    if (benefitsSection) {
        const subtitle = benefitsSection.querySelector('.benefits-subtitle');
        const title = benefitsSection.querySelector('.benefits-main-title');
        const line = benefitsSection.querySelector('.benefits-title-line');
        const desc = benefitsSection.querySelector('.benefits-subtitle-text');
        const cards = benefitsSection.querySelectorAll('.benefit-card');

        // Set initial states
        gsap.set([subtitle, title, desc], { opacity: 0, y: 50, rotation: 1 });
        gsap.set(line, { scaleX: 0, transformOrigin: 'center' });
        gsap.set(cards, { opacity: 0, scale: 0.7, y: 50, rotationX: -10 });

        const benefitsTl = gsap.timeline({
            scrollTrigger: {
                trigger: benefitsSection,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        benefitsTl.to([subtitle, title, desc], { opacity: 1, y: 0, rotation: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out' })
            .to(line, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, '-=0.8')
            .to(cards, { opacity: 1, scale: 1, y: 0, rotationX: 0, duration: 1.2, stagger: { amount: 0.6, grid: 'auto', from: 'center' }, ease: 'back.out(1.4)' }, '-=0.8');
    }

    // -----------------------------------------------------------------
    // 14. INDUSTRIES SECTION ANIMATIONS
    // -----------------------------------------------------------------
    const industriesSection = document.querySelector('.industries-section');
    if (industriesSection) {
        const title = industriesSection.querySelector('.industries-main-title');
        const cards = industriesSection.querySelectorAll('.industry-card-wrap');

        // Set initial states
        gsap.set(title, { opacity: 0, y: 50, scale: 0.9 });
        gsap.set(cards, { opacity: 0, y: 80, rotateX: 25, z: -50 });

        const industriesTl = gsap.timeline({
            scrollTrigger: {
                trigger: industriesSection,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        industriesTl.to(title, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out' })
            .to(cards, { opacity: 1, y: 0, rotateX: 0, z: 0, duration: 1.4, stagger: 0.15, ease: 'expo.out' }, '-=0.8');
    }

    // -----------------------------------------------------------------
    // 15. TESTIMONIALS SECTION ANIMATIONS & SLIDER
    // -----------------------------------------------------------------
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection) {
        const title = testimonialsSection.querySelector('.testimonials-main-title');
        const line = testimonialsSection.querySelector('.testimonials-title-line');
        const track = testimonialsSection.querySelector('.testimonials-slider-track');
        const prevBtn = document.getElementById('testimonial-prev-btn');
        const nextBtn = document.getElementById('testimonial-next-btn');
        const dotsContainer = testimonialsSection.querySelector('.testimonials-dots');
        const cards = testimonialsSection.querySelectorAll('.testimonial-card-wrap');

        // Set initial states
        gsap.set(title, { opacity: 0, y: 50, skewX: -5 });
        gsap.set(line, { scaleX: 0, transformOrigin: 'center' });
        gsap.set(cards, { opacity: 0, x: 100, rotationY: -15 });

        const testimonialsTl = gsap.timeline({
            scrollTrigger: {
                trigger: testimonialsSection,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        testimonialsTl.to(title, { opacity: 1, y: 0, skewX: 0, duration: 1.2, ease: 'expo.out' })
            .to(line, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, '-=0.8')
            .to(cards, { opacity: 1, x: 0, rotationY: 0, duration: 1.4, stagger: 0.15, ease: 'power4.out' }, '-=0.8');

        // Slider logic
        let currentIndex = 0;

        function getVisibleItems() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function updateSlider() {
            const visibleItems = getVisibleItems();
            const maxIndex = cards.length - visibleItems;

            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            const cardWidth = 100 / cards.length;
            track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;

            // Update disabled states
            if (prevBtn) {
                prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
                prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            }
            if (nextBtn) {
                nextBtn.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
                nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
            }

            // Update active dot
            const dots = dotsContainer.querySelectorAll('.testimonial-dot');
            dots.forEach((dot, idx) => {
                const isActive = idx === Math.floor(currentIndex / visibleItems);
                dot.classList.toggle('active', isActive);
            });
        }

        function setupDots() {
            const visibleItems = getVisibleItems();
            const numDots = Math.ceil(cards.length / visibleItems);

            dotsContainer.innerHTML = '';
            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('testimonial-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i * visibleItems;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }

        setupDots();
        updateSlider();

        window.addEventListener('resize', () => {
            setupDots();
            updateSlider();
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const visibleItems = getVisibleItems();
                currentIndex = Math.max(0, currentIndex - visibleItems);
                updateSlider();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const visibleItems = getVisibleItems();
                const maxIndex = cards.length - visibleItems;
                currentIndex = Math.min(maxIndex, currentIndex + visibleItems);
                updateSlider();
            });
        }
    }

    // -----------------------------------------------------------------
    // 16. CUSTOM PACKAGING CTA SECTION ANIMATIONS
    // -----------------------------------------------------------------
    const customCtaSection = document.getElementById('custom-cta');
    if (customCtaSection) {
        const circles = customCtaSection.querySelectorAll('.graphics-bg-circle');
        const fruitBowl = customCtaSection.querySelector('.fruit-bowl');
        const riceBowl = customCtaSection.querySelector('.rice-bowl');
        const biryaniContainer = customCtaSection.querySelector('.biryani-container');
        const scriptText = customCtaSection.querySelector('.cta-script-text');
        const title = customCtaSection.querySelector('.cta-title');
        const line = customCtaSection.querySelector('.cta-underline');
        const desc = customCtaSection.querySelector('.cta-description');
        const btn = customCtaSection.querySelector('.cta-btn');
        const patterns = customCtaSection.querySelectorAll('.cta-pattern, .cta-decor-icon-wrap');

        // Set initial states
        gsap.set(circles, { scale: 0, opacity: 0, rotation: -90 });
        gsap.set(fruitBowl, { x: -100, y: 60, opacity: 0, rotate: -30, scale: 0.8 });
        gsap.set(riceBowl, { x: 100, y: -80, opacity: 0, rotate: 30, scale: 0.8 });
        gsap.set(biryaniContainer, { y: 100, opacity: 0, scale: 0.6, rotationX: 20 });
        gsap.set([scriptText, title, desc, btn], { opacity: 0, y: 40, filter: 'blur(10px)' });
        gsap.set(line, { scaleX: 0, transformOrigin: 'left' });
        gsap.set(patterns, { opacity: 0, scale: 0, rotation: 45 });

        const ctaTl = gsap.timeline({
            scrollTrigger: {
                trigger: customCtaSection,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        ctaTl.to(circles, { scale: 1, rotation: 0, opacity: (i, el) => el.classList.contains('circle-1') ? 0.85 : 0.6, duration: 1.5, stagger: 0.2, ease: 'expo.out' })
            .to(patterns, { opacity: (i, el) => el.classList.contains('cta-decor-icon-wrap') ? 0.08 : 0.15, scale: 1, rotation: 0, duration: 1.2, stagger: 0.1, ease: 'back.out(1.5)' }, '-=1')
            .to(fruitBowl, { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1, duration: 1.4, ease: 'elastic.out(1, 0.75)' }, '-=1')
            .to(riceBowl, { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1, duration: 1.4, ease: 'elastic.out(1, 0.75)' }, '-=1.2')
            .to(biryaniContainer, { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.5, ease: 'expo.out' }, '-=1.2')
            .to([scriptText, title, desc, btn], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.1, ease: 'expo.out' }, '-=1.2')
            .to(line, { scaleX: 1, duration: 0.8, ease: 'expo.inOut' }, '-=0.8');
    }

    // -----------------------------------------------------------------
    // 17. PREMIUM PRODUCTS ACCORDION AUTO-CYCLE
    // -----------------------------------------------------------------
    const ppPanels = document.querySelectorAll('.pp-panel');
    const ppAccordion = document.querySelector('.pp-accordion');

    if (ppPanels.length > 0 && ppAccordion) {
        let currentPpIndex = 0;
        let ppCycleInterval;

        const startPpCycle = () => {
            // Immediately activate the first one if none is active
            if (!document.querySelector('.pp-panel.active') && !ppAccordion.matches(':hover')) {
                ppPanels[currentPpIndex].classList.add('active');
            }

            ppCycleInterval = setInterval(() => {
                ppPanels.forEach(p => p.classList.remove('active'));
                currentPpIndex = (currentPpIndex + 1) % ppPanels.length;
                ppPanels[currentPpIndex].classList.add('active');
            }, 3000); // 3 seconds per panel
        };

        const stopPpCycle = () => {
            clearInterval(ppCycleInterval);
            ppPanels.forEach(p => p.classList.remove('active'));
        };

        // Start cycle initially
        startPpCycle();

        // Pause cycle when user interacts with the accordion
        ppAccordion.addEventListener('mouseenter', stopPpCycle);
        ppAccordion.addEventListener('mouseleave', () => {
            // Resume from current index
            startPpCycle();
        });

        // Also allow manual clicking to set active (on mobile or desktop)
        ppPanels.forEach((panel, index) => {
            panel.addEventListener('click', () => {
                stopPpCycle();
                ppPanels.forEach(p => p.classList.remove('active'));
                panel.classList.add('active');
                currentPpIndex = index;
            });
        });
    }

    // -----------------------------------------------------------------
    // 18. SCROLL REVEAL ANIMATIONS (ABOUT, INDUSTRIES, PRODUCTS, FOOTER)
    // -----------------------------------------------------------------
    // About Section
    const aboutSectionEl = document.querySelector('.about-section');
    if (aboutSectionEl) {
        const aboutTagline = aboutSectionEl.querySelector('.about-tagline');
        const aboutTitle = aboutSectionEl.querySelector('.about-title');
        const aboutDesc = aboutSectionEl.querySelector('.about-description');
        const aboutFeatures = aboutSectionEl.querySelectorAll('.feature-item');
        const aboutBtn = aboutSectionEl.querySelector('.about-btn');
        const aboutVideo = aboutSectionEl.querySelector('.about-video-wrapper');

        // Set initial hidden states
        gsap.set([aboutTagline, aboutTitle, aboutDesc], { opacity: 0, y: 50 });
        gsap.set(aboutFeatures, { opacity: 0, y: 30, scale: 0.95 });
        gsap.set(aboutBtn, { opacity: 0, y: 30 });
        gsap.set(aboutVideo, { opacity: 0, x: 80, scale: 0.95 });

        // Create scroll-triggered timeline
        const aboutScrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSectionEl,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        aboutScrollTl
            .to(aboutTagline, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .to(aboutTitle, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
            .to(aboutDesc, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
            .to(aboutFeatures, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.4)' }, '-=0.5')
            .to(aboutBtn, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
            .to(aboutVideo, { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'power3.out' }, '-=1.2');
    }

    // Industries Section
    if (document.querySelector('.industries-section')) {
        gsap.from('.industries-header > *', {
            scrollTrigger: { trigger: '.industries-section', start: 'top 80%' },
            y: 40, opacity: 0, duration: 1.5, stagger: 0.25, ease: 'power3.out'
        });
        gsap.from('.industry-block', {
            scrollTrigger: { trigger: '.industries-grid', start: 'top 85%' },
            y: 60, opacity: 0, duration: 1.5, stagger: 0.2, ease: 'power3.out'
        });
    }

    // Premium Products Section
    if (document.querySelector('.premium-products-section')) {
        gsap.from('.premium-products-header > *', {
            scrollTrigger: { trigger: '.premium-products-section', start: 'top 80%' },
            y: 40, opacity: 0, duration: 1.5, stagger: 0.25, ease: 'power3.out'
        });
        gsap.from('.pp-accordion', {
            scrollTrigger: { trigger: '.pp-accordion', start: 'top 85%' },
            y: 60, opacity: 0, duration: 1.8, ease: 'power3.out'
        });
    }

    // Footer Section
    if (document.querySelector('.premium-footer')) {
        gsap.from('.premium-footer .footer-brand > *, .premium-footer .footer-links, .premium-footer .footer-contact, .premium-footer .footer-socials', {
            scrollTrigger: { trigger: '.premium-footer', start: 'top 90%' },
            y: 40, opacity: 0, duration: 1.5, stagger: 0.2, ease: 'power3.out'
        });
        gsap.from('.footer-bottom', {
            scrollTrigger: { trigger: '.premium-footer', start: 'top 90%' },
            opacity: 0, duration: 1.5, delay: 0.8, ease: 'power3.out'
        });
    }

    // -----------------------------------------------------------------
    // 7. HAMBURGER MENU TOGGLE
    // -----------------------------------------------------------------
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navbar = document.querySelector('.navbar');
    const navLinksList = document.querySelectorAll('.nav-links-list a');

    if (hamburgerBtn && navbar) {
        hamburgerBtn.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('menu-open');
            });
        });
    }

});
