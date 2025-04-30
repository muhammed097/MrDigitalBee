// Add scrolled class to header when scrolling
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    header.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', function () {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the faster
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        
        const updateCount = () => {
            // Calculate the increment based on target value
            // Larger numbers increment faster for a smoother animation
            const increment = target > 100 ? Math.ceil(target / speed) : 1;
            const currentCount = +counter.innerText.replace(/[^0-9.-]+/g, '');
            
            if (currentCount < target) {
                // Don't exceed the target
                const newCount = Math.min(currentCount + increment, target);
                counter.innerText = newCount + suffix;
                
                // If we haven't reached the target yet, continue animating
                if (newCount < target) {
                    setTimeout(updateCount, 30);
                }
            }
        };
        
        updateCount();
    });
}

// Intersection Observer to trigger counter animation when section becomes visible
document.addEventListener('DOMContentLoaded', function() {
    const aboutSection = document.querySelector('.about-section');
    
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% of the section is visible
        
        observer.observe(aboutSection);
    }
});

// Projects Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Projects Slider Functionality
    const projectsSlider = document.querySelector('.projects-slider');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    
    if (projectsSlider && prevArrow && nextArrow) {
        // Calculate the scroll distance based on card width + gap
        const scrollDistance = 380; // Card width (350px) + gap (30px)
        
        // Auto-scroll variables
        let autoScrollInterval;
        const autoScrollDelay = 3000; // Time in milliseconds between auto-scrolls
        
        // Start auto-scrolling
        function startAutoScroll() {
            // Clear any existing interval first to prevent multiple intervals
            stopAutoScroll();
            
            autoScrollInterval = setInterval(function() {
                // Check if we've reached the end, if so, scroll back to start
                if (projectsSlider.scrollLeft >= (projectsSlider.scrollWidth - projectsSlider.clientWidth - 10)) {
                    projectsSlider.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Otherwise, continue scrolling right
                    projectsSlider.scrollBy({
                        left: scrollDistance,
                        behavior: 'smooth'
                    });
                }
            }, autoScrollDelay);
        }
        
        // Stop auto-scrolling
        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
            }
        }
        
        // Previous arrow click handler
        prevArrow.addEventListener('click', function() {
            // Stop auto-scroll when user manually navigates
            stopAutoScroll();
            
            projectsSlider.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
            
            // Restart auto-scroll after user interaction
            setTimeout(startAutoScroll, 5000);
        });
        
        // Next arrow click handler
        nextArrow.addEventListener('click', function() {
            // Stop auto-scroll when user manually navigates
            stopAutoScroll();
            
            projectsSlider.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
            
            // Restart auto-scroll after user interaction
            setTimeout(startAutoScroll, 5000);
        });
        
        // Pause auto-scroll when hovering over the slider
        projectsSlider.addEventListener('mouseenter', stopAutoScroll);
        
        // Resume auto-scroll when mouse leaves the slider
        projectsSlider.addEventListener('mouseleave', startAutoScroll);
        
        // Start auto-scrolling when page loads
        startAutoScroll();
    }
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter the project cards
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === cardCategory) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Logo Modal Popup Functionality
    const modal = document.getElementById('logoModal');
    const modalImage = modal ? modal.querySelector('.modal-image') : null;
    const modalTitle = modal ? modal.querySelector('.modal-title') : null;
    const closeModal = modal ? modal.querySelector('.close-modal') : null;
    const logoButtons = document.querySelectorAll('.view-logo-btn');
    
    if (modal && modalImage && modalTitle && closeModal && logoButtons.length) {
        // Open modal when a logo button is clicked
        logoButtons.forEach(button => {
            button.addEventListener('click', function() {
                const logoSrc = this.getAttribute('data-logo');
                const logoTitle = this.getAttribute('data-title');
                
                // Set modal content
                modalImage.src = logoSrc;
                modalImage.alt = logoTitle;
                modalTitle.textContent = logoTitle;
                
                // Display the modal
                modal.style.display = 'flex';
                
                // Prevent scrolling on the background
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal when the close button is clicked
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            
            // Re-enable scrolling
            document.body.style.overflow = 'auto';
        });
        
        // Close modal when clicking outside the modal content
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                
                // Re-enable scrolling
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                
                // Re-enable scrolling
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Testimonials Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevArrow = document.querySelector('.prev-testimonial');
    const nextArrow = document.querySelector('.next-testimonial');
    
    if (testimonialCards.length && dots.length && prevArrow && nextArrow) {
        let currentIndex = 0;
        let autoSlideInterval;
        const autoSlideDelay = 5000; // 5 seconds between auto slides
        
        // Function to show a specific testimonial
        function showTestimonial(index) {
            // Remove active class from all testimonials and dots
            testimonialCards.forEach(card => card.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current testimonial and dot
            testimonialCards[index].classList.add('active');
            dots[index].classList.add('active');
            
            // Update current index
            currentIndex = index;
        }
        
        // Function to show next testimonial
        function showNextTestimonial() {
            let nextIndex = currentIndex + 1;
            
            // Loop back to first testimonial if at the end
            if (nextIndex >= testimonialCards.length) {
                nextIndex = 0;
            }
            
            showTestimonial(nextIndex);
        }
        
        // Function to show previous testimonial
        function showPrevTestimonial() {
            let prevIndex = currentIndex - 1;
            
            // Loop to last testimonial if at the beginning
            if (prevIndex < 0) {
                prevIndex = testimonialCards.length - 1;
            }
            
            showTestimonial(prevIndex);
        }
        
        // Set up auto-sliding
        function startAutoSlide() {
            // Clear any existing interval first
            stopAutoSlide();
            
            // Set new interval
            autoSlideInterval = setInterval(showNextTestimonial, autoSlideDelay);
        }
        
        // Stop auto-sliding
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        }
        
        // Event listener for next arrow
        nextArrow.addEventListener('click', function() {
            showNextTestimonial();
            
            // Reset auto-slide timer
            stopAutoSlide();
            setTimeout(startAutoSlide, autoSlideDelay);
        });
        
        // Event listener for previous arrow
        prevArrow.addEventListener('click', function() {
            showPrevTestimonial();
            
            // Reset auto-slide timer
            stopAutoSlide();
            setTimeout(startAutoSlide, autoSlideDelay);
        });
        
        // Event listeners for dots
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                showTestimonial(index);
                
                // Reset auto-slide timer
                stopAutoSlide();
                setTimeout(startAutoSlide, autoSlideDelay);
            });
        });
        
        // Pause auto-sliding when hovering over testimonials
        const testimonialsContainer = document.querySelector('.testimonials-carousel-container');
        testimonialsContainer.addEventListener('mouseenter', stopAutoSlide);
        testimonialsContainer.addEventListener('mouseleave', startAutoSlide);
        
        // Keyboard navigation (accessibility feature)
        document.addEventListener('keydown', function(event) {
            // Only respond to arrow keys if testimonials section is in viewport
            const testimonialsSection = document.querySelector('.testimonials-section');
            const rect = testimonialsSection.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (isVisible) {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    showNextTestimonial();
                    stopAutoSlide();
                    setTimeout(startAutoSlide, autoSlideDelay);
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    showPrevTestimonial();
                    stopAutoSlide();
                    setTimeout(startAutoSlide, autoSlideDelay);
                }
            }
        });
        
        // Start the auto-slide on page load
        startAutoSlide();
    }
});

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', function() {
                    // Toggle active class on the clicked item
                    item.classList.toggle('active');
                    
                    // Close other items if you want only one open at a time
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                });
            }
        });
        
        // Optional: Open the first FAQ item by default
        // if (faqItems[0]) {
        //     faqItems[0].classList.add('active');
        // }
    }
});

// Contact Form Validation and Submission with SheetDB Integration
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullName').value.trim();
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            const email = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            
            // Basic validation
            if (!fullName || !phoneNumber || !email || !service) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Phone number validation (basic)
            const phonePattern = /^\d{10,15}$/;
            if (!phonePattern.test(phoneNumber.replace(/\D/g, ''))) {
                alert('Please enter a valid phone number (10-15 digits).');
                return;
            }
            
            // Display loading state
            const submitButton = contactForm.querySelector('.submit-btn');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Prepare data for SheetDB
            // Note: SheetDB expects data in this specific format with the "data" wrapper
            const formData = {
                data: {
                    timestamp: new Date().toISOString(),
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    email: email,
                    service: service
                }
            };
            
            // Send data to SheetDB API
            // Replace YOUR_SHEETDB_URL with your actual SheetDB API endpoint
            const sheetDBURL = 'https://sheetdb.io/api/v1/a0xg5tfidmn85';
            
            fetch(sheetDBURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Display success message
                contactForm.innerHTML = `
                    <div class="form-success">
                        <div class="success-icon">✓</div>
                        <h3>Thank You!</h3>
                        <p>Your message has been sent successfully.</p>
                        <p>We'll get back to you within 24 hours.</p>
                    </div>
                `;
                
                // Log that data was submitted
                console.log('Form submitted successfully', data);
            })
            .catch(error => {
                // Error handling
                console.error('Error submitting form: ', error);
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                alert('There was an error sending your message. Please try again.');
            });
        });
    }
});


// Smooth scrolling functionality for all internal links
document.addEventListener('DOMContentLoaded', function() {
    // Select all internal links (links that begin with # but not external links with http)
    const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevent default anchor click behavior
            event.preventDefault();
            
            // Get the target element from the href attribute
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // If the target element exists, scroll to it
            if (targetElement) {
                // Get the header height to account for fixed header
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Get the target element's position
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                // Scroll to target element - header height (for fixed header)
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
                
                // Update URL without refreshing the page (optional)
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Handle smooth scrolling from navigation links in mobile menu
    const mobileNavLinks = document.querySelectorAll('.nav-links a[href^="#"]:not([href="#"])');
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // If mobile menu is open, close it after clicking a link
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            
            if (navLinks && hamburger && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Handle hash links when page loads (for direct access to sections)
    window.addEventListener('load', function() {
        if (window.location.hash) {
            // Wait a moment for page to fully load
            setTimeout(function() {
                const targetElement = document.querySelector(window.location.hash);
                
                if (targetElement) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: targetPosition - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    });
});