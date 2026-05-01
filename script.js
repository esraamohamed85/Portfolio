// ═══════════════════════════════════════════
//  Active Nav Highlight on Scroll
// ═══════════════════════════════════════════

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
const isHomePage = document.getElementById('home') !== null;
 
function setActiveNav() {
  if (!isHomePage || !sections.length) return;

  const scrollY = window.scrollY + 100;
  let currentId = '';

  // Check if user scrolled to the bottom of the page
  const atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 50);

  if (atBottom) {
    // Get the last section's ID
    currentId = sections[sections.length - 1].getAttribute('id');
  } else {
    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        currentId = section.getAttribute('id');
      }
    });
  }

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}
 
window.addEventListener('scroll', setActiveNav);
setActiveNav();


// ═══════════════════════════════════════════
//  Navbar Scroll Effect
// ═══════════════════════════════════════════

const navbar = document.getElementById('mainNav');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll);
handleNavbarScroll();


// ═══════════════════════════════════════════
//  Typed Text Animation
// ═══════════════════════════════════════════
 
const words = ['Designer', 'Freelancer'];
const target = document.getElementById('typed-output');
 
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
 
function type() {
  const currentWord = words[wordIndex];
 
  if (isDeleting) {
    target.textContent = currentWord.slice(0, charIndex--);
  } else {
    target.textContent = currentWord.slice(0, ++charIndex);
  }
 
  let delay = isDeleting ? 60 : 120;
 
  if (!isDeleting && charIndex === currentWord.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 400;
  }
 
  setTimeout(type, delay);
}
 
if (target) {
  type();
}


// ═══════════════════════════════════════════
//  Scroll Reveal — IntersectionObserver
// ═══════════════════════════════════════════

const revealElements = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Once revealed, stop observing for performance
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ═══════════════════════════════════════════
//  Parallax — Hero Image & CTA Shapes
// ═══════════════════════════════════════════

const heroImg = document.getElementById('heroImg');
const ctaShapes = document.querySelectorAll('.cta__shape');
const heroSection = document.querySelector('.hero');
const ctaSection = document.querySelector('.cta');

function handleParallax() {
  const scrollY = window.scrollY;

  // Hero parallax: image moves at 35% scroll speed
  if (heroImg && heroSection) {
    const heroHeight = heroSection.offsetHeight;
    if (scrollY <= heroHeight) {
      heroImg.style.transform = 'translate3d(0,' + (scrollY * 0.35) + 'px, 0)';
    }
  }

  // CTA shapes parallax
  if (ctaShapes.length && ctaSection) {
    const rect = ctaSection.getBoundingClientRect();
    const windowH = window.innerHeight;
    // Only animate when CTA is near the viewport
    if (rect.top < windowH && rect.bottom > 0) {
      const progress = (windowH - rect.top) / (windowH + rect.height);
      ctaShapes.forEach((shape, i) => {
        const yMove = (progress - 0.5) * 80 * (i === 0 ? 1 : -1);
        shape.style.transform = 'translate3d(0,' + yMove + 'px, 0)';
      });
    }
  }
}

// Throttle with rAF for smooth 60fps parallax
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleParallax();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

handleParallax();


// ═══════════════════════════════════════════
//  Floating Design Icons — Hero Canvas
// ═══════════════════════════════════════════

(function initDesignParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let items = [];
  const ITEM_COUNT = 18;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // ─── Icon drawing functions ───────────────
  function drawPenTool(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.3, s * 0.3);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.3, s * 0.3);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -s, s * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBezier(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s, s * 0.5);
    ctx.bezierCurveTo(-s * 0.3, -s, s * 0.3, s, s, -s * 0.5);
    ctx.stroke();
    // control handles
    ctx.beginPath();
    ctx.arc(-s, s * 0.5, s * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s, -s * 0.5, s * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGrid(ctx, s) {
    const half = s * 0.8;
    ctx.strokeRect(-half, -half, half * 2, half * 2);
    ctx.beginPath();
    ctx.moveTo(0, -half); ctx.lineTo(0, half);
    ctx.moveTo(-half, 0); ctx.lineTo(half, 0);
    ctx.stroke();
  }

  function drawColorWheel(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
    ctx.stroke();
    // segments
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * s * 0.4, Math.sin(angle) * s * 0.4);
      ctx.lineTo(Math.cos(angle) * s * 0.8, Math.sin(angle) * s * 0.8);
      ctx.stroke();
    }
  }

  function drawLayers(ctx, s) {
    for (let i = 0; i < 3; i++) {
      const y = -s * 0.5 + i * s * 0.4;
      ctx.beginPath();
      ctx.moveTo(-s * 0.7, y);
      ctx.lineTo(0, y - s * 0.3);
      ctx.lineTo(s * 0.7, y);
      ctx.lineTo(0, y + s * 0.3);
      ctx.closePath();
      ctx.stroke();
    }
  }

  function drawRuler(ctx, s) {
    ctx.strokeRect(-s, -s * 0.25, s * 2, s * 0.5);
    for (let i = 0; i < 5; i++) {
      const x = -s + i * s * 0.5;
      const tickH = i % 2 === 0 ? s * 0.25 : s * 0.15;
      ctx.beginPath();
      ctx.moveTo(x, -s * 0.25);
      ctx.lineTo(x, -s * 0.25 + tickH);
      ctx.stroke();
    }
  }

  function drawCursor(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.6, s * 0.5);
    ctx.lineTo(s * 0.15, s * 0.35);
    ctx.lineTo(s * 0.4, s);
    ctx.lineTo(s * 0.1, s);
    ctx.lineTo(-s * 0.1, s * 0.45);
    ctx.lineTo(-s * 0.4, s * 0.6);
    ctx.closePath();
    ctx.stroke();
  }

  function drawArtboard(ctx, s) {
    ctx.strokeRect(-s * 0.7, -s * 0.9, s * 1.4, s * 1.8);
    // inner content lines
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, -s * 0.4);
    ctx.lineTo(s * 0.4, -s * 0.4);
    ctx.moveTo(-s * 0.4, 0);
    ctx.lineTo(s * 0.2, 0);
    ctx.moveTo(-s * 0.4, s * 0.4);
    ctx.lineTo(s * 0.3, s * 0.4);
    ctx.stroke();
  }

  function drawFigma(ctx, s) {
    const r = s * 0.28;  // corner radius
    const w = s * 0.55;  // half-width
    const h = s * 0.4;   // cell height

    // Top-left rounded rect (half)
    ctx.beginPath();
    ctx.arc(-w + r, -h * 2 + r, r, Math.PI, Math.PI * 1.5);
    ctx.lineTo(0, -h * 2);
    ctx.lineTo(0, -h);
    ctx.lineTo(-w + r, -h);
    ctx.arc(-w + r, -h - r + r, r, Math.PI * 0.5, Math.PI);
    ctx.closePath();
    ctx.stroke();

    // Top-right rounded rect (half)
    ctx.beginPath();
    ctx.arc(w - r, -h * 2 + r, r, Math.PI * 1.5, 0);
    ctx.arc(w - r, -h - r + r, r, 0, Math.PI * 0.5);
    ctx.lineTo(0, -h);
    ctx.lineTo(0, -h * 2);
    ctx.closePath();
    ctx.stroke();

    // Middle-left
    ctx.beginPath();
    ctx.arc(-w + r, -h + r, r, Math.PI, Math.PI * 1.5);
    ctx.lineTo(0, -h);
    ctx.lineTo(0, 0);
    ctx.lineTo(-w + r, 0);
    ctx.arc(-w + r, 0 - r + r, r, Math.PI * 0.5, Math.PI);
    ctx.closePath();
    ctx.stroke();

    // Middle-right circle
    ctx.beginPath();
    ctx.arc(w * 0.5, -h * 0.5, h * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    // Bottom-left rounded + circle
    ctx.beginPath();
    ctx.arc(-w + r, r, r, Math.PI, Math.PI * 1.5);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, h * 0.5);
    ctx.arc(-w * 0.5, h * 0.5, w * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  const drawFunctions = [
    drawPenTool, drawBezier, drawGrid, drawColorWheel,
    drawLayers, drawRuler, drawCursor, drawArtboard, drawFigma
  ];

  function createItem() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 10 + 10,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.35 - 0.1,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      opacity: Math.random() * 0.25 + 0.08,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
      drawFn: drawFunctions[Math.floor(Math.random() * drawFunctions.length)],
    };
  }

  function init() {
    resize();
    items = [];
    for (let i = 0; i < ITEM_COUNT; i++) {
      items.push(createItem());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      p.opacity += p.fadeDir * 0.002;

      if (p.opacity >= 0.35) p.fadeDir = -1;
      if (p.opacity <= 0.05) p.fadeDir = 1;

      // Wrap around
      if (p.y < -30) { p.y = canvas.height + 30; p.x = Math.random() * canvas.width; }
      if (p.x < -30) p.x = canvas.width + 30;
      if (p.x > canvas.width + 30) p.x = -30;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.strokeStyle = 'rgba(201, 168, 76, 1)';
      ctx.fillStyle = 'rgba(201, 168, 76, 1)';
      ctx.lineWidth = 1;

      p.drawFn(ctx, p.size);

      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
})();


// ═══════════════════════════════════════════
//  Mouse Tilt Effect — Service Cards & Works
// ═══════════════════════════════════════════

(function initTilt() {
  const tiltEls = document.querySelectorAll('.service-card, .work-item');

  tiltEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;  // max 5deg
      const rotateY = ((x - centerX) / centerX) * 5;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      el.style.transition = 'transform 0.1s ease';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      el.style.transition = 'transform 0.4s ease';
    });
  });
})();


// ═══════════════════════════════════════════
//  Portfolio Gallery Filtering
// ═══════════════════════════════════════════

(function initFiltering() {
  const filterBtns = document.querySelectorAll('.works-filter__btn');
  const galleryItems = document.querySelectorAll('.works-page__gallery .work-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Hide/Show logic
        if (filterValue === 'all' || filterValue === itemCategory) {
          item.classList.remove('hide');
          // Add a slight delay to trigger animation smoothly
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          // Wait for transition before hiding completely
          setTimeout(() => {
            item.classList.add('hide');
          }, 400); // matches CSS transition duration
        }
      });
    });
  });
})();