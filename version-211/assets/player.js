(function(){
function mount(id,src){
var video=document.getElementById(id);
if(!video||!src)return;
var button=document.querySelector('[data-player-button="'+id+'"]');
var loaded=false,hls=null;
function load(){
if(loaded)return;
loaded=true;
if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src}
else if(window.Hls&&window.Hls.isSupported()){hls=new window.Hls();hls.loadSource(src);hls.attachMedia(video)}
else{video.src=src}
}
function start(){
load();
var p=video.play();
if(p&&p.catch){p.catch(function(){})}
}
load();
if(button){button.addEventListener('click',function(){start()})}
video.addEventListener('play',function(){if(button){button.classList.add('is-hidden')}});
video.addEventListener('pause',function(){if(button&&video.currentTime===0){button.classList.remove('is-hidden')}});
}
window.SitePlayer={mount:mount};
})();
