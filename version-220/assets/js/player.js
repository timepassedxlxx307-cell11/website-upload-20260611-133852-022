function setupMoviePlayer(source) {
    const video = document.getElementById('movie-player');
    const cover = document.getElementById('play-cover');
    let initialized = false;
    let instance = null;

    function attachSource() {
        if (!video || initialized || !source) {
            return;
        }
        initialized = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            instance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            instance.loadSource(source);
            instance.attachMedia(video);
            return;
        }

        video.src = source;
    }

    function playVideo() {
        attachSource();
        if (cover) {
            cover.classList.add('is-hidden');
        }
        if (video) {
            const promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }
    }

    if (cover) {
        cover.addEventListener('click', playVideo);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
        video.addEventListener('play', function () {
            if (cover) {
                cover.classList.add('is-hidden');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', attachSource);
    window.addEventListener('beforeunload', function () {
        if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
        }
    });
}
