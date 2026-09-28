// src/modules/map.js

const MapModule = (function() {
  let appState = null;

  function init(state) {
    appState = state;
  }

  function renderIslandMap() {
    const container = document.getElementById('map-indo');
    const legendContainer = document.getElementById('island-legend');
    container.innerHTML = '';
    legendContainer.innerHTML = '<h3>Pilih Wilayah</h3><div id="legend-chips" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:10px;"></div>';

    const chipsContainer = document.getElementById('legend-chips');

    // For MVP fallback map, we'll draw simple clickable regions
    const mapContent = document.createElement('div');
    mapContent.style.display = 'grid';
    mapContent.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
    mapContent.style.gap = '1rem';
    mapContent.style.height = '100%';
    mapContent.style.alignContent = 'center';
    mapContent.style.padding = '1rem';

    appState.content.islands.forEach(island => {
      // Draw map block
      const block = document.createElement('div');
      block.className = 'glass';
      block.style.padding = '2rem 1rem';
      block.style.textAlign = 'center';
      block.style.cursor = 'pointer';
      block.style.borderRadius = '16px';
      block.style.transition = 'background 0.2s, transform 0.2s';
      block.innerHTML = `<strong>${island.name}</strong><br><small>${island.provinces.length} Provinsi</small>`;
      
      const islandColor = `var(--color-${island.id.replace('-', '')})`;
      block.style.borderTop = `4px solid ${islandColor}`;

      // Draw legend chip
      const chip = document.createElement('button');
      chip.className = 'glass';
      chip.style.padding = '8px 16px';
      chip.style.borderRadius = '20px';
      chip.style.display = 'flex';
      chip.style.alignItems = 'center';
      chip.style.gap = '8px';
      chip.innerHTML = `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${islandColor}"></span> ${island.name}`;

      const handleClick = () => {
        appState.selectedIsland = island;
        appState.selectedProvince = null;
        window.App.navigate('s-02');
        renderProvinceMap(island);
      };

      block.addEventListener('click', handleClick);
      chip.addEventListener('click', handleClick);

      mapContent.appendChild(block);
      chipsContainer.appendChild(chip);
    });

    container.appendChild(mapContent);
  }

  function renderProvinceMap(island) {
    document.getElementById('s02-title').textContent = `Provinsi di ${island.name}`;
    const container = document.getElementById('map-island');
    container.innerHTML = '';

    const mapContent = document.createElement('div');
    mapContent.style.display = 'grid';
    mapContent.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
    mapContent.style.gap = '1rem';
    mapContent.style.padding = '2rem';

    const btnExplore = document.getElementById('btn-explore-prov');
    btnExplore.disabled = true;
    btnExplore.textContent = "Pilih Provinsi...";

    island.provinces.forEach(provId => {
      const prov = appState.content.provinces[provId];
      if (!prov) return; // e.g. Maluku might be missing data

      const block = document.createElement('div');
      block.className = 'glass';
      block.style.padding = '1.5rem 1rem';
      block.style.textAlign = 'center';
      block.style.cursor = 'pointer';
      block.style.borderRadius = '16px';
      block.style.transition = 'transform 0.2s';
      block.innerHTML = `<strong>${prov.name}</strong>`;

      block.addEventListener('click', () => {
        // Clear active styles
        Array.from(mapContent.children).forEach(c => c.style.borderColor = 'var(--line)');
        // Set active
        block.style.borderColor = 'var(--gold)';
        
        appState.selectedProvince = prov;
        btnExplore.disabled = false;
        btnExplore.textContent = `Jelajahi ${prov.name} →`;
      });

      mapContent.appendChild(block);
    });

    if (island.provinces.length === 0 || !appState.content.provinces[island.provinces[0]]) {
      mapContent.innerHTML = `<div class="muted" style="text-align:center; grid-column: 1/-1;">Data untuk ${island.name} belum tersedia (Segera Hadir).</div>`;
    }

    container.appendChild(mapContent);
  }

  return {
    init,
    renderIslandMap,
    renderProvinceMap
  };
})();

window.MapModule = MapModule;
