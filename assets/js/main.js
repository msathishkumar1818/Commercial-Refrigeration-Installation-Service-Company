/**
 * ARCTICPRO COMMERCIAL REFRIGERATION
 * Shared Master Script (assets/js/main.js)
 * Clean Vanilla JS - Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initRtl();
  initHomeDropdown();
  initMobileDrawer();
  initScrollToTop();
  highlightActiveNav();
  initContactForm();
  initDashboard();
});

/* -------------------------------------------------------------------------
   1. Branded Page Loader
   ------------------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('loaded');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 450);
  };

  // Dismiss on window load or safe fallback
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 200);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 200));
    setTimeout(hideLoader, 1500); // Fail-safe
  }
}

/* -------------------------------------------------------------------------
   2. Dark Mode Engine (Pure #000000)
   ------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('arctic_theme') || 'dark'; // Defaulting to sleek dark for refrigeration tech

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('arctic_theme', theme);
  };

  applyTheme(savedTheme);

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
  });
}

/* -------------------------------------------------------------------------
   3. RTL / LTR Direction Engine
   ------------------------------------------------------------------------- */
function initRtl() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const savedDir = localStorage.getItem('arctic_dir') || 'ltr';

  const applyDirection = (dir) => {
    document.documentElement.dir = dir;
    localStorage.setItem('arctic_dir', dir);
  };

  applyDirection(savedDir);

  rtlToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.dir || 'ltr';
      applyDirection(currentDir === 'ltr' ? 'rtl' : 'ltr');
    });
  });
}

/* -------------------------------------------------------------------------
   4. Desktop Home Dropdown (CLICK ONLY - Never Hover)
   ------------------------------------------------------------------------- */
function initHomeDropdown() {
  const homeDropdownWrapper = document.getElementById('homeDropdownWrapper');
  const homeDropdownBtn = document.getElementById('homeDropdownBtn');

  if (!homeDropdownWrapper || !homeDropdownBtn) return;

  homeDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = homeDropdownWrapper.classList.contains('dropdown-open');
    if (isOpen) {
      homeDropdownWrapper.classList.remove('dropdown-open');
      homeDropdownBtn.setAttribute('aria-expanded', 'false');
    } else {
      homeDropdownWrapper.classList.add('dropdown-open');
      homeDropdownBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!homeDropdownWrapper.contains(e.target)) {
      homeDropdownWrapper.classList.remove('dropdown-open');
      homeDropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && homeDropdownWrapper.classList.contains('dropdown-open')) {
      homeDropdownWrapper.classList.remove('dropdown-open');
      homeDropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* -------------------------------------------------------------------------
   5. Mobile Drawer & Mobile Accordion
   ------------------------------------------------------------------------- */
function initMobileDrawer() {
  const openBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const homeAccordionItem = document.getElementById('mobileHomeAccordion');
  const homeAccordionBtn = document.getElementById('mobileHomeAccordionBtn');

  if (!drawer || !overlay) return;

  // Determine if current page is Home 1 or Home 2
  const currentPath = window.location.pathname.toLowerCase();
  const isHome1 = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
  const isHome2 = currentPath.endsWith('home-2.html');
  const isHomePage = isHome1 || isHome2 || (homeAccordionItem && homeAccordionItem.querySelector('.mobile-sub-link.active') !== null);

  // Home button highlights if on Home page, but dropdown starts automatically closed
  if (homeAccordionItem) {
    homeAccordionItem.classList.remove('open');
  }
  if (homeAccordionBtn) {
    if (isHomePage) {
      homeAccordionBtn.classList.add('active');
    } else {
      homeAccordionBtn.classList.remove('active');
    }
  }

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    // Lock both html and body to completely prevent background and header scrolling
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Must be automatically closed on drawer open - only opens when user clicks Home
    if (homeAccordionItem) {
      homeAccordionItem.classList.remove('open');
    }
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';

    // Automatically close Home accordion on drawer close
    if (homeAccordionItem) {
      homeAccordionItem.classList.remove('open');
    }
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Home Accordion inside mobile drawer (CLICK ONLY - opens only when clicked)
  if (homeAccordionItem && homeAccordionBtn) {
    homeAccordionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      homeAccordionItem.classList.toggle('open');
    });
  }

  // Mandatory Rule: Clicking ANY navigation link MUST close mobile drawer
  const allNavLinks = drawer.querySelectorAll('a');
  allNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Guarantee drawer and overlay start closed initially
  closeDrawer();

  // Auto-close mobile drawer when window is resized to desktop (>1200px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1200) {
      closeDrawer();
    }
  });

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* -------------------------------------------------------------------------
   6. Scroll To Top Button
   ------------------------------------------------------------------------- */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* -------------------------------------------------------------------------
   7. Active Navigation Link Highlighting
   ------------------------------------------------------------------------- */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .nav-dropdown-menu .dropdown-item, .mobile-nav-list a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop();

    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');

      // If active link is inside desktop Home dropdown
      if (link.classList.contains('dropdown-item')) {
        const homeBtn = document.getElementById('homeDropdownBtn');
        if (homeBtn) homeBtn.classList.add('active');
      }
    }
  });
}

/* -------------------------------------------------------------------------
   8. Contact & Emergency Ticket Form
   ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('serviceTicketForm');
  const successMsg = document.getElementById('formSuccessMsg');
  if (!form || !successMsg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.style.display = 'flex';
    form.reset();
    setTimeout(() => {
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  });
}

/* -------------------------------------------------------------------------
   9. Client Dashboard Interactivity Engine
   ------------------------------------------------------------------------- */
function initDashboard() {
  // 1. Tab Switching
  const navBtns = document.querySelectorAll('.dash-nav-link[data-tab]');
  const panels = document.querySelectorAll('.dash-panel');
  const switchLinks = document.querySelectorAll('[data-tab-switch]');

  const activateTab = (tabId) => {
    navBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === tabId);
    });
  };

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) {
        activateTab(tabId);
        // On mobile, close sidebar automatically
        const sidebar = document.getElementById('dashSidebar');
        const overlay = document.getElementById('dashSidebarOverlay');
        if (sidebar && overlay) {
          sidebar.classList.remove('sidebar-open');
          overlay.classList.remove('active');
        }
      }
    });
  });

  switchLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab-switch');
      if (tabId) activateTab(tabId);
    });
  });

  // 2. Mobile Sidebar Drawer Toggle
  const sidebarToggle = document.getElementById('dashSidebarToggle');
  const sidebar = document.getElementById('dashSidebar');
  const sidebarOverlay = document.getElementById('dashSidebarOverlay');

  if (sidebarToggle && sidebar && sidebarOverlay) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
      sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('sidebar-open');
      sidebarOverlay.classList.remove('active');
    });
  }

  // 3. Quick Schedule Modal
  const openModalBtn = document.getElementById('openScheduleModalBtn');
  const closeModalBtn = document.getElementById('closeScheduleModalBtn');
  const modalBackdrop = document.getElementById('scheduleModalBackdrop');
  const quickScheduleForm = document.getElementById('quickScheduleForm');

  if (openModalBtn && modalBackdrop) {
    openModalBtn.addEventListener('click', () => {
      modalBackdrop.classList.add('open');
    });
  }

  if (closeModalBtn && modalBackdrop) {
    closeModalBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });
  }

  if (quickScheduleForm && modalBackdrop) {
    quickScheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Maintenance visit request submitted to ArcticPro 24/7 Dispatch!');
      quickScheduleForm.reset();
      modalBackdrop.classList.remove('open');
    });
  }

  // 4. In-Page Maintenance Schedule Form
  const schedForm = document.getElementById('scheduleVisitForm');
  const schedSuccess = document.getElementById('schedSuccessMsg');
  if (schedForm && schedSuccess) {
    schedForm.addEventListener('submit', (e) => {
      e.preventDefault();
      schedSuccess.style.display = 'flex';
      schedForm.reset();
    });
  }
}
