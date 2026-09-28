// src/modules/audio.js

const AudioModule = (function() {
  let audioCtx = null;
  let bgmOscillator = null;
  let bgmGain = null;
  let isMuted = false;

  // Simple motifs representing the 7 islands (frequencies)
  const motifs = {
    'sumatra': [261.63, 293.66, 329.63, 349.23], // C D E F
    'jawa': [261.63, 329.63, 392.00, 523.25],    // C E G C
    'kalimantan': [220.00, 246.94, 277.18, 329.63], // A B C# E
    'sulawesi': [293.66, 349.23, 440.00, 587.33], // D F A D
    'bali-nusa': [329.63, 349.23, 493.88, 659.25], // E F B E
    'maluku': [392.00, 440.00, 493.88, 587.33], // G A B D
    'papua': [261.63, 311.13, 392.00, 523.25] // C Eb G C
  };

  function init() {
    // We defer AudioContext creation until user interaction to comply with browser autoplay policies
    document.getElementById('btn-toggle-bgm').addEventListener('click', toggleMute);
  }

  function initCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function tone(freq, type = 'sine', duration = 0.5, vol = 0.1) {
    if (isMuted) return;
    initCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function playSfx(type) {
    if (isMuted) return;
    initCtx();
    
    // Trigger visual indicator
    showVisualIndicator(type);

    switch (type) {
      case 'makanan-khas': tone(600, 'triangle', 0.3, 0.2); break;
      case 'pakaian-adat': tone(800, 'sine', 0.4, 0.1); break;
      case 'tari-dan-seni': tone(400, 'square', 0.2, 0.05); tone(500, 'square', 0.2, 0.05); break;
      case 'rumah-adat': tone(200, 'sawtooth', 0.5, 0.1); break;
      case 'musik-tradisi': tone(300, 'sine', 0.6, 0.3); break;
      case 'cerita-rakyat': tone(700, 'sine', 1.0, 0.1); break;
      case 'correct': 
        tone(440, 'sine', 0.1); 
        setTimeout(() => tone(660, 'sine', 0.3), 100); 
        break;
      case 'wrong':
        tone(300, 'sawtooth', 0.3);
        setTimeout(() => tone(200, 'sawtooth', 0.4), 150);
        break;
      default: tone(440);
    }
  }

  function showVisualIndicator(type) {
    // A visual pulse for deaf users
    let indicator = document.getElementById('sfx-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'sfx-indicator';
      indicator.style.position = 'fixed';
      indicator.style.top = '50%';
      indicator.style.left = '50%';
      indicator.style.transform = 'translate(-50%, -50%)';
      indicator.style.fontSize = '8rem';
      indicator.style.pointerEvents = 'none';
      indicator.style.zIndex = '9999';
      indicator.style.opacity = '0';
      indicator.style.transition = 'opacity 0.2s, transform 0.2s';
      document.body.appendChild(indicator);
    }
    
    const icons = {
      'makanan-khas': '🍜', 'pakaian-adat': '👘', 'tari-dan-seni': '💃',
      'rumah-adat': '🏠', 'musik-tradisi': '🥁', 'cerita-rakyat': '📖',
      'correct': '✅', 'wrong': '❌'
    };
    
    indicator.textContent = icons[type] || '🔊';
    indicator.style.opacity = '0.8';
    indicator.style.transform = 'translate(-50%, -50%) scale(1.5)';
    
    setTimeout(() => {
      indicator.style.opacity = '0';
      indicator.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 600);
  }

  function speakCard(card, targetElement) {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    
    // Feature 4: Authentic Audio Support
    // If the card has a real audio URL, play that instead of TTS
    if (card.audioUrl) {
        const audio = new Audio(card.audioUrl);
        audio.play().catch(e => console.warn("Failed to play authentic audio:", e));
        return;
    }

    if (!('speechSynthesis' in window)) {
      alert("Browser Anda tidak mendukung fitur suara.");
      return;
    }
    
    // Prepare DOM for highlighting if targetElement is provided
    let originalHTML = '';
    if (targetElement) {
        originalHTML = targetElement.innerHTML;
        const words = targetElement.textContent.split(' ');
        targetElement.innerHTML = words.map((w, i) => `<span id="word-${i}">${w}</span>`).join(' ');
    }

    const msg = new SpeechSynthesisUtterance(targetElement ? targetElement.textContent : card.body);
    msg.lang = 'id-ID';
    msg.rate = 0.9;
    
    if (targetElement) {
        let wordIndex = 0;
        msg.onboundary = (event) => {
            if (event.name === 'word') {
                // Remove highlight from all
                const spans = targetElement.querySelectorAll('span');
                spans.forEach(s => {
                    s.style.backgroundColor = 'transparent';
                    s.style.color = 'inherit';
                });
                
                // Add highlight to current
                const currentSpan = targetElement.querySelector(`#word-${wordIndex}`);
                if (currentSpan) {
                    currentSpan.style.backgroundColor = 'var(--cyan)';
                    currentSpan.style.color = 'var(--bg0)';
                    currentSpan.style.borderRadius = '4px';
                }
                wordIndex++;
            }
        };
        
        msg.onend = () => {
            targetElement.innerHTML = originalHTML; // restore
        };
        msg.onerror = () => {
            targetElement.innerHTML = originalHTML; // restore
        };
    }

    window.speechSynthesis.speak(msg);
  }

  function updateMusicForScreen(state) {
    if (isMuted) return;
    initCtx();
    
    // Stop current
    if (bgmOscillator) {
      bgmOscillator.stop();
      bgmOscillator = null;
    }

    if (state.currentScreen === 's-00') {
      // General ambient
      startAmbient(200);
    } else if (state.selectedIsland) {
      // Play a short motif representing the island
      const motif = motifs[state.selectedIsland.id] || motifs['jawa'];
      playMotif(motif);
      startAmbient(motif[0]);
    }
  }

  function playMotif(freqs) {
    freqs.forEach((f, i) => {
      setTimeout(() => tone(f, 'sine', 0.6, 0.15), i * 300);
    });
  }

  function startAmbient(baseFreq) {
    bgmOscillator = audioCtx.createOscillator();
    bgmGain = audioCtx.createGain();
    
    bgmOscillator.type = 'sine';
    bgmOscillator.frequency.value = baseFreq / 2; // Deep ambient
    
    bgmGain.gain.value = 0.02; // Very quiet
    
    bgmOscillator.connect(bgmGain);
    bgmGain.connect(audioCtx.destination);
    
    bgmOscillator.start();
  }

  function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('btn-toggle-bgm');
    const vis = document.getElementById('music-visualizer');
    
    if (isMuted) {
      btn.textContent = '🔈';
      vis.classList.add('hidden');
      if (bgmOscillator) bgmOscillator.stop();
      window.speechSynthesis.cancel();
    } else {
      btn.textContent = '🔊';
      vis.classList.remove('hidden');
      initCtx();
      if (window.App) updateMusicForScreen(window.App.state);
    }
  }

  return {
    init,
    playSfx,
    speakCard,
    updateMusicForScreen
  };
})();

window.AudioModule = AudioModule;
