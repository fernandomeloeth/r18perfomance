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

// ===== Carrossel + Miniaturas =====
(function(){
  // inicializa todos os carrosseis marcados
  document.querySelectorAll('[data-carousel]').forEach(setupCarousel);

  function setupCarousel(root){
    const slides = Array.from(root.querySelectorAll('.carousel__slide'));
    const btnPrev = root.querySelector('.carousel__btn.prev');
    const btnNext = root.querySelector('.carousel__btn.next');
    const dotsWrap = root.querySelector('.carousel__dots');
    const thumbsWrap = root.querySelector('.carousel__thumbs');
    if (!slides.length) return;

    // cria dots
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Ir para o slide ${i+1}`);
      dotsWrap.appendChild(b);
      b.addEventListener('click', () => goTo(i));
      return b;
    });

    // cria miniaturas a partir dos próprios slides
    const thumbs = slides.map((s, i) => {
      const btn = document.createElement('button');
      btn.className = 'carousel__thumb';
      btn.type = 'button';
      const img = document.createElement('img');
      img.src = s.getAttribute('src');
      img.alt = s.getAttribute('alt') || `Miniatura ${i+1}`;
      btn.appendChild(img);
      thumbsWrap.appendChild(btn);
      btn.addEventListener('click', () => goTo(i));
      return btn;
    });

    let index = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
    update();

    // setas
    btnPrev?.addEventListener('click', () => goTo(index - 1));
    btnNext?.addEventListener('click', () => goTo(index + 1));

    // autoplay (pausa no hover)
    let timer = startAutoplay();
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', () => timer = startAutoplay());

    // swipe mobile
    let startX = 0, deltaX = 0;
    root.addEventListener('touchstart', e => { startX = e.touches[0].clientX; deltaX = 0; }, {passive:true});
    root.addEventListener('touchmove',  e => { deltaX = e.touches[0].clientX - startX; }, {passive:true});
    root.addEventListener('touchend',   () => { if (Math.abs(deltaX) > 40) (deltaX < 0 ? next() : prev()); });

    function prev(){ goTo(index - 1); }
    function next(){ goTo(index + 1); }

    function goTo(i){
      index = (i + slides.length) % slides.length;
      update();
    }

    function update(){
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i)   => d.classList.toggle('is-active', i === index));
      thumbs.forEach((t, i) => t.classList.toggle('is-active', i === index));
      // garante a miniatura ativa visível
      const active = thumbs[index];
      if (active && active.scrollIntoView) {
        active.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
      }
    }

    function startAutoplay(){ stopAutoplay(); return setInterval(next, 4000); }
    function stopAutoplay(){ if (timer) clearInterval(timer); }
  }
})();





// Estilos complementares via JS (opcional): adiciona classe .reveal/.in
// Coloque no CSS, se quiser transições:
// .reveal { opacity:0; transform: translateY(10px); transition: .5s ease }
// .reveal.in { opacity:1; transform:none }
