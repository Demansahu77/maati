// Mouse position tracking for parallax
let lastMouseX = 0;
let lastMouseY = 0;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // Initialize VanillaTilt for 3D Card Effect (Desktop Only)
    if (window.innerWidth > 768) {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 12,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            scale: 1.03
        });
    }
    
    // Preloader — use timeout so it always fires regardless of animationend reliability
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => {
            preloader.remove();
        }, 700);
    }, 1600);
});

// Mobile Navigation Toggle
const navHamburger = document.getElementById('navHamburger');
const navMenu = document.getElementById('navMenu');
const allNavLinks = document.querySelectorAll('.nav-link');

navHamburger.addEventListener('click', () => {
    navHamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        navHamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Parallax Effect on Hero Image - Scroll-based
let ticking = false;
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallaxHero = document.querySelector('.parallax-hero');
            
            // Scroll-based parallax combined with mouse position
            if (parallaxHero && window.innerWidth > 768) {
                const combinedY = scrolled * 0.5 + lastMouseY;
                parallaxHero.style.transform = `translate3d(${lastMouseX}px, ${combinedY}px, 0) scale(1.1)`;
            }
            
            // Scroll progress bar
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrolled / windowHeight) * 100;
            scrollProgress.style.width = scrollPercentage + '%';
            
            ticking = false;
        });
        ticking = true;
    }
});

// Parallax Effect on Hero Image - Mouse-based
const heroImage = document.querySelector('.hero-image');
const parallaxHero = document.querySelector('.parallax-hero');

if (heroImage && parallaxHero && window.innerWidth > 768) {
    let mouseTicking = false;
    
    heroImage.addEventListener('mousemove', (e) => {
        if (!mouseTicking) {
            window.requestAnimationFrame(() => {
                const rect = heroImage.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                lastMouseX = (x - 0.5) * 30;
                lastMouseY = (y - 0.5) * 30;
                
                const scrolled = window.pageYOffset;
                const combinedY = scrolled * 0.5 + lastMouseY;
                parallaxHero.style.transform = `translate3d(${lastMouseX}px, ${combinedY}px, 0) scale(1.1)`;
                mouseTicking = false;
            });
            mouseTicking = true;
        }
    });
    
    heroImage.addEventListener('mouseleave', () => {
        lastMouseX = 0;
        lastMouseY = 0;
        const scrolled = window.pageYOffset;
        parallaxHero.style.transform = `translate3d(0px, ${scrolled * 0.5}px, 0) scale(1.1)`;
    });
}

// IntersectionObserver for Active Nav Highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Count-up Animation for Hero Stats
function animateCount(element, target, suffix, duration) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (suffix === 'K+') {
            displayValue = (displayValue / 1000).toFixed(0) + 'K+';
        } else if (suffix === '+') {
            displayValue = displayValue + '+';
        }
        
        element.textContent = displayValue;
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.hero-stat-number[data-target]');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const suffix = stat.getAttribute('data-suffix') || '';
                animateCount(stat, target, suffix, 2000);
            });
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Testimonials Carousel
let currentTestimonialIndex = 0;
const testimonialsTrack = document.getElementById('testimonialsTrack');

function scrollTestimonials(direction) {
    const cards = document.querySelectorAll('.testimonial-card');
    const maxIndex = cards.length - 1;
    
    currentTestimonialIndex += direction;
    
    // Infinite looping
    if (currentTestimonialIndex < 0) {
        currentTestimonialIndex = maxIndex;
    } else if (currentTestimonialIndex > maxIndex) {
        currentTestimonialIndex = 0;
    }
    
    // Calculate actual step size from DOM
    const stepSize = cards.length > 1 ? 
        cards[1].offsetLeft - cards[0].offsetLeft : 
        cards[0].offsetWidth + 32;
    
    const offset = -(currentTestimonialIndex * stepSize);
    testimonialsTrack.style.transform = `translateX(${offset}px)`;
}

// Before/After Transformation Slider
const transformationSlider = document.getElementById('transformationSlider');
const transformationAfter = document.getElementById('transformationAfter');
const transformationHandle = document.getElementById('transformationHandle');
let isSliding = false;

let pendingClientX = 0;
let rafSliderPending = false;

function updateSlider(percentage) {
    percentage = Math.max(0, Math.min(100, percentage));
    transformationAfter.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    transformationHandle.style.left = percentage + '%';
}

function handleSliderMove(clientX) {
    pendingClientX = clientX;
    if (!rafSliderPending) {
        rafSliderPending = true;
        requestAnimationFrame(() => {
            const rect = transformationSlider.getBoundingClientRect();
            const percentage = ((pendingClientX - rect.left) / rect.width) * 100;
            updateSlider(percentage);
            rafSliderPending = false;
        });
    }
}

if (transformationSlider) {
    transformationSlider.addEventListener('mousedown', (e) => {
        isSliding = true;
        handleSliderMove(e.clientX);
    });
    document.addEventListener('mousemove', (e) => {
        if (isSliding) handleSliderMove(e.clientX);
    });
    document.addEventListener('mouseup', () => { isSliding = false; });

    transformationSlider.addEventListener('touchstart', (e) => {
        isSliding = true;
        handleSliderMove(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
        if (isSliding) handleSliderMove(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', () => { isSliding = false; });
}

// Button Ripple Effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '300px';
        ripple.style.height = '300px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        this.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
});

// Pricing Toggle Monthly vs Annual
const monthlyToggle = document.getElementById('monthlyToggle');
const annualToggle = document.getElementById('annualToggle');
const pricingPrices = document.querySelectorAll('.pricing-price');
const pricingPeriods = document.querySelectorAll('.pricing-period');

let isAnnual = false;

monthlyToggle.addEventListener('click', () => {
    if (isAnnual) {
        monthlyToggle.classList.add('active');
        annualToggle.classList.remove('active');
        isAnnual = false;
        updatePricing();
    }
});

annualToggle.addEventListener('click', () => {
    if (!isAnnual) {
        annualToggle.classList.add('active');
        monthlyToggle.classList.remove('active');
        isAnnual = true;
        updatePricing();
    }
});

function updatePricing() {
    pricingPrices.forEach(priceEl => {
        const monthlyPrice = parseInt(priceEl.getAttribute('data-monthly'));
        
        priceEl.classList.add('updating');
        
        setTimeout(() => {
            if (isAnnual) {
                const annualPrice = Math.round(monthlyPrice * 0.8);
                priceEl.textContent = '$' + annualPrice;
            } else {
                priceEl.textContent = '$' + monthlyPrice;
            }
            priceEl.classList.remove('updating');
        }, 150);
    });
    
    pricingPeriods.forEach(periodEl => {
        periodEl.classList.add('updating');
        setTimeout(() => {
            periodEl.textContent = isAnnual ? 'Per Year' : 'Per Month';
            periodEl.classList.remove('updating');
        }, 150);
    });
}

// Stats Count-up Animation
const statsSection = document.querySelector('.stats-section');
let statsFired = false;

function runStatsAnimation() {
    if (statsFired) return;
    statsFired = true;
    document.querySelectorAll('.stat-big-num[data-count]').forEach((el, i) => {
        const target = parseInt(el.getAttribute('data-count'));
        const display = el.getAttribute('data-display');
        const duration = 1400;
        const start = performance.now();
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(ease * target);
            if (display.includes('K+')) {
                el.textContent = current >= 1000 ? Math.floor(current/1000) + 'K+' : current + '';
            } else if (display.includes('%')) {
                el.textContent = current + '%';
            } else if (display.includes('YRS')) {
                el.textContent = current + (current >= target ? ' YRS' : '');
            } else {
                el.textContent = current + (current >= target ? '+' : '');
            }
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = display;
        }
        setTimeout(() => requestAnimationFrame(update), i * 120);
    });
}

if (statsSection) {
    new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) runStatsAnimation(); });
    }, { threshold: 0.25 }).observe(statsSection);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Duplicate marquee content for seamless loop
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
    const marqueeHTML = marqueeContent.innerHTML;
    marqueeContent.innerHTML = marqueeHTML + marqueeHTML;
}

// Disable VanillaTilt on touch devices
if ('ontouchstart' in window) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        if (card.vanillaTilt) {
            card.vanillaTilt.destroy();
        }
    });
}
