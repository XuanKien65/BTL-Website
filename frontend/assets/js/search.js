// Biến toàn cục
let currentView = "list";
let currentPage = 1;
const articlesPerPage = 12;
const viewOptions = document.querySelectorAll(".view-option");

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const categoryFilter = document.getElementById("category-filter");
const sortBy = document.getElementById("sort-by");
const resultsList = document.getElementById("results-list");
const resultsCount = document.getElementById("results-count");
const pagination = document.getElementById("pagination");

// Hàm khởi tạo
async function init() {
  try {
    const res = await fetch("/api/posts");
    const data = await res.json();

    if (data.success && Array.isArray(data.data.posts)) {
      filteredArticles = data.data.posts;
      renderArticles();
    } else {
      console.warn("Không lấy được bài viết.");
    }
  } catch (err) {
    console.error("❌ Lỗi khi tải bài viết từ DB:", err);
  }

  setupEventListeners();
}

document.addEventListener("DOMContentLoaded", function () {
  const categoryFilter = document.getElementById("category-filter");

  async function loadParentCategories() {
    try {
      const res = await fetch("/api/categories/");
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        // Xóa sạch các option cũ (nếu cần)
        categoryFilter.innerHTML = `<option value="">Tất cả chuyên mục</option>`;

        // Thêm từng danh mục
        data.data.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.name;
          option.textContent = cat.name;
          categoryFilter.appendChild(option);
        });
      }
    } catch (err) {
      console.error("Không thể tải danh mục:", err);
    }
  }

  loadParentCategories();
});

// Thiết lập event listeners
function setupEventListeners() {
  // Tìm kiếm
  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Bộ lọc
  categoryFilter.addEventListener("change", handleFilterChange);
  sortBy.addEventListener("change", handleFilterChange);

  // Chuyển đổi view
  viewOptions.forEach((option) => {
    option.addEventListener("click", () => {
      viewOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");
      currentView = option.dataset.view;
      resultsList.classList.toggle("grid-view", currentView === "grid");
      renderArticles();
    });
  });
}

// Xử lý tìm kiếm
function handleSearch() {
  currentPage = 1;
  handleFilterChange();
}

// Xử lý thay đổi bộ lọc
async function handleFilterChange() {
  const searchTerm = searchInput.value.trim();
  const category = categoryFilter.value;
  const sortValue = sortBy.value;

  const queryParams = new URLSearchParams();

  if (searchTerm) queryParams.append("keyword", searchTerm);
  if (category) queryParams.append("categoryName", category);
  if (sortValue) queryParams.append("sortBy", sortValue);
  queryParams.append("page", currentPage);
  queryParams.append("pageSize", articlesPerPage); // giữ phân trang

  const url = `/api/posts/search?${queryParams.toString()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.success && Array.isArray(data.data.posts)) {
      filteredArticles = data.data.posts;
      renderArticles();
    } else {
      filteredArticles = [];
      renderArticles();
    }
  } catch (err) {
    console.error("Lỗi khi tìm kiếm bài viết:", err);
    filteredArticles = [];
    renderArticles();
  }
}

function renderCategory(article) {
  const cat = article?.categories?.[0];
  if (!cat) return "Chưa phân loại";

  // Nếu là string (dạng ["Việt Nam"]), trả về trực tiếp
  if (typeof cat === "string") return cat;

  // Nếu là object thì kiểm tra có cha
  if (cat.parent) return `${cat.parent.name}`;
  return cat.name;
}

function renderSingleArticle(article) {
  const articleEl = document.createElement("div");
  articleEl.className = "article-card";
  console.log("article.categories:", article.categories);
  articleEl.innerHTML = `
    <a href="/bai-viet/${article.slug}" class="article-image">
      <img src="${article.featuredimage}" alt="${article.title}">
    </a>
    <div class="article-content">
      <span class="article-category">${renderCategory(article)}</span>
      <h3 class="article-title">${article.title}</h3>
      <p class="article-excerpt">${article.excerpt}</p>
      <a href="/bai-viet/${article.slug}">
        <div class="read-more">Đọc tiếp <span>→</span></div>
      </a>
      <div class="article-meta">
        <span>${new Date(
          article.publishedat || article.createdat
        ).toLocaleDateString("vi-VN")}</span>
        <span>${article.views.toLocaleString()} lượt xem</span>
      </div>
    </div>
  `;

  return articleEl;
}

function renderArticles() {
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  resultsList.innerHTML = "";
  resultsCount.textContent = `${filteredArticles.length} kết quả tìm thấy`;

  if (paginatedArticles.length === 0) {
    resultsList.innerHTML =
      '<p class="no-results">Không tìm thấy bài viết phù hợp.</p>';
    pagination.innerHTML = "";
    return;
  }

  paginatedArticles.forEach((article) => {
    const articleEl = renderSingleArticle(article);
    resultsList.appendChild(articleEl);
  });

  renderPagination();
}

// Hiển thị phân trang (đã cập nhật theo yêu cầu)
function renderPagination() {
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Nút Previous
  const prevBtn = document.createElement("button");
  prevBtn.className = "prev-btn";
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderArticles();
      window.scrollTo(0, 0);
    }
  });
  if (currentPage > 1) {
    pagination.appendChild(prevBtn);
  }
  // Các nút trang
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Đảm bảo luôn hiển thị đủ maxVisiblePages nút nếu có thể
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderArticles();
      window.scrollTo(0, 0);
    });
    pagination.appendChild(pageBtn);
  }

  // Nút Next
  const nextBtn = document.createElement("button");
  nextBtn.className = "next-btn";
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderArticles();
      window.scrollTo(0, 0);
    }
  });
  if (currentPage < totalPages) {
    pagination.appendChild(nextBtn);
  }
}

init();

// Xử lý advanced search panel
// document.addEventListener("DOMContentLoaded", function () {
//   const searchContainer = document.getElementById("searchContainer");
//   const searchToggle = document.getElementById("searchToggle");
//   const applyFiltersBtn = document.getElementById("applyFiltersBtn");

//   if (searchToggle) {
//     searchToggle.addEventListener("click", function () {
//       searchContainer.classList.toggle("active");
//     });
//   }

//   if (applyFiltersBtn) {
//     applyFiltersBtn.addEventListener("click", function () {
//       const selectedSort = document.querySelector(
//         'input[name="filter-type"]:checked'
//       )?.value;
//       const contentTypes = [];
//       document
//         .querySelectorAll('input[name="content-type"]:checked')
//         .forEach((checkbox) => {
//           contentTypes.push(checkbox.value);
//         });

//       const categories = [];
//       document
//         .querySelectorAll('input[name="category"]:checked')
//         .forEach((checkbox) => {
//           categories.push(checkbox.value);
//         });

//       const filters = {
//         sortBy: selectedSort,
//         contentTypes: contentTypes,
//         categories: categories,
//       };

//       if (searchContainer) {
//         searchContainer.classList.remove("active");
//       }

//       // Áp dụng bộ lọc
//       // applyFiltersToData(filters);
//     });
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  // Lấy keyword từ URL và gán vào ô input, sau đó lọc kết quả luôn
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("keyword");

  if (keyword) {
    searchInput.value = keyword; // Gán vào ô input hiện tại
    handleFilterChange(); // Lọc và render luôn các bài viết theo keyword
  }
});
