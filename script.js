/**
 * Motion Dojo — Interactive JavaScript
 * Implements sticky header scroll, mobile drawer, phase outline toggles,
 * stacked 3D project carousel, FAQ accordion, modals, and team 3D flip cards.
 */

// ============================================================================
// MOTION DOJO — TESTIMONIALS DATA CONFIGURATION
// Centralised array supporting student testimonial videos and posters.
// Update videos, posters, quotes, or student bios easily in one place.
// ============================================================================
const testimonials = [
  {
    id: 't-mary',
    type: 'video',
    studentName: 'Mary',
    orientation: 'landscape',
    poster: 'images/testimonial-mary.webp',
    vimeoId: '1238665663',
    vimeoHash: 'df4d75a3d5',
    videoTitle: 'Mary testimonial',
    embedUrl: 'https://player.vimeo.com/video/1238665663?h=df4d75a3d5&autoplay=1&dnt=1'
  },
  {
    id: 't-roseline',
    type: 'video',
    studentName: 'Roseline',
    orientation: 'portrait',
    poster: 'images/testimonial-roseline.webp',
    vimeoId: '1238666245',
    vimeoHash: '5ac2fba1a7',
    videoTitle: 'Roseline testimonial',
    embedUrl: 'https://player.vimeo.com/video/1238666245?h=5ac2fba1a7&autoplay=1&dnt=1'
  },
  {
    id: 't-fatihi',
    type: 'video',
    studentName: 'Fatihi',
    orientation: 'landscape',
    poster: 'images/testimonial-fatihi.webp',
    vimeoId: '1238668293',
    vimeoHash: 'f2b3558f85',
    videoTitle: 'Fatihi testimonial',
    embedUrl: 'https://player.vimeo.com/video/1238668293?h=f2b3558f85&autoplay=1&dnt=1'
  }
];

// ============================================================================
// MOTION DOJO — TEAM MEMBERS DATA CONFIGURATION
// Store each team member's name, role, photo, WhatsApp number, pre-filled message,
// and bio in one centralized place. Update numbers, messages or links easily here.
// ============================================================================
const teamMembers = [
  {
    id: 'muhammad',
    name: 'Muhammad Fatihi Abdullahi',
    firstName: 'Muhammad',
    connectName: 'Fatihi',
    role: 'Community manager',
    photo: 'assets/Muhammad Fatihi Abdullahi.jpg',
    canFlip: true,
    bio: 'I create engaging video ads for businesses and brands using AI video, professional editing, and motion design.',
    whatsappNumber: '+2348000000001', // Placeholder
    prefilledMessage: 'Hi Fatihi, I found your profile on Motion Dojo and would like to connect!',
    waLink: 'https://wa.link/be49ci'
  },
  {
    id: 'osho',
    name: 'Osho Elizabeth Oluwatobiloba',
    firstName: 'Elizabeth',
    connectName: 'Elizabeth',
    role: 'Moderator',
    photo: 'assets/Osho Elizabeth Oluwatobiloba.jpg',
    canFlip: true,
    bio: 'Founder of Growth Code Builders | I help young people build digital skills, grow with purpose, and turn their potential into impact.',
    whatsappNumber: '+2348000000002', // Placeholder
    prefilledMessage: 'Hi Elizabeth, I found your profile on Motion Dojo and would like to connect!',
    waLink: 'https://wa.link/9z7uus'
  },
  {
    id: 'george',
    name: 'George Junior',
    firstName: 'George',
    connectName: 'Junior',
    role: 'Social media manager',
    photo: 'assets/George Junior.jpg',
    canFlip: true,
    bio: '2D Animator & Storyteller\nTurning imagination into animation',
    whatsappNumber: '+2348000000003', // Placeholder
    prefilledMessage: 'Hi Junior, I found your profile on Motion Dojo and would like to connect!',
    waLink: 'https://wa.link/fw3u5j'
  }
];

/**
 * Returns the target WhatsApp URL for a given member.
 * Prefers waLink if specified, otherwise builds an official wa.me direct link.
 */
function getMemberWhatsAppUrl(member) {
  if (member.waLink) return member.waLink;
  const cleanNumber = (member.whatsappNumber || '').replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(member.prefilledMessage || 'Hello, I would like to connect!');
  return cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodedMsg}` : '#';
}

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Sticky Nav Scroll State
  // ------------------------------------------------------------------------
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ------------------------------------------------------------------------
  // 2. Mobile Menu Drawer
  // ------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta a');

  const toggleMobileMenu = (forceState) => {
    const isOpen = typeof forceState === 'boolean' ? forceState : !mobileDrawer.classList.contains('is-open');
    mobileDrawer.classList.toggle('is-open', isOpen);
    mobileMenuBtn.classList.toggle('is-active', isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    mobileDrawer.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // ------------------------------------------------------------------------
  // 3. Phase Cards Outline Accordion (Hide / Show Outline)
  // ------------------------------------------------------------------------
  const phaseCards = document.querySelectorAll('.phase-card');

  phaseCards.forEach(card => {
    const toggleBtn = card.querySelector('.phase-toggle-btn');
    const outlineWrapper = card.querySelector('.phase-outline-wrapper');
    const toggleText = card.querySelector('.toggle-text');

    if (toggleBtn && outlineWrapper) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = outlineWrapper.classList.contains('expanded');
        if (isExpanded) {
          outlineWrapper.classList.remove('expanded');
          toggleBtn.setAttribute('aria-expanded', 'false');
          if (toggleText) toggleText.textContent = 'Show outline';
        } else {
          outlineWrapper.classList.add('expanded');
          toggleBtn.setAttribute('aria-expanded', 'true');
          if (toggleText) toggleText.textContent = 'Hide outline';
        }
      });
    }
  });

  // ------------------------------------------------------------------------
  // 4. Stacked-Card Project Carousel
  // ------------------------------------------------------------------------
  const cardStack = document.getElementById('cardStack');
  const stackCards = Array.from(document.querySelectorAll('.stack-card'));
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');

  let currentProjectIndex = 0;
  const totalProjects = stackCards.length;

  const updateCarouselStack = () => {
    stackCards.forEach((card, index) => {
      card.classList.remove('card-active', 'card-next', 'card-back');
      card.removeAttribute('aria-current');

      const relativePosition = (index - currentProjectIndex + totalProjects) % totalProjects;

      if (relativePosition === 0) {
        card.classList.add('card-active');
        card.setAttribute('aria-current', 'true');
      } else if (relativePosition === 1) {
        card.classList.add('card-next');
      } else {
        card.classList.add('card-back');
      }
    });
  };

  const nextProject = () => {
    currentProjectIndex = (currentProjectIndex + 1) % totalProjects;
    updateCarouselStack();
  };

  const prevProject = () => {
    currentProjectIndex = (currentProjectIndex - 1 + totalProjects) % totalProjects;
    updateCarouselStack();
  };

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', nextProject);
    prevBtn.addEventListener('click', prevProject);
  }

  // Keyboard Navigation for Carousel
  if (cardStack) {
    cardStack.setAttribute('tabindex', '0');
    cardStack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextProject();
      } else if (e.key === 'ArrowLeft') {
        prevProject();
      }
    });

    // Touch Swipe Navigation
    let touchStartX = 0;
    let touchEndX = 0;

    cardStack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    cardStack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextProject();
      } else if (touchEndX - touchStartX > 50) {
        prevProject();
      }
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 4B. Three-Up Coverflow Testimonials Carousel
  // ------------------------------------------------------------------------
  const initTestimonialsCoverflow = () => {
    const coverflow = document.getElementById('testimonialsCoverflow');
    const prevBtn = document.getElementById('testimonialPrevBtn');
    const nextBtn = document.getElementById('testimonialNextBtn');
    const modal = document.getElementById('testimonialVideoModal');
    const closeBtn = document.getElementById('closeTestimonialModal');
    const playerWrapper = document.getElementById('testimonialPlayerWrapper') || document.querySelector('.testimonial-modal-player-wrapper');
    const modalBox = modal ? modal.querySelector('.testimonial-modal-box') : null;
    const modalTitle = document.getElementById('testimonialModalTitle');
    const modalSub = document.getElementById('testimonialModalSub');
    const modalQuoteWrap = document.getElementById('testimonialModalQuoteWrap');
    const modalQuote = document.getElementById('testimonialModalQuote');

    if (!coverflow) return;

    let currentIndex = 0;
    const totalCards = testimonials.length;
    let lastActiveTrigger = null;

    // Render video cards dynamically (ONE single card: landscape 16:9 media on top, attached white panel below)
    coverflow.innerHTML = testimonials.map((item, index) => {
      const isPortrait = item.orientation === 'portrait';
      const posterHtml = isPortrait
        ? `
            <img src="${item.poster}" alt="" class="testimonial-poster-bg-blur" aria-hidden="true" />
            <img src="${item.poster}" alt="${item.studentName} motion design testimonial thumbnail" class="testimonial-poster-img is-portrait" loading="lazy" />
          `
        : `
            <img src="${item.poster}" alt="${item.studentName} motion design testimonial thumbnail" class="testimonial-poster-img" loading="lazy" />
          `;

      return `
        <div class="testimonial-card-item" data-index="${index}" id="testimonial-card-${index}" role="group" aria-roledescription="slide" aria-label="Testimonial ${index + 1} of ${totalCards}: ${item.studentName}">
          <div class="testimonial-card-inner is-video-card">
            <div class="testimonial-media-box">
              ${posterHtml}
              <button type="button" class="testimonial-play-btn" aria-label="Play video testimonial from ${item.studentName}" data-index="${index}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
            <div class="testimonial-attached-panel">
              <h3 class="testimonial-student-name">${item.studentName}</h3>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const cardElements = coverflow.querySelectorAll('.testimonial-card-item');

    // Dynamic height synchronisation to ensure zero dead space on mobile and desktop
    const syncCoverflowHeight = () => {
      const activeCard = coverflow.querySelector('.testimonial-card-item.is-center .testimonial-card-inner')
        || coverflow.querySelector('.testimonial-card-item.is-center');
      if (activeCard && activeCard.offsetHeight > 0) {
        coverflow.style.minHeight = `${activeCard.offsetHeight}px`;
        coverflow.style.height = `${activeCard.offsetHeight}px`;
      }
    };

    const updateCoverflow = () => {
      cardElements.forEach((card, index) => {
        card.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden');
        card.removeAttribute('aria-current');

        const relative = (index - currentIndex + totalCards) % totalCards;

        if (relative === 0) {
          card.classList.add('is-center');
          card.setAttribute('aria-current', 'true');
          card.setAttribute('aria-hidden', 'false');
        } else if (relative === totalCards - 1 || (totalCards === 2 && relative === 1)) {
          card.classList.add('is-left');
          card.setAttribute('aria-hidden', 'true');
        } else if (relative === 1) {
          card.classList.add('is-right');
          card.setAttribute('aria-hidden', 'true');
        } else {
          card.classList.add('is-hidden');
          card.setAttribute('aria-hidden', 'true');
        }
      });
      syncCoverflowHeight();
    };

    // Keep height in sync with image loads and viewport resizing
    coverflow.querySelectorAll('img').forEach((img) => {
      if (img.complete) {
        syncCoverflowHeight();
      } else {
        img.addEventListener('load', syncCoverflowHeight, { once: true });
      }
    });
    window.addEventListener('resize', syncCoverflowHeight, { passive: true });

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCoverflow();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCoverflow();
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Lightbox open / close
    const openVideoModal = (index, triggerEl) => {
      const item = testimonials[index];
      if (!item || item.type !== 'video') return;

      lastActiveTrigger = triggerEl || document.querySelector(`#testimonial-card-${index} .testimonial-play-btn`);

      if (modalTitle) modalTitle.textContent = item.studentName;
      if (modalSub) {
        modalSub.textContent = '';
        modalSub.style.display = 'none';
      }
      if (modalQuote && modalQuoteWrap) {
        if (item.caption) {
          modalQuote.textContent = item.caption;
          modalQuoteWrap.style.display = 'block';
        } else {
          modalQuoteWrap.style.display = 'none';
        }
      }

      if (modalBox) {
        modalBox.classList.remove('is-portrait', 'is-landscape');
        modalBox.classList.add(item.orientation === 'portrait' ? 'is-portrait' : 'is-landscape');
      }

      if (playerWrapper) {
        playerWrapper.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${item.vimeoId}?h=${item.vimeoHash}&autoplay=1&dnt=1`;
        iframe.title = `${item.studentName} testimonial`;
        iframe.className = 'testimonial-vimeo-iframe';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.setAttribute('allowfullscreen', 'true');
        playerWrapper.appendChild(iframe);
      }

      if (modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (closeBtn) setTimeout(() => closeBtn.focus(), 150);
      }
    };

    window.closeTestimonialVideoModal = () => {
      if (!modal || !modal.classList.contains('is-open')) return;

      if (playerWrapper) {
        playerWrapper.innerHTML = '';
      }

      if (modalBox) {
        modalBox.classList.remove('is-portrait', 'is-landscape');
      }

      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', window.closeTestimonialVideoModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeTestimonialVideoModal();
      });
    }

    // Tapping side card moves it to center; tapping center card play button opens lightbox
    coverflow.addEventListener('click', (e) => {
      const playBtn = e.target.closest('.testimonial-play-btn');
      if (playBtn) {
        e.stopPropagation();
        const card = playBtn.closest('.testimonial-card-item');
        const idx = parseInt(card.getAttribute('data-index'), 10);
        if (idx !== currentIndex) {
          currentIndex = idx;
          updateCoverflow();
        } else {
          openVideoModal(idx, playBtn);
        }
        return;
      }

      const card = e.target.closest('.testimonial-card-item');
      if (!card) return;
      const idx = parseInt(card.getAttribute('data-index'), 10);
      if (idx !== currentIndex) {
        currentIndex = idx;
        updateCoverflow();
      } else {
        const mediaBox = e.target.closest('.testimonial-media-box');
        if (mediaBox) {
          openVideoModal(idx, card.querySelector('.testimonial-play-btn'));
        }
      }
    });

    // Keyboard navigation (ArrowLeft / ArrowRight)
    coverflow.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    });

    // Touch swipe navigation
    let touchStartX = 0;
    coverflow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    coverflow.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (diff < -40) {
        nextSlide();
      } else if (diff > 40) {
        prevSlide();
      }
    }, { passive: true });

    // Initial positioning & height synchronisation
    updateCoverflow();
    syncCoverflowHeight();
    requestAnimationFrame(syncCoverflowHeight);
  };

  initTestimonialsCoverflow();

  // ------------------------------------------------------------------------
  // 5. FAQ Accordion
  // ------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerWrap = item.querySelector('.faq-answer-wrap');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for a clean accordion effect
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherAns = otherItem.querySelector('.faq-answer-wrap');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.classList.remove('open');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerWrap.classList.remove('open');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerWrap.classList.add('open');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 6. Project Preview Modal & Hero Video Performance Controller
  // ------------------------------------------------------------------------
  const videoModal = document.getElementById('videoModal');
  const closeVideoModal = document.getElementById('closeVideoModal');
  const heroLoopVideo = document.getElementById('heroLoopVideo');
  const heroPosterImg = document.querySelector('.hero-poster-img');
  const heroVideoWrapper = document.getElementById('heroVideoTrigger') || document.querySelector('.hero-video-wrapper') || heroLoopVideo;
  const carouselPlayButtons = document.querySelectorAll('.carousel-play-btn');
  const modalVideoTitle = document.getElementById('modalVideoTitle');

  const openVideo = (title = 'Motion Dojo Showcase') => {
    if (modalVideoTitle) modalVideoTitle.textContent = title;
    videoModal.classList.add('is-open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    videoModal.classList.remove('is-open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Check Data Saver and Reduced Motion preferences
  const shouldPreventAutoplay = () => {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasDataSaver = Boolean(navigator.connection && navigator.connection.saveData);
    return Boolean(prefersReducedMotion || hasDataSaver);
  };

  let isHeroVideoInView = true;

  if (heroLoopVideo) {
    // Explicitly enforce muted and inline playback for mobile browser policies
    heroLoopVideo.muted = true;
    heroLoopVideo.defaultMuted = true;
    heroLoopVideo.playsInline = true;

    const applyPosterMode = () => {
      heroLoopVideo.pause();
      heroLoopVideo.style.display = 'none';
      if (heroPosterImg) heroPosterImg.style.display = 'block';
    };

    const applyVideoMode = () => {
      heroLoopVideo.style.display = 'block';
      if (heroPosterImg) heroPosterImg.style.display = 'none';
      if (isHeroVideoInView) {
        const playPromise = heroLoopVideo.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
      }
    };

    const updateMediaState = () => {
      if (shouldPreventAutoplay()) {
        applyPosterMode();
      } else {
        applyVideoMode();
      }
    };

    // Initial preference check
    updateMediaState();

    // Call play() with a catch as a backup
    if (!shouldPreventAutoplay()) {
      const initialPlayPromise = heroLoopVideo.play();
      if (initialPlayPromise !== undefined) {
        initialPlayPromise.catch(() => {
          // If browser policy prevents unprompted autoplay, resume on first gesture
          const unlockPlayback = () => {
            ['touchstart', 'touchend', 'scroll', 'pointerdown'].forEach((evt) => {
              window.removeEventListener(evt, unlockPlayback, { passive: true });
            });
            if (!shouldPreventAutoplay() && isHeroVideoInView) {
              heroLoopVideo.play().catch(() => {});
            }
          };
          ['touchstart', 'touchend', 'scroll', 'pointerdown'].forEach((evt) => {
            window.addEventListener(evt, unlockPlayback, { passive: true, once: true });
          });
        });
      }

      // Also trigger playback backup once media data loads
      heroLoopVideo.addEventListener('loadeddata', () => {
        if (heroLoopVideo.paused && isHeroVideoInView && !shouldPreventAutoplay()) {
          const p = heroLoopVideo.play();
          if (p !== undefined) p.catch(() => {});
        }
      }, { once: true });
    }

    // Save Data and Battery: IntersectionObserver pauses video when off-screen and resumes when visible
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isHeroVideoInView = entry.isIntersecting;
          if (shouldPreventAutoplay()) {
            heroLoopVideo.pause();
            return;
          }

          if (entry.isIntersecting) {
            const p = heroLoopVideo.play();
            if (p !== undefined) p.catch(() => {});
          } else {
            heroLoopVideo.pause();
          }
        });
      }, { rootMargin: '50px 0px 50px 0px', threshold: 0 });

      heroObserver.observe(heroVideoWrapper || heroLoopVideo);
    }

    // Respect dynamic changes to reduced-motion preference
    if (window.matchMedia) {
      const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionMql.addEventListener) {
        motionMql.addEventListener('change', updateMediaState);
      }
    }

    if (navigator.connection && typeof navigator.connection.addEventListener === 'function') {
      navigator.connection.addEventListener('change', updateMediaState);
    }
  }

  carouselPlayButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoTitle = btn.getAttribute('data-video-title') || 'Motion Dojo Project Preview';
      openVideo(videoTitle);
    });
  });

  if (closeVideoModal) {
    closeVideoModal.addEventListener('click', closeVideo);
  }

  // ------------------------------------------------------------------------
  // 7. Interactive Enrolment Modal & Paystack Integration
  // ------------------------------------------------------------------------
  const enrollModal = document.getElementById('enrollModal');
  const closeEnrollModal = document.getElementById('closeEnrollModal');
  const modalEnrollTitle = document.getElementById('modalEnrollTitle');

  // Step containers
  const enrollChoiceStep = document.getElementById('enrollChoiceStep');
  const enrollDetailsStep = document.getElementById('enrollDetailsStep');
  const enrollSuccessStep = document.getElementById('enrollSuccessStep');

  // Step controls
  const choosePaystackBtn = document.getElementById('choosePaystack');
  const enrollBackBtn = document.getElementById('enrollBackBtn');
  const enrollForm = document.getElementById('enrollForm');
  const enrollSubmitBtn = document.getElementById('enrollSubmitBtn');
  const enrollPaymentStatus = document.getElementById('enrollPaymentStatus');
  const enrollFallbackLink = document.getElementById('enrollFallbackLink');
  const paymentReference = document.getElementById('paymentReference');

  // Form input fields
  const enrollName = document.getElementById('enrollName');
  const enrollEmail = document.getElementById('enrollEmail');
  const enrollPhone = document.getElementById('enrollPhone');
  const enrollNameError = document.getElementById('enrollNameError');
  const enrollEmailError = document.getElementById('enrollEmailError');
  const enrollPhoneError = document.getElementById('enrollPhoneError');

  let enrollTriggerToRestore = null;
  let bodyOverflowBeforeEnroll = '';
  let enrollFocusFrame = null;
  let paystackInstance = null;

  // Initialize PaystackPop once and reuse it across checkout requests
  const initPaystackInstance = () => {
    if (paystackInstance) return paystackInstance;
    if (typeof window.PaystackPop !== 'undefined') {
      if (typeof window.PaystackPop.newTransaction === 'function') {
        paystackInstance = window.PaystackPop;
      } else if (typeof window.PaystackPop === 'function') {
        paystackInstance = new window.PaystackPop();
      }
    }
    return paystackInstance;
  };

  // Pre-initialize instance as soon as the deferred script is parsed
  if (typeof window.PaystackPop !== 'undefined') {
    initPaystackInstance();
  } else {
    window.addEventListener('load', () => {
      initPaystackInstance();
    });
  }

  const isEnrollTrigger = (el) => {
    if (!el) return false;
    if (el.matches('[data-enroll-trigger], [data-checkout-plan="full"], [data-checkout-plan], [data-modal="enrollModal"], .sticky-mobile-cta, .btn-sticky-mobile')) {
      return true;
    }
    const text = (el.textContent || '').trim().toLowerCase();
    return text === 'enrol now' || text === 'enrol';
  };

  const getModalFocusableElements = (container) => {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll(
        'button:not([disabled]):not([hidden]), [href]:not([hidden]), input:not([disabled]):not([hidden]), select:not([disabled]):not([hidden]), textarea:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"]):not([hidden])'
      )
    ).filter(el => {
      return !el.hasAttribute('hidden') && !el.closest('[hidden]') && (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);
    });
  };

  // Step transitions
  const showChoiceStep = () => {
    if (enrollChoiceStep) enrollChoiceStep.removeAttribute('hidden');
    if (enrollDetailsStep) enrollDetailsStep.setAttribute('hidden', '');
    if (enrollSuccessStep) enrollSuccessStep.setAttribute('hidden', '');
    if (modalEnrollTitle) modalEnrollTitle.textContent = 'How would you like to enrol?';
  };

  const showDetailsStep = () => {
    if (enrollChoiceStep) enrollChoiceStep.setAttribute('hidden', '');
    if (enrollDetailsStep) enrollDetailsStep.removeAttribute('hidden');
    if (enrollSuccessStep) enrollSuccessStep.setAttribute('hidden', '');
    if (modalEnrollTitle) modalEnrollTitle.textContent = 'Enter your details';
    clearAllFieldErrors();
    if (enrollPaymentStatus) {
      enrollPaymentStatus.textContent = '';
      enrollPaymentStatus.setAttribute('hidden', '');
    }
    if (enrollFallbackLink) {
      enrollFallbackLink.setAttribute('hidden', '');
    }
  };

  const showSuccessStep = (reference) => {
    if (enrollChoiceStep) enrollChoiceStep.setAttribute('hidden', '');
    if (enrollDetailsStep) enrollDetailsStep.setAttribute('hidden', '');
    if (enrollSuccessStep) enrollSuccessStep.removeAttribute('hidden');
    if (modalEnrollTitle) modalEnrollTitle.textContent = 'Payment received';
    if (paymentReference) paymentReference.textContent = reference || 'N/A';
    const waLink = enrollSuccessStep?.querySelector('a[href*="wa.link"]');
    waLink?.focus();
  };

  const openEnroll = (trigger) => {
    if (!enrollModal) return;
    enrollTriggerToRestore = trigger || null;

    // If mobile menu drawer is open, close it
    if (typeof toggleMobileMenu === 'function' && typeof mobileDrawer !== 'undefined' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      toggleMobileMenu(false);
    }

    // Pause any playing videos (including hero loop) to free up bandwidth on mobile data
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((v) => {
      if (!v.paused) {
        v.pause();
        v.dataset.pausedByEnrollModal = 'true';
      }
    });

    bodyOverflowBeforeEnroll = document.body.style.overflow;
    enrollModal.classList.add('is-open');
    enrollModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reset to initial choice step
    showChoiceStep();

    // Ensure Paystack instance is ready
    initPaystackInstance();

    cancelAnimationFrame(enrollFocusFrame);
    enrollFocusFrame = requestAnimationFrame(() => {
      if (enrollModal.classList.contains('is-open')) {
        const focusable = getModalFocusableElements(enrollModal);
        const targetFocus = closeEnrollModal || focusable[0];
        targetFocus?.focus();
      }
    });
  };

  const closeEnroll = () => {
    if (!enrollModal || !enrollModal.classList.contains('is-open')) return;
    cancelAnimationFrame(enrollFocusFrame);
    enrollFocusFrame = null;
    enrollModal.classList.remove('is-open');
    enrollModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = bodyOverflowBeforeEnroll || '';

    // Resume any video paused by the enrolment modal
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((v) => {
      if (v.dataset.pausedByEnrollModal === 'true') {
        delete v.dataset.pausedByEnrollModal;
        if (v === heroLoopVideo) {
          if (!shouldPreventAutoplay() && isHeroVideoInView) {
            v.play().catch(() => {});
          }
        } else {
          v.play().catch(() => {});
        }
      }
    });

    if (enrollTriggerToRestore && typeof enrollTriggerToRestore.focus === 'function') {
      enrollTriggerToRestore.focus();
    }
    enrollTriggerToRestore = null;
  };

  // Form Field Validation
  const setFieldError = (input, errorEl, message) => {
    if (input) input.classList.add('is-invalid');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.removeAttribute('hidden');
    }
  };

  const clearFieldError = (input, errorEl) => {
    if (input) input.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.setAttribute('hidden', '');
    }
  };

  const clearAllFieldErrors = () => {
    clearFieldError(enrollName, enrollNameError);
    clearFieldError(enrollEmail, enrollEmailError);
    clearFieldError(enrollPhone, enrollPhoneError);
  };

  const validateName = () => {
    const val = (enrollName?.value || '').trim();
    if (!val) {
      setFieldError(enrollName, enrollNameError, 'Please enter your full name.');
      return false;
    }
    clearFieldError(enrollName, enrollNameError);
    return true;
  };

  const validateEmail = () => {
    const val = (enrollEmail?.value || '').trim();
    if (!val) {
      setFieldError(enrollEmail, enrollEmailError, 'Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setFieldError(enrollEmail, enrollEmailError, 'Please enter a valid email address.');
      return false;
    }
    clearFieldError(enrollEmail, enrollEmailError);
    return true;
  };

  const validatePhone = () => {
    const val = (enrollPhone?.value || '').trim();
    if (!val) {
      setFieldError(enrollPhone, enrollPhoneError, 'Please enter your WhatsApp number.');
      return false;
    }
    const digits = val.replace(/\D/g, '');
    if (digits.length < 7) {
      setFieldError(enrollPhone, enrollPhoneError, 'Please enter a valid phone number with country code.');
      return false;
    }
    clearFieldError(enrollPhone, enrollPhoneError);
    return true;
  };

  // Real-time inline validation cleanup on user input
  enrollName?.addEventListener('input', () => {
    if (enrollName.value.trim().length > 0) clearFieldError(enrollName, enrollNameError);
  });
  enrollEmail?.addEventListener('input', () => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollEmail.value.trim())) clearFieldError(enrollEmail, enrollEmailError);
  });
  enrollPhone?.addEventListener('input', () => {
    if (enrollPhone.value.replace(/\D/g, '').length >= 7) clearFieldError(enrollPhone, enrollPhoneError);
  });

  // Switch to Details Step when tapping "Pay with Paystack"
  if (choosePaystackBtn) {
    choosePaystackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showDetailsStep();
      requestAnimationFrame(() => {
        enrollName?.focus();
      });
    });
  }

  // Back arrow button to return to Choice Step
  if (enrollBackBtn) {
    enrollBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showChoiceStep();
      requestAnimationFrame(() => {
        choosePaystackBtn?.focus();
      });
    });
  }

  const setPayButtonLoading = (loading) => {
    if (!enrollSubmitBtn) return;
    if (loading) {
      enrollSubmitBtn.disabled = true;
      enrollSubmitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span>Opening secure checkout...';
    } else {
      enrollSubmitBtn.disabled = false;
      enrollSubmitBtn.innerHTML = 'Pay ₦40,000';
    }
  };

  const openPaystackCheckoutSync = (nameVal, emailVal, phoneVal) => {
    const config = window.MOTION_DOJO_CONFIG || {};
    const publicKey = config.PAYSTACK_PUBLIC_KEY || 'pk_test_REPLACE_ME';
    const amountKobo = Number(config.AMOUNT_KOBO) || 4000000;
    const currency = config.CURRENCY || 'NGN';
    const courseName = config.COURSE_NAME || 'Black Belt in Motion Design';
    const attemptReference = 'MD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const transactionOptions = {
      key: publicKey,
      email: emailVal,
      amount: amountKobo,
      currency: currency,
      ref: attemptReference,
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: nameVal
          },
          {
            display_name: 'WhatsApp Number',
            variable_name: 'whatsapp_number',
            value: phoneVal
          },
          {
            display_name: 'Course Name',
            variable_name: 'course_name',
            value: courseName
          }
        ]
      },
      onSuccess: (transaction) => {
        const finalRef = (transaction && (transaction.reference || transaction.ref)) || attemptReference;

        if (enrollPaymentStatus) {
          enrollPaymentStatus.textContent = 'Confirming your payment...';
          enrollPaymentStatus.removeAttribute('hidden');
        }
        if (enrollSubmitBtn) {
          enrollSubmitBtn.disabled = true;
          enrollSubmitBtn.textContent = 'Confirming your payment...';
        }

        // Server-side verification strictly occurs AFTER successful payment
        fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reference: finalRef })
        })
          .then(async (res) => {
            let data = null;
            try { data = await res.json(); } catch (_) { data = null; }
            return { ok: res.ok, data };
          })
          .then(({ ok, data }) => {
            setPayButtonLoading(false);
            if (ok && data && data.verified === true) {
              showSuccessStep(finalRef);
            } else {
              const errorMsg = (data && data.message) || 'Payment verification could not be confirmed.';
              if (enrollPaymentStatus) {
                enrollPaymentStatus.textContent = `${errorMsg} If you have been debited, please contact us on WhatsApp with reference: ${finalRef}.`;
                enrollPaymentStatus.removeAttribute('hidden');
              }
              if (enrollFallbackLink) {
                enrollFallbackLink.removeAttribute('hidden');
              }
            }
          })
          .catch((err) => {
            console.error('Verification network error:', err);
            setPayButtonLoading(false);
            if (enrollPaymentStatus) {
              enrollPaymentStatus.textContent = `Could not verify payment automatically due to a network error. Keep your reference: ${finalRef} and message us on WhatsApp.`;
              enrollPaymentStatus.removeAttribute('hidden');
            }
            if (enrollFallbackLink) {
              enrollFallbackLink.removeAttribute('hidden');
            }
          });
      },
      onCancel: () => {
        setPayButtonLoading(false);
        showDetailsStep();
        if (enrollPaymentStatus) {
          enrollPaymentStatus.textContent = 'Payment was not completed. You can try again.';
          enrollPaymentStatus.removeAttribute('hidden');
        }
      }
    };

    try {
      paystackInstance.newTransaction(transactionOptions);
    } catch (err) {
      console.error('Paystack transaction call error:', err);
      setPayButtonLoading(false);
      if (enrollPaymentStatus) {
        enrollPaymentStatus.textContent = 'Payment gateway could not be loaded. Prefer a direct bank transfer? You can get our account number on WhatsApp.';
        enrollPaymentStatus.removeAttribute('hidden');
      }
      if (enrollFallbackLink) {
        enrollFallbackLink.removeAttribute('hidden');
      }
    }
  };

  // Handle Form Submission -> Paystack
  if (enrollForm) {
    enrollForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();

      if (!isNameValid || !isEmailValid || !isPhoneValid) {
        if (!isNameValid) enrollName?.focus();
        else if (!isEmailValid) enrollEmail?.focus();
        else if (!isPhoneValid) enrollPhone?.focus();
        return;
      }

      const nameVal = enrollName.value.trim();
      const emailVal = enrollEmail.value.trim();
      const phoneVal = enrollPhone.value.trim();

      // Immediately transition button into loading state with spinner
      setPayButtonLoading(true);

      if (enrollPaymentStatus) {
        enrollPaymentStatus.textContent = '';
        enrollPaymentStatus.setAttribute('hidden', '');
      }
      if (enrollFallbackLink) {
        enrollFallbackLink.setAttribute('hidden', '');
      }

      const instance = initPaystackInstance();
      if (instance && typeof instance.newTransaction === 'function') {
        // Fast synchronous launch: zero await, zero fetch, zero server call before popup
        openPaystackCheckoutSync(nameVal, emailVal, phoneVal);
      } else {
        // Fallback: If script is still downloading, poll for up to 8 seconds
        let timedOut = false;
        const timeoutTimer = setTimeout(() => {
          timedOut = true;
          setPayButtonLoading(false);
          if (enrollPaymentStatus) {
            enrollPaymentStatus.textContent = 'Payment gateway could not be loaded. Prefer a direct bank transfer? You can get our account number on WhatsApp.';
            enrollPaymentStatus.removeAttribute('hidden');
          }
          if (enrollFallbackLink) {
            enrollFallbackLink.removeAttribute('hidden');
          }
        }, 8000);

        const checkInterval = setInterval(() => {
          if (timedOut) {
            clearInterval(checkInterval);
            return;
          }
          const inst = initPaystackInstance();
          if (inst && typeof inst.newTransaction === 'function') {
            clearInterval(checkInterval);
            clearTimeout(timeoutTimer);
            openPaystackCheckoutSync(nameVal, emailVal, phoneVal);
          }
        }, 50);
      }
    });
  }

  // Delegate click for every Enrol button (header, hero, pricing, final call to action, sticky mobile button)
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('a, button');
    if (!trigger) return;
    if (isEnrollTrigger(trigger)) {
      event.preventDefault();
      openEnroll(trigger);
    }
  });

  // Attach direct listeners as well to ensure immediate prevention
  const enrollTriggers = document.querySelectorAll('[data-enroll-trigger], [data-checkout-plan]');
  enrollTriggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openEnroll(trigger);
    });
  });

  // Close with the X button
  closeEnrollModal?.addEventListener('click', (e) => {
    e.preventDefault();
    closeEnroll();
  });

  // Close when tapping the overlay backdrop
  if (enrollModal) {
    enrollModal.addEventListener('click', (e) => {
      if (e.target === enrollModal) {
        closeEnroll();
      }
    });
  }

  // Global Backdrop Click Handler for other modals
  window.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideo();
    const testimonialModal = document.getElementById('testimonialVideoModal');
    if (e.target === testimonialModal && typeof window.closeTestimonialVideoModal === 'function') {
      window.closeTestimonialVideoModal();
    }
  });

  // Keydown Handler: Escape key & Accessible Focus Trap
  window.addEventListener('keydown', (e) => {
    // Focus Trap inside Enrolment Modal
    if (enrollModal && enrollModal.classList.contains('is-open') && e.key === 'Tab') {
      const focusable = getModalFocusableElements(enrollModal);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !enrollModal.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !enrollModal.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    if (e.key === 'Escape') {
      if (enrollModal && enrollModal.classList.contains('is-open')) {
        e.preventDefault();
        closeEnroll();
      }
      closeVideo();
      if (typeof window.closeTestimonialVideoModal === 'function') {
        window.closeTestimonialVideoModal();
      }
      toggleMobileMenu(false);
    }
  });

  // ------------------------------------------------------------------------
  // 8. Active Nav Link on Scroll Spy
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const onScrollSpy = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScrollSpy, { passive: true });

  // ------------------------------------------------------------------------
  // 9. Interactive 3D Team Flip Cards
  // ------------------------------------------------------------------------
  const teamGrid = document.getElementById('teamGrid');

  const renderTeamCards = () => {
    if (!teamGrid) return;

    teamGrid.innerHTML = teamMembers.map(member => {
      if (!member.canFlip) {
        // Timxpert: static portrait card, no flip behavior, no flip badge, no bio
        return `
          <div class="team-card-wrapper static-card-wrapper" data-member-id="${member.id}">
            <div class="team-card static-team-card">
              <div class="team-photo-frame static-photo-frame">
                <img src="${member.photo}" alt="${member.name}" class="team-photo-img" loading="lazy" />
              </div>
              <div class="team-info">
                <h4 class="member-name">${member.name}</h4>
              </div>
            </div>
          </div>
        `;
      }

      // Flippable cards for Muhammad, Elizabeth, George
      const waUrl = getMemberWhatsAppUrl(member);
      const bioFormatted = (member.bio || '').replace(/\n/g, '<br/>');
      const connectName = member.connectName || member.firstName || (member.name ? member.name.split(' ')[0] : 'Team');

      return `
        <div class="team-card-wrapper flip-card-wrapper" data-member-id="${member.id}">
          <div class="flip-card" id="flipCard-${member.id}">
            <div class="flip-card-inner">
              <!-- FRONT OF CARD -->
              <div class="flip-card-face flip-card-front" aria-hidden="false">
                <button type="button" class="team-photo-frame-btn" aria-label="Flip card to connect with ${member.name}">
                  <div class="team-photo-frame">
                    <img src="${member.photo}" alt="${member.name}" class="team-photo-img" loading="lazy" />
                    <span class="flip-indicator-badge" aria-hidden="true" title="Tap to flip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flip-svg-icon">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                      </svg>
                    </span>
                  </div>
                </button>
                <div class="team-info">
                  <h4 class="member-name">${member.name}</h4>
                  <span class="member-role">${member.role}</span>
                </div>
              </div>

              <!-- BACK OF CARD -->
              <div class="flip-card-face flip-card-back" aria-hidden="true">
                <div class="flip-back-content">
                  <div class="back-bio-wrap">
                    <span class="back-title">${member.name}</span>
                    <p class="back-bio-text">${bioFormatted}</p>
                  </div>
                  <div class="back-actions">
                    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp" aria-label="Connect with ${connectName} on WhatsApp">
                      <svg viewBox="0 0 24 24" fill="currentColor" class="wa-icon" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span>Connect with ${connectName}</span>
                    </a>
                    <button type="button" class="flip-back-btn" aria-label="Flip back to front of card">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flip-back-icon" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                      <span>Tap to flip back</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click and accessibility handlers
    const flipCards = teamGrid.querySelectorAll('.flip-card');

    const flipCardToBack = (cardEl) => {
      // Single-card flip policy: flip back any other card that is open
      flipCards.forEach(otherCard => {
        if (otherCard !== cardEl && otherCard.classList.contains('is-flipped')) {
          flipCardToFront(otherCard, false);
        }
      });

      cardEl.classList.add('is-flipped');
      const frontFace = cardEl.querySelector('.flip-card-front');
      const backFace = cardEl.querySelector('.flip-card-back');
      const waBtn = cardEl.querySelector('.btn-whatsapp');

      if (frontFace) frontFace.setAttribute('aria-hidden', 'true');
      if (backFace) backFace.setAttribute('aria-hidden', 'false');

      if (waBtn) {
        setTimeout(() => {
          waBtn.focus();
        }, 160);
      }
    };

    const flipCardToFront = (cardEl, shouldReturnFocus = true) => {
      cardEl.classList.remove('is-flipped');
      const frontFace = cardEl.querySelector('.flip-card-front');
      const backFace = cardEl.querySelector('.flip-card-back');
      const photoBtn = cardEl.querySelector('.team-photo-frame-btn');

      if (frontFace) frontFace.setAttribute('aria-hidden', 'false');
      if (backFace) backFace.setAttribute('aria-hidden', 'true');

      if (shouldReturnFocus && photoBtn) {
        photoBtn.focus();
      }
    };

    flipCards.forEach(cardEl => {
      const photoBtn = cardEl.querySelector('.team-photo-frame-btn');
      const flipBackBtn = cardEl.querySelector('.flip-back-btn');

      if (photoBtn) {
        photoBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (cardEl.classList.contains('is-flipped')) {
            flipCardToFront(cardEl, true);
          } else {
            flipCardToBack(cardEl);
          }
        });
      }

      if (flipBackBtn) {
        flipBackBtn.addEventListener('click', (e) => {
          e.preventDefault();
          flipCardToFront(cardEl, true);
        });
      }
    });

    // Close open flip card on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openFlipped = teamGrid.querySelector('.flip-card.is-flipped');
        if (openFlipped) {
          flipCardToFront(openFlipped, true);
        }
      }
    });
  };

  renderTeamCards();

  // ------------------------------------------------------------------------
  // WHO IT'S FOR: Render & Scroll Observer
  // ------------------------------------------------------------------------
  const initWhoItsFor = () => {
    const whoForGrid = document.getElementById('whoForGrid');
    if (!whoForGrid) return;

    const cards = whoForGrid.querySelectorAll('.who-for-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('is-in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    });

    cards.forEach(c => observer.observe(c));
  };

  initWhoItsFor();

  // ------------------------------------------------------------------------
  // FOUNDER'S DESK: Scroll Observer for Staggered Paragraphs
  // ------------------------------------------------------------------------
  const initFoundersDesk = () => {
    const foundersSection = document.getElementById('founders-desk');
    if (!foundersSection) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      foundersSection.classList.add('is-in-view');
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          foundersSection.classList.add('is-in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    observer.observe(foundersSection);
  };

  initFoundersDesk();

  // ------------------------------------------------------------------------
  // 17. Floating Back-to-Home Button
  // ------------------------------------------------------------------------
  const initFloatingBackHome = () => {
    const floatingBackHome = document.getElementById('floatingBackHome');
    if (!floatingBackHome) return;

    let scrollTicking = false;
    const updateBackHomeVisibility = () => {
      // Show when scrolled down past 400px from the top, hide when at the top
      if (window.scrollY > 400) {
        floatingBackHome.classList.add('is-visible');
      } else {
        floatingBackHome.classList.remove('is-visible');
      }
      scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateBackHomeVisibility);
        scrollTicking = true;
      }
    }, { passive: true });

    // Initial check on load (e.g. if loaded at a hash anchor or mid-scroll)
    updateBackHomeVisibility();

    floatingBackHome.addEventListener('click', (e) => {
      const isFileProtocol = window.location.protocol === 'file:';
      const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // When already on homepage
      if (isFileProtocol || (isHomePage && !window.location.search)) {
        e.preventDefault();
        if (window.location.hash) {
          try {
            history.pushState(null, '', window.location.pathname);
          } catch (_) {
            window.location.hash = '';
          }
        }
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      } else {
        // Direct navigation to homepage root
        window.location.href = '/';
      }
    });
  };

  initFloatingBackHome();
});
