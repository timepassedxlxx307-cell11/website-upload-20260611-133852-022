(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var filterRoot = document.querySelector('[data-filter-root]');
    if (filterRoot) {
        var input = filterRoot.querySelector('[data-filter-input]');
        var selects = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-filter-select]'));
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var empty = document.querySelector('[data-no-results]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (input && query) {
            input.value = query;
        }
        var apply = function () {
            var words = input ? input.value.trim().toLowerCase() : '';
            var filters = {};
            selects.forEach(function (select) {
                if (select.value) {
                    filters[select.getAttribute('data-filter-select')] = select.value;
                }
            });
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var ok = !words || text.indexOf(words) !== -1;
                Object.keys(filters).forEach(function (key) {
                    if ((card.getAttribute('data-' + key) || '') !== filters[key]) {
                        ok = false;
                    }
                });
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        };
        if (input) {
            input.addEventListener('input', apply);
        }
        selects.forEach(function (select) {
            select.addEventListener('change', apply);
        });
        apply();
    }

    if (typeof playerOptions !== 'undefined') {
        var video = document.querySelector('[data-player-video]');
        var shell = document.querySelector('[data-player-shell]');
        var overlay = document.querySelector('[data-player-overlay]');
        var started = false;
        var hlsInstance = null;
        var begin = function () {
            if (!video || !playerOptions.source) {
                return;
            }
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            if (!started) {
                started = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = playerOptions.source;
                    video.play().catch(function () {});
                } else if (window.Hls && Hls.isSupported()) {
                    hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
                    hlsInstance.loadSource(playerOptions.source);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                } else {
                    video.src = playerOptions.source;
                    video.play().catch(function () {});
                }
            } else {
                video.play().catch(function () {});
            }
        };
        if (shell) {
            shell.addEventListener('click', function (event) {
                if (event.target && event.target.closest && event.target.closest('video')) {
                    return;
                }
                begin();
            });
        }
        var button = document.querySelector('[data-player-start]');
        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                begin();
            });
        }
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
