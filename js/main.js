// Main JavaScript for Estudio Espinosa

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavigation = document.getElementById('mobile-navigation');
    const body = document.body;

    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNavigation.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Mobile Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.mobile-navigation .dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('active');
        });
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-navigation a:not(.dropdown-toggle)');
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileNavigation.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Smooth Scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky Header Scroll Effect
    let lastScroll = 0;
    const header = document.getElementById('site-header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/Show header on scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Here you would normally send the data to a server
            // For now, we'll just show an alert
            alert('¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.');
            
            // Reset form
            this.reset();
        });
    }

    // Add loading class to buttons on click
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') return;
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all service items
    const servicioItems = document.querySelectorAll('.servicio-item');
    servicioItems.forEach(item => {
        observer.observe(item);
    });

    // WhatsApp button hover effect
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (whatsappButton) {
        whatsappButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        whatsappButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Prevent body scroll when mobile menu is open
    function toggleBodyScroll() {
        if (mobileNavigation.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }

    // Watch for mobile menu state changes
    const menuObserver = new MutationObserver(toggleBodyScroll);
    menuObserver.observe(mobileNavigation, {
        attributes: true,
        attributeFilter: ['class']
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu on desktop resize
            if (window.innerWidth > 1024) {
                mobileMenuToggle.classList.remove('active');
                mobileNavigation.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }

            // Rebuild clientes slider on resize for perfect looping
            setupClientesSlider(true);
        }, 250);
    });

    // Clientes slider: build a seamless, infinite track without gaps
    function setupClientesSlider(force) {
        const slider = document.querySelector('.clientes-slider');
        if (!slider) return;
        const track = slider.querySelector('.slider-track');
        const wrapper = slider.querySelector('.slider-wrapper');
        if (!track || !wrapper) return;

        // Cache the base HTML once (items without aria-hidden)
        if (!slider.dataset.baseHtml || force) {
            const baseNodes = Array.from(track.children).filter(n => !n.hasAttribute('aria-hidden'));
            if (baseNodes.length === 0) return;
            slider.dataset.baseHtml = baseNodes.map(n => n.outerHTML).join('');
        }

        // Build first half big enough for current viewport
        track.innerHTML = slider.dataset.baseHtml;
        const containerWidth = slider.offsetWidth;
        let halfWidth = track.scrollWidth;

        // Duplicate base items until the first half exceeds viewport width
        // This avoids any blank space on wide screens
        while (halfWidth < containerWidth * 1.2) {
            track.insertAdjacentHTML('beforeend', slider.dataset.baseHtml);
            halfWidth = track.scrollWidth;
        }

        // Snapshot the first half width, then append an identical second half
        const firstHalfHTML = track.innerHTML;
        track.insertAdjacentHTML('beforeend', firstHalfHTML.replaceAll('<div class="slider-item"', '<div class="slider-item" aria-hidden="true"'));

        // Set duration based on pixels-per-second for consistent speed
        const speedPxPerSec = 120; // adjust to taste
        const durationSec = Math.max(10, Math.round(halfWidth / speedPxPerSec));
        wrapper.style.setProperty('--duration', durationSec + 's');
    }

    // Initialize slider after layout is ready
    setupClientesSlider(false);
});

// Add CSS for hidden header
const style = document.createElement('style');
style.textContent = `
    .site-header.hidden {
        transform: translateY(-100%);
    }
    
    .site-header.scrolled {
        box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }
    
    body.menu-open {
        overflow: hidden;
    }
    
    .servicio-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .servicio-item.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .btn.loading {
        position: relative;
        color: transparent;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        border: 2px solid #f3f3f3;
        border-radius: 50%;
        border-top: 2px solid #2c5aa0;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
