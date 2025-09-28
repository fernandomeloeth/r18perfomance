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

// ===== Carrossel em faixa (múltiplas imagens por “pulo”) =====
(function initRibbonCarousel(){
  document.querySelectorAll('.ribbon-carousel').forEach(setup);

  function setup(root){
    const viewport = root.querySelector('.ribbon__viewport');
    const btnPrev  = root.querySelector('.ribbon__btn.prev');
    const btnNext  = root.querySelector('.ribbon__btn.next');

    // passo ~ 90% da largura visível (mostra “tela” seguinte)
    const STEP = () => Math.max( viewport.clientWidth * 0.9, 320 );

    btnNext?.addEventListener('click', () => viewport.scrollBy({ left:  STEP(), behavior: 'smooth' }));
    btnPrev?.addEventListener('click', () => viewport.scrollBy({ left: -STEP(), behavior: 'smooth' }));

    // drag com mouse / swipe no touch
    let isDown = false, startX = 0, startScroll = 0;
    viewport.addEventListener('mousedown', e => { isDown = true; startX = e.pageX; startScroll = viewport.scrollLeft; });
    window.addEventListener('mouseup',   () => { isDown = false; });
    viewport.addEventListener('mousemove', e => {
      if (!isDown) return;
      viewport.scrollLeft = startScroll - (e.pageX - startX);
    });

    viewport.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX; startScroll = viewport.scrollLeft;
    }, {passive:true});
    viewport.addEventListener('touchmove', e => {
      viewport.scrollLeft = startScroll - (e.touches[0].clientX - startX);
    }, {passive:true});
  }
})();
