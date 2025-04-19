document.addEventListener("DOMContentLoaded", function () {
  initSlider();
});

function initSlider() {
  const slides = document.querySelectorAll(".slide");
  const pagination = document.querySelector(".pagination");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (!slides.length || !pagination || !prevBtn || !nextBtn) {
    console.error("Lỗi: Một số phần tử không tìm thấy. Kiểm tra HTML!");
    return;
  }

  let currentIndex = 0;

  // Tạo số trang động
  for (let i = 0; i < slides.length; i++) {
    let page = document.createElement("span");
    page.classList.add("page-number");
    page.textContent = i + 1;
    page.addEventListener("click", () => goToSlide(i));
    pagination.appendChild(page);
  }

  const pageNumbers = document.querySelectorAll(".page-number");

  function updateSlide() {
    document.querySelector(".slides").style.transform = `translateX(-${
      currentIndex * 100
    }%)`;
    pageNumbers.forEach((num, index) => {
      num.classList.toggle("active-page", index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlide();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  updateSlide();

  // Tự động chạy slide mỗi 3 giây
  let slideInterval = setInterval(nextSlide, 3000);

  document
    .querySelector(".slider")
    .addEventListener("mouseenter", () => clearInterval(slideInterval));

  document.querySelector(".slider").addEventListener("mouseleave", () => {
    slideInterval = setInterval(nextSlide, 3000);
  });
}

//hiện tin tức theo chủ đề
document.addEventListener("DOMContentLoaded", function () {
  const newsContainers = document.querySelectorAll(".container");

  newsContainers.forEach((container) => {
    const categoryLinks = container.querySelectorAll(".news-subject a");
    const newsItems = container.querySelectorAll(".news-home-item");

    categoryLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const selectedCategory = this.getAttribute("data-category");

        // Xóa class active khỏi tất cả link trong container hiện tại
        categoryLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active"); // Thêm màu đỏ cho mục đang chọn

        // Ẩn tất cả tin tức trong container hiện tại
        newsItems.forEach((item) => {
          const itemCategory = item.closest("a").getAttribute("data-category");
          if (itemCategory === selectedCategory) {
            item.style.display = "block"; // Hiện tin tức của chủ đề đang chọn
          } else {
            item.style.display = "none"; // Ẩn tin tức không thuộc chủ đề
          }
        });
      });
    });

    // Tự động hiển thị mục đầu tiên khi load trang trong mỗi container
    if (categoryLinks.length > 0) {
      categoryLinks[0].click();
    }
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   const categoryLinks = document.querySelectorAll(".news-subject a");
//   const newsItems = document.querySelectorAll(".news-home-item");

//   categoryLinks.forEach(link => {
//     link.addEventListener("click", function (event) {
//       event.preventDefault();
//       const selectedCategory = this.getAttribute("data-category");

//       // Xóa class active khỏi tất cả link
//       categoryLinks.forEach(l => l.classList.remove("active"));
//       this.classList.add("active"); // Thêm màu đỏ cho mục đang chọn

//       // Ẩn tất cả tin tức
//       newsItems.forEach(item => {
//         const itemCategory = item.closest("a").getAttribute("data-category");
//         if (itemCategory === selectedCategory) {
//           item.style.display = "block"; // Hiện tin tức của chủ đề đang chọn
//         } else {
//           item.style.display = "none"; // Ẩn tin tức không thuộc chủ đề
//         }
//       });
//     });
//   });

//   // Tự động hiển thị mục đầu tiên khi load trang
//   categoryLinks[0].click();
// });

// Bạn có thể thích
document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".news-slider", {
    slidesPerView: 6, // Giảm số lượng ô hiển thị để tạo khoảng cách tốt hơn
    spaceBetween: 0, // Thêm khoảng cách giữa các ô
    loop: true, // Thêm tính năng loop
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      // Thêm responsive breakpoints
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
});
