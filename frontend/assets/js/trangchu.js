//hiện tin tức theo chủ đề
document.addEventListener("DOMContentLoaded", function () {
  initSlider();
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

//Giới hạn chỉ có 2 dòng tin tức theo chủ đề
