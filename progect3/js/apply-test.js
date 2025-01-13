document.querySelectorAll('.start-test').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault(); // منع السلوك الافتراضي للرابط
        const testType = card.dataset.test; // استرجاع نوع الامتحان من خاصية data-test
        const previousAnswers = localStorage.getItem(`answers_${testType}`); // التحقق إذا كان المستخدم قد قدم الامتحان مسبقًا

        if (previousAnswers) {
            // إذا كان المستخدم قد قدم الامتحان
            const resultModal = document.getElementById("result-modal");
            const modalMessage = document.getElementById("modal-message");
            const viewResultBtn = document.getElementById("view-result-btn");

            if (resultModal && modalMessage && viewResultBtn) {
                modalMessage.textContent = `You have already taken the ${testType} test.`; // عرض رسالة في المودال
                resultModal.style.display = "flex";
                viewResultBtn.onclick = () => {
                    window.location.href = `result.html?type=${testType}`; // إرسال المستخدم إلى صفحة النتائج
                };
            }
        } else {
            // إذا كان المستخدم لم يقدم الامتحان
            localStorage.setItem('currentTest', testType); // تخزين نوع الامتحان في التخزين المحلي
            window.location.href = `test.html?type=${testType}`; // إرسال المستخدم إلى صفحة الامتحان المحددة
        }
    });
});

// Close Modal
const resultModal = document.getElementById("result-modal");
if (resultModal) {
    resultModal.addEventListener('click', (e) => {
        if (e.target === resultModal) {
            resultModal.style.display = "none"; // إخفاء المودال عند النقر خارجه
        }
    });
}
