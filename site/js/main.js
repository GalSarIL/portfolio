/* ============================================
   PARTICLE CANVAS
   ============================================ */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let particles = [];
let rafId;

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

function makeParticle() {
    return {
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r:  Math.random() * 1.4 + 0.4,
        a:  Math.random() * 0.45 + 0.08
    };
}

function initParticles() {
    resize();
    const count = Math.min(Math.floor(canvas.width * canvas.height / 11000), 130);
    particles = Array.from({ length: count }, makeParticle);
}

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0,212,255,${0.09 * (1 - dist / 130)})`;
                ctx.lineWidth   = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.a})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
    }

    rafId = requestAnimationFrame(tick);
}

window.addEventListener('resize', initParticles);
initParticles();
tick();

/* ============================================
   TYPING EFFECT
   ============================================ */
const roles   = ['DevOps Engineer', 'Automation Engineer', 'Test Engineer', 'Cyber Security Engineer'];
let rIdx      = 0;
let cIdx      = 0;
let deleting  = false;
const typingEl = document.getElementById('typingText');

function type() {
    const word = roles[rIdx];

    if (deleting) {
        typingEl.textContent = word.slice(0, cIdx - 1);
        cIdx--;
    } else {
        typingEl.textContent = word.slice(0, cIdx + 1);
        cIdx++;
    }

    let delay = deleting ? 45 : 75;

    if (!deleting && cIdx === word.length) {
        delay    = 2200;
        deleting = true;
    } else if (deleting && cIdx === 0) {
        deleting = false;
        rIdx     = (rIdx + 1) % roles.length;
        delay    = 350;
    }

    setTimeout(type, delay);
}

type();

/* ============================================
   NAV SCROLL STATE
   ============================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================
   MOBILE NAV TOGGLE
   ============================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================
   SCROLL FADE-IN
   ============================================ */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
