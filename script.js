let hanziData = [];

// Function to load CSV file
async function loadHanziData() {
    const response = await fetch('hanzi_data.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1); // Skip the header

    rows.forEach(row => {
        const [hanzi, meaning] = row.split(',');
        hanziData.push({ hanzi: hanzi.trim(), meaning: meaning.trim() });
    });
}

// Call the load function on page load
window.onload = async function () {
    await loadHanziData();
};

// Rest of the game logic remains the same

let currentQuestion = 0;
let currentQuestions = [];

function startGame(wordCount) {
    currentQuestion = 0;
    currentQuestions = generateQuestions(wordCount);
    showQuestion();
}

function generateQuestions(wordCount) {
    const questions = [];
    const usedIndexes = new Set();

    while (questions.length < wordCount) {
        const randomIndex = Math.floor(Math.random() * hanziData.length);

        if (!usedIndexes.has(randomIndex)) {
            const question = hanziData[randomIndex];
            usedIndexes.add(randomIndex);

            // Generate random answer choices, making sure one is correct
            const answers = generateAnswerChoices(randomIndex);
            questions.push({ question, answers });
        }
    }

    return questions;
}

function generateAnswerChoices(correctIndex) {
    const correctAnswer = hanziData[correctIndex].meaning;
    const choices = [correctAnswer];
    const usedIndexes = new Set([correctIndex]);

    while (choices.length < 4) {
        const randomIndex = Math.floor(Math.random() * hanziData.length);

        if (!usedIndexes.has(randomIndex)) {
            choices.push(hanziData[randomIndex].meaning);
            usedIndexes.add(randomIndex);
        }
    }

    // Shuffle choices
    return choices.sort(() => Math.random() - 0.5);
}

function showQuestion() {
    if (currentQuestion < currentQuestions.length) {
        const gameDiv = document.getElementById("game");
        const current = currentQuestions[currentQuestion];

        gameDiv.innerHTML = `
            <div class="question">${current.question.hanzi}</div>
            <div class="answer-options">
                ${current.answers.map((answer, index) => `
                    <button onclick="checkAnswer('${answer}', '${current.question.meaning}')">
                        ${String.fromCharCode(65 + index)}. ${answer}
                    </button>
                `).join('')}
            </div>
        `;
    } else {
        endGame();
    }
}

function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        alert("Correct!");
    } else {
        alert(`Wrong! The correct answer was: ${correctAnswer}`);
    }
    currentQuestion++;
    showQuestion();
}

function endGame() {
    document.getElementById("game").innerHTML = `
        <h2>Game Over!</h2>
        <button onclick="location.reload()">Play Again</button>
    `;
}
