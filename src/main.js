gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lucide Icons
  lucide.createIcons();

  // 2. Custom Cursor Logic
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');

  if (cursor && cursorFollower) {
    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;
    
    // Position elements immediately off-screen to avoid top-left flash
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the small dot
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    // Smooth follow for the outer circle
    function animateCursor() {
      // Linear interpolation for smooth follower movement
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      
      requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Handle clicks and hovers for cursor
    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.9)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Handle hover states robustly without relying purely on CSS :has
    const addHoverEffect = () => {
      cursor.style.width = '15px';
      cursor.style.height = '15px';
      cursor.style.backgroundColor = 'transparent';
      cursor.style.border = '2px solid var(--primary-col)';

      cursorFollower.style.width = '60px';
      cursorFollower.style.height = '60px';
      cursorFollower.style.borderColor = 'rgba(212, 163, 115, 0.2)';
      cursorFollower.style.backgroundColor = 'rgba(212, 163, 115, 0.1)';
    };

    const removeHoverEffect = () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursor.style.backgroundColor = 'var(--primary-col)';
      cursor.style.border = 'none';

      cursorFollower.style.width = '40px';
      cursorFollower.style.height = '40px';
      cursorFollower.style.borderColor = 'rgba(212, 163, 115, 0.6)';
      cursorFollower.style.backgroundColor = 'transparent';
    };

    const hoverElements = document.querySelectorAll('a, button, .project-card, .research-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', addHoverEffect);
      el.addEventListener('mouseleave', removeHoverEffect);
    });
  }

  // 3. Navbar scroll effect & Active states
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // 4. Mobile Menu Logic
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // disable scroll
  }

  function closeMenu() {
    mobileMenuOverlay.classList.remove('open');
    document.body.style.overflow = 'auto'; // enable scroll
  }

  mobileMenuBtn.addEventListener('click', openMenu);
  closeMenuBtn.addEventListener('click', closeMenu);
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // 5. GSAP Animations
  // Hero Animations
  const tl = gsap.timeline();
  tl.fromTo(".hero-greeting", 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
  )
  .fromTo(".hero-title span", 
    { y: 50, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
    "-=0.4"
  )
  .fromTo([".hero-subtitle", ".hero-desc", ".hero-action"], 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
    "-=0.4"
  );

  // Reveal Text Elements on Scroll
  gsap.utils.toArray('.reveal-text').forEach((element) => {
    // Skip if in hero section (already animated!)
    if (element.closest('.hero')) return;

    gsap.fromTo(element, 
      { y: 50, opacity: 0 }, 
      {
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%", // trigger when element is 85% from top
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Reveal Boxes (Skill tags, Project Cards, Timeline Items) on Scroll
  gsap.utils.toArray('.reveal-box').forEach((box) => {
    gsap.fromTo(box, 
      { y: 50, opacity: 0, scale: 0.95 }, 
      {
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.8, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: box,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
});
