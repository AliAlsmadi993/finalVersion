// -----------------------------------------------
// تعريف المتغيرات الرئيسية
// -----------------------------------------------
let nextBtn = document.querySelector('.next'); // زر "التالي"
let prevBtn = document.querySelector('.prev'); // زر "السابق"

let slider = document.querySelector('.slider'); // العنصر الرئيسي لشريط الصور
let sliderList = slider.querySelector('.slider .list'); // قائمة الصور الرئيسية داخل الشريط
let thumbnail = document.querySelector('.slider .thumbnail'); // قائمة الصور المصغرة
let thumbnailItems = thumbnail.querySelectorAll('.item'); // جميع العناصر (الصور المصغرة) داخل قائمة المصغرات

// نقل العنصر الأول من قائمة الصور المصغرة إلى نهاية القائمة
thumbnail.appendChild(thumbnailItems[0]); // يضمن التمرير الدائري للصور المصغرة

// -----------------------------------------------
// إضافة أحداث النقر على أزرار "التالي" و"السابق"
// -----------------------------------------------

// زر "التالي"
nextBtn.onclick = function() {
    moveSlider('next'); // استدعاء دالة تحريك الشريط بالاتجاه "التالي"
};

// زر "السابق"
prevBtn.onclick = function() {
    moveSlider('prev'); // استدعاء دالة تحريك الشريط بالاتجاه "السابق"
};

// -----------------------------------------------
// دالة تحريك الشريط
// -----------------------------------------------
function moveSlider(direction) {
    let sliderItems = sliderList.querySelectorAll('.item'); // تحديث قائمة الصور الرئيسية داخل الشريط
    let thumbnailItems = document.querySelectorAll('.thumbnail .item'); // تحديث قائمة الصور المصغرة

    // -----------------------------------------------
    // تحديد اتجاه التحريك
    // -----------------------------------------------
    if (direction === 'next') {
        // إذا كان الاتجاه "التالي":
        sliderList.appendChild(sliderItems[0]); // نقل العنصر الأول في الشريط الرئيسي إلى النهاية
        thumbnail.appendChild(thumbnailItems[0]); // نقل العنصر الأول في الصور المصغرة إلى النهاية
        slider.classList.add('next'); // إضافة تأثير الحركة باتجاه "التالي"
    } else {
        // إذا كان الاتجاه "السابق":
        sliderList.prepend(sliderItems[sliderItems.length - 1]); // نقل العنصر الأخير في الشريط الرئيسي إلى البداية
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]); // نقل العنصر الأخير في الصور المصغرة إلى البداية
        slider.classList.add('prev'); // إضافة تأثير الحركة باتجاه "السابق"
    }

    // -----------------------------------------------
    // إزالة تأثير الحركة بعد اكتمال الرسوم المتحركة
    // -----------------------------------------------
    slider.addEventListener(
        'animationend',
        function() {
            // عند انتهاء الرسوم المتحركة
            if (direction === 'next') {
                slider.classList.remove('next'); // إزالة تأثير "التالي"
            } else {
                slider.classList.remove('prev'); // إزالة تأثير "السابق"
            }
        },
        { once: true } // إزالة الحدث تلقائيًا بعد تشغيله مرة واحدة
    );
}
