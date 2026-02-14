/**
 * SULOC - Main JavaScript File
 * Handles core functionality for the website
 */

// Loading screen - hide immediately when page loads
window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(function () {
            loadingScreen.style.display = 'none';
        }, 300);
    }
});

// Fallback: force hide loading screen after 2 seconds
setTimeout(function () {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}, 2000);

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function () {
    const header = document.getElementById('main-header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('shadow-xl', 'py-2');
        } else {
            header.classList.remove('shadow-xl', 'py-2');
        }
    }
});

const SULOC_WHATSAPP_NUMBER = '+25762400920';

function buildWhatsAppUrl(message) {
    const phone = SULOC_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(message || 'Bonjour SULOC, je souhaite des informations.');
    return `https://wa.me/${phone}?text=${text}`;
}

// Helper function to generate URL slugs
function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

// Service cards click handlers
document.addEventListener('DOMContentLoaded', function () {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }

            const dataUrl = this.getAttribute('data-service-url');
            if (dataUrl) {
                window.location.href = dataUrl;
                return;
            }

            const dataSlug = this.getAttribute('data-service-slug');
            if (dataSlug) {
                window.location.href = `service.php?slug=${dataSlug}`;
                return;
            }

            const serviceTitle = this.querySelector('h3');
            if (serviceTitle) {
                const serviceSlug = generateSlug(serviceTitle.textContent);
                window.location.href = `service-${serviceSlug}.php`;
            }
        });
    });

    // Project cards click handlers
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }

            const dataUrl = this.getAttribute('data-project-url');
            if (dataUrl) {
                window.location.href = dataUrl;
                return;
            }

            const dataSlug = this.getAttribute('data-project-slug');
            if (dataSlug) {
                window.location.href = `project.php?slug=${dataSlug}`;
                return;
            }

            const projectTitle = this.querySelector('h3');
            if (projectTitle) {
                const projectSlug = generateSlug(projectTitle.textContent);
                window.location.href = `project-${projectSlug}.php`;
            }
        });
    });

    // Handle service parameter in contact form
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const serviceTypeSelect = document.getElementById('service_type');
    if (serviceParam && serviceTypeSelect) {
        serviceTypeSelect.value = serviceParam;
    }

    // Floating WhatsApp button
    const floatingWhatsappBtn = document.getElementById('whatsapp-float-btn');
    if (floatingWhatsappBtn) {
        floatingWhatsappBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.open(buildWhatsAppUrl('Bonjour SULOC, je souhaite des informations.'), '_blank');
        });
    }

    // Slideshow WhatsApp buttons
    const slideshowWhatsappButtons = document.querySelectorAll('.btn-whatsapp[data-whatsapp-message]');
    slideshowWhatsappButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const message = button.getAttribute('data-whatsapp-message') || 'Bonjour SULOC, je souhaite des informations.';
            window.open(buildWhatsAppUrl(message), '_blank');
        });
    });

    // Visa search filter
    const visaSearchInput = document.getElementById('visa-search');
    if (visaSearchInput) {
        visaSearchInput.addEventListener('input', (event) => {
            const value = event.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('#visa-grid .service-card-compact');
            cards.forEach((card) => {
                const haystack = card.getAttribute('data-search') || '';
                card.style.display = haystack.includes(value) ? '' : 'none';
            });
        });
    }

    // Services slideshow
    const slideshow = document.getElementById('services-slideshow');
    if (slideshow) {
        const slides = slideshow.querySelectorAll('.slide');
        const dots = slideshow.querySelectorAll('.dot');
        const prevBtn = slideshow.querySelector('.slideshow-arrow.prev');
        const nextBtn = slideshow.querySelector('.slideshow-arrow.next');
        let currentIndex = 0;
        let intervalId = null;
        const autoplayDelay = 5000;

        const goToSlide = (index) => {
            slides[currentIndex].classList.remove('active');
            if (dots[currentIndex]) {
                dots[currentIndex].classList.remove('active');
            }
            currentIndex = index;
            slides[currentIndex].classList.add('active');
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        };

        const nextSlide = () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        };

        const prevSlide = () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        };

        const startAutoplay = () => {
            stopAutoplay();
            intervalId = setInterval(nextSlide, autoplayDelay);
        };

        const stopAutoplay = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoplay();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                startAutoplay();
            });
        });

        slideshow.addEventListener('mouseenter', stopAutoplay);
        slideshow.addEventListener('mouseleave', startAutoplay);

        let touchStartX = 0;
        slideshow.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
        }, { passive: true });

        slideshow.addEventListener('touchend', (event) => {
            const touchEndX = event.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoplay();
            }
        }, { passive: true });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                prevSlide();
                startAutoplay();
            } else if (event.key === 'ArrowRight') {
                nextSlide();
                startAutoplay();
            }
        });

        startAutoplay();
    }
});

// Services slideshow + WhatsApp buttons
document.addEventListener('DOMContentLoaded', function () {
    const slideshow = document.querySelector('.services-slideshow');
    if (!slideshow) {
        return;
    }

    const slides = Array.from(slideshow.querySelectorAll('.slide'));
    const dots = Array.from(slideshow.querySelectorAll('.dot'));
    const prevBtn = slideshow.querySelector('.slideshow-arrow.prev');
    const nextBtn = slideshow.querySelector('.slideshow-arrow.next');
    const whatsappNumber = '+25762400920';
    let currentIndex = 0;
    let intervalId = null;
    const autoPlayDelay = 5000;

    const goToSlide = (index) => {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.remove('active');
        }
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    };

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        intervalId = setInterval(nextSlide, autoPlayDelay);
    };

    const stopAutoPlay = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoPlay();
        });
    });

    slideshow.addEventListener('mouseenter', stopAutoPlay);
    slideshow.addEventListener('mouseleave', startAutoPlay);

    let touchStartX = 0;
    slideshow.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    slideshow.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
            startAutoPlay();
        }
    }, { passive: true });

    const whatsappButtons = slideshow.querySelectorAll('.btn-whatsapp');
    whatsappButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const message = button.dataset.whatsappMessage || 'Bonjour SULOC, je souhaite des informations.';
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    });

    startAutoPlay();
});
