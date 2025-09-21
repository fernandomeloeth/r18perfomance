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


// ===== Carrossel (múltiplas instâncias, robusto e com .carousel-02) =====
(function initCarousels(){
  const roots = Array.from(document.querySelectorAll('[data-carousel]'));
  console.log('[Carrossel] encontrados:', roots.length);
  roots.forEach(root => setupCarousel(root));

  function setupCarousel(root){
    // evita dupla inicialização
    if (root.__carouselInited) return;
    root.__carouselInited = true;

    const dotsWrap = root.querySelector('.carousel__dots');
    const btnPrev  = root.querySelector('.carousel__btn.prev');
    const btnNext  = root.querySelector('.carousel__btn.next');

    // limpa dots anteriores (se houver reinicialização)
    while (dotsWrap.firstChild) dotsWrap.removeChild(dotsWrap.firstChild);

    // coleta slides atuais e remove os que já marcaram erro
    let slides = Array.from(root.querySelectorAll('.carousel__slide')).filter(s => !s.dataset.bad);
    if (!slides.length) return;

    // garante um ativo
    let index = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
    slides.forEach((s,i)=> s.classList.toggle('is-active', i===index));

    // listeners de erro: se alguma imagem falhar, marca e re-inicia este carrossel
    slides.forEach(img => {
      img.addEventListener('error', () => {
        console.error('[Carrossel] imagem não encontrada:', img.getAttribute('src'));
        img.dataset.bad = '1';
        img.remove();
        root.__carouselInited = false; // permite reinicializar
        setupCarousel(root);           // reinicia só este
      }, { once:true });
    });

    // cria dots
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Ir para o slide ${i+1}`);
      dotsWrap.appendChild(b);
      b.addEventListener('click', () => goTo(i));
      return b;
    });

    update();

    // setas
    btnPrev?.addEventListener('click', prev);
    btnNext?.addEventListener('click', next);

    // autoplay — .carousel-02 usa intervalo diferente
    const isCarousel02 = root.classList.contains('carousel-02');
    const AUTOPLAY_MS  = isCarousel02 ? 5000 : 4000;

    let timer = startAutoplay();
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', () => timer = startAutoplay());

    // swipe para mobile
    let startX = 0, deltaX = 0;
    root.addEventListener('touchstart', e => { startX = e.touches[0].clientX; deltaX = 0; }, {passive:true});
    root.addEventListener('touchmove',  e => { deltaX = e.touches[0].clientX - startX; }, {passive:true});
    root.addEventListener('touchend',   () => { if (Math.abs(deltaX) > 40) (deltaX < 0 ? next() : prev()); });

    function prev(){ goTo(index - 1); }
    function next(){ goTo(index + 1); }
    function goTo(i){
      // se sobraram <2 slides, só mantemos o atual
      slides = Array.from(root.querySelectorAll('.carousel__slide')).filter(s=>!s.dataset.bad);
      if (slides.length < 2) { index = 0; update(); return; }
      index = (i + slides.length) % slides.length;
      update();
    }

    function update(){
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i)   => d.classList.toggle('is-active', i === index));
    }

    function startAutoplay(){ stopAutoplay(); return setInterval(next, AUTOPLAY_MS); }
    function stopAutoplay(){ if (timer) clearInterval(timer); }
  }
})();
