// src/app.js
// Main App Shell handling navigation

const state = {
  currentScreen: 's-00',
  history: [],
  content: null,
  
  selectedIsland: null,
  selectedProvince: null,
  selectedCategory: null,
  selectedCard: null
};

// DOM Elements
const screens = document.querySelectorAll('.screen');
const btnBack = document.getElementById('btn-back');
const progressBarContainer = document.getElementById('progress-bar-container');

async function initApp() {
  try {
    // Load content.json
    const response = await fetch('content/compiled/content.json');
    if (!response.ok) throw new Error("Failed to load content.json");
    state.content = await response.json();
    console.log("Content loaded successfully:", state.content);

    // Initialize modules
    if (window.GlobeModule) window.GlobeModule.init();
    if (window.MapModule) window.MapModule.init(state);
    if (window.ContentModule) window.ContentModule.init(state);
    if (window.QuizModule) window.QuizModule.init(state);
    if (window.AudioModule) window.AudioModule.init();

    setupGlobalListeners();
  } catch (error) {
    console.error("App init error:", error);
    alert("Gagal memuat data konten. Pastikan build telah dijalankan.");
  }
}

function setupGlobalListeners() {
  btnBack.addEventListener('click', goBack);

  // Example navigation triggers
  document.getElementById('btn-start-explore').addEventListener('click', () => {
    navigate('s-01');
    if (window.MapModule) window.MapModule.renderIslandMap();
  });

  document.getElementById('btn-explore-prov').addEventListener('click', () => {
    if (state.selectedProvince) {
      navigate('s-03');
      if (window.ContentModule) window.ContentModule.renderProvinceGate();
    }
  });

  document.getElementById('btn-enter-categories').addEventListener('click', () => {
    navigate('s-04');
    if (window.ContentModule) window.ContentModule.renderCategories();
  });

  document.getElementById('btn-start-quiz').addEventListener('click', () => {
    navigate('s-07');
    if (window.QuizModule) window.QuizModule.startQuiz();
  });

  document.getElementById('btn-retry-prov').addEventListener('click', () => {
    navigate('s-04'); // Or s-03
  });

  document.getElementById('btn-other-prov').addEventListener('click', () => {
    // Return to map island or map indo
    state.selectedProvince = null;
    navigate('s-02');
    if (window.MapModule) window.MapModule.renderProvinceMap(state.selectedIsland);
  });

  document.getElementById('btn-random-prov').addEventListener('click', () => {
    // Pick random province
    const provKeys = Object.keys(state.content.provinces);
    const randomKey = provKeys[Math.floor(Math.random() * provKeys.length)];
    const randomProv = state.content.provinces[randomKey];
    
    // Find island for this province
    const island = state.content.islands.find(i => i.id === randomProv.island);
    
    state.selectedIsland = island;
    state.selectedProvince = randomProv;
    
    navigate('s-03');
    if (window.ContentModule) window.ContentModule.renderProvinceGate();
  });

  document.getElementById('btn-view-badges').addEventListener('click', () => {
    navigate('s-09');
    renderBadgeCollection();
  });

  document.getElementById('btn-export-progress').addEventListener('click', () => {
    const progress = localStorage.getItem('ragantara_progress') || '{}';
    const blob = new Blob([progress], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress_siswa_${new Date().toISOString().split('T')[0]}.ragantara`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  const fileImport = document.getElementById('file-import');
  document.getElementById('btn-import-progress').addEventListener('click', () => {
    fileImport.click();
  });
  fileImport.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            localStorage.setItem('ragantara_progress', JSON.stringify(data));
            alert('Data progres berhasil diimpor!');
            renderBadgeCollection();
        } catch(err) {
            alert('File tidak valid.');
        }
    };
    reader.readAsText(file);
  });
}

function renderBadgeCollection() {
    const grid = document.getElementById('badge-collection-grid');
    grid.innerHTML = '';
    
    let progress = {};
    try {
        progress = JSON.parse(localStorage.getItem('ragantara_progress') || '{}');
    } catch(e) {}

    const allProv = Object.values(state.content.provinces);
    allProv.forEach(prov => {
        const hasBadge = !!progress[prov.id];
        
        const badgeEl = document.createElement('div');
        badgeEl.style.padding = '1rem';
        badgeEl.style.filter = hasBadge ? 'none' : 'grayscale(100%) opacity(0.3)';
        
        const islandColor = `var(--color-${prov.island.replace('-', '')})`;
        
        badgeEl.innerHTML = `
            <div style="width: 80px; height: 80px; margin: 0 auto 10px auto; border-radius: 50%; background: linear-gradient(45deg, ${islandColor}, var(--bg1)); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px ${islandColor};">
                <span style="font-size: 2.5rem;">🏆</span>
            </div>
            <div style="font-size: 0.8rem; font-weight: bold;">${prov.badge}</div>
            <div class="muted" style="font-size: 0.7rem;">${hasBadge ? 'Skor: ' + progress[prov.id].score + '/10' : 'Terkunci'}</div>
        `;
        
        grid.appendChild(badgeEl);
    });
}

function navigate(targetScreenId, addToHistory = true) {
  if (addToHistory && state.currentScreen !== targetScreenId) {
    state.history.push(state.currentScreen);
  }
  
  state.currentScreen = targetScreenId;

  // Hide all screens
  screens.forEach(s => s.classList.remove('active'));
  // Show target
  const target = document.getElementById(targetScreenId);
  if (target) {
    target.classList.add('active');
  }

  // Update back button
  if (targetScreenId === 's-00') {
    btnBack.style.display = 'none';
  } else {
    btnBack.style.display = 'block';
  }

  // Manage Background Music via AudioModule
  if (window.AudioModule) {
      window.AudioModule.updateMusicForScreen(state);
  }
}

function goBack() {
  if (state.history.length > 0) {
    const prevScreen = state.history.pop();
    navigate(prevScreen, false);
  }
}

// Global expose
window.App = {
  navigate,
  state
};

// Start
document.addEventListener('DOMContentLoaded', initApp);
