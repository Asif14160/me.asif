(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const validPages = ['home','about','projects','services','contact'];
  const getPage = () => {
    const requested = (location.hash || '#home').slice(1).split('/')[0];
    return validPages.includes(requested) ? requested : 'home';
  };
  const activatePage = (page, scroll=true) => {
    $$('.route-page').forEach(el => {
      const active = el.dataset.routePage === page;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-hidden', String(!active));
    });
    $$('[data-page]').forEach(a => {
      const active = a.dataset.page === page;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    const titles = {home:'Asif Iqbal® — Digital Experience Designer',about:'About — Asif Iqbal®',projects:'Projects — Asif Iqbal®',services:'Services — Asif Iqbal®',contact:'Contact — Asif Iqbal®'};
    document.title = titles[page] || titles.home;
    if (scroll) window.scrollTo({top:0,behavior:'instant'});
    if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 80);
    if (window.gsap) {
      const active = $('.route-page.is-active');
      if (active) {
        const items = $$('.reveal', active);
        gsap.set(items, {clearProps:'opacity,transform'});
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }
    }
  };
  activatePage(getPage(), false);
  window.addEventListener('hashchange', () => activatePage(getPage()));
  const toggle = $('.menu-toggle'), nav = $('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    });
    $$('a', nav).forEach(a => a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded','false');
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded','false');
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  }
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const copyBtn = $('[data-copy-email]');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.copyEmail;
    try {
      await navigator.clipboard.writeText(email);
      copyBtn.textContent = 'EMAIL COPIED ✓';
    } catch {
      location.href = 'mailto:' + email;
      copyBtn.textContent = 'OPENING EMAIL APP ↗';
    }
    setTimeout(() => copyBtn.textContent = 'COPY EMAIL +', 2400);
  });

  // Lightweight cursor effect on devices with a precise pointer.
  const dot = $('.cursor-dot');
  if (dot && matchMedia('(pointer:fine)').matches) {
    dot.style.display = 'block';
    window.addEventListener('pointermove', e => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    }, {passive:true});
    $$('a,button').forEach(el => {
      el.addEventListener('pointerenter', () => { dot.style.width='18px'; dot.style.height='18px'; });
      el.addEventListener('pointerleave', () => { dot.style.width='8px'; dot.style.height='8px'; });
    });
  }

  // Graceful fallback: content remains visible if GSAP/CDN is unavailable.
  const reveals = $$('.reveal');
  if (!window.gsap) {
    reveals.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  gsap.set(reveals, {y:28, opacity:0});
  gsap.to('.hero-title > span', {y:0, opacity:1, duration:1.05, stagger:.13, ease:'power4.out', delay:.12});
  gsap.to('.hero .eyebrow', {y:0, opacity:1, duration:.7, ease:'power3.out', delay:.35});
  reveals.forEach(el => {
    if (el.closest('.hero')) return;
    gsap.to(el, {y:0, opacity:1, duration:.85, ease:'power3.out',
      scrollTrigger:{trigger:el, start:'top 88%', once:true}});
  });
  $$('.project-feature, .index-project, .service-detail, .process-step, .value-row').forEach((el, i) => {
    gsap.from(el, {y:24, opacity:0, duration:.7, delay:(i%3)*.06, ease:'power2.out',
      scrollTrigger:{trigger:el, start:'top 91%', once:true}});
  });
  $$('.number-grid strong').forEach(el => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)/);
    if (!match) return;
    const target = Number(match[1]);
    const suffix = raw.slice(match[1].length);
    const counter = {n:0};
    gsap.to(counter, {n:target, duration:1.3, ease:'power2.out',
      scrollTrigger:{trigger:el, start:'top 90%', once:true},
      onUpdate:() => {el.textContent = String(Math.round(counter.n)).padStart(match[1].length,'0') + suffix;}
    });
  });
  // Hover typography response, deliberately subtle.
  $$('.index-project, .project-feature').forEach(el => {
    el.addEventListener('pointermove', e => {
      if (!matchMedia('(pointer:fine)').matches) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX-rect.left)/rect.width*100)+'%');
      el.style.setProperty('--my', ((e.clientY-rect.top)/rect.height*100)+'%');
    });
  });
})();