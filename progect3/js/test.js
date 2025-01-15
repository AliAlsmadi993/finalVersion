// -----------------------------------------------
// تعريف المتغيرات العامة
// -----------------------------------------------
let currentQuestionIndex = 0; // لتتبع السؤال الحالي
let answers = []; // لتخزين إجابات المستخدم
let timer; // لإدارة المؤقت
let remainingTime = 15 * 60; // المدة الزمنية للاختبار (15 دقيقة بالثواني)

// -----------------------------------------------
// الحصول على العناصر من DOM
// -----------------------------------------------
const questionContainer = document.getElementById("question"); // العنصر الذي سيعرض نص السؤال
const optionsContainer = document.getElementById("options"); // العنصر الذي سيحتوي على خيارات الإجابة
const nextButton = document.getElementById("next-btn"); // زر الانتقال للسؤال التالي
const timerDisplay = document.getElementById("timer"); // العنصر الذي يعرض الوقت المتبقي
const progressInfo = document.getElementById("progress-info"); // العنصر الذي يعرض تقدم المستخدم في الأسئلة
const darkModeToggle = document.getElementById("darkModeToggle"); // زر تغيير وضع الإضاءة
const testTitle = document.getElementById("test-title"); // العنصر الذي يعرض عنوان الاختبار
const submitModal = document.getElementById("submit-modal"); // نافذة النتيجة المنبثقة

// -----------------------------------------------
// تحديد نوع الاختبار والإعدادات الديناميكية
// -----------------------------------------------
// جلب نوع الاختبار من التخزين المحلي أو استخدام القيمة الافتراضية "iq"
const testType = localStorage.getItem("currentTest") || "iq";

// تحديد مسارات ملفات الأسئلة بناءً على نوع الاختبار
const testPaths = {
    iq: "data/iq.json", // مسار اختبار الذكاء
    english: "data/english.json", // مسار اختبار الإنجليزية
    technical: "data/technical.json" // مسار الاختبار التقني
};

// تحديد عناوين الاختبارات بناءً على نوعها
const testTitles = {
    iq: "IQ Test - Quiz Platform", // عنوان اختبار الذكاء
    english: "English Test - Quiz Platform", // عنوان اختبار الإنجليزية
    technical: "Technical Test - Quiz Platform" // عنوان الاختبار التقني
};

// تحديث عنوان الصفحة وعنوان الاختبار بناءً على نوع الاختبار
document.title = testTitles[testType]; // تعيين عنوان الصفحة
testTitle.textContent = testTitles[testType]; // تعيين العنوان الظاهر في واجهة المستخدم

// -----------------------------------------------
// تحميل الأسئلة من ملف JSON المناسب
// -----------------------------------------------
const questions = []; // لتخزين الأسئلة بعد تحميلها
fetch(testPaths[testType]) // تحميل الأسئلة بناءً على نوع الاختبار
    .then(response => response.json()) // تحويل النص إلى JSON
    .then(data => {
        questions.push(...data); // إضافة الأسئلة إلى المصفوفة
        displayQuestion(); // عرض أول سؤال
    })
    .catch(error => {
        console.error("Error loading questions:", error); // في حال حدوث خطأ
        alert("Failed to load questions. Please try again later."); // تنبيه المستخدم
    });

// -----------------------------------------------
// دالة عرض السؤال الحالي
// -----------------------------------------------
function displayQuestion() {
    // إذا انتهت الأسئلة، عرض نافذة الإنهاء
    if (currentQuestionIndex >= questions.length) {
        showSubmitModal(); // عرض نافذة النتيجة
        return;
    }

    // عرض نص السؤال الحالي
    const question = questions[currentQuestionIndex];
    questionContainer.textContent = question.question;

    // تحديث تقدم الاختبار
    progressInfo.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    // إعادة تعيين خيارات الإجابة
    optionsContainer.innerHTML = '';

    // إنشاء خيارات الإجابة
    question.options.forEach(option => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label class="option-btn">
                <input type="radio" name="option" class="radio-input" value="${option}">
                <span>${option}</span>
            </label>
        `;
        optionsContainer.appendChild(li); // إضافة الخيار إلى واجهة المستخدم
    });

    // تخزين الإجابة عند اختيار المستخدم
    document.querySelectorAll('.radio-input').forEach(radio => {
        radio.addEventListener('change', (e) => {
            answers[currentQuestionIndex] = e.target.value; // تخزين الإجابة
            localStorage.setItem(`answers_${testType}`, JSON.stringify(answers)); // تخزين الإجابة محليًا
            nextButton.disabled = false; // تفعيل زر التالي
        });
    });

    // تعديل نص ووظيفة زر "التالي" بناءً على السؤال الأخير
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "Submit"; // تغيير النص إلى "Submit" للسؤال الأخير
        nextButton.addEventListener('click', showSubmitModal); // إضافة وظيفة الإنهاء
    } else {
        nextButton.textContent = "Next"; // الإبقاء على النص "Next"
        nextButton.disabled = true; // تعطيل الزر حتى يتم اختيار إجابة
    }
}

// -----------------------------------------------
// دالة عرض نافذة النتيجة عند الإنهاء
// -----------------------------------------------
function showSubmitModal() {
    // حساب النتيجة
    const correctAnswers = questions.map(q => q.correctAnswer); // جلب الإجابات الصحيحة
    let score = 0; // عدد الإجابات الصحيحة
    answers.forEach((answer, index) => {
        if (answer === correctAnswers[index]) { // إذا كانت الإجابة صحيحة
            score++;
        }
    });

    // حساب النجاح أو الفشل
    const totalQuestions = questions.length;
    const passingScore = totalQuestions * 0.5; // النسبة المطلوبة للنجاح
    const isPass = score >= passingScore; // تحقق إذا كان المستخدم ناجحًا

    // إعداد نص النتيجة
    const resultText = `Your score is: ${score}/${totalQuestions}`;
    const passFailText = isPass ? "Congratulations! You passed the test." : "Sorry, you did not pass the test.";

    // عرض النافذة المنبثقة
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
    submitModal.style.display = "flex"; // إظهار النافذة
    document.body.insertAdjacentHTML('beforeend', '<div class="modal-backdrop"></div>'); 

    // إنهاء الاختبار
    const yesButton = submitModal.querySelector(".yes-btn");
    yesButton.addEventListener("click", () => {
        localStorage.setItem(`answers_${testType}`, JSON.stringify(answers)); // حفظ الإجابات
        window.location.href = `result.html?testType=${testType}`; // الانتقال إلى صفحة النتائج
    });
}

// -----------------------------------------------
// زر "التالي" للتنقل بين الأسئلة
// -----------------------------------------------
nextButton.addEventListener('click', () => {
    currentQuestionIndex++; // الانتقال للسؤال التالي
    displayQuestion(); // عرض السؤال التالي
});

// -----------------------------------------------
// دالة تشغيل المؤقت
// -----------------------------------------------
function startTimer() {
    timer = setInterval(() => {
        remainingTime--; // تقليل الوقت المتبقي
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // تحديث الوقت في الواجهة

        // إذا انتهى الوقت
        if (remainingTime <= 0) {
            clearInterval(timer); // إيقاف المؤقت
            alert('Time is up! Submitting your answers.'); // تنبيه المستخدم
            localStorage.setItem(`answers_${testType}`, JSON.stringify(answers)); // حفظ الإجابات
            window.location.href = `result.html?testType=${testType}`; // الانتقال للنتائج
        }
    }, 1000); // تحديث كل ثانية
}

startTimer(); // بدء المؤقت

// -----------------------------------------------
// تبديل وضع الإضاءة
// -----------------------------------------------
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode'); // تبديل وضع الإضاءة
    document.querySelector('.test-container').classList.toggle('dark-mode'); // تبديل الإضاءة على الحاوية
});
