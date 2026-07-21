function initializeTestimonialCarousel() {
  const carousel = document.querySelector<HTMLElement>('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector<HTMLElement>('[data-track]');
  const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>('[data-dots] button'));
  const prev = carousel.querySelector<HTMLButtonElement>('[data-prev]');
  const next = carousel.querySelector<HTMLButtonElement>('[data-next]');
  const pause = carousel.querySelector<HTMLButtonElement>('[data-carousel-pause]');

  if (!track || !prev || !next) return;

  const carouselTrack = track;
  const previousButton = prev;
  const nextButton = next;
  const slides = Array.from(carouselTrack.children);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer: number | undefined;
  let isPaused = reduceMotion;

  slides.forEach((slide, i) => {
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
  });

  function showSlide(nextIndex: number) {
    index = (nextIndex + slides.length) % slides.length;
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;

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

  function setPaused(nextPaused: boolean) {
    isPaused = nextPaused;
    if (pause) {
      pause.setAttribute('aria-pressed', String(isPaused));
      pause.textContent = isPaused ? 'Play' : 'Pause';
    }
    start();
  }

  previousButton.addEventListener('click', () => {
    showSlide(index - 1);
    start();
  });

  nextButton.addEventListener('click', () => {
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
}

initializeTestimonialCarousel();
