document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Overlay
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });

    const closeMobileMenu = () => {
      mobileMenu.classList.remove('active');
    };

    if (menuClose) menuClose.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
  }

  // 4. Featured Projects Horizontal Side-by-Side Scroll & Drag
  const wrapper = document.querySelector('.projects-carousel-wrapper');
  const dotsContainer = document.getElementById('carouselDots');

  if (wrapper) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse drag scrolling
    wrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      wrapper.classList.add('active-drag');
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
    });

    wrapper.addEventListener('mouseleave', () => {
      isDown = false;
      wrapper.classList.remove('active-drag');
    });

    wrapper.addEventListener('mouseup', () => {
      isDown = false;
      wrapper.classList.remove('active-drag');
    });

    wrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      wrapper.scrollLeft = scrollLeft - walk;
    });

    // Update active dot on scroll & dot click scrolling
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot');
      const cardWidth = 364; // 340px card width + 24px gap

      wrapper.addEventListener('scroll', () => {
        const activeIndex = Math.round(wrapper.scrollLeft / cardWidth);
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      });

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          wrapper.scrollTo({
            left: idx * cardWidth,
            behavior: 'smooth'
          });
        });
      });
    }
  }

  // 5. Stat Counter Animation
  const statCounters = document.querySelectorAll('.stat-counter');
  if (statCounters.length > 0) {
    let animated = false;
    const animateCounters = () => {
      statCounters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.ceil(current);
          }
        }, stepTime);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  // 6. Projects Gallery Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-gallery-item');

  if (filterBtns.length > 0 && projectItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
});

