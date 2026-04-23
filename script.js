/* =========================================================
   MAN INTENSE FORCE — script.js
   Vanilla JS: Particles, Navbar, FAQ, Scroll Animations
   ========================================================= */

(function () {
  'use strict';

  /* ── 1. PARTICLES ── */
  (function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];
    const COUNT = 80;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -(Math.random() * 0.4 + 0.1),
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      };
    }

    function initParticlesArray() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticle(p) {
      p.pulse += p.pulseSpeed;
      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 224, 255, ${alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(0, 224, 255, 0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        drawParticle(p);
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) {
          Object.assign(p, createParticle());
          p.y = H + 10;
        }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
      });
      requestAnimationFrame(animate);
    }

    resize();
    initParticlesArray();
    animate();
    window.addEventListener('resize', () => {
      resize();
      initParticlesArray();
    });
  })();

  /* ── 2. NAVBAR ── */
  (function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (!navbar) return;

    // Scroll class
    function onScroll() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile toggle
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
      });

      // Close on link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
        });
      });
    }
  })();

  /* ── 3. SMOOTH SCROLL ── */
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  })();

  /* ── 4. SCROLL REVEAL ── */
  (function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-right');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Stagger children inside grids
            const siblings = entry.target.closest('.pain-grid, .benefits-grid, .ingredients-grid, .testi-grid, .pricing-grid, .faq-list, .comparison-grid, .hero-inner');
            if (siblings) {
              const all = siblings.querySelectorAll(':scope > .reveal, :scope > * > .reveal');
              let delay = 0;
              all.forEach(el => {
                if (!el.classList.contains('visible')) {
                  setTimeout(() => el.classList.add('visible'), delay);
                  delay += 80;
                }
              });
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  })();

  /* ── 5. FAQ ACCORDION ── */
  (function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-q');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        faqItems.forEach(i => i.classList.remove('open'));

        // Open this one if it was closed
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  })();

  /* ── 6. ACTIVE NAV LINK (scroll spy) ── */
  (function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const navH = 80;

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - navH - 20) {
          current = sec.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active-link');
        }
      });
    }, { passive: true });
  })();

  /* ── 7. HERO PARALLAX (subtle) ── */
  (function initParallax() {
    const heroBg = document.querySelector('.hero-bg-glow');
    const heroBeam = document.querySelector('.hero-beam');
    if (!heroBg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (heroBg) heroBg.style.transform = `translateY(${y * 0.15}px)`;
          if (heroBeam) heroBeam.style.opacity = Math.max(0, 0.3 - y * 0.001);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ── 8. BUTTON RIPPLE ── */
  (function initRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position:absolute;
          left:${x}px;top:${y}px;
          width:0;height:0;
          border-radius:50%;
          background:rgba(255,255,255,0.25);
          transform:translate(-50%,-50%);
          animation:ripple-anim 0.6s ease-out forwards;
          pointer-events:none;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });

    // Add ripple keyframe
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple-anim {
        to { width: 200px; height: 200px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  })();

  /* ── 9. COUNTER ANIMATION ── */
  (function initCounters() {
    const counters = document.querySelectorAll('.stat strong');
    const animated = new Set();

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated.has(entry.target)) {
          animated.add(entry.target);
          const el = entry.target;
          const text = el.textContent.trim();
          const match = text.match(/^(\d+)/);
          if (!match) return;

          const target = parseInt(match[1]);
          const suffix = text.replace(/^\d+/, '');
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  })();

  /* ── 10. RING CHART ANIMATION ── */
  (function initRing() {
    const ring = document.querySelector('.ring-progress');
    if (!ring) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        ring.style.transition = 'stroke-dashoffset 1.5s ease, stroke-dasharray 1.5s ease';
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    const parent = ring.closest('.stat-ring');
    if (parent) observer.observe(parent);
  })();

  console.log('%cMAN INTENSE FORCE — Initialized', 'color:#00E0FF;font-family:monospace;font-size:14px;font-weight:bold;text-shadow:0 0 10px #00E0FF');
})();
