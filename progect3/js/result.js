// -----------------------------------------------
// تعريف المتغيرات الرئيسية
// -----------------------------------------------
const darkModeToggle = document.getElementById("darkModeToggle"); // زر تبديل الوضع الداكن
const resultMessage = document.getElementById("result-message"); // رسالة النتيجة (نجاح/فشل)
const scoreElement = document.getElementById("score"); // عرض النتيجة الإجمالية
const showAnswersButton = document.getElementById("show-answers"); // زر عرض الإجابات التفصيلية
const answersTable = document.getElementById("answers-table").querySelector("tbody"); // جدول عرض الإجابات

// -----------------------------------------------
// دالة تحميل وعرض نتائج الاختبار
// -----------------------------------------------
function loadTestResults(testType) {
    // تحديد مسارات ملفات JSON الخاصة بالاختبارات
    const testFiles = {
        iq: "data/iq.json", // اختبار الذكاء
        english: "data/english.json", // اختبار الإنجليزية
        technical: "data/technical.json", // الاختبار التقني
    };

    // جلب بيانات الإجابات الصحيحة من الملف المناسب
    fetch(testFiles[testType])
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load test data"); // إذا حدث خطأ في تحميل البيانات
            }
            return response.json(); // تحويل البيانات إلى JSON
        })
        .then((correctAnswers) => {
            // إعادة تهيئة الجدول والرسائل
            answersTable.innerHTML = ""; // تفريغ الجدول
            resultMessage.textContent = ""; // مسح رسالة النتيجة
            showAnswersButton.style.display = "none"; // إخفاء زر عرض الإجابات
            answersTable.parentElement.style.display = "none"; // إخفاء الجدول

            // جلب إجابات المستخدم من LocalStorage
            const answers = JSON.parse(localStorage.getItem(`answers_${testType}`));

            // التحقق إذا لم يُكمل المستخدم الاختبار
            if (!answers || answers.length === 0) {
                resultMessage.textContent = "You have not taken this test yet.";
                resultMessage.className = "score warning"; // إضافة تنسيق تحذيري
                scoreElement.textContent = ""; // مسح النتيجة
                return; // إنهاء الدالة
            }

            // -----------------------------------------------
            // حساب نتيجة المستخدم
            // -----------------------------------------------
            let score = 0; // متغير لتخزين عدد الإجابات الصحيحة
            correctAnswers.forEach((item, index) => {
                if (answers[index] === item.correctAnswer) {
                    score++;
                }
            });

            // عرض النتيجة الإجمالية
            scoreElement.textContent = `Score: ${score}/${correctAnswers.length}`;

            // عرض رسالة النجاح أو الفشل بناءً على النتيجة
            if (score >= 5) {
                resultMessage.textContent = "Congratulations! You passed the test.";
                resultMessage.className = "score success"; // تنسيق النجاح
            } else {
                resultMessage.textContent = "Unfortunately, you did not pass.";
                resultMessage.className = "score failure"; // تنسيق الفشل
            }

            // -----------------------------------------------
            // إعداد زر عرض الإجابات التفصيلية
            // -----------------------------------------------
            showAnswersButton.style.display = "block"; // إظهار الزر
            showAnswersButton.onclick = () => {
                answersTable.parentElement.style.display = "table"; // إظهار الجدول
                correctAnswers.forEach((item, index) => {
                    // إضافة صفوف الجدول لكل سؤال
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.question}</td>
                        <td class="${
                            answers[index] === item.correctAnswer ? "correct" : "incorrect"
                        }">${answers[index] || "Not Answered"}</td>
                        <td>${item.correctAnswer}</td>
                    `;
                    answersTable.appendChild(row); // إضافة الصف إلى الجدول
                });

                // استدعاء دالة توليد PDF
                generatePDF(testType, score, correctAnswers, answers);

                // إخفاء زر عرض الإجابات بعد الضغط
                showAnswersButton.style.display = "none";
            };
        })
        .catch((error) => {
            console.error("Error loading test data:", error); // عرض الخطأ في وحدة التحكم
            resultMessage.textContent = "Failed to load test data. Please try again."; // رسالة خطأ
        });
}

// -----------------------------------------------
// دالة توليد ملف PDF
// -----------------------------------------------
function generatePDF(testType, score, correctAnswers, answers) {
    const { jsPDF } = window.jspdf; // استيراد مكتبة jsPDF
    const doc = new jsPDF(); // إنشاء مستند PDF جديد

    // -----------------------------------------------
    // جلب بيانات المستخدم من LocalStorage
    // -----------------------------------------------
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let userName = "Unknown User";
    let userEmail = "No Email Provided";

    if (users.length > 0) {
        // استخراج بيانات آخر مستخدم
        const latestUser = users[users.length - 1];
        userName = latestUser.name || userName;
        userEmail = latestUser.email || userEmail;
    }

    // -----------------------------------------------
    // إعداد التقرير
    // -----------------------------------------------
    const margin = 15; // الهوامش
    const lineSpacing = 12; // المسافة بين الأسطر
    let currentY = margin; // موضع الكتابة الحالي

    // إضافة العنوان والمعلومات
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text("CodCom ", margin, currentY);
    currentY += lineSpacing * 2;

    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text(`Name: ${userName}`, margin, currentY);
    currentY += lineSpacing;
    doc.text(`Email: ${userEmail}`, margin, currentY);
    currentY += lineSpacing;
    doc.text(`Test Type: ${testType.charAt(0).toUpperCase() + testType.slice(1)}`, margin, currentY);
    currentY += lineSpacing;
    doc.text(`Score: ${score}/${correctAnswers.length}`, margin, currentY);
    currentY += lineSpacing * 1.5;

    // -----------------------------------------------
    // إضافة جدول النتائج التفصيلية
    // -----------------------------------------------
    const tableStartY = currentY;
    const columnWidths = [90, 50, 50]; // عرض الأعمدة
    const headers = ["Question", "Your Answer", "Correct Answer"];

    // رسم الرأس
    doc.setFillColor(0, 0, 255);
    doc.rect(margin, tableStartY - 10, 190, 10, "F");
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

        if (index % 2 === 0) {
            doc.setFillColor(240, 240, 255);
            doc.rect(margin, y - 6, 190, 10, "F");
        }

        doc.setTextColor(0, 0, 0);
        const questionText = `${index + 1}. ${item.question}`;
        doc.text(questionText, margin + 2, y);

        doc.setTextColor(isCorrect ? 0 : 255, isCorrect ? 102 : 0, isCorrect ? 0 : 0);
        const userAnswerX = margin + columnWidths[0];
        doc.text(userAnswer, userAnswerX + 2, y);

        const correctAnswerX = userAnswerX + columnWidths[1];
        doc.text(item.correctAnswer, correctAnswerX + 2, y);

        y += lineSpacing;

        if (y > 280) {
            doc.addPage();
            y = margin;
        }
    });

    // حفظ ملف PDF
    doc.save(`${testType}_results.pdf`);
}

// -----------------------------------------------
// التفاعل مع أزرار النتائج
// -----------------------------------------------
document.querySelectorAll("#test-buttons .btn-result").forEach((button) => {
    button.addEventListener("click", () => {
        const testType = button.getAttribute("data-test");
        loadTestResults(testType);
    });
});

// -----------------------------------------------
// تبديل الوضع الداكن
// -----------------------------------------------
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode"); // تبديل الوضع
});




// // -----------------------------------------------
// // دالة توليد ملف PDF باستخدام jsPDF و AutoTable
// // -----------------------------------------------
// function generatePDF(testType, score, correctAnswers, answers) {
//     const { jsPDF } = window.jspdf; // استيراد مكتبة jsPDF
//     const doc = new jsPDF(); // إنشاء مستند PDF جديد

//     // -----------------------------------------------
//     // جلب بيانات المستخدم من LocalStorage
//     // -----------------------------------------------
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     let userName = "Unknown User";
//     let userEmail = "No Email Provided";

//     if (users.length > 0) {
//         // استخراج بيانات آخر مستخدم
//         const latestUser = users[users.length - 1];
//         userName = latestUser.name || userName;
//         userEmail = latestUser.email || userEmail;
//     }

//     // -----------------------------------------------
//     // إعداد التقرير
//     // -----------------------------------------------
//     const margin = 15; // الهوامش
//     let currentY = margin; // موضع الكتابة الحالي

//     // إضافة العنوان والمعلومات
//     doc.setFontSize(22);
//     doc.setTextColor(0, 102, 204);
//     doc.text("Test Results", margin, currentY);
//     currentY += 15;

//     doc.setFontSize(16);
//     doc.setTextColor(51, 51, 51);
//     doc.text(`Name: ${userName}`, margin, currentY);
//     currentY += 10;
//     doc.text(`Email: ${userEmail}`, margin, currentY);
//     currentY += 10;
//     doc.text(`Test Type: ${testType}`, margin, currentY);
//     currentY += 10;
//     doc.text(`Score: ${score}/${correctAnswers.length}`, margin, currentY);
//     currentY += 15;

//     // -----------------------------------------------
//     // إضافة جدول النتائج التفصيلية باستخدام AutoTable
//     // -----------------------------------------------
//     const tableData = correctAnswers.map((item, index) => ({
//         Question: item.question,
//         "Your Answer": answers[index] || "Not Answered",
//         "Correct Answer": item.correctAnswer,
//     }));

//     doc.autoTable({
//         startY: currentY, // بداية الجدول
//         head: [['Question', 'Your Answer', 'Correct Answer']], // رأس الجدول
//         body: tableData.map(row => [row.Question, row["Your Answer"], row["Correct Answer"]]),
//         theme: 'grid', // نمط الجدول
//     });

//     // -----------------------------------------------
//     // حفظ ملف PDF
//     // -----------------------------------------------
//     doc.save(`${testType}_results.pdf`);
// }
