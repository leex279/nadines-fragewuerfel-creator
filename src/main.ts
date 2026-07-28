import './style.css';

interface FaceData {
  id: string;
  emoji: string;
  imageUrl: string | null;
  defaultText: string;
  bgColor: string;
  positionClass: string;
  tabs: string[];
}

const faces: FaceData[] = [
  { id: 'top', emoji: '🦊', imageUrl: null, defaultText: 'Worauf bist du heute stolz?', bgColor: '#e6f4ea', positionClass: 'face-top', tabs: ['top', 'left', 'right'] },
  { id: 'left', emoji: '🦔', imageUrl: null, defaultText: 'Wem möchtest du heute Danke sagen?', bgColor: '#fef7e0', positionClass: 'face-left', tabs: ['left'] },
  { id: 'center', emoji: '🐻', imageUrl: null, defaultText: 'Worüber hast du heute am meisten gelacht?', bgColor: '#e8f0fe', positionClass: 'face-center', tabs: [] },
  { id: 'right1', emoji: '🐰', imageUrl: null, defaultText: 'Was hat dich heute glücklich gemacht?', bgColor: '#fce8e6', positionClass: 'face-right1', tabs: [] },
  { id: 'right2', emoji: '🐿️', imageUrl: null, defaultText: 'Worauf freust du dich morgen?', bgColor: '#e0f2f1', positionClass: 'face-right2', tabs: [] },
  { id: 'bottom', emoji: '🦉', imageUrl: null, defaultText: 'Was Neues hast du heute gelernt?', bgColor: '#fff3e0', positionClass: 'face-bottom', tabs: ['bottom', 'left', 'right'] },
];

const emojiLibrary = ['🦊', '🦔', '🐻', '🐰', '🐿️', '🦉', '🦄', '🦖', '🐶', '🐱', '🐸', '🐼', '🐯', '🦁', '🐮', '🐷', '🦋', '🐞'];

function createTabSVG(type: 'h' | 'v', direction: 'top' | 'bottom' | 'left' | 'right') {
  const w = type === 'h' ? 200 : 40;
  const h = type === 'h' ? 40 : 200;
  
  let points = '';
  if (direction === 'top') {
    points = '25,0 175,0 200,40 0,40'; // top trapezoid
  } else if (direction === 'bottom') {
    points = '0,0 200,0 175,40 25,40'; // bottom trapezoid
  } else if (direction === 'left') {
    points = '0,25 40,0 40,200 0,175'; // left trapezoid
  } else if (direction === 'right') {
    points = '0,0 40,25 40,175 0,200'; // right trapezoid
  }

  return `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="overflow: visible;">
      <polygon points="${points}" fill="white" stroke="#666" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
    </svg>
  `;
}

function initApp() {
  const controlsContainer = document.getElementById('controls')!;
  const cubeNetContainer = document.getElementById('cube-net')!;

  faces.forEach(face => {
    // 1. Create Control Input
    const controlDiv = document.createElement('div');
    controlDiv.className = 'control-group';
    
    const optionsHtml = emojiLibrary.map(e => `<option value="${e}" ${e === face.emoji ? 'selected' : ''}>${e}</option>`).join('');

    controlDiv.innerHTML = `
      <div class="control-header">
        <div class="emoji-badge" id="badge-${face.id}" style="background-color: ${face.bgColor}">
          ${face.emoji}
        </div>
        <span>${face.id.charAt(0).toUpperCase() + face.id.slice(1).replace(/[0-9]/g, ' $&')} Face</span>
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

    // 2. Create Face Element
    const faceDiv = document.createElement('div');
    faceDiv.className = `face ${face.positionClass}`;
    faceDiv.style.backgroundColor = face.bgColor;
    faceDiv.innerHTML = `
      <div class="image-wrapper" id="img-wrap-${face.id}" style="height: 50px; margin-bottom: 6px; display: flex; align-items: center; justify-content: center;">
        <div class="emoji">${face.emoji}</div>
      </div>
      <div class="text" id="text-${face.id}">${face.defaultText}</div>
    `;
    
    // 3. Add Tabs
    face.tabs.forEach(tabDir => {
      const tabDiv = document.createElement('div');
      const isH = tabDir === 'top' || tabDir === 'bottom';
      tabDiv.className = `tab tab-${isH ? 'h' : 'v'}`;
      
      if (tabDir === 'top') {
        tabDiv.style.top = 'calc(var(--tab-size) * -1)';
        tabDiv.style.left = '0';
      } else if (tabDir === 'bottom') {
        tabDiv.style.bottom = 'calc(var(--tab-size) * -1)';
        tabDiv.style.left = '0';
      } else if (tabDir === 'left') {
        tabDiv.style.top = '0';
        tabDiv.style.left = 'calc(var(--tab-size) * -1)';
      } else if (tabDir === 'right') {
        tabDiv.style.top = '0';
        tabDiv.style.right = 'calc(var(--tab-size) * -1)';
      }

      tabDiv.innerHTML = `
        ${createTabSVG(isH ? 'h' : 'v', tabDir as any)}
        <span>KLEBELASCHE</span>
      `;
      faceDiv.appendChild(tabDiv);
    });

    cubeNetContainer.appendChild(faceDiv);

    // 4. Bind Events
    const inputEl = document.getElementById(`input-${face.id}`) as HTMLTextAreaElement;
    const textEl = document.getElementById(`text-${face.id}`)!;
    inputEl.addEventListener('input', (e) => {
      textEl.textContent = (e.target as HTMLTextAreaElement).value;
    });

    const selectEl = document.getElementById(`select-emoji-${face.id}`) as HTMLSelectElement;
    const uploadEl = document.getElementById(`upload-${face.id}`) as HTMLInputElement;
    const badgeEl = document.getElementById(`badge-${face.id}`)!;
    const imgWrapEl = document.getElementById(`img-wrap-${face.id}`)!;

    const updateImage = () => {
      if (face.imageUrl) {
        badgeEl.innerHTML = `<img src="${face.imageUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;"/>`;
        imgWrapEl.innerHTML = `<img src="${face.imageUrl}" style="width:48px;height:48px;object-fit:contain;"/>`;
      } else {
        badgeEl.innerHTML = face.emoji;
        imgWrapEl.innerHTML = `<div class="emoji" style="font-size: 40px;">${face.emoji}</div>`;
      }
    };

    selectEl.addEventListener('change', (e) => {
      face.emoji = (e.target as HTMLSelectElement).value;
      face.imageUrl = null; // Clear custom upload if library emoji is chosen
      updateImage();
    });

    uploadEl.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          face.imageUrl = event.target?.result as string;
          updateImage();
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // Print button logic
  document.getElementById('print-btn')?.addEventListener('click', () => {
    window.print();
  });
}

document.addEventListener('DOMContentLoaded', initApp);
