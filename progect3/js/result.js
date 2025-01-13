const darkModeToggle = document.getElementById("darkModeToggle");
const resultMessage = document.getElementById("result-message");
const scoreElement = document.getElementById("score");
const showAnswersButton = document.getElementById("show-answers");
const answersTable = document.getElementById("answers-table").querySelector("tbody");

// Function to load and display test results
function loadTestResults(testType) {
    const testFiles = {
        iq: "data/iq.json",
        english: "data/english.json",
        technical: "data/technical.json",
    };

    fetch(testFiles[testType])
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load test data");
            }
            return response.json();
        })
        .then((correctAnswers) => {
            answersTable.innerHTML = "";
            resultMessage.textContent = "";
            showAnswersButton.style.display = "none"; // Hide Show Answers button initially
            answersTable.parentElement.style.display = "none"; // Hide the table initially

            // Retrieve user's answers from localStorage
            const answers = JSON.parse(localStorage.getItem(`answers_${testType}`));

            // Check if the user hasn't taken the test
            if (!answers || answers.length === 0) {
                resultMessage.textContent = "You have not taken this test yet.";
                resultMessage.className = "score warning"; // Add a CSS class for warning
                scoreElement.textContent = ""; // Clear the score display
                return; // Stop further execution
            }

            // Calculate the score
            let score = 0;
            correctAnswers.forEach((item, index) => {
                if (answers[index] === item.correctAnswer) {
                    score++;
                }
            });

            // Display the score
            scoreElement.textContent = `Score: ${score}/${correctAnswers.length}`;

            // Display success or failure message
            if (score >= 5) {
                resultMessage.textContent = "Congratulations! You passed the test.";
                resultMessage.className = "score success";
            } else {
                resultMessage.textContent = "Unfortunately, you did not pass.";
                resultMessage.className = "score failure";
            }

            // Show answers when the user clicks "Show Answers"
            showAnswersButton.style.display = "block";
            showAnswersButton.onclick = () => {
                answersTable.parentElement.style.display = "table";
                correctAnswers.forEach((item, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.question}</td>
                        <td class="${
                            answers[index] === item.correctAnswer ? "correct" : "incorrect"
                        }">${answers[index] || "Not Answered"}</td>
                        <td>${item.correctAnswer}</td>
                    `;
                    answersTable.appendChild(row);
                });
                generatePDF(testType, score, correctAnswers, answers); // Call generatePDF function
                showAnswersButton.style.display = "none";
            };
        })
        .catch((error) => {
            console.error("Error loading test data:", error);
            resultMessage.textContent = "Failed to load test data. Please try again.";
        });
}

// Generate PDF function
function generatePDF(testType, score, correctAnswers, answers) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // جلب بيانات المستخدم من localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let userName = "Unknown User";
    let userEmail = "No Email Provided";

    if (users.length > 0) {
        // استخراج بيانات المستخدم الأخير
        const latestUser = users[users.length - 1];
        userName = latestUser.name || userName;
        userEmail = latestUser.email || userEmail;
    }

    // إعدادات العناوين والخطوط
    const margin = 15;
    const lineSpacing = 12;
    let currentY = margin;

    // عنوان التقرير
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204); // لون أزرق جذاب
    doc.text("CodCom ", margin, currentY);
    currentY += lineSpacing * 2;

    // معلومات المستخدم
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text(`Name: ${userName}`, margin, currentY);
    currentY += lineSpacing;
    doc.text(`Email: ${userEmail}`, margin, currentY);
    currentY += lineSpacing;

    // نوع الاختبار والنتيجة
    doc.text(`Test Type: ${testType.charAt(0).toUpperCase() + testType.slice(1)}`, margin, currentY);
    currentY += lineSpacing;
    doc.text(`Score: ${score}/${correctAnswers.length}`, margin, currentY);
    currentY += lineSpacing * 1.5;

    // عنوان الجدول
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204);
    doc.text("Detailed Results", margin, currentY);
    currentY += lineSpacing * 1.5;

    // إعداد الجدول
    const tableStartY = currentY;
    const columnWidths = [90, 50, 50]; // عرض الأعمدة
    const headers = ["Question", "Your Answer", "Correct Answer"];

    // رسم خلفية الرأس
    doc.setFillColor(0, 0, 255);
    doc.rect(margin, tableStartY - 10, 190, 10, "F");

    // كتابة رأس الجدول
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    headers.forEach((header, index) => {
        const xPosition = margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
        doc.text(header, xPosition + 2, tableStartY - 2);
    });

    // إضافة البيانات
    let y = tableStartY + 5;
    correctAnswers.forEach((item, index) => {
        const userAnswer = answers[index] || "Not Answered";
        const isCorrect = userAnswer === item.correctAnswer;

        // خلفية الصف (تمييز بالتناوب)
        if (index % 2 === 0) {
            doc.setFillColor(240, 240, 255);
            doc.rect(margin, y - 6, 190, 10, "F");
        }

        // نص السؤال مع التفاف النص إذا كان طويلًا
        doc.setTextColor(0, 0, 0);
        const questionText = `${index + 1}. ${item.question}`;
        const splitQuestion = doc.splitTextToSize(questionText, 80);
        doc.text(splitQuestion, margin + 2, y);

        // إجابة المستخدم
        doc.setTextColor(isCorrect ? 0 : 255, isCorrect ? 102 : 0, isCorrect ? 0 : 0);
        const userAnswerX = margin + columnWidths[0];
        doc.text(userAnswer, userAnswerX + 2, y);

        // الإجابة الصحيحة
        doc.setTextColor(0, 0, 0);
        const correctAnswerX = userAnswerX + columnWidths[1];
        doc.text(item.correctAnswer, correctAnswerX + 2, y);

        y += lineSpacing * splitQuestion.length;

        // إضافة صفحة جديدة إذا تجاوز الجدول الصفحة
        if (y > 280) {
            doc.addPage();
            y = margin;
        }
    });

    // حفظ الملف
    doc.save(`${testType}_results.pdf`);
}


// Event listeners for test buttons
document.querySelectorAll("#test-buttons .btn-result").forEach((button) => {
    button.addEventListener("click", () => {
        const testType = button.getAttribute("data-test");
        loadTestResults(testType);
    });
});

// Toggle Dark Mode
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
