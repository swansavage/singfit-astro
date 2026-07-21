function initializeProductVideos() {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('.product-video'));
  if (!videos.length) return;

  const playVideo = (video: HTMLVideoElement) => {
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

      if (!(video instanceof HTMLVideoElement)) return;

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
}

initializeProductVideos();
