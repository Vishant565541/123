// SAFETECH WORKWEAR - Custom Premium Interactions & Animations

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTestimonials();
  initContactForm();
  initWhatsAppWidget();
  initScrollTop();
  initGSAPAnimations();
});

/* ==========================================================================
   Navigation (Header scroll effect, mobile menu & active links)
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active navigation item highlighting on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isMenuOpen = navMenu.classList.contains('active');
    mobileToggle.innerHTML = isMenuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

/* ==========================================================================
   Testimonials Carousel
   ========================================================================== */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 5000; // 5 seconds auto-scroll

  // Create dot indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetTimer();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel-dot');

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Event Listeners for buttons
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetTimer();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetTimer();
  });

  // Auto-scroll loop
  function startTimer() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  function resetTimer() {
    clearInterval(slideInterval);
    startTimer();
  }

  // Pause on hover
  const sliderContainer = document.querySelector('.testimonials-carousel-container');
  sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
  sliderContainer.addEventListener('mouseleave', startTimer);

  startTimer();
}


/* ==========================================================================
   Inquiry Form with Mock API Integration & Success Popup
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('quoteForm');
  const successPopup = document.getElementById('successPopup');
  const closePopupBtn = document.getElementById('closePopupBtn');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic Validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const product = document.getElementById('product').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !product) {
      alert('Please fill out all required fields.');
      return;
    }

    // Change button state to loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const origBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Request...';

    // Mock API Submission delay
    setTimeout(() => {
      // Revert button
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnText;

      // Show success popup
      successPopup.classList.add('show');
      
      // Clean form fields
      form.reset();
    }, 1500);
  });

  if (closePopupBtn && successPopup) {
    closePopupBtn.addEventListener('click', () => {
      successPopup.classList.remove('show');
    });
    
    // Close on overlay click
    successPopup.addEventListener('click', (e) => {
      if (e.target === successPopup) {
        successPopup.classList.remove('show');
      }
    });
  }
}

/* ==========================================================================
   Floating WhatsApp Widget
   ========================================================================== */
function initWhatsAppWidget() {
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (!whatsappBtn) return;

  whatsappBtn.addEventListener('click', () => {
    const phoneNumber = '919999999999'; // Standard Indian placeholder number matching +91 format
    const textMessage = encodeURIComponent("Hello SAFETECH WORKWEAR team, I visited your website and would like to inquire about industrial safety garments and workwear solutions.");
    const url = `https://wa.me/${phoneNumber}?text=${textMessage}`;
    window.open(url, '_blank');
  });
}

/* ==========================================================================
   Scroll To Top Widget
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   GSAP & ScrollTrigger Animations
   ========================================================================== */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Hero Section Anim
  const tlHero = gsap.timeline();
  tlHero.from('.hero-badge', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  })
  .from('.hero-title', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-actions', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-graphic-box', {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.4)'
  }, '-=0.8');

  // Staggered reveals for cards
  
  // Why Choose Us Cards
  gsap.from('.why-card', {
    scrollTrigger: {
      trigger: '.why-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    onComplete: function() {
      gsap.set('.why-card', { clearProps: 'y,opacity' });
      document.querySelectorAll('.why-card').forEach(card => card.classList.add('animated'));
    }
  });

  // Expertise (Products) Cards
  gsap.from('.product-card', {
    scrollTrigger: {
      trigger: '.products-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 60,
    opacity: 0,
    duration: 0.9,
    stagger: 0.18,
    ease: 'power2.out',
    onComplete: function() {
      gsap.set('.product-card', { clearProps: 'y,opacity' });
      document.querySelectorAll('.product-card').forEach(card => card.classList.add('animated'));
    }
  });

  // Industries Cards
  gsap.from('.industry-card', {
    scrollTrigger: {
      trigger: '.industries-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
    onComplete: function() {
      gsap.set('.industry-card', { clearProps: 'scale,opacity' });
      document.querySelectorAll('.industry-card').forEach(card => card.classList.add('animated'));
    }
  });

  // Mission & Vision boxes
  gsap.from('.mv-box', {
    scrollTrigger: {
      trigger: '.mv-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    x: (i) => i === 0 ? -50 : 50,
    opacity: 0,
    duration: 0.9,
    stagger: 0.2,
    ease: 'power2.out'
  });

  // Quality Section Left content and Right badge banner
  gsap.from('.quality-content', {
    scrollTrigger: {
      trigger: '.quality-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.from('.quality-badge-banner', {
    scrollTrigger: {
      trigger: '.quality-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    x: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  });
}
