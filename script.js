
const EMAILJS_PUBLIC_KEY  = 'llFuBeXc-wFBbEgQP';   
const EMAILJS_SERVICE_ID  = 'service_mtlvtp7';    
const EMAILJS_TEMPLATE_ID = 'template_lb55e97';   


document.addEventListener('DOMContentLoaded', () => {

  
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  // ── Theme Toggle ──
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');

  // Load saved preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  // ── Mobile Hamburger ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });

  // ── Scroll Reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Apply reveal to main content blocks
  const revealSelectors = [
    '.about-grid', '.about-edu .edu-item',
    '.skill-group', '.dsa-banner',
    '.project-card', '.cert-card',
    '.contact-card', '.hero-stats .stat'
  ];

  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.07}s`;
      observer.observe(el);
    });
  });

  // ── Active Nav Link on Scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => navObserver.observe(s));

  // ── Navbar shadow on scroll ──
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 2px 24px rgba(0,0,0,0.18)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });

  // ── Smooth number counter for hero stats ──
  const counters = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace(/\D/g, '');
        const suffix = el.textContent.replace(/[\d]/g, '');
        const target = parseInt(raw);
        if (!target) return;

        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 30);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ── Contact Form — EmailJS ──
  const sendBtn   = document.getElementById('sendBtn');
  const cfSuccess = document.getElementById('cfSuccess');
  const cfError   = document.getElementById('cfError');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {

      // Grab field values
      const nameVal    = document.getElementById('cfName')?.value.trim();
      const emailVal   = document.getElementById('cfEmail')?.value.trim();
      const subjectVal = document.getElementById('cfSubject')?.value.trim();
      const msgVal     = document.getElementById('cfMessage')?.value.trim();

      // Hide any previous feedback
      cfSuccess.classList.remove('show');
      cfError.classList.remove('show');

      // Validate required fields (marked with *)
      let valid = true;
      [
        { id: 'cfName',    val: nameVal  },
        { id: 'cfEmail',   val: emailVal },
        { id: 'cfMessage', val: msgVal   }
      ].forEach(({ id, val }) => {
        const el = document.getElementById(id);
        if (!val) {
          el.style.borderBottomColor = '#ff6b6b';
          valid = false;
        } else {
          el.style.borderBottomColor = '';
        }
      });

      if (!valid) return;

      // Send via EmailJS
      sendBtn.textContent = 'SENDING...';
      sendBtn.disabled = true;

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  nameVal,
        from_email: emailVal,
        subject:    subjectVal || 'Portfolio Contact',
        message:    msgVal,
        reply_to:   emailVal
      })
      .then(() => {
        sendBtn.textContent = 'SENT ✓';
        cfSuccess.classList.add('show');
        
        ['cfName', 'cfEmail', 'cfSubject', 'cfMessage'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
       
        setTimeout(() => {
          sendBtn.textContent = 'SEND MESSAGE \u2192';
          sendBtn.disabled = false;
        }, 4000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        sendBtn.textContent = 'SEND MESSAGE \u2192';
        sendBtn.disabled = false;
        cfError.classList.add('show');
      });

    });
  }

}); 
