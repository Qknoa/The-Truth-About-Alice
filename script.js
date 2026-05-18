let currentApp = null;
const apps = {
  mail: { name: 'Correio.exe', pass: '', locked: false },
  files: { name: 'Arquivos.exe', pass: 'ALICE', locked: true },
  cam: { name: 'Cam_Sys.exe', pass: '0306', locked: true },
  alice: { name: 'The_Truth_About_Alice.exe', pass: '', locked: false }
};

document.getElementById('btn-portal').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('login-modal').classList.remove('hidden');
});

document.getElementById('btn-login').addEventListener('click', () => {
  // Trigger Glitch
  document.getElementById('login-modal').classList.add('hidden');
  const glitch = document.getElementById('glitch-screen');
  glitch.classList.remove('hidden');
  
  // Play glitch audio
  const actx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = actx.createOscillator();
  const gain = actx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(100, actx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, actx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.5, actx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 1.5);
  osc.connect(gain);
  gain.connect(actx.destination);
  osc.start();
  osc.stop(actx.currentTime + 1.5);

  setTimeout(() => {
    glitch.classList.add('hidden');
    document.getElementById('fake-site').classList.add('hidden');
    document.getElementById('os-screen').classList.remove('hidden');
  }, 1500);
});

function openApp(appId) {
  currentApp = appId;
  const app = apps[appId];
  if (app.locked) {
    document.getElementById('pwd-app-name').textContent = app.name;
    document.getElementById('app-password').value = '';
    document.getElementById('pwd-error').classList.add('hidden');
    document.getElementById('password-window').classList.remove('hidden');
    document.getElementById('app-password').focus();
  } else {
    showAppContent(appId);
  }
}

function closePassword() {
  document.getElementById('password-window').classList.add('hidden');
}

function checkPassword() {
  const pwd = document.getElementById('app-password').value.toUpperCase().trim();
  if (pwd === apps[currentApp].pass) {
    apps[currentApp].locked = false;
    closePassword();
    showAppContent(currentApp);
  } else {
    document.getElementById('pwd-error').classList.remove('hidden');
    document.getElementById('app-password').value = '';
    document.getElementById('app-password').focus();
  }
}

document.getElementById('app-password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkPassword();
});

function closeApp() {
  document.getElementById('app-window').classList.add('hidden');
}

function showAppContent(appId) {
  const win = document.getElementById('app-window');
  const content = document.getElementById('app-content');
  document.getElementById('app-title').textContent = apps[appId].name;
  
  if (appId === 'files') {
    content.innerHTML = `
      <div class="folder-grid">
        <div class="file-item" onclick="openText('log_01.txt', 'Paciente 01 demonstra sinais de histeria. A mãe está morta. Ela não entende o que fez.')">📄 log_01.txt</div>
        <div class="file-item" onclick="openText('notas_dr.txt', 'O diretor Tarrant solicitou aumento da dose. Ele diz que ela precisa esquecer o coelho. Qual coelho?')">📄 notas_dr.txt</div>
        <div class="file-item" onclick="openText('DICA.TXT', 'Esqueci a senha das câmeras de novo. É a hora em que o assassinato aconteceu. 0306.')">📄 DICA.TXT</div>
      </div>
    `;
  } else if (appId === 'mail') {
    content.innerHTML = `
      <ul class="mail-list">
        <li onclick="openMail('DE: admin | PARA: todos', 'ALERTA DE SEGURANÇA: A senha da pasta Arquivos.exe foi redefinida. A nova senha é o primeiro nome da paciente do Quarto 15 em letras maiúsculas. (Nota: O nome começa com A e termina com LICE)')">ASSUNTO: Mudança de Senhas</li>
        <li onclick="openMail('DE: dr_tarrant | PARA: admin', 'Apague os registros de hoje imediatamente. Ela sabe que estamos aqui. Não podemos deixar rastros no sistema.')">ASSUNTO: URGENTE</li>
      </ul>
      <div id="mail-view" class="mail-body hidden"></div>
    `;
  } else if (appId === 'cam') {
    content.innerHTML = `
      <div style="background: #000; width: 100%; height: 350px; position: relative; color: white; display: flex; align-items: flex-end; padding: 10px; font-family: 'VT323', monospace;">
        <div style="position: absolute; top: 10px; left: 10px; color: red; animation: blink 1s infinite;">REC ●</div>
        <div style="position: absolute; top: 10px; right: 10px;">CAM 04 - QUARTO 15</div>
        <div style="text-align: center; width: 100%; font-size: 1.5rem; color: #ff0000; text-shadow: 0 0 5px red;">[ SINAL CORROMPIDO - MOVIMENTO DETECTADO NO CORREDOR ]</div>
        <style>@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }</style>
      </div>
      <p style="margin-top: 10px; text-align:center; color: red;">ALERTA: Violação de contenção detectada.</p>
    `;
  } else if (appId === 'alice') {
    content.innerHTML = `
      <div style="width: 100%; height: 450px; background: #000; border: 2px inset #dfdfdf;">
        <iframe src="game.html" style="width: 100%; height: 100%; border: none;" title="The Truth About Alice Game"></iframe>
      </div>
      <p style="text-align: center; margin-top: 10px; font-size: 0.9rem; color: #555;">(Conexão estabelecida com o servidor externo...)</p>
    `;
  }
  
  win.classList.remove('hidden');
}

function openText(title, body) {
  const content = document.getElementById('app-content');
  content.innerHTML = `
    <button onclick="showAppContent('files')" style="margin-bottom: 10px; font-family: 'VT323'; font-size: 1rem; cursor: pointer;">⬅ Voltar</button>
    <h4 style="margin-bottom: 10px;">${title}</h4>
    <div class="text-file">${body}</div>
  `;
}

function openMail(header, body) {
  const view = document.getElementById('mail-view');
  view.innerHTML = `<strong>${header}</strong><br><br>${body}`;
  view.classList.remove('hidden');
}
