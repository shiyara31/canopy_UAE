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

  // 7. Project Modal Lightbox Gallery
  const projectModal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalActiveImg = document.getElementById('modalActiveImg');
  const modalThumbs = document.getElementById('modalThumbs');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  // Complete Project Galleries Data
  const projectGalleries = {
    'nishad-residence': {
      title: "The Nishad Residence",
      category: "LUXURY RESIDENTIAL",
      subtitle: "Bespoke Villa Architectural Interior & Turnkey Fit-Out (19 Photos)",
      images: [
        'images/nishad/LIVING.png',
        'images/nishad/LIVING 2.png',
        'images/nishad/LIVING 3.png',
        'images/nishad/DINING.png',
        'images/nishad/DINING1.png',
        'images/nishad/kitchen.jpg',
        'images/nishad/master.jpg',
        'images/nishad/bedroom 3.jpg',
        'images/nishad/kids room.jpg',
        'images/nishad/ladies living.jpg',
        'images/nishad/enhanced_e.png',
        'images/nishad/enhanced_F.png',
        'images/nishad/nishad.png',
        'images/nishad/nishad1.png',
        'images/nishad/1.jpg',
        'images/nishad/2.jpg',
        'images/nishad/13.jpg',
        'images/nishad/14.jpg',
        'images/nishad/15.jpg'
      ]
    },
    'sameer-residence': {
      title: "The Sameer Residence",
      category: "LUXURY RESIDENTIAL",
      subtitle: "Bespoke Villa Architectural Interior & Turnkey Fit-Out (48 Photos)",
      images: [
        'images/sameer/m1.jpg',
        'images/sameer/m2.jpg',
        'images/sameer/m3.jpg',
        'images/sameer/b0.jpg',
        'images/sameer/b00.jpg',
        'images/sameer/b1.jpg',
        'images/sameer/b11.jpg',
        'images/sameer/b2.jpg',
        'images/sameer/b22.jpg',
        'images/sameer/k1.jpg',
        'images/sameer/k2.jpg',
        'images/sameer/l.jpg',
        'images/sameer/f.jpg',
        'images/sameer/whatsapp1.jpeg',
        'images/sameer/whatsapp2.jpeg',
        'images/sameer/whatsapp3.jpeg',
        'images/sameer/whatsapp4.jpeg',
        'images/sameer/whatsapp5.jpeg',
        'images/sameer/2.jpg',
        'images/sameer/3.jpg',
        'images/sameer/4.jpg',
        'images/sameer/5.jpg',
        'images/sameer/6.jpg',
        'images/sameer/7.jpg',
        'images/sameer/8.jpg',
        'images/sameer/9.jpg',
        'images/sameer/10.jpg',
        'images/sameer/11.jpg',
        'images/sameer/12.jpg',
        'images/sameer/13.jpg',
        'images/sameer/14.jpg',
        'images/sameer/15.jpg',
        'images/sameer/16.jpg',
        'images/sameer/17.jpg',
        'images/sameer/18.jpg',
        'images/sameer/19.jpg',
        'images/sameer/20.jpg',
        'images/sameer/21.jpg',
        'images/sameer/22.jpg',
        'images/sameer/23.jpg',
        'images/sameer/24.jpg',
        'images/sameer/25.jpg',
        'images/sameer/26.jpg',
        'images/sameer/27.jpg',
        'images/sameer/28.jpg',
        'images/sameer/29.jpg',
        'images/sameer/30.jpg',
        'images/sameer/31.jpg'
      ]
    },
    'khader-residence': {
      title: "The Khader Residence",
      category: "LUXURY RESIDENTIAL",
      subtitle: "Bespoke Villa Architectural Interior & Turnkey Fit-Out (70 Photos)",
      images: [
        'images/khader/1.webp',
        'images/khader/2.jpg',
        'images/khader/3.jpg',
        'images/khader/4.jpg',
        'images/khader/5.jpg',
        'images/khader/6.jpg',
        'images/khader/7.jpg',
        'images/khader/8.jpg',
        'images/khader/9.jpg',
        'images/khader/10.webp',
        'images/khader/11.webp',
        'images/khader/12.webp',
        'images/khader/13.webp',
        'images/khader/14.webp',
        'images/khader/15.webp',
        'images/khader/16.webp',
        'images/khader/17.webp',
        'images/khader/18.webp',
        'images/khader/19.jpg',
        'images/khader/20.jpg',
        'images/khader/21.jpg',
        'images/khader/22.jpg',
        'images/khader/23.jpg',
        'images/khader/24.jpg',
        'images/khader/25.jpg',
        'images/khader/26.jpg',
        'images/khader/27.jpg',
        'images/khader/28.jpg',
        'images/khader/29.jpg',
        'images/khader/30.jpg',
        'images/khader/31.jpg',
        'images/khader/32.jpg',
        'images/khader/33.jpg',
        'images/khader/34.jpg',
        'images/khader/35.jpg',
        'images/khader/36.jpg',
        'images/khader/37.jpg',
        'images/khader/38.jpg',
        'images/khader/39.jpg',
        'images/khader/40.jpg',
        'images/khader/41.jpg',
        'images/khader/42.jpg',
        'images/khader/43.jpg',
        'images/khader/44.jpg',
        'images/khader/45.jpg',
        'images/khader/46.jpg',
        'images/khader/47.jpg',
        'images/khader/48.jpg',
        'images/khader/49.jpg',
        'images/khader/50.jpg',
        'images/khader/51.jpg',
        'images/khader/52.jpg',
        'images/khader/53.jpg',
        'images/khader/54.jpg',
        'images/khader/55.jpg',
        'images/khader/56.jpg',
        'images/khader/57.jpg',
        'images/khader/58.jpg',
        'images/khader/59.jpg',
        'images/khader/60.jpg',
        'images/khader/61.jpg',
        'images/khader/62.jpg',
        'images/khader/63.jpg',
        'images/khader/64.jpg',
        'images/khader/65.jpg',
        'images/khader/66.jpg',
        'images/khader/67.jpg',
        'images/khader/68.jpg',
        'images/khader/69.jpg',
        'images/khader/70.jpg'
      ]
    },
    'nazar-residence': {
      title: "The Nazar Residence",
      category: "LUXURY RESIDENTIAL",
      subtitle: "Bespoke Villa Architectural Interior & Turnkey Fit-Out (35 Photos)",
      images: [
        'images/nazar/living.webp',
        'images/nazar/living01.webp',
        'images/nazar/livng 02.webp',
        'images/nazar/livng 022.webp',
        'images/nazar/living formal.webp',
        'images/nazar/living formal01.webp',
        'images/nazar/livng forml 03.webp',
        'images/nazar/fliving.webp',
        'images/nazar/formal02.webp',
        'images/nazar/double height.webp',
        'images/nazar/dining.webp',
        'images/nazar/ding table.webp',
        'images/nazar/dining01.webp',
        'images/nazar/kitchen.webp',
        'images/nazar/kitchen01.webp',
        'images/nazar/kitchen02.webp',
        'images/nazar/kitchen 03.webp',
        'images/nazar/wrk area.webp',
        'images/nazar/hall.webp',
        'images/nazar/hall1.webp',
        'images/nazar/kids.webp',
        'images/nazar/library.webp',
        'images/nazar/basin.webp',
        'images/nazar/light.webp',
        'images/nazar/door.webp',
        'images/nazar/door02.webp',
        'images/nazar/door025.webp',
        'images/nazar/gate.webp',
        'images/nazar/gate1.webp',
        'images/nazar/mirror.webp',
        'images/nazar/mirror01.webp',
        'images/nazar/mirror022.webp',
        'images/nazar/outdoor.webp',
        'images/nazar/outdoor01.webp',
        'images/nazar/02.webp'
      ]
    },
    'executive-office': {
      title: "Executive Office Fit-Out",
      category: "OFFICE & COMMERCIAL",
      subtitle: "Acoustic Glass Partitions & Corporate Workspaces (5 Photos)",
      images: [
        'images/office_glass_fitout1.jpg',
        'images/office_glass_fitout2.jpg',
        'images/office_glass_fitout3.jpg',
        'images/office_glass_fitout4.jpg',
        'images/office_glass_fitout5.jpg'
      ]
    },
    'commercial-retail': {
      title: "Bespoke Retail & Café Fit-Out",
      category: "COMMERCIAL & RETAIL",
      subtitle: "Bespoke Boutique Retail, Salons & Commercial Spaces",
      images: [
        'images/service_retail.jpg'
      ]
    },
    'custom-joinery': {
      title: "Custom Joinery & Millwork",
      category: "RESIDENTIAL & COMMERCIAL JOINERY",
      subtitle: "Precision Architectural Millwork, Kitchens & Wardrobes",
      images: [
        'images/service_joinery.jpg'
      ]
    }
  };

  if (projectModal) {
    let currentGalleryImages = [];
    const modalGridGallery = document.getElementById('modalGridGallery');
    const photoZoomOverlay = document.getElementById('photoZoomOverlay');
    const zoomImage = document.getElementById('zoomImage');
    const zoomClose = document.getElementById('zoomClose');

    const openProjectGallery = (key) => {
      const data = projectGalleries[key] || projectGalleries['nishad-residence'];
      currentGalleryImages = data.images;

      if (modalCategory) modalCategory.textContent = data.category;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalSubtitle) modalSubtitle.textContent = `Click any photo to enlarge (${currentGalleryImages.length} Photos)`;

      // Render ALL photos together in grid
      if (modalGridGallery) {
        modalGridGallery.innerHTML = '';
        currentGalleryImages.forEach((imgSrc, idx) => {
          const card = document.createElement('div');
          card.className = 'modal-photo-card';
          card.innerHTML = `<img src="${imgSrc}" alt="Project Photo ${idx + 1}" loading="lazy">`;
          card.addEventListener('click', () => {
            if (zoomImage && photoZoomOverlay) {
              zoomImage.src = imgSrc;
              photoZoomOverlay.classList.add('active');
            }
          });
          modalGridGallery.appendChild(card);
        });
      }

      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeProjectModal = () => {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    const closeZoomOverlay = () => {
      if (photoZoomOverlay) photoZoomOverlay.classList.remove('active');
    };

    if (modalClose) modalClose.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
    if (zoomClose) zoomClose.addEventListener('click', closeZoomOverlay);
    if (photoZoomOverlay) {
      photoZoomOverlay.addEventListener('click', (e) => {
        if (e.target === photoZoomOverlay || e.target === zoomClose) {
          closeZoomOverlay();
        }
      });
    }

    // Attach click triggers to all cards with data-project
    document.querySelectorAll('[data-project]').forEach(card => {
      card.addEventListener('click', () => {
        const projectKey = card.getAttribute('data-project');
        openProjectGallery(projectKey);
      });
    });
  }
});



