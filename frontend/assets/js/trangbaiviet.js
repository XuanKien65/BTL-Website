// ========================== DỮ LIỆU BAN ĐẦU ==========================
let postId = null;

// ========================== HÀM HỖ TRỢ ==========================

// Đợi access token có sẵn
function waitForAccessToken(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let waited = 0;

    const check = () => {
      if (window.currentAccessToken) {
        resolve(window.currentAccessToken);
      } else if (waited >= timeout) {
        reject("Access token timeout");
      } else {
        waited += interval;
        setTimeout(check, interval);
      }
    };

    check();
  });
}

// Kiểm tra xem bài viết hiện tại đã được lưu chưa
function checkIfSaved(postId) {
  const accessToken = window.currentAccessToken;
  if (!accessToken) return;

  fetch("http://localhost:5501/api/saved", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const savedPosts = data.data;
      const isSaved = savedPosts.some((post) => post.postid === postId);
      const btn = document.getElementById("save-article-btn");

      if (isSaved && btn) {
        btn.classList.add("saved");
        btn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
      }
    })
    .catch((err) => console.error("Lỗi khi kiểm tra đã lưu:", err));
}

// ========================== DOMContentLoaded ==========================

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (slug) {
    try {
      const res = await fetch(`http://localhost:5501/api/posts/${slug}`);
      const result = await res.json();

      if (result.success) {
        const post = result.data;
        postId = post.postid;

        await waitForAccessToken();
        // Gọi API tăng lượt view
        fetch(`http://localhost:5501/api/posts/${postId}/view`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${window.currentAccessToken}`,
          },
        }).catch((err) => console.warn("Không thể tăng lượt xem:", err));

        // Hiển thị thông tin bài viết
        document.querySelector(".news-title h1").textContent = post.title;
        document.querySelector(".news-detail p").innerHTML = `
          <strong>Tác giả</strong> ${post.authorname}
          <strong>Ngày đăng</strong> ${new Date(
            post.createdat
          ).toLocaleDateString("vi-VN")}
        `;
        document.querySelector(".news-body").innerHTML = post.content;

        // Hiển thị hashtag
        const tagContainer = document.querySelector(".hashtag-container");
        tagContainer.innerHTML = "";
        post.tags.forEach((tag) => {
          const span = document.createElement("span");
          span.className = "hashtag";
          span.textContent = `#${tag}`;
          tagContainer.appendChild(span);
        });

        // Đợi access token có rồi mới gọi kiểm tra đã lưu
        try {
          await waitForAccessToken();
          checkIfSaved(postId);
        } catch (err) {
          console.warn("Không lấy được access token:", err);
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err);
    }
  }

  loadSinglePostById(7);
});

// ========================== LƯU / BỎ LƯU BÀI VIẾT ==========================

document
  .getElementById("save-article-btn")
  .addEventListener("click", async function () {
    try {
      const accessToken = window.currentAccessToken;
      console.log(accessToken);
      if (!accessToken) {
        console.error("Access token không tồn tại");
        return;
      }

      const tokenPayload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      const userId = decodedPayload.id;
      const isSaved = this.classList.toggle("saved");

      if (isSaved) {
        this.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
        const res = await fetch(`http://localhost:5501/api/save/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId, postId }),
        });
        if (!res.ok) throw new Error("lỗi lưu bài viết");
      } else {
        this.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
        const res = await fetch(`http://localhost:5501/api/unsave/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error("lỗi bỏ lưu bài viết");
      }
    } catch (err) {
      console.error("❌ Lỗi click:", err);
    }
  });

// ========================== CHIA SẺ BÀI VIẾT ==========================

const currentURL = window.location.href;

// Share Facebook
document
  .getElementById("share-facebook")
  ?.addEventListener("click", function (e) {
    e.preventDefault();
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentURL
    )}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  });

// Share Zalo
document.getElementById("share-zalo")?.addEventListener("click", function (e) {
  e.preventDefault();
  const zaloShareUrl = `https://zalo.me/share?url=${encodeURIComponent(
    currentURL
  )}`;
  window.open(zaloShareUrl, "_blank", "width=600,height=400");
});

// ========================== DANH SÁCH BÀI VIẾT GỢI Ý ==========================

async function loadSinglePostById(postId) {
  try {
    const res = await fetch(`http://localhost:5501/api/posts/id/${postId}`);
    const result = await res.json();

    if (result.success) {
      const post = result.data;
      const container = document.getElementById("postGrid");
      if (!container) return;

      container.innerHTML = ""; // Xóa cũ

      const imageUrl = post.featuredimage?.startsWith("http")
        ? post.featuredimage
        : `http://localhost:5501${post.featuredimage}`;

      const date = new Date(post.createdat).toLocaleDateString("vi-VN");

      // Lặp 10 lần và tạo 10 bài viết giống nhau
      for (let i = 0; i < 10; i++) {
        const item = document.createElement("a");
        item.className = "grid__column-2";
        item.href = `/pages/trangbaiviet.html?slug=${post.slug}`;
        item.setAttribute("data-category", post.categories?.[0] || "");

        item.innerHTML = `
          <div class="news-home-item">
            <div class="news-home-item--img" style="background-image: url('${imageUrl}')"></div>
            <div class="news-home-item--content">
              <h4 class="news-home-item--name">${post.title}</h4>
              <p class="news-home-item--excerpt">${post.excerpt}</p>
              <div class="news-home-item--meta">
                <span class="news-home-item--date">${date}</span>
                <span class="news-home-item--read-time">${post.views} views</span>
              </div>
            </div>
          </div>
        `;

        container.appendChild(item);
      }
    } else {
      console.error("Không tìm thấy bài viết:", result.message);
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
  }
}
