(function () {
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const prev = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === current);
        });
    }

    function startHero() {
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    if (slides.length) {
        showSlide(0);
        startHero();
        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startHero();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startHero();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startHero();
            });
        });
    }

    const cardList = document.querySelector('.js-card-list');
    const input = document.querySelector('.js-filter-input');
    const empty = document.querySelector('.js-empty-state');
    const buttons = Array.from(document.querySelectorAll('[data-filter-type], [data-filter-region]'));
    let selectedType = 'all';
    let selectedRegion = 'all';

    function applyFilters() {
        if (!cardList) {
            return;
        }
        const cards = Array.from(cardList.children);
        const query = input ? input.value.trim().toLowerCase() : '';
        let visible = 0;

        cards.forEach(function (card) {
            const text = (card.getAttribute('data-search') || '').toLowerCase();
            const type = card.getAttribute('data-type') || '';
            const region = card.getAttribute('data-region') || '';
            const matchQuery = !query || text.indexOf(query) !== -1;
            const matchType = selectedType === 'all' || type === selectedType;
            const matchRegion = selectedRegion === 'all' || region.indexOf(selectedRegion) !== -1;
            const match = matchQuery && matchType && matchRegion;
            card.hidden = !match;
            if (match) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    if (input || buttons.length) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query && input) {
            input.value = query;
        }

        if (input) {
            input.addEventListener('input', applyFilters);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                if (button.hasAttribute('data-filter-type')) {
                    selectedType = button.getAttribute('data-filter-type') || 'all';
                    buttons.filter(function (item) {
                        return item.hasAttribute('data-filter-type');
                    }).forEach(function (item) {
                        item.classList.toggle('active', item === button);
                    });
                }
                if (button.hasAttribute('data-filter-region')) {
                    const value = button.getAttribute('data-filter-region') || 'all';
                    selectedRegion = selectedRegion === value ? 'all' : value;
                    buttons.filter(function (item) {
                        return item.hasAttribute('data-filter-region');
                    }).forEach(function (item) {
                        item.classList.toggle('active', item === button && selectedRegion !== 'all');
                    });
                }
                applyFilters();
            });
        });

        applyFilters();
    }
})();
