// document.addEventListener('DOMContentLoaded', () => {
//     let currentSlide = 0;
//     const slides = document.querySelectorAll('.slide');
//     const totalSlides = slides.length;

//     if (totalSlides === 0) {
//         console.error('No slides found. Ensure all slides have the class "slide".');
//         return;
//     }

//     function showSlide(index) {
//         slides.forEach((slide, i) => {
//             slide.classList.toggle('active', i === index);
//         });
//     }

//     function nextSlide() {
//         currentSlide = (currentSlide + 1) % totalSlides;
//         showSlide(currentSlide);
//     }

//     function prevSlide() {
//         currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
//         showSlide(currentSlide);
//     }

//     // أزرار التنقل
//     document.querySelector('.next').addEventListener('click', nextSlide);
//     document.querySelector('.prev').addEventListener('click', prevSlide);

//     // بدء السلايدر
//     showSlide(currentSlide);

//     // التبديل التلقائي
//     let autoSlideInterval = setInterval(nextSlide, 5000);

//     // الإيقاف عند تمرير الماوس
//     const sliderContainer = document.querySelector('.slider-container');
//     sliderContainer.addEventListener('mouseenter', () => {
//         clearInterval(autoSlideInterval);
//     });

//     sliderContainer.addEventListener('mouseleave', () => {
//         autoSlideInterval = setInterval(nextSlide, 5000);
//     });
// });
let nextBtn = document.querySelector('.next')
let prevBtn = document.querySelector('.prev')

let slider = document.querySelector('.slider')
let sliderList = slider.querySelector('.slider .list')
let thumbnail = document.querySelector('.slider .thumbnail')
let thumbnailItems = thumbnail.querySelectorAll('.item')

thumbnail.appendChild(thumbnailItems[0])

// Function for next button 
nextBtn.onclick = function() {
    moveSlider('next')
}


// Function for prev button 
prevBtn.onclick = function() {
    moveSlider('prev')
}


function moveSlider(direction) {
    let sliderItems = sliderList.querySelectorAll('.item')
    let thumbnailItems = document.querySelectorAll('.thumbnail .item')
    
    if(direction === 'next'){
        sliderList.appendChild(sliderItems[0])
        thumbnail.appendChild(thumbnailItems[0])
        slider.classList.add('next')
    } else {
        sliderList.prepend(sliderItems[sliderItems.length - 1])
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1])
        slider.classList.add('prev')
    }


    slider.addEventListener('animationend', function() {
        if(direction === 'next'){
            slider.classList.remove('next')
        } else {
            slider.classList.remove('prev')
        }
    }, {once: true}) // Remove the event listener after it's triggered once
}
