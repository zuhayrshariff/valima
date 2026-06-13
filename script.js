// ── VALIMA INVITATION SCRIPT ──

const envelopeScreen = document.getElementById('envelopeScreen');
const envFlap = document.getElementById('envFlap');
const envSeal = document.getElementById('envSeal');
const tapHint = document.getElementById('tapHint');
const cardScreen = document.getElementById('cardScreen');

const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

let opened = false;
let playing = false;

// ── ENVELOPE ──
document.getElementById('envelope').addEventListener('click', openIt);
tapHint.addEventListener('click', openIt);

function openIt() {
  if (opened) return;
  opened = true;

  // Auto-play music
  if (bgMusic) {
    bgMusic.play().catch(() => {});
    playing = true;
    musicBtn.textContent = '■';
    musicBtn.classList.add('playing');
  }

  tapHint.style.opacity = '0';

  if (envSeal) {
    envSeal.classList.add('hidden');
  }

  if (envFlap) {
    envFlap.classList.add('open');
  }

  setTimeout(() => {
    envelopeScreen.classList.add('gone');
    cardScreen.classList.remove('hidden');

    startPetals();
    initScroll();

    document.querySelectorAll('.hero-section .fade-up').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 200 + i * 160);
    });

  }, 950);
}

// ── MUSIC ──
musicBtn.addEventListener('click', () => {

  if (playing) {
    bgMusic.pause();
    musicBtn.textContent = '♪';
    musicBtn.classList.remove('playing');
    playing = false;
  } else {
    bgMusic.play().catch(() => {});
    musicBtn.textContent = '■';
    musicBtn.classList.add('playing');
    playing = true;
  }

});

// ── ROSE PETALS ──
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');

let petals = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

function mkPetal() {
  const colors = [
    '#F2B8C6',
    '#E8A0B5',
    '#C8607A',
    '#FAD4DF',
    '#F5C0D0',
    '#C8A951',
    '#E8CC78'
  ];

  return {
    x: Math.random() * canvas.width,
    y: -30,
    w: 8 + Math.random() * 14,
    h: 5 + Math.random() * 8,
    speed: 1 + Math.random() * 2,
    drift: (Math.random() - 0.5) * 1.5,
    rot: Math.random() * 360,
    rotS: (Math.random() - 0.5) * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 0.5 + Math.random() * 0.5,
    wave: Math.random() * Math.PI * 2
  };
}

function drawPetal(p) {
  ctx.save();

  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot * Math.PI / 180);

  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 4;

  ctx.beginPath();
  ctx.ellipse(0, 0, p.w / 2, p.h, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.12 && petals.length < 70) {
    petals.push(mkPetal());
  }

  petals = petals.filter(p => p.y < canvas.height + 40);

  petals.forEach(p => {
    p.y += p.speed;
    p.wave += 0.02;
    p.x += p.drift + Math.sin(p.wave) * 1.2;
    p.rot += p.rotS;

    drawPetal(p);
  });

  requestAnimationFrame(animate);
}

function startPetals() {
  animate();
}

// ── SCROLL ANIMATIONS ──
function initScroll() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.fade-up').forEach(el => {
    if (!el.closest('.hero-section')) {
      obs.observe(el);
    }
  });
}