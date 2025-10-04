(function () {
  const STATES = {
    public: 'navbar-public',
    candidate: 'navbar-candidate',
    recruiter: 'navbar-recruiter',
    hr: 'navbar-hr',
    admin: 'navbar-admin',
  };

  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function hideAllNavbars() {
    Object.values(STATES).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }

  function setNavbarState(state) {
    hideAllNavbars();
    const id = STATES[state] || STATES.public;
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }

  function initStateSwitcher() {
    const select = document.getElementById('navbarStateSelect');
    if (!select) return;
    select.addEventListener('change', () => setNavbarState(select.value));

    // Initialize
    if (!select.value) select.value = 'public';
    setNavbarState(select.value);
  }

  function closeAllDropdowns(except = null) {
    $all('[data-dropdown].open').forEach((d) => {
      if (except && d === except) return;
      d.classList.remove('open');
      const trigger = d.querySelector('[data-dropdown-trigger]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleDropdown(container, force) {
    const willOpen = force ?? !container.classList.contains('open');
    if (willOpen) {
      closeAllDropdowns(container);
      container.classList.add('open');
    } else {
      container.classList.remove('open');
    }
    const trigger = container.querySelector('[data-dropdown-trigger]');
    if (trigger) trigger.setAttribute('aria-expanded', String(willOpen));
  }

  function initDropdowns() {
    // Toggle on trigger click
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-dropdown-trigger]');
      if (trigger) {
        const container = trigger.closest('[data-dropdown]');
        if (container) {
          e.preventDefault();
          toggleDropdown(container);
          return;
        }
      }

      // Click outside should close all
      const insideDropdown = e.target.closest('[data-dropdown]');
      if (!insideDropdown) closeAllDropdowns();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDropdowns();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStateSwitcher();
    initDropdowns();
  });
})();
