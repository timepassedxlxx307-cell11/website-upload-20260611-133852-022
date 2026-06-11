function initMoviePlayer(source, videoId, overlayId, errorId) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  var errorBox = document.getElementById(errorId);
  var hls = null;

  if (!video || !source) {
    return;
  }

  function showError(text) {
    if (!errorBox) {
      return;
    }
    errorBox.textContent = text;
    errorBox.hidden = false;
  }

  function hideError() {
    if (errorBox) {
      errorBox.hidden = true;
      errorBox.textContent = "";
    }
  }

  function bindSource() {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      hideError();
      return;
    }
    if (window.Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showError("视频暂时无法加载，请稍后再试");
        }
      });
      hideError();
      return;
    }
    showError("当前环境暂时无法播放该视频");
  }

  function play() {
    hideError();
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    var action = video.play();
    if (action && typeof action.catch === "function") {
      action.catch(function () {
        if (overlay) {
          overlay.classList.remove("is-hidden");
        }
      });
    }
  }

  bindSource();

  if (overlay) {
    overlay.addEventListener("click", play);
  }

  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  });

  video.addEventListener("pause", function () {
    if (overlay && video.currentTime === 0) {
      overlay.classList.remove("is-hidden");
    }
  });

  video.addEventListener("error", function () {
    showError("视频暂时无法加载，请稍后再试");
  });

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
