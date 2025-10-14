// IntersectionObserver for reveal & view_section events
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      trackViewSection(e.target.id);
    }
  });
},{threshold:0.3});

document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Tracking
function gtagSafe(){ return (window.gtag||function(){ (window.dataLayer=window.dataLayer||[]).push(arguments); }); }
function trackViewSection(id){ gtagSafe()('event','view_section',{section_id:id}); }
function trackClickCTA(location){ gtagSafe()('event','click_CTA',{location}); }
function trackSubmit(){ gtagSafe()('event','submit_order'); }

// CTA links (replace with real LINE URL)
const LINE_URL = "https://lin.ee/your-id?utm_source=lp&utm_medium=cta&utm_campaign=order";

['ctaHero','ctaMid','ctaLast','ctaSticky'].forEach(id=>{
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('click',(ev)=>{
    ev.preventDefault();
    trackClickCTA(id);
    window.location.href = LINE_URL;
  });
});

// Simple stock indicator (pseudo scarcity; replace with real)
(function(){
  const el = document.getElementById('stockCount');
  if(!el) return;
  const base = 30; // 30 meals/day
  const hour = new Date().getHours();
  const sold = Math.floor((hour/24) * (10 + Math.random()*10));
  const left = Math.max(base - sold, 3);
  el.textContent = left + "食";
})();
