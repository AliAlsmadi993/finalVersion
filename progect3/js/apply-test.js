// -----------------------------------------------
// إضافة أحداث النقر لعناصر الاختبار
// -----------------------------------------------
document.querySelectorAll('.start-test').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault(); // منع السلوك الافتراضي للنقر

        const testType = card.dataset.test; // استرجاع نوع الامتحان من data-test
        const previousAnswers = localStorage.getItem(`answers_${testType}`); // التحقق من وجود إجابات سابقة

        if (previousAnswers) {
            // -----------------------------------------------
            // إذا كان المستخدم قد أجاب على الاختبار مسبقًا
            // -----------------------------------------------
            const resultModal = document.getElementById("result-modal"); // جلب النافذة المنبثقة
            const modalMessage = document.getElementById("modal-message"); // رسالة النافذة
            const viewResultBtn = document.getElementById("view-result-btn"); // زر عرض النتائج

            if (resultModal && modalMessage && viewResultBtn) {
                modalMessage.textContent = `You have already taken the ${testType} test.`; // تحديث الرسالة
                resultModal.style.display = "flex"; // إظهار النافذة المنبثقة

                // حدث النقر على زر عرض النتائج
                viewResultBtn.onclick = () => {
                    window.location.href = `result.html?type=${testType}`; // التوجيه إلى صفحة النتائج
                };
            }
        } else {
            // -----------------------------------------------
            // إذا لم يُكمل المستخدم الاختبار
            // -----------------------------------------------
            localStorage.setItem('currentTest', testType); // تخزين نوع الاختبار
            window.location.href = `test.html?type=${testType}`; // التوجيه إلى صفحة الاختبار
        }
    });
});

// -----------------------------------------------
// حدث إغلاق النافذة المنبثقة
// -----------------------------------------------
const resultModal = document.getElementById("result-modal"); // جلب النافذة المنبثقة
if (resultModal) {
    resultModal.addEventListener('click', (e) => {
        if (e.target === resultModal) {
            resultModal.style.display = "none"; // إخفاء النافذة عند النقر خارج المحتوى
        }
    });
}

