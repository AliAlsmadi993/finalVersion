// إضافة حدث النقر على كل عنصر يحتوي على الفئة "start-test"
document.querySelectorAll('.start-test').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault(); // منع السلوك الافتراضي للرابط، مثل الانتقال إلى صفحة جديدة

        const testType = card.dataset.test; // استرجاع نوع الامتحان من خاصية data-test الموجودة في العنصر
        const previousAnswers = localStorage.getItem(`answers_${testType}`); // التحقق إذا كان المستخدم قد أجاب على هذا الاختبار من قبل باستخدام التخزين المحلي

        if (previousAnswers) {
            // إذا كان المستخدم قد أجاب على هذا الاختبار مسبقًا
            const resultModal = document.getElementById("result-modal"); // العنصر الذي يمثل النافذة المنبثقة
            const modalMessage = document.getElementById("modal-message"); // العنصر الذي يحتوي على رسالة المودال
            const viewResultBtn = document.getElementById("view-result-btn"); // زر عرض النتائج في النافذة المنبثقة

            if (resultModal && modalMessage && viewResultBtn) {
                // إذا كانت العناصر المطلوبة موجودة في الصفحة
                modalMessage.textContent = `You have already taken the ${testType} test.`; // تحديث نص الرسالة لإبلاغ المستخدم أنه أكمل هذا الامتحان من قبل
                resultModal.style.display = "flex"; // إظهار النافذة المنبثقة

                viewResultBtn.onclick = () => {
                    // حدث النقر على زر عرض النتائج
                    window.location.href = `result.html?type=${testType}`; // توجيه المستخدم إلى صفحة النتائج مع تمرير نوع الامتحان في الرابط
                };
            }
        } else {
            // إذا كان المستخدم لم يجيب على هذا الامتحان مسبقًا
            localStorage.setItem('currentTest', testType); // تخزين نوع الامتحان الحالي في التخزين المحلي
            window.location.href = `test.html?type=${testType}`; // توجيه المستخدم إلى صفحة الاختبار مع تمرير نوع الامتحان في الرابط
        }
    });
});

// حدث إغلاق النافذة المنبثقة
const resultModal = document.getElementById("result-modal"); // الحصول على عنصر النافذة المنبثقة
if (resultModal) {
    resultModal.addEventListener('click', (e) => {
        if (e.target === resultModal) {
            // إذا تم النقر خارج محتوى النافذة (على الخلفية)
            resultModal.style.display = "none"; // إخفاء النافذة المنبثقة
        }
    });
}
