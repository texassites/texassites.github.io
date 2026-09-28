(function () {
  "use strict";

  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var panel = document.getElementById("navPanel");
    if (!toggle || !panel) return;

    var close = function () {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) close();
    });
  }

  function initServices() {
    var rows = document.querySelectorAll(".track");
    if (!rows.length) return;
    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        row.classList.add("service-active");
      });
      row.addEventListener("mouseleave", function () {
        row.classList.remove("service-active");
      });
    });
  }

  function initSignup() {
    var form = document.getElementById("signupForm");
    if (!form) return;

    var ok = document.getElementById("signupOk");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var setError = function (name, msg) {
      var field = form.querySelector('[name="' + name + '"]');
      var slot = form.querySelector('[data-err="' + name + '"]');
      if (slot) slot.textContent = msg;
      if (field) field.setAttribute("aria-invalid", msg ? "true" : "false");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var email = form.querySelector('[name="email"]');
      var project = form.querySelector('[name="project"]');
      var valid = true;

      if (!name.value.trim()) { setError("name", "Please enter your name."); valid = false; }
      else { setError("name", ""); }

      if (!phone.value.trim()) { setError("phone", "Please enter a phone number."); valid = false; }
      else { setError("phone", ""); }

      if (!emailRe.test(email.value.trim())) { setError("email", "Enter a valid email address."); valid = false; }
      else { setError("email", ""); }

      if (!project.value.trim()) { setError("project", "Tell us what needs attention."); valid = false; }
      else { setError("project", ""); }

      if (!valid) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        if (ok) ok.classList.remove("show");
        return;
      }

      form.reset();
      if (ok) ok.classList.add("show");
    });

    form.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") {
          setError(field.getAttribute("name"), "");
        }
      });
    });
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  function initBackToTop() {
    var backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;

    var update = function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 500);
    };

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function boot() {
    initHeader();
    initMobileNav();
    initServices();
    initSignup();
    initReveal();
    initBackToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();