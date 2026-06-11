(function() {
    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function updateFilter(scope) {
        var textInput = scope.querySelector("[data-filter-input]");
        var typeSelect = scope.querySelector("[data-type-filter]");
        var yearSelect = scope.querySelector("[data-year-filter]");
        var categorySelect = scope.querySelector("[data-category-filter]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".js-movie-card"));
        var keyword = normalize(textInput ? textInput.value : "");
        var typeValue = normalize(typeSelect ? typeSelect.value : "");
        var yearValue = normalize(yearSelect ? yearSelect.value : "");
        var categoryValue = normalize(categorySelect ? categorySelect.value : "");
        var visibleCount = 0;

        cards.forEach(function(card) {
            var text = normalize(card.getAttribute("data-search"));
            var type = normalize(card.getAttribute("data-type"));
            var year = normalize(card.getAttribute("data-year"));
            var category = normalize(card.getAttribute("data-category"));
            var matched = true;

            if (keyword && text.indexOf(keyword) === -1) {
                matched = false;
            }

            if (typeValue && type !== typeValue) {
                matched = false;
            }

            if (yearValue && year !== yearValue) {
                matched = false;
            }

            if (categoryValue && category !== categoryValue) {
                matched = false;
            }

            card.classList.toggle("is-filtered-out", !matched);
            if (matched) {
                visibleCount += 1;
            }
        });

        var counter = scope.querySelector("[data-result-count]");
        if (counter) {
            counter.textContent = visibleCount + " 部";
        }
    }

    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function() {
            mobileNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero-slider]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function showSlide(index) {
            current = index;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener("click", function() {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function() {
                showSlide((current + 1) % slides.length);
            }, 5200);
        }
    }

    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));

    scopes.forEach(function(scope) {
        var textInput = scope.querySelector("[data-filter-input]");
        var typeSelect = scope.querySelector("[data-type-filter]");
        var yearSelect = scope.querySelector("[data-year-filter]");
        var categorySelect = scope.querySelector("[data-category-filter]");

        [textInput, typeSelect, yearSelect, categorySelect].forEach(function(control) {
            if (control) {
                control.addEventListener("input", function() {
                    updateFilter(scope);
                });
                control.addEventListener("change", function() {
                    updateFilter(scope);
                });
            }
        });

        if (scope.hasAttribute("data-search-page") && textInput) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query) {
                textInput.value = query;
            }
        }

        updateFilter(scope);
    });
})();
