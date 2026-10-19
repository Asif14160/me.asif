document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  gsap.registerPlugin(ScrollTrigger);
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const menu = document.getElementById('mobileMenu');
  document.getElementById('menuBtn').addEventListener('click', () => menu.classList.toggle('hidden'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.add('hidden')));

  // Hero entrance
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-in', { y: 40, opacity: 0, duration: .9, stagger: .12 })
    .from('#avatar', { scale: .8, opacity: 0, rotate: -6, duration: 1.1, ease: 'back.out(1.5)' }, 0.2);
  gsap.to('#avatar', { y: -14, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('#avatar', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } });

  // Typing role loop
  const roles = ['modern websites', 'WordPress plugins', 'GSAP animations', 'clean interfaces'];
  const el = document.getElementById('role');
  let r = 0, c = 0, del = false;
  (function type() {
    const word = roles[r];
    el.textContent = word.slice(0, c);
    if (!del && c++ === word.length) { del = true; return setTimeout(type, 1400); }
    if (del && --c === 0) { del = false; r = (r + 1) % roles.length; }
    setTimeout(type, del ? 40 : 80);
  })();

  // Section reveals
  gsap.utils.toArray('.reveal').forEach(item => {
    gsap.from(item, { y: 50, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' } });
  });

  // Counters
  document.querySelectorAll('.stat').forEach(s => {
    const o = { v: 0 };
    gsap.to(o, { v: +s.dataset.n, duration: 2, ease: 'power1.out',
      onUpdate: () => s.textContent = Math.round(o.v) + '+',
      scrollTrigger: { trigger: s, start: 'top 90%', once: true } });
  });

  // Staggered grids
  [['.skill-card', '#skills'], ['.project', '#projects']].forEach(([sel, trig]) => {
    gsap.from(sel, { y: 70, opacity: 0, duration: .8, stagger: .15, ease: 'power3.out',
      scrollTrigger: { trigger: trig + ' .grid', start: 'top 80%' } });
  });
  gsap.utils.toArray('.skill-card .tags span').forEach((t, i) =>
    gsap.from(t, { scale: 0, opacity: 0, duration: .4, delay: (i % 5) * .05, ease: 'back.out(2)',
      scrollTrigger: { trigger: t, start: 'top 92%' } }));

  // Background glow parallax
  gsap.to('.glow-a', { y: 400, ease: 'none', scrollTrigger: { scrub: 1, start: 0, end: 'max' } });
  gsap.to('.glow-b', { y: -400, ease: 'none', scrollTrigger: { scrub: 1, start: 0, end: 'max' } });

  // Contact form (works with Formspree; replace YOUR_ID in index.html)
  const form = document.getElementById('contactForm'), msg = document.getElementById('formMsg');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.textContent = 'Sending...';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw 0;
      msg.textContent = 'Thanks! Your message was sent.'; msg.className = 'text-center text-sm text-emerald-400'; form.reset();
    } catch { msg.textContent = 'Something went wrong. Please email me directly.'; msg.className = 'text-center text-sm text-red-400'; }
  });
});
