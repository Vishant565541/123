// SAFETECH WORKWEAR - Custom Premium Interactions & Animations

let activeProductCard = null;

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTestimonials();
  initContactForm();
  initWhatsAppWidget();
  initScrollTop();
  initGSAPAnimations();
  initColorSwitchers();
  initProductModal();
});

/* ==========================================================================
   Color Swatch Switcher for Products
   ========================================================================== */
function applyProductColor(container, btn) {
  const targetImgSrc = btn.getAttribute('data-img');
  const targetColorText = btn.getAttribute('data-color');
  if (!targetImgSrc || !targetColorText) return;

  const colorBtns = container.querySelectorAll('.color-btn');
  colorBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const productImg = container.querySelector('.product-image, .product-modal-image');
  if (productImg) {
    productImg.style.opacity = '0.5';
    setTimeout(() => {
      productImg.src = targetImgSrc;
      const baseTitle = container.querySelector('[data-base-title]')?.getAttribute('data-base-title')
        || container.querySelector('.product-modal-title')?.getAttribute('data-base-title')
        || '';
      productImg.alt = baseTitle ? `${baseTitle} — ${targetColorText}` : targetColorText;
      productImg.style.opacity = '1';
    }, 150);
  }

  const overlayText = container.querySelector('.product-overlay, .product-modal-overlay');
  if (overlayText) overlayText.textContent = targetColorText;

  const colorNameEl = container.querySelector('.product-color-name');
  if (colorNameEl) colorNameEl.textContent = targetColorText;

  const modalTitle = container.querySelector('.product-modal-title');
  if (modalTitle) {
    const base = modalTitle.getAttribute('data-base-title') || modalTitle.textContent.split(' — ')[0];
    modalTitle.innerHTML = `${base} — <span class="product-color-name">${targetColorText}</span>`;
  }
}

function initColorSwitchers() {
  document.querySelectorAll('.product-card .color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productCard = btn.closest('.product-card');
      if (!productCard) return;
      applyProductColor(productCard, btn);

      const modal = document.getElementById('productModal');
      if (modal?.classList.contains('show') && activeProductCard === productCard) {
        const modalBtn = modal.querySelector(`.color-btn[data-color="${btn.getAttribute('data-color')}"]`);
        if (modalBtn) applyProductColor(modal, modalBtn);
      }
    });
  });
}

/* ==========================================================================
   Product Detail Modal
   ========================================================================== */
function initProductModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('closeProductModal');
  const modalImage = document.getElementById('productModalImage');
  const modalOverlay = document.getElementById('productModalOverlay');
  const modalTitle = document.getElementById('productModalTitle');
  const modalDesc = document.getElementById('productModalDesc');
  const modalSwatches = document.getElementById('productModalSwatches');
  const modalQuote = document.getElementById('productModalQuote');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeProductCard = null;
  }

  function openModal(card) {
    activeProductCard = card;
    const img = card.querySelector('.product-image');
    const overlay = card.querySelector('.product-overlay');
    const title = card.querySelector('.product-title');
    const desc = card.querySelector('.product-desc');
    const swatches = card.querySelector('.color-swatches');

    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalOverlay.textContent = overlay.textContent;

    const baseTitle = title.getAttribute('data-base-title') || title.textContent.split(' — ')[0];
    const colorName = card.querySelector('.product-color-name')?.textContent || overlay.textContent;
    modalTitle.setAttribute('data-base-title', baseTitle);
    modalTitle.innerHTML = `${baseTitle} — <span class="product-color-name">${colorName}</span>`;
    modalDesc.textContent = desc.textContent;

    modalSwatches.innerHTML = swatches.innerHTML;
    modalSwatches.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyProductColor(modal, btn);
        const matchingBtn = activeProductCard.querySelector(`.color-btn[data-color="${btn.getAttribute('data-color')}"]`);
        if (matchingBtn) applyProductColor(activeProductCard, matchingBtn);
      });
    });

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.product-clickable').forEach(box => {
    box.addEventListener('click', () => {
      const card = box.closest('.product-card');
      if (card) openModal(card);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  modalQuote.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
}

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
    const phoneNumber = '918179459896'; // SAFETECH WORKWEAR contact number
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

  // Expertise (Products) Cards (Multiple lists support)
  gsap.utils.toArray('.products-list').forEach((grid) => {
    gsap.from(grid.querySelectorAll('.product-card'), {
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power2.out',
      onComplete: function() {
        gsap.set(grid.querySelectorAll('.product-card'), { clearProps: 'y,opacity' });
        grid.querySelectorAll('.product-card').forEach(card => card.classList.add('animated'));
      }
    });
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
