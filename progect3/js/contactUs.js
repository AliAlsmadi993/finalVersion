// -----------------------------------------------
// جزء تغيير الشرائح (Slider)
// -----------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".slider-slide"); // جلب جميع الشرائح
    let currentIndex = 0; // تتبع الشريحة الحالية

    function showNextSlide() {
        slides[currentIndex].classList.remove("active"); // إزالة الفئة "active" من الشريحة الحالية
        currentIndex = (currentIndex + 1) % slides.length; // الانتقال إلى الشريحة التالية مع الالتفاف في نهاية الشرائح
        slides[currentIndex].classList.add("active"); // إضافة الفئة "active" للشريحة الجديدة
    }

    // تغيير الشرائح تلقائيًا كل 5 ثوانٍ
    setInterval(showNextSlide, 5000);
});

// -----------------------------------------------
// جزء نموذج التواصل (Contact Form)
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm'); // استرجاع عنصر النموذج

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // منع إرسال النموذج تلقائيًا (منع إعادة تحميل الصفحة)

        // جلب قيم الحقول من النموذج
        const name = document.getElementById('name').value.trim(); // حقل الاسم
        const email = document.getElementById('email').value.trim(); // حقل البريد الإلكتروني
        const subject = document.getElementById('subject').value.trim(); // حقل الموضوع
        const message = document.getElementById('message').value.trim(); // حقل الرسالة

        // إخفاء رسائل الخطأ لجميع الحقول قبل التحقق
        document.getElementById('nameError').style.display = 'none';
        document.getElementById('emailError').style.display = 'none';
        document.getElementById('subjectError').style.display = 'none';
        document.getElementById('messageError').style.display = 'none';

        // التحقق من صحة البيانات
        let isValid = true; // متغير لتحديد صلاحية البيانات

        if (!validateName(name)) {
            document.getElementById('nameError').style.display = 'block'; // عرض رسالة خطأ للاسم
            isValid = false;
        }

        if (!validateEmail(email)) {
            document.getElementById('emailError').style.display = 'block'; // عرض رسالة خطأ للبريد الإلكتروني
            isValid = false;
        }

        if (!validateSubject(subject)) {
            document.getElementById('subjectError').style.display = 'block'; // عرض رسالة خطأ للموضوع
            isValid = false;
        }

        if (!validateMessage(message)) {
            document.getElementById('messageError').style.display = 'block'; // عرض رسالة خطأ للرسالة
            isValid = false;
        }

        // إذا كانت البيانات صحيحة، يتم تخزينها في LocalStorage
        if (isValid) {
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };

            // استرجاع البيانات المخزنة مسبقًا من LocalStorage
            let savedData = JSON.parse(localStorage.getItem('contactFormData')) || [];

            // إضافة البيانات الجديدة إلى القائمة
            savedData.push(formData);

            // تخزين القائمة المحدثة في LocalStorage
            localStorage.setItem('contactFormData', JSON.stringify(savedData));

            alert('Message sent successfully! Data saved to LocalStorage.'); // رسالة نجاح
            form.reset(); // إعادة تعيين النموذج
        }
    });

    // -----------------------------------------------
    // دوال التحقق من صحة البيانات
    // -----------------------------------------------

    // التحقق من صحة الاسم
    function validateName(name) {
        return name.length > 0; // يجب أن لا يكون الاسم فارغًا
    }

    // التحقق من صحة البريد الإلكتروني
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // النمط الصحيح للبريد الإلكتروني
        return emailPattern.test(email);
    }

    // التحقق من صحة الموضوع
    function validateSubject(subject) {
        return subject.length > 0; // الموضوع يجب ألا يكون فارغًا
    }

    // التحقق من صحة الرسالة
    function validateMessage(message) {
        return message.length > 0; // الرسالة يجب ألا تكون فارغة
    }

    // -----------------------------------------------
    // استرجاع البيانات من LocalStorage عند تحميل الصفحة (اختياري)
    // -----------------------------------------------
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
        const formData = JSON.parse(savedData).pop(); // استرجاع آخر رسالة مخزنة
        document.getElementById('name').value = formData.name; // ملء حقل الاسم
        document.getElementById('email').value = formData.email; // ملء حقل البريد الإلكتروني
        document.getElementById('subject').value = formData.subject; // ملء حقل الموضوع
        document.getElementById('message').value = formData.message; // ملء حقل الرسالة
    }
});
