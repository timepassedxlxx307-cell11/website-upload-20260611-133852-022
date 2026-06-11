(function () {
    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function setupNavigation() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var links = document.querySelector('[data-nav-links]');
        if (!toggle || !links) {
            return;
        }
        toggle.addEventListener('click', function () {
            links.classList.toggle('is-open');
        });
    }

    function setupHeaderSearch() {
        var forms = document.querySelectorAll('.site-search-form');
        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = form.querySelector('input[name="q"]');
                var query = input ? input.value.trim() : '';
                if (!query) {
                    event.preventDefault();
                    return;
                }
            });
        });
    }

    function setupHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            start();
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        if (slides.length > 1) {
            start();
        }
    }

    function setupFilters() {
        var roots = document.querySelectorAll('[data-filter-root]');
        roots.forEach(function (root) {
            var queryInput = root.querySelector('[data-filter-query]');
            var yearSelect = root.querySelector('[data-filter-year]');
            var typeSelect = root.querySelector('[data-filter-type]');
            var categorySelect = root.querySelector('[data-filter-category]');
            var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));
            var empty = root.querySelector('[data-empty-result]');
            var params = new URLSearchParams(location.search);
            var initialQuery = params.get('q');

            if (initialQuery && queryInput) {
                queryInput.value = initialQuery;
            }

            function cardText(card) {
                return normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' '));
            }

            function applyFilters() {
                var query = normalize(queryInput ? queryInput.value : '');
                var year = normalize(yearSelect ? yearSelect.value : '');
                var type = normalize(typeSelect ? typeSelect.value : '');
                var category = normalize(categorySelect ? categorySelect.value : '');
                var visible = 0;

                cards.forEach(function (card) {
                    var matchesQuery = !query || cardText(card).indexOf(query) !== -1;
                    var matchesYear = !year || normalize(card.getAttribute('data-year')) === year;
                    var matchesType = !type || normalize(card.getAttribute('data-type')) === type;
                    var matchesCategory = !category || normalize(card.querySelector('.movie-card-topline span').textContent) === category;
                    var showCard = matchesQuery && matchesYear && matchesType && matchesCategory;
                    card.style.display = showCard ? '' : 'none';
                    if (showCard) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            [queryInput, yearSelect, typeSelect, categorySelect].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', applyFilters);
                    control.addEventListener('change', applyFilters);
                }
            });

            applyFilters();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupNavigation();
        setupHeaderSearch();
        setupHero();
        setupFilters();
    });
})();
