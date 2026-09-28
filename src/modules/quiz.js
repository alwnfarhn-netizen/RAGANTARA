// src/modules/quiz.js

const QuizModule = (function() {
  let appState = null;
  let currentQuestionIndex = 0;
  let score = 0;
  let currentQuiz = [];

  function init(state) {
    appState = state;
  }

  function startQuiz() {
    currentQuiz = appState.selectedProvince.quiz;
    currentQuestionIndex = 0;
    score = 0;
    renderQuestion();
  }

  function renderQuestion() {
    if (currentQuestionIndex >= currentQuiz.length) {
      finishQuiz();
      return;
    }

    const q = currentQuiz[currentQuestionIndex];
    document.getElementById('quiz-progress').textContent = `Soal ${currentQuestionIndex + 1} dari ${currentQuiz.length}`;
    document.getElementById('quiz-question').textContent = q.question;
    
    const optionsGrid = document.getElementById('quiz-options');
    optionsGrid.innerHTML = '';
    
    const feedbackToast = document.getElementById('quiz-feedback');
    feedbackToast.classList.add('hidden');
    
    const btnNext = document.getElementById('btn-next-question');
    btnNext.classList.add('hidden');

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = `${opt.id.toUpperCase()}. ${opt.text}`;
      
      btn.addEventListener('click', () => handleAnswer(opt.id, q, btnNext, feedbackToast));
      optionsGrid.appendChild(btn);
    });
  }

  function handleAnswer(selectedId, questionData, btnNext, feedbackToast) {
    // Lock all options
    const optionsGrid = document.getElementById('quiz-options');
    Array.from(optionsGrid.children).forEach(btn => {
      btn.disabled = true;
      const optId = btn.textContent.charAt(0).toLowerCase();
      
      if (optId === questionData.correctOptionId) {
        btn.classList.add('correct');
      } else if (optId === selectedId) {
        btn.classList.add('wrong');
      }
    });

    if (selectedId === questionData.correctOptionId) {
      score++;
      if (window.AudioModule) window.AudioModule.playSfx('correct');
    } else {
      if (window.AudioModule) window.AudioModule.playSfx('wrong');
    }

    // Show feedback
    feedbackToast.textContent = questionData.feedback;
    feedbackToast.classList.remove('hidden');
    
    // Show next button
    btnNext.classList.remove('hidden');
    btnNext.onclick = () => {
      currentQuestionIndex++;
      renderQuestion();
    };
  }

  function finishQuiz() {
    window.App.navigate('s-08');
    const prov = appState.selectedProvince;
    
    // Save to localStorage
    try {
        let progress = JSON.parse(localStorage.getItem('ragantara_progress') || '{}');
        let currentBest = progress[prov.id] ? progress[prov.id].score : -1;
        if (score > currentBest) {
            progress[prov.id] = {
                score: score,
                badge: prov.badge,
                island: prov.island
            };
            localStorage.setItem('ragantara_progress', JSON.stringify(progress));
        }
    } catch (e) {
        console.warn("Could not save progress to localStorage.", e);
    }
    
    document.getElementById('result-score').innerHTML = `
      <div style="font-size: 4rem; font-weight: bold; color: var(--cyan);">${score}/${currentQuiz.length}</div>
      <p>Skor Akhir</p>
    `;
    
    document.getElementById('result-badge').innerHTML = `
      <div style="width: 150px; height: 150px; border-radius: 50%; background: linear-gradient(45deg, var(--gold), var(--pink)); display: flex; align-items: center; justify-content: center; margin: 1rem auto; border: 4px solid var(--bg1); box-shadow: 0 0 30px rgba(255,212,107,0.5);">
         <span style="font-size: 4rem;">🏆</span>
      </div>
      <h3>${prov.badge}</h3>
    `;

    const refList = document.getElementById('references-list');
    refList.innerHTML = '';
    if (prov.references && prov.references.length > 0) {
      prov.references.forEach(ref => {
        const li = document.createElement('li');
        li.textContent = ref.text; // Basic rendering
        refList.appendChild(li);
      });
    }
  }

  return {
    init,
    startQuiz
  };
})();

window.QuizModule = QuizModule;
