/* Finite entrance animations. Content remains visible without JavaScript. */
(function () {
  'use strict';
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Set();
  const play=(element,frames,options)=>{
    if(motion.matches||!element.animate)return;
    const animation=element.animate(frames,options);animations.add(animation);
    animation.onfinish=()=>animations.delete(animation);
  };
  document.querySelectorAll('.hero-meta-kicker,.hero-creator-name,.hero-headline,.hero-subtext,.studio-availability,.hero-cta-group').forEach((el,index)=>{
    play(el,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,delay:index*75,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
  });
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){if(!entry.isIntersecting)continue;
      observer.unobserve(entry.target);
      play(entry.target,[{opacity:.3,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
  },{threshold:.08});
  document.querySelectorAll('.section-title-row,.project-info-pane,.project-browser-frame,.about-narrative-pane,.lab-module-card,.stack-category-card,.timeline-entry,.contact-card').forEach(el=>observer.observe(el));
  const calm=()=>{if(motion.matches){animations.forEach(animation=>animation.cancel());animations.clear();}};
  motion.addEventListener('change',calm);
  window.addEventListener('pagehide',event=>{if(event.persisted)return;observer.disconnect();calm();animations.forEach(animation=>animation.cancel());motion.removeEventListener('change',calm);},{once:true});
})();
