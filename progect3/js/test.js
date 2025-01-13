let currentQuestionIndex = 0;
let answers = [];
let timer;
let remainingTime = 15 * 60; // 15 minutes

const questionContainer = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const timerDisplay = document.getElementById("timer");
const progressInfo = document.getElementById("progress-info");
const darkModeToggle = document.getElementById("darkModeToggle");
const testTitle = document.getElementById("test-title");
const submitModal = document.getElementById("submit-modal");
const yesButton = submitModal.querySelector(".yes-btn");

const testType = localStorage.getItem("currentTest") || "iq";
const testPaths = {
    iq: "data/iq.json",
    english: "data/english.json",
    technical: "data/technical.json"
};

const testTitles = {
    iq: "IQ Test - Quiz Platform",
    english: "English Test - Quiz Platform",
    technical: "Technical Test - Quiz Platform"
};

document.title = testTitles[testType];
testTitle.textContent = testTitles[testType];

const questions = [];

fetch(testPaths[testType])
    .then(response => response.json())
    .then(data => {
        questions.push(...data);
        displayQuestion();
    })
    .catch(error => {
        console.error("Error loading questions:", error);
        alert("Failed to load questions. Please try again later.");
    });

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showSubmitModal();
        return;
    }

    const question = questions[currentQuestionIndex];
    questionContainer.textContent = question.question;
    progressInfo.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    optionsContainer.innerHTML = '';

    question.options.forEach((option) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label class="option-btn">
                <input type="radio" name="option" class="radio-input" value="${option}">
                <span>${option}</span>
            </label>
        `;
        optionsContainer.appendChild(li);
    });

    document.querySelectorAll('.radio-input').forEach(radio => {
        radio.addEventListener('change', (e) => {
            answers[currentQuestionIndex] = e.target.value;
            localStorage.setItem(`answers_${testType}`, JSON.stringify(answers));
            nextButton.disabled = false;
        });
    });

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "Submit";
        nextButton.addEventListener('click', showSubmitModal);
    } else {
        nextButton.textContent = "Next";
        nextButton.disabled = true;
    }
}

function showSubmitModal() {
    submitModal.style.display = "flex";
    document.body.insertAdjacentHTML('beforeend', '<div class="modal-backdrop"></div>');
}

yesButton.addEventListener('click', () => {
    localStorage.setItem(`answers_${testType}`, JSON.stringify(answers));
    window.location.href = `result.html?testType=${testType}`;
});

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    displayQuestion();
});

function startTimer() {
    timer = setInterval(() => {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (remainingTime <= 0) {
            clearInterval(timer);
            alert('Time is up! Submitting your answers.');
            localStorage.setItem(`answers_${testType}`, JSON.stringify(answers));
            window.location.href = `result.html?testType=${testType}`;
        }
    }, 1000);
}

startTimer();

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.test-container').classList.toggle('dark-mode');
});
