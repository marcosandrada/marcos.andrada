/* =======================================================
   script.js — Optimizado para scroll en móviles
======================================================= */

(function() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches || ('ontouchstart' in window);

  // -------------------------------------------------------
  // Animación inicial al cargar (Hero + Header)
  // -------------------------------------------------------
  window.addEventListener('load', () => {
    const heroElements = Array.from(document.querySelectorAll('.hero .hidden'));
    heroElements.forEach((el, i) => {
      const offsetX = (i % 2 === 0 ? -40 : 40);
      el.style.transform = `translate(${offsetX}px, 20px)`;
      el.style.opacity = '0';

      setTimeout(() => {
        const dur = isMobile ? 200 : 700; // más corto en móvil
        el.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
        el.style.transform = 'translate(0, 0)';
        el.style.opacity = '1';
      }, i * (isMobile ? 60 : 150));
    });

    const nav = document.querySelector('header nav');
    const navHidden = nav && window.getComputedStyle(nav).display === 'none';

    if (!navHidden) {
      const navLinks = Array.from(document.querySelectorAll('header nav a'));
      navLinks.forEach((link, i) => {
        link.style.transform = 'translateY(-20px)';
        link.style.opacity = '0';

        setTimeout(() => {
          const dur = isMobile ? 200 : 500;
          link.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
          link.style.transform = 'translateY(0)';
          link.style.opacity = '1';
        }, (isMobile ? 200 : 400) + i * (isMobile ? 60 : 120));
      });
    }
  });

  // -------------------------------------------------------
  // Aparición de secciones al hacer scroll
  // -------------------------------------------------------
  const sections = document.querySelectorAll('section');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          const hiddenEls = entry.target.querySelectorAll('.hidden');
          hiddenEls.forEach((el, i) => {
            setTimeout(() => el.classList.add('show'), i * (isMobile ? 50 : 120));
          });
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: isMobile ? 0.1 : 0.2,
      rootMargin: isMobile ? '0px 0px -20% 0px' : '0px'
    }
  );
  sections.forEach((sec) => sectionObserver.observe(sec));

  // -------------------------------------------------------
  // Footer: aparece al entrar en viewport
  // -------------------------------------------------------
  const footer = document.querySelector('footer.hidden');
  if (footer) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            footerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: isMobile ? 0.1 : 0.2 }
    );
    footerObserver.observe(footer);
  }

  // -------------------------------------------------------
  // Skills: animación de barras + contador numérico
  // -------------------------------------------------------
  const skillFills = document.querySelectorAll('.progress-fill');

  function animateCounter(el, target) {
    let count = 0;
    const targetValue = parseInt(target, 10);
    const stepInc = isMobile ? Math.max(3, Math.ceil(targetValue / 30)) : 1;

    const step = () => {
      count += stepInc;
      if (count > targetValue) count = targetValue;
      el.textContent = count + '%';
      if (count < targetValue) requestAnimationFrame(step);
    };
    step();
  }

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const width = fill.getAttribute('data-width');
          setTimeout(() => {
            fill.style.width = width;
            animateCounter(fill, width);
          }, isMobile ? 40 : 0);
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: isMobile ? 0.3 : 0.5 }
  );

  skillFills.forEach((fill) => {
    fill.style.width = '0%';
    fill.textContent = '0%';
    skillObserver.observe(fill);
  });

  // -------------------------------------------------------
  // Modal para el Proyecto #3
  // -------------------------------------------------------
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('close-modal');
  const project3 = document.querySelector('.project-3');

  function handleEscape(e) {
    if (e.key === 'Escape') {
      hideModal();
    }
  }

  function showModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
  }

  function hideModal() {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscape);
  }

  if (project3) {
    project3.addEventListener('click', showModal);
    project3.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showModal();
      }
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal();
      }
    });
  }

  // -------------------------------------------------------
  // Proyectos: doble tap en móvil para ver overlay
  // -------------------------------------------------------
  const projectLinks = document.querySelectorAll('.project-card[href]');

  projectLinks.forEach(link => {
    let tapped = false;

    link.addEventListener('click', (e) => {
      if (window.matchMedia("(hover: none)").matches) {
        if (!tapped) {
          e.preventDefault();
          tapped = true;
          link.classList.add('tapped');
          setTimeout(() => {
            tapped = false;
            link.classList.remove('tapped');
          }, 1200); // menos tiempo aún en móvil
        }
      }
    });
  });
})();
