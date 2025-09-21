// Ano dinâmico no rodapé (só se existir o elemento)
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


// Menu mobile
const toggle = document.querySelector('.nav__toggle');
const nav = document.getElementById('nav');
if (toggle && nav){
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('show');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// Smooth scroll para âncoras internas
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector(href);
    if (el){
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav?.classList.remove('show');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Micro animação de entrada quando elementos entram na viewport
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section, .card, .service').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// Estilos complementares via JS (opcional): adiciona classe .reveal/.in
// Coloque no CSS, se quiser transições:
// .reveal { opacity:0; transform: translateY(10px); transition: .5s ease }
// .reveal.in { opacity:1; transform:none }