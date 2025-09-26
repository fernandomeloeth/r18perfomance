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

// === Carrossel multi-instância (prep e man) ===
(function initCarousels(){
  const optionsByClass = {
    'carousel--prep': { interval: 4000 },
    'carousel--man' : { interval: 5000 }
  };

  document.querySelectorAll('[data-carousel]').forEach(root => {
    const slides  = Array.from(root.querySelectorAll('.carousel__slide'));
    const btnPrev = root.querySelector('.carousel__btn.prev');
    const btnNext = root.querySelector('.carousel__btn.next');
    const dotsBox = root.querySelector('.carousel__dots');

    if (slides.length === 0) return;

    // define intervalo pela classe (ou padrão 4000)
    const cls = Object.keys(optionsByClass).find(c => root.classList.contains(c));
    const interval = (cls && optionsByClass[cls].interval) || 4000;

    // índice inicial
    let index = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
    if (index < 0) index = 0;

    // cria dots
    dotsBox.innerHTML = '';
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Ir para o slide ${i+1}`);
      b.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(b);
      return b;
    });

    update();

    // setas
    btnPrev?.addEventListener('click', () => goTo(index - 1));
    btnNext?.addEventListener('click', () => goTo(index + 1));

    // autoplay com pausa
    let timer = start();
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', () => timer = start());

    // swipe mobile
    let startX = 0, deltaX = 0;
    root.addEventListener('touchstart', e => { startX = e.touches[0].clientX; deltaX = 0; }, {passive:true});
    root.addEventListener('touchmove',  e => { deltaX = e.touches[0].clientX - startX; }, {passive:true});
    root.addEventListener('touchend',   () => { if (Math.abs(deltaX) > 40) (deltaX < 0 ? next() : prev()); });

    function prev(){ goTo(index - 1); }
    function next(){ goTo(index + 1); }
    function goTo(i){ index = (i + slides.length) % slides.length; update(); }

    function update(){
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i)   => d.classList.toggle('is-active', i === index));
    }

    function start(){ stop(); return setInterval(next, interval); }
    function stop(){ if (timer) clearInterval(timer); }
  });
})();



// Estilos complementares via JS (opcional): adiciona classe .reveal/.in
// Coloque no CSS, se quiser transições:
// .reveal { opacity:0; transform: translateY(10px); transition: .5s ease }
// .reveal.in { opacity:1; transform:none }