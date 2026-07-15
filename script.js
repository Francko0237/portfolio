const init = () => {
    // ==========================================================================
    // THEME MANAGEMENT (DARK / LIGHT)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Default to dark theme unless user explicitly chose light theme
    const activeTheme = savedTheme || 'dark';
    htmlElement.setAttribute('data-theme', activeTheme);

    // Toggle theme function
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================================================
    // TYPEWRITER GREETING EFFECT
    // ==========================================================================
    const typewriterText = document.getElementById('typewriter-text');
    if (typewriterText) {
        const greetings = [
            "Bonjour, je m'appelle",
            "Welcome, my name is",
            "Ravi de vous voir, je suis",
            "Hello, I am",
            "Bienvenue sur mon espace, je suis",
            "Glad you stopped by, I'm",
            "Salut ! Moi c'est",
            "Hey there! My name is",
            "Enchanté de vous accueillir, je suis",
            "Nice to meet you, I'm",
            "Hello! Ici",
            "Pleasure to have you here, I'm",
            "Je vous souhaite la bienvenue, je suis",
            "Welcome to my portfolio, I'm"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        const type = () => {
            const currentWord = greetings[wordIndex];
            if (isDeleting) {
                typewriterText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40; // speed up deleting
            } else {
                typewriterText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80; // standard typing speed
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at the end of the word
                typeSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                // Move to next word
                wordIndex = (wordIndex + 1) % greetings.length;
                typeSpeed = 400; // pause before typing next word
            }

            setTimeout(type, typeSpeed);
        };

        // Start typing
        type();
    }

    // ==========================================================================
    // NAVBAR SCROLL EFFECT
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // ==========================================================================
    // REVEAL ON SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = [
        document.querySelector('.about'),
        document.querySelector('.skills'),
        document.querySelector('.projects'),
        document.querySelector('.experience'),
        document.querySelector('.contact')
    ];

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Setup reveal classes and observe
    revealElements.forEach(element => {
        if (element) {
            element.classList.add('reveal');
            revealObserver.observe(element);
        }
    });

    // ==========================================================================
    // BACK TO TOP BUTTON
    // ==========================================================================
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================================================
    // LIGHTBOX
    // ==========================================================================
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightbox-img');
    const lightboxDots  = document.getElementById('lightbox-dots');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev  = document.getElementById('lightbox-prev');
    const lightboxNext  = document.getElementById('lightbox-next');

    let lbImages = [];
    let lbIndex  = 0;

    const openLightbox = (images, startIndex = 0) => {
        lbImages = images;
        lbIndex  = startIndex;

        // Dots
        lightboxDots.innerHTML = '';
        if (images.length > 1) {
            images.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'lightbox-dot' + (i === startIndex ? ' active' : '');
                dot.setAttribute('aria-label', `Image ${i + 1}`);
                dot.addEventListener('click', () => showLbImage(i));
                lightboxDots.appendChild(dot);
            });
            lightbox.classList.remove('single-image');
        } else {
            lightbox.classList.add('single-image');
        }

        showLbImage(lbIndex, false);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const showLbImage = (index, animate = true) => {
        lbIndex = (index + lbImages.length) % lbImages.length;

        const update = () => {
            lightboxImg.src = lbImages[lbIndex];
            lightboxImg.classList.remove('fading');
            // Update dots
            document.querySelectorAll('.lightbox-dot').forEach((d, i) => {
                d.classList.toggle('active', i === lbIndex);
            });
        };

        if (animate) {
            lightboxImg.classList.add('fading');
            setTimeout(update, 200);
        } else {
            update();
        }
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    // Ouvrir via bouton zoom
    document.querySelectorAll('.img-zoom-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const placeholder = btn.closest('[data-images]');
            if (!placeholder) return;
            const images = JSON.parse(placeholder.dataset.images);
            openLightbox(images, 0);
        });
    });

    // Ouvrir en cliquant directement sur l'image
    document.querySelectorAll('.project-placeholder[data-images] .proj-img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            const placeholder = img.closest('[data-images]');
            if (!placeholder) return;
            const images = JSON.parse(placeholder.dataset.images);
            openLightbox(images, 0);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showLbImage(lbIndex - 1));
    lightboxNext.addEventListener('click', () => showLbImage(lbIndex + 1));

    // Fermer en cliquant sur le fond
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigation clavier
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   showLbImage(lbIndex - 1);
        if (e.key === 'ArrowRight')  showLbImage(lbIndex + 1);
    });


    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

    const activateNavLink = () => {
        let currentSection = 'hero';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update desktop links
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Update mobile bottom nav items
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateNavLink);
    activateNavLink();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
