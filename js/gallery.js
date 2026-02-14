/**
 * CICESE - Gallery Lightbox JavaScript
 * Handles image gallery carousel and lightbox functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const imageCounter = document.getElementById('image-counter');
    const desktopCarousel = document.getElementById('desktop-carousel');
    const mobileCarousel = document.getElementById('mobile-carousel');
    
    if (!lightbox) return; // Exit if no gallery on page
    
    // Get all images from gallery
    const galleryItems = document.querySelectorAll('.carousel-item, .mobile-carousel-item');
    const images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            highRes: img.src.replace(/w=\d+/, 'w=1200'), // Try to get higher res
            alt: img.alt
        };
    });
    
    // Remove duplicates
    const uniqueImages = [];
    const seen = new Set();
    images.forEach(img => {
        if (!seen.has(img.src)) {
            seen.add(img.src);
            uniqueImages.push(img);
        }
    });
    
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    
    // Lightbox functionality
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function updateLightbox() {
        if (uniqueImages[currentIndex]) {
            lightboxImg.src = uniqueImages[currentIndex].highRes || uniqueImages[currentIndex].src;
            lightboxImg.alt = uniqueImages[currentIndex].alt;
            imageCounter.textContent = `${currentIndex + 1} / ${uniqueImages.length}`;
        }
    }
    
    function navigate(direction) {
        currentIndex = (currentIndex + direction + uniqueImages.length) % uniqueImages.length;
        updateLightbox();
    }
    
    // Event listeners for carousel items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const dataIndex = parseInt(item.getAttribute('data-index')) || index;
            openLightbox(dataIndex);
        });
    });
    
    // Lightbox navigation
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigate(-1));
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigate(1));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
                break;
            case 'ArrowLeft':
                navigate(-1);
                break;
            case 'ArrowRight':
                navigate(1);
                break;
        }
    });
    
    // Touch gestures for mobile lightbox
    if (lightbox) {
        const lightboxContent = document.getElementById('lightbox-content');
        if (lightboxContent) {
            lightboxContent.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            lightboxContent.addEventListener('touchmove', (e) => {
                currentX = e.touches[0].clientX;
            });
            
            lightboxContent.addEventListener('touchend', () => {
                const diff = startX - currentX;
                const threshold = 50;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        navigate(1); // Swipe left - next
                    } else {
                        navigate(-1); // Swipe right - previous
                    }
                }
            });
        }
    }
    
    // Close lightbox when clicking background
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Pause carousel when hovering over individual items
    if (desktopCarousel) {
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                desktopCarousel.style.animationPlayState = 'paused';
            });
            item.addEventListener('mouseleave', () => {
                desktopCarousel.style.animationPlayState = 'running';
            });
        });
    }
});

