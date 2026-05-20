// ==========================================================================
// OFFICIAL GAME SITE MASTER PORTAL - game.js
// ==========================================================================

// Global States
let isTvOn = false;
let isTvStatic = true;
let isAudioActive = false;
let gameAudioCtx = null;
let gameHumNode = null;
let gameHeartbeatInterval = null;
let particlesInterval = null;

// ==========================================================================
// 1. PROCEDURAL ATMOSPHERIC AUDIO SYNTHESIS
// ==========================================================================
function toggleAtmosphericAudio() {
  const btn = document.getElementById('audio-toggle-btn');
  if (!btn) return;
  
  if (!gameAudioCtx) {
    gameAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  if (!isAudioActive) {
    // Start Audio
    isAudioActive = true;
    btn.classList.add('audio-active');
    btn.querySelector('.audio-label').textContent = "AMBIÊNCIA ATIVADA";
    
    if (gameAudioCtx.state === 'suspended') {
      gameAudioCtx.resume();
    }
    
    startGameHum();
    startGameHeartbeat();
    playCinematicChime(440, 1.5, 'sine');
  } else {
    // Stop Audio
    isAudioActive = false;
    btn.classList.remove('audio-active');
    btn.querySelector('.audio-label').textContent = "AMBIÊNCIA DESATIVADA";
    
    stopGameHum();
    if (gameHeartbeatInterval) clearInterval(gameHeartbeatInterval);
  }
}

// Procedural synthesizer chime
function playCinematicChime(freq, duration, type = 'sine', gainVal = 0.08) {
  if (!isAudioActive || !gameAudioCtx) return;
  try {
    const osc = gameAudioCtx.createOscillator();
    const gainNode = gameAudioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, gameAudioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(gainVal, gameAudioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, gameAudioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(gameAudioCtx.destination);
    
    osc.start();
    osc.stop(gameAudioCtx.currentTime + duration);
  } catch (e) {}
}

// Continuous hospital basement ventilation hum
function startGameHum() {
  if (!isAudioActive || !gameAudioCtx) return;
  try {
    const osc1 = gameAudioCtx.createOscillator();
    const osc2 = gameAudioCtx.createOscillator();
    const filter = gameAudioCtx.createBiquadFilter();
    const gainNode = gameAudioCtx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, gameAudioCtx.currentTime); // Low A hum
    
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(110, gameAudioCtx.currentTime); // Secondary octave
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, gameAudioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.12, gameAudioCtx.currentTime);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(gameAudioCtx.destination);
    
    osc1.start();
    osc2.start();
    
    gameHumNode = { osc1, osc2, filter, gainNode };
  } catch (e) {}
}

function stopGameHum() {
  if (gameHumNode) {
    try {
      gameHumNode.osc1.stop();
      gameHumNode.osc2.stop();
    } catch (e) {}
    gameHumNode = null;
  }
}

// Periodic heart rate monitor chime beep
function startGameHeartbeat() {
  if (gameHeartbeatInterval) clearInterval(gameHeartbeatInterval);
  
  const tick = () => {
    if (!isAudioActive) return;
    // Play normal slow clinical heartbeat beep (SILENCED)
    // playCinematicChime(880, 0.09, 'sine', 0.04);
  };
  
  gameHeartbeatInterval = setInterval(tick, 1500); // 1.5s intervals (40 bpm)
}


// ==========================================================================
// 2. RADIAL GLASS SHATTER & FULL-SITE DOM ELEMENT SHATTER ENGINE
// ==========================================================================
const shatterBg = document.getElementById('shatter-bg');
const shards = [];

if (shatterBg) {
  shatterBg.innerHTML = ""; // Clear any default grid shards
  
  const cx = 50; // Impact point center X (50%)
  const cy = 40; // Impact point center Y (40%)
  const numRings = 5;
  const numSectors = 12;
  const points = [];
  
  // 1. Generate concentric polar grid with noise to create organic web cracks
  for (let r = 0; r <= numRings; r++) {
    points[r] = [];
    const baseRadius = r === 0 ? 0 : Math.pow(r / numRings, 1.4) * 80;
    
    for (let s = 0; s < numSectors; s++) {
      if (r === 0) {
        points[r][s] = { x: cx, y: cy };
      } else {
        const angle = (s / numSectors) * 2 * Math.PI;
        // Radial and angular noise for high-tension organic glass cracks
        const rNoise = (Math.random() * 8 - 4) * (r / numRings);
        const aNoise = (Math.random() * 0.15 - 0.075);
        
        const finalRadius = baseRadius + rNoise;
        const finalAngle = angle + aNoise;
        
        const px = cx + finalRadius * Math.cos(finalAngle) * 1.4; // adjust aspect ratio
        const py = cy + finalRadius * Math.sin(finalAngle);
        
        points[r][s] = {
          x: Math.max(-10, Math.min(110, px)),
          y: Math.max(-10, Math.min(110, py))
        };
      }
    }
    points[r][numSectors] = points[r][0]; // close circular loops
  }
  
  // 2. Generate triangular & polygonal glass shards
  for (let r = 0; r < numRings; r++) {
    for (let s = 0; s < numSectors; s++) {
      const shard = document.createElement('div');
      shard.className = 'shard';
      
      const p1 = points[r][s];
      const p2 = points[r+1][s];
      const p3 = points[r+1][s+1];
      const p4 = points[r][s+1];
      
      let clipPathStr = "";
      if (r === 0) {
        // Core center shards are sharp triangles
        clipPathStr = `polygon(${p1.x}% ${p1.y}%, ${p2.x}% ${p2.y}%, ${p3.x}% ${p3.y}%)`;
      } else {
        // Outer concentric shards are quadrilaterals
        clipPathStr = `polygon(${p1.x}% ${p1.y}%, ${p2.x}% ${p2.y}%, ${p3.x}% ${p3.y}%, ${p4.x}% ${p4.y}%)`;
      }
      
      shard.style.clipPath = clipPathStr;
      shard.style.width = '100vw';
      shard.style.height = '100vh';
      shard.style.backgroundPosition = 'center center';
      
      // Real physics outwards from impact center
      const avgX = (p1.x + p2.x + p3.x + p4.x) / 4;
      const avgY = (p1.y + p2.y + p3.y + p4.y) / 4;
      const dirX = avgX - cx;
      const dirY = avgY - cy;
      const dist = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
      
      // Explosion dynamics on scroll
      const force = 350 + Math.random() * 450;
      const dx = (dirX / dist) * force + (Math.random() - 0.5) * 120;
      const dy = (dirY / dist) * force + (Math.random() - 0.5) * 120;
      const rot = (Math.random() - 0.5) * 100;
      const vz = Math.random() * 200 - 100;
      
      shards.push({
        el: shard,
        dx: dx,
        dy: dy,
        rot: rot,
        vz: vz
      });
      
      shatterBg.appendChild(shard);
    }
  }
}

// Register all website elements to dynamically shatter (Site se despedaçando) - DISABLED FOR CLEAN VISUALS
const shatterElements = [];
/*
document.querySelectorAll('#scroll-content h2, #scroll-content p, #scroll-content h3, #scroll-content .gameplay-card, #scroll-content .char-card, #scroll-content .tv-wrapper, #scroll-content .hero-buttons, #scroll-content .logo-wrapper, #scroll-content .studio-badge').forEach(el => {
  // Exclude technical overlays or particles
  if (el.classList.contains('scanlines') || el.classList.contains('vignette') || el.classList.contains('particles-container')) return;
  shatterElements.push({
    el: el,
    originalText: el.innerHTML,
    factorX: (Math.random() - 0.5) * 450, // horizontal scattering drift
    factorY: Math.random() * 220 + 180,   // drifts downwards
    factorRot: (Math.random() - 0.5) * 70 // rotation drift
  });
});
*/

// Glitch creepy strings
const creepyPhrases = [
  "ELA MENTIU",
  "NÃO HÁ SAÍDA",
  "CELA A[redacted]",
  "DR. TARRANT",
  "A VERDADE DE ALICE",
  "SUBTERRÂNEO",
  "COELHO DO TEMPO",
  "O GATO SABE",
  "ESQUEÇA O PASSADO",
  "O QUE ACONTECEU EM 1985?",
  "UMA ILUSÃO",
  "SINAL DE CONSCIÊNCIA PERDIDO",
  "POR QUE VOCÊ CONTINUA LENDO?",
  "NÃO CONFIE EM NINGUÉM",
  "EXISTA SÓ EM MEMÓRIA",
  "REALIDADE DE CERA",
  "VOLTE PARA A CELA"
];

// Parallax scrolling shatter sound trigger
let lastScroll = window.scrollY;
let hasShatteredPlay = false;

function playProceduralShatterSound() {
  if (hasShatteredPlay) return;
  hasShatteredPlay = true;
  
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!gameAudioCtx && AudioContextClass) {
      gameAudioCtx = new AudioContextClass();
    }
    if (gameAudioCtx && gameAudioCtx.state === 'suspended') {
      gameAudioCtx.resume();
    }
  } catch (e) {
    console.warn("Falha ao inicializar o AudioContext do jogo:", e);
    gameAudioCtx = null;
  }
  
  if (!gameAudioCtx) return;
  
  const now = gameAudioCtx.currentTime;
  const frequencies = [880, 1200, 1600, 2200, 3100, 4500];
  frequencies.forEach((freq, idx) => {
    try {
      const osc = gameAudioCtx.createOscillator();
      const gainNode = gameAudioCtx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 100, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3 + Math.random() * 0.4);
      
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2 + Math.random() * 0.5);
      
      osc.connect(gainNode);
      gainNode.connect(gameAudioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {
      console.warn("Erro no sintetizador de vidro:", e);
    }
  });
}

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  const maxScroll = window.innerHeight * 1.2; 
  let progress = Math.max(0, Math.min(currentScroll / maxScroll, 1));
  
  // Re-rotates shards slightly when reversing scroll directions
  const scrollingUp = currentScroll < lastScroll;
  if (scrollingUp && progress > 0 && progress < 1) {
    shards.forEach(s => {
      s.rot += (Math.random() - 0.5) * 1;
    });
  }
  lastScroll = currentScroll;
  
  // Glass shards shatter movement
  shards.forEach(s => {
    let p = Math.max(0, (progress - 0.05) / 0.95);
    if (p > 0) {
      if (!hasShatteredPlay) {
        playProceduralShatterSound();
      }
      const tx = s.dx * Math.pow(p, 1.4);
      const ty = s.dy * Math.pow(p, 1.4);
      const r = s.rot * p;
      const op = 1 - Math.pow(p, 2.5);
      s.el.style.transform = `translate3d(${tx}px, ${ty}px, ${s.vz}px) rotate(${r}deg)`;
      s.el.style.opacity = op;
    } else {
      s.el.style.transform = 'none';
      s.el.style.opacity = 1;
      if (progress === 0) {
        hasShatteredPlay = false;
      }
    }
  });
  
  // Hero background zoom parallax
  const heroImg = document.getElementById('hero-parallax-img');
  if (heroImg) {
    heroImg.style.transform = `scale(${1 + progress * 0.15}) translateY(${progress * 60}px)`;
  }
  // Calculate global bizarre progress factor as scroll goes deeper - REMOVED DISTORTIONS

});


// ==========================================================================
// 3. 3D CARD INTERACTIVE TILTING
// ==========================================================================
function tiltCard(e, card) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const midX = rect.width / 2;
  const midY = rect.height / 2;
  
  // Angle limits (max 10 degrees)
  const angleY = -(x - midX) / midX * 10;
  const angleX = (y - midY) / midY * 10;
  
  card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
  
  // Set custom glow position properties in CSS
  card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
  card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
}

function resetCard(card) {
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
}


// ==========================================================================
// 4. CHARACTERS CLINICAL DATABASE MODAL
// ==========================================================================
const charactersDatabase = {
  alice: {
    name: "Alice L. (Paciente A[redacted])",
    role: "Prontuário Confidencial - Cela A[redacted]",
    desc: "A paciente principal. Associada a um evento silencioso de perda familiar profunda na residência. Apresenta grave amnésia retrógrada e distorções dissociativas sistêmicas (construindo fábulas com animais falantes e espelhos). Suas ondas cerebrais reagem instavelmente a superfícies refletivas.",
    avatar: `<svg viewBox="0 0 24 24" width="128" height="128" fill="none" stroke="var(--accent-red)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a5 5 0 0 0-5 5v1a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"/>
      <path d="M6 21c0-3.5 3-6 6-6s6 2.5 6 6"/>
      <path d="M4 10c0 1.5.5 3 1.5 4M20 10c0 1.5-.5 3-1.5 4"/>
    </svg>`,
    chimeFreq: 523.25 // Note C5 (crystalline crystal chime)
  },
  gato: {
    name: "O Gato Cheshire",
    role: "Voz Observadora - Subsolo",
    desc: "Uma anomalia sensorial relatada por Pacientes e outros internos do subsolo. Descrevem-no como uma voz onipresente, cínica e zombeteira nas fendas de ventilação. Teoriza-se que seja um surto induzido pela dosagem clínica de Letheum.",
    avatar: `<svg viewBox="0 0 24 24" width="128" height="128" fill="none" stroke="var(--accent-red)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 5l4 4h10l4-4v10a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V5z"/>
      <path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM16 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
      <path d="M8 16c2.5 2 5.5 2 8 0"/>
    </svg>`,
    chimeFreq: 392.00 // Note G4 (cynical resonant bell)
  },
  coelho: {
    name: "O Coelho Branco (Cobaia #02)",
    role: "Cadeira de Contenção - Subsolo",
    desc: "Figura humanoide com máscara de coelho que apresenta movimentos rápidos e nervosos. Sempre associado à obsessão pela passagem do tempo. Seus sussurros constantes alertam sobre o relógio parado no instante da trindade e seu dobro.",
    avatar: `<svg viewBox="0 0 24 24" width="128" height="128" fill="none" stroke="var(--accent-red)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 12V3a2 2 0 0 0-4 0v9M15 12V3a2 2 0 0 1 4 0v9"/>
      <path d="M5 12a7 7 0 0 0 14 0c0-2-1.5-3.5-3.5-3.5h-7C6.5 8.5 5 10 5 12z"/>
      <circle cx="9" cy="12" r="1"/>
      <circle cx="15" cy="12" r="1"/>
      <circle cx="12" cy="12" r="9" stroke-dasharray="2 2" opacity="0.4"/>
    </svg>`,
    chimeFreq: 659.25 // Note E5 (ticking fast metallic note)
  },
  chapeleiro: {
    name: "O Chapeleiro Louco (Cobaia #04)",
    role: "Internado sob Protocolo Esquecer (1985)",
    desc: "Um dos primeiros indivíduos submetidos à cirurgia de supressão profunda temporal. Embora amigável, seu cérebro sofreu afasia crônica, comunicando-se unicamente através de enigmas desconexos que, paradoxalmente, carregam verdades sobre os segredos do hospital.",
    avatar: `<svg viewBox="0 0 24 24" width="128" height="128" fill="none" stroke="var(--accent-red)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 18h20"/>
      <path d="M5 18V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12"/>
      <path d="M5 14h14"/>
      <path d="M14 9l2-4h-2.5z" opacity="0.6"/>
    </svg>`,
    chimeFreq: 293.66 // Note D4 (eccentric vibrato)
  },
  tarrant: {
    name: "Dr. Arthur Tarrant",
    role: "Diretor Geral & Coordenador Técnico",
    desc: "Pioneiro mundial de neurocirurgia reconstrutiva clínica. Acredita de forma fanática que o cérebro humano é totalmente moldável a critérios éticos institucionais. Coordena pessoalmente a dosagem e o isolamento de Paciente A[redacted] no subsolo.",
    avatar: `<svg viewBox="0 0 24 24" width="128" height="128" fill="none" stroke="var(--accent-red)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M12 11v4M10 13h4" />
    </svg>`,
    chimeFreq: 220.00 // Note A3 (heavy dark drone bell)
  },
  rainha: {
    name: "A Rainha Vermelha",
    role: "Protetor Cognitivo Severo",
    desc: "Uma figura brutalista e autoritária manifestada na mente da paciente. A Rainha Vermelha representa a materialização psíquica de um severo bloqueio cognitivo, sentenciando-a à confusão contínuo e punindo qualquer tentativa de recuperar memórias originais.",
    avatar: `<svg viewBox="0 0 24 24" width="128" height="128" fill="none" stroke="var(--accent-red)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
      <path d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"/>
      <path d="M12 11c-1-1-2.5 0-2.5 1.5 0 2 2.5 3.5 2.5 3.5s2.5-1.5 2.5-3.5c0-1.5-1.5-2.5-2.5-1.5z"/>
    </svg>`,
    chimeFreq: 174.61 // Note F3 (dramatic brass chime)
  }
};

function openCharModal(charId) {
  const data = charactersDatabase[charId];
  if (!data) return;
  
  document.getElementById('modal-char-avatar').innerHTML = data.avatar;
  document.getElementById('modal-char-role').textContent = data.role;
  document.getElementById('modal-char-name').textContent = data.name;
  document.getElementById('modal-char-desc').textContent = data.desc;
  
  const modal = document.getElementById('char-modal');
  modal.classList.add('active');
  
  // Custom synth arpeggio based on character's frequency
  if (isAudioActive) {
    playCinematicChime(data.chimeFreq, 1.0, 'sine', 0.09);
    setTimeout(() => playCinematicChime(data.chimeFreq * 1.5, 0.8, 'triangle', 0.05), 150);
  }
}

function closeCharModal() {
  document.getElementById('char-modal').classList.remove('active');
}


// ==========================================================================
// 5. WORLD / LOCATIONS TABS SWITCHER
// ==========================================================================
const worldPanes = [
  {
    title: "O Asilo Rural",
    desc: "Construído originalmente como uma colônia penal militar isolada, o edifício principal do Instituto Tarrant esconde laboratórios subterrâneos e dezenas de celas de contenção estofadas. Suas paredes de concreto espesso garantem silêncio total para as terapias de reconfiguração cerebral.",
    img: "asylum_corridor.png"
  },
  {
    title: "Pavilhão de Isolamento (Subsolo Restrito)",
    desc: "A ala de contenção máxima, localizada 12 metros abaixo do nível do solo. É aqui que Pacientes de alta dissociação estão retidos sob monitoramento contínuo. Nenhum médico tem permissão para entrar desacompanhado no subsolo.",
    img: "asylum_corridor.png"
  },
  {
    title: "Laboratórios Cognitivos",
    desc: "Onde o composto Letheum é sintetizado e administrado através de aerossol ou injeções cerebrais controladas. Nos laboratórios, a equipe médica utiliza ondas eletromagnéticas e modulação óptica para reorganizar registros de traumas severos.",
    img: "asylum_corridor.png"
  }
];

function switchWorldView(idx) {
  // Update Tabs Active State
  const btns = document.querySelectorAll('.world-tab-btn');
  btns.forEach((btn, i) => {
    btn.classList.remove('active');
    if (i === idx) btn.classList.add('active');
  });
  
  const box = document.getElementById('world-content-box');
  if (!box) return;
  
  const pane = worldPanes[idx];
  box.innerHTML = `
    <div class="world-pane active">
      <div class="world-img-container">
        <img src="${pane.img}" alt="${pane.title}" class="world-zoom-img">
      </div>
      <div class="world-text-desc">
        <h3>${pane.title}</h3>
        <p>${pane.desc}</p>
      </div>
    </div>
  `;
  
  if (isAudioActive) {
    playCinematicChime(300 + idx * 80, 0.4, 'triangle', 0.05);
  }
}


// ==========================================================================
// 6. GALLERY LIGHTBOX
// ==========================================================================
function openGalleryLightbox(imgSrc) {
  const lightbox = document.getElementById('gallery-lightbox');
  const lImg = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  
  if (!lightbox || !lImg) return;
  
  lImg.src = imgSrc;
  caption.textContent = imgSrc.includes("corridor") ? "EVIDÊNCIA #01: Corredor de acesso ao subsolo." : "EVIDÊNCIA #02: A passagem estreita para a área interna.";
  
  lightbox.classList.add('active');
  
  if (isAudioActive) {
    playCinematicChime(400, 0.3, 'sine', 0.06);
  }
}

function closeGalleryLightbox() {
  document.getElementById('gallery-lightbox').classList.remove('active');
}


// ==========================================================================
// 7. CRT TV VHS TRAILER PLAYER
// ==========================================================================
function toggleTvPower() {
  const screen = document.getElementById('tv-screen');
  const noise = document.getElementById('tv-noise');
  if (!screen || !noise) return;
  
  if (!isTvOn) {
    // Power ON
    isTvOn = true;
    noise.classList.add('tv-noise-active');
    screen.style.filter = "brightness(1) contrast(1.1)";
    playCinematicChime(2200, 0.1, 'sine', 0.05); // high frequency power beep
    
    // Auto turn off static to display video channel after 1s
    setTimeout(() => {
      isTvStatic = false;
      noise.classList.remove('tv-noise-active');
      renderSimulatedVideo();
    }, 1200);
  } else {
    // Power OFF
    isTvOn = false;
    isTvStatic = true;
    noise.classList.remove('tv-noise-active');
    screen.style.filter = "brightness(0)";
    document.getElementById('tv-video-content').innerHTML = `
      <span class="vhs-time-stamp">REC  AM 03:06:12</span>
      <div class="tv-center-message">
        <h3>SINAL DE CONSCIÊNCIA PERDIDO</h3>
        <button class="btn-premium primary" onclick="playSimulatedTrailer()" style="margin-top:20px;">Ligar Transmissão</button>
      </div>
    `;
    playCinematicChime(150, 0.15, 'sawtooth', 0.08); // low shut down beep
  }
}

function toggleTvStatic() {
  if (!isTvOn) return;
  const noise = document.getElementById('tv-noise');
  if (!noise) return;
  
  if (!isTvStatic) {
    isTvStatic = true;
    noise.classList.add('tv-noise-active');
    playCinematicChime(Math.random() * 500 + 100, 0.5, 'square', 0.05);
  } else {
    isTvStatic = false;
    noise.classList.remove('tv-noise-active');
    renderSimulatedVideo();
  }
}

function playSimulatedTrailer() {
  if (!isTvOn) {
    toggleTvPower();
  } else {
    isTvStatic = false;
    document.getElementById('tv-noise').classList.remove('tv-noise-active');
    renderSimulatedVideo();
  }
}

const tvLogoImg = new Image();
tvLogoImg.src = 'logo_red.png';

function renderSimulatedVideo() {
  const content = document.getElementById('tv-video-content');
  if (!content) return;
  
  // Custom atmospheric loop inside television screen using beautiful red visualizer canvas
  content.innerHTML = `
    <span class="vhs-time-stamp">PLAY ▶</span>
    <canvas id="tv-visualizer" style="width:100%; height:100%; object-fit:cover;"></canvas>
    <div style="position:absolute; bottom:30px; left: 20px; font-family:var(--font-mono); color:#a80a0a; text-shadow:0 0 5px rgba(0,0,0,0.8); font-size:1.1rem; background:rgba(0,0,0,0.75); padding:3px 10px; border: 1px solid #a80a0a;">FITA #15: O EXPERIMENTO ALICE</div>
  `;
  
  // Draw red audio visualizer on canvas
  const canvas = document.getElementById('tv-visualizer');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 480;
    canvas.height = 320;
    
    let frame = 0;
    const loop = () => {
      if (isTvStatic || !isTvOn) return;
      
      // Clean background with a very subtle red tint
      ctx.fillStyle = "#070101";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Slightly shift coordinates dynamically to create VCR analog jitter
      let jitterX = 0;
      let jitterY = 0;
      if (Math.random() < 0.12) {
        jitterX = Math.random() * 4 - 2;
        jitterY = Math.random() * 2 - 1;
      }
      
      // Draw the red logo scaled beautifully in the center
      const logoW = 380;
      const logoH = (347 / 800) * logoW; // Scale based on 800x347 aspect ratio
      const logoX = (canvas.width - logoW) / 2 + jitterX;
      const logoY = (canvas.height - logoH) / 2 - 15 + jitterY;
      
      // Draw logo with VCR chromatic aberration (Cyan / Red offsets)
      if (Math.random() < 0.06) {
        ctx.globalAlpha = 0.55;
        ctx.drawImage(tvLogoImg, logoX - 5, logoY, logoW, logoH);
        ctx.drawImage(tvLogoImg, logoX + 5, logoY, logoW, logoH);
        ctx.globalAlpha = 1.0;
      } else {
        ctx.drawImage(tvLogoImg, logoX, logoY, logoW, logoH);
      }
      
      // Draw CRT scanlines
      ctx.strokeStyle = "rgba(168,10,10,0.22)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Moving VCR scan hum bar overlay
      const humY = (frame * 1.2) % (canvas.height + 40) - 20;
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(0, humY, canvas.width, 20);
      
      // Draw medical audio oscilloscope wave at the bottom
      ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin(x * 0.08 + frame * 0.12) * Math.sin(frame * 0.015) * 12 + (canvas.height - 45) + (Math.random() * 1.5 - 0.75);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Clinical audio tape subtitles
      const subtitles = [
        "[ÁUDIO RESTRITO A] ALICE: 'Por que os espelhos continuam mentindo?'",
        "[GRAVAÇÃO] DR. ARTHUR: 'A dosagem de Letheum deve ser mantida.'",
        "[ALERTA DE SEGURANÇA] Fuga de integridade registrada no subsolo.",
        "[PRONTUÁRIO] A lixeira hospitalar esconde memórias purgadas.",
        "[ARQUIVO OCULTO] 'Arthur, por favor, me deixe levar ela embora...'",
        "[SUBLIMINAR] ELA NUNCA ESTEVE NO JARDIM. A VERDADE JAZ AQUI."
      ];
      const subIdx = Math.floor(frame / 160) % subtitles.length;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "14px 'VT323'";
      ctx.textAlign = "center";
      ctx.fillText(subtitles[subIdx], canvas.width / 2, canvas.height - 15);
      
      frame++;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}


// ==========================================================================
// 8. GLOBAL INITIALIZATION
// ==========================================================================
// Dynamic story sections scroll animation
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-text').forEach(el => scrollObserver.observe(el));

// Dynamic story phrases cycler
const gamePhrases = document.querySelectorAll('.phrase');
let gamePhraseIdx = 0;
if (gamePhrases.length > 0) {
  setInterval(() => {
    gamePhrases[gamePhraseIdx].classList.remove('active');
    gamePhraseIdx = (gamePhraseIdx + 1) % gamePhrases.length;
    gamePhrases[gamePhraseIdx].classList.add('active');
  }, 4000);
}

// Procedural float dust particles generator
function createDustParticles() {
  const container = document.getElementById('dust-particles');
  if (!container) return;
  
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'dust-particle';
    
    const size = Math.random() * 4 + 1;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `${Math.random() * 100}vh`;
    p.style.animationDelay = `${Math.random() * 20}s`;
    p.style.animationDuration = `${Math.random() * 15 + 10}s`;
    
    container.appendChild(p);
  }
}

createDustParticles();
