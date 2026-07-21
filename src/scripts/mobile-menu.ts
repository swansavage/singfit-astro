function initializeMobileMenu() {
  const body = document.body;
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const drawer = document.querySelector<HTMLElement>('[data-mobile-drawer]');
  const closeButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  const overlay = document.querySelector<HTMLElement>('[data-menu-overlay]');
  const drawerLinks = document.querySelectorAll<HTMLAnchorElement>('.drawer-nav a');
  let lastFocusedElement: (Element & { focus?: () => void }) | null = null;
  const previousInertStates = new Map<HTMLElement, boolean>();

  if (!toggle || !drawer || !closeButton || !overlay) return;

  const menuToggle = toggle;
  const menuDrawer = drawer;
  const menuCloseButton = closeButton;
  const menuOverlay = overlay;

  const backgroundElements = [
    document.querySelector<HTMLElement>('.skip-link'),
    ...Array.from(menuDrawer.parentElement?.children ?? [])
      .filter((element) => element !== menuDrawer && element !== menuOverlay),
    document.querySelector<HTMLElement>('main'),
    document.querySelector<HTMLElement>('footer'),
  ].filter((element): element is HTMLElement => element instanceof HTMLElement);

  function setBackgroundInert(isInert: boolean) {
    if (isInert) {
      backgroundElements.forEach((element) => {
        previousInertStates.set(element, element.inert);
        element.inert = true;
      });
      return;
    }

    backgroundElements.forEach((element) => {
      element.inert = previousInertStates.get(element) ?? false;
    });
    previousInertStates.clear();
  }

  function setMenuState(isOpen: boolean) {
    body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuOverlay.setAttribute('aria-hidden', String(!isOpen));
    menuDrawer.setAttribute('aria-modal', String(isOpen));

    if (isOpen) {
      lastFocusedElement = document.activeElement;
      menuDrawer.inert = false;
      menuDrawer.setAttribute('aria-hidden', 'false');
      menuCloseButton.focus();
      setBackgroundInert(true);
      return;
    }

    setBackgroundInert(false);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }

    menuDrawer.inert = true;
    menuDrawer.setAttribute('aria-hidden', 'true');
  }

  function openMenu() {
    setMenuState(true);
  }

  function closeMenu() {
    setMenuState(false);
  }

  menuToggle.addEventListener('click', openMenu);
  menuCloseButton.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);
  drawerLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) closeMenu();

    if (event.key === 'Tab' && body.classList.contains('menu-open')) {
      const focusable = menuDrawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusable.item(0);
      const last = focusable.item(focusable.length - 1);

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
}

initializeMobileMenu();
