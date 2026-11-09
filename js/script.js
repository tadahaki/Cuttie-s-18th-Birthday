/* =====================================================
   EDIT YOUR EVENT DETAILS HERE
   ===================================================== */
const CONFIG = {
  name: "Cuttie Dulay Aguelo",
  eventDate: "2026-11-14",        // YYYY-MM-DD
  startTime: "",                  // 24h "18:00" (leave "" until confirmed)
  endTime:   "",                  // 24h "22:00" (optional)
  timeLabel: "",                  // e.g. "6:00 PM"
  venueName: "Dulay Residence",
  address:   "Duangan, Esperanza, Agusan del Sur",
  dressCode: "",                  // e.g. "Formal · Royal Blue & Silver"
};

const GUESTS = {
  roses: ["Lanz Gabriel Aguelo","Zymon Dulay","Bryan Lou Dulay","Aeron James Magayon","April Balabis","Bjay Felipe Apura","Khen Laurence Manla","Jericho Cosicol","Marlo Nazii","Kent Pama","Karlvhin Ramos","Luke Siohan","Ralph Abejaron","James Paculio","Ryan Remz Reyes","Harkey Jone Cartagena","Lester Jay Remedio","Joergely Aguelo"],
  candles: ["Rheanna Aguelo","Leanne Aguelo","Daniela Lyn Dulay","Diana Feb Dulay","Haide Jane Dulay","Thryl Dulay","Naica Balinton","Stephanie Palaca","Richaill Sag-od","Fhevis Chavaria","Charise Osano","Teresa Engcoy","Chillie Canete","Claire Cabahug","Britney Sarco","Saicy Russel","Diane Tubongbanua","Lourdes Aguelo"],
  treasures: ["Sheena Kay Canonigo Abarca","Romnick Encarnacion Campaña","Daisy Penit","Raiel Arayan Borja","Ivy Jane Tizon","Shari Angelee Lusaya","Let Thia","Hannah Sapla","Rica Dultra","Kai Cuestas","Hanny Canoy","Isha Faith Legaspi","Regine Lumata","Ronalyn Cuestas","Jhonamie Badillia","Precious Balquin Lunasin","Je-an Alcantara","Ryza MariKit Samonte"]
};

const PROGRAM = [
  { phase:"Welcome", items:["Welcome Remarks","Grand Entrance of the Debutante"] },
  { phase:"Traditions", items:["18 Roses",["Intermission Number","James Paculio"],"18 Candles","18 Treasures"] },
  { phase:"Dinner", items:["Prayer Before Meals","Dinner Proper"] },
  { phase:"Celebration", items:["Birthday Song","Cake-Blowing Ceremony","Special Messages and Presentations","Debutante's Thank-You Message"] },
  { phase:"Closing", items:["Closing Remarks","Parlor Games","Photo Opportunity","Dance Party"] }
];

/* =====================================================
   Helpers
   ===================================================== */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = n => String(n).padStart(2,'0');

/* Missing photo -> monogram fallback */
$$('img').forEach(img => {
  const fail = () => { const p = img.closest('.photo-frame,.poster,.thumb'); if(p) p.classList.add('missing'); img.style.display='none'; };
  img.addEventListener('error', fail);
  if(img.complete && img.naturalWidth===0) fail();
});
/* Venue photo shows only if images/venue.jpg exists */
(function(){
  const box = $('#venueBox'), img = $('#venueImg');
  const ok = () => box.classList.add('has-photo');
  if(img.complete && img.naturalWidth>0) ok(); else img.addEventListener('load', ok);
})();

/* =====================================================
   Glitter particles
   ===================================================== */
(function(){
  const c = $('#glitter'), x = c.getContext('2d');
  let w, h, dots = [];
  const mk = rand => ({ x:Math.random()*w, y:rand?Math.random()*h:h+10, r:Math.random()*1.8+.4,
    vy:-(Math.random()*.25+.05), vx:(Math.random()-.5)*.15, t:Math.random()*6.28, s:Math.random()*.03+.01,
    c:Math.random()<.4?'212,175,114':(Math.random()<.5?'197,202,213':'255,255,255') });
  const resize = () => { w = c.width = innerWidth; h = c.height = innerHeight;
    const n = Math.min(90, Math.floor(w*h/16000)); dots = Array.from({length:n}, () => mk(true)); };
  function frame(){
    x.clearRect(0,0,w,h);
    for(const d of dots){
      d.t += d.s; d.x += d.vx; d.y += d.vy;
      if(d.y < -10) Object.assign(d, mk(false));
      const a = (Math.sin(d.t)+1)/2*.75+.1;
      x.beginPath(); x.fillStyle = `rgba(${d.c},${a})`; x.arc(d.x,d.y,d.r,0,6.28); x.fill();
      if(d.r>1.5){ x.strokeStyle=`rgba(${d.c},${a*.6})`; x.lineWidth=.6;
        x.beginPath(); x.moveTo(d.x-d.r*3,d.y); x.lineTo(d.x+d.r*3,d.y); x.moveTo(d.x,d.y-d.r*3); x.lineTo(d.x,d.y+d.r*3); x.stroke(); }
    }
    if(!reduced) requestAnimationFrame(frame);
  }
  addEventListener('resize', resize); resize(); frame();
})();

/* =====================================================
   01 Opening: envelope -> doors -> invitation
   ===================================================== */
(function(){
  const intro = $('#intro'); let started = false;
  function open(){
    if(started) return; started = true;
    intro.classList.add('open');
    setTimeout(() => intro.classList.add('leaving'), reduced?200:2700);
    setTimeout(() => { intro.classList.add('opened'); document.body.classList.remove('locked'); scrollTo(0,0); revealNow(); }, reduced?300:3200);
    setTimeout(() => intro.remove(), reduced?600:5200);
  }
  $('#openBtn').addEventListener('click', open);
  $('.envelope').addEventListener('click', open);
  $('#sealBtn').addEventListener('click', open);
})();

/* =====================================================
   Event info
   ===================================================== */
const TBA = '<span style="opacity:.75;font-style:italic">To be announced</span>';
const eventDay = new Date(CONFIG.eventDate + 'T00:00:00');
$('#dDate').innerHTML = eventDay.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}).replace(', ',',<br>');
$('#dTime').innerHTML = CONFIG.timeLabel || TBA;
$('#dVenue').innerHTML = CONFIG.venueName || TBA;
$('#dDress').innerHTML = CONFIG.dressCode || TBA;
$('#vName').textContent = CONFIG.venueName;
$('#vAddr').textContent = CONFIG.address;
(function(){
  /* The residence isn't listed on Google Maps, so directions point to the barangay/town */
  const q = encodeURIComponent(CONFIG.address);
  $('#dirBtn').href = 'https://www.google.com/maps/dir/?api=1&destination=' + q;
})();

/* Calendar */
(function(){
  const d = CONFIG.eventDate.replace(/-/g,'');
  const next = new Date(eventDay.getTime()+864e5); const dn = next.getFullYear()+pad(next.getMonth()+1)+pad(next.getDate());
  const timed = !!CONFIG.startTime;
  const t = s => s.replace(':','') + '00';
  const start = timed ? d+'T'+t(CONFIG.startTime) : d;
  const end = timed ? d+'T'+t(CONFIG.endTime || CONFIG.startTime) : dn;
  const title = "Cuttie's 18th Birthday Celebration";
  const loc = [CONFIG.venueName, CONFIG.address].filter(Boolean).join(', ');
  const desc = 'You are cordially invited to the 18th birthday celebration of ' + CONFIG.name + '.';
  $('#gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title)
    + '&dates=' + start + '/' + end + '&details=' + encodeURIComponent(desc) + '&location=' + encodeURIComponent(loc);
  $('#icsBtn').addEventListener('click', () => {
    const dtLine = timed ? ['DTSTART:'+start,'DTEND:'+end] : ['DTSTART;VALUE=DATE:'+start,'DTEND;VALUE=DATE:'+end];
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Royal Invitation//EN','BEGIN:VEVENT','UID:debut-'+d+'@invitation',
      'DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z', ...dtLine,
      'SUMMARY:'+title, 'LOCATION:'+loc.replace(/,/g,'\\,'), 'DESCRIPTION:'+desc,
      'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY','DESCRIPTION:Tomorrow: '+title,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics],{type:'text/calendar'})); a.download = 'cuttie-18th-birthday.ics';
    document.body.appendChild(a); a.click(); a.remove();
  });
})();

/* Countdown */
(function(){
  const box = $('#countdown');
  const target = new Date(CONFIG.eventDate + 'T' + (CONFIG.startTime || '00:00') + ':00');
  function tick(){
    const diff = target - new Date();
    if(diff <= 0){ box.innerHTML = '<p class="gold-text" style="font-family:var(--script);font-size:2.2rem">The celebration has begun!</p>'; return; }
    const d = Math.floor(diff/864e5), h = Math.floor(diff%864e5/36e5), m = Math.floor(diff%36e5/6e4), s = Math.floor(diff%6e4/1e3);
    box.innerHTML = [['Days',d],['Hours',h],['Mins',m],['Secs',s]].map(([l,v]) => `<div class="cd"><b>${pad(v)}</b><small>${l}</small></div>`).join('');
  }
  tick(); setInterval(tick, 1000);
})();

/* Gallery: auto-changes every 5s, thumbnails still clickable */
(function(){
  const main = $('#mainImg'), frame = $('#mainPhoto'), portrait = $('#portrait');
  const thumbs = $$('#thumbs .thumb'); let cur = 0, timer = null;
  function show(i){
    cur = (i + thumbs.length) % thumbs.length;
    thumbs.forEach((t,k) => t.classList.toggle('active', k === cur));
    frame.classList.add('swapping'); frame.classList.remove('missing'); main.style.display='';
    main.src = thumbs[cur].dataset.src;
    setTimeout(() => frame.classList.remove('swapping'), 80);
  }
  function start(){ stop(); timer = setInterval(() => show(cur + 1), 5000); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }
  thumbs.forEach((b,k) => b.addEventListener('click', () => { show(k); start(); }));
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting && portrait.classList.contains('in') ? start() : stop()), {threshold:.3}).observe(portrait);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
})();

/* Tabs + lists */
Object.entries(GUESTS).forEach(([k, arr]) => { $('#l-'+k).innerHTML = arr.map(n => `<li>${n}</li>`).join(''); });
$$('.tab').forEach(t => t.addEventListener('click', () => {
  $$('.tab').forEach(x => x.setAttribute('aria-selected', x === t));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === 'p-' + t.dataset.tab));
}));

/* Program */
(function(){
  let i = 0, html = '';
  PROGRAM.forEach(g => {
    html += `<div class="phase reveal">${g.phase}</div>`;
    g.items.forEach(it => {
      i++; const [title, sub] = Array.isArray(it) ? it : [it];
      html += `<div class="step reveal"><div class="dot">${pad(i)}</div><div class="txt">${title}${sub ? `<small>${sub}</small>` : ''}</div></div>`;
    });
  });
  $('#timeline').innerHTML = html;
})();

/* =====================================================
   Scroll reveal + count-up
   ===================================================== */
let io;
function countUp(){
  const el = $('#num'); if(el.dataset.done) return; el.dataset.done = 1;
  if(reduced){ el.textContent = 18; return; }
  const t0 = performance.now(), dur = 2200;
  (function step(t){ const p = Math.min((t - t0)/dur, 1); el.textContent = Math.round(18 * (1 - Math.pow(1-p,3))); if(p<1) requestAnimationFrame(step); })(t0);
}
function revealNow(){
  io = new IntersectionObserver(es => es.forEach(e => {
    if(!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if(e.target.id === 'big18') countUp();
    if(e.target.id === 'closing') closing();
  }), { threshold: .15 });
  $$('.reveal,#closing').forEach(el => io.observe(el));
  const pt = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ $('#poster').classList.add('in'); pt.disconnect(); } }), {threshold:.3});
  pt.observe($('#poster'));
}

/* =====================================================
   Closing: floating crowns + fireworks
   ===================================================== */
const floaters = $('#floaters');
for(let i=0;i<12;i++){
  const s = document.createElement('span');
  s.style.left = (Math.random()*94)+'%'; s.style.animationDelay = (Math.random()*7)+'s';
  const sz = 18+Math.random()*18; s.style.width = sz+'px'; s.style.height = sz+'px';
  s.innerHTML = Math.random()<.5 ? '<svg viewBox="0 0 120 90" width="100%" height="100%"><use href="#crown"/></svg>' : '<svg viewBox="0 0 40 40" width="100%" height="100%" style="color:#C5CAD5"><use href="#flower"/></svg>';
  floaters.appendChild(s);
}
function closing(){
  if(reduced) return;
  const c = $('#fx'), x = c.getContext('2d'); let parts = [];
  const fit = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; }; fit(); addEventListener('resize', fit);
  const cols = ['#D4AF72','#C5CAD5','#ffffff','#f6e2b4','#7fa6e8'];
  function burst(px,py){
    const col = cols[Math.floor(Math.random()*cols.length)];
    for(let i=0;i<46;i++){ const a = Math.PI*2*i/46 + Math.random()*.2, sp = 1.5 + Math.random()*3.2;
      parts.push({x:px,y:py,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,col,r:1+Math.random()*1.6}); }
  }
  let last = 0;
  (function loop(t){
    x.clearRect(0,0,c.width,c.height);
    if(t - last > 1100){ last = t; burst(c.width*(.12+Math.random()*.76), c.height*(.1+Math.random()*.45)); }
    parts = parts.filter(p => p.life > 0);
    for(const p of parts){
      p.x += p.vx; p.y += p.vy; p.vy += .045; p.vx *= .985; p.life -= .014;
      x.globalAlpha = Math.max(p.life,0); x.fillStyle = p.col; x.beginPath(); x.arc(p.x,p.y,p.r,0,6.28); x.fill();
    }
    x.globalAlpha = 1; requestAnimationFrame(loop);
  })(0);
}
