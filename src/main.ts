import './style.css';
import confetti from 'canvas-confetti';

interface FaceData {
  id: string;
  emoji: string;
  imageUrl: string | null;
  defaultText: string;
  bgColor: string;
  positionClass: string;
  tabs: string[];
}

const emojiLibrary = ['🦊', '🦔', '🐻', '🐰', '🐿️', '🦉', '🦄', '🦖', '🐶', '🐱', '🐸', '🐼', '🐯', '🦁', '🐮', '🐷', '🦋', '🐞'];

const themes = {
  forest: [
    { id: 'top', emoji: '🦊', imageUrl: null, defaultText: 'Worauf bist du heute stolz?', bgColor: '#e6f4ea', positionClass: 'face-top', tabs: ['top', 'left', 'right'] },
    { id: 'left', emoji: '🦔', imageUrl: null, defaultText: 'Wem möchtest du heute Danke sagen?', bgColor: '#fef7e0', positionClass: 'face-left', tabs: ['left'] },
    { id: 'center', emoji: '🐻', imageUrl: null, defaultText: 'Worüber hast du heute am meisten gelacht?', bgColor: '#e8f0fe', positionClass: 'face-center', tabs: [] },
    { id: 'right1', emoji: '🐰', imageUrl: null, defaultText: 'Was hat dich heute glücklich gemacht?', bgColor: '#fce8e6', positionClass: 'face-right1', tabs: [] },
    { id: 'right2', emoji: '🐿️', imageUrl: null, defaultText: 'Worauf freust du dich morgen?', bgColor: '#e0f2f1', positionClass: 'face-right2', tabs: [] },
    { id: 'bottom', emoji: '🦉', imageUrl: null, defaultText: 'Was Neues hast du heute gelernt?', bgColor: '#fff3e0', positionClass: 'face-bottom', tabs: ['bottom', 'left', 'right'] },
  ],
  space: [
    { id: 'top', emoji: '👽', imageUrl: null, defaultText: 'Welchen Planeten würdest du besuchen?', bgColor: '#e0e7ff', positionClass: 'face-top', tabs: ['top', 'left', 'right'] },
    { id: 'left', emoji: '🚀', imageUrl: null, defaultText: 'Wen würdest du ins All mitnehmen?', bgColor: '#f3e8ff', positionClass: 'face-left', tabs: ['left'] },
    { id: 'center', emoji: '🌎', imageUrl: null, defaultText: 'Was ist das Schönste an der Erde?', bgColor: '#dbeafe', positionClass: 'face-center', tabs: [] },
    { id: 'right1', emoji: '⭐', imageUrl: null, defaultText: 'Was ist dein größter Wunsch?', bgColor: '#fef08a', positionClass: 'face-right1', tabs: [] },
    { id: 'right2', emoji: '🛸', imageUrl: null, defaultText: 'Glaubst du an Aliens?', bgColor: '#ccfbf1', positionClass: 'face-right2', tabs: [] },
    { id: 'bottom', emoji: '🛰️', imageUrl: null, defaultText: 'Was hast du Neues entdeckt?', bgColor: '#f1f5f9', positionClass: 'face-bottom', tabs: ['bottom', 'left', 'right'] },
  ],
  dino: [
    { id: 'top', emoji: '🦖', imageUrl: null, defaultText: 'Wenn du ein T-Rex wärst, was würdest du machen?', bgColor: '#dcfce7', positionClass: 'face-top', tabs: ['top', 'left', 'right'] },
    { id: 'left', emoji: '🦕', imageUrl: null, defaultText: 'Was ist dein Lieblings-Dino?', bgColor: '#bbf7d0', positionClass: 'face-left', tabs: ['left'] },
    { id: 'center', emoji: '🌋', imageUrl: null, defaultText: 'Wovor hast du Angst?', bgColor: '#fecaca', positionClass: 'face-center', tabs: [] },
    { id: 'right1', emoji: '🌿', imageUrl: null, defaultText: 'Was isst du am liebsten?', bgColor: '#fef08a', positionClass: 'face-right1', tabs: [] },
    { id: 'right2', emoji: '🐾', imageUrl: null, defaultText: 'Wohin würdest du gerne reisen?', bgColor: '#e7e5e4', positionClass: 'face-right2', tabs: [] },
    { id: 'bottom', emoji: '🥚', imageUrl: null, defaultText: 'Was möchtest du noch lernen?', bgColor: '#fef9c3', positionClass: 'face-bottom', tabs: ['bottom', 'left', 'right'] },
  ]
};

let currentFaces: FaceData[] = JSON.parse(JSON.stringify(themes.forest));

function createTabSVG(type: 'h' | 'v', direction: 'top' | 'bottom' | 'left' | 'right') {
  const w = type === 'h' ? 200 : 40;
  const h = type === 'h' ? 40 : 200;
  let points = '';
  if (direction === 'top') points = '25,0 175,0 200,40 0,40';
  else if (direction === 'bottom') points = '0,0 200,0 175,40 25,40';
  else if (direction === 'left') points = '0,25 40,0 40,200 0,175';
  else if (direction === 'right') points = '0,0 40,25 40,175 0,200';
  
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="overflow: visible;">
            <polygon points="${points}" fill="white" stroke="#666" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
          </svg>`;
}

function update3DCube() {
  const map: Record<string, string> = {
    'center': '3d-center',
    'right2': '3d-back',
    'right1': '3d-right1',
    'left': '3d-left',
    'top': '3d-top',
    'bottom': '3d-bottom'
  };
  
  currentFaces.forEach(face => {
    const el = document.getElementById(map[face.id]);
    if (el) {
      el.style.backgroundColor = face.bgColor;
      if (face.imageUrl) {
        el.innerHTML = `<img src="${face.imageUrl}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;margin-bottom:4px;" /><div class="text">${face.defaultText}</div>`;
      } else {
        el.innerHTML = `<div class="emoji">${face.emoji}</div><div class="text">${face.defaultText}</div>`;
      }
    }
  });
}

function renderApp() {
  const controlsContainer = document.getElementById('controls')!;
  const cubeNetContainer = document.getElementById('cube-net')!;
  
  // Clear previous
  controlsContainer.innerHTML = '';
  cubeNetContainer.innerHTML = '';

  // Theme selector UI
  const themeControls = document.createElement('div');
  themeControls.className = 'control-group';
  themeControls.innerHTML = `
    <div class="control-header">
      <span class="icon">✨</span>
      <span>Magic Theme Preset</span>
    </div>
    <select id="theme-selector" class="select-box" style="font-size: 16px; padding: 10px;">
      <option value="forest">🦊 Forest Friends</option>
      <option value="space">🚀 Space Explorer</option>
      <option value="dino">🦖 Dino Adventure</option>
    </select>
  `;
  controlsContainer.appendChild(themeControls);

  const themeSelector = document.getElementById('theme-selector') as HTMLSelectElement;
  themeSelector.value = (window as any).currentTheme || 'forest';
  themeSelector.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    (window as any).currentTheme = val;
    currentFaces = JSON.parse(JSON.stringify((themes as any)[val]));
    renderApp();
  });

  currentFaces.forEach(face => {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'control-group';
    const optionsHtml = emojiLibrary.map(e => `<option value="${e}" ${e === face.emoji ? 'selected' : ''}>${e}</option>`).join('');

    controlDiv.innerHTML = `
      <div class="control-header" style="justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="emoji-badge" id="badge-${face.id}" style="background-color: ${face.bgColor}">
            ${face.emoji}
          </div>
          <span>${face.id.charAt(0).toUpperCase() + face.id.slice(1).replace(/[0-9]/g, ' $&')} Face</span>
        </div>
        <input type="color" id="color-${face.id}" value="${face.bgColor}" class="color-picker" title="Change Background Color" />
      </div>
      <textarea rows="2" id="input-${face.id}" placeholder="Question text...">${face.defaultText}</textarea>
      
      <div class="image-controls">
        <select id="select-emoji-${face.id}" class="select-box">
          ${optionsHtml}
        </select>
        <label class="upload-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Upload
          <input type="file" id="upload-${face.id}" accept="image/*" style="display:none;" />
        </label>
      </div>
    `;
    controlsContainer.appendChild(controlDiv);

    const faceDiv = document.createElement('div');
    faceDiv.className = `face ${face.positionClass}`;
    faceDiv.id = `face-el-${face.id}`;
    faceDiv.style.backgroundColor = face.bgColor;
    faceDiv.style.cursor = 'pointer';
    faceDiv.title = 'Click background to change color';
    faceDiv.innerHTML = `
      <div class="image-wrapper" id="img-wrap-${face.id}" style="height: 50px; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer;" title="Click to change icon">
        <div class="emoji" style="font-size: 40px;">${face.emoji}</div>
      </div>
      <div class="text" id="text-${face.id}" contenteditable="true" spellcheck="false" title="Click to edit text">${face.defaultText}</div>
    `;
    
    face.tabs.forEach(tabDir => {
      const tabDiv = document.createElement('div');
      const isH = tabDir === 'top' || tabDir === 'bottom';
      tabDiv.className = `tab tab-${isH ? 'h' : 'v'}`;
      if (tabDir === 'top') { tabDiv.style.top = 'calc(var(--tab-size) * -1)'; tabDiv.style.left = '0'; }
      else if (tabDir === 'bottom') { tabDiv.style.bottom = 'calc(var(--tab-size) * -1)'; tabDiv.style.left = '0'; }
      else if (tabDir === 'left') { tabDiv.style.top = '0'; tabDiv.style.left = 'calc(var(--tab-size) * -1)'; }
      else if (tabDir === 'right') { tabDiv.style.top = '0'; tabDiv.style.right = 'calc(var(--tab-size) * -1)'; }
      tabDiv.innerHTML = `${createTabSVG(isH ? 'h' : 'v', tabDir as any)}<span contenteditable="true" spellcheck="false" title="Click to edit">KLEBELASCHE</span>`;
      faceDiv.appendChild(tabDiv);
    });

    cubeNetContainer.appendChild(faceDiv);

    // Bindings
    document.getElementById(`input-${face.id}`)?.addEventListener('input', (e) => {
      face.defaultText = (e.target as HTMLTextAreaElement).value;
      document.getElementById(`text-${face.id}`)!.textContent = face.defaultText;
    });

    document.getElementById(`color-${face.id}`)?.addEventListener('input', (e) => {
      face.bgColor = (e.target as HTMLInputElement).value;
      document.getElementById(`badge-${face.id}`)!.style.backgroundColor = face.bgColor;
      document.getElementById(`face-el-${face.id}`)!.style.backgroundColor = face.bgColor;
      update3DCube();
    });

    const updateImage = () => {
      const badgeEl = document.getElementById(`badge-${face.id}`)!;
      const imgWrapEl = document.getElementById(`img-wrap-${face.id}`)!;
      if (face.imageUrl) {
        badgeEl.innerHTML = `<img src="${face.imageUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;"/>`;
        imgWrapEl.innerHTML = `<img src="${face.imageUrl}" style="width:48px;height:48px;object-fit:contain;"/>`;
      } else {
        badgeEl.innerHTML = face.emoji;
        imgWrapEl.innerHTML = `<div class="emoji" style="font-size: 40px;">${face.emoji}</div>`;
      }
      update3DCube();
    };

    document.getElementById(`select-emoji-${face.id}`)?.addEventListener('change', (e) => {
      face.emoji = (e.target as HTMLSelectElement).value;
      face.imageUrl = null;
      updateImage();
    });

    document.getElementById(`upload-${face.id}`)?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          face.imageUrl = ev.target?.result as string;
          updateImage();
        };
        reader.readAsDataURL(file);
      }
    });

    // --- Interactive Preview Bindings ---
    faceDiv.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.image-wrapper') || (e.target as HTMLElement).closest('.text') || (e.target as HTMLElement).closest('.tab')) {
        return; // Don't trigger color picker if clicking icon, text, or tab
      }
      document.getElementById(`color-${face.id}`)?.click();
    });

    const imgWrapPreview = faceDiv.querySelector('.image-wrapper') as HTMLElement;
    imgWrapPreview.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectEl = document.getElementById(`select-emoji-${face.id}`);
      if (selectEl) {
        selectEl.focus();
        const controlGroup = selectEl.closest('.control-group') as HTMLElement;
        controlGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
        controlGroup.style.boxShadow = '0 0 0 4px var(--primary)';
        setTimeout(() => controlGroup.style.boxShadow = '', 1000);
      }
    });

    const textPreview = faceDiv.querySelector('.text') as HTMLElement;
    textPreview.addEventListener('input', (e) => {
      face.defaultText = (e.target as HTMLElement).textContent || '';
      (document.getElementById(`input-${face.id}`) as HTMLTextAreaElement).value = face.defaultText;
    });
  });

  update3DCube();
}

function initApp() {
  renderApp();
  
  document.getElementById('print-btn')?.addEventListener('click', () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      window.print();
    }, 500);
  });
}

document.addEventListener('DOMContentLoaded', initApp);
