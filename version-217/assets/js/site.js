(() => {
  const SELECTORS = {
    navToggle: '[data-nav-toggle]',
    navMenu: '[data-nav-menu]',
    hero: '[data-hero-carousel]',
    searchInput: '[data-search-input]',
    typeFilter: '[data-type-filter]',
    yearFilter: '[data-year-filter]',
    categoryFilter: '[data-category-filter]',
    resultCount: '[data-result-count]',
    searchableCard: '[data-search-card]',
    player: '[data-player]'
  };

  function setupNavigation() {
    const toggle = document.querySelector(SELECTORS.navToggle);
    const menu = document.querySelector(SELECTORS.navMenu);

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function setupHeroCarousel() {
    const carousel = document.querySelector(SELECTORS.hero);

    if (!carousel) {
      return;
    }

    const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
    const previous = carousel.querySelector('[data-hero-prev]');
    const next = carousel.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === current);
        dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(() => showSlide(current + 1), 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        startTimer();
      });
    });

    if (previous) {
      previous.addEventListener('click', () => {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        showSlide(current + 1);
        startTimer();
      });
    }

    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  function textOf(value) {
    return String(value || '').trim().toLowerCase();
  }

  function setupSearchAndFilters() {
    const input = document.querySelector(SELECTORS.searchInput);
    const typeFilter = document.querySelector(SELECTORS.typeFilter);
    const yearFilter = document.querySelector(SELECTORS.yearFilter);
    const categoryFilter = document.querySelector(SELECTORS.categoryFilter);
    const cards = Array.from(document.querySelectorAll(SELECTORS.searchableCard));
    const resultCount = document.querySelector(SELECTORS.resultCount);

    if (!cards.length || (!input && !typeFilter && !yearFilter && !categoryFilter)) {
      return;
    }

    function cardMatches(card) {
      const keyword = textOf(input && input.value);
      const typeValue = textOf(typeFilter && typeFilter.value);
      const yearValue = textOf(yearFilter && yearFilter.value);
      const categoryValue = textOf(categoryFilter && categoryFilter.value);
      const searchableText = textOf([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.tags,
        card.dataset.category
      ].join(' '));

      const matchesKeyword = !keyword || searchableText.includes(keyword);
      const matchesType = !typeValue || textOf(card.dataset.type).includes(typeValue);
      const matchesCategory = !categoryValue || textOf(card.dataset.category).includes(categoryValue);
      let matchesYear = true;

      if (yearValue === '2020+') {
        matchesYear = Number(card.dataset.year || 0) >= 2020;
      } else if (yearValue === '2010-2019') {
        const year = Number(card.dataset.year || 0);
        matchesYear = year >= 2010 && year <= 2019;
      } else if (yearValue === '2000-2009') {
        const year = Number(card.dataset.year || 0);
        matchesYear = year >= 2000 && year <= 2009;
      } else if (yearValue === 'before-2000') {
        const year = Number(card.dataset.year || 0);
        matchesYear = year > 0 && year < 2000;
      }

      return matchesKeyword && matchesType && matchesYear && matchesCategory;
    }

    function updateResults() {
      let visibleCount = 0;
      cards.forEach((card) => {
        const matches = cardMatches(card);
        card.classList.toggle('is-hidden', !matches);
        if (matches) {
          visibleCount += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = `当前显示 ${visibleCount} 部影片`;
      }
    }

    [input, typeFilter, yearFilter, categoryFilter].forEach((control) => {
      if (control) {
        control.addEventListener('input', updateResults);
        control.addEventListener('change', updateResults);
      }
    });

    updateResults();
  }

  function setupImageFallback() {
    document.querySelectorAll('img').forEach((image) => {
      image.addEventListener('error', () => {
        image.classList.add('image-missing');
        image.setAttribute('aria-hidden', 'true');
      }, { once: true });
    });
  }

  function setupVideoPlayers() {
    const players = Array.from(document.querySelectorAll(SELECTORS.player));

    players.forEach((player) => {
      const video = player.querySelector('video');
      const button = player.querySelector('[data-play-button]');
      const source = player.dataset.source || (video && video.dataset.source);

      if (!video || !source) {
        return;
      }

      function attachSource() {
        if (video.dataset.ready === 'true') {
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          player.hlsInstance = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          video.src = source;
        }

        video.dataset.ready = 'true';
      }

      function playVideo() {
        attachSource();
        player.classList.add('is-playing');
        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            player.classList.remove('is-playing');
          });
        }
      }

      if (button) {
        button.addEventListener('click', playVideo);
      }

      video.addEventListener('play', () => player.classList.add('is-playing'));
      video.addEventListener('pause', () => {
        if (video.currentTime === 0 || video.ended) {
          player.classList.remove('is-playing');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupHeroCarousel();
    setupSearchAndFilters();
    setupImageFallback();
    setupVideoPlayers();
  });
})();
