(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var panel = document.querySelector("[data-mobile-panel]");

    if (menuButton && panel) {
      menuButton.addEventListener("click", function () {
        var opened = panel.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === current);
        });

        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    var searchInput = document.querySelector("[data-page-search]");
    var grid = document.querySelector("[data-filter-grid]");
    var empty = document.querySelector("[data-empty-state]");

    if (searchInput && grid) {
      if (searchInput.hasAttribute("data-url-query")) {
        var params = new URLSearchParams(window.location.search);
        var key = searchInput.getAttribute("data-url-query");
        if (params.has(key)) {
          searchInput.value = params.get(key) || "";
        }
      }

      var items = Array.prototype.slice.call(grid.querySelectorAll("[data-filter-item]"));

      function applyFilter() {
        var keyword = searchInput.value.trim().toLowerCase();
        var visible = 0;

        items.forEach(function (item) {
          var haystack = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
          var matched = !keyword || haystack.indexOf(keyword) !== -1;
          item.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      searchInput.addEventListener("input", applyFilter);
      applyFilter();
    }
  });
})();
