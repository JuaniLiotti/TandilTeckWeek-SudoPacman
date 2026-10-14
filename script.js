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

  // ---------- Carpincho ----------
  const carpincho = document.getElementById('carpincho');
  function spawnCarpincho() {
    if (!carpincho || carpincho.classList.contains('peek')) return;
    carpincho.classList.add('peek');
    setTimeout(() => carpincho.classList.remove('peek'), 2600);
  }
  if (carpincho) {
    carpincho.addEventListener('click', () => {
      try { openModal('modalBrick'); } catch(e){}
      setTimeout(() => { try { startBrick(); } catch(e){} }, 80);
    });
  }
  setTimeout(spawnCarpincho, 3000);
  setInterval(() => { if (Math.random() < 0.6) spawnCarpincho(); }, 12000);

  // ---------- Salame rain ----------

  function rainSalames(count = 8) {
    for (let i=0; i<count; i++) {
      const img = document.createElement('img');
      img.src = 'assets/salame.webp';
      img.className = 'salame-rain';
      img.alt = '';
      img.style.left = (6 + Math.random()*86) + 'vw';
      img.style.width = (40 + Math.random()*40) + 'px';
      img.style.animationDuration = (1.8 + Math.random()*1.4) + 's';
      img.style.animationDelay = (i * 0.12) + 's';
      img.style.transform = `rotate(${(Math.random()*80-40)}deg)`;
      document.body.appendChild(img);
      img.addEventListener('animationend', () => img.remove());
    }
  }
  // Lluvia de salamines solo con spam de clicks (4 clicks en <1.5s, cooldown 800ms)
  const clickTimes = [];
  let lastRainSpam = 0;
  document.addEventListener('click', () => {
    const now = Date.now();
    clickTimes.push(now);
    while (clickTimes.length && now - clickTimes[0] > 1500) clickTimes.shift();
    if (clickTimes.length >= 4 && now - lastRainSpam > 800) {
      lastRainSpam = now;
      clickTimes.length = 0;
      rainSalames(9);
    }
  });

  // Realistic salamin on logo click

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
      case 'help': termPrint('comandos: help, hack, play pacman, play brick, matrix, theme bosque|cueva|atardecer|cyberpunk|terraria|undertale|balatro|davediver, carpincho, salame, clear, whoami\nsecretos: Konami Code -> Pac-Man; click en carpincho -> Brick Breaker; click en letras del titulo -> caida; spam de clicks -> lluvia de salamines'); break;
      case 'hack': termPrint('acceso concedido ▓▓▓ (próximamente speakers)'); spawnCarpincho(); break;
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
      case 'carpincho': spawnCarpincho(); break;
      case 'salame': rainSalames(9); break;
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
  const CELL=12, COLS=28, ROWS=31;
  // Laberinto clásico de Pac-Man (28x31): # pared, . pastilla, o power pellet, - puerta casa, espacio vacío
  const PAC_MAZE = [
    "############################",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#o####.#####.##.#####.####o#",
    "#.####.#####.##.#####.####.#",
    "#..........................#",
    "#.####.##.########.##.####.#",
    "#.####.##.########.##.####.#",
    "#......##....##....##......#",
    "######.#####.##.#####.######",
    "######.#####.##.#####.######",
    "######.##..........##.######",
    "######.##.###--###.##.######",
    "######.##.#      #.##.######",
    "..........#      #..........",
    "######.##.#      #.##.######",
    "######.##.########.##.######",
    "######.##..........##.######",
    "######.##.########.##.######",
    "######.##.########.##.######",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#.####.#####.##.#####.####.#",
    "#o..##.......  .......##..o#",
    "###.##.##.########.##.##.###",
    "###.##.##.########.##.##.###",
    "#......##....##....##......#",
    "#.##########.##.##########.#",
    "#.##########.##.##########.#",
    "#..........................#",
    "############################"
  ];
  let pac = {x:13,y:23,dx:0,dy:0,nextDx:0,nextDy:0};
  let ghosts = [];
  let pills = [];
  let pacScore=0, pacLives=3, pacHigh = +(localStorage.getItem('ttw-pac-high')||0);
  let pacGrid = [];

  function shufflePac(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  function buildPacMaze(){
    return PAC_MAZE.map(row => row.split(''));
  }

  function isWall(x,y){
    if(y<0||y>=ROWS) return true;
    x=(x+COLS)%COLS; // túnel lateral: wrap
    const c=pacGrid[y] && pacGrid[y][x];
    return c===undefined || c==='#' || c==='-';
  }

  function drawWall(x,y){
    pacCtx.fillStyle='#2121de';
    pacCtx.fillRect(x*CELL,y*CELL,CELL,CELL);
    pacCtx.strokeStyle='#0a1030';
    pacCtx.lineWidth=2;
    pacCtx.strokeRect(x*CELL+1,y*CELL+1,CELL-2,CELL-2);
  }

  function drawPacShape(x,y,dir,mouth){
    const cx=x*CELL+CELL/2, cy=y*CELL+CELL/2, r=CELL/2-1;
    let angle=0;
    if(dir.dx===-1) angle=Math.PI;
    else if(dir.dy===-1) angle=-Math.PI/2;
    else if(dir.dy===1) angle=Math.PI/2;
    pacCtx.beginPath();
    pacCtx.moveTo(cx,cy);
    pacCtx.arc(cx,cy,r, angle+mouth, angle-mouth, false);
    pacCtx.closePath();
    pacCtx.fillStyle='#ffd166';
    pacCtx.fill();
  }

  function drawGhostShape(x,y,color){
    const px=x*CELL+1, py=y*CELL+1, w=CELL-2, h=CELL-2;
    pacCtx.beginPath();
    pacCtx.arc(px+w/2, py+h/2, w/2, Math.PI, 0);
    pacCtx.lineTo(px+w, py+h);
    pacCtx.lineTo(px, py+h);
    pacCtx.closePath();
    pacCtx.fillStyle=color;
    pacCtx.fill();
    pacCtx.fillStyle='#fff';
    pacCtx.beginPath();
    pacCtx.arc(px+w/2-3, py+h/2, 2.2, 0, Math.PI*2);
    pacCtx.arc(px+w/2+3, py+h/2, 2.2, 0, Math.PI*2);
    pacCtx.fill();
    pacCtx.fillStyle='#222';
    pacCtx.beginPath();
    pacCtx.arc(px+w/2-3, py+h/2, 1, 0, Math.PI*2);
    pacCtx.arc(px+w/2+3, py+h/2, 1, 0, Math.PI*2);
    pacCtx.fill();
  }

  function drawPac(){
    if(!pacCtx) return;
    pacCtx.fillStyle='#0a1216';
    pacCtx.fillRect(0,0,pacCanvas.width,pacCanvas.height);
    for(let y=0;y<ROWS;y++){
      for(let x=0;x<COLS;x++){
        if(pacGrid[y][x]==='#') drawWall(x,y);
      }
    }
    pacCtx.fillStyle='#ffb897';
    pills.forEach(p=>{
      if(!p.eaten){
        pacCtx.beginPath();
        pacCtx.arc(p.x*CELL+CELL/2, p.y*CELL+CELL/2, p.power?4:2, 0, Math.PI*2);
        pacCtx.fill();
      }
    });
    const mouth = 0.22 + Math.abs(Math.sin(performance.now()/120))*0.22;
    drawPacShape(pac.x,pac.y,pac,mouth);
    ghosts.forEach(g=>drawGhostShape(g.x,g.y,g.color));
  }

  function updatePacHud(){
    const livesEl=document.getElementById('pacLives');
    if(livesEl) livesEl.textContent='Vidas: ' + '♥'.repeat(Math.max(0,pacLives));
    const info=document.getElementById('pacInfo');
    if(info) info.textContent=`Score ${pacScore} · Record ${pacHigh}`;
  }

  function initPac(){
    pacScore=0; pacLives=3;
    pacGrid=buildPacMaze();
    pills=[];
    for(let y=0;y<ROWS;y++){
      for(let x=0;x<COLS;x++){
        const c=pacGrid[y][x];
        if(c==='.') pills.push({x,y,eaten:false,power:false});
        else if(c==='o') pills.push({x,y,eaten:false,power:true});
      }
    }
    pac.x=13; pac.y=23; pac.dx=0; pac.dy=0; pac.nextDx=0; pac.nextDy=0;
    ghosts=[
      {x:12,y:13,house:true,color:'#ff5f5f'},
      {x:14,y:13,house:true,color:'#ffb347'},
      {x:13,y:14,house:true,color:'#4fc3f7'}
    ];
    updatePacHud();
    drawPac();
  }

  function startPac(){
    initPac(); pacRunning=true;
    if (pacAnim) cancelAnimationFrame(pacAnim);
    let tick=0, lastMove=0;
    function step(ts){
      if (!pacRunning) return;
      if (!lastMove) lastMove=ts;
      const shouldMove = (ts - lastMove) >= 135;
      if (shouldMove) lastMove = ts;
      if (shouldMove) {
        if(pac.nextDx!==0||pac.nextDy!==0){
          if(!isWall(pac.x+pac.nextDx,pac.y+pac.nextDy)){
            pac.dx=pac.nextDx; pac.dy=pac.nextDy;
            pac.nextDx=0; pac.nextDy=0;
          }
        }
        if(pac.dx||pac.dy){
          const nx=(pac.x+pac.dx+COLS)%COLS, ny=pac.y+pac.dy;
          if(!isWall(nx,ny)){ pac.x=nx; pac.y=ny; }
          else { pac.dx=0; pac.dy=0; }
        }
        const pill = pills.find(p=>!p.eaten && p.x===pac.x && p.y===pac.y);
        if(pill){ pill.eaten=true; pacScore+=pill.power?50:10; }
        if(tick%2===0){
          ghosts.forEach(g=>{
            if(g.house){
              // salir de la casa: ir a la columna central y subir por la puerta
              if(g.y<=11){ g.house=false; return; }
              if(g.x!==13){ g.x += g.x<13?1:-1; }
              else { g.y--; }
              return;
            }
            const dirs=shufflePac([{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}]);
            const opts=dirs.filter(d=>!isWall(g.x+d.dx,g.y+d.dy));
            if(opts.length){
              const d=opts[0];
              g.x=(g.x+d.dx+COLS)%COLS; g.y+=d.dy; g.dx=d.dx; g.dy=d.dy;
            }
          });
        }
        ghosts.forEach(g=>{
          if(g.x===pac.x && g.y===pac.y){
            pacLives--;
            pac.x=1; pac.y=1; pac.dx=0; pac.dy=0; pac.nextDx=0; pac.nextDy=0;
            if(pacLives<=0) endPac();
          }
        });
        if(pills.every(p=>p.eaten)){ pacScore+=500; endPac(true); }
        tick++;
      }
      updatePacHud();
      drawPac();
      if(pacLives>0 && !pills.every(p=>p.eaten)) pacAnim=requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function endPac(win){
    pacRunning=false;
    if (pacAnim) cancelAnimationFrame(pacAnim);
    if (pacScore > pacHigh){ pacHigh=pacScore; localStorage.setItem('ttw-pac-high', pacHigh); }
    updatePacHud();
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
      if (ball.x<ball.r){ ball.x=ball.r; ball.dx=Math.abs(ball.dx); }
      if (ball.x>brickCanvas.width-ball.r){ ball.x=brickCanvas.width-ball.r; ball.dx=-Math.abs(ball.dx); }
      if (ball.y<ball.r){ ball.y=ball.r; ball.dy=Math.abs(ball.dy); }
      // paddle
      if (ball.dy > 0 && ball.y+ball.r >= brickCanvas.height-20 && ball.y-ball.r <= brickCanvas.height-10 && ball.x >= paddle.x && ball.x <= paddle.x+paddle.w) {
        ball.dy = -Math.abs(ball.dy);
        ball.y = brickCanvas.height-20-ball.r;
      }
      if (ball.y > brickCanvas.height){ brickLives--; ball.x=160; ball.y=200; ball.dy=-2; if (brickLives<=0){ endBrick(); return; } }
      // bricks
      bricks.forEach(b=>{
        if(!b.alive) return;
        if (ball.x+ball.r > b.x && ball.x-ball.r < b.x+b.w && ball.y+ball.r > b.y && ball.y-ball.r < b.y+b.h) {
          b.alive=false; brickScore+=10;
          const ol = (ball.x+ball.r) - b.x;
          const orr = (b.x+b.w) - (ball.x-ball.r);
          const ot = (ball.y+ball.r) - b.y;
          const ob = (b.y+b.h) - (ball.y-ball.r);
          const m = Math.min(ol,orr,ot,ob);
          if (m===ol || m===orr) ball.dx *= -1;
          else ball.dy *= -1;
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
