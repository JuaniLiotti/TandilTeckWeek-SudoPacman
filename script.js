(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) document.body.classList.add('reduce-motion');

  // ---------- Matrix rain (pixel) ----------
  const mcanvas = document.getElementById('matrix');
  const mctx = mcanvas.getContext('2d');
  const chars = 'アァカサタナハマヤャラワ0123456789PIXEL';
  let drops = [];
  function resizeMatrix() {
    mcanvas.width = window.innerWidth;
    mcanvas.height = window.innerHeight;
    const cols = Math.floor(mcanvas.width / 16);
    drops = Array(cols).fill(1);
  }
  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);
  if (!reduce) {
    setInterval(() => {
      mctx.fillStyle = 'rgba(0,0,0,0.08)';
      mctx.fillRect(0,0,mcanvas.width,mcanvas.height);
      mctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--grass').trim() || '#6fa36a';
      mctx.font = '16px monospace';
      for (let i=0;i<drops.length;i++){
        const t = chars[Math.floor(Math.random()*chars.length)];
        mctx.fillText(t, i*16, drops[i]*16);
        if (drops[i]*16 > mcanvas.height && Math.random() > 0.975) drops[i]=0;
        drops[i]++;
      }
    }, 60);
  }

  // ---------- Theme switching ----------
  const root = document.documentElement;
  document.querySelectorAll('.swatch').forEach(s => {
    s.addEventListener('click', () => {
      root.dataset.theme = s.dataset.theme;
      try { localStorage.setItem('ttw-theme', s.dataset.theme); } catch {}
    });
  });
  try {
    const th = localStorage.getItem('ttw-theme');
    if (th) root.dataset.theme = th;
  } catch {}

  // ---------- Countdown ----------
  const reg = new Date('2026-09-17T19:00:00-03:00');
  const evt = new Date('2026-10-14T09:00:00-03:00');
  const cdTarget = document.getElementById('cd-target');
  function updateCountdown() {
    const now = new Date();
    let target = now < reg ? reg : evt;
    let label = now < reg ? 'Inscripciones abren en' : (now < evt ? 'Arranca Hacking Day en' : 'Evento en curso');
    const diff = target - now;
    const el = id => document.getElementById(id);
    if (diff <= 0) {
      el('cd-d').textContent = '00'; el('cd-h').textContent='00'; el('cd-m').textContent='00'; el('cd-s').textContent='00';
      cdTarget.textContent = 'EN CURSO · abrí Luma para inscribirte';
      return;
    }
    const d = Math.floor(diff/86400000);
    const h = Math.floor(diff/3600000)%24;
    const m = Math.floor(diff/60000)%60;
    const s = Math.floor(diff/1000)%60;
    el('cd-d').textContent = String(d).padStart(2,'0');
    el('cd-h').textContent = String(h).padStart(2,'0');
    el('cd-m').textContent = String(m).padStart(2,'0');
    el('cd-s').textContent = String(s).padStart(2,'0');
    cdTarget.textContent = label;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- Fallen letters ----------
  const big = document.getElementById('bigTitle');
  if (big) {
    const text = big.textContent;
    big.textContent = '';
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.addEventListener('click', () => {
        span.classList.add('fallen');
        setTimeout(() => span.classList.remove('fallen'), 1800);
      });
      big.appendChild(span);
    });
  }

  // ---------- Piedra movediza ----------
  const piedra = document.getElementById('piedra');
  if (piedra) {
    piedra.addEventListener('click', () => {
      piedra.classList.add('shake');
      const x = (Math.random()*60-30)|0;
      const y = (Math.random()*60-30)|0;
      piedra.style.transform = `translate(${x}px,${y}px) rotate(${Math.random()*40-20}deg)`;
      setTimeout(() => { piedra.classList.remove('shake'); piedra.style.transform=''; }, 900);
      // chance spawn carpincho/salamin
      if (Math.random() < 0.4) spawnCarpincho();
      if (Math.random() < 0.4) showSalamin();
    });
  }

  // ---------- Carpincho ----------
  const carpincho = document.getElementById('carpincho');
  function spawnCarpincho() {
    if (!carpincho || carpincho.classList.contains('walk')) return;
    carpincho.style.right = '-200px';
    carpincho.classList.remove('walk');
    void carpincho.offsetWidth;
    carpincho.classList.add('walk');
    setTimeout(() => carpincho.classList.remove('walk'), 4500);
  }
  setInterval(() => { if (Math.random() < 0.28) spawnCarpincho(); }, 20000);

  // ---------- Salamin ----------
  const salamin = document.getElementById('salamin');
  function showSalamin() {
    if (!salamin) return;
    salamin.classList.add('show');
    setTimeout(() => salamin.classList.remove('show'), 2500);
  }
  document.querySelectorAll('.org-card,.sponsor-card,.card').forEach(c => {
    c.addEventListener('mouseenter', () => { if (Math.random() < 0.25) showSalamin(); });
  });

  // ---------- Swatches ----------
  // already bound above, but ensure default
  if (!root.dataset.theme) root.dataset.theme = 'bosque';

  // ---------- Modal helpers ----------
  function openModal(id){ const m=document.getElementById(id); if(m) m.classList.add('open'); }
  function closeModal(id){ const m=document.getElementById(id); if(m) m.classList.remove('open'); }
  document.querySelectorAll('[data-open]').forEach(b => {
    b.addEventListener('click', () => openModal(b.dataset.open));
  });
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });
  document.querySelectorAll('[data-close]').forEach(b => {
    b.addEventListener('click', () => b.closest('.modal').classList.remove('open'));
  });

  // ---------- Terminal ----------
  const term = document.getElementById('terminal');
  const termOut = document.getElementById('termOut');
  const termIn = document.getElementById('termIn');
  function toggleTerm(){ if(term) term.classList.toggle('open'); if(term && term.classList.contains('open')) termIn.focus(); }
  window.addEventListener('keydown', e => {
    if (e.key === '`') { e.preventDefault(); toggleTerm(); }
  });
  function termPrint(line){ if(termOut) termOut.textContent += line+'\n'; if(termOut) termOut.scrollTop=termOut.scrollHeight; }
  if (termIn) {
    termIn.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const cmd = termIn.value.trim();
      termIn.value='';
      termPrint('> ' + cmd);
      handleCmd(cmd.toLowerCase());
    });
  }
  function handleCmd(cmd){
    const c = cmd.split(' ')[0];
    switch(c){
      case 'help': termPrint('comandos: help, hack, play pacman, play brick, matrix, theme bosque|cueva|atardecer, piedra, carpincho, clear, whoami'); break;
      case 'hack': termPrint('acceso concedido ▓▓▓ (próximamente speakers)'); showSalamin(); spawnCarpincho(); break;
      case 'play':
        if (cmd.includes('brick')) { openModal('modalBrick'); startBrick(); }
        else if (cmd.includes('pac')) { openModal('modalPac'); startPac(); }
        else termPrint('usage: play pacman | play brick');
        break;
      case 'matrix': document.getElementById('matrix').style.opacity='0.45'; termPrint('matrix boost'); break;
      case 'theme':
        const t = cmd.split(' ')[1];
        if (['bosque','cueva','atardecer'].includes(t)){ root.dataset.theme=t; termPrint('tema -> '+t); }
        else termPrint('tema desconocido');
        break;
      case 'piedra': if(piedra) piedra.click(); break;
      case 'carpincho': spawnCarpincho(); break;
      case 'clear': if(termOut) termOut.textContent=''; break;
      case 'whoami': termPrint('founder de TandilTechWeek 🧉'); break;
      default: if(cmd) termPrint('comando no encontrado: '+cmd);
    }
  }

  // ---------- Konami -> Pac-Man ----------
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let buf=[];
  window.addEventListener('keydown', e => {
    buf.push(e.key);
    if (buf.length > konami.length) buf.shift();
    if (buf.join(',') === konami.join(',')) {
      termPrint('KONAMI DETECTADO → PAC-MAN');
      openModal('modalPac'); startPac();
      buf=[];
    }
  });

  // ---------- Pac-Man game ----------
  let pacRunning=false, pacAnim=null;
  const pacCanvas = document.getElementById('pacCanvas');
  const pacCtx = pacCanvas ? pacCanvas.getContext('2d') : null;
  const CELL=16, COLS=21, ROWS=21;
  let pac = {x:10,y:10,dx:0,dy:0,nextDx:0,nextDy:0};
  let ghosts = [];
  let pills = [];
  let pacScore=0, pacLives=3, pacHigh = +(localStorage.getItem('ttw-pac-high')||0);

  function initPac() {
    pacScore=0; pacLives=3;
    pac.x=10; pac.y=10; pac.dx=0; pac.dy=0; pac.nextDx=0; pac.nextDy=0;
    ghosts = [
      {x:9,y:9,dx:1,dy:0,color:'#ff7a6b'},
      {x:11,y:9,dx:-1,dy:0,color:'#ffd166'},
      {x:10,y:11,dx:0,dy:-1,color:'#9bc9e5'}
    ];
    pills=[];
    const wall = new Set();
    // simple border + a couple bars
    for (let x=0;x<COLS;x++){wall.add(x+','+0);wall.add(x+','+(ROWS-1));}
    for (let y=0;y<ROWS;y++){wall.add(0+','+y);wall.add((COLS-1)+','+y);}
    for (let x=3;x<COLS-3;x++){ if (x!==10){ wall.add(x+',6'); wall.add(x+',14'); } }
    for (let y=3;y<ROWS-3;y++){ if (y!==10){ wall.add('6,'+y); wall.add('14,'+y); } }
    // pills elsewhere
    for (let y=1;y<ROWS-1;y++) for (let x=1;x<COLS-1;x++) if (!wall.has(x+','+y)) pills.push({x,y,eaten:false});
    drawPac();
    document.getElementById('pacInfo').textContent = `Score ${pacScore} · Vidas ${pacLives} · Record ${pacHigh}`;
  }
  function pacMove(dx,dy){
    const nx=pac.x+dx, ny=pac.y+dy;
    if (isWall(nx,ny)) return false;
    pac.x=nx; pac.y=ny; return true;
  }
  function isWall(x,y){
    if (x<0||y<0||x>=COLS||y>=ROWS) return true;
    // reuse generator
    const wall = pacWalls();
    return wall.has(x+','+y);
  }
  let wallSet=null;
  function pacWalls(){
    if (wallSet) return wallSet;
    wallSet=new Set();
    for (let x=0;x<COLS;x++){wallSet.add(x+','+0);wallSet.add(x+','+(ROWS-1));}
    for (let y=0;y<ROWS;y++){wallSet.add(0+','+y);wallSet.add((COLS-1)+','+y);}
    for (let x=3;x<COLS-3;x++){ if (x!==10){ wallSet.add(x+',6'); wallSet.add(x+',14'); } }
    for (let y=3;y<ROWS-3;y++){ if (y!==10){ wallSet.add('6,'+y); wallSet.add('14,'+y); } }
    return wallSet;
  }
  function drawPac() {
    if (!pacCtx) return;
    pacCtx.fillStyle='#0a1216'; pacCtx.fillRect(0,0,pacCanvas.width,pacCanvas.height);
    const walls=pacWalls();
    pacCtx.fillStyle='#5fa36a';
    walls.forEach(k=>{const [x,y]=k.split(',').map(Number); pacCtx.fillRect(x*CELL,y*CELL,CELL,CELL);});
    // pills
    pacCtx.fillStyle='#f2c14e';
    pills.forEach(p=>{ if(!p.eaten) pacCtx.fillRect(p.x*CELL+6,p.y*CELL+6,4,4); });
    // pacman
    pacCtx.fillStyle='#ffd166';
    pacCtx.fillRect(pac.x*CELL+2,pac.y*CELL+2,CELL-4,CELL-4);
    // ghosts
    ghosts.forEach(g=>{ pacCtx.fillStyle=g.color; pacCtx.fillRect(g.x*CELL+2,g.y*CELL+2,CELL-4,CELL-4); });
  }
  function startPac(){
    initPac(); pacRunning=true;
    if (pacAnim) cancelAnimationFrame(pacAnim);
    let tick=0;
    function step(){
      if (!pacRunning) return;
      // input buffer
      if (pac.nextDx!==0||pac.nextDy!==0){
        if (!isWall(pac.x+pac.nextDx,pac.y+pac.nextDy)){ pac.dx=pac.nextDx; pac.dy=pac.nextDy; pac.nextDx=0; pac.nextDy=0; }
      }
      if (pac.dx||pac.dy){
        const nx=pac.x+pac.dx, ny=pac.y+pac.dy;
        if (!isWall(nx,ny)){ pac.x=nx; pac.y=ny; }
        else { pac.dx=0; pac.dy=0; }
      }
      // eat
      const pill = pills.find(p=>!p.eaten && p.x===pac.x && p.y===pac.y);
      if (pill){ pill.eaten=true; pacScore+=10; }
      // ghosts move every other tick
      if (tick%2===0) ghosts.forEach(g=>{
        // random valid direction
        const dirs=[{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
        let opts=dirs.filter(d=>!isWall(g.x+d.dx,g.y+d.dy));
        if (opts.length){ const d=opts[Math.floor(Math.random()*opts.length)]; g.x+=d.dx; g.y+=d.dy; g.dx=d.dx; g.dy=d.dy; }
      });
      // collision
      ghosts.forEach(g=>{
        if (g.x===pac.x && g.y===pac.y){ pacLives--; pac.x=10; pac.y=10; pac.dx=0; pac.dy=0; if (pacLives<=0) endPac(); }
      });
      // win
      if (pills.every(p=>p.eaten)){ pacScore+=500; endPac(true); }
      tick++;
      document.getElementById('pacInfo').textContent = `Score ${pacScore} · Vidas ${pacLives} · Record ${pacHigh}`;
      drawPac();
      if (pacLives>0 && !pills.every(p=>p.eaten)) pacAnim=requestAnimationFrame(step);
    }
    step();
  }
  function endPac(win){
    pacRunning=false;
    if (pacAnim) cancelAnimationFrame(pacAnim);
    if (pacScore > pacHigh){ pacHigh=pacScore; localStorage.setItem('ttw-pac-high', pacHigh); }
    const info=document.getElementById('pacInfo');
    if (info) info.textContent = (win?'¡GANASTE! ':'GAME OVER ') + `Score ${pacScore} · Record ${pacHigh} · Enter para reintentar`;
  }
  if (pacCanvas){
    const keys={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
    document.addEventListener('keydown', e=>{
      if (!document.getElementById('modalPac').classList.contains('open')) return;
      if (keys[e.key]){
        e.preventDefault();
        const [dx,dy]=keys[e.key];
        pac.nextDx=dx; pac.nextDy=dy;
      }
      if (e.key==='Enter' && !pacRunning) startPac();
    });
  }

  // ---------- Brick Breaker ----------
  let brickRunning=false, brickAnim=null;
  const brickCanvas = document.getElementById('brickCanvas');
  const brickCtx = brickCanvas ? brickCanvas.getContext('2d') : null;
  let paddle={x:140,w:90,h:10}, ball={x:160,y:200,dx:2,dy:-2,r:6}, bricks=[], brickScore=0, brickLives=3, brickHigh=+(localStorage.getItem('ttw-brick-high')||0);
  function initBrick(){
    brickScore=0; brickLives=3;
    paddle.x=140; ball.x=160; ball.y=200; ball.dx=2; ball.dy=-2;
    bricks=[];
    for (let r=0;r<5;r++) for(let c=0;c<8;c++) bricks.push({x:c*50+10,y:r*22+30,w:44,h:16,alive:true,color:['#ff7a6b','#ffd166','#9bc9e5','#6fa36a','#c98a5a'][r]});
    brickLoop();
    document.getElementById('brickInfo').textContent=`Score ${brickScore} · Vidas ${brickLives} · Record ${brickHigh}`;
  }
  function brickLoop(){
    if (!brickCtx) return;
    brickCtx.fillStyle='#0a1216'; brickCtx.fillRect(0,0,brickCanvas.width,brickCanvas.height);
    // bricks
    bricks.forEach(b=>{
      if(!b.alive) return;
      brickCtx.fillStyle=b.color; brickCtx.fillRect(b.x,b.y,b.w,b.h);
      brickCtx.strokeStyle='#2b2520'; brickCtx.strokeRect(b.x,b.y,b.w,b.h);
    });
    // paddle
    brickCtx.fillStyle='#f2c14e'; brickCtx.fillRect(paddle.x,brickCanvas.height-20,paddle.w,paddle.h);
    // ball
    brickCtx.fillStyle='#f7ead7'; brickCtx.beginPath(); brickCtx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); brickCtx.fill();
  }
  function startBrick(){
    initBrick(); brickRunning=true;
    if (brickAnim) cancelAnimationFrame(brickAnim);
    function step(){
      if (!brickRunning) return;
      ball.x+=ball.dx; ball.y+=ball.dy;
      if (ball.x<ball.r || ball.x>brickCanvas.width-ball.r) ball.dx*=-1;
      if (ball.y<ball.r) ball.dy*=-1;
      // paddle
      if (ball.y+ball.r >= brickCanvas.height-20 && ball.x >= paddle.x && ball.x <= paddle.x+paddle.w) ball.dy*=-1;
      if (ball.y > brickCanvas.height){ brickLives--; ball.x=160; ball.y=200; ball.dy=-2; if (brickLives<=0){ endBrick(); return; } }
      // bricks
      bricks.forEach(b=>{
        if(!b.alive) return;
        if (ball.x>b.x && ball.x<b.x+b.w && ball.y>b.y && ball.y<b.y+b.h){
          b.alive=false; ball.dy*=-1; brickScore+=10;
        }
      });
      if (bricks.every(b=>!b.alive)){ brickScore+=100; endBrick(true); return; }
      document.getElementById('brickInfo').textContent=`Score ${brickScore} · Vidas ${brickLives} · Record ${brickHigh}`;
      brickLoop();
      brickAnim=requestAnimationFrame(step);
    }
    step();
  }
  function endBrick(win){
    brickRunning=false;
    if (brickAnim) cancelAnimationFrame(brickAnim);
    if (brickScore>brickHigh){ brickHigh=brickScore; localStorage.setItem('ttw-brick-high', brickHigh); }
    const info=document.getElementById('brickInfo');
    if (info) info.textContent=(win?'¡GANASTE! ':'GAME OVER ')+`Score ${brickScore} · Record ${brickHigh} · click para reintentar`;
  }
  if (brickCanvas){
    brickCanvas.addEventListener('mousemove', e=>{
      const rect=brickCanvas.getBoundingClientRect();
      paddle.x = e.clientX - rect.left - paddle.w/2;
      if (paddle.x<0) paddle.x=0;
      if (paddle.x+paddle.w>brickCanvas.width) paddle.x=brickCanvas.width-paddle.w;
    });
    brickCanvas.addEventListener('click', ()=>{ if(!brickRunning) startBrick(); });
  }

  // expose for terminal buttons
  window.__brickStart=startBrick; window.__pacStart=startPac;

  // Pixel font load fallback
  if (typeof document.fonts !== 'undefined') document.fonts.ready.then(()=>{});
})();
