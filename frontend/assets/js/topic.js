// ================= HIỂN THỊ DANH SÁCH BÀI VIẾT VỚI PHÂN TRANG =================
let articles = []; 
let currentPage = 1;
const articlesPerPage = 10;
let totalPages = 1;


function displayArticles() {
  const list = document.getElementById("articles-list");
  const trend = document.getElementById("articles-trend");

  list.innerHTML = "";
  trend.style.display = currentPage === 1 ? "flex" : "none";

  const start = (currentPage - 1) * articlesPerPage;
  const end = start + articlesPerPage;

  articles.slice(start, end).forEach((article) => {
    const articleItem = document.createElement("li");
    articleItem.classList.add("one-article");
    articleItem.innerHTML = `
      <a href="#" class="article-image">
        <img src="${article.img}" alt="">
      </a>
      <a href="#" class="article-title">
        <h3>${article.title}</h3>
        <div class="article-desc">
          <p>${article.desc}</p>
        </div>
        <div class="ar-cmt2">
          <div class="ar-time">
            <span class="ar-item"><span>${article.date}</span></span>
            <span class="ar-item"><span>${article.time}</span></span>
          </div>
        </div>
      </a>
    `;
    list.appendChild(articleItem);
  });

  updatePagination();
}

function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.className = "prev-btn";
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) changePage(e, currentPage - 1);
  });
  if (currentPage > 1) pagination.appendChild(prevBtn);

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      changePage(e, i);
    });
    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "next-btn";
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) changePage(e, currentPage + 1);
  });
  if (currentPage < totalPages) pagination.appendChild(nextBtn);
}

function changePage(event, page) {
  event.preventDefault();
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    displayArticles();
    window.scrollTo(0, 0);
  }
}

document.addEventListener("DOMContentLoaded", displayArticles);

// ================= SLIDER (BẠN CÓ THỂ THÍCH) =================
document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".news-slider", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 10 },
      640: { slidesPerView: 2, spaceBetween: 15 },
      768: { slidesPerView: 3, spaceBetween: 15 },
      1024: { slidesPerView: 4, spaceBetween: 20 },
    },
  });
});

// ================= CHUYÊN MỤC CHA VÀ CON (dựa trên categoryName từ URL) =================
async function loadCategoryBlock() {
  const params = new URLSearchParams(window.location.search);
  const categoryName = params.get("categoryName");
  console.log("👉 categoryName từ URL:", categoryName);

  if (!categoryName) return;

  try {
    const res = await fetch("/api/categories/");
    const data = await res.json();
    console.log("👉 Dữ liệu trả về từ API:", data);

    // Tìm danh mục cha theo tên hoặc theo children
    let parentCategory = data.data.find(
      (cat) => cat.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
    );  

    if (!parentCategory) {
  // Nếu không khớp tên cha, tìm trong children
      parentCategory = data.data.find((cat) =>
        (cat.children || []).some(
          (child) => child.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
    )
  );
}

    const { name, children } = parentCategory;

    const titleContainer = document.querySelector(".title");
    console.log("👉 Có tìm được .title?", titleContainer);
    if (!titleContainer) return;

    const headerHTML = `
      <div class="title-header">
        <h1>${name}</h1>
      </div>
    `;

    const listItemsHTML = (children || [])
    .map((child) => {
    const isActive =
      child.name.trim().toLowerCase() === categoryName.trim().toLowerCase();

    return `
      <li class="single">
        <a href="/pages/topic.html?categoryName=${encodeURIComponent(child.name)}" 
           class="page ${isActive ? "active" : ""}">
          <h1>${child.name}</h1>
        </a>
      </li>`;
  })
  .join("");

    const listHTML = `<ul class="list-topic">${listItemsHTML}</ul>`;
    titleContainer.innerHTML = headerHTML + listHTML;

    const currentCategory = categoryName.trim().toLowerCase();
    const topicLinks = document.querySelectorAll(".list-topic .page");

    topicLinks.forEach((link) => {
      const url = new URL(link.href);
      const linkCat = url.searchParams.get("categoryName")?.trim().toLowerCase();

      if (linkCat === currentCategory) {
        link.classList.add("active");
    }
  });


  } catch (err) {
    console.error("❌ Lỗi khi tải danh mục:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadCategoryBlock);


