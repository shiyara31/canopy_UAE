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

  // 3. Scroll to Discover Button
  const scrollBtn = document.getElementById('scrollBtn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const target = document.getElementById('services');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 4. Featured Projects Carousel Track
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');
  const dotsContainer = document.getElementById('carouselDots');
  
  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.project-card');
    const cardWidth = 340 + 24; // card width + gap
    let currentIndex = 0;
    const maxIndex = cards.length - 1;

    const updateCarousel = (index) => {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      
      // Update active dot
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    };

    prevBtn.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          updateCarousel(idx);
        });
      });
    }
  }
});
