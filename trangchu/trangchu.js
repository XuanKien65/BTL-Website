let currentIndex = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function updateSlider() {
    const slider = document.querySelector(".slides");
    slider.style.transform = `translateX(${-currentIndex * 100}%)`;

    // Cập nhật chấm tròn
    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");
}

function moveSlide(step) {
    currentIndex += step;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    updateSlider();
}

function currentSlide(index) {
    currentIndex = index - 1;
    updateSlider();
}

// Tự động chuyển slide mỗi 5 giây
setInterval(() => moveSlide(1), 5000);

// Hiển thị slide đầu tiên
updateSlider();
