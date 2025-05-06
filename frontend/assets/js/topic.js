let articles = [];
let currentPage = 1;
const articlesPerPage = 10;
let totalPages = 1;
let currentCategoryName = "";
let topArticleId = null;


// ================= HIỂN THỊ DANH SÁCH BÀI VIẾT =================

async function loadArticlesAndTopPopular(page = 1) {
  const params = new URLSearchParams(window.location.search);
  const categoryName = params.get("categoryName");
  if (!categoryName) return;

  currentCategoryName = categoryName;
  currentPage = page;

  try {
    const query = new URLSearchParams({
      categoryName,
      sortBy: "newest",
      page,
      pageSize: articlesPerPage
    });

    const res = await fetch(`/api/posts/search/?${query.toString()}`);
    const result = await res.json();

    if (!result.success) {
      console.error("Không thể lấy bài viết:", result.message);
      return;
    }

    const allPosts = result.data.posts || [];

    if (!allPosts.length) {
      articles = [];
      totalPages = 1;
      renderPopularArticle(null); // xóa nếu không có bài
      displayArticles();
      return;
    }

    // ✅ Tìm bài có views cao nhất trong trang hiện tại
    const topPost = allPosts.reduce((max, post) =>
      (post.views > max.views ? post : max), allPosts[0]);

    topArticleId = topPost.postid;
    renderPopularArticle(topPost); // ✅ hiển thị bài nổi bật

    // ✅ Loại bài đó khỏi danh sách
    articles = allPosts.filter(post => post.postid !== topArticleId);
    totalPages = result.data.pagination?.totalPages || 1;

    displayArticles();
    const res2 = await fetch("/api/categories/");
    const data2 = await res2.json();

    let parentCategory = data2.data.find(cat =>
      cat.name.trim().toLowerCase() === currentCategoryName.trim().toLowerCase()
    );

    if (!parentCategory) {
      parentCategory = data2.data.find(cat =>
        (cat.children || []).some(
          (child) => child.name.trim().toLowerCase() === currentCategoryName.trim().toLowerCase()
        )
  );
}
    const isChildCategory = parentCategory && parentCategory.name.trim().toLowerCase() !== currentCategoryName.trim().toLowerCase();
    updateSectionsVisibility(page, isChildCategory);

  } catch (err) {
    console.error("❌ Lỗi khi tải bài viết:", err);
  }
}



function renderPopularArticle(article) {
  const container = document.querySelector(".l-body");
  if (!container) return;

  if (!article) {
    container.innerHTML = ""; // ❌ không có bài thì clear
    return;
  }

  container.innerHTML = `
    <a href="/pages/trangbaiviet.html?slug=${article.slug}" class="l-img">
      <img src="${article.featuredimage || '/assets/default.jpg'}" alt="${article.title}">
    </a>
    <a href="/pages/trangbaiviet.html?slug=${article.slug}" class="l-content">
      <h3>${article.title}</h3>
      <p>${article.excerpt || ""}</p>
    </a>
  `;
}



function displayArticles() {
  const list = document.getElementById("articles-list");
  list.innerHTML = "";

  if (!articles.length) {
    list.innerHTML = "<p>Không có bài viết nào trong chuyên mục này.</p>";
    return;
  }

  articles.forEach((article) => {
    const li = document.createElement("li");
    li.className = "one-article";
    li.innerHTML = renderArticleCard(article);
    list.appendChild(li);
  });

  updatePagination();
}

function renderArticleCard(article) {
  return `
    <a href="/pages/trangbaiviet.html?slug=${article.slug}" class="article-image">
      <img src="${article.featuredimage || '/assets/default.jpg'}" alt="${article.title}">
    </a>
    <a href="/pages/trangbaiviet.html?slug=${article.slug}" class="article-title">
      <h3>${article.title}</h3>
      <div class="article-desc"><p>${article.excerpt || ""}</p></div>
      <div class="ar-cmt2">
        <div class="ar-time">
          <span class="ar-item"><span>${new Date(article.publishedat || article.createdat).toLocaleDateString("vi-VN")}</span></span>
          <span class="ar-item"><span>${article.views || 0} lượt xem</span></span>
        </div>
      </div>
    </a>
  `;
}

function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }


  // Prev
  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "prev-btn";
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener("click", () => {
      changePage(currentPage - 1);
    });
    pagination.appendChild(prevBtn);
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.textContent = i;

    // ✅ Gắn sự kiện click
    btn.addEventListener("click", () => {
      if (i !== currentPage) {
        changePage(i);
      }
    });

    pagination.appendChild(btn);
  }

  // Next
  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "next-btn";
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener("click", () => {
      changePage(currentPage + 1);
    });
    pagination.appendChild(nextBtn);
  }
}


function changePage(page) {
  if (page >= 1 && page <= totalPages) {
    loadArticlesAndTopPopular(page);
    window.scrollTo(0, 0);
  }
}


// ================= SLIDER (BẠN CÓ THỂ THÍCH) =================
document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".news-slider", {
    slidesPerView: 3, // hoặc 4 tùy thiết kế
    spaceBetween: 20,
    loop: false, // ✅ KHÔNG loop để tránh thêm chấm
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true, // ✅ để gọn
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
  
});

// ================= CHUYÊN MỤC CHA VÀ CON (dựa trên categoryName từ URL) =================
async function loadCategoryBlock() {
  const params = new URLSearchParams(window.location.search);
  const categoryName = params.get("categoryName");

  if (!categoryName) return;

  try {
    const res = await fetch("/api/categories/");
    const data = await res.json();

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
    if (!titleContainer) return;

    const headerHTML = `
      <div class="title-header">
       <a href="/pages/topic.html?categoryName=${encodeURIComponent(name)}"
          <h1>${name}</h1>
       <a>
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

  loadArticlesAndTopPopular(1);

  } catch (err) {
    console.error("❌ Lỗi khi tải danh mục:", err);
  }
}

async function loadTrendingSubcategoryPosts() {
  const params = new URLSearchParams(window.location.search);
  const parentName = params.get("categoryName");
  if (!parentName) return;

  try {
    const res = await fetch("/api/categories/");
    const data = await res.json();

    const parentCategory = data.data.find(cat =>
      cat.name.trim().toLowerCase() === parentName.trim().toLowerCase()
    );

    if (!parentCategory || !parentCategory.children?.length) return;

    const trendList = document.querySelector(".trend-list");
    trendList.innerHTML = ""; // Xoá nội dung cũ

    for (const sub of parentCategory.children) {
      const query = new URLSearchParams({
        categoryName: sub.name,
        sortBy: "popular",
        page: 1,
        pageSize: 3
      });

      const postRes = await fetch(`/api/posts/search/?${query.toString()}`);
      const postData = await postRes.json();

      if (postData.success && postData.data.posts?.length) {
        postData.data.posts.forEach(post => {
          const li = document.createElement("li");
          li.className = "trend-container";
          li.innerHTML = `
            <a href="/pages/trangbaiviet.html?slug=${post.slug}" class="trend-words">
              <h3>${post.title}</h3>
              <span class="trend-content">${post.excerpt || ""}</span>
            </a>
          `;
          trendList.appendChild(li);
        });
      }
    }
  } catch (error) {
    console.error("❌ Lỗi khi tải trending chuyên mục con:", error);
  }
}


function updateSectionsVisibility(page, isChildCategory = false) {
  const trending = document.getElementById("trending-section");
  const popular = document.getElementById("popularArticle");

  if (!trending || !popular) return;

  if (page === 1 && !isChildCategory) {
    loadTrendingSubcategoryPosts();
    trending.classList.remove("hidden");
    popular.classList.remove("full-width");
  } else {
    trending.classList.add("hidden");
    popular.classList.add("full-width");
  }
}

async function loadRecommendedPosts() {
  try {
    const response = await fetch(
      "/api/posts/search?sortBy=popular&pageSize=20&status=published"
    );
    if (!response.ok) throw new Error("Lỗi tải dữ liệu");

    const data = await response.json();
    const posts = data.data?.posts || [];

    const filteredPosts = posts
      .filter((post) => !shownPostIds.has(post.postid) && post.featuredimage)
      .slice(0, 20);

    if (filteredPosts.length === 0) {
      document.querySelector(
        ".news-slider-container"
      ).innerHTML += `<p class="error">Không có bài viết đề xuất mới</p>`;
      return;
    }

    filteredPosts.forEach((post) => shownPostIds.add(post.postid));

    const swiperWrapper = document.querySelector(".news-slider .swiper-wrapper");
    swiperWrapper.innerHTML = filteredPosts
      .map(
        (post) => `
        <div class="swiper-slide">
          <a href="/pages/trangbaiviet.html?slug=${post.slug}">
            <div class="swiper-news-item">
              <div class="swiper-news-item-img" style="background-image: url('${post.featuredimage}')"></div>
              <h4 class="swiper-news-item-title">${post.title}</h4>
            </div>
          </a>
        </div>
      `
      )
      .join("");

    function updateNavButtons(swiper) {
      const nextBtn = document.querySelector(".swiper-button-next");
      const prevBtn = document.querySelector(".swiper-button-prev");
      const totalSlides = swiper.slides.length;
      const currentIndex = swiper.activeIndex;

      prevBtn.classList.toggle("disabled", currentIndex === 0);
      nextBtn.classList.toggle("disabled", currentIndex >= totalSlides - swiper.params.slidesPerView);
    }
  } catch (error) {
    console.error("Lỗi tải bài đề xuất:", error);
    document.querySelector(
      ".news-slider-container"
    ).innerHTML += `<p class="error">Không thể tải đề xuất</p>`;
  }
}



document.addEventListener("DOMContentLoaded", () => {
  loadCategoryBlock();
  loadRecommendedPosts();
});


