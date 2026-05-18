// SHATTERING GLASS EFFECT
const shatterBg = document.getElementById('shatter-bg');
const cols = 8;
const rows = 8;
const shards = [];

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const shard = document.createElement('div');
    shard.className = 'shard';
    
    const left = (x / cols) * 100;
    const right = ((x + 1) / cols) * 100;
    const top = (y / rows) * 100;
    const bottom = ((y + 1) / rows) * 100;
    
    const p1x = left + (Math.random() * 2 - 1);
    const p1y = top + (Math.random() * 2 - 1);
    const p2x = right + (Math.random() * 2 - 1);
    const p2y = top + (Math.random() * 2 - 1);
    const p3x = right + (Math.random() * 2 - 1);
    const p3y = bottom + (Math.random() * 2 - 1);
    const p4x = left + (Math.random() * 2 - 1);
    const p4y = bottom + (Math.random() * 2 - 1);

    shard.style.clipPath = \`polygon(\${p1x}% \${p1y}%, \${p2x}% \${p2y}%, \${p3x}% \${p3y}%, \${p4x}% \${p4y}%)\`;
    shard.style.width = '100vw';
    shard.style.height = '100vh';
    
    shards.push({
      el: shard,
      dx: (Math.random() - 0.5) * 800,
      dy: (Math.random() - 0.5) * 800,
      rot: (Math.random() - 0.5) * 120,
      vz: Math.random() * 300 - 150
    });
    
    shatterBg.appendChild(shard);
  }
}

let lastScroll = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  const maxScroll = window.innerHeight * 1.5; 
  let progress = Math.max(0, Math.min(currentScroll / maxScroll, 1));
  
  // Efeito "o vidro volta diferente"
  const scrollingUp = currentScroll < lastScroll;
  if (scrollingUp && progress > 0 && progress < 1) {
    shards.forEach(s => {
      s.rot += (Math.random() - 0.5) * 2;
      s.dx += (Math.random() - 0.5) * 5;
    });
  }
  lastScroll = currentScroll;
  
  shards.forEach(s => {
    let p = Math.max(0, (progress - 0.1) / 0.9);
    if (p > 0) {
      const tx = s.dx * Math.pow(p, 1.5);
      const ty = s.dy * Math.pow(p, 1.5);
      const r = s.rot * p;
      const op = 1 - Math.pow(p, 3);
      s.el.style.transform = \`translate3d(\${tx}px, \${ty}px, \${s.vz}px) rotate(\${r}deg)\`;
      s.el.style.opacity = op;
    } else {
      s.el.style.transform = 'none';
      s.el.style.opacity = 1;
    }
  });
});

// FADE-IN STORY TEXT
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.5 });
document.querySelectorAll('.fade-text').forEach(el => observer.observe(el));

// DYNAMIC PHRASES
const phrases = document.querySelectorAll('.phrase');
let phraseIndex = 0;
setInterval(() => {
  phrases[phraseIndex].classList.remove('active');
  phraseIndex = (phraseIndex + 1) % phrases.length;
  phrases[phraseIndex].classList.add('active');
}, 3000);

// CHARACTERS MODAL
const charsData = {
  alice: { name: "Alice", desc: "A paciente principal. Acusada de um crime terrível que não consegue lembrar. Suas memórias estão fragmentadas; a realidade é o que ela quiser acreditar." },
  gato: { name: "O Gato", desc: "Uma voz nas sombras. Observador, cínico e onipresente. Não se sabe se é um aliado ou um sintoma agravado da medicação." },
  coelho: { name: "O Coelho", desc: "Aquele que a guia pelas instalações do Instituto. Ele tem sempre pressa, e suas trilhas invariavelmente levam à dor." },
  chapeleiro: { name: "O Chapeleiro", desc: "Um paciente veterano que sucumbiu aos experimentos de Tarrant. Seus enigmas escondem verdades dolorosas sobre o passado de Alice." },
  tarrant: { name: "Dr. Arthur Tarrant", desc: "Diretor do Instituto Psiquiátrico. Seus métodos são pouco ortodoxos e sua obsessão pelo cérebro de Alice ultrapassa qualquer ética médica." },
  rainha: { name: "Rainha de Copas", desc: "Uma figura de autoridade brutal manifestada na mente de Alice. Representa controle absoluto, punição e culpa profunda." }
};

const modal = document.getElementById('char-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');

document.querySelectorAll('.char-card').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.getAttribute('data-id');
    modalTitle.textContent = charsData[id].name;
    modalDesc.textContent = charsData[id].desc;
    modal.classList.add('active');
  });
});

document.querySelector('.close-modal').addEventListener('click', () => {
  modal.classList.remove('active');
});

// TERMINAL ARG
const termInput = document.getElementById('terminal-input');
const termBody = document.getElementById('terminal-body');

termInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = termInput.value.trim().toUpperCase();
    termInput.value = '';
    printTerm(\`> \${val}\`);
    
    switch(val) {
      case 'HELP': printTerm("COMANDOS: ALICE15, REDQUEEN, TARRANT, CLOCKBROKEN, WHOAMI"); break;
      case 'ALICE15': printTerm("ARQUIVO: Paciente 15. Status: Contenção máxima. Notas: Mantenha espelhos afastados."); break;
      case 'REDQUEEN': printTerm("ERRO: Acesso negado. Cortem-lhe a cabeça."); break;
      case 'TARRANT': printTerm("O Doutor está ocupado dissecando verdades. Não o incomode."); break;
      case 'CLOCKBROKEN': printTerm("O tempo parou às 03:06. Foi quando o sangue secou."); break;
      case 'WHOAMI': printTerm("Você é a próxima cobaia."); break;
      case '': break;
      default: printTerm("Comando corrompido.");
    }
  }
});

function printTerm(text) {
  const p = document.createElement('p');
  p.textContent = text;
  termBody.appendChild(p);
  termBody.scrollTop = termBody.scrollHeight;
}

// SECRET EFFECTS
console.log("%c VOCÊ NÃO PODE SALVÁ-LA.", "color: red; font-size: 20px; font-weight: bold; background: black; padding: 10px;");

let idleTime = 0;
setInterval(() => {
  idleTime++;
  if (idleTime === 30) {
    document.getElementById('secret-flash').classList.add('flash-anim');
    setTimeout(() => document.getElementById('secret-flash').classList.remove('flash-anim'), 1000);
  }
}, 1000);

['mousemove', 'scroll', 'keypress', 'click'].forEach(evt => 
  window.addEventListener(evt, () => idleTime = 0)
);

// CLOCK
setInterval(() => {
  const now = new Date();
  let h = now.getHours().toString().padStart(2, '0');
  let m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('secret-clock').textContent = \`\${h}:\${m}\`;
  
  if (h === '03' && m === '06') {
     document.body.style.filter = 'hue-rotate(45deg) contrast(1.2)';
  }
}, 1000);

let clockClicks = 0;
document.getElementById('secret-clock').addEventListener('click', () => {
  clockClicks++;
  if(clockClicks >= 5) {
     document.body.innerHTML = '<div style="height:100vh; display:flex; align-items:center; justify-content:center; color:red; font-size:4rem; text-align:center; font-family:VT323; background:#000;">VOCÊ NÃO DEVERIA ESTAR AQUI. 404.</div>';
  }
});
