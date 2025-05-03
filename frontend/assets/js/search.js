// Biến toàn cục
let currentView = "list";
let totalPages = 1;
let currentPage = 1;
const articlesPerPage = 10;
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
      renderArticles(articles, pages, totalItems);
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
      renderArticles(currentArticles, totalPages, currentTotalItems);
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
  queryParams.append("pageSize", articlesPerPage);

  const url = `/api/posts/search?${queryParams.toString()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.success && Array.isArray(data.data.posts)) {
      const articles = data.data.posts;
      const pages = data.data.pagination?.totalPages || 1;
      const totalItems = data.data.pagination?.total ?? articles.length;

      console.log("✅ Tổng bài viết:", totalItems);
      renderArticles(articles, pages, totalItems);
    } else {
      renderArticles([], 1, 0);
    }
  } catch (err) {
    console.error("Lỗi khi tìm kiếm bài viết:", err);
    renderArticles([], 1, 0);
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
    <a href="/pages/trangbaiviet.html?slug=${
      article.slug
    }" class="article-image">
      <img src="${article.featuredimage}" alt="${article.title}">
    </a>
    <div class="article-content">
      <span class="article-category">${renderCategory(article)}</span>

      <!-- Tiêu đề là thẻ a -->
      <h3 class="article-title">
        <a href="/pages/trangbaiviet.html?slug=${article.slug}">
          ${article.title}
        </a>
      </h3>

      <p class="article-excerpt">${article.excerpt}</p>

      <a href="/pages/trangbaiviet.html?slug=${article.slug}">
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

function renderArticles(articles, pages, totalItems = 0) {
  resultsList.innerHTML = "";
  resultsList.classList.remove("grid-view", "list-view");
  resultsList.classList.add(`${currentView}-view`);

  const totalDisplay =
    typeof totalItems === "number" && !isNaN(totalItems) ? totalItems : 0;
  resultsCount.textContent = `${totalDisplay} bài viết được tìm thấy`;

  if (!Array.isArray(articles) || articles.length === 0) {
    resultsList.innerHTML =
      '<p class="no-results">Không tìm thấy bài viết phù hợp.</p>';
    pagination.innerHTML = "";
    return;
  }

  articles.forEach((article) => {
    const articleEl = renderSingleArticle(article);
    resultsList.appendChild(articleEl);
  });

  renderPagination(pages);
}

// Hiển thị phân trang (đã cập nhật theo yêu cầu)
function renderPagination(pages) {
  pagination.innerHTML = "";

  if (pages <= 1) return;

  // dùng `pages` thay cho `totalPages` cũ
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(pages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "prev-btn";
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage--;
      handleFilterChange();
      window.scrollTo(0, 0);
    });
    pagination.appendChild(prevBtn);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      handleFilterChange();
      window.scrollTo(0, 0);
    });
    pagination.appendChild(pageBtn);
  }

  if (currentPage < pages) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "next-btn";
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage++;
      handleFilterChange();
      window.scrollTo(0, 0);
    });
    pagination.appendChild(nextBtn);
  }
}

init();

document.addEventListener("DOMContentLoaded", function () {
  // Lấy keyword từ URL và gán vào ô input, sau đó lọc kết quả luôn
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("keyword");

  if (keyword) {
    searchInput.value = keyword; // Gán vào ô input hiện tại
    handleFilterChange(); // Lọc và render luôn các bài viết theo keyword
  }
});
