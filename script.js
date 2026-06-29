// SAFETECH WORKWEAR - Custom Premium Interactions & Animations

let activeProductCard = null;

document.addEventListener('DOMContentLoaded', () => {
  initImagePerformance();
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
   Fast Image Loading — smooth reveal, lazy bg, preload swatches
   ========================================================================== */
const imageCache = new Map();

function preloadImage(src) {
  if (!src || imageCache.has(src)) {
    return imageCache.get(src) || Promise.resolve();
  }

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

  imageCache.set(src, promise);
  return promise;
}

function markImageLoaded(img) {
  img.classList.add('is-loaded');
  img.classList.remove('is-error');
}

function initImagePerformance() {
  document.querySelectorAll('img.img-smooth').forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      markImageLoaded(img);
    } else {
      img.addEventListener('load', () => markImageLoaded(img), { once: true });
      img.addEventListener('error', () => {
        img.classList.add('is-error', 'is-loaded');
      }, { once: true });
    }
  });

  const hero = document.querySelector('.hero[data-bg]');
  if (hero) {
    const loadHeroBg = () => {
      const bgUrl = hero.getAttribute('data-bg');
      if (!bgUrl) return;
      preloadImage(bgUrl)
        .then(() => {
          hero.style.backgroundImage = `url('${bgUrl}')`;
        })
        .catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadHeroBg, { timeout: 2000 });
    } else {
      setTimeout(loadHeroBg, 300);
    }
  }

  document.querySelectorAll('.color-btn[data-img]').forEach((btn) => {
    const warm = () => preloadImage(btn.getAttribute('data-img'));
    btn.addEventListener('mouseenter', warm, { passive: true });
    btn.addEventListener('focus', warm, { passive: true });
    btn.addEventListener('touchstart', warm, { passive: true });
  });
}

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
    productImg.classList.add('is-swapping');
    productImg.classList.remove('is-loaded');

    preloadImage(targetImgSrc)
      .then(() => {
        productImg.src = targetImgSrc;
        const baseTitle = container.querySelector('[data-base-title]')?.getAttribute('data-base-title')
          || container.querySelector('.product-modal-title')?.getAttribute('data-base-title')
          || '';
        productImg.alt = baseTitle ? `${baseTitle} — ${targetColorText}` : targetColorText;
        markImageLoaded(productImg);
        productImg.classList.remove('is-swapping');
      })
      .catch(() => {
        productImg.src = targetImgSrc;
        productImg.classList.remove('is-swapping');
        productImg.classList.add('is-loaded');
      });
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
    if (img.complete && img.naturalWidth > 0) {
      markImageLoaded(modalImage);
    } else {
      modalImage.classList.remove('is-loaded');
      modalImage.addEventListener('load', () => markImageLoaded(modalImage), { once: true });
    }
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

  let savedScrollY = 0; // Track scroll position to restore after menu close

  // Sticky header on scroll — passive for better mobile perf
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
  }, { passive: true });

  // Lock body scroll when mobile menu opens (prevents scroll jump)
  function lockBodyScroll() {
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  // Unlock body scroll and restore exact position (no jump)
  function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);
  }

  // Mobile menu toggle
  mobileToggle.addEventListener('click', () => {
    const willOpen = !navMenu.classList.contains('active');
    navMenu.classList.toggle('active');

    if (willOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }

    mobileToggle.innerHTML = willOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking links — smooth scroll to section without jump
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const isMenuOpen = navMenu.classList.contains('active');
      if (isMenuOpen) {
        e.preventDefault();
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        unlockBodyScroll();

        // Scroll to the target section after body is unlocked
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            // Small delay to let DOM settle after unlocking body
            requestAnimationFrame(() => {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          }
        }
      }
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

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.img-smooth').forEach(markImageLoaded);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const heroDuration = isMobile ? 0.5 : 0.8;
  const cardDuration = isMobile ? 0.5 : 0.8;
  const cardStagger = isMobile ? 0.08 : 0.15;

  document.querySelectorAll('.why-card, .product-card, .industry-card').forEach((el) => {
    el.classList.add('is-animating');
  });

  const tlHero = gsap.timeline();
  tlHero.from('.hero-badge', {
    y: isMobile ? 20 : 30,
    opacity: 0,
    duration: heroDuration,
    ease: 'power3.out'
  })
  .from('.hero-title', {
    y: isMobile ? 25 : 40,
    opacity: 0,
    duration: heroDuration + 0.2,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero-subtitle', {
    y: isMobile ? 20 : 30,
    opacity: 0,
    duration: heroDuration,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-actions', {
    y: isMobile ? 20 : 30,
    opacity: 0,
    duration: heroDuration,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-graphic-box', {
    scale: isMobile ? 0.95 : 0.9,
    opacity: 0,
    duration: heroDuration + 0.2,
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
    y: isMobile ? 30 : 50,
    opacity: 0,
    duration: cardDuration,
    stagger: cardStagger,
    ease: 'power2.out',
    onComplete: function() {
      gsap.set('.why-card', { clearProps: 'y,opacity' });
      document.querySelectorAll('.why-card').forEach(card => {
        card.classList.add('animated');
        card.classList.remove('is-animating');
      });
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
      y: isMobile ? 35 : 60,
      opacity: 0,
      duration: cardDuration + 0.1,
      stagger: isMobile ? 0.1 : 0.18,
      ease: 'power2.out',
      onComplete: function() {
        gsap.set(grid.querySelectorAll('.product-card'), { clearProps: 'y,opacity' });
        grid.querySelectorAll('.product-card').forEach(card => {
          card.classList.add('animated');
          card.classList.remove('is-animating');
        });
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
    scale: isMobile ? 0.95 : 0.9,
    opacity: 0,
    duration: cardDuration,
    stagger: isMobile ? 0.08 : 0.12,
    ease: 'power2.out',
    onComplete: function() {
      gsap.set('.industry-card', { clearProps: 'scale,opacity' });
      document.querySelectorAll('.industry-card').forEach(card => {
        card.classList.add('animated');
        card.classList.remove('is-animating');
      });
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
