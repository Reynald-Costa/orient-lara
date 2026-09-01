/* ============================================================
   Orient Lara — interações da landing page
   ============================================================ */
(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");
  var toTop = document.getElementById("to-top");

  /* ---------- Header: estado ao rolar ---------- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("scrolled", y > 24);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  function closeNav() {
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
  }
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeNav();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) closeNav();
  });

  /* ---------- Link ativo conforme a seção visível ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('ul a[href^="#"]'));
  var linkFor = {};
  navLinks.forEach(function (a) { linkFor[a.getAttribute("href").slice(1)] = a; });

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("active"); });
        var active = linkFor[entry.target.id];
        if (active) active.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });

    /* ---------- Reveal on scroll ---------- */
    var revealTargets = document.querySelectorAll(
      ".mvv-card, .service-card, .feature, .gallery-item, .section-head, .contact-form"
    );
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      revealObs.observe(el);
    });
  }

  /* ---------- Voltar ao topo ---------- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Ano no rodapé ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Formulário -> WhatsApp ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["nome", "mensagem"].forEach(function (id) {
        var input = form.elements[id];
        var wrap = input.closest(".field");
        if (!input.value.trim()) { wrap.classList.add("invalid"); ok = false; }
        else { wrap.classList.remove("invalid"); }
      });
      if (!ok) return;

      var nome = form.elements.nome.value.trim();
      var email = form.elements.email.value.trim();
      var tel = form.elements.telefone.value.trim();
      var msg = form.elements.mensagem.value.trim();

      var texto =
        "Olá, Orient Lara! Meu nome é " + nome + "." +
        (tel ? "\nTelefone: " + tel : "") +
        (email ? "\nE-mail: " + email : "") +
        "\n\n" + msg;

      var url = "https://wa.me/5511987427994?text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener");
    });

    form.addEventListener("input", function (e) {
      var wrap = e.target.closest(".field");
      if (wrap && e.target.value.trim()) wrap.classList.remove("invalid");
    });
  }

  /* ---------- Galeria de obras + lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll("#gallery .gallery-item"));
  var lightbox = document.getElementById("lightbox");

  if (galleryItems.length && lightbox) {
    var lbImg = document.getElementById("lb-img");
    var lbCaption = document.getElementById("lb-caption");
    var lbPrev = lightbox.querySelector(".lb-prev");
    var lbNext = lightbox.querySelector(".lb-next");
    var lbClose = lightbox.querySelector(".lb-close");
    var current = 0;
    var lastFocused = null;

    var slides = galleryItems.map(function (item) {
      var cap = item.querySelector("span");
      return {
        src: item.getAttribute("data-full") || (item.querySelector("img") || {}).src,
        caption: cap ? cap.textContent.trim() : "",
      };
    });

    function show(i) {
      current = (i + slides.length) % slides.length;
      lbImg.src = slides[current].src;
      lbImg.alt = slides[current].caption;
      lbCaption.textContent = slides[current].caption;
    }

    function openLightbox(i) {
      lastFocused = document.activeElement;
      show(i);
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-open");
      requestAnimationFrame(function () { lightbox.classList.add("open"); });
      lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-open");
      window.setTimeout(function () { lightbox.hidden = true; lbImg.src = ""; }, 250);
      if (lastFocused) lastFocused.focus();
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener("click", function () { openLightbox(i); });
    });
    lbPrev.addEventListener("click", function () { show(current - 1); });
    lbNext.addEventListener("click", function () { show(current + 1); });
    lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("lb-stage")) closeLightbox();
    });
    window.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  }
})();
