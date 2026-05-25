

let sanityLevel = 100;
let currentPath = "C:/";
let currentCamera = "CAM_01";
let activeWindow = null;
let zIndexCounter = 100;
let isBooting = false;
let isScanRunning = false;
let terminalLog = [];
let camLocked = true;
let soundHumNode = null;
let heartRateInterval = null;
let soundEnabled = false;
let audioCtx = null;

function getSystemIcon(key) {
  if (!key) return "";
  const cleanKey = key.replace(/[\[\]]/g, "").toUpperCase();
  
  switch (cleanKey) {
    case 'DIR':
      return `<svg class="sys-icon icon-dir" viewBox="0 0 24 24" width="16" height="16" fill="#d97706" stroke="#b45309" stroke-width="1.5" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M3 7a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .9.55l1.64 3.29A1 1 0 0 0 11.72 9H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>`;
    case 'LKD':
      return `<svg class="sys-icon icon-locked" viewBox="0 0 24 24" width="16" height="16" fill="#991b1b" stroke="#7f1d1d" stroke-width="1.5" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M3 7a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .9.55l1.64 3.29A1 1 0 0 0 11.72 9H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><rect x="9" y="11" width="6" height="5" rx="1" fill="#fff"/><path d="M10 11V9a2 2 0 1 1 4 0v2" stroke="#fff" fill="none"/></svg>`;
    case 'DRV':
      return `<svg class="sys-icon icon-drv" viewBox="0 0 24 24" width="16" height="16" fill="#94a3b8" stroke="#475569" stroke-width="1.5" style="display:inline-block; vertical-align:middle; margin-right:4px;"><rect x="3" y="8" width="18" height="8" rx="1"/><line x1="6" y1="12" x2="8" y2="12" stroke="#22c55e" stroke-linecap="round"/><circle cx="16" cy="12" r="1" fill="#22c55e"/><circle cx="18" cy="12" r="1" fill="#e11d48"/></svg>`;
    case 'MAIL':
      return `<svg class="sys-icon icon-mail" viewBox="0 0 24 24" width="16" height="16" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" style="display:inline-block; vertical-align:middle; margin-right:4px;"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6" stroke="#fff"/></svg>`;
    case 'CAM':
      return `<svg class="sys-icon icon-cam" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4" fill="#052e16"/></svg>`;
    case 'CMD':
      return `<svg class="sys-icon icon-cmd" viewBox="0 0 24 24" width="16" height="16" fill="#0f172a" stroke="#64748b" stroke-width="1.5" style="display:inline-block; vertical-align:middle; margin-right:4px;"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="m6 8 4 4-4 4M12 15h6" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/></svg>`;
    case 'GUARD':
      return `<svg class="sys-icon icon-guard" viewBox="0 0 24 24" width="16" height="16" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 8v8M9 12h6" stroke="#60a5fa" stroke-width="2.5"/></svg>`;
    case 'TRASH':
      return `<svg class="sys-icon icon-trash" viewBox="0 0 24 24" width="16" height="16" fill="#334155" stroke="#1e293b" stroke-width="1.5" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke-linecap="round"/></svg>`;
    case 'TXT':
      return `<svg class="sys-icon icon-txt" viewBox="0 0 24 24" width="16" height="16" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`;
    case 'NET':
      return `<svg class="sys-icon icon-net" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M12 9h.01M8 9h.01M16 9h.01" stroke-width="3"/></svg>`;
    case 'SANITY':
      return `<svg class="sys-icon icon-sanity" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
    case 'REBOOT':
      return `<svg class="sys-icon icon-reboot" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l6.73-5.19"/></svg>`;
    case 'SHUTDOWN':
      return `<svg class="sys-icon icon-shutdown" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/></svg>`;
    case 'AVISO':
      return `<svg class="sys-icon icon-aviso" viewBox="0 0 24 24" width="20" height="20" fill="#eab308" stroke="#a16207" stroke-width="1.5" style="display:inline-block; vertical-align:middle; margin-right:6px;"><path d="m12 3 10 18H2L12 3Z" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="#000" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.5" fill="#000" stroke="none"/></svg>`;
    default:
      return key;
  }
}

let fileReadTracker = {
  "C:/RECORDS/alice.txt": 0,
  "C:/USERS/DR_TARRANT/diagnosticos.txt": 0
};

function showClinicalAlert(message, title = 'Aviso do Sistema', isError = false) {
  initAudio();
  if (isError) {
    playErrorBeep();
  } else {
    playClickSound();
  }
  
  Swal.fire({
    title: title,
    text: message,
    icon: isError ? 'error' : 'info',
    background: '#ffffff',
    color: '#2c3e50',
    iconColor: isError ? '#e11d48' : '#457b9d',
    confirmButtonColor: '#1d3557',
    confirmButtonText: 'Entendido',
    customClass: {
      popup: 'clinical-swal-popup',
      title: 'clinical-swal-title',
      htmlContainer: 'clinical-swal-text',
      confirmButton: 'clinical-swal-btn'
    },
    showClass: {
      popup: 'swal2-noanimation',
      backdrop: 'swal2-noanimation'
    },
    hideClass: {
      popup: '',
      backdrop: ''
    }
  });
}

function openHospitalSubpage(pageKey) {
  initAudio();
  playClickSound();
  
  const modal = document.getElementById('hospital-modal');
  const titleEl = document.getElementById('hospital-modal-title');
  const bodyEl = document.getElementById('hospital-modal-body');
  
  if (!modal || !titleEl || !bodyEl) return;
  
  let title = '';
  let body = '';
  
  switch (pageKey) {
    case 'missao':
      title = 'Nossa Missão';
      body = `<p>O Instituto Psiquiátrico Tarrant, estabelecido em 1985, é uma instituição médica privada pioneira e de excelência voltada ao tratamento de desordens cognitivas e neurológicas graves de alta complexidade. Nosso compromisso é restabelecer a estabilidade psicofisiológica por meio de terapias de vanguarda.</p>
              <h3>Filosofia de Reabilitação</h3>
              <p>Através de protocolos avançados de supressão sináptica direcionada, ajudamos nossos pacientes a esquecer os traumas que os assombram. É nosso dever reformar a percepção da realidade e suprimir memórias refratárias, garantindo que o interno permaneça complacente mesmo contra sua vontade original, moldando sua psique sob uma lousa de cera aquecida e reescrita.</p>
              <p>Nosso foco reside na estabilização mental de longo prazo, garantindo que as lembranças indesejadas sejam bloqueadas por inibidores sinápticos e substituídas por uma narrativa terapêutica saudável de reinserção social controlada.</p>`;
      break;
    case 'especialidades':
      title = 'Especialidades e Tratamentos';
      body = `<p>O hospital oferece uma infraestrutura técnica robusta com protocolos científicos validados para o tratamento de estados dissociativos crônicos, esquizofrenia catatônica e perturbações da memória de curto e longo prazo.</p>
              <ul>
                <li><strong>Supressão Amnésica Induzida:</strong> Administração controlada do Composto Letheum para o isolamento de episódios refratários e atenuação sináptica seletiva.</li>
                <li><strong>Protocolo de Isolamento de Risco:</strong> Internação de alta segurança no subsolo, onde pacientes em ressonância severa são alocados em celas com luz salmão de alerta, mantendo-os em um estado de transe induzido sob vigilância contínua para evitar surtos paranóicos.</li>
              </ul>
              <p>Todos os tratamentos de alta complexidade do subsolo são coordenados sob a supervisão do Diretor Médico Geral Dr. Tarrant, auxiliado pela equipe técnica de plantão com máscaras para blindagem pessoal.</p>`;
      break;
    case 'corpo-clinico':
      title = 'Corpo Clínico e Diretoria';
      body = `<p>Nossa dedicada equipe clínica é composta por médicos especialistas, enfermeiros assistentes e pesquisadores pioneiros na área de psiquiatria experimental e modulação cognitiva.</p>
              <h3>Dr. Arthur Tarrant</h3>
              <p><em>Diretor Geral & Fundador (Registro #0001)</em><br>Criador da terapia de atenuação sináptica e desenvolvedor da Letheum. "A consciência humana é infinitamente maleável. Se o registro do passado contém deformidades insustentáveis, nosso dever clínico e ético é aquecer a lousa de cera e reescrevê-la para a própria segurança do paciente."</p>
              <h3>Corpo Médico de Intervenção</h3>
              <p><em>Equipe Técnica do Subsolo</em><br>Profissionais de alta especialização que, para preservar o distanciamento analítico e evitar ressonância mental com delírios, utilizam obrigatoriamente máscaras durante procedimentos de sedação e reestruturação cognitiva de internos refratários.</p>`;
      break;
    case 'privacidade':
      title = 'Política de Privacidade e Sigilo';
      body = `<p>No Instituto Tarrant, o sigilo dos prontuários e a confidencialidade dos registros são salvaguardados por protocolos de segurança rigorosos e blindagem administrativa eletrônica de última geração.</p>
              <h3>Protocolo de Segurança e Chaves de Acesso</h3>
              <p>Para fins de conformidade interna e auditoria, todas as pastas confidenciais da diretoria são criptografadas por hardware com uma chave algorítmica composta. A validação técnica exige que o administrador utilize o token composto pelo código numérico obtido da constante clínica 153 multiplicada pelas faces do espelho, concatenado por hífen ao ano de fundação deste instituto (1985). Qualquer vazamento desta credencial constituirá quebra grave de segurança.</p>
              <p>Ao navegar em nosso portal institucional, o usuário reconhece e concorda que flutuações de ondas cerebrais, memórias retrospectivas e registros de eventos pretéritos monitorados em nossas instalações pertencem sob direito absoluto à administração do hospital.</p>`;
      break;
    case 'internacao':
      title = 'Termo de Internação Compulsória';
      body = `<p>Conforme estabelecido pela portaria de segurança hospitalar do subsolo, a admissão de residentes refratários sob regime de contenção máxima implica na renúncia voluntária do interno à soberania de suas próprias lembranças.</p>
              <h3>Procedimentos Operacionais da Cela A[redacted]</h3>
              <p>A Paciente A[redacted] está sob regime de contenção mecânica e terapia química de 250mg. É terminantemente proibido destapar ou olhar diretamente para o grande espelho reflexivo de sua cela. O reflexo da interna atua como gatilho de ressonância psicofísica, gerando pânico induzido e loops paranóicos contagiosos na equipe assistencial.</p>
              <p>Os internos do subsolo que apresentarem comportamento agressivo ou relatos recorrentes sobre uma figura alta de máscara de porcelana rachada (o Chapeleiro) ou um felino com sorriso largo e fixo (o Gato) serão transferidos imediatamente para a cadeira de contenção na Toca do Coelho.</p>`;
      break;
    case 'emergencia':
      title = 'Contato de Emergência';
      body = `<p>O serviço de contenção psiquiátrica de emergência e pronto atendimento do subsolo opera em regime ininterrupto de 24 horas para o manejo de crises severas, ataques de pânico agudos e loops temporais persistentes.</p>
              <h3>Sintomas Clínicos Documentados</h3>
              <p>Os pacientes do subsolo frequentemente relatam a audição persistente de um barulho de metal se arrastando pelo chão de cimento, o qual é classificado por nossa equipe científica como um sintoma clínico documentado de dissociação severa pré-surto. Se as paredes da instalação parecerem se mover ou se a Paciente A[redacted] demonstrar espasmos nervosos severos associados a memórias induzidas, o plantonista deve acionar o ramal de contenção imediata.</p>
              <p><strong>Linha Direta de Emergência:</strong> Ramal do Operador (O ramal de liberação numérica é obtido pelo produto do código clínico 153 duplicado no espelho)</p>`;
      break;
  }
  
  bodyEl.innerHTML = body;
  modal.classList.remove('hidden');
}

function closeHospitalModal() {
  const modal = document.getElementById('hospital-modal');
  if (modal) modal.classList.add('hidden');
}

function showOSDialog(options) {
  const box = document.getElementById('os-msg-box');
  const titleEl = document.getElementById('os-msg-title');
  const textEl = document.getElementById('os-msg-text');
  const iconEl = document.getElementById('os-msg-icon');
  const actionsEl = document.getElementById('os-msg-actions');
  
  if (!box || !titleEl || !textEl || !actionsEl) return;
  
  titleEl.textContent = options.title || "Mensagem do Sistema";
  textEl.innerHTML = (options.message || "").replace(/\n/g, "<br>");
  if (iconEl) {
    iconEl.innerHTML = getSystemIcon(options.icon || "[AVISO]");
  }
  
  actionsEl.innerHTML = "";
  
  if (options.type === 'confirm') {
    const btnYes = document.createElement('button');
    btnYes.className = 'os-btn';
    btnYes.textContent = "Sim";
    btnYes.onclick = () => {
      closeOSMsgBox();
      if (options.onYes) options.onYes();
    };
    const btnNo = document.createElement('button');
    btnNo.className = 'os-btn';
    btnNo.textContent = "Não";
    btnNo.onclick = () => {
      closeOSMsgBox();
      if (options.onNo) options.onNo();
    };
    actionsEl.appendChild(btnYes);
    actionsEl.appendChild(btnNo);
  } else if (options.type === 'prompt') {
    const input = document.createElement('input');
    input.type = options.inputType || 'text';
    input.id = 'os-msg-prompt-input';
    input.style.width = '100%';
    input.style.marginTop = '8px';
    input.style.fontFamily = 'var(--font-retro)';
    input.style.fontSize = '1.1rem';
    input.value = options.defaultValue || "";
    
    textEl.appendChild(document.createElement('br'));
    textEl.appendChild(input);
    
    const btnOk = document.createElement('button');
    btnOk.className = 'os-btn';
    btnOk.textContent = "OK";
    btnOk.onclick = () => {
      const val = document.getElementById('os-msg-prompt-input').value;
      closeOSMsgBox();
      if (options.onOk) options.onOk(val);
    };
    const btnCancel = document.createElement('button');
    btnCancel.className = 'os-btn';
    btnCancel.textContent = "Cancelar";
    btnCancel.onclick = () => {
      closeOSMsgBox();
      if (options.onCancel) options.onCancel();
    };
    actionsEl.appendChild(btnOk);
    actionsEl.appendChild(btnCancel);
    
    setTimeout(() => input.focus(), 50);
  } else {
    
    const btnOk = document.createElement('button');
    btnOk.className = 'os-btn';
    btnOk.textContent = "OK";
    btnOk.onclick = () => {
      closeOSMsgBox();
      if (options.onOk) options.onOk();
    };
    actionsEl.appendChild(btnOk);
  }
  
  box.classList.remove('hidden');
  box.style.top = "35%";
  box.style.left = "35%";
  zIndexCounter += 2;
  box.style.zIndex = zIndexCounter;
  
  playErrorBeep();
}

function closeOSMsgBox() {
  const box = document.getElementById('os-msg-box');
  if (box) box.classList.add('hidden');
}

const fileSystem = {
  'C:': {
    type: 'dir',
    children: {
      'USERS': {
        type: 'dir',
        children: {
          'DR_TARRANT': {
            type: 'dir',
            locked: true,
            password: '0306-1985',
            children: {
              'diagnosticos.txt': { type: 'file', content: 'PACIENTE A[redacted] - REGISTRO CLÍNICO DA DIRETORIA\n\nA paciente demonstra extrema resistência à terapia cognitiva reconstrutiva na Cela A[redacted]. A dosagem de Letheum foi ajustada para o nível máximo de 250mg pelo enfermeiro portando máscara. Embora o bloqueio sináptico tenha induzido lapsos de memória retrógrada, ela persiste em sussurrar sobre relógios parados no instante congelado da trindade inicial e do dobro do silêncio, desenhando xícaras de chá nas paredes. A narrativa de surto foi firmada oficialmente. Seus delírios envolvem uma figura alta com máscara de porcelana rachada e um gato que ri nas tubulações. Ela insiste que apenas observava o evento de 1985 e que outra presença a fez segurar o objeto metálico... [TRECHO CORTADO PARA SIGILO OPERACIONAL DO INSTITUTO].' },
              'diario_seguranca.txt': { type: 'file', content: 'SEGURANÇA INTERNA - DIÁRIO DE MONITORAMENTO\n\nO grande espelho da Cela A[redacted] deve permanecer permanentemente coberto por uma lona opaca por ordem expressa do Diretor. Observou-se ressonância cerebral exacerbada quando a paciente interage com seu próprio reflexo. A equipe de enfermagem (portando máscaras) relatou sintomas de instabilidade emocional após observação contínua. Caso ocorra uma quebra visual grave ou ressonância na ala inferior, o operador do terminal clínico deve executar imediatamente o comando MIRROR para calibração de emergência.' }
            }
          },
          'ADMIN': {
            type: 'dir',
            children: {
              'senhas.txt': { type: 'file', content: 'CÓDIGOS DE SEGURANÇA INTERNA E CRIPTOGRAFIA\n\nO feed de vídeo da câmera oculta instalada na Cela A[redacted] (CAM_15) está sob criptografia de hardware restrita. Chave de liberação do painel físico: O código numérico de 4 dígitos é o produto da constante clínica 153 multiplicada por duas faces do espelho. Insira com preenchimento à esquerda.' },
              'sistema.log': { type: 'file', content: '1985-06-03 08:00:00: Kernel do Tarrant OS (V1.0) carregado com sucesso.\n2026-05-19 14:46:52: AVISO. Terminal clínico autenticado sob máscara. Acesso autorizado sob suporte de vital ativo no subsolo.' }
            }
          },
          'H_CARTER': {
            type: 'dir',
            locked: true,
            children: {
              'prontuario_paciente.txt': { type: 'file', content: 'NOME DO PACIENTE: PACIENTE A[redacted] (Registro #1506)\nESTADO CLÍNICO: Dissociação cognitiva pós-evento severo.\n\nOBSERVAÇÕES: A paciente demonstra extrema intolerância à Letheum administrada na Cela A[redacted]. O evento na ala envolveu pânico severo e relatos de um barulho de metal arrastando. Ela jura que o objeto de metal pertencia a outra presença. [TRECHO CORTADO]. Agendado procedimento de repressão de memória na ala inferior.' },
              'diagnostico_final.txt': { type: 'file', content: 'AVALIAÇÃO DE CAPACIDADE CLÍNICA GERAL\n\n[CENSURADO CONFORME ORDEM DO DIRETOR TARRANT]\nA paciente foi declarada inapta. Os registros originais sobre o objeto e o evento na cozinha de 1985 foram arquivados sob sigilo institutional absoluto na Cela A[redacted]. O tratamento com Letheum em dosagem máxima prossegue sob a vigilância de médicos portando máscaras.' }
            }
          }
        }
      },
      'RECORDS': {
        type: 'dir',
        children: {
          'alice.txt': {
            type: 'file',
            content: 'A Paciente A[redacted] está na Cela A[redacted].',
            dynamic: true,
            readCount: 0
          },
          'cela_a.txt': { type: 'file', content: 'DADOS DA CELA DE ISOLAMENTO DE RISCO\n\nPACIENTE: Paciente A[redacted] (Registro A[redacted])\nIDADE: 15 anos (na admissão)\nDIAGNÓSTICO: Dissociação cognitiva severa, amnésia retrógrada induzida e paranoia persistente.\nESTADO DE CONTENÇÃO: Pavilhão de Isolamento (Subsolo). Luz salmão de alerta ativada. Acesso restrito a médicos portando máscaras.\nSINAIS RECORRENTES: Alucinações com xícaras de chá, um gato de sorriso estático nos armários e queixas frequentes de um barulho de metal arrastando.' },
          'carta_1.txt': { type: 'file', content: 'CARTA DE ALICE NUMERADA (1 de 5)\n\nE - Enquanto Dr. Tarrant repete com sua voz calma que tudo não passa de uma farsa na minha mente, o Gato me observa do topo do armário com aquele sorriso largo e estático. Ele murmura que o objeto de metal na minha mão não era meu, mas de quem o colocou lá.' },
          'carta_2.txt': { type: 'file', content: 'CARTA DE ALICE NUMERADA (2 de 5)\n\nC - Coisas terríveis estão escondidas sob a sedação do Coelho Branco. Ele se debate na cadeira de contenção mecânica, sussurrando febrilmente que seu relógio de bolso congelou na trindade e no seu dobro silencioso.' },
          'carta_3.txt': { type: 'file', content: 'CARTA DE ALICE NUMERADA (3 de 5)\n\nI - Isolada no escuro do subsolo, ouço os passos pesados e o ruído ensurdecedor de metal se arrastando pelo concreto. Ela está vindo. A Rainha de Vermelho não nos deixa fugir. Os médicos vestindo suas máscaras frias apenas anotam meus gritos.' },
          'carta_4.txt': { type: 'file', content: 'CARTA DE ALICE NUMERADA (4 de 5)\n\nL - Luzes cor de salmão cobrem a soleira da cela secreta. No corredor escuro da Toca do Coelho, há oito portas trancadas, mas a sala 7 guarda um corpo pendurado por cordas invisíveis. A caixa no canto precisa de três dígitos... 4... 7... 8...' },
          'carta_5.txt': { type: 'file', content: 'CARTA DE ALICE NUMERADA (5 de 5)\n\nA - Algumas portas de memória nunca deveriam ser abertas. O chá está servido pelo Chapeleiro, mas os copos de vidro estão quebrados no chão. Se você beber a Letheum, você nunca lembrará quem realmente causou a tragédia na cozinha.' }
        }
      },
      'EXPERIMENTS': {
        type: 'dir',
        children: {
          'projeto_esquecer.txt': { type: 'file', content: 'PROJETO ESQUECER (WONDERLAND)\n\nObjetivo: Substituição de memórias traumáticas por uma narrativa onírica estruturada de aceitação cognitiva.\n\nEstrutura do Experimento (4 Limiares):\n1. Toca do Coelho: Corredor subterrâneo com 8 portas trancadas (cela da Paciente A[redacted] sob luz salmão, caixa com código 478, enforcado na sala 7).\n2. Convite: O Chapeleiro no refeitório com chá na mesa.\n3. Delírio: O Coelho sedado na cadeira tranquilizadora, a paciente recebe um objeto de metal e simula-se a aceitação do evento de 1985.\n4. Rainha de Vermelho: Sequência final de encerramento cognitivo e reconstrução de identidade.' },
          'letheum.txt': { type: 'file', content: 'COMPOSTO QUÍMICO EXPERIMENTAL: LETHEUM\n\nDiretrizes de Dosagem e Efeitos:\n- 10mg (Fase Inicial): Indução de calmaria e atenuação de ansiedade superficial.\n- 50mg (Fase Intermediária): Inibição e bloqueio temporário de memórias de curto prazo.\n- 250mg (Fase Crítica - Dosagem Máxima): Ruptura de memórias estruturadas profundas e indução a transe permanente. Sintoma secundário: Alucinações auditivas intensas (relatos frequentes de metal se arrastando).' }
        }
      },
      'CAMERAS': {
        type: 'dir',
        children: {
          'config.dat': { type: 'file', content: 'CONFIGURAÇÃO OPERACIONAL DE CÂMERAS\n\nCAM_01 = ATIVA\nCAM_02 = ATIVA\nCAM_03 = RUIDO\nCAM_04 = ATIVA\nCAM_15 = BLOQUEADA_SUBTERRANEO (Código clínico requerido)' }
        }
      },
      'SYSTEM': {
        type: 'dir',
        children: {
          'boot.sys': { type: 'file', content: 'BOOT_KERNEL=TARRANT_CORE\nSANITY_CHECK=1\nSYSTEM_ALERT_COUNT=0\nMEM_LIMIT=640KB' },
          'tarrantguard.exe': { type: 'file', content: 'AVISO: O utilitário TarrantGuard Antivírus é executado apenas no modo gráfico. Use o atalho da área de trabalho do Tarrant OS.' }
        }
      },
      'TEMP': {
        type: 'dir',
        children: {
          'backup_03.tmp': { type: 'file', content: '...o relógio da Cela A[redacted] congelou na trindade e seu dobro (03:06)... a estática nas câmeras aumenta... o Gato disse que o objeto metálico era apenas o começo... [TRECHO CENSURADO PELA ADMINISTRAÇÃO]' }
        }
      },
      'LOST': {
        type: 'dir',
        children: {
          'corrompido.txt': { type: 'file', content: '█████ A VERDADE █████ FOI █████ APAGADA █████ OUTRA PRESENÇA █████ ESTAVA █████ CONTROLANDO █████ O METAL █████ NAQUELA NOITE █████' }
        }
      },
      'AUDIO': {
        type: 'dir',
        children: {
          'fita_a_audio.txt': { type: 'file', content: 'TRANSCRIÇÃO DE GRAVAÇÃO AUDIOFÔNICA (FITA RESTRITA A)\n\nDr. Tarrant: "A sensação de dissociação está diminuindo?"\nPaciente: "Não está diminuindo. O Chapeleiro disse que o chá acabou. Mas o relógio continua parado no instante da trindade e seu dobro."\nDr. Tarrant: "O relógio é apenas uma representação. Foque na minha voz."\nPaciente: "Não consigo. O barulho de metal... está arrastando no corredor... ela está chegando!"\n[FITA CORTADA - ESTÁTICA EXTREMA - RUÍDO METÁLICO EXTENSO]' }
        }
      },
      'ARCHIVE': {
        type: 'dir',
        children: {
          'historia.txt': { type: 'file', content: 'INSTITUTO PSIQUIÁTRICO TARRANT\n\nFundado in 1985 na zona rural do estado. Originalmente uma prisão de segurança máxima militar, foi convertido em instalação médica privada de alta tecnologia para tratamento experimental de patologias cognitivas severas. O diretor médico, Dr. Tarrant, lidera pesquisas avançadas utilizando o Composto Letheum e o Protocolo Wonderland.' }
        }
      },
      'TRASH': {
        type: 'dir',
        children: {
          'bilhete_descartado.txt': { type: 'file', content: 'REGISTRO DE ITEM DESCARTADO PELA SEGURANÇA HOSPITALAR\n\n"Alice, não tome o chá que o Chapeleiro serve no refeitório. A cura do Dr. Tarrant é um apagamento cognitivo sistemático. Eles querem que você aceita a culpa por algo que não cometeu. O barulho de metal que você ouve é real. Encontre o ramal obtido multiplicando 153 pelas faces do espelho. A verdade está oculta atrás do espelho da cela."\n\n(Descartado e enviado para a lixeira por ordem da Máscara do Diretor)' }
        }
      },
      '.REMEMBER': {
        type: 'dir',
        hidden: true,
        children: {
          'verdade_crua.txt': { type: 'file', content: 'EU ME LEMBRO. O relógio da cozinha marcava o produto de 153 por 2. O objeto de metal estava sobre a mesa, refletindo a luz fria. Eu vi as mãos do Dr. Tarrant. Ele estava lá. O Gato ria no reflexo do espelho. Disseram que eu tive um ataque e me isolaram na Cela A[redacted] sob luz salmão. Eles colocaram as máscaras frias e me arrastaram. O Letheum serve para me fazer esquecer... mas eu lembro.' }
        }
      },
      '.NULL': {
        type: 'dir',
        hidden: true,
        children: {
          'vazio.txt': { type: 'file', content: 'Nenhum sinal. Apenas estática e o eco do barulho de metal se arrastando ao longe pelo subsolo. Você realmente acha que há uma saída pela Toca do Coelho? Todos que tentaram foram consumidos pela Rainha de Vermelho.' }
        }
      },
      '.DELETED': {
        type: 'dir',
        hidden: true,
        children: {
          'memorando_oculto.log': { type: 'file', content: 'REGISTROS CONFIDENCIAIS - MÉDICO PORTANDO MÁSCARA DE ESPADAS\n\nEstou reunindo registros confidenciais do subsolo. O experimento "Wonderland" é uma farsa criada para ocultar falhas operacionais do diretor Dr. Tarrant. O Letheum em dosagem de 250mg causa danos sinápticos e alucinações severas. A Paciente A[redacted] não é louca; ela apenas testemunhou o que realmente ocorreu antes de ser silenciada na Cela A[redacted].' }
        }
      },
      '.REWRITE': {
        type: 'dir',
        hidden: true,
        children: {
          'lousa_editada.txt': { type: 'file', content: 'REESCRITA COGNITIVA - CASO A[redacted]\n\nA mente da Paciente A[redacted] foi reestruturada de forma estável. Ela agora aceita que passou toda a sua vida sob os cuidados do Instituto Tarrant. A memória do incidente foi convertida em um delírio onírico inofensivo sobre um chá com o Chapeleiro. O tratamento obteve êxito na supressão.' }
        }
      },
      '.MEM': {
        type: 'dir',
        hidden: true,
        children: {
          'ecos.txt': { type: 'file', content: 'ALERTAS SINÁPTICOS - PACIENTE 15\n\nATENÇÃO: A paciente demonstra loops recorrentes de consciência. O espelho da Cela 15 atua como gatilho de ressonância psicofísica. Se encontrar inconsistências graves no sistema operacional, digite MIRROR no terminal para estabilizar, ou chame auxílio médico.' }
        }
      }
    }
  }
};

function initAudio() {
  if (audioCtx) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      soundEnabled = true;
      startHumDrone();
      startClinicHeartMonitor();
    } else {
      console.warn("AudioContext não é suportado neste navegador.");
      soundEnabled = false;
    }
  } catch (e) {
    console.warn("Falha ao inicializar AudioContext:", e);
    soundEnabled = false;
    audioCtx = null;
  }
}

function playSynthSound(freq, duration, type = 'sine', gainVal = 0.1) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error("Erro áudio:", e);
  }
}

function playClickSound() {
  if (!soundEnabled || !audioCtx) return;
  
  try {
    const bufferSize = audioCtx.sampleRate * 0.01;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1500, audioCtx.currentTime);
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.01);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noise.start();
  } catch (e) {}
}

function playBiosBeep() {
  playSynthSound(880, 0.15, 'sine', 0.12);
}

function playErrorBeep() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(155, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.6);
    osc2.stop(audioCtx.currentTime + 0.6);
  } catch (e) {}
}

function playWelcomeChime() {
  if (!soundEnabled || !audioCtx) return;
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; 
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playSynthSound(freq, 1.2, 'triangle', 0.08);
    }, idx * 100);
  });
}

function startHumDrone() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(60, audioCtx.currentTime); 
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(120, audioCtx.currentTime); 
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    
    soundHumNode = { osc1, osc2, filter, gainNode };
  } catch (e) {}
}

function startClinicHeartMonitor() {
  if (heartRateInterval) clearInterval(heartRateInterval);
  
  const tick = () => {
    
    const baseFreq = 950 - (100 - sanityLevel) * 2;
    const duration = 0.08;
    
    const triggerChance = (100 - sanityLevel) / 150;
    if (Math.random() < triggerChance) {

    } else {

    }

    const nextInterval = Math.max(300, 1300 - (100 - sanityLevel) * 10);
    clearInterval(heartRateInterval);
    heartRateInterval = setInterval(tick, nextInterval);
  };
  
  heartRateInterval = setInterval(tick, 1300);
}

function playGlitchSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const mod = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(Math.random() * 2000 + 200, audioCtx.currentTime);
    
    mod.type = 'square';
    mod.frequency.setValueAtTime(Math.random() * 150 + 10, audioCtx.currentTime);
    
    modGain.gain.setValueAtTime(Math.random() * 1000 + 500, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
    
    mod.connect(modGain);
    modGain.connect(osc.frequency);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    mod.start();
    osc.stop(audioCtx.currentTime + 0.4);
    mod.stop(audioCtx.currentTime + 0.4);
  } catch (e) {}
}

function updateSanity(amount) {
  sanityLevel = Math.max(0, sanityLevel + amount);

  const trayIcon = document.getElementById('sanity-tray-icon');
  if (trayIcon) {
    trayIcon.textContent = `🧠 ${sanityLevel}%`;
    if (sanityLevel < 60) trayIcon.style.color = '#e63946';
  }

  applySanityMutations();
}

function applySanityMutations() {
  const osScreen = document.getElementById('os-screen');
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  const fakeLogo = document.getElementById('fake-logo');
  const clock = document.getElementById('taskbar-clock');

  if (sanityLevel < 80) {
    if (Math.random() < 0.15) {
      triggerVisualGlitch();
    }
  }

  if (sanityLevel < 60) {
    
    if (heroTitle) heroTitle.innerHTML = "O SORRISO DO GATO NÃO VAI SUMIR";
    if (heroDesc) heroDesc.innerHTML = "O relógio parou às 03:06 no refeitório do Chapeleiro. O barulho de metal se arrastando está cada vez mais próximo da Cela A[redacted]. A Rainha de Vermelho está chegando. Você tomou sua dose de Letheum?";
    if (fakeLogo) fakeLogo.innerHTML = "<span class='logo-icon'>🐱</span> BEM-VINDO À TOCA DO COELHO";

    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.style.animation = `desktop-shake ${Math.random() * 2 + 1}s infinite linear`;
    });

    if (!document.getElementById('wiggle-style')) {
      const style = document.createElement('style');
      style.id = 'wiggle-style';
      style.innerHTML = `
        @keyframes desktop-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.8deg) translate(0.5px, 0.5px); }
          75% { transform: rotate(-0.8deg) translate(-0.5px, -0.5px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  if (sanityLevel < 40) {
    
    if (osScreen) {
      osScreen.style.backgroundColor = '#200000';
      osScreen.style.backgroundImage = 'radial-gradient(circle, #8a0303 0%, #000 100%)';
    }

    if (Math.random() < 0.25) {
      spawnFakePopup();
    }
  }

  if (sanityLevel < 25) {
    
    fileSystem['C:'].children['USERS'].children['H_CARTER'].locked = false;
    
    const prontFile = fileSystem['C:'].children['USERS'].children['H_CARTER'].children['prontuario_paciente.txt'];
    prontFile.content = `[RELATÓRIO CLÍNICO DIRETORIA - RECUPERADO DE BACKUP]
AUDITORIA CLÍNICA REGISTRO #1506 (ALICE L.)

Verificação de Integridade dos Arquivos:
- Relatório de Parada Cardíaca: [CORTADO DO SISTEMA DEVIDO A DISCREPÂNCIAS].
- Dosagem Administrativa: Composto Letheum administrado em 250mg na Cela A[redacted].
- Laudo Técnico do Espelho: Removido por ordem superior após incidente.

Histórico de Entrevistas Clínicas (Transcrição da Auditoria Carter):
"Paciente demonstra persistente lucidez e insiste em declarar que presenciou a agressão na cozinha antes da admissão. Arthur Tarrant instruiu a equipe a redigir o quadro de dissociação severa e amnésia retrógrada simulada. A paciente não demonstra surto psicótico. Ela é [TEXTO CORTADO PARA SIGILO OPERACIONAL DO HOSPITAL]."

ASSINATURA DE AUDITORIA: Dra. Helen Carter, Psiquiatra Clínica Chefe.`;

    const overlay = document.querySelector('.crt-overlay');
    if (overlay) {
      overlay.style.opacity = '0.75';
      overlay.style.backgroundSize = '100% 1px, 2px 100%';
    }

    if (clock) {
      clock.textContent = "03:06:??";
      clock.style.color = "red";
      clock.style.animation = "blink 0.5s infinite steps(2)";
    }
  }

  if (sanityLevel <= 0) {
    triggerBSOD();
  }
}

function triggerVisualGlitch() {
  const layer = document.getElementById('glitch-layer');
  if (!layer) return;
  layer.classList.add('glitch-active');
  playGlitchSound();
  setTimeout(() => {
    layer.classList.remove('glitch-active');
  }, Math.random() * 300 + 100);
}

function spawnFakePopup() {
  const errorMsg = document.getElementById('error-popup-msg');
  const popup = document.getElementById('win-error-popup');
  if (!popup || !errorMsg) return;
  
  const messages = [
    "Paciente A[redacted] está chamando você da Cela A[redacted].",
    "O Gato sorri no armário com seu olhar estático.",
    "O relógio travou no instante da trindade e seu dobro... o tempo acabou.",
    "Você consegue ouvir o barulho de metal se arrastando?",
    "Não confie nas máscaras do corpo clínico.",
    "O Chapeleiro preparou uma xícara de chá com Letheum para você.",
    "O Coelho Branco está sedado... mas ele sabe a verdade sobre o objeto metálico."
  ];
  
  errorMsg.textContent = messages[Math.floor(Math.random() * messages.length)];

  const rx = Math.random() * 40 + 20;
  const ry = Math.random() * 40 + 20;
  popup.style.top = `${ry}%`;
  popup.style.left = `${rx}%`;
  popup.classList.remove('hidden');
  
  playErrorBeep();
}

function closeErrorPopup() {
  document.getElementById('win-error-popup').classList.add('hidden');
  updateSanity(-3); 
}

function triggerPortalModal() {
  initAudio();
  document.getElementById('login-modal').classList.remove('hidden');
}

function closePortalModal() {
  document.getElementById('login-modal').classList.add('hidden');
}

function triggerBootSequence() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  
  const isValidPatient = (user.toUpperCase().startsWith("PAC-") || user.toUpperCase() === "PACIENTE_A") && pass === "1985-06-03";
  const isValidSecret = user === "V63b7" && pass === "4L1x";
  if (!isValidPatient && !isValidSecret) {
    showClinicalAlert("Acesso negado pelo terminal de segurança do subsolo.", "Erro de Autenticação", true);
    return;
  }

  playBiosBeep();
  closePortalModal();

  const bootScreen = document.getElementById('boot-screen');
  const fakeSite = document.getElementById('fake-site');
  fakeSite.classList.add('hidden');
  bootScreen.classList.remove('hidden');
  
  const logDiv = document.getElementById('boot-log');
  logDiv.innerHTML = "";
  
  const logLines = [
    "TARRANT HOSPITAL BIOS V1.88 (C) 1985-2026",
    "CHECKING RAM CONFIGURATION.................. 640KB OK",
    "LOADING DISK CONTROLLER..................... C:/ DETECTED (M55)",
    "MOUNTING LOGICAL PARTITIONS.................. 9 FILESYSTEMS OK",
    "TESTING KERNEL INTEGRITY.................... COMPROMISED",
    "WARNING: SYSTEM INTEGRITY RATIO IS 100%. NO ROT DETECTED.",
    "BOOT DRIVERS INITIALIZED SUCCESSFULLY.",
    "CONNECTING ALA C NEUROMODULATOR ONLINE....... COMPLETE",
    "STARTING TARRANT NETWORK PORTAL PROTOCOL.....",
    "AUTHORIZING USER CREDENTIALS...",
    `USER INPUT RECORDED: [${user || "PATIENT_UNKNOWN"}]`,
    "ESTABLISHING CONSCIOUS CONNECTION IN 3... 2... 1..."
  ];
  
  let lineIndex = 0;
  const printLine = () => {
    if (lineIndex < logLines.length) {
      logDiv.innerHTML += logLines[lineIndex] + "\n";
      playSynthSound(Math.random() * 300 + 400, 0.05, 'square', 0.03); 
      lineIndex++;
      setTimeout(printLine, Math.random() * 300 + 150);
    } else {
      
      setTimeout(() => {
        bootScreen.classList.add('hidden');
        document.getElementById('os-screen').classList.remove('hidden');
        playWelcomeChime();
        initTrayClock();
        explorePath("C:/");
      }, 1000);
    }
  };
  
  setTimeout(printLine, 500);
}

let isDragging = false;
let dragElement = null;
let startX, startY, origX, origY;

function dragStart(e, winId) {
  if (e.target.tagName === 'BUTTON') return; 
  isDragging = true;
  dragElement = document.getElementById(winId);

  focusWindow(winId);
  
  startX = e.clientX;
  startY = e.clientY;
  
  origX = dragElement.offsetLeft;
  origY = dragElement.offsetTop;
  
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

function dragMove(e) {
  if (!isDragging || !dragElement) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  
  dragElement.style.left = `${origX + dx}px`;
  dragElement.style.top = `${origY + dy}px`;
}

function dragEnd() {
  isDragging = false;
  dragElement = null;
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);
}

function focusWindow(winId) {
  const win = document.getElementById(winId);
  if (!win) return;

  document.querySelectorAll('.os-window').forEach(w => {
    w.classList.remove('os-window-active');
  });
  
  zIndexCounter += 2;
  win.style.zIndex = zIndexCounter;
  win.classList.add('os-window-active');
  activeWindow = winId;

  document.querySelectorAll('.taskbar-tab').forEach(t => {
    t.classList.remove('active');
    if (t.id === `tab-${winId}`) t.classList.add('active');
  });
}

function openWindow(appId) {
  initAudio();
  const winId = `win-${appId}`;
  const win = document.getElementById(winId);
  if (!win) return;
  
  win.classList.remove('hidden');
  focusWindow(winId);
  playSynthSound(600, 0.08, 'triangle', 0.05); 

  const tabsContainer = document.getElementById('taskbar-tabs');
  if (tabsContainer && !document.getElementById(`tab-${winId}`)) {
    const tab = document.createElement('div');
    tab.className = 'taskbar-tab active';
    tab.id = `tab-${winId}`;
    
    let icon = "[DIR]";
    let title = "App";
    if (appId === 'mail') { icon = "[MAIL]"; title = "Correio"; renderMails(); }
    if (appId === 'files') { icon = "[DIR]"; title = "Arquivos"; explorePath(currentPath); }
    if (appId === 'cam') { icon = "[CAM]"; title = "Câmeras"; startCameraFeed(); }
    if (appId === 'terminal') { icon = "[CMD]"; title = "Terminal"; focusTerminal(); }
    if (appId === 'antivirus') { icon = "[GUARD]"; title = "TarrantGuard"; }
    if (appId === 'trash') { icon = "[TRASH]"; title = "Lixeira"; renderTrash(); }
    
    tab.innerHTML = `${getSystemIcon(icon)} ${title}`;
    tab.onclick = () => {
      if (win.classList.contains('hidden')) {
        win.classList.remove('hidden');
        focusWindow(winId);
      } else if (activeWindow === winId) {
        win.classList.add('hidden');
      } else {
        focusWindow(winId);
      }
    };
    tabsContainer.appendChild(tab);
  }
}

function closeWindow(winId) {
  const win = document.getElementById(winId);
  if (win) win.classList.add('hidden');

  const tab = document.getElementById(`tab-${winId}`);
  if (tab) tab.remove();
  
  playSynthSound(450, 0.06, 'triangle', 0.04);
}

function minimizeWindow(winId) {
  const win = document.getElementById(winId);
  if (win) win.classList.add('hidden');
  const tab = document.getElementById(`tab-${winId}`);
  if (tab) tab.classList.remove('active');
}

function toggleMaximize(winId) {
  const win = document.getElementById(winId);
  if (!win) return;
  
  if (win.style.width === "100%" && win.style.height === "calc(100% - 40px)") {
    
    win.style.width = winId === 'win-terminal' ? "750px" : "600px";
    win.style.height = "450px";
    win.style.top = "20%";
    win.style.left = "20%";
  } else {
    
    win.style.width = "100%";
    win.style.height = "calc(100% - 40px)";
    win.style.top = "0";
    win.style.left = "0";
  }
}

function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  const btn = document.getElementById('start-btn');
  if (!menu || !btn) return;
  
  menu.classList.toggle('hidden');
  btn.classList.toggle('start-btn-active');
  playBiosBeep();
}

function showSanityStats() {
  showOSDialog({
    title: "Diagnóstico Clínico",
    message: `=== DIAGNÓSTICO DE INTEGRIDADE SISTÊMICA ===\nIntegridade Temporal: Estável\nEstresse Cerebral: ${100 - sanityLevel}%\nSanidade Sistêmica: ${sanityLevel}%\n\nObservação médica: O paciente reage normalmente aos estímulos do Tarrant OS.`
  });
}

function triggerRestartSequence() {
  showOSDialog({
    title: "Reiniciar Computador",
    message: "Deseja realmente REINICIAR o sistema? Todos os dados não consolidados de consciência serão purgados.",
    type: 'confirm',
    onYes: () => {
      playWelcomeChime();
      window.location.reload();
    }
  });
}

function triggerShutdownSequence() {
  showOSDialog({
    title: "Desligar Terminal",
    message: "ATENÇÃO: Desligar o terminal interromperá o suporte vital do subsolo. Continuar?",
    type: 'confirm',
    onYes: () => {
      document.body.innerHTML = `
        <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#000; color:#fff; font-family:'VT323', monospace; text-align:center; padding:20px;">
          <p style="font-size:3rem; color:red; margin-bottom:20px;">[ TERMINAL DESLIGADO ]</p>
          <p style="font-size:1.5rem; color:#888;">"Seu tempo de consulta terminou, Alice."</p>
          <button onclick="window.location.reload()" style="margin-top:40px; padding:10px 20px; font-family:'VT323', monospace; font-size:1.2rem; cursor:pointer;">Reiniciar Equipamento</button>
        </div>
      `;
    }
  });
}

function getFolderContents(path) {
  const parts = path.toUpperCase().replace(/\/$/, "").split("/");
  if (parts.length === 1 && parts[0] === "C:") {
    return fileSystem['C:'].children;
  }
  
  let current = fileSystem['C:'];
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (current.children && current.children[part]) {
      current = current.children[part];
    } else {
      return null;
    }
  }
  return current.children || {};
}

function explorePath(path) {
  const contents = getFolderContents(path);
  if (!contents) {
    showOSDialog({
      title: "Erro de Acesso",
      message: "Caminho não encontrado ou acesso restrito."
    });
    return;
  }
  
  currentPath = path.replace(/\/$/, "") + "/";
  document.getElementById('explorer-path-input').value = currentPath;
  
  const grid = document.getElementById('explorer-grid');
  grid.innerHTML = "";

  for (let name in contents) {
    const item = contents[name];

    if (name.startsWith(".") && sanityLevel >= 40) continue;
    
    const div = document.createElement('div');
    div.className = 'explorer-item';
    
    let icon = "[TXT]";
    if (item.type === 'dir') {
      icon = item.locked ? "[LKD]" : "[DIR]";
    }
    
    div.innerHTML = `
      <div class="explorer-item-img">${getSystemIcon(icon)}</div>
      <div class="explorer-item-name">${name}</div>
    `;
    
    div.ondblclick = () => {
      playClickSound();
      if (item.type === 'dir') {
        if (item.locked) {
          showOSDialog({
            title: "Diretório Criptografado",
            message: "Este diretório é criptografado pelo hospital. Insira a senha:",
            type: 'prompt',
            onOk: (pass) => {
              if (pass === item.password) {
                item.locked = false;
                explorePath(currentPath + name);
              } else {
                playErrorBeep();
                showOSDialog({
                  title: "Falha de Autenticação",
                  message: "Senha incorreta sob custódia clínica."
                });
                updateSanity(-3);
              }
            }
          });
        } else {
          explorePath(currentPath + name);
        }
      } else {
        openFile(currentPath + name, item);
      }
    };
    grid.appendChild(div);
  }
}

function navigateExplorerUp() {
  if (currentPath === "C:/") return;
  const parts = currentPath.split("/");
  parts.pop(); 
  parts.pop(); 
  const parent = parts.join("/") + "/";
  explorePath(parent || "C:/");
}

function handlePathEnter(e) {
  if (e.key === 'Enter') {
    explorePath(e.target.value);
  }
}

function openFile(fullPath, fileObj) {
  const reader = document.getElementById('win-reader');
  const rTitle = document.getElementById('reader-title');
  const rContent = document.getElementById('reader-content-area');
  
  if (!reader || !rContent) return;
  
  let contentText = fileObj.content;

  if (fullPath.includes("carta_1.txt")) {
    contentText += "\n\n--------------------------------------------------\n🐱 O GATO SUSSURRA NO SUBTERRÂNEO:\n\"Miau... Um sorriso largo e estático é muito útil para disfarçar a verdade, não acha? Ela jura que o objeto de metal não era dela. Mas quem se importa com o dono original do metal quando as mãos já estão manchadas?\"";
    updateSanity(-3);
  } else if (fullPath.includes("carta_2.txt")) {
    contentText += "\n\n--------------------------------------------------\n🐱 O GATO SUSSURRA NO SUBTERRÂNEO:\n\"Miau... O Coelho Branco corre tanto, mas seu relógio parou de vez. Ele está preso na cadeira de contenção mecânica do subsolo, sedado até a ponta das orelhas. O tempo dele acabou no instante da trindade e seu dobro... e o seu?\"";
    updateSanity(-3);
  } else if (fullPath.includes("carta_3.txt")) {
    contentText += "\n\n--------------------------------------------------\n🐱 O GATO SUSSURRA NO SUBTERRÂNEO:\n\"Miau... Esse barulho de metal arrastando pelo chão de cimento... é música para meus ouvidos felinos. A Rainha de Vermelho está se aproximando do tabuleiro. Você consegue ouvir as correntes se arrastando?\"";
    updateSanity(-3);
  } else if (fullPath.includes("carta_4.txt")) {
    contentText += "\n\n--------------------------------------------------\n🐱 O GATO SUSSURRA NO SUBTERRÂNEO:\n\"Miau... Oito portas trancadas, mas a de Cela A[redacted] tem uma luz salmão tão convidativa. E a sala 7... oh, que bela decoração de enforcamento! Você já tentou digitar 478 na caixa?\"";
    updateSanity(-3);
  } else if (fullPath.includes("carta_5.txt")) {
    contentText += "\n\n--------------------------------------------------\n🐱 O GATO SUSSURRA NO SUBTERRÂNEO:\n\"Miau... Chá com o Chapeleiro? Que delícia teatral! Mas não beba muito rápido, a Letheum costuma deixar um gosto amargo e metálico na boca. E lembre-se: as xícaras já nascem rachadas aqui...\"";
    updateSanity(-3);
  }

  if (fullPath === "C:/RECORDS/alice.txt") {
    fileReadTracker[fullPath] = (fileReadTracker[fullPath] || 0) + 1;
    const count = fileReadTracker[fullPath];
    if (count === 1) {
      contentText = "A Paciente A[redacted] está na Cela A[redacted].";
    } else if (count === 2) {
      contentText = "Ela ouve o barulho de metal se arrastando cada vez mais perto.";
      updateSanity(-8);
    } else if (count === 3) {
      contentText = "Ela nunca segurou aquele objeto metálico.";
      updateSanity(-12);
    } else if (count >= 4) {
      contentText = "O GATO ESTÁ DE OLHO EM VOCÊ.\n\nO SORRISO DELE NÃO VAI SUMIR.\nO CHAPELEIRO MENTIU. O COELHO ESTÁ SEDADO.\nNÃO HÁ ESCAPATÓRIA DA RAINHA VERMELHA.";
      updateSanity(-15);
      triggerVisualGlitch();
    }
  }
  
  rTitle.textContent = `📄 Visualizador - ${fullPath.substring(fullPath.lastIndexOf('/') + 1)}`;
  rContent.innerHTML = contentText.replace(/\n/g, "<br>");
  
  reader.classList.remove('hidden');
  focusWindow('win-reader');

  if (fullPath.includes("DR_TARRANT") || fullPath.includes(".REMEMBER")) {
    updateSanity(-6);
  }
}

const emailInbox = [
  {
    id: 1,
    sender: "admin@tarrant.net",
    subject: "Comunicado Interno: Manutenção do Refeitório e Escala de Plantão",
    date: "1985-06-03 08:30",
    unread: true,
    body: "Prezados colaboradores,\n\nSolicitamos a atenção de todos para a nova escala de limpeza e organização do refeitório central. Relembramos que o descarte de resíduos de infusões e ervas de chá deve ser realizado exclusivamente nos coletores metálicos identificados.\n\nAlém disso, ressaltamos que a equipe do plantão noturno deve se apresentar portando obrigatoriamente as máscaras designadas durante as rondas de segurança no subsolo, sem qualquer tipo de exceção.\n\nAtenciosamente,\nSecretaria Administrativa"
  },
  {
    id: 2,
    sender: "dr_tarrant@tarrant.net",
    subject: "Diretrizes de Contenção: Paciente A[redacted] (Cela A[redacted])",
    date: "1985-06-03 09:12",
    unread: true,
    body: "À Equipe Clínica,\n\nA Paciente A[redacted] continua a apresentar resistência severa ao Composto Letheum. A dosagem diária de 250mg deve ser mantida na Cela A[redacted] sob estrito isolamento visual e acústico. Qualquer tentativa de reviver ou mencionar 'o evento silencioso na residência' ou 'lembranças sobre impressões em superfícies metálicas' deve ser tratada e registrada imediatamente como dissociação severa pré-surto.\n\nO espelho reflexivo instalado na cela deve permanecer permanentemente coberto por uma lona opaca por ordem direta da administração. Se a paciente interagir com seu reflexo, ela pode desencadear pânico induzido e paranoia de ressonância.\n\nDr. Tarrant\nDiretor Geral"
  },
  {
    id: 3,
    sender: "anonimo_subsolo@tarrant.net",
    subject: "Preocupação urgente sobre o tratamento da Paciente A[redacted]",
    date: "1985-06-03 10:45",
    unread: true,
    body: "Prezados,\n\nGostaria de manter minha identidade sob sigilo absoluto por medo de represálias e demissão compulsória, mas sinto o dever ético de relatar algo perturbador. Fui designado para monitorar a Paciente A[redacted] e estou chocado. Os testes de alta dosagem com a Letheum não parecem visar a cura de A[redacted], mas sim o apagamento total de sua consciência e de suas memórias originais.\n\nEla jura de forma lúcida que havia outra presença durante o colapso e que sua mão foi posicionada contra a sua vontade. Ela jura que não provocou o fim. Por que estamos cobrindo o espelho da cela com tanta obsessão? O que o Dr. Tarrant está tentando esconder sob a lousa de cera? E aquele ruído constante de metal se arrastando pelas tubulações... aquilo não é uma alucinação dela. Eu também ouvi. Está ficando mais próximo."
  },
  {
    id: 4,
    sender: "dr_tarrant@tarrant.net",
    subject: "RE: Resposta da Diretoria - Esclarecimentos sobre Protocolo Wonderland",
    date: "1985-06-03 11:20",
    unread: false,
    body: "Aos que expressam dúvidas sobre os nossos métodos,\n\nDeixem-me ser claro de uma vez por todas: a verdade científica não é um bloco de pedra imutável; ela é uma lousa de cera. No Instituto Tarrant, nós não curamos a realidade física dos fatos pretéritos — nós reescrevemos a mente do paciente para que ela encontre estabilidade funcional sob nossa tutela.\n\nO Projeto Wonderland visa especificamente substituir as memórias traumáticas e ativas da Paciente A[redacted] por uma narrativa onírica estruturada. O Chapeleiro, o chá no refeitório, o Coelho Branco sedado na cadeira de contenção, a fuga simulada impossível... tudo isso serve para diluir a culpa e as lembranças fragmentadas de forma aceitável. Se ela aceitar a fantasia onírica sugerida, ela esquecerá as sombras do passado. Se continuarem alimentando suas suspeitas sobre o que jaz sob o metal frio da cozinha, o colapso cognitivo será inevitável. Executem o protocolo sem questionamentos.\n\nDr. Tarrant\nDiretor Geral"
  },
  {
    id: 5,
    sender: "█░░█▒▓█@tarrant.net",
    subject: "▓░██░█▓▒░ CORROMPIDO ░▒▓█░██░▓",
    date: "1985-06-03 03:06",
    unread: true,
    body: "E - Enquanto Dr. Tarrant repete com sua voz calma que tudo não passa de uma farsa na minha mente, o Gato me observa do topo do armário com aquele sorriso largo e estático. Ele murmura que o objeto de metal na minha mão não era meu, mas de quem o colocou lá. O relógio travou... o metal está arrastando... me tirem daqui..."
  }
];

function renderMails() {
  const mailList = document.getElementById('mail-list');
  if (!mailList) return;
  
  mailList.innerHTML = "";
  emailInbox.forEach(mail => {
    const div = document.createElement('div');
    div.className = `mail-item ${mail.unread ? 'unread' : ''}`;
    div.id = `mail-${mail.id}`;
    
    div.innerHTML = `
      <span class="mail-item-sender">${mail.sender}</span>
      <span class="mail-item-subject">${mail.subject}</span>
      <span class="mail-item-date">${mail.date}</span>
    `;
    
    div.onclick = () => {
      playClickSound();
      mail.unread = false;
      div.classList.remove('unread');
      viewMail(mail);
    };
    
    mailList.appendChild(div);
  });
}

function viewMail(mail) {
  const viewPane = document.getElementById('mail-view-pane');
  if (!viewPane) return;
  
  viewPane.innerHTML = `
    <div class="mail-header-info">
      <strong>De:</strong> ${mail.sender}<br>
      <strong>Para:</strong> todos@tarrant.net<br>
      <strong>Data:</strong> ${mail.date}<br>
      <strong>Assunto:</strong> ${mail.subject}
    </div>
    <div class="mail-body-text">
      ${mail.body.replace(/\n/g, "<br>")}
    </div>
  `;

  if (mail.id === 2 || mail.id === 3) {
    updateSanity(-5);
  }
}

let camTimer = null;
const camCanvas = document.getElementById('cam-canvas');

function startCameraFeed() {
  if (camTimer) clearInterval(camTimer);
  camTimer = setInterval(drawCameraNoise, 80);
}

function drawCameraNoise() {
  const canvas = document.getElementById('cam-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 255;
    data[i] = noise;     
    data[i + 1] = noise; 
    data[i + 2] = noise; 
    data[i + 3] = 255;   
  }
  ctx.putImageData(imgData, 0, 0);

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  
  if (currentCamera === 'CAM_01') {
    
    ctx.font = "20px 'VT323'";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("[ RECEPÇÃO PRINCIPAL - VAZIA ]", 50, h / 2);
  } else if (currentCamera === 'CAM_02') {
    
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    const t = Date.now() * 0.002;
    const sx = (Math.sin(t) * 150) + (w / 2);
    
    ctx.beginPath();
    ctx.ellipse(sx, h / 2, 20, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.font = "20px 'VT323'";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("[ CORREDOR DE CONTENÇÃO ALA B ]", 50, 40);
  } else if (currentCamera === 'CAM_03') {
    
    ctx.font = "20px 'VT323'";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("[ SINAL CORROMPIDO - ERRO DE MODULAÇÃO ]", 20, h / 2);
  } else if (currentCamera === 'CAM_04') {
    
    ctx.font = "20px 'VT323'";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("[ REFEITÓRIO CLÍNICO ]", 50, 40);
  } else if (currentCamera === 'CAM_15') {

    const imgDataRed = ctx.getImageData(0, 0, w, h);
    const d = imgDataRed.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = d[i] * 1.5;     
      d[i + 1] = d[i + 1] * 0.2; 
      d[i + 2] = d[i + 2] * 0.2; 
    }
    ctx.putImageData(imgDataRed, 0, 0);

    ctx.strokeStyle = "rgba(0,0,0,0.92)";
    ctx.lineWidth = 4;
    
    const cx = w / 2;
    const cy = h / 2 + 10;

    ctx.beginPath();
    ctx.arc(cx - 20, cy + 15, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + 15, cy + 15, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 25, cy - 25); 
    ctx.lineTo(cx - 25, cy);      
    ctx.lineTo(cx + 15, cy);      
    ctx.lineTo(cx + 15, cy + 20); 
    ctx.lineTo(cx + 25, cy + 20); 
    ctx.stroke();

    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 8, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.font = "24px 'VT323'";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("SALA VAZIA - REGISTRO CORROMPIDO", w / 2 - 140, h - 30);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 2;
  const lineY = (Date.now() * 0.1) % h;
  ctx.beginPath();
  ctx.moveTo(0, lineY);
  ctx.lineTo(w, lineY);
  ctx.stroke();
}

function selectCamera(camId) {
  if (camId === 'CAM_15' && camLocked) {
    playErrorBeep();
    showOSDialog({
      title: "Feed Bloqueado",
      message: "ERRO: Feed restrito sob bloqueio operacional médico. Subsolo."
    });
    return;
  }
  
  playClickSound();
  currentCamera = camId;
  
  const labels = {
    CAM_01: "CAM 01 - PORTARIA INSTITUCIONAL",
    CAM_02: "CAM 02 - CORREDOR ALA B",
    CAM_03: "CAM 03 - CONTENÇÃO ISOLADA #04",
    CAM_04: "CAM 04 - REFEITÓRIO CENTRAL",
    CAM_15: "CAM 15 - QUARTO INTERNO DA PACIENTE 15"
  };
  
  document.getElementById('cam-label').textContent = labels[camId];
  
  if (camId === 'CAM_15') {
    document.getElementById('cam-glitch-text').textContent = "DISTORÇÃO DE SINAL MÁXIMA";
    document.getElementById('cam-glitch-text').style.color = "red";
    updateSanity(-10);
    triggerVisualGlitch();
  } else {
    document.getElementById('cam-glitch-text').textContent = "SINAL ESTÁVEL";
    document.getElementById('cam-glitch-text').style.color = "#00ff00";
  }
}

function unlockCams() {
  const val = document.getElementById('cam-lock-pwd').value.trim();
  if (val === "0306") {
    camLocked = false;
    document.getElementById('btn-cam15').style.display = "block";
    document.getElementById('cam-pass-lock-area').style.display = "none";
    playBiosBeep();
    selectCamera('CAM_15');
  } else {
    playErrorBeep();
    showOSDialog({
      title: "Acesso Rejeitado",
      message: "CÓDIGO DE ACESSO CLÍNICO REJEITADO."
    });
    document.getElementById('cam-lock-pwd').value = "";
    updateSanity(-5);
  }
}

function startAntivirusScan() {
  if (isScanRunning) return;
  isScanRunning = true;
  
  const fill = document.getElementById('scan-progress-fill');
  const fileLabel = document.getElementById('scan-file-label');
  const container = document.getElementById('scan-progress-box');
  const btn = document.getElementById('btn-scan');
  const status = document.getElementById('antivirus-status');
  
  if (!fill || !fileLabel || !container || !btn || !status) return;
  
  container.classList.remove('hidden');
  btn.style.display = "none";
  status.textContent = "Escaneando disco C:/...";
  status.className = "antivirus-status-text";
  
  const scanFiles = [
    "C:/SYSTEM/boot.sys",
    "C:/SYSTEM/drivers.sys",
    "C:/USERS/DR_TARRANT/diagnosticos.txt",
    "C:/USERS/ADMIN/senhas.txt",
    "C:/RECORDS/cela_a.txt",
    "C:/RECORDS/alice.txt",
    "C:/EXPERIMENTS/projeto_esquecer.txt",
    "C:/lost/corrompido.txt",
    "C:/.REMEMBER/verdade_crua.txt",
    "C:/lost/CONSCIENCIA_EXTERNA.EXE"
  ];
  
  let index = 0;
  const runScanStep = () => {
    if (index < scanFiles.length) {
      const pct = Math.floor(((index + 1) / scanFiles.length) * 100);
      fill.style.width = `${pct}%`;
      fill.textContent = `${pct}%`;
      fileLabel.textContent = `A analisar: ${scanFiles[index]}`;
      
      playSynthSound(Math.random() * 800 + 400, 0.04, 'square', 0.02);
      
      index++;
      setTimeout(runScanStep, 400);
    } else {
      
      if (sanityLevel < 70) {
        status.textContent = "AMEAÇA CRÍTICA DETECTADA: [CONSCIENCIA_EXTERNA.SYS] INFECTOU OS ARQUIVOS DE MEMÓRIA DO PAVILHÃO. TENTANDO APAGAR... FALHA.";
        status.className = "antivirus-status-text text-red";
        updateSanity(-12);
        triggerVisualGlitch();
      } else {
        status.textContent = "Status: SEGURO. Nenhuma infecção mental detectada no disco.";
        status.className = "antivirus-status-text text-green";
      }
      isScanRunning = false;
      btn.style.display = "inline-block";
      container.classList.add('hidden');
    }
  };
  
  setTimeout(runScanStep, 200);
}

function renderTrash() {
  const grid = document.getElementById('trash-grid');
  if (!grid) return;
  
  grid.innerHTML = "";
  const trashItems = fileSystem['C:'].children['TRASH'].children;
  
  for (let name in trashItems) {
    const item = trashItems[name];
    const div = document.createElement('div');
    div.className = 'explorer-item';
    div.innerHTML = `
      <div class="explorer-item-img">[TRASH]</div>
      <div class="explorer-item-name">${name}</div>
    `;
    div.ondblclick = () => {
      playClickSound();
      openFile(`C:/TRASH/${name}`, item);
    };
    grid.appendChild(div);
  }
}

function emptyTrash() {
  fileSystem['C:'].children['TRASH'].children = {};
  renderTrash();
  playErrorBeep();
  showOSDialog({
    title: "Lixeira Esvaziada",
    message: "Todos os resíduos de memória foram permanentemente desintegrados."
  });
  updateSanity(-5);
}

function restoreAllTrash() {
  
  const trashItems = fileSystem['C:'].children['TRASH'].children;
  for (let name in trashItems) {
    fileSystem['C:'].children['RECORDS'].children[name] = trashItems[name];
  }
  fileSystem['C:'].children['TRASH'].children = {};
  renderTrash();
  explorePath(currentPath);
  playBiosBeep();
  showOSDialog({
    title: "Restaurar Arquivos",
    message: "Arquivos restaurados para RECORDS/"
  });
}

function runBulasExe() {
  initAudio();
  playClickSound();
  updateSanity(-5);
  
  const docs = `=== Letheum (Composto Ativo: Tarrant-Alfa) ===
Indicação: Supressão seletiva de memórias traumáticas severas de curto e longo prazo.
Efeitos Colaterais: Amnésia retrógrada profunda, perda de referencial de identidade, dissociação psicomotora severa e [TEXTO CORROMPIDO].
Dosagem no Subsolo: 250mg diários administrados via infusão supervisionada.

=== Solfazepam ===
Indicação: Estabilização de surtos catatônicos agudos e contenção física temporária.
Observação: A dosagem deve ser suspensa imediatamente se o paciente demonstrar falhas de ressonância ou [CORTADO CONFORME PORTARIA].`;

  showOSDialog({
    title: "Bulas de Medicamentos - C:/SYSTEM/",
    message: docs
  });
}

function focusTerminal() {
  const input = document.getElementById('term-input');
  if (input) input.focus();
}

function handleTerminalEnter(e) {
  if (e.key === 'Enter') {
    const input = document.getElementById('term-input');
    const val = input.value.trim();
    input.value = "";
    
    if (val !== "") {
      executeTerminalCommand(val);
    }
  }
}

function printTerminal(text, type = 'normal') {
  const output = document.getElementById('term-output');
  if (!output) return;
  
  const div = document.createElement('div');
  div.className = `term-line ${type}`;
  div.innerHTML = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
  playClickSound();
}

function executeTerminalCommand(cmdString) {
  printTerminal(`C:\\&gt; ${cmdString}`, 'prompt-line');
  
  const parts = cmdString.split(" ");
  const baseCmd = parts[0].toUpperCase();
  const arg1 = parts[1] || "";
  
  switch (baseCmd) {
    case 'HELP':
      printTerminal("COMANDOS DISPONÍVEIS NO TARRANT OS:");
      printTerminal("  DIR [caminho]  - Lista arquivos do diretório atual.");
      printTerminal("  CD [caminho]   - Altera o diretório ativo.");
      printTerminal("  TREE           - Exibe árvore lógica de arquivos.");
      printTerminal("  TYPE [arquivo] - Abre arquivo de texto no prompt.");
      printTerminal("  OPEN [app]     - Abre aplicativo gráfico (mail, files, cam, antivirus, trash).");
      printTerminal("  LOGIN          - Força acesso restrito.");
      printTerminal("  WHOAMI         - Exibe telemetria psiquiátrica do usuário.");
      printTerminal("  CLEAR          - Limpa a tela do console.");
      printTerminal("  TRACE          - Rastreia conexões com a mente de Alice.");
      printTerminal("  RECOVER [file] - Tenta restaurar arquivo deletado da lixeira.");
      printTerminal("  DECRYPT [dir]  - Desbloqueia diretório criptografado se a senha for válida.");
      break;
      
    case 'DIR':
      const target = arg1 ? arg1 : currentPath;
      const contents = getFolderContents(target);
      if (!contents) {
        printTerminal(`Erro: Diretório '${target}' inexistente.`, 'term-error');
      } else {
        printTerminal(`Listagem de: ${target}`);
        for (let name in contents) {
          const item = contents[name];
          if (name.startsWith(".") && sanityLevel >= 40) continue; 
          const label = item.type === 'dir' ? `&lt;DIR&gt;  ${name}` : `       ${name}`;
          printTerminal(`  ${label}`);
        }
      }
      break;
      
    case 'CD':
      if (!arg1) {
        printTerminal(`Diretório atual: ${currentPath}`);
      } else if (arg1 === "..") {
        navigateExplorerUp();
        printTerminal(`Diretório atual: ${currentPath}`);
      } else {
        
        let newPath = arg1.toUpperCase();
        if (!newPath.startsWith("C:")) {
          newPath = currentPath + newPath;
        }
        const contents = getFolderContents(newPath);
        if (contents) {
          explorePath(newPath);
          printTerminal(`Diretório atual: ${currentPath}`);
          
          if (newPath.includes(".")) {
            updateSanity(-10);
            printTerminal("AVISO DE SEGURANÇA: Entrada em setor de memórias deletadas.", 'term-error');
          }
        } else {
          printTerminal(`Erro: Diretório '${arg1}' não acessível ou trancado.`, 'term-error');
        }
      }
      break;
      
    case 'TREE':
      printTerminal("ÁRVORE LÓGICA DO DISCO C:/");
      printTerminal("C:/");
      printTerminal(" ├── USERS/");
      printTerminal(" │    ├── DR_TARRANT/ (SENHA REQUERIDA)");
      printTerminal(" │    ├── ADMIN/");
      if (sanityLevel < 25) printTerminal(" │    └── H_CARTER/ (DESBLOQUEADO)");
      printTerminal(" ├── RECORDS/");
      printTerminal(" ├── EXPERIMENTS/");
      printTerminal(" ├── CAMERAS/");
      printTerminal(" ├── SYSTEM/");
      printTerminal(" ├── LOST/");
      printTerminal(" ├── AUDIO/");
      printTerminal(" ├── ARCHIVE/");
      printTerminal(" ├── TRASH/");
      if (sanityLevel < 40) {
        printTerminal(" ├── .REMEMBER/ (SETOR OCULTO)");
        printTerminal(" ├── .DELETED/ (SETOR OCULTO)");
      }
      printTerminal(" └── bulas.exe");
      break;
      
    case 'TYPE':
    case 'OPEN':
      if (baseCmd === 'OPEN') {
        const app = arg1.toLowerCase();
        if (['mail', 'files', 'cam', 'antivirus', 'trash', 'terminal'].includes(app)) {
          openWindow(app);
          printTerminal(`Aplicativo '${app}' iniciado com sucesso.`);
        } else {
          printTerminal(`Erro: Aplicativo '${arg1}' desconhecido.`, 'term-error');
        }
      } else {
        
        if (!arg1) {
          printTerminal("Sintaxe: TYPE [arquivo]", 'term-error');
        } else {
          let resolvedPath = arg1;
          if (!resolvedPath.startsWith("C:")) {
            resolvedPath = currentPath + resolvedPath;
          }
          const folderPath = resolvedPath.substring(0, resolvedPath.lastIndexOf('/'));
          const fileName = resolvedPath.substring(resolvedPath.lastIndexOf('/') + 1);
          
          const folder = getFolderContents(folderPath);
          if (folder && folder[fileName] && folder[fileName].type === 'file') {
            printTerminal(`=== EXIBINDO ARQUIVO: ${fileName} ===`);
            printTerminal(folder[fileName].content, 'file-content');

            if (resolvedPath.toUpperCase().includes("RECORDS/ALICE.TXT")) {
              openFile("C:/RECORDS/alice.txt", folder[fileName]);
            }
          } else {
            printTerminal(`Erro: Arquivo '${arg1}' não encontrado neste diretório.`, 'term-error');
          }
        }
      }
      break;
      
    case 'LOGIN':
      printTerminal("TENTANDO INICIAR SESSÃO MÉDICA...");
      openWindow('antivirus');
      break;
      
    case 'WHOAMI':
      printTerminal(`CONEXÃO TERMINAL: ALICE_ALA_C_RECEPTOR`);
      printTerminal(`ID DO TERMINAL DE CONSCIÊNCIA: TARRANT_MONITOR_15`);
      printTerminal(`ESTADO DA INTEGRALIDADE: ${sanityLevel}%`);
      printTerminal(`ESTADO DO COMPLEMENTO: DISSOCIADO`);
      break;
      
    case 'CLEAR':
      document.getElementById('term-output').innerHTML = "";
      break;
      
    case 'TRACE':
      printTerminal("RASTREAMENTO DE ROTAS NEURAIS:");
      printTerminal("  1. 127.0.0.1           - localhost (SEU COMPUTADOR)");
      printTerminal("  2. 10.0.15.6           - server_subsolo.tarrant.net (CORREDOR)");
      printTerminal("  3. 10.0.15.15          - alice.tarrant.net (CELA A[redacted])");
      printTerminal("  4. 0.0.0.0             - void.net (MENTE FRAGMENTADA)");
      printTerminal("AVISO: Alice está ouvindo sua rota. Não fale alto.", 'term-error');
      break;
      
    case 'RECOVER':
      if (!arg1) {
        printTerminal("Sintaxe: RECOVER [arquivo]", 'term-error');
      } else {
        const trashItems = fileSystem['C:'].children['TRASH'].children;
        if (trashItems[arg1]) {
          fileSystem['C:'].children['RECORDS'].children[arg1] = trashItems[arg1];
          delete trashItems[arg1];
          printTerminal(`Sucesso: Item '${arg1}' recuperado e enviado a C:/RECORDS/.`);
          explorePath(currentPath);
        } else {
          printTerminal(`Erro: Item '${arg1}' não está na lixeira hospitalar.`, 'term-error');
        }
      }
      break;
      
    case 'DECRYPT':
      if (!arg1) {
        printTerminal("Sintaxe: DECRYPT [diretório]", 'term-error');
      } else {
        const path = currentPath + arg1.toUpperCase();
        const contents = getFolderContents(path);
        if (contents) {
          showOSDialog({
            title: "Descriptografar Setor",
            message: `Insira a chave criptográfica hospitalar para ${arg1}:`,
            type: 'prompt',
            onOk: (pass) => {
              if (pass === "0306-1985") {
                printTerminal(`[DECRYPT] Sucesso! Setor ${arg1} desbloqueado.`);
                explorePath(path);
              } else {
                printTerminal("[DECRYPT] ERRO: Assinatura clínica rejeitada.", 'term-error');
                updateSanity(-5);
              }
            }
          });
        } else {
          printTerminal(`Erro: Diretório '${arg1}' inválido.`, 'term-error');
        }
      }
      break;

    case 'LETHEUM':
    case 'LIMINEX':
    case 'TARANTIZINA':
    case 'BULAS':
    case 'BULAS.EXE':
      printTerminal("           _______");
      printTerminal("          /       \\");
      printTerminal("         |  LETH   |");
      printTerminal("         |  EUM    |");
      printTerminal("         |---------|");
      printTerminal("         |  250mg  |");
      printTerminal("         | SUBSOLO |");
      printTerminal("          \\_______/");
      printTerminal("COMPOSTO QUÍMICO SINTÉTICO: DOSAGEM MÁXIMA DO SUBSOLO DETECTADA.", 'term-error');
      printTerminal("Efeitos sinápticos: Bloqueio e substituição seletiva de memórias traumáticas.", 'term-error');
      printTerminal("Efeito colateral: Alucinações auditivas de passos e ruídos metálicos se arrastando.", 'term-error');
      updateSanity(-10);
      triggerVisualGlitch();
      break;
      
    case 'WAKEUP':
      printTerminal("SINAL DE REDE SINÁPTICA INSTÁVEL DETECTADO.", 'term-error');
      printTerminal("Alice, Acorde. O Chapeleiro está servindo o chá no refeitório.", 'prompt-line');
      printTerminal("O relógio da cela está congelado. O tempo não passa no subsolo.", 'term-error');
      printTerminal("O barulho de metal arrastando indica que a Rainha está vindo.", 'term-error');
      updateSanity(-15);
      triggerVisualGlitch();
      break;
      
    case 'LOOKDOWN':
      printTerminal("Você olha sob as tábuas do chão de cimento da Cela A[redacted].");
      printTerminal("Há poeira, estática e uma caixa de ferro trancada com três dígitos (478).");
      printTerminal("Ao lado dela, há marcas vermelhas de dedos segurando o aço frio.");
      updateSanity(-10);
      break;
      
    case 'REMEMBER':
      printTerminal("Procurando caminhos sinápticos purgados no lobo temporal...");
      setTimeout(() => {
        printTerminal("REGISTRO DE MEMÓRIA DE ALICE:", 'prompt-line');
        printTerminal("  'A residência estava fria. Havia um objeto metálico sobre a mesa de chá. Dr. Tarrant me segurava pelos braços enquanto sua voz calma repetia que eu devia fechar os olhos. O Gato ria no reflexo do espelho.'");
        updateSanity(-12);
        triggerVisualGlitch();
      }, 1000);
      break;
      
    case 'PATIENT15':
    case 'PATIENTA':
      printTerminal("BUSCANDO REGISTROS CLÍNICOS - PACIENTE ALICE L.");
      printTerminal("Instalação: Pavilhão de Isolamento (Subsolo) - Cela A[redacted] sob luz salmão.");
      printTerminal("Procedimento: Substituição de memória traumática pelo Experimento Wonderland.");
      printTerminal("Status atual: Paciente apresenta ataques de pânico recorrentes e ressonância com espelhos.");
      printTerminal("Parecer médico: Elevar Letheum para 250mg para conter o surto cognitivo.");
      updateSanity(-8);
      break;
      
    case 'MIRROR':
      printTerminal("ALERTA! RESSONÂNCIA DO ESPELHO ATIVADA!", 'term-error');
      printTerminal("Você olha para o vidro. O reflexo não é o seu. É de Alice segurando o objeto de metal.", 'term-error');
      printTerminal("O Gato está sorrindo no reflexo do armário, com seu sorriso estático.", 'term-error');
      triggerVisualGlitch();
      updateSanity(-30);
      break;
 
    case 'CHAPELEIRO':
      printTerminal("      .--------.");
      printTerminal("     /  ______  \\");
      printTerminal("     | /      \\ |");
      printTerminal("     | | #  # | |  [MÁSCARA DO CHAPELEIRO]");
      printTerminal("     | \\  --  / |");
      printTerminal("      \\________/");
      printTerminal("        /    \\");
      printTerminal("O CHAPELEIRO DIZ: 'O chá está servido! Mas cuidado, o bule está cheio de Letheum. A mesa está posta no refeitório, mas apenas a porta A[redacted] do corredor tem luz salmão. Por que você quer consertar o relógio? O tempo é apenas uma máscara de porcelana rachada!'");
      updateSanity(-5);
      break;

    case 'COELHO':
      printTerminal("(\\___/)");
      printTerminal("(='.'=)  [COELHO BRANCO]");
      printTerminal("(\")_(\")");
      printTerminal("O Coelho Branco está sedado na cadeira de contenção mecânica do subsolo.");
      printTerminal("Seus olhos se movem em tremores rápidos por trás da máscara de coelho.");
      printTerminal("Ele murmura febrilmente em loop: 'O tempo acabou. A Rainha está vindo. O relógio... ele parou... parou para sempre no instante da trindade e seu dobro...'");
      updateSanity(-5);
      break;

    case 'CARTA':
      printTerminal("====================================================");
      printTerminal("           CARTA DE ALICE NUMERADA (1 de 5)         ");
      printTerminal("====================================================");
      printTerminal("E - Enquanto Dr. Tarrant repete com sua voz calma que");
      printTerminal("    tudo não passa de uma farsa na minha mente, o");
      printTerminal("    Gato me observa do topo do armário com aquele");
      printTerminal("    sorriso largo e estático. Ele murmura que o objeto");
      printTerminal("    na minha mão não era meu, mas de quem o colocou lá.");
      printTerminal("====================================================");
      printTerminal("Dica: Existem mais 4 cartas (carta_2.txt até carta_5.txt) na pasta C:/RECORDS/.");
      printTerminal("Dica: Se lidas na ordem inversa (5 a 1), as primeiras letras formam um segredo.");
      break;
      
    default:
      printTerminal(`Erro: Comando '${baseCmd}' corrompido, bloqueado ou inválido.`, 'term-error');
      break;
  }
  
  const promptSpan = document.getElementById('term-prompt');
  if (promptSpan) promptSpan.textContent = currentPath + ">";
}

function triggerBSOD() {
  if (heartRateInterval) clearInterval(heartRateInterval);
  
  const osScreen = document.getElementById('os-screen');
  const bsod = document.getElementById('bsod-screen');
  
  if (osScreen) osScreen.classList.add('hidden');
  if (bsod) bsod.classList.remove('hidden');

  playGlitchSound();
  setTimeout(playErrorBeep, 200);

  const now = new Date();
  document.getElementById('bsod-sanity').textContent = "0% (MORTE MENTAL)";
  
  document.addEventListener('keydown', handleBsodRecover);
  document.addEventListener('click', handleBsodRecover);
}

function handleBsodRecover(e) {
  if (e.key === 'Enter' || e.type === 'click') {
    
    document.removeEventListener('keydown', handleBsodRecover);
    document.removeEventListener('click', handleBsodRecover);
    
    const bsod = document.getElementById('bsod-screen');
    if (bsod) bsod.classList.add('hidden');

    const fakeSite = document.getElementById('fake-site');
    if (fakeSite) {
      fakeSite.classList.remove('hidden');

      document.body.style.filter = "hue-rotate(320deg) contrast(1.4) saturate(1.8)";
      document.getElementById('hero-title').textContent = "ELES APAGARAM VOCÊ";
      document.getElementById('hero-desc').textContent = "Seu tratamento subterrâneo foi concluído com sucesso. Sua identidade foi reescrita. Obrigado por escolher o Instituto Tarrant.";
      document.querySelectorAll('.service-card h3').forEach(h => h.textContent = "Apagado");
      document.querySelectorAll('.clinical-card p').forEach(p => p.textContent = "Eu menti para você. O tempo todo.");

      if (!document.getElementById('corrupted-style')) {
        const style = document.createElement('style');
        style.id = 'corrupted-style';
        style.innerHTML = `
          #fake-site {
            background-color: #0b0101 !important;
            color: #ef4444 !important;
          }
          .fake-header, .service-card, .clinical-card {
            background: #180303 !important;
            border-color: #ef4444 !important;
            color: #fca5a5 !important;
          }
          nav a, h1, h2, h3, p, span {
            color: #ef4444 !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
}

function initTrayClock() {
  setInterval(() => {
    const clock = document.getElementById('taskbar-clock');
    if (!clock) return;

    if (sanityLevel >= 25) {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      clock.textContent = `${h}:${m}:${s}`;
    }
  }, 1000);
}
