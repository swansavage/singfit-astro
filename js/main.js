(() => {
    const body = document.body;
    const toggle = document.querySelector('[data-menu-toggle]');
    const drawer = document.querySelector('[data-mobile-drawer]');
    const close = document.querySelector('[data-menu-close]');
    const overlay = document.querySelector('[data-menu-overlay]');
    const drawerLinks = document.querySelectorAll('.drawer-nav a');
    let lastFocusedElement = null;

    if (!toggle || !drawer || !close || !overlay) return;

    function setMenuState(isOpen) {
      body.classList.toggle('menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      drawer.setAttribute('aria-hidden', String(!isOpen));
      overlay.setAttribute('aria-hidden', String(!isOpen));

      if (isOpen) {
        lastFocusedElement = document.activeElement;
        close.focus();
      } else if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    function openMenu() {
      setMenuState(true);
    }

    function closeMenu() {
      setMenuState(false);
    }

    toggle.addEventListener('click', openMenu);
    close.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    drawerLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();

      if (event.key === 'Tab' && body.classList.contains('menu-open')) {
        const focusable = drawer.querySelectorAll('a[href], button:not([disabled])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  })();

/* --- Extracted from prototype --- */

(() => {
    const carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;

    const track = carousel.querySelector('[data-track]');
    const dots = Array.from(carousel.querySelectorAll('[data-dots] button'));
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const pause = carousel.querySelector('[data-carousel-pause]');
    const slides = Array.from(track.children);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    let timer;
    let isPaused = reduceMotion;

    slides.forEach((slide, i) => {
      slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
    });

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    function start() {
      stop();
      if (isPaused || reduceMotion) return;
      timer = window.setInterval(() => showSlide(index + 1), 6500);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
    }

    function setPaused(nextPaused) {
      isPaused = nextPaused;
      if (pause) {
        pause.setAttribute('aria-pressed', String(isPaused));
        pause.textContent = isPaused ? 'Play' : 'Pause';
      }
      start();
    }

    prev.addEventListener('click', () => {
      showSlide(index - 1);
      start();
    });

    next.addEventListener('click', () => {
      showSlide(index + 1);
      start();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        start();
      });
    });

    if (pause) {
      pause.addEventListener('click', () => {
        setPaused(!isPaused);
      });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    showSlide(0);
    setPaused(isPaused);
  })();

(() => {
    const videos = Array.from(document.querySelectorAll('.product-video'));
    if (!videos.length) return;

    const playVideo = (video) => {
      video.muted = true;
      video.defaultMuted = true;

      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => {});
      }
    };

    if (!('IntersectionObserver' in window)) {
      videos.forEach(playVideo);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          playVideo(video);
        } else {
          video.pause();
        }
      });
    }, {
      rootMargin: '180px 0px',
      threshold: 0.2,
    });

    videos.forEach((video) => {
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      observer.observe(video);
    });
  })();
