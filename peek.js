/* Floating "peek" cutouts — reveal on scroll + gentle parallax drift.
   Decorative only; respects reduced-motion. */
(function () {
  var peeks = Array.prototype.slice.call(document.querySelectorAll('.peek, .flora'));
  if (!peeks.length) return;

  // Reveal each peek as it enters the viewport.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    peeks.forEach(function (p) { io.observe(p); });
  } else {
    peeks.forEach(function (p) { p.classList.add('in'); });
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Parallax: nudge each peek opposite to its distance from viewport centre.
  var ticking = false;
  function update() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < peeks.length; i++) {
      var p = peeks[i];
      var sp = parseFloat(p.getAttribute('data-speed') || '0.05');
      var r = p.getBoundingClientRect();
      var center = r.top + r.height / 2;
      var delta = center - vh / 2;
      p.style.setProperty('--py', (-delta * sp).toFixed(1) + 'px');
    }
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
