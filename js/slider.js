document.addEventListener('DOMContentLoaded', function() {
    // Background image paths
    const backgroundImages = [
        'image/slider/slider-1.jpg',
        'image/slider/slider-2.jpg',
        'image/slider/slider-3.jpg'
    ];
    
    // Hero section and controls
    const heroSection = document.getElementById('hero-section');
    const prevButton = document.getElementById('heroPrev');
    const nextButton = document.getElementById('heroNext');
    const indicators = document.querySelectorAll('.hero-indicator');
    
    // Current slide index
    let currentSlide = 0;
    let slideInterval;
    
    // Function to change slide
    function changeSlide(index) {
        // Validate index
        if (index < 0) index = backgroundImages.length - 1;
        if (index >= backgroundImages.length) index = 0;
        
        // Update current slide index
        currentSlide = index;
        
        // Change background image with fade effect
        if (heroSection) {
            heroSection.style.backgroundImage = `url('${backgroundImages[currentSlide]}')`;
        }
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            if (i === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Function to go to next slide
    function nextSlide() {
        changeSlide(currentSlide + 1);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        changeSlide(currentSlide - 1);
    }
    
    // Set up event listeners
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevSlide();
            resetInterval();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextSlide();
            resetInterval();
        });
    }
    
    // Set up indicator event listeners
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            changeSlide(index);
            resetInterval();
        });
    });
    
    // Auto-advance slides
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    // Reset interval when manually changing slides
    function resetInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    // Initialize slider
    changeSlide(0);
    startSlideInterval();
    
    // Pause slider on hover
    if (heroSection) {
        heroSection.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        heroSection.addEventListener('mouseleave', function() {
            startSlideInterval();
        });
    }
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        }
    });
}); 