/**
 * SULOC - Lazy Loading Implementation
 * Improves page load performance by deferring image loading
 */

document.addEventListener('DOMContentLoaded', function () {
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Set src from data-src
                img.src = img.dataset.src;

                // Set srcset if available
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }

                // Remove data attributes
                img.removeAttribute('data-src');
                img.removeAttribute('data-srcset');

                // Add loaded class for fade-in effect
                img.classList.add('lazy-loaded');

                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
    });

    // Observe all lazy images
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Lazy loading for background images
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');

    const bgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.backgroundImage = `url(${element.dataset.bg})`;
                element.removeAttribute('data-bg');
                element.classList.add('lazy-loaded');
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    lazyBackgrounds.forEach(bg => {
        bgObserver.observe(bg);
    });

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });

        lazyBackgrounds.forEach(bg => {
            bg.style.backgroundImage = `url(${bg.dataset.bg})`;
        });
    }
});

// Add CSS for lazy loading fade-in effect
const style = document.createElement('style');
style.textContent = `
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease-in;
    }
    
    img.lazy-loaded {
        opacity: 1;
    }
    
    [data-bg] {
        opacity: 0;
        transition: opacity 0.3s ease-in;
    }
    
    [data-bg].lazy-loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);
