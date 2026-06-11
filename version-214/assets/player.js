(function () {
    function setupPlayer(root) {
        var video = root.querySelector('video[data-hls]');
        var button = root.querySelector('[data-play-button]');
        var status = root.querySelector('[data-player-status]');
        var source = video ? video.getAttribute('data-hls') : '';
        var hls = null;
        var ready = false;

        if (!video || !button || !source) {
            return;
        }

        function setStatus(text) {
            if (status) {
                status.textContent = text || '';
            }
        }

        function attach() {
            if (ready) {
                return true;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setStatus('');
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        setStatus('网络连接异常，正在重新加载');
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        setStatus('媒体加载异常，正在恢复播放');
                        hls.recoverMediaError();
                    } else {
                        setStatus('暂时无法播放该视频');
                    }
                });
                ready = true;
                return true;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                ready = true;
                return true;
            }

            setStatus('暂时无法播放该视频');
            return false;
        }

        function play() {
            if (!attach()) {
                return;
            }
            video.controls = true;
            button.classList.add('is-hidden');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    button.classList.remove('is-hidden');
                    setStatus('点击播放按钮继续观看');
                });
            }
        }

        function toggle() {
            if (video.paused) {
                play();
            } else {
                video.pause();
                button.classList.remove('is-hidden');
            }
        }

        button.addEventListener('click', play);
        video.addEventListener('click', toggle);
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            button.classList.remove('is-hidden');
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-player]').forEach(setupPlayer);
    });
})();
