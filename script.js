/**
 * Motion Dojo — Interactive JavaScript
 * Implements sticky header scroll, mobile drawer, phase outline toggles,
 * stacked 3D project carousel, FAQ accordion, modals, and team 3D flip cards.
 */

// ============================================================================
// MOTION DOJO — TESTIMONIALS DATA CONFIGURATION
// Centralized array supporting both 'video' cards and 'text' cards.
// Update videos, posters, quotes, or student bios easily in one place.
// ============================================================================
const testimonials = [
  {
    id: 't-1',
    type: 'video',
    studentName: 'Chidubem Okafor',
    bio: 'Freelance 3D & kinetic motion designer who landed his first international commercial campaign within 6 weeks of Phase 3.',
    poster: 'assets/George Junior.jpg',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoTitle: 'Chidubem Okafor — From Mobile Novice to Commercial Ninja',
    caption: '“Motion Dojo broke down camera easing and client pitching in a way that landed me my first $1,200 project.”'
  },
  {
    id: 't-2',
    type: 'video',
    studentName: 'Amina Bello',
    bio: 'Turned smartphone animation into a 6-figure monthly agency retainer with high-velocity product adverts.',
    poster: 'assets/Osho Elizabeth Oluwatobiloba.jpg',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoTitle: 'Amina Bello — Scaling Video Ads on Smartphone',
    caption: '“I was skeptical about smartphone motion design until Sensei Tim broke down vector masks and null cameras.”'
  },
  {
    id: 't-3',
    type: 'video',
    studentName: 'Tunde Adeleke',
    bio: 'Self-taught animator who transitioned from static graphic design to full-time motion director.',
    poster: 'assets/Muhammad Fatihi Abdullahi.jpg',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    videoTitle: 'Tunde Adeleke — The 4-Phase Journey to Mastery',
    caption: '“The community feedback and weekly critique sessions pushed my render quality 10x higher.”'
  },
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
    role: 'Community manager',
    photo: 'assets/Muhammad Fatihi Abdullahi.jpg',
    canFlip: true,
    bio: 'I create engaging video ads for businesses and brands using AI video, professional editing, and motion design.',
    whatsappNumber: '+2348000000001', // Placeholder
    prefilledMessage: 'Hi Muhammad, I found your profile on Motion Dojo and would like to connect!',
    waLink: 'https://wa.link/be49ci'
  },
  {
    id: 'osho',
    name: 'Osho Elizabeth Oluwatobiloba',
    firstName: 'Elizabeth',
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
    role: 'Social media manager',
    photo: 'assets/George Junior.jpg',
    canFlip: true,
    bio: '2D Animator & Storyteller\nTurning imagination into animation',
    whatsappNumber: '+2348000000003', // Placeholder
    prefilledMessage: 'Hi George, I found your profile on Motion Dojo and would like to connect!',
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
      if (!link.matches('[data-enroll-trigger]')) {
        toggleMobileMenu(false);
      }
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
    const videoPlayer = document.getElementById('testimonialVideoPlayer');
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
      return `
        <div class="testimonial-card-item" data-index="${index}" id="testimonial-card-${index}" role="group" aria-roledescription="slide" aria-label="Testimonial ${index + 1} of ${totalCards}: ${item.studentName}">
          <div class="testimonial-card-inner is-video-card">
            <div class="testimonial-media-box">
              <img src="${item.poster}" alt="${item.studentName} motion design testimonial thumbnail" class="testimonial-poster-img" loading="lazy" />
              <button type="button" class="testimonial-play-btn" aria-label="Play video testimonial from ${item.studentName}" data-index="${index}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
            <div class="testimonial-attached-panel">
              <h3 class="testimonial-student-name">${item.studentName}</h3>
              <p class="testimonial-student-bio">${item.bio}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const cardElements = coverflow.querySelectorAll('.testimonial-card-item');

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
    };

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
      if (modalSub) modalSub.textContent = item.bio;
      if (modalQuote && modalQuoteWrap) {
        if (item.caption) {
          modalQuote.textContent = item.caption;
          modalQuoteWrap.style.display = 'block';
        } else {
          modalQuoteWrap.style.display = 'none';
        }
      }

      if (videoPlayer) {
        // Lazy load video source on demand (no autoplay beforehand)
        videoPlayer.src = item.videoSrc;
        videoPlayer.load();
        const playPromise = videoPlayer.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
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

      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.removeAttribute('src');
        videoPlayer.load();
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

    // Initial positioning
    updateCoverflow();
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
  // 6. Interactive Video Preview Modal
  // ------------------------------------------------------------------------
  const videoModal = document.getElementById('videoModal');
  const closeVideoModal = document.getElementById('closeVideoModal');
  const heroVideoTrigger = document.getElementById('heroVideoTrigger');
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

  if (heroVideoTrigger) {
    heroVideoTrigger.addEventListener('click', () => openVideo('Black Belt in Motion Design — Course Overview'));
    heroVideoTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVideo('Black Belt in Motion Design — Course Overview');
      }
    });
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
  // 7. Interactive Enrolment Modal
  // ------------------------------------------------------------------------
  const enrollModal = document.getElementById('enrollModal');
  const closeEnrollModal = document.getElementById('closeEnrollModal');
  const enrollTriggers = document.querySelectorAll('[data-enroll-trigger], [data-checkout-plan]');
  const enrollCloseButton = document.getElementById('closeEnrollModal');
  let enrollTriggerToRestore = null;
  let bodyOverflowBeforeEnroll = '';
  let enrollFocusFrame = null;

  const openEnroll = (trigger) => {
    enrollTriggerToRestore = trigger;
    bodyOverflowBeforeEnroll = document.body.style.overflow;
    enrollModal.classList.add('is-open');
    enrollModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    cancelAnimationFrame(enrollFocusFrame);
    enrollFocusFrame = requestAnimationFrame(() => {
      if (enrollModal.classList.contains('is-open')) enrollCloseButton?.focus();
    });
  };

  const closeEnroll = () => {
    if (!enrollModal.classList.contains('is-open')) return;
    cancelAnimationFrame(enrollFocusFrame);
    enrollFocusFrame = null;
    enrollModal.classList.remove('is-open');
    enrollModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = bodyOverflowBeforeEnroll;
    enrollTriggerToRestore?.focus();
  };

  enrollTriggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openEnroll(trigger);
    });
  });

  closeEnrollModal?.addEventListener('click', closeEnroll);

  // Global Backdrop Click & Escape Key Handler
  window.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideo();
    if (e.target === enrollModal) closeEnroll();
    const testimonialModal = document.getElementById('testimonialVideoModal');
    if (e.target === testimonialModal && typeof window.closeTestimonialVideoModal === 'function') {
      window.closeTestimonialVideoModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (enrollModal.classList.contains('is-open') && e.key === 'Tab') {
      const focusable = [...enrollModal.querySelectorAll('a[href]:not([hidden]), button:not([disabled]):not([hidden]), input:not([disabled]):not([hidden])')]
        .filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    if (e.key === 'Escape') {
      closeVideo();
      closeEnroll();
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
                    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp" aria-label="Connect with ${member.firstName} on WhatsApp">
                      <svg viewBox="0 0 24 24" fill="currentColor" class="wa-icon" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span>Connect with ${member.firstName}</span>
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
});
