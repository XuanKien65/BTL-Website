//  =============================================== GỌI API ====================================================
// biến toàn cục
const shownPostIds = new Set(); // dùng để xem bài viết nào đã được gọi API rồi

// TODAY NEWS
// Hàm chính gọi API bài viết phổ biến
// TODAY NEWS - Cập nhật hàm này
async function loadPopularPosts() {
  try {
    let allFetchedPosts = [];
    let page = 1;
    let maxPages = 5; // tránh gọi vô hạn trong trường hợp có lỗi
    const limitPerPage = 10;

    // Tiếp tục gọi API đến khi đủ 5 bài chưa hiển thị
    while (allFetchedPosts.length < 5 && page <= maxPages) {
      const response = await fetch(
        `/api/posts/search?sortBy=popular&status=published&page=${page}&pageSize=${limitPerPage}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data?.data?.posts) throw new Error("Invalid response structure");

      const newPosts = data.data.posts.filter(
        (post) => !shownPostIds.has(post.postid)
      );
      allFetchedPosts = allFetchedPosts.concat(newPosts);

      if (newPosts.length === 0) break; // nếu không còn bài mới nào, dừng
      page++;
    }

    const filteredPosts = allFetchedPosts.slice(0, 5);
    filteredPosts.forEach((post) => shownPostIds.add(post.postid));

    if (filteredPosts.length < 3) {
      document.querySelector(".todaybignews").innerHTML =
        '<div class="error-message">Không đủ bài viết để hiển thị layout.</div>';
      return;
    }

    renderTodayNews(filteredPosts);
  } catch (error) {
    console.error("Error loading popular posts:", error);
    const todayBigNews = document.querySelector(".todaybignews");
    todayBigNews.innerHTML = `<div class="error-message">Không thể tải tin nổi bật</div>`;
  }
}

// Hàm render ra HTML
function renderTodayNews(posts) {
  const todayBigNews = document.querySelector(".todaybignews");
  todayBigNews.innerHTML = "";

  if (!posts || posts.length < 3) {
    todayBigNews.innerHTML =
      '<div class="error-message">Không đủ bài viết để hiển thị layout.</div>';
    return;
  }

  const postLayout1 = posts[0];
  const leftPosts = posts.slice(1, 3);
  const rightPosts = posts.slice(3, 5);

  const leftLayout2 = createLayout2(leftPosts);
  const layout1 = createLayout1(postLayout1);
  const rightLayout2 = createLayout2(rightPosts);

  todayBigNews.appendChild(leftLayout2);
  todayBigNews.appendChild(layout1);
  todayBigNews.appendChild(rightLayout2);
}

// Hàm tạo layout1
function createLayout1(post) {
  const a = document.createElement("a");
  a.className = "todaybignews-layout1";
  a.href = `/pages/trangbaiviet.html?slug=${post.slug}`;
  a.innerHTML = `
    <img src="${post.featuredimage}" alt="${post.title}" />
    <div class="todaybignews-layout1--content">
      <h1>${post.title}</h1>
      <p>${post.excerpt}</p>
    </div>
  `;
  return a;
}

// Hàm tạo layout2
function createLayout2(posts) {
  const container = document.createElement("div");
  container.className = "todaybignews-layout2";

  container.innerHTML = posts
    .map(
      (post) => `
    <a class="todaybignews-layout2--link" href="/pages/trangbaiviet.html?slug=${post.slug}">
      <img src="${post.featuredimage}" alt="${post.title}" />
      <div class="todaybignews-layout2--content">
        <h1>${post.title}</h1>
      </div>
    </a>
  `
    )
    .join("");

  return container;
}

// Hàm chia mảng thành các nhóm nhỏ (hiện chưa dùng nhưng vẫn giữ)
function chunkArray(arr, size) {
  return arr.reduce((chunks, item, index) => {
    if (index % size === 0) chunks.push([]);
    chunks[chunks.length - 1].push(item);
    return chunks;
  }, []);
}

// SMALLNEWS
async function loadLeastViewedPosts() {
  try {
    const response = await fetch("/api/posts?status=published");
    const responseData = await response.json();
    let posts = responseData.data.posts;

    posts.sort((a, b) => a.views - b.views);

    // Lọc bài viết chưa hiển thị
    const leastViewedPosts = posts
      .filter((post) => !shownPostIds.has(post.postid))
      .slice(0, 3);

    // Đánh dấu đã hiển thị
    leastViewedPosts.forEach((post) => shownPostIds.add(post.postid));

    const smallnewsContainer = document.querySelector(".smallnews");
    smallnewsContainer.innerHTML = "";

    leastViewedPosts.forEach((post, index) => {
      const postHTML = `
        <a class="smallnews-content" href="/pages/trangbaiviet.html?slug=${
          post.slug
        }">
          <img class="smallnews-img" src="${post.featuredimage}" alt="${
        post.title
      }" />
          <div class="smallnews-text">
            <h3>${post.categories}</h3>
            <p>${post.title}</p>
          </div>
        </a>
        ${index < 2 ? '<div class="small-line"></div>' : ""}
      `;
      smallnewsContainer.innerHTML += postHTML;
    });
  } catch (error) {
    console.error("Lỗi khi tải bài viết ít lượt xem:", error);
  }
}
// tin khác 2
// Biến toàn cục lưu ID bài viết đã hiển thị
const tinkhac2ShownIds = new Set();

async function loadTinKhac2(
  selector = ".tinkhac2 .news-container",
  requiredCount = 9
) {
  try {
    const response = await fetch(`/api/posts?status=published`);
    if (!response.ok) throw new Error("Lỗi tải dữ liệu");

    const data = await response.json();
    let allPosts = data.data.posts;

    // Sắp xếp theo mới nhất
    allPosts.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));

    // Lọc bài chưa hiển thị
    const newPosts = allPosts.filter((post) => !shownPostIds.has(post.postid));
    const finalPosts = newPosts.slice(0, requiredCount);

    // Đánh dấu đã hiển thị
    finalPosts.forEach((post) => {
      shownPostIds.add(post.postid);
      tinkhac2ShownIds.add(post.postid); // nếu cần tracking riêng
    });

    renderTinkhac2(finalPosts, selector);
  } catch (error) {
    console.error("Lỗi tải tin khác:", error);
    document.querySelectorAll(selector).forEach((container) => {
      container.innerHTML = `<p class="error">Không thể tải dữ liệu</p>`;
    });
  }
}

function renderTinkhac2(posts, selector = ".tinkhac2 .news-container") {
  const containers = document.querySelectorAll(selector);

  containers.forEach((container) => {
    container.innerHTML = "";

    posts.forEach((post) => {
      const article = document.createElement("article");
      article.className = "news-article";
      article.innerHTML = `
        <h2 class="article-title">${post.title}</h2>
        <p class="article-subtitle">${post.excerpt}</p>
        <div class="article-footer">
          <span class="article-author">Bởi ${post.authorname}</span>
          <span class="article-date">${new Date(
            post.createdat
          ).toLocaleDateString()}</span>
        </div>
      `;

      article.addEventListener("click", () => {
        window.location.href = `/pages/trangbaiviet.html?slug=${post.slug}`;
      });

      container.appendChild(article);
    });
  });
}

// TIN THEO CHỦ ĐỀ
const categoryMap = {
  // Phim ảnh
  "phim-chieu-rap": "Phim chiếu rạp",
  "phim-viet": "Phim Việt Nam",
  "phim-truyen-hinh": "Phim truyền hình",
  "phim-quoc-te": "Phim quốc tế",

  // Âm nhạc
  "US-UK": "US-UK",
  "chau-A": "Châu Á",
  Viet: "Việt Nam",

  // Beauty & Fashion
  trending: "Trending",
  "thoi-trang": "Thời trang",
  "lam-dep": "Làm đẹp",
  "phong-cach": "Phong cách",

  // Đời sống
  "soi-sao": "Soi sao",
  "song-xanh": "Sống xanh",

  // Xã hội
  "diem-nong": "Điểm nóng",
  "phap-luat": "Pháp luật",
  "the-gioi-do-day": "Thế giới đó đây",

  // Sức khỏe
  "dinh-duong": "Dinh dưỡng",
  "khoe-dep": "Khỏe đẹp",
  "gioi-tinh": "Giới tính",
  "cac-benh": "Các bệnh",
};

async function fetchPostsByCategory(categoryName, container) {
  const MAX_POSTS = 10;
  const PAGE_SIZE = 10;
  let page = 1;
  let allPosts = [];

  try {
    while (true) {
      const response = await fetch(
        `/api/posts/search?categoryName=${encodeURIComponent(
          categoryName
        )}&status=published&page=${page}&pageSize=${PAGE_SIZE}`
      );
      if (!response.ok) break;

      const data = await response.json();
      const posts = data.data?.posts || [];

      if (posts.length === 0) break; // hết dữ liệu

      allPosts.push(...posts);
      page++;
    }

    // Ưu tiên bài chưa hiển thị
    const newPosts = allPosts.filter((post) => !shownPostIds.has(post.postid));
    const resultPosts = [...newPosts];

    // Nếu chưa đủ thì dùng tiếp bài đã hiển thị trước đó
    if (resultPosts.length < MAX_POSTS) {
      const reusedPosts = allPosts.filter((post) =>
        shownPostIds.has(post.postid)
      );
      const needed = MAX_POSTS - resultPosts.length;
      resultPosts.push(...reusedPosts.slice(0, needed));
    }

    // Đánh dấu bài chưa hiển thị (không cần thêm lại bài đã trùng)
    newPosts.forEach((post) => shownPostIds.add(post.postid));

    return resultPosts.slice(0, MAX_POSTS);
  } catch (error) {
    console.error("Lỗi tải bài viết theo chủ đề:", error);
    return [];
  }
}

function renderTopicPosts(container, posts) {
  const gridRow = container.querySelector(".grid__row-1");
  if (!gridRow) return;

  // Xóa nội dung cũ
  gridRow.innerHTML = "";

  // Tạo HTML mới
  posts.forEach((post) => {
    const postHTML = `
      <a class="grid__column-2" href="/pages/trangbaiviet.html?slug=${
        post.slug
      }" data-category="${post.categories[0]?.slug}">
        <div class="news-home-item">
          <div class="news-home-item--img" style="background-image: url(${
            post.featuredimage
          })"></div>
          <div class="news-home-item--content">
            <h4 class="news-home-item--name">${post.title}</h4>
            <p class="news-home-item--excerpt">${post.excerpt}</p>
            <div class="news-home-item--meta">
              <span class="news-home-item--date">${new Date(
                post.createdat
              ).toLocaleDateString("vi-VN")}</span>
              <span class="news-home-item--read-time">${
                post.views
              } lượt đọc</span>
            </div>
          </div>
        </div>
      </a>
    `;
    gridRow.insertAdjacentHTML("beforeend", postHTML);
  });
}

// Cập nhật: Trả về Promise
function initTopicContainers() {
  return new Promise((resolve) => {
    document
      .querySelectorAll(".container[data-main-category]")
      .forEach((container) => {
        const sibling = container.nextElementSibling;
        const readMoreBtn =
          sibling && sibling.classList.contains("readmore-container")
            ? sibling
            : sibling?.querySelector(".readmore-container");

        let currentCategory = null;

        container.querySelectorAll(".news-subject a").forEach((link) => {
          link.addEventListener("click", async (e) => {
            e.preventDefault();
            container
              .querySelectorAll(".news-subject a")
              .forEach((l) => l.classList.remove("active"));
            link.classList.add("active");

            shownPostIds.clear();

            const dataCategory = link.dataset.category;
            currentCategory = dataCategory;
            const categoryName = categoryMap[dataCategory];

            const posts = await fetchPostsByCategory(categoryName, container);
            renderTopicPosts(container, posts);
          });
        });

        if (readMoreBtn) {
          readMoreBtn.addEventListener("click", () => {
            const categorySlug =
              currentCategory ||
              container.querySelector(".news-subject a")?.dataset.category;
            const categoryName = categoryMap[categorySlug] || "Danh mục";
            window.location.href = `/pages/topic.html?categoryName=${encodeURIComponent(
              categoryName
            )}`;
          });
        }

        const firstLink = container.querySelector(".news-subject a");
        if (firstLink) firstLink.click();
      });

    // Đợi 300ms để các click async hoàn thành render
    setTimeout(resolve, 300);
  });
}

// BẠN CÓ THỂ THÍCH - Recommended Posts
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

    // Đánh dấu bài đã hiển thị
    filteredPosts.forEach((post) => shownPostIds.add(post.postid));

    const swiperWrapper = document.querySelector(
      ".news-slider .swiper-wrapper"
    );
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

    // Khởi tạo Swiper
    const swiper = new Swiper(".news-slider", {
      slidesPerView: 6,
      spaceBetween: 0,
      loop: false, // Tắt loop để điều khiển chính xác nút điều hướng
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 2 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 6 },
      },
      on: {
        afterInit: function () {
          updateNavButtons(this);
        },
        slideChange: function () {
          updateNavButtons(this);
        },
      },
    });

    function updateNavButtons(swiper) {
      const nextBtn = document.querySelector(".swiper-button-next");
      const prevBtn = document.querySelector(".swiper-button-prev");
      const totalBullets = swiper.pagination.bullets.length;
      const currentIndex = swiper.activeIndex;

      prevBtn.classList.toggle("disabled", currentIndex === 0);
      nextBtn.classList.toggle("disabled", currentIndex >= totalBullets - 1);
    }
  } catch (error) {
    console.error("Lỗi tải bài đề xuất:", error);
    document.querySelector(
      ".news-slider-container"
    ).innerHTML += `<p class="error">Không thể tải đề xuất</p>`;
  }
}

// SLIDER
async function loadSliderPosts(requiredCount = 6) {
  const parentCategoryIds = [1, 2, 3, 4, 5, 6];
  const sliderContainer = document.querySelector(".slides");
  sliderContainer.innerHTML = "";

  const collectedPosts = [];
  const tempShown = new Set(shownPostIds); // bản sao tạm để tránh trùng

  try {
    // Duyệt từng danh mục cha → lấy tất cả bài của danh mục đó
    for (const parentId of parentCategoryIds) {
      const response = await fetch(`/api/posts/by-parent/${parentId}`);
      if (!response.ok) continue;

      const posts = await response.json();

      const filtered = posts
        .filter((post) => !tempShown.has(post.postid))
        .sort((a, b) => b.views - a.views); // sắp xếp views giảm dần

      if (filtered.length > 0) {
        const selected = filtered[0]; // bài có views cao nhất chưa hiển thị
        collectedPosts.push(selected);
        tempShown.add(selected.postid); // tránh trùng
      }

      if (collectedPosts.length >= requiredCount) break;
    }

    // Nếu vẫn thiếu bài, lấy thêm từ popular toàn site
    if (collectedPosts.length < requiredCount) {
      const response = await fetch(
        `/api/posts/search?sortBy=popular&pageSize=50&status=published`
      );
      const data = await response.json();

      const fallbackPosts = data.data.posts.filter(
        (post) => !tempShown.has(post.postid)
      );

      for (const post of fallbackPosts) {
        collectedPosts.push(post);
        tempShown.add(post.postid);
        if (collectedPosts.length >= requiredCount) break;
      }
    }

    // Đảm bảo luôn có đủ 6 slide (dùng bài giả nếu cần)
    while (collectedPosts.length < requiredCount) {
      collectedPosts.push({
        postid: `placeholder-${collectedPosts.length}`,
        slug: "#",
        featuredimage: "/images/placeholder.jpg",
        title: "Bài viết đang cập nhật",
        excerpt: "Nội dung sẽ sớm có...",
      });
    }

    // ✅ Đánh dấu thực tế vào shownPostIds
    collectedPosts.forEach((post) => {
      if (!post.postid.toString().startsWith("placeholder")) {
        shownPostIds.add(post.postid);
      }
    });

    // Render slider
    collectedPosts.forEach((post, index) => {
      const slideHTML = `
        <a class="slide ${
          index === 0 ? "active" : ""
        }" href="/pages/trangbaiviet.html?slug=${post.slug}">
          <img src="${post.featuredimage}" alt="${post.title}" />
          <div class="overlay">
            <h2>${post.title}</h2>
            <p class="desc">${post.excerpt}</p>
          </div>
        </a>
      `;
      sliderContainer.insertAdjacentHTML("beforeend", slideHTML);
    });

    initSlider();
  } catch (error) {
    console.error("Lỗi khi tải bài viết cho slider:", error);
    sliderContainer.innerHTML = `<p class="error">Không thể tải slide</p>`;
  }
}

// Hàm khởi tạo slider với dữ liệu từ API
function initSliderWithData(posts) {
  const sliderContainer = document.querySelector(".slides");
  const paginationContainer = document.querySelector(".pagination");

  // Xóa nội dung cũ
  sliderContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  // Tạo slide mới
  posts.forEach((post, index) => {
    const slideHTML = `
      <a class="slide ${
        index === 0 ? "active" : ""
      }" href="/pages/trangbaiviet.html?slug=${post.slug}">
        <img src="${post.featuredimage}" alt="${post.category}" />
        <div class="overlay">
          <h2>${post.title}</h2>
          <p class="desc">${post.excerpt}</p>
        </div>
      </a>
    `;
    sliderContainer.insertAdjacentHTML("beforeend", slideHTML);
  });

  // Khởi tạo lại slider
  initSlider();
}

function initSlider() {
  const slides = document.querySelectorAll(".slide");
  const pagination = document.querySelector(".pagination");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (!slides.length || !pagination || !prevBtn || !nextBtn) {
    console.warn("Không có slide nào được tìm thấy, tải slider mặc định");
    return loadDefaultSlider();
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
  let slideInterval = setInterval(nextSlide, 10000);

  document
    .querySelector(".slider")
    .addEventListener("mouseenter", () => clearInterval(slideInterval));

  document.querySelector(".slider").addEventListener("mouseleave", () => {
    slideInterval = setInterval(nextSlide, 3000);
  });
}

// TINKHAC - lọc theo nhiều lượt xem nhất
function initLoadMoreNews({
  containerSelector,
  buttonSelector,
  sortBy = "newest", // hoặc 'views'
  pageSize = 8,
  excludePostIds = new Set(),
  renderItem,
}) {
  let allPosts = [];
  let hasFetched = false;
  const shownLocalPostIds = new Set();

  async function fetchAllPosts() {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Lỗi tải dữ liệu");
      const data = await response.json();
      let posts = data.data.posts;

      // Lọc bài đã hiển thị toàn cục
      posts = posts.filter(
        (post) =>
          post.status === "published" && !excludePostIds.has(post.postid)
      );

      // Sắp xếp theo loại
      if (sortBy === "views") {
        posts.sort((a, b) => b.views - a.views);
      } else {
        posts.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));
      }

      allPosts = posts;
      hasFetched = true;
      initialRender();
    } catch (err) {
      console.error(err);
      showErrorMessage();
    }
  }

  function initialRender() {
    document.querySelector(containerSelector).innerHTML = "";
    loadMoreNews();
  }

  function loadMoreNews() {
    const postsToShow = [];

    for (let i = 0; i < allPosts.length && postsToShow.length < pageSize; i++) {
      const post = allPosts[i];
      if (!shownLocalPostIds.has(post.postid)) {
        postsToShow.push(post);
        shownLocalPostIds.add(post.postid);
        excludePostIds.add(post.postid); // tránh trùng toàn cục
      }
    }

    if (postsToShow.length === 0) {
      hideLoadMoreButton();
      return;
    }

    renderNews(postsToShow);
  }

  function renderNews(posts) {
    const container = document.querySelector(containerSelector);
    posts.forEach((post) => {
      const html = renderItem(post); // dùng hàm render tùy biến
      container.insertAdjacentHTML("beforeend", html);
    });
  }

  function hideLoadMoreButton() {
    document.querySelector(buttonSelector).style.display = "none";
  }

  function showErrorMessage() {
    document.querySelector(buttonSelector).innerHTML =
      '<div class="error-message">Không thể tải thêm bài viết</div>';
  }

  document.querySelector(buttonSelector).addEventListener("click", () => {
    if (hasFetched) loadMoreNews();
  });

  fetchAllPosts();
}

// Hàm ẩn loader
function hideGlobalLoader() {
  const loader = document.querySelector(".global-loader");
  if (loader) {
    loader.classList.add("hidden");

    // Xóa loader sau khi animation kết thúc
    loader.addEventListener(
      "transitionend",
      () => {
        loader.remove();
      },
      { once: true }
    );
  }
}

// Khởi tạo trang
async function initializeHomepage() {
  try {
    document.querySelector(".global-loader").classList.remove("hidden");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await Promise.all([
      loadPopularPosts(),
      loadLeastViewedPosts(),
      loadTinKhac2(".tinkhac2--first .news-container", 9),
      loadTinKhac2(".tinkhac2--second .news-container", 8),
      loadRecommendedPosts(),
      loadSliderPosts(),
      initTopicContainers(), // giờ đã là Promise
      // Gọi chung initLoadMoreNews()
      // 1-Sắp xếp theo mới nhất
      initLoadMoreNews({
        containerSelector: ".articles-news-1",
        buttonSelector: ".readmore-news-1",
        sortBy: "newest",
        pageSize: 8,
        excludePostIds: shownPostIds,
        renderItem: (post) => `
          <a class="highlighted-article" href="/pages/trangbaiviet.html?slug=${
            post.slug
          }">
            <img src="${post.featuredimage}" alt="${post.title}" />
            <div class="article-content">
              <span class="category-tag">${post.categories}</span>
              <h3 class="article-title">${post.title}</h3>
              <p class="article-excerpt">${post.excerpt}</p>
              <div class="read-more">Đọc tiếp <span>→</span></div>
              <div class="article-meta">
                <span>${new Date(post.createdat).toLocaleDateString()}</span>
                <span>${post.views} lượt đọc</span>
              </div>
            </div>
          </a>
        `,
      }),

      // 2-Sắp xếp theo nhiều lượt xem nhất
      initLoadMoreNews({
        containerSelector: ".articles-news-2",
        buttonSelector: ".readmore-news-2",
        sortBy: "views",
        pageSize: 8,
        excludePostIds: shownPostIds,
        renderItem: (post) => `
          <a class="article-card" href="/pages/trangbaiviet.html?slug=${
            post.slug
          }">
            <img src="${post.featuredimage}" alt="${post.title}" />
            <div class="article-content">
              <span class="category-tag">${post.categories}</span>
              <h3 class="article-title">${post.title}</h3>
              <p class="article-excerpt">${post.excerpt}</p>
              <div class="read-more">Đọc tiếp <span>→</span></div>
              <div class="article-meta">
                <span>${new Date(post.createdat).toLocaleDateString()}</span>
                <span>${post.views} lượt đọc</span>
              </div>
            </div>
          </a>
        `,
      }),
    ]);
  } catch (error) {
    console.error("Initialization error:", error);
  } finally {
    hideGlobalLoader();
  }
}

// Khởi chạy
document.addEventListener("DOMContentLoaded", initializeHomepage);
window.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
});
