/**
 * Unipivot Redesign - JavaScript Interactions
 * Greenpeace Korea-inspired modern UI
 *
 * Features:
 * 1. Header scroll behavior (transparent → solid)
 * 2. Mobile menu toggle
 * 3. Smooth scroll navigation
 * 4. Scroll animations (intersection observer)
 * 5. Image lazy loading
 * 6. Form handling
 */

(function() {
  'use strict';

  // ==========================================================================
  // DOM Ready Handler
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initLazyLoading();
    initForms();
  });

  // ==========================================================================
  // 1. Header Scroll Behavior
  // ==========================================================================

  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const scrollThreshold = 50;
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial check
    updateHeader();
  }

  // ==========================================================================
  // 2. Mobile Menu Toggle
  // ==========================================================================

  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !mobileMenu) return;

    function openMenu() {
      menuToggle.classList.add('active');
      mobileMenu.classList.add('active');
      if (menuOverlay) menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      if (menuOverlay) menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function() {
      if (mobileMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (menuClose) {
      menuClose.addEventListener('click', closeMenu);
    }

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking nav links
    mobileNavLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close menu on window resize (if going to desktop)
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 1024 && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // ==========================================================================
  // 3. Smooth Scroll Navigation
  // ==========================================================================

  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, href);
      });
    });
  }

  // ==========================================================================
  // 4. Scroll Animations (Intersection Observer)
  // ==========================================================================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show all elements
      animatedElements.forEach(function(el) {
        el.classList.add('visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: stop observing after animation
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // ==========================================================================
  // 5. Image Lazy Loading
  // ==========================================================================

  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (lazyImages.length === 0) return;

    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
      lazyImages.forEach(function(img) {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
      });
      return;
    }

    // Fallback to Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      lazyImages.forEach(function(img) {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ==========================================================================
  // 6. Form Handling
  // ==========================================================================

  function initForms() {
    const forms = document.querySelectorAll('form[data-ajax]');

    forms.forEach(function(form) {
      form.addEventListener('submit', handleFormSubmit);
    });

    // Initialize form validation on blur
    const formInputs = document.querySelectorAll('.form-input[required], .form-textarea[required]');
    formInputs.forEach(function(input) {
      input.addEventListener('blur', function() {
        validateField(this);
      });
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('[type="submit"]');
    const formData = new FormData(form);

    // Validate all fields
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(function(field) {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = '전송 중...';
    }

    // Convert FormData to JSON
    const data = {};
    formData.forEach(function(value, key) {
      data[key] = value;
    });

    // Get form action URL
    const url = form.action || '/api/form';

    // Send AJAX request
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function(result) {
      // Show success message
      showFormMessage(form, 'success', '성공적으로 제출되었습니다. 감사합니다!');
      form.reset();
    })
    .catch(function(error) {
      // Show error message
      showFormMessage(form, 'error', '제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Form submission error:', error);
    })
    .finally(function() {
      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText;
      }
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error state
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }

    // Check required
    if (field.required && !value) {
      isValid = false;
      errorMessage = '이 필드는 필수입니다.';
    }

    // Check email format
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = '올바른 이메일 주소를 입력해주세요.';
      }
    }

    // Check phone format (Korean)
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\-\+\s()]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = '올바른 전화번호를 입력해주세요.';
      }
    }

    // Check min length
    if (field.minLength && value.length < field.minLength) {
      isValid = false;
      errorMessage = `최소 ${field.minLength}자 이상 입력해주세요.`;
    }

    // Show error if invalid
    if (!isValid) {
      field.classList.add('error');
      const errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      errorEl.textContent = errorMessage;
      field.parentNode.appendChild(errorEl);
    }

    return isValid;
  }

  function showFormMessage(form, type, message) {
    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.style.cssText = `
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      ${type === 'success'
        ? 'background-color: rgba(16, 185, 129, 0.1); color: #059669; border: 1px solid #10b981;'
        : 'background-color: rgba(239, 68, 68, 0.1); color: #dc2626; border: 1px solid #ef4444;'}
    `;
    messageEl.textContent = message;

    // Insert after submit button or at end of form
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn && submitBtn.parentNode) {
      submitBtn.parentNode.insertBefore(messageEl, submitBtn.nextSibling);
    } else {
      form.appendChild(messageEl);
    }

    // Auto-remove after 5 seconds
    setTimeout(function() {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 5000);
  }

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  /**
   * Debounce function for performance optimization
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function for performance optimization
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ==========================================================================
  // Export for global access (optional)
  // ==========================================================================

  window.UnipivotRedesign = {
    initHeaderScroll: initHeaderScroll,
    initMobileMenu: initMobileMenu,
    initSmoothScroll: initSmoothScroll,
    initScrollAnimations: initScrollAnimations,
    initLazyLoading: initLazyLoading,
    initForms: initForms
  };

})();
