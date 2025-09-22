// Premium Stove Specialist Website - Advanced Animations
// Sophisticated animation controllers and effects

class AdvancedAnimations {
    constructor() {
        this.initMorphingShapes();
        this.initTextAnimations();
        this.initServiceCardAnimations();
        this.initGSAPAnimations();
        this.initLottieAnimations();
    }

    initMorphingShapes() {
        // Create morphing background shapes
        const shapes = document.querySelectorAll('.floating-element');
        
        shapes.forEach((shape, index) => {
            this.createMorphingEffect(shape, index);
        });
    }

    createMorphingEffect(element, index) {
        const animations = [
            () => this.morphToCircle(element),
            () => this.morphToSquare(element),
            () => this.morphToTriangle(element),
            () => this.morphToHexagon(element)
        ];

        let currentAnimation = 0;
        
        const animate = () => {
            animations[currentAnimation]();
            currentAnimation = (currentAnimation + 1) % animations.length;
            
            setTimeout(animate, 4000 + (index * 1000));
        };

        setTimeout(animate, index * 2000);
    }

    morphToCircle(element) {
        element.style.transition = 'all 2s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.borderRadius = '50%';
        element.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(0deg)`;
    }

    morphToSquare(element) {
        element.style.transition = 'all 2s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.borderRadius = '10%';
        element.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(45deg)`;
    }

    morphToTriangle(element) {
        element.style.transition = 'all 2s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%';
        element.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(90deg)`;
    }

    morphToHexagon(element) {
        element.style.transition = 'all 2s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.borderRadius = '50% 20% 50% 20%';
        element.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(180deg)`;
    }

    initTextAnimations() {
        // Staggered text reveal animations
        this.createStaggeredTextAnimation('.hero h1', 100);
        this.createTypewriterEffect('.typing-animation');
        this.createGlitchEffect('.text-gradient');
    }

    createStaggeredTextAnimation(selector, delay) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            [...text].forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.opacity = '0';
                span.style.transform = 'translateY(50px)';
                span.style.display = 'inline-block';
                span.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 50}ms`;
                element.appendChild(span);
                
                setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, delay + (index * 50));
            });
        });
    }

    createTypewriterEffect(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            let index = 0;
            
            const cursor = document.createElement('span');
            cursor.textContent = '|';
            cursor.className = 'typing-cursor';
            cursor.style.animation = 'blink 1s infinite';
            element.appendChild(cursor);
            
            const typeWriter = () => {
                if (index < text.length) {
                    element.textContent = text.slice(0, index + 1);
                    element.appendChild(cursor);
                    index++;
                    setTimeout(typeWriter, 100 + Math.random() * 50);
                } else {
                    setTimeout(() => cursor.remove(), 2000);
                }
            };
            
            setTimeout(typeWriter, 1000);
        });
    }

    createGlitchEffect(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.triggerGlitch(element);
            });
        });
    }

    triggerGlitch(element) {
        const originalText = element.textContent;
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        let iteration = 0;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            
            if (iteration >= originalText.length) {
                clearInterval(interval);
                element.textContent = originalText;
            }
            
            iteration += 1 / 3;
        }, 30);
    }

    initServiceCardAnimations() {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach((card, index) => {
            // Staggered entrance animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(100px) rotateX(45deg)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) rotateX(0)';
            }, 200 * index);
            
            // Advanced hover effects
            this.addAdvancedHoverEffects(card);
        });
    }

    addAdvancedHoverEffects(card) {
        let hoverTimeout;
        
        card.addEventListener('mouseenter', (e) => {
            this.createParticleTrail(e.target, e.clientX, e.clientY);
            this.addHoverGlow(e.target);
            
            // Delayed tilt effect
            hoverTimeout = setTimeout(() => {
                this.addTiltEffect(e.target, e);
            }, 100);
        });
        
        card.addEventListener('mouseleave', (e) => {
            clearTimeout(hoverTimeout);
            this.removeHoverGlow(e.target);
            this.removeTiltEffect(e.target);
        });
        
        card.addEventListener('mousemove', (e) => {
            this.updateTiltEffect(e.target, e);
        });
    }

    createParticleTrail(element, x, y) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            particle.style.position = 'fixed';
            particle.style.left = x + (Math.random() - 0.5) * 20 + 'px';
            particle.style.top = y + (Math.random() - 0.5) * 20 + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = '#3b82f6';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.transition = 'all 0.6s ease-out';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${Math.random() * 100 + 50}px)`;
                particle.style.opacity = '0';
                particle.style.transform += ' scale(0)';
            }, 10);
            
            setTimeout(() => particle.remove(), 600);
        }
    }

    addHoverGlow(element) {
        element.style.boxShadow = `
            0 20px 40px rgba(59, 130, 246, 0.2),
            0 0 60px rgba(59, 130, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `;
    }

    removeHoverGlow(element) {
        element.style.boxShadow = '';
    }

    addTiltEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (event.clientX - centerX) / (rect.width / 2);
        const deltaY = (event.clientY - centerY) / (rect.height / 2);
        
        element.style.transform = `
            perspective(1000px)
            rotateX(${deltaY * -10}deg)
            rotateY(${deltaX * 10}deg)
            translateZ(20px)
            scale3d(1.02, 1.02, 1.02)
        `;
    }

    updateTiltEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (event.clientX - centerX) / (rect.width / 2);
        const deltaY = (event.clientY - centerY) / (rect.height / 2);
        
        element.style.transform = `
            perspective(1000px)
            rotateX(${deltaY * -10}deg)
            rotateY(${deltaX * 10}deg)
            translateZ(20px)
            scale3d(1.02, 1.02, 1.02)
        `;
    }

    removeTiltEffect(element) {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale3d(1, 1, 1)';
    }

    initGSAPAnimations() {
        // Advanced scroll-triggered animations using intersection observer
        this.createScrollAnimations();
        this.createParallaxEffects();
        this.createMagneticButtons();
    }

    createScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        
        switch (animationType) {
            case 'fadeInUp':
                this.fadeInUp(element);
                break;
            case 'slideInLeft':
                this.slideInLeft(element);
                break;
            case 'slideInRight':
                this.slideInRight(element);
                break;
            case 'scaleIn':
                this.scaleIn(element);
                break;
            case 'rotateIn':
                this.rotateIn(element);
                break;
            default:
                this.fadeInUp(element);
        }
    }

    fadeInUp(element) {
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    slideInLeft(element) {
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
    }

    slideInRight(element) {
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
    }

    scaleIn(element) {
        element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    }

    rotateIn(element) {
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.opacity = '1';
        element.style.transform = 'rotateY(0deg)';
    }

    createParallaxEffects() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    createMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn-primary, .ripple-effect');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                this.magneticEffect(button, e);
            });
            
            button.addEventListener('mouseleave', () => {
                this.resetMagneticEffect(button);
            });
        });
    }

    magneticEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (event.clientX - centerX) * 0.1;
        const deltaY = (event.clientY - centerY) * 0.1;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    resetMagneticEffect(element) {
        element.style.transform = 'translate(0, 0)';
    }

    initLottieAnimations() {
        // Initialize Lottie animations for service icons
        this.createSVGAnimations();
        this.createLoadingAnimations();
    }

    createSVGAnimations() {
        const svgIcons = document.querySelectorAll('.service-card svg');
        
        svgIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                this.animateSVG(icon);
            });
        });
    }

    animateSVG(svg) {
        // Add SVG path animation
        const paths = svg.querySelectorAll('path');
        
        paths.forEach((path, index) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.animation = `drawPath 0.6s ease-in-out ${index * 0.1}s forwards`;
        });
    }

    createLoadingAnimations() {
        // Create sophisticated loading animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes drawPath {
                to {
                    stroke-dashoffset: 0;
                }
            }
            
            @keyframes morphIcon {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.1) rotate(5deg); }
                50% { transform: scale(0.95) rotate(-3deg); }
                75% { transform: scale(1.05) rotate(2deg); }
            }
            
            .hover-particle {
                animation: particleFloat 0.6s ease-out forwards;
            }
            
            @keyframes particleFloat {
                0% {
                    opacity: 0.8;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) translateY(-50px);
                }
            }
            
            .typing-cursor {
                animation: blink 1s infinite;
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Advanced Page Transitions
class PageTransitions {
    constructor() {
        this.initPageTransitions();
    }

    initPageTransitions() {
        // Add smooth page transitions
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                this.smoothScrollTo(link.getAttribute('href'));
            }
        });
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed header
            
            this.animatedScrollTo(offsetTop, 800);
        }
    }

    animatedScrollTo(to, duration) {
        const start = window.pageYOffset;
        const change = to - start;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-in-out-cubic)
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, start + change * easeInOutCubic);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }
}

// Intersection Observer Animations
class IntersectionAnimations {
    constructor() {
        this.setupObserver();
    }

    setupObserver() {
        const observerOptions = {
            threshold: [0.1, 0.3, 0.7],
            rootMargin: '-50px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0.1) {
                    this.triggerAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.observer.observe(el);
        });
    }

    triggerAnimation(element, ratio) {
        const animationType = element.dataset.animate;
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            switch (animationType) {
                case 'counter':
                    this.animateCounter(element);
                    break;
                case 'progressbar':
                    this.animateProgressBar(element);
                    break;
                case 'typist':
                    this.animateTypist(element);
                    break;
                default:
                    element.classList.add('animate-in');
            }
        }, delay);
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = Date.now();
        const startValue = parseInt(element.textContent) || 0;

        const updateCounter = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (target - startValue) * this.easeOutQuart(progress));
            
            element.textContent = currentValue + (element.dataset.suffix || '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    animateProgressBar(element) {
        const target = element.dataset.target;
        const duration = 1500;
        
        element.style.transition = `width ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        element.style.width = target + '%';
    }

    animateTypist(element) {
        const text = element.dataset.text || element.textContent;
        const speed = parseInt(element.dataset.speed) || 50;
        
        element.textContent = '';
        let i = 0;
        
        const typeText = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeText, speed + Math.random() * 30);
            }
        };
        
        typeText();
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAnimations();
    new PageTransitions();
    new IntersectionAnimations();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AdvancedAnimations,
        PageTransitions,
        IntersectionAnimations
    };
}