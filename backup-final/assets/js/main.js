// Premium Stove Specialist Website - Main JavaScript
// Advanced Interactive Features and Particle System

class PremiumWebsite {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initializeComponents();
    }

    init() {
        // Initialize particle system
        this.particleSystem = new ParticleSystem();
        
        // Initialize loading screen
        this.initLoadingScreen();
        
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize interactive elements
        this.initInteractiveElements();
        
        // Initialize performance optimizations
        this.initPerformanceOptimizations();
    }

    initLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
            }, 1000);
        });
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Back to top button
        this.initBackToTop();

        // Ripple effect for buttons
        this.initRippleEffect();

        // Interactive card mouse tracking
        this.initMouseTracking();

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.particleSystem.handleResize();
        }, 250));

        // Scroll optimization
        this.initScrollOptimization();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Animate counters when they come into view
                    if (entry.target.classList.contains('counter-stat')) {
                        this.animateCounter(entry.target.querySelector('.counter'));
                    }
                    
                    // Animate progress bars
                    if (entry.target.querySelector('.progress-bar')) {
                        this.animateProgressBars(entry.target);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    initInteractiveElements() {
        // Service card interactions
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addGlowEffect(e.target);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.removeGlowEffect(e.target);
            });
        });

        // Trust indicators animation
        document.querySelectorAll('.trust-indicator').forEach((indicator, index) => {
            indicator.style.animationDelay = `${index * 0.2}s`;
            indicator.classList.add('animate-slide-up');
        });
    }

    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });

            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    initRippleEffect() {
        document.querySelectorAll('.ripple-effect').forEach(element => {
            element.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                element.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    initMouseTracking() {
        document.querySelectorAll('.interactive-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--x', x + '%');
                card.style.setProperty('--y', y + '%');
            });
        });
    }

    initScrollOptimization() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        
        // Parallax effect for floating elements
        document.querySelectorAll('.floating-element').forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Navigation background on scroll
        const nav = document.querySelector('nav');
        if (nav) {
            if (scrolled > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    }

    animateCounter(counter) {
        if (!counter || counter.dataset.animated) return;
        
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = Date.now();
        
        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);
            const current = Math.floor(progress * target);
            
            counter.textContent = current + (counter.textContent.includes('%') ? '%' : '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        counter.dataset.animated = 'true';
        animate();
    }

    animateProgressBars(container) {
        container.querySelectorAll('.progress-bar').forEach(bar => {
            const width = bar.dataset.width;
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 300);
        });
    }

    addGlowEffect(element) {
        element.style.boxShadow = `
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 0 50px rgba(59, 130, 246, 0.3)
        `;
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }

    initPerformanceOptimizations() {
        // Preload critical images
        this.preloadImages();
        
        // Optimize animations for mobile
        if (window.innerWidth <= 768) {
            document.documentElement.classList.add('mobile');
        }
        
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }
    }

    preloadImages() {
        const imagesToPreload = [
            // Add image URLs here when images are added
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Particle System Class
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        if (this.canvas && this.ctx) {
            this.init();
        }
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleResize() {
        this.resize();
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                color: `hsl(${220 + Math.random() * 60}, 70%, 70%)`,
                life: Math.random() * 100
            });
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life += 1;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Pulse opacity
            particle.opacity = (Math.sin(particle.life * 0.02) + 1) * 0.15;
        });
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Draw connections
        this.drawConnections();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.1;
                    this.ctx.strokeStyle = '#667eea';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Alpine.js Components
document.addEventListener('alpine:init', () => {
    // Service Cards Component
    Alpine.data('serviceCards', () => ({
        selectedService: null,
        
        selectService(service) {
            this.selectedService = service;
            this.showServiceModal(service);
        },
        
        showServiceModal(service) {
            // Implementation for service modal
            console.log('Selected service:', service);
        }
    }));
    
    // Testimonial Carousel Component
    Alpine.data('testimonialCarousel', () => ({
        activeTestimonial: 0,
        testimonials: [
            {
                name: 'Sarah Mitchell',
                location: 'Bondi Beach',
                rating: 5,
                text: 'Excellent service! Fixed our oven the same day and the technician was very professional.'
            },
            {
                name: 'David Lee',
                location: 'Paddington',
                rating: 5,
                text: 'Fast, reliable service. Our dishwasher is working perfectly now.'
            },
            {
                name: 'Jennifer Kim',
                location: 'Surry Hills',
                rating: 5,
                text: 'Great communication and fair pricing. Will definitely use again.'
            }
        ],
        
        nextTestimonial() {
            this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length;
        },
        
        prevTestimonial() {
            this.activeTestimonial = this.activeTestimonial === 0 ? this.testimonials.length - 1 : this.activeTestimonial - 1;
        }
    }));
    
    // Contact Form Component
    Alpine.data('contactForm', () => ({
        form: {
            name: '',
            phone: '',
            email: '',
            suburb: '',
            appliance: '',
            preferredDate: '',
            description: ''
        },
        isSubmitting: false,
        
        async submitForm() {
            this.isSubmitting = true;
            
            // Validate form
            if (!this.validateForm()) {
                this.isSubmitting = false;
                return;
            }
            
            try {
                // Send email via Resend API
                await this.sendEmailViaResend();
                this.handleSubmissionSuccess();
            } catch (error) {
                console.error('Email sending failed:', error);
                alert('There was an error sending your message. Please call us directly at 02 9365 2508.');
            } finally {
                this.isSubmitting = false;
            }
        },
        
        validateForm() {
            const required = ['name', 'phone', 'suburb', 'appliance', 'description'];
            
            for (let field of required) {
                if (!this.form[field]) {
                    alert(`Please fill in ${field.charAt(0).toUpperCase() + field.slice(1)}`);
                    return false;
                }
            }
            
            return true;
        },
        
        generateEmailTemplate() {
            const date = new Date().toLocaleDateString('en-AU');
            const time = new Date().toLocaleTimeString('en-AU');
            
            return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Georgia, serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #1e3a8a, #1e40af); color: white; padding: 20px; text-align: center; }
        .logo { max-height: 60px; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #1e3a8a; }
        .value { margin-left: 10px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Service Inquiry</h1>
        <p>The Stove Specialist - Appliance Repair Sydney</p>
    </div>
    
    <div class="content">
        <h2>Customer Details</h2>
        
        <div class="field">
            <span class="label">Name:</span>
            <span class="value">${this.form.name}</span>
        </div>
        
        <div class="field">
            <span class="label">Phone:</span>
            <span class="value">${this.form.phone}</span>
        </div>
        
        <div class="field">
            <span class="label">Email:</span>
            <span class="value">${this.form.email || 'Not provided'}</span>
        </div>
        
        <div class="field">
            <span class="label">Suburb:</span>
            <span class="value">${this.form.suburb}</span>
        </div>
        
        <h2>Service Request</h2>
        
        <div class="field">
            <span class="label">Appliance:</span>
            <span class="value">${this.form.appliance}</span>
        </div>
        
        <div class="field">
            <span class="label">Preferred Date:</span>
            <span class="value">${this.form.preferredDate || 'As soon as possible'}</span>
        </div>
        
        <div class="field">
            <span class="label">Issue Description:</span>
            <div class="value" style="margin-top: 10px; padding: 10px; background: #f8fafc; border-left: 4px solid #84cc16;">
                ${this.form.description}
            </div>
        </div>
        
        <div class="field">
            <span class="label">Inquiry Date:</span>
            <span class="value">${date} at ${time}</span>
        </div>
    </div>
    
    <div class="footer">
        <p>This inquiry was submitted through The Stove Specialist website.</p>
        <p>Please respond promptly during business hours: Monday-Friday, 8AM-4PM</p>
    </div>
</body>
</html>
            `;
        },
        
        async sendEmailViaResend() {
            // Send to our simple email API
            const emailData = {
                customer_name: this.form.name,
                customer_phone: this.form.phone,
                customer_email: this.form.email || 'Not provided',
                customer_suburb: this.form.suburb,
                appliance_type: this.form.appliance,
                preferred_date: this.form.preferredDate || 'As soon as possible',
                issue_description: this.form.description
            };

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Email sending failed: ${error}`);
            }

            return response.json();
        },

        // Fallback mailto function
        sendEmail(emailContent) {
            const subject = `New Service Inquiry - ${this.form.appliance} in ${this.form.suburb}`;
            const body = `
New service inquiry from ${this.form.name}

Customer Details:
- Name: ${this.form.name}
- Phone: ${this.form.phone}
- Email: ${this.form.email || 'Not provided'}
- Suburb: ${this.form.suburb}

Service Request:
- Appliance: ${this.form.appliance}
- Preferred Date: ${this.form.preferredDate || 'As soon as possible'}

Issue Description:
${this.form.description}

Please contact the customer as soon as possible.

---
Submitted via The Stove Specialist website
${new Date().toLocaleString('en-AU')}
            `;
            
            const mailtoLink = `mailto:info@thestovespecialist.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
        },
        
        handleSubmissionSuccess() {
            alert('Thank you! Your message has been sent. We\'ll get back to you during business hours.');
            this.resetForm();
        },
        
        resetForm() {
            this.form = {
                name: '',
                phone: '',
                email: '',
                suburb: '',
                appliance: '',
                preferredDate: '',
                description: ''
            };
        }
    }));
});

// Utility Functions
function openBookingModal() {
    document.getElementById('booking').scrollIntoView({
        behavior: 'smooth'
    });
}

function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing-animation');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        typingElement.style.borderRight = '3px solid #f59e0b';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// Quick Quote Calculator
class QuoteCalculator {
    constructor() {
        this.rates = {
            'electric-oven': 150,
            'gas-oven': 180,
            'dishwasher': 120,
            'washing-machine': 140,
            'dryer': 130,
            'rangehood': 100,
            'other': 120
        };
    }
    
    calculateQuote(appliance, urgency = 'standard') {
        let baseRate = this.rates[appliance] || 120;
        
        switch (urgency) {
            case 'priority':
                baseRate *= 1.3;
                break;
            case 'emergency':
                baseRate *= 1.5;
                break;
        }
        
        return {
            serviceFee: 85,
            estimatedRepair: baseRate,
            total: 85 + baseRate
        };
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }
    
    init() {
        // Monitor Core Web Vitals
        this.observeLCP();
        this.observeFID();
        this.observeCLS();
    }
    
    observeLCP() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
    }
    
    observeFID() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
                this.metrics.fid = entry.processingStart - entry.startTime;
            });
        }).observe({ entryTypes: ['first-input'] });
    }
    
    observeCLS() {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            this.metrics.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main website functionality
    new PremiumWebsite();
    
    // Initialize typing animation
    initializeTypingAnimation();
    
    // Initialize performance monitoring
    if ('PerformanceObserver' in window) {
        new PerformanceMonitor();
    }
    
    // Initialize quote calculator
    window.quoteCalculator = new QuoteCalculator();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PremiumWebsite,
        ParticleSystem,
        QuoteCalculator,
        PerformanceMonitor
    };
}