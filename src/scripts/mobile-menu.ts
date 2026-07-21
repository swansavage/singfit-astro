function initializeMobileMenu() {
  const body = document.body;
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const drawer = document.querySelector<HTMLElement>('[data-mobile-drawer]');
  const closeButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  const overlay = document.querySelector<HTMLElement>('[data-menu-overlay]');
  const drawerLinks = document.querySelectorAll<HTMLAnchorElement>('.drawer-nav a');
  let lastFocusedElement: (Element & { focus?: () => void }) | null = null;

  if (!toggle || !drawer || !closeButton || !overlay) return;

  const menuToggle = toggle;
  const menuDrawer = drawer;
  const menuCloseButton = closeButton;
  const menuOverlay = overlay;

  function setMenuState(isOpen: boolean) {
    body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuDrawer.setAttribute('aria-hidden', String(!isOpen));
    menuOverlay.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      lastFocusedElement = document.activeElement;
      menuCloseButton.focus();
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

  menuToggle.addEventListener('click', openMenu);
  menuCloseButton.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);
  drawerLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();

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
