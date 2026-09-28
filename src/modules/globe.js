// src/modules/globe.js

const GlobeModule = (function() {
  function init() {
    const container = document.getElementById('globe-container');
    container.innerHTML = '';
    
    // Create the map image container
    const mapWrapper = document.createElement('div');
    mapWrapper.style.position = 'relative';
    mapWrapper.style.width = '100%';
    mapWrapper.style.height = '100%';
    mapWrapper.style.display = 'flex';
    mapWrapper.style.alignItems = 'center';
    mapWrapper.style.justifyContent = 'center';

    const mapImg = document.createElement('img');
    mapImg.src = 'public/map-indo.png';
    mapImg.style.maxWidth = '100%';
    mapImg.style.maxHeight = '100%';
    mapImg.style.objectFit = 'contain';
    // Add strong shadow to simulate 3D depth
    mapImg.style.filter = 'drop-shadow(10px 20px 10px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(99, 230, 180, 0.4)) invert(1) brightness(1.5)';
    
    // Wrap img in a relative container so we can position dots over it
    const imgBounds = document.createElement('div');
    imgBounds.style.position = 'relative';
    imgBounds.style.display = 'inline-block';
    // Apply 3D perspective and isometric tilt
    imgBounds.style.transformStyle = 'preserve-3d';
    imgBounds.style.transform = 'perspective(1000px) rotateX(30deg) rotateY(-15deg)';
    imgBounds.style.transition = 'transform 0.5s ease-out';
    
    // Floating animation
    imgBounds.animate([
      { transform: 'perspective(1000px) rotateX(30deg) rotateY(-15deg) translateY(0px)' },
      { transform: 'perspective(1000px) rotateX(32deg) rotateY(-12deg) translateY(-15px)' },
      { transform: 'perspective(1000px) rotateX(30deg) rotateY(-15deg) translateY(0px)' }
    ], { duration: 6000, iterations: Infinity, easing: 'ease-in-out' });

    // Interactive hover effect
    mapWrapper.addEventListener('mousemove', (e) => {
      const rect = mapWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      imgBounds.style.transform = `perspective(1000px) rotateX(${30 - y * 20}deg) rotateY(${-15 + x * 20}deg)`;
    });
    mapWrapper.addEventListener('mouseleave', () => {
      imgBounds.style.transform = 'perspective(1000px) rotateX(30deg) rotateY(-15deg)';
    });

    imgBounds.appendChild(mapImg);
    mapWrapper.appendChild(imgBounds);
    container.appendChild(mapWrapper);

    // Island dot positions (approximate percentages over the 2D image)
    // Adjust these based on the actual image aspect ratio
    const markers = [
      { top: '35%', left: '15%', name: 'Sumatra', color: '#5674d8' },
      { top: '75%', left: '35%', name: 'Jawa', color: '#f2b74d' },
      { top: '45%', left: '42%', name: 'Kalimantan', color: '#41a68e' },
      { top: '50%', left: '60%', name: 'Sulawesi', color: '#e47d8f' },
      { top: '80%', left: '55%', name: 'Bali-Nusa', color: '#a46be3' },
      { top: '55%', left: '85%', name: 'Papua', color: '#5aa7cf' }
    ];

    markers.forEach(m => {
      const dot = document.createElement('div');
      dot.style.position = 'absolute';
      dot.style.top = m.top;
      dot.style.left = m.left;
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.backgroundColor = m.color;
      dot.style.borderRadius = '50%';
      dot.style.boxShadow = `0 0 10px ${m.color}`;
      // translateZ pushes the dot out of the map screen
      dot.style.transform = 'translate(-50%, -50%) translateZ(40px)';
      dot.title = m.name;

      const label = document.createElement('div');
      label.textContent = m.name;
      label.style.position = 'absolute';
      label.style.top = `calc(${m.top} - 35px)`; // adjusted for the translateZ
      label.style.left = m.left;
      // Also pop out the label
      label.style.transform = 'translateX(-50%) translateZ(40px)';
      label.style.color = m.color;
      label.style.fontWeight = 'bold';
      label.style.textShadow = '0 0 5px rgba(0,0,0,1)';
      
      imgBounds.appendChild(dot);
      imgBounds.appendChild(label);
    });
  }

  return { init };
})();

window.GlobeModule = GlobeModule;
