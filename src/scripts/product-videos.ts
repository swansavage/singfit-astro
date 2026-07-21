function initializeProductVideos() {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('.product-video'));
  if (!videos.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  videos.forEach((video) => {
    const phoneScreen = video.closest<HTMLElement>('.product-phone-screen');
    const control = phoneScreen?.querySelector<HTMLButtonElement>('[data-product-video-toggle]');
    const controlIcon = control?.querySelector<HTMLElement>('[data-video-toggle-icon]');
    const controlLabel = control?.querySelector<HTMLElement>('[data-video-toggle-label]');
    const videoLabel = control?.dataset.videoLabel ?? 'product preview';
    let userIntent: 'paused' | 'playing' | null = null;
    let isIntersecting = false;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const updateControl = () => {
      if (!control) return;

      const isPaused = video.paused;
      control.setAttribute('aria-label', `${isPaused ? 'Play' : 'Pause'} video: ${videoLabel}`);
      if (controlIcon) controlIcon.textContent = isPaused ? '▶' : 'Ⅱ';
      if (controlLabel) controlLabel.textContent = isPaused ? 'Play' : 'Pause';
    };

    const playVideo = () => {
      if (userIntent === 'paused') return;
      if (reduceMotion.matches && userIntent !== 'playing') return;

      video.muted = true;
      video.defaultMuted = true;

      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(updateControl);
      }
    };

    const syncPlayback = () => {
      if (!isIntersecting || userIntent === 'paused' || (reduceMotion.matches && userIntent !== 'playing')) {
        video.pause();
        return;
      }

      playVideo();
    };

    control?.addEventListener('click', () => {
      if (video.paused) {
        userIntent = 'playing';
        playVideo();
      } else {
        userIntent = 'paused';
        video.pause();
      }
    });

    video.addEventListener('play', updateControl);
    video.addEventListener('pause', updateControl);

    reduceMotion.addEventListener('change', (event) => {
      if (event.matches && userIntent !== 'playing') video.pause();
      else syncPlayback();
    });

    if (!('IntersectionObserver' in window)) {
      isIntersecting = true;
      syncPlayback();
      updateControl();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry?.isIntersecting ?? false;
      syncPlayback();
    }, {
      rootMargin: '180px 0px',
      threshold: 0.2,
    });

    observer.observe(video);
    updateControl();
  });
}

initializeProductVideos();
