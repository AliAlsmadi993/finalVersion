// تعريف المتغيرات العامة
let currentQuestionIndex = 0; // مؤشر السؤال الحالي
let answers = []; // لتخزين إجابات المستخدم
let timer; // المؤقت
let remainingTime = 15 * 60; // 15 دقيقة بالثواني

// الحصول على العناصر من DOM
const questionContainer = document.getElementById("question"); // لعرض السؤال
const optionsContainer = document.getElementById("options"); // لعرض الخيارات
const nextButton = document.getElementById("next-btn"); // زر الانتقال للسؤال التالي
const timerDisplay = document.getElementById("timer"); // لعرض المؤقت
const progressInfo = document.getElementById("progress-info"); // لعرض تقدم الأسئلة
const darkModeToggle = document.getElementById("darkModeToggle"); // زر تغيير وضع الإضاءة
const testTitle = document.getElementById("test-title"); // عنوان الاختبار
const submitModal = document.getElementById("submit-modal"); // النافذة المنبثقة عند الإنهاء

// الحصول على نوع الاختبار من التخزين المحلي أو استخدام القيمة الافتراضية
const testType = localStorage.getItem("currentTest") || "iq";
const testPaths = {
    iq: "data/iq.json", // مسار أسئلة اختبار الذكاء
    english: "data/english.json", // مسار أسئلة اختبار الإنجليزية
    technical: "data/technical.json" // مسار أسئلة الاختبار التقني
};

const testTitles = {
    iq: "IQ Test - Quiz Platform", // عنوان اختبار الذكاء
    english: "English Test - Quiz Platform", // عنوان اختبار الإنجليزية
    technical: "Technical Test - Quiz Platform" // عنوان الاختبار التقني
};

// تعيين عنوان الصفحة وعنوان الاختبار بناءً على النوع
document.title = testTitles[testType];
testTitle.textContent = testTitles[testType];

const questions = []; // لتخزين الأسئلة

// جلب الأسئلة من الملف المناسب
fetch(testPaths[testType])
    .then(response => response.json()) // تحويل البيانات إلى JSON
    .then(data => {
        questions.push(...data); // تخزين الأسئلة في المتغير
        displayQuestion(); // عرض السؤال الأول
    })
    .catch(error => {
        console.error("Error loading questions:", error); // في حالة وجود خطأ في الجلب
        alert("Failed to load questions. Please try again later.");
    });

// دالة لعرض السؤال الحالي
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) { // إذا انتهت الأسئلة
        showSubmitModal(); // عرض النافذة المنبثقة
        return;
    }

    const question = questions[currentQuestionIndex]; // السؤال الحالي
    questionContainer.textContent = question.question; // عرض نص السؤال
    progressInfo.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`; // عرض تقدم الأسئلة
    optionsContainer.innerHTML = ''; // إعادة تعيين الخيارات

    // إنشاء خيارات السؤال
    question.options.forEach((option) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label class="option-btn">
                <input type="radio" name="option" class="radio-input" value="${option}">
                <span>${option}</span>
            </label>
        `;
        optionsContainer.appendChild(li); // إضافة الخيار إلى القائمة
    });

    // مراقبة تغيير الخيارات
    document.querySelectorAll('.radio-input').forEach(radio => {
        radio.addEventListener('change', (e) => {
            answers[currentQuestionIndex] = e.target.value; // حفظ الإجابة
            localStorage.setItem(`answers_${testType}`, JSON.stringify(answers)); // تخزين الإجابة محليًا
            nextButton.disabled = false; // تفعيل زر التالي
        });
    });

    // تعديل زر التالي بناءً على السؤال الأخير
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "Submit"; // إذا كان السؤال الأخير
        nextButton.addEventListener('click', showSubmitModal); // إضافة حدث الإنهاء
    } else {
        nextButton.textContent = "Next";
        nextButton.disabled = true; // تعطيل الزر حتى يتم اختيار إجابة
    }
}

// دالة لعرض النافذة المنبثقة عند الإنهاء
function showSubmitModal() {
    // حساب النتيجة
    const correctAnswers = questions.map(q => q.correctAnswer); // استخراج الإجابات الصحيحة
    let score = 0; // مجموع الإجابات الصحيحة

    answers.forEach((answer, index) => {
        if (answer === correctAnswers[index]) { // مقارنة الإجابة
            score++;
        }
    });

    const totalQuestions = questions.length; // عدد الأسئلة الإجمالي
    const passingScore = Math.ceil(totalQuestions * 0.6); // درجة النجاح 60%
    const isPass = score >= passingScore; // تحقق إذا كان ناجحًا

    const resultText = `Your score is: ${score}/${totalQuestions}`; // نص النتيجة
    const passFailText = isPass ? "Congratulations! You passed the test." : "Sorry, you did not pass the test. Better luck next time!"; // نص الرسالة

    // تحديث محتوى النافذة المنبثقة
    submitModal.innerHTML = `
        <div class="modal-content">
            <h3>Test Result</h3>
            <p>${resultText}</p>
            <p>${passFailText}</p>
            <div class="modal-actions">
                <button class="yes-btn">Finish</button>
            </div>
        </div>
    `;
    submitModal.style.display = "flex"; // عرض النافذة
    document.body.insertAdjacentHTML('beforeend', '<div class="modal-backdrop"></div>');

    // إضافة حدث زر الإنهاء
    const yesButton = submitModal.querySelector(".yes-btn");
    yesButton.addEventListener("click", () => {
        localStorage.setItem(`answers_${testType}`, JSON.stringify(answers)); // حفظ الإجابات
        window.location.href = `result.html?testType=${testType}`; // الانتقال إلى صفحة النتائج
    });
}

// حدث زر التالي
nextButton.addEventListener('click', () => {
    currentQuestionIndex++; // الانتقال للسؤال التالي
    displayQuestion(); // عرض السؤال
});

// دالة تشغيل المؤقت
function startTimer() {
    timer = setInterval(() => {
        remainingTime--; // تقليل الوقت
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // تحديث عرض الوقت

        if (remainingTime <= 0) { // إذا انتهى الوقت
            clearInterval(timer);
            alert('Time is up! Submitting your answers.'); // تنبيه بانتهاء الوقت
            localStorage.setItem(`answers_${testType}`, JSON.stringify(answers)); // حفظ الإجابات
            window.location.href = `result.html?testType=${testType}`; // الانتقال للنتائج
        }
    }, 1000); // تحديث كل ثانية
}

startTimer(); // بدء المؤقت

// حدث تغيير وضع الإضاءة
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode'); // تبديل وضع الإضاءة
    document.querySelector('.test-container').classList.toggle('dark-mode');
});
