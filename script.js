 // --- CONFIGURATION ---
let currentLevel = 1;
let currentQuestionIdx = 0;
let score = 0;
let activeLevelData = null;

// --- TES QUESTIONS MANUELLES (Ajoute-en ici !) ---
const manualLevels = [
    {
        level: 1,
        questions: [
            { q: "Quelle est la capitale de la France ?", r: ["Marseille", "Paris", "Lyon", "Lille", "Bordeaux"], correct: 1 },
            { q: "Combien font 10 + 15 ?", r: ["20", "25", "30", "35", "40"], correct: 1 },
            { q: "Quelle est la couleur du rubis ?", r: ["Bleu", "Vert", "Rouge", "Jaune", "Noir"], correct: 2 },
            { q: "Quel animal miaule ?", r: ["Chien", "Vache", "Chat", "Lion", "Tigre"], correct: 2 },
            { q: "Le contraire de 'Jour' ?", r: ["Matin", "Nuit", "Soir", "Midi", "Aube"], correct: 1 }
        ]
    }
];

// --- GÉNÉRATEUR AUTOMATIQUE (Pour atteindre 500 niveaux) ---
function getLevelData(lvl) {
    const manual = manualLevels.find(m => m.level === lvl);
    if (manual) return manual;

    // Si pas de questions manuelles, on génère des maths/logique
    let generatedQs = [];
    for (let i = 0; i < 5; i++) {
        let a = Math.floor(Math.random() * (lvl + 10)) + 2;
        let b = Math.floor(Math.random() * (lvl + 5)) + 2;
        let res = a + b;
        generatedQs.push({
            q: `Niveau ${lvl} : Calcule ${a} + ${b}`,
            r: [res - 1, res, res + 2, res + 5, res - 3],
            correct: 1
        });
    }
    return { level: lvl, questions: generatedQs };
}

// --- LOGIQUE DU JEU ---
function startCurrentLevel() {
    activeLevelData = getLevelData(currentLevel);
    currentQuestionIdx = 0;
    score = 0;
    document.getElementById('quiz-overlay').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const qData = activeLevelData.questions[currentQuestionIdx];
    document.getElementById('quiz-level-title').innerText = "Niveau " + currentLevel;
    document.getElementById('quiz-step-count').innerText = `Question ${currentQuestionIdx + 1} / 5`;
    document.getElementById('q-text').innerText = qData.q;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = "";

    qData.r.forEach((text, i) => {
        const btn = document.createElement('button');
        btn.className = "quiz-button";
        btn.innerText = text;
        btn.onclick = () => checkAnswer(i);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selectedIdx) {
    if (selectedIdx === activeLevelData.questions[currentQuestionIdx].correct) {
        score++;
    }
    currentQuestionIdx++;

    if (currentQuestionIdx < 5) {
        showQuestion();
    } else {
        endLevel();
    }
}

function endLevel() {
    document.getElementById('quiz-overlay').classList.add('hidden');
    if (score >= 4) {
        alert(`Félicitations ! Niveau ${currentLevel} réussi (${score}/5)`);
        currentLevel++;
        updateDashboard();
    } else {
        alert(`Échec ! Tu as fait ${score}/5. Réessaie pour passer au niveau suivant.`);
    }
}

function updateDashboard() {
    document.getElementById('stat-level').innerText = currentLevel;
    document.getElementById('btn-lvl-num').innerText = currentLevel;
    
    // Progression sur 500
    let progressPercent = Math.min((currentLevel / 500) * 100, 100);
    document.getElementById('progression').innerText = Math.floor(progressPercent) + "%";
    document.getElementById('progress-fill').style.width = progressPercent + "%";
    document.getElementById('progress-text').innerText = `${currentLevel - 1} / 500 niveaux complétés`;

    // Mise à jour de la grille visuelle
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
        const box = document.createElement('div');
        box.className = 'lvl-box' + (i === currentLevel ? ' active' : '');
        box.innerText = i;
        grid.appendChild(box);
    }
    const dotBox = document.createElement('div');
    dotBox.className = 'lvl-box';
    dotBox.innerText = "...500";
    grid.appendChild(dotBox);
}

// Lancer au démarrage
window.onload = renderGrid;
