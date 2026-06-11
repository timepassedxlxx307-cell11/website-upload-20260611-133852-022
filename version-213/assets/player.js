function startMoviePlayer(movieUrl) {
    var video = document.getElementById("movie-player");
    var button = document.getElementById("movie-play-button");
    var attached = false;
    var hlsInstance = null;

    if (!video || !button || !movieUrl) {
        return;
    }

    function attachVideo() {
        if (attached) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = movieUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(movieUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = movieUrl;
        }

        attached = true;
    }

    function beginPlay() {
        attachVideo();
        video.controls = true;
        button.classList.add("is-hidden");
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function() {
                button.classList.remove("is-hidden");
            });
        }
    }

    button.addEventListener("click", beginPlay);
    video.addEventListener("click", function() {
        if (video.paused) {
            beginPlay();
        }
    });
    video.addEventListener("play", function() {
        button.classList.add("is-hidden");
    });
    video.addEventListener("pause", function() {
        if (!video.ended) {
            button.classList.remove("is-hidden");
        }
    });
    window.addEventListener("beforeunload", function() {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
