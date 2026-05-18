const root = document.documentElement;
const light = document.querySelector('.cursor-light');
const audioToggle = document.querySelector('.audio-toggle');
const modal = document.getElementById('character-modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalPortrait = document.getElementById('modal-portrait');
let audioContext;
let masterGain;
let oscillators = [];

const characters = {
  alice: ['Alice', 'Paciente 15. Alice lembra do sangue, da porta aberta e de uma voz repetindo que ela precisava confessar. O jogo nunca confirma se suas lembranças são defesa, culpa ou implante.', 'A'],
  coelho: ['Coelho', 'Uma presença apressada que atravessa áreas interditadas do Instituto. Ele parece ajudar Alice, mas sempre a conduz para memórias mais dolorosas.', 'R'],
  tarrant: ['Dr. Arthur Tarrant', 'Fundador do Instituto Tarrant e defensor de terapias de reconstrução de memória. Seus relatórios soam clínicos demais para alguém tão interessado em apagar pessoas.', 'T'],
  rainha: ['Rainha', 'A forma que a punição assume quando Alice perde controle. Voz vermelha, sentença curta, nenhuma chance de defesa.', 'Q'],
  gato: ['Gato', 'O comentário no canto da visão. O sorriso que permanece depois que o corpo desaparece. Talvez seja aliado; talvez seja apenas lucidez cruel.', 'C'],
  chapeleiro: ['Chapeleiro', 'Um sobrevivente dos protocolos antigos. Fala em enigmas porque frases diretas foram as primeiras coisas que o tratamento destruiu.', 'H']
};

document.addEventListener('pointermove', (event) => {
  root.style.setProperty('--mx', `${event.clientX}px`);
  root.style.setProperty('--my', `${event.clientY}px`);
  if (light) light.style.opacity = '.32';
});

window.addEventListener('scroll', () => {
  root.style.setProperty('--scroll', Math.min(window.scrollY / window.innerHeight, 1).toFixed(3));
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  revealObserver.observe(element);
});

document.querySelectorAll('.character-card').forEach((card) => {
  card.addEventListener('click', () => {
    const data = characters[card.dataset.character];
    modalTitle.textContent = data[0];
    modalText.textContent = data[1];
    modalPortrait.textContent = data[2];
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    playHit(80, 0.025);
  });
});

document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function startAtmosphere() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.045;
  masterGain.connect(audioContext.destination);
  createDrone(38, 'sine', 0.45);
  createDrone(57, 'triangle', 0.2);
  createNoise();
}

function createDrone(frequency, type, volume) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;
  oscillator.connect(gain).connect(masterGain);
  oscillator.start();
  oscillators.push(oscillator);
}

function createNoise() {
  const bufferSize = audioContext.sampleRate * 2;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) data[i] = (Math.random() * 2 - 1) * 0.18;
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  source.loop = true;
  filter.type = 'lowpass';
  filter.frequency.value = 720;
  gain.gain.value = 0.12;
  source.connect(filter).connect(gain).connect(masterGain);
  source.start();
  oscillators.push(source);
}

function stopAtmosphere() {
  oscillators.forEach((node) => node.stop());
  oscillators = [];
  audioContext.close();
  audioContext = undefined;
}

function playHit(frequency, volume) {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sawtooth';
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
  oscillator.connect(gain).connect(masterGain);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.36);
}

audioToggle.addEventListener('click', () => {
  const enabled = audioToggle.getAttribute('aria-pressed') === 'true';
  if (enabled) {
    stopAtmosphere();
    audioToggle.setAttribute('aria-pressed', 'false');
    audioToggle.textContent = 'Áudio: OFF';
  } else {
    startAtmosphere();
    audioToggle.setAttribute('aria-pressed', 'true');
    audioToggle.textContent = 'Áudio: ON';
  }
});

document.querySelector('.newsletter').addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.textContent = 'Registrado';
  playHit(120, 0.018);
});
