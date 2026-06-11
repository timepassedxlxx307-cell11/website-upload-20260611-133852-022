(function(){
function q(s,r){return(r||document).querySelector(s)}
function qa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
document.addEventListener('DOMContentLoaded',function(){
var toggle=q('.nav-toggle'),links=q('.nav-links');
if(toggle&&links){toggle.addEventListener('click',function(){links.classList.toggle('is-open')})}
qa('[data-carousel]').forEach(function(box){
var slides=qa('.hero-slide',box),dots=qa('.hero-dot',box),i=0;
function show(n){if(!slides.length)return;i=(n+slides.length)%slides.length;slides.forEach(function(s,k){s.classList.toggle('is-active',k===i)});dots.forEach(function(d,k){d.classList.toggle('is-active',k===i)})}
dots.forEach(function(d,k){d.addEventListener('click',function(){show(k)})});
if(slides.length>1){setInterval(function(){show(i+1)},5200)}
});
qa('[data-filter-box]').forEach(function(box){
var target=q(box.getAttribute('data-target'))||document;
var cards=qa('.movie-card,.rank-row',target);
var input=q('[data-search-input]',box),year=q('[data-filter-year]',box),cat=q('[data-filter-category]',box),empty=q('.no-result',target.parentNode||document);
function apply(){
var term=(input&&input.value||'').trim().toLowerCase();
var y=year&&year.value||'';
var c=cat&&cat.value||'';
var shown=0;
cards.forEach(function(card){
var ok=true;
if(term){ok=(card.getAttribute('data-search')||'').toLowerCase().indexOf(term)>-1}
if(ok&&y){ok=(card.getAttribute('data-year')||'')===y}
if(ok&&c){ok=(card.getAttribute('data-category')||'')===c}
card.classList.toggle('hidden-card',!ok);
if(ok)shown++;
});
if(empty){empty.classList.toggle('is-active',shown===0)}
}
[input,year,cat].forEach(function(el){if(el){el.addEventListener('input',apply);el.addEventListener('change',apply)}});
});
});
})();
