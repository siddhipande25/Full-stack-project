// Select elements
const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const answerBtns = document.getElementById("answer-buttons");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");
const endScreen = document.getElementById("end-screen");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;
let questions = []; // This will store fetched questions

// Start Quiz
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);

async function startQuiz() {
    document.getElementById("start-screen").classList.add("hide");
    endScreen.classList.add("hide");
    quizContainer.classList.remove("hide");
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 15;
    
    await fetchQuestions(); // Fetch new questions from API
    nextQuestion();
    startTimer();
}

// Fetch Questions from API
async function fetchQuestions() {
    try {
        const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
        const data = await res.json();
        questions = data.results.map(q => ({
            question: q.question,
            answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correct: q.correct_answer
        }));
    } catch (error) {
        console.error("Failed to fetch questions", error);
        alert("Error fetching questions. Try again later.");
    }
}

// Start Timer
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = `Time: ${timeLeft}`;
        if (timeLeft === 0) {
            endQuiz();
        }
    }, 1000);
}

// Load Next Question
function nextQuestion() {
    resetState();
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }
    let currentQuestion = questions[currentQuestionIndex];
    questionEl.innerHTML = currentQuestion.question;
    currentQuestion.answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.innerText = answer;
        btn.classList.add("btn");
        btn.addEventListener("click", () => selectAnswer(answer, currentQuestion.correct));
        answerBtns.appendChild(btn);
    });
    updateProgressBar();
}

// Reset Answer Buttons
function resetState() {
    answerBtns.innerHTML = "";
}

// Handle Answer Selection
function selectAnswer(selected, correct) {
    if (selected === correct) {
        score += 10;
        scoreEl.innerText = `Score: ${score}`;
    }
    currentQuestionIndex++;
    nextQuestion();
}

// Update Progress Bar
function updateProgressBar() {
    progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
}

// End Quiz
function endQuiz() {
    clearInterval(timerInterval);
    quizContainer.classList.add("hide");
    endScreen.classList.remove("hide");
    finalScoreEl.innerText = score;
    saveHighScore();
}

// Save High Score
function saveHighScore() {
    let highScore = localStorage.getItem("highScore") || 0;
    if (score > highScore) {
        localStorage.setItem("highScore", score);
    }
}
