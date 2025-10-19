// Reveal animation & section view tracking
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      track('view_section', {section_id: e.target.id});
    }
  });
},{threshold:0.3});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// GA4 stub
function gtagSafe(){ return (window.gtag||function(){ (window.dataLayer=window.dataLayer||[]).push(arguments); }); }
function track(name, params={}){ gtagSafe()('event', name, params); }

// A/B: CTA copy
(function ab(){
  const conf = window.MINAMOTO_CONFIG || {};
  const vars = conf.AB_VARIANTS || ["今すぐ食べる", "LINEで注文"];
  let v = localStorage.getItem('ab_cta_v');
  if(!v){ v = Math.random() < 0.5 ? 'A' : 'B'; localStorage.setItem('ab_cta_v', v); track('ab_assign', {variant: v}); }
  const text = (v==='A')? vars[0] : vars[1];
  const ids = ['ctaHero','ctaMid','ctaLast','ctaSticky'];
  ids.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = text;
  });
})();

// CTA clicks
const LINE_URL = (window.MINAMOTO_CONFIG && window.MINAMOTO_CONFIG.LINE_URL) || "#";
['ctaHero','ctaMid','ctaLast','ctaSticky'].forEach(id=>{
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('click',(ev)=>{
    ev.preventDefault();
    track('click_CTA',{location:id, variant: localStorage.getItem('ab_cta_v')||'A'});
    window.location.href = LINE_URL;
  });
});

// Simple stock indicator (pseudo)
(function(){
  const el = document.getElementById('stockCount');
  if(!el) return;
  const base = 30; // 30 meals/day
  const hour = new Date().getHours();
  const sold = Math.floor((hour/24) * (10 + Math.random()*10));
  const left = Math.max(base - sold, 3);
  el.textContent = left + "食";
})();
