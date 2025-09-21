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


// ===== Carrossel (múltiplas instâncias, com diagnóstico) =====
(function initCarousels(){
  const carousels = Array.from(document.querySelectorAll('[data-carousel]'));
  console.log('[Carrossel] encontrados:', carousels.length);

  carousels.forEach((root, idx) => {
    console.log(`- Carrossel #${idx+1}`, root);

    const slides = Array.from(root.querySelectorAll('.carousel__slide'));
    const btnPrev = root.querySelector('.carousel__btn.prev');
    const btnNext = root.querySelector('.carousel__btn.next');
    const dotsWrap = root.querySelector('.carousel__dots');

    // filtra imagens quebradas
    const validSlides = slides.filter(img => {
      // se a imagem falhar, este evento dispara
      img.addEventListener('error', () => {
        console.error('[Carrossel] imagem não encontrada:', img.src);
        img.remove(); // remove slide inválido
      }, { once: true });
      return true;
    });

    if (validSlides.length < 2) {
      console.warn('[Carrossel] menos de 2 slides. Não haverá transição.', validSlides);
    }

    // cria dots
    const dots = validSlides.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Ir para o slide ${i+1}`);
      dotsWrap.appendChild(b);
      b.addEventListener('click', () => goTo(i));
      return b;
    });

    let index = Math.max(0, validSlides.findIndex(s => s.classList.contains('is-active')));
    if (index < 0) index = 0;
    update();

    // setas
    btnPrev?.addEventListener('click', () => goTo(index - 1));
    btnNext?.addEventListener('click', () => goTo(index + 1));

    // autoplay com pausa no hover
    let timer = startAutoplay();
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', () => timer = startAutoplay());

    // swipe no mobile
    let startX = 0, deltaX = 0;
    root.addEventListener('touchstart', e => { startX = e.touches[0].clientX; deltaX = 0; }, {passive:true});
    root.addEventListener('touchmove',  e => { deltaX = e.touches[0].clientX - startX; }, {passive:true});
    root.addEventListener('touchend',   () => { if (Math.abs(deltaX) > 40) (deltaX < 0 ? next() : prev()); });

    function prev(){ goTo(index - 1); }
    function next(){ goTo(index + 1); }
    function goTo(i){ index = (i + validSlides.length) % validSlides.length; update(); }

    function update(){
      validSlides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i)        => d.classList.toggle('is-active', i === index));
    }

    function startAutoplay(){ stopAutoplay(); return setInterval(next, 4000); }
    function stopAutoplay(){ if (timer) clearInterval(timer); }
  });
})();
