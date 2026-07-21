function initializeTestimonialCarousel() {
  const carousel = document.querySelector<HTMLElement>('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector<HTMLElement>('[data-track]');
  const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>('[data-dots] button'));
  const prev = carousel.querySelector<HTMLButtonElement>('[data-prev]');
  const next = carousel.querySelector<HTMLButtonElement>('[data-next]');
  const pause = carousel.querySelector<HTMLButtonElement>('[data-carousel-pause]');
  const pauseIcon = carousel.querySelector<HTMLElement>('[data-carousel-pause-icon]');
  const pauseLabel = carousel.querySelector<HTMLElement>('[data-carousel-pause-label]');
  const status = carousel.querySelector<HTMLElement>('[data-carousel-status]');

  if (!track || !prev || !next) return;

  const carouselTrack = track;
  const previousButton = prev;
  const nextButton = next;
  const slides = Array.from(carouselTrack.children)
    .filter((slide): slide is HTMLElement => slide instanceof HTMLElement);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer: number | undefined;
  let autoplayEnabled = !reduceMotion.matches;
  let isHovered = false;
  let isFocusWithin = false;

  function showSlide(nextIndex: number, announce = false) {
    index = (nextIndex + slides.length) % slides.length;
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    if (announce && status) {
      status.textContent = `Showing testimonial ${index + 1} of ${slides.length}`;
    }
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  }

  function start() {
    stop();
    if (!autoplayEnabled || isHovered || isFocusWithin) return;
    timer = window.setInterval(() => showSlide(index + 1), 6500);
  }

  function updatePauseControl() {
    if (!pause) return;

    const isPaused = !autoplayEnabled;
    pause.setAttribute('aria-pressed', String(isPaused));
    pause.setAttribute('aria-label', isPaused ? 'Play testimonial rotation' : 'Pause testimonial rotation');
    if (pauseIcon) pauseIcon.textContent = isPaused ? '▶' : 'Ⅱ';
    if (pauseLabel) pauseLabel.textContent = isPaused ? 'Play' : 'Pause';
  }

  function setAutoplayEnabled(isEnabled: boolean) {
    autoplayEnabled = isEnabled;
    updatePauseControl();
    start();
  }

  previousButton.addEventListener('click', () => {
    showSlide(index - 1, true);
    start();
  });

  nextButton.addEventListener('click', () => {
    showSlide(index + 1, true);
    start();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      showSlide(dotIndex, true);
      start();
    });
  });

  pause?.addEventListener('click', () => {
    setAutoplayEnabled(!autoplayEnabled);
  });

  carousel.addEventListener('mouseenter', () => {
    isHovered = true;
    stop();
  });

  carousel.addEventListener('mouseleave', () => {
    isHovered = false;
    start();
  });

  carousel.addEventListener('focusin', () => {
    isFocusWithin = true;
    stop();
  });

  carousel.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof Node && carousel.contains(event.relatedTarget)) return;
    isFocusWithin = false;
    start();
  });

  reduceMotion.addEventListener('change', (event) => {
    if (event.matches) setAutoplayEnabled(false);
  });

  showSlide(0);
  updatePauseControl();
  start();
}

initializeTestimonialCarousel();
