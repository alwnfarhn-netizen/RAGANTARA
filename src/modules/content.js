// src/modules/content.js

const ContentModule = (function() {
  let appState = null;

  const CATEGORY_ICONS = {
    'makanan-khas': '🍜',
    'pakaian-adat': '👘',
    'tari-dan-seni': '💃',
    'rumah-adat': '🏠',
    'musik-tradisi': '🥁',
    'cerita-rakyat': '📖'
  };

  function init(state) {
    appState = state;
  }

  function renderProvinceGate() {
    const prov = appState.selectedProvince;
    document.getElementById('s03-title').textContent = prov.name;
    document.getElementById('s03-intro').textContent = prov.intro;

    const orb = document.getElementById('prov-orb');
    orb.innerHTML = `<h3>${prov.name}</h3>`;
    
    // Set orb color based on island
    const islandColor = `var(--color-${prov.island.replace('-', '')})`;
    orb.style.background = `linear-gradient(45deg, ${islandColor}, var(--pink))`;
  }

  function renderCategories() {
    const prov = appState.selectedProvince;
    document.getElementById('s04-title').textContent = `Kategori Budaya ${prov.name}`;
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '';

    Object.entries(prov.categories).forEach(([slug, cat]) => {
      const card = document.createElement('div');
      card.className = 'culture-card glass';
      
      const icon = CATEGORY_ICONS[slug] || '✨';
      
      card.innerHTML = `
        <div class="icon">${icon}</div>
        <h3>${cat.label}</h3>
        <p class="muted">${cat.cards.length} kartu</p>
        <button class="cta-secondary btn-play-sfx" data-cat="${slug}" aria-label="Mainkan efek suara ${cat.label}" style="padding: 6px 12px; font-size: 0.9rem;">🔊 Suara</button>
      `;

      // Intercept audio button click
      const audioBtn = card.querySelector('.btn-play-sfx');
      audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.AudioModule) window.AudioModule.playSfx(slug);
      });

      card.addEventListener('click', () => {
        appState.selectedCategory = cat;
        window.App.navigate('s-05');
        renderCardsList();
      });

      grid.appendChild(card);
    });
  }

  function renderCardsList() {
    const cat = appState.selectedCategory;
    document.getElementById('s05-title').textContent = cat.label;
    
    const showcase = document.getElementById('cards-showcase');
    const list = document.getElementById('cards-list');
    showcase.innerHTML = '';
    list.innerHTML = '';

    if (cat.cards.length === 0) return;

    // First card as showcase
    const mainCard = cat.cards[0];
    showcase.className = 'glass panel';
    showcase.style.marginBottom = '2rem';
    showcase.style.textAlign = 'center';
    showcase.style.cursor = 'pointer';
    
    const showcaseVisual = mainCard.imageUrl 
        ? `<img src="${mainCard.imageUrl}" alt="${mainCard.title}" style="max-width: 100%; height: 200px; object-fit: cover; border-radius: 16px; margin-bottom: 1rem;">` 
        : `<div style="font-size: 5rem; margin-bottom: 1rem; animation: morph 3s infinite alternate;">✨</div>`;

    showcase.innerHTML = `
      ${showcaseVisual}
      <h3>${mainCard.title}</h3>
      <p class="muted" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${mainCard.body}</p>
      <div style="margin-top: 1rem; color: var(--gold);">Lihat Detail →</div>
    `;
    showcase.addEventListener('click', () => {
      appState.selectedCard = mainCard;
      window.App.navigate('s-06');
      renderCardDetail();
    });

    // Remaining cards as list
    if (cat.cards.length > 1) {
      list.style.display = 'grid';
      list.style.gap = '1rem';
      
      for (let i = 1; i < cat.cards.length; i++) {
        const c = cat.cards[i];
        const item = document.createElement('div');
        item.className = 'glass';
        item.style.padding = '1rem 1.5rem';
        item.style.borderRadius = '16px';
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        
        item.innerHTML = `
          <div>
            <h4 style="margin: 0; font-size: 1.2rem;">${c.title}</h4>
            <div class="muted" style="font-size: 0.9rem; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.body}</div>
          </div>
          <div style="color: var(--cyan);">→</div>
        `;
        
        item.addEventListener('click', () => {
          appState.selectedCard = c;
          window.App.navigate('s-06');
          renderCardDetail();
        });
        
        list.appendChild(item);
      }
    }
  }

  function renderCardDetail() {
    const card = appState.selectedCard;
    document.getElementById('s06-title').textContent = card.title;
    
    // Formatting body: it might have multiple lines
    const formattedBody = card.body.split('\\n').map(p => `<p>${p}</p>`).join('');
    
    // Feature: Authentic Images
    const imgHtml = card.imageUrl ? `<img src="${card.imageUrl}" alt="${card.title}" style="max-width: 100%; border-radius: 16px; margin-bottom: 1rem;">` : '';
    
    document.getElementById('s06-body').innerHTML = imgHtml + formattedBody;

    const btnSpeak = document.getElementById('btn-speak');
    btnSpeak.onclick = () => {
      const bodyEl = document.getElementById('s06-body');
      if (window.AudioModule) window.AudioModule.speakCard(card, bodyEl);
    };
  }

  return {
    init,
    renderProvinceGate,
    renderCategories,
    renderCardsList,
    renderCardDetail
  };
})();

window.ContentModule = ContentModule;
