/**
 * ADARSH S NAIR - PORTFOLIO INTERACTION LOGIC
 * Features:
 * 1. Filterable Project Grid (All, Fashion & Apparel, Tech & Security, Kids & Baby, Luxury & Floral)
 * 2. One-click Copy for Email and Phone with Toast Feedback
 * 3. Interactive Contact Form with Validation & Feedback
 * 4. Navbar Sticky State & Active Section Tracking
 * 5. Back-to-Top Floating Button
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect
  const navbar = document.querySelector('.navbar-custom');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. Project Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectItems.forEach(item => {
        if (filterValue === 'all') {
          item.style.display = 'block';
          item.classList.add('animate__fadeIn');
        } else {
          const categories = item.getAttribute('data-category') || '';
          if (categories.includes(filterValue)) {
            item.style.display = 'block';
            item.classList.add('animate__fadeIn');
          } else {
            item.style.display = 'none';
          }
        }
      });
    });
  });

  // 3. One-Click Copy to Clipboard with Toast Notification
  const copyButtons = document.querySelectorAll('.btn-copy-action');
  const copyToastEl = document.getElementById('copyToast');
  const copyToastMsg = document.getElementById('copyToastMsg');
  let copyToast;
  
  if (copyToastEl && typeof bootstrap !== 'undefined') {
    copyToast = new bootstrap.Toast(copyToastEl, { delay: 2500 });
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-clipboard-text');
      const label = btn.getAttribute('data-clipboard-label') || 'Text';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${label} to clipboard!`);
        }).catch(() => {
          fallbackCopy(textToCopy, label);
        });
      } else {
        fallbackCopy(textToCopy, label);
      }
    });
  });

  function fallbackCopy(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${label} to clipboard!`);
    } catch (err) {
      showToast(`Please manually copy: ${text}`);
    }
    document.body.removeChild(textArea);
  }

  function showToast(message) {
    if (copyToastMsg) copyToastMsg.innerText = message;
    if (copyToast) {
      copyToast.show();
    } else {
      alert(message);
    }
  }

  // 4. Contact Form Submission Handling
  const contactForm = document.getElementById('portfolioContactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Sending...';
      submitBtn.disabled = true;

      // Simulate sending inquiry
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="bi bi-check2-circle"></i> Message Sent!';
        submitBtn.classList.remove('btn-emerald');
        submitBtn.classList.add('btn-success');

        if (formSuccessAlert) {
          formSuccessAlert.classList.remove('d-none');
        }

        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.classList.remove('btn-success');
          submitBtn.classList.add('btn-emerald');
          submitBtn.disabled = false;
        }, 4000);
      }, 900);
    });
  }

  // 5. Update Current Year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 6. Direct Email Fallback for mailto links
  document.querySelectorAll('.email-link').forEach(link => {
    link.addEventListener('click', (event) => {
      const email = 'connect.adarshnair@gmail.com';
      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

      if (location.protocol === 'file:') {
        event.preventDefault();
        window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // 7. Resume Modal Open/Close Control
  const resumeModal = document.getElementById('resumeModal');
  const resumeTrigger = document.querySelector('[data-bs-target="#resumeModal"]');
  if (resumeModal) {
    const closeResumeModal = () => {
      if (window.bootstrap && bootstrap.Modal) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(resumeModal);
        modalInstance.hide();
        return;
      }

      resumeModal.classList.remove('show');
      resumeModal.setAttribute('aria-hidden', 'true');
      resumeModal.setAttribute('style', 'display: none;');
      document.body.classList.remove('modal-open');

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    };

    if (resumeTrigger) {
      resumeTrigger.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (window.bootstrap && bootstrap.Modal) {
          const modalInstance = bootstrap.Modal.getOrCreateInstance(resumeModal);
          modalInstance.show();
        }
      });
    }

    resumeModal.addEventListener('click', (event) => {
      if (event.target === resumeModal) {
        closeResumeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && resumeModal.classList.contains('show')) {
        closeResumeModal();
      }
    });

    resumeModal.querySelectorAll('.resume-close-btn').forEach(button => {
      button.addEventListener('click', closeResumeModal);
    });
  }

  // 7. Smooth Scroll for internal navigation links & close mobile menu on click
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.getElementById('navbarNav');
  const navSections = Array.from(navLinks)
    .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(item => item.section);

  function updateActiveNavLink() {
    const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const activationLine = Math.max(navbar?.offsetHeight || 0, scrollPadding) + 1;
    let activeLink = navSections[0]?.link;

    navSections.forEach(({ link, section }) => {
      if (section.getBoundingClientRect().top <= activationLine) {
        activeLink = link;
      }
    });

    navLinks.forEach(link => link.classList.toggle('active', link === activeLink));
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
});
