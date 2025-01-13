document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // منع إرسال النموذج تلقائيًا

        // الحصول على قيم الحقول
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // إخفاء جميع رسائل الخطأ
        document.getElementById('nameError').style.display = 'none';
        document.getElementById('emailError').style.display = 'none';
        document.getElementById('subjectError').style.display = 'none';
        document.getElementById('messageError').style.display = 'none';

        // التحقق من صحة البيانات
        let isValid = true;

        if (!validateName(name)) {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }

        if (!validateEmail(email)) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }

        if (!validateSubject(subject)) {
            document.getElementById('subjectError').style.display = 'block';
            isValid = false;
        }

        if (!validateMessage(message)) {
            document.getElementById('messageError').style.display = 'block';
            isValid = false;
        }

        // إذا كانت جميع البيانات صحيحة، يتم حفظها في LocalStorage
        if (isValid) {
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };

            // حفظ البيانات في LocalStorage
            localStorage.setItem('contactFormData', JSON.stringify(formData));

            alert('Message sent successfully! Data saved to LocalStorage.'); // رسالة نجاح
            form.reset(); // إعادة تعيين النموذج
        }
    });

    // دالة للتحقق من الاسم
    function validateName(name) {
        return name.length > 0; // الاسم يجب ألا يكون فارغًا
    }

    // دالة للتحقق من البريد الإلكتروني
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email); // يجب أن يحتوي على @ ونقطة
    }

    // دالة للتحقق من الموضوع
    function validateSubject(subject) {
        return subject.length > 0; // الموضوع يجب ألا يكون فارغًا
    }

    // دالة للتحقق من الرسالة
    function validateMessage(message) {
        return message.length > 0; // الرسالة يجب ألا تكون فارغة
    }

    // استرجاع البيانات من LocalStorage عند تحميل الصفحة (اختياري)
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('name').value = formData.name;
        document.getElementById('email').value = formData.email;
        document.getElementById('subject').value = formData.subject;
        document.getElementById('message').value = formData.message;
    }
});