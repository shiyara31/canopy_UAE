document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect & Top Progress Bar
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && scrollProgress) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
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

  // 3. Desktop Services Context Menu Dropdown
  const dropdownBtns = document.querySelectorAll('.nav-dropdown-btn');

  dropdownBtns.forEach(btn => {
    const container = btn.closest('.nav-dropdown-container');
    if (!container) return;
    const menu = container.querySelector('.services-context-menu');
    if (!menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close any other open context menus
      document.querySelectorAll('.services-context-menu').forEach(m => m.classList.remove('active'));
      document.querySelectorAll('.nav-dropdown-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));

      if (!isExpanded) {
        btn.setAttribute('aria-expanded', 'true');
        menu.classList.add('active');
      }
    });

    const menuItems = menu.querySelectorAll('.context-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        btn.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
      });
    });
  });

  // Close context menu on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-container')) {
      document.querySelectorAll('.services-context-menu').forEach(m => m.classList.remove('active'));
      document.querySelectorAll('.nav-dropdown-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // Close context menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.services-context-menu').forEach(m => m.classList.remove('active'));
      document.querySelectorAll('.nav-dropdown-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // 4. Featured Projects Horizontal Side-by-Side Scroll & Drag (Supports multiple carousels)
  const wrappers = document.querySelectorAll('.projects-carousel-wrapper');

  wrappers.forEach(wrapper => {
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
    const dotsContainer = wrapper.querySelector('.carousel-dots');
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
  });

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

  // 6. Projects Gallery Status Tabs (Completed vs Ongoing) & Sub-Category Filters
  const statusTabs = document.querySelectorAll('.status-tab');
  const completedSubFilters = document.getElementById('completedSubFilters');
  const ongoingSubFilters = document.getElementById('ongoingSubFilters');
  const projectItems = document.querySelectorAll('.project-gallery-item');

  if (statusTabs.length > 0 && projectItems.length > 0) {
    let currentStatus = 'completed';
    let currentCompletedFilter = 'all-completed';
    let currentOngoingFilter = 'all-ongoing';

    const updateProjectVisibility = () => {
      projectItems.forEach(item => {
        const itemStatus = item.getAttribute('data-status');
        const itemCategory = item.getAttribute('data-category');

        if (itemStatus !== currentStatus) {
          item.style.display = 'none';
          return;
        }

        if (currentStatus === 'completed') {
          if (currentCompletedFilter === 'all-completed' || itemCategory === currentCompletedFilter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        } else if (currentStatus === 'ongoing') {
          if (currentOngoingFilter === 'all-ongoing' || itemCategory === currentOngoingFilter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        }
      });
    };

    // Main Status Tab Click Handler
    statusTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        statusTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        currentStatus = tab.getAttribute('data-status-tab');

        if (currentStatus === 'completed') {
          if (completedSubFilters) completedSubFilters.style.display = 'flex';
          if (ongoingSubFilters) ongoingSubFilters.style.display = 'none';
        } else {
          if (completedSubFilters) completedSubFilters.style.display = 'none';
          if (ongoingSubFilters) ongoingSubFilters.style.display = 'flex';
        }

        updateProjectVisibility();
      });
    });

    // Completed Sub-Filters Click Handler
    if (completedSubFilters) {
      const cBtns = completedSubFilters.querySelectorAll('.filter-btn');
      cBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          cBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCompletedFilter = btn.getAttribute('data-filter');
          updateProjectVisibility();
        });
      });
    }

    // Ongoing Sub-Filters Click Handler
    if (ongoingSubFilters) {
      const oBtns = ongoingSubFilters.querySelectorAll('.filter-btn');
      oBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          oBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentOngoingFilter = btn.getAttribute('data-filter');
          updateProjectVisibility();
        });
      });
    }

    // Initial Filter Run
    updateProjectVisibility();
  }

  // 6b. Home Page Featured Projects Filter Tabs
  const homeProjectFilters = document.getElementById('homeProjectFilters');
  const homeProjectCards = document.querySelectorAll('.projects-grid .project-card');

  if (homeProjectFilters && homeProjectCards.length > 0) {
    const filterBtns = homeProjectFilters.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedFilter = btn.getAttribute('data-project-filter');
        homeProjectCards.forEach(card => {
          const cardCat = card.getAttribute('data-category') || '';
          if (selectedFilter === 'all' || cardCat.includes(selectedFilter)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
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
    'exterior-architecture': {
      title: "Luxury Villa Exterior Work",
      category: "EXTERIOR & ARCHITECTURE",
      subtitle: "Bespoke Modern Villa Exteriors, Board-Formed Concrete Facades & Architecture Concepts (14 Photos)",
      images: [
        'images/exterior/5.jpg',
        'images/exterior/4.jpg',
        'images/exterior/1.jpg',
        'images/exterior/2.jpg',
        'images/exterior/3.jpg',
        'images/exterior/WhatsApp Image 2026-08-09 at 12.15.23 PM.jpeg',
        'images/exterior/WhatsApp Image 2026-08-09 at 12.15.24 PM.jpeg',
        'images/exterior/WhatsApp Image 2026-08-09 at 12.15.24 PM (1).jpeg',
        'images/exterior/WhatsApp Image 2026-08-09 at 12.15.24 PM (2).jpeg',
        'images/exterior/WhatsApp Image 2026-08-09 at 12.15.24 PM (3).jpeg',
        'images/exterior/WhatsApp Image 2026-08-09 at 12.15.24 PM (4).jpeg',
        'images/exterior/WhatsApp Image 2026-08-09 at 12.15.24 PM (5).jpeg',
        'images/exterior/WhatsApp Image 2026-08-09 at 12.15.24 PM (6).jpeg',
        'images/exterior/WhatsApp Image 2026-08-09 at 12.15.24 PM (7).jpeg'
      ]
    },
    'ongoing-projects': {
      title: "Ongoing Fit-Out & Site Progress",
      category: "ONGOING & ON-SITE EXECUTION",
      subtitle: "Behind-the-Scenes Turnkey Execution, Emaar Creek Harbour, Tilal City Sharjah, Interior & Exterior Site Progress (16 Photos)",
      images: [
        'images/ongoing/1.jpg',
        'images/ongoing/2.jpg',
        'images/ongoing/3.jpg',
        'images/ongoing/4.jpg',
        'images/ongoing/5.jpg',
        'images/ongoing/6.jpg',
        'images/ongoing/7.jpg',
        'images/ongoing/8.jpg',
        'images/ongoing/9.jpg',
        'images/ongoing/10.jpg',
        'images/ongoing/11.jpg',
        'images/ongoing/12.jpg',
        'images/ongoing/13.jpg',
        'images/ongoing/14.jpg',
        'images/ongoing/15.jpg',
        'images/ongoing/16.jpg'
      ]
    },
    'ongoing-penthouse': {
      title: "Dubai High-Rise Penthouse Fit-Out",
      category: "ON-SITE EXECUTION",
      subtitle: "Full High-Rise Interior Renovation, Panoramic Framing & Site Supervision (3 Photos)",
      images: [
        'images/ongoing/3.jpg',
        'images/ongoing/2.jpg',
        'images/ongoing/4.jpg'
      ]
    },
    'ongoing-factory': {
      title: "Custom Marble & Joinery Workshop",
      category: "FACTORY CRAFTSMANSHIP",
      subtitle: "In-House Precision Millwork, Marble Cutting & Edge Polishing",
      images: [
        'images/ongoing/1.jpg'
      ]
    },
    'ongoing-framing': {
      title: "Acoustic Framing & Electrical MEP",
      category: "SITE FRAMING & MEP",
      subtitle: "Structural Metal Partitioning, Ceiling Grid Setup & Cable Channelling",
      images: [
        'images/ongoing/2.jpg',
        'images/ongoing/4.jpg'
      ]
    },
    'ongoing-assembly': {
      title: "Bespoke Furniture Installation",
      category: "ON-SITE ASSEMBLY",
      subtitle: "Custom Bed Frame & Luxury Furniture On-Site Fitting",
      images: [
        'images/ongoing/5.jpg',
        'images/ongoing/6.jpg'
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
    'shabana-residence': {
      title: "The Shabana Residence (Ajman)",
      category: "LUXURY RESIDENTIAL",
      subtitle: "Bespoke Modern Villa Fit-Out & Architectural Interior (22 Photos)",
      images: [
        'images/shabana/1.jpeg',
        'images/shabana/2.jpeg',
        'images/shabana/3.jpeg',
        'images/shabana/4.jpeg',
        'images/shabana/5.jpeg',
        'images/shabana/6.jpeg',
        'images/shabana/7.jpeg',
        'images/shabana/8.jpeg',
        'images/shabana/9.jpeg',
        'images/shabana/10.jpeg',
        'images/shabana/11.jpeg',
        'images/shabana/12.jpeg',
        'images/shabana/13.jpeg',
        'images/shabana/14.jpeg',
        'images/shabana/15.jpeg',
        'images/shabana/16.jpeg',
        'images/shabana/17.jpeg',
        'images/shabana/18.jpeg',
        'images/shabana/19.jpeg',
        'images/shabana/20.jpeg',
        'images/shabana/21.jpeg',
        'images/shabana/22.jpeg'
      ]
    },
    'arada-masaar': {
      title: "Arada Masaar Luxury Villa",
      category: "LUXURY RESIDENTIAL",
      subtitle: "Signature Private Sanctuary Interior & Millwork (10 Photos)",
      images: [
        'images/arada/2.jfif',
        'images/arada/3.jfif',
        'images/arada/4.jfif',
        'images/arada/5.jfif',
        'images/arada/6.jfif',
        'images/arada/8.jfif',
        'images/arada/9.jfif',
        'images/arada/10.jfif',
        'images/arada/11.jfif',
        'images/arada/12.jfif'
      ]
    },
    'adnoc-office': {
      title: "ADNOC Headquarters Fit-Out",
      category: "OFFICE & COMMERCIAL",
      subtitle: "Corporate Fit-Out, Architectural Lighting & Glass Partitioning (12 Photos)",
      images: [
        'images/adnoc/1.jfif',
        'images/adnoc/2.jfif',
        'images/adnoc/3.jfif',
        'images/adnoc/4.jpg',
        'images/adnoc/5.jpg',
        'images/adnoc/6.jpg',
        'images/adnoc/7.jfif',
        'images/adnoc/8.jfif',
        'images/adnoc/9.jfif',
        'images/adnoc/10.jfif',
        'images/adnoc/11.jfif',
        'images/adnoc/12.jfif'
      ]
    },
    'ids-office': {
      title: "IDS Executive Corporate Office",
      category: "OFFICE & COMMERCIAL",
      subtitle: "Executive Workspace & Modern Acoustic Partition Suite (8 Photos)",
      images: [
        'images/ids/1.jpeg',
        'images/ids/2.jpeg',
        'images/ids/3.jpeg',
        'images/ids/4.jpeg',
        'images/ids/5.jpeg',
        'images/ids/6.jpeg',
        'images/ids/7.jpeg',
        'images/ids/8.jpeg'
      ]
    },
    'group-office-deira': {
      title: "Group Office Deira, Dubai",
      category: "OFFICE & COMMERCIAL",
      subtitle: "Corporate Office Fit-Out & Architectural Glass Work (6 Photos)",
      images: [
        'images/GOLDEN/1.jpeg',
        'images/GOLDEN/2.jpeg',
        'images/GOLDEN/3.jpeg',
        'images/GOLDEN/4.jpeg',
        'images/GOLDEN/5.jpeg',
        'images/GOLDEN/6.jpeg'
      ]
    },
    'ongoing-projects': {
      title: "Ongoing Fit-Out & Site Progress",
      category: "ON-SITE EXECUTION",
      subtitle: "Active Site Work, Joinery Installation & Precision Fit-Out (16 Photos)",
      images: [
        'images/ongoing/1.jpg',
        'images/ongoing/2.jpg',
        'images/ongoing/3.jpg',
        'images/ongoing/4.jpg',
        'images/ongoing/5.jpg',
        'images/ongoing/6.jpg',
        'images/ongoing/7.jpg',
        'images/ongoing/8.jpg',
        'images/ongoing/9.jpg',
        'images/ongoing/10.jpg',
        'images/ongoing/11.jpg',
        'images/ongoing/12.jpg',
        'images/ongoing/13.jpg',
        'images/ongoing/14.jpg',
        'images/ongoing/15.jpg',
        'images/ongoing/16.jpg'
      ]
    },
    'villa-fitout': {
      title: "Full Villa Fit-Out",
      category: "FIT-OUT SERVICES",
      subtitle: "Turnkey Luxury Villa Transformations & Detailing (48 Photos)",
      images: [
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.05 PM.jpeg',
        'images/villa fitout/1/WhatsApp Image 2026-08-09 at 12.15.23 PM.jpeg',
        'images/villa fitout/1/WhatsApp Image 2026-08-09 at 12.15.24 PM.jpeg',
        'images/villa fitout/1/WhatsApp Image 2026-08-09 at 12.15.24 PM (1).jpeg',
        'images/villa fitout/1/WhatsApp Image 2026-08-09 at 12.15.24 PM (2).jpeg',
        'images/villa fitout/1/WhatsApp Image 2026-08-09 at 12.15.24 PM (3).jpeg',
        'images/villa fitout/1/WhatsApp Image 2026-08-09 at 12.15.24 PM (4).jpeg',
        'images/villa fitout/1/WhatsApp Image 2026-08-09 at 12.15.24 PM (5).jpeg',
        'images/villa fitout/1/WhatsApp Image 2026-08-09 at 12.15.24 PM (6).jpeg',
        'images/villa fitout/1/WhatsApp Image 2026-08-09 at 12.15.24 PM (7).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.22.59 PM.jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.22.59 PM (1).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.22.59 PM (2).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.00 PM.jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.00 PM (1).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.00 PM (2).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.00 PM (3).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.02 PM.jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.02 PM (1).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.02 PM (2).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.03 PM.jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.03 PM (1).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.03 PM (2).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.04 PM.jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.04 PM (1).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.04 PM (2).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.04 PM (3).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.05 PM (1).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.05 PM (2).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.05 PM (3).jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.06 PM.jpeg',
        'images/villa fitout/2/WhatsApp Image 2026-08-09 at 12.23.06 PM (1).jpeg',
        'images/villa fitout/3/1.jfif',
        'images/villa fitout/3/2.jfif',
        'images/villa fitout/3/3.jfif',
        'images/villa fitout/3/4.jfif',
        'images/villa fitout/3/5.jfif',
        'images/villa fitout/3/6.jfif',
        'images/villa fitout/3/8.jfif',
        'images/villa fitout/3/9.jfif',
        'images/villa fitout/3/10.jfif',
        'images/villa fitout/3/11.jfif',
        'images/villa fitout/3/12.jfif',
        'images/villa fitout/5/WhatsApp Image 2026-08-06 at 9.43.42 AM.jpeg',
        'images/villa fitout/5/WhatsApp Image 2026-08-06 at 9.43.42 AM (1).jpeg',
        'images/villa fitout/5/WhatsApp Image 2026-08-06 at 9.43.42 AM (2).jpeg',
        'images/villa fitout/5/WhatsApp Image 2026-08-06 at 9.43.42 AM (3).jpeg',
        'images/villa fitout/5/WhatsApp Image 2026-08-06 at 9.43.42 AM (4).jpeg'
      ]
    },
    'office-fitout': {
      title: "Office Renovation & Commercial Fit-Out",
      category: "FIT-OUT SERVICES",
      subtitle: "Corporate Workplaces, Acoustic Partitioning, Executive Styling & Moodboards (41 Photos)",
      images: [
        'images/office/1.jpg',
        'images/office/2.jpg',
        'images/office/3.jpg',
        'images/office/4.jpg',
        'images/office/5.jpg',
        'images/office/6.jpg',
        'images/office/7.jpg',
        'images/office/8.jpg',
        'images/office/9 (1).jpg',
        'images/office/10.jpg',
        'images/office/11.jpg',
        'images/office/BAE SHOP-03.jpg',
        'images/office/BAE SHOP-04.jpg',
        'images/office/BAE SHOP-05.jpg',
        'images/office/BAE SHOP-07.jpg',
        'images/office/BAE SHOP-08.jpg',
        'images/office/BAE SHOP-09.jpg',
        'images/office/BAE SHOP-10.jpg',
        'images/office/BAE SHOP-11.jpg',
        'images/office/INTERIOR DESIGN FOR CHOICE POINT @ DUBAI - CANOPY COMPANY-6.jpg',
        'images/office/MOODBOARD EMVOLT ELECTROMECHANICAL WORKS LLC -𝗨𝗔E-2.jpg',
        'images/office/MOODBOARD EMVOLT ELECTROMECHANICAL WORKS LLC -𝗨𝗔E-3.jpg',
        'images/office/MOODBOARD EMVOLT ELECTROMECHANICAL WORKS LLC -𝗨𝗔E-4.jpg',
        'images/office/MOODBOARD EMVOLT ELECTROMECHANICAL WORKS LLC -𝗨𝗔E-5.jpg',
        'images/office/MOODBOARD EMVOLT ELECTROMECHANICAL WORKS LLC -𝗨𝗔E-6.jpg',
        'images/office/MOODBOARD EMVOLT ELECTROMECHANICAL WORKS LLC -𝗨𝗔E-7.jpg',
        'images/office/WhatsApp Image 2026-08-15 at 11.13.27 PM (1).jpeg',
        'images/office/WhatsApp Image 2026-08-15 at 11.13.27 PM (2).jpeg',
        'images/office/WhatsApp Image 2026-08-15 at 11.27.33 PM.jpeg',
        'images/office/WhatsApp Image 2026-08-15 at 11.27.33 PM (1).jpeg',
        'images/office/WhatsApp Image 2026-08-15 at 11.27.33 PM (2).jpeg',
        'images/office/WhatsApp Image 2026-08-15 at 11.27.34 PM (1).jpeg',
        'images/office/WhatsApp Image 2026-08-15 at 11.27.34 PM (2).jpeg',
        'images/office/WhatsApp Image 2026-08-15 at 11.27.34 PM (3).jpeg',
        'images/office/WhatsApp Image 2026-08-15 at 11.27.34 PM (4).jpeg',
        'images/office/WhatsApp Image 2026-08-15 at 11.27.34 PM (5).jpeg',
        'images/office/WhatsApp Image 2026-08-17 at 8.14.14 AM.jpeg',
        'images/office/WhatsApp Image 2026-08-17 at 8.14.14 AM (1).jpeg',
        'images/office/WhatsApp Image 2026-08-17 at 8.14.14 AM (2).jpeg',
        'images/office/WhatsApp Image 2026-08-17 at 8.14.14 AM (3).jpeg',
        'images/office/WhatsApp Image 2026-08-17 at 8.14.14 AM (4).jpeg'
      ]
    },
    'flooring-fitout': {
      title: "Flooring & Tiling Works",
      category: "FIT-OUT SERVICES",
      subtitle: "Large-Format Porcelain Slabs, Italian Marble, Parquet Hardwood, SPC Vinyl & Precision Grouting (21 Photos)",
      images: [
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM.jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM (27).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM (28).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM (29).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM (30).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM (30) (1).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM (31).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM (32).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM (33).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.33 AM (34).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.34 AM.jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.34 AM (1).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.34 AM (2).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.49.34 AM (3).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.59.18 AM.jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.59.18 AM (4).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.59.18 AM (5).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.59.18 AM (6).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.59.19 AM.jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.59.19 AM (1).jpeg',
        'images/floor/WhatsApp Image 2026-08-17 at 9.59.19 AM (2).jpeg'
      ]
    },
    'gypsum-fitout': {
      title: "Gypsum Partitions & Ceilings",
      category: "FIT-OUT SERVICES",
      subtitle: "Precision Drywall Partitioning, Acoustic Insulation, Decorative Drop Ceilings & Cove Lighting (15 Photos)",
      images: [
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.24 PM.jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.07 PM.jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.08 PM.jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.08 PM (1).jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.09 PM.jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.23 PM.jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.23 PM (1).jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.24 PM (1).jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.25 PM.jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.25 PM (1).jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 4.32.25 PM (2).jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 9.53.31 AM.jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 9.53.31 AM (1).jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 9.59.18 AM (1).jpeg',
        'images/gypsum/WhatsApp Image 2026-08-17 at 9.59.18 AM (2).jpeg'
      ]
    },
    'apartment-fitout': {
      title: "Apartment Renovation & Interior Remodeling",
      category: "FIT-OUT SERVICES",
      subtitle: "Full Apartment Space Remodeling, Modern Bathrooms, Open Kitchens & Luxury Handover (20 Photos)",
      images: [
        'images/apartment renovation/Interior design project for Mr.Idris’s apartment (1)-02.jpg',
        'images/apartment renovation/Interior design project for Mr.Idris’s apartment (1)-03.jpg',
        'images/apartment renovation/Interior design project for Mr.Idris’s apartment (1)-04.jpg',
        'images/apartment renovation/Interior design project for Mr.Idris’s apartment (1)-05.jpg',
        'images/apartment renovation/Interior design project for Mr.Idris’s apartment (1)-06.jpg',
        'images/apartment renovation/Interior design project for Mr.Idris’s apartment (1)-07.jpg',
        'images/apartment renovation/Interior design project for Mr.Idris’s apartment (1)-08.jpg',
        'images/apartment renovation/Interior design project for Mr.Idris’s apartment (1)-09.jpg',
        'images/apartment renovation/Interior design project for Mr.Idris’s apartment (1)-10.jpg',
        'images/apartment renovation/WhatsApp Image 2026-08-09 at 12.07.28 PM.jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-09 at 12.07.28 PM (1).jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-09 at 12.07.28 PM (1) (1).jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-09 at 12.07.28 PM (2).jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-09 at 12.07.29 PM.jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-09 at 12.07.29 PM (1).jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-09 at 12.07.29 PM (2).jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-17 at 8.16.43 AM.jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-17 at 8.16.43 AM (1).jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-17 at 8.16.44 AM.jpeg',
        'images/apartment renovation/WhatsApp Image 2026-08-17 at 8.16.44 AM (1).jpeg'
      ]
    }
  };

  if (projectModal) {
    let currentGalleryImages = [];
    let currentZoomIndex = 0;

    const modalGridGallery = document.getElementById('modalGridGallery');
    const photoZoomOverlay = document.getElementById('photoZoomOverlay');
    const zoomImage = document.getElementById('zoomImage');
    const zoomClose = document.getElementById('zoomClose');
    const zoomPrev = document.getElementById('zoomPrev');
    const zoomNext = document.getElementById('zoomNext');

    const updateZoomView = (index) => {
      if (!currentGalleryImages || currentGalleryImages.length === 0) return;

      if (index < 0) {
        currentZoomIndex = currentGalleryImages.length - 1;
      } else if (index >= currentGalleryImages.length) {
        currentZoomIndex = 0;
      } else {
        currentZoomIndex = index;
      }

      if (zoomImage) {
        zoomImage.src = currentGalleryImages[currentZoomIndex];
      }

      const activeCounter = document.getElementById('zoomCounter');
      if (activeCounter) {
        activeCounter.textContent = `${currentZoomIndex + 1} / ${currentGalleryImages.length}`;
      }

      const activePrev = document.getElementById('zoomPrev');
      const activeNext = document.getElementById('zoomNext');
      if (activePrev) activePrev.style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
      if (activeNext) activeNext.style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
    };

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
              updateZoomView(idx);
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

    // Bind next / prev arrow navigation buttons
    if (zoomPrev) {
      zoomPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        updateZoomView(currentZoomIndex - 1);
      });
    }
    if (zoomNext) {
      zoomNext.addEventListener('click', (e) => {
        e.stopPropagation();
        updateZoomView(currentZoomIndex + 1);
      });
    }

    if (photoZoomOverlay) {
      photoZoomOverlay.addEventListener('click', (e) => {
        if (
          e.target === photoZoomOverlay || 
          e.target === zoomClose || 
          e.target.id === 'zoomClose' || 
          e.target.classList.contains('photo-zoom-close') || 
          e.target.classList.contains('zoom-close-btn')
        ) {
          closeZoomOverlay();
        }
      });

      // Touch swipe support for mobile devices
      let touchStartX = 0;
      let touchEndX = 0;

      photoZoomOverlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      photoZoomOverlay.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) {
            updateZoomView(currentZoomIndex + 1);
          } else {
            updateZoomView(currentZoomIndex - 1);
          }
        }
      }, { passive: true });
    }

    // Keyboard Arrow Key Navigation (Left/Right & Escape)
    document.addEventListener('keydown', (e) => {
      if (!photoZoomOverlay || !photoZoomOverlay.classList.contains('active')) return;

      if (e.key === 'ArrowLeft') {
        updateZoomView(currentZoomIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateZoomView(currentZoomIndex + 1);
      } else if (e.key === 'Escape') {
        closeZoomOverlay();
      }
    });

    // Attach click triggers to all cards with data-project
    document.querySelectorAll('[data-project]').forEach(card => {
      let startX = 0;
      let startY = 0;
      let isMoved = false;

      card.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        isMoved = false;
      });

      card.addEventListener('mousemove', (e) => {
        if (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8) {
          isMoved = true;
        }
      });

      card.addEventListener('click', (e) => {
        if (isMoved) return;
        const projectKey = card.getAttribute('data-project');
        if (projectKey) {
          openProjectGallery(projectKey);
        }
      });
    });
  }

  // 8. Scroll Reveal Observer Animation (excluding homepage projects section)
  const revealTargets = document.querySelectorAll(
    '.service-card, .stat-item, .section-heading, .section-heading-light, .section-tag, .section-tag-gold, .hero-content, .value-card, .about-intro-content, .contact-form'
  );

  revealTargets.forEach(el => {
    el.classList.add('reveal-item');
    const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
    el.style.transitionDelay = `${(siblingIndex % 4) * 0.1}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(el => revealObserver.observe(el));
});



