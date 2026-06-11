(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function openMobileMenu() {
    var button = qs('.menu-toggle');
    var panel = qs('.mobile-panel');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('active', idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('active', idx === current);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        show(idx);
        play();
      });
    });

    show(0);
    play();
  }

  function initFilter() {
    var input = qs('[data-filter-input]');
    var list = qs('[data-filter-list]');
    if (!input || !list) {
      return;
    }
    var cards = qsa('[data-title]', list);
    input.addEventListener('input', function () {
      var key = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        card.style.display = !key || haystack.indexOf(key) !== -1 ? '' : 'none';
      });
    });
  }

  function initSearchPage() {
    var root = qs('[data-search-page]');
    if (!root || !window.SITE_MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim();
    var input = qs('[name="q"]', root);
    var results = qs('[data-search-results]', root);
    var title = qs('[data-search-title]', root);
    if (input) {
      input.value = q;
    }
    if (!results) {
      return;
    }
    if (!q) {
      return;
    }
    var key = q.toLowerCase();
    var matched = window.SITE_MOVIES.filter(function (movie) {
      return [movie.title, movie.region, movie.type, movie.year, movie.tags, movie.oneLine].join(' ').toLowerCase().indexOf(key) !== -1;
    });
    if (title) {
      title.textContent = '搜索结果：' + q;
    }
    if (!matched.length) {
      results.innerHTML = '<p class="empty-state">未找到匹配内容，可以换一个关键词继续查找。</p>';
      return;
    }
    results.innerHTML = matched.map(function (movie) {
      return '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '">' +
        '<a class="movie-poster" href="./' + movie.file + '" aria-label="' + escapeHtml(movie.title) + '">' +
        '<img src="./' + movie.cover + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
        '<span class="movie-shade"></span><span class="play-dot">▶</span></a>' +
        '<div class="movie-card-body"><div class="movie-meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
        '<h3><a href="./' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>' +
        '<p>' + escapeHtml(movie.oneLine) + '</p></div></article>';
    }).join('');
  }

  function initPlayer() {
    var box = qs('[data-video-player]');
    if (!box) {
      return;
    }
    var video = qs('video', box);
    var button = qs('.player-button', box);
    var overlay = qs('.player-overlay', box);
    var source = box.getAttribute('data-video');
    var hls = null;
    var ready = false;

    function markPlaying() {
      if (overlay) {
        overlay.classList.add('hide');
      }
    }

    function start() {
      if (!video || !source) {
        return;
      }
      if (ready) {
        video.play().then(markPlaying).catch(function () {});
        return;
      }
      ready = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().then(markPlaying).catch(function () {});
        });
      } else {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          video.play().then(markPlaying).catch(function () {});
        }, { once: true });
        video.load();
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }
    video.addEventListener('play', markPlaying);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    openMobileMenu();
    initHero();
    initFilter();
    initSearchPage();
    initPlayer();
  });
})();
