ClassicEditor.create(document.querySelector("#articleContent"), {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "blockQuote",
    "insertTable",
    "|",
    "imageUpload",
    "undo",
    "redo",
  ],
  image: {
    toolbar: ["imageTextAlternative", "|", "toggleImageCaption"],
    caption: {
      enabled: true,
    },
  },
})
  .then((editor) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
    window.articleEditor = editor;
    const voiceLabel = document.querySelector(".ck.ck-voice-label");
    if (voiceLabel) {
      voiceLabel.remove();
    }
  })
  .catch((error) => {
    console.error("CKEditor load failed:", error);
  });

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file) => {
      const data = new FormData();
      data.append("upload", file);

      return fetch("http://localhost:5501/api/uploads?folder=ckeditor", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.url) {
            return { default: res.url };
          } else {
            throw new Error(res.message || "Upload failed");
          }
        });
    });
  }

  abort() {
    // Nếu cần handle hủy upload
  }
}
const sendNotification = async ({ title, message, toUserId }) => {
  const res = await fetch("/api/noti/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, message, toUserId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gửi thông báo thất bại");
  }

  return data;
};

document.addEventListener("DOMContentLoaded", async function () {
  // ==================== PHẦN KHỞI TẠO DỮ LIỆU ====================
  let userData = null;

  async function getUserData() {
    try {
      const accessToken = window.currentAccessToken;
      //  Decode để lấy userId từ token
      const tokenPayload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      const userId = decodedPayload.id;

      const res = await fetch(`http://localhost:5501/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");

      const raw = await res.json();
      const userInfo = raw.data;

      userData = {
        id: userInfo.userid,
        username: userInfo.username,
        password: userInfo.passwordhash,
        email: userInfo.email,
        avatar: userInfo.avatarurl,
        joinDate: new Date(userInfo.createdat).toLocaleDateString("vi-VN"),
        role: userInfo.role,
      };
      return userData;
    } catch (error) {
      console.error("❌ Lỗi getUserData:", error);
      return null;
    }
  }

  // ==================== PHẦN UTILITY ====================
  // Hiển thị thông báo
  function showMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = text;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  // Hiển thị lỗi cho input
  function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  // Xóa lỗi
  function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}-error`);
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
  }

  // ==================== PHẦN TÀI KHOẢN ====================
  async function initAccountSection() {
    // Đợi navbar xác thực và token được gán
    await window.updateNavbarAuthState();

    // Gọi API lấy thông tin người dùng
    const data = await getUserData();
    if (!data) {
      return;
    }
    initUserData(data);
    // Khởi tạo dữ liệu người dùng
    function initUserData() {
      document.getElementById("fullname").value = userData.username;
      document.getElementById("email").value = userData.email;
      document.getElementById("display-username").textContent =
        userData.username;
      document.getElementById(
        "display-email"
      ).textContent = `Tham gia từ ${userData.joinDate}`;
      document.getElementById("join-date").textContent = userData.joinDate;
      document.getElementById("user-avatar").src = userData.avatar;
      document.getElementById("usr-avatar").src = userData.avatar;
      const post_tab = document.getElementById("post-tab");
      const posted_tab = document.getElementById("posted-tab");
      const post_statistic = document.getElementById("post-statistic-tab");
      const author_register = document.getElementById("author-register-tab");
      if (userData.role == "user") {
        (post_tab.style.display = "none"),
          (posted_tab.style.display = "none"),
          (post_statistic.style.display = "none");
      } else if (userData.role == "author" || userData.role == "admin") {
        author_register.style.display = "none";
      }
    }

    // Xử lý đổi mật khẩu
    function handlePasswordChange() {
      const passwordForm = document.getElementById("change-password-form");
      const togglePasswordBtn = document.getElementById("toggle-password-btn");
      const submitPasswordChange = document.getElementById(
        "submit-password-change"
      );

      if (!passwordForm || !togglePasswordBtn || !submitPasswordChange) return;

      togglePasswordBtn.addEventListener("click", function () {
        passwordForm.style.display =
          passwordForm.style.display === "none" ? "block" : "none";
        this.textContent =
          passwordForm.style.display === "none" ? "Đổi mật khẩu" : "Đóng";
      });

      document
        .getElementById("new-password")
        ?.addEventListener("input", function () {
          const password = this.value;
          clearError("new-password");

          if (password.length > 0 && password.length < 8) {
            showError("new-password", "Mật khẩu phải có ít nhất 8 ký tự");
          }
        });

      submitPasswordChange.addEventListener("click", async function () {
        const currPassword = document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword =
          document.getElementById("confirm-password").value;
        const email = userData.email;

        // Reset lỗi
        clearError("current-password");
        clearError("new-password");
        clearError("confirm-password");

        if (!currPassword) {
          showError("current-password", "Vui lòng nhập mật khẩu hiện tại");
          return;
        }

        if (newPassword.length < 8) {
          showError("new-password", "Mật khẩu phải có ít nhất 8 ký tự");
          return;
        }

        // Kiểm tra độ mạnh mật khẩu
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumbers = /[0-9]/.test(newPassword);
        const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
          newPassword
        );

        const strengthCriteria = [
          hasUpperCase,
          hasLowerCase,
          hasNumbers,
          hasSpecialChars,
        ].filter(Boolean).length;

        if (strengthCriteria < 3) {
          showError(
            "new-password",
            "Cần ít nhất 3 loại: chữ hoa, thường, số hoặc ký tự đặc biệt"
          );
          return;
        }

        if (newPassword !== confirmPassword) {
          showError("confirm-password", "Mật khẩu nhập lại không khớp");
          return;
        }

        const originalBtnText = submitPasswordChange.textContent;
        submitPasswordChange.innerHTML = '<div class="loading-spinner"></div>';
        submitPasswordChange.disabled = true;

        try {
          const accessToken = window.currentAccessToken;
          const tokenPayload = accessToken.split(".")[1];
          const decodedPayload = JSON.parse(atob(tokenPayload));
          const userId = decodedPayload.id;
          const res = await fetch("/api/auth/verify-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ email, password: currPassword }),
          });

          const data = await res.json();

          if (!data.success) {
            showError("current-password", "Mật khẩu hiện tại không đúng");
            submitPasswordChange.textContent = originalBtnText;
            submitPasswordChange.disabled = false;
            return;
          }

          await fetch(`/api/users/change-password/${userData.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ newPassword }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data.success)
                throw new Error(data.message || "Lỗi khi đổi mật khẩu");

              // Hiển thị thông báo thành công
              document.getElementById("password-change-success").textContent =
                "Thay đổi mật khẩu thành công";
              document.getElementById("password-change-success").style.display =
                "block";

              sendNotification({
                title: "Thông báo bảo mật",
                message:
                  "Bạn vừa thực hiện thay đổi mật khẩu, thực hiện bảo mật tài khoản nếu đây không phải bạn",
                toUserId: userId,
              });
              submitPasswordChange.textContent = originalBtnText;
              submitPasswordChange.disabled = false;
            })
            .catch((err) => {
              console.error("Lỗi đổi mật khẩu:", err.message);
              showMessage("Đổi mật khẩu thất bại", "errors");
              submitPasswordChange.textContent = originalBtnText;
              submitPasswordChange.disabled = false;
            });
        } catch (err) {
          console.error("Lỗi xác minh mật khẩu:", err);
          showMessage("Đã xảy ra lỗi. Vui lòng thử lại.", "errors");
          submitPasswordChange.textContent = originalBtnText;
          submitPasswordChange.disabled = false;
        }
      });
    }

    // Xử lý upload avatar
    function handleAvatarUpload() {
      const changeAvatarBtn = document.getElementById("change-avatar-btn");
      const avatarUpload = document.getElementById("avatar-upload");

      if (!changeAvatarBtn || !avatarUpload) return;

      changeAvatarBtn.addEventListener("click", function () {
        avatarUpload.click();
      });

      avatarUpload.addEventListener("change", async function (e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("upload", file);

        try {
          const uploadRes = await fetch(
            "http://localhost:5501/api/uploads?folder=avatars",
            {
              method: "POST",
              body: formData,
            }
          );

          const uploadData = await uploadRes.json();

          if (!uploadData.url) {
            showMessage("Upload ảnh thất bại", "errors");
            return;
          }

          const avaUrl = uploadData.url;

          // Cập nhật URL avatar trên server
          const updateRes = await fetch(
            `http://localhost:5501/api/users/change-ava/${userData.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${window.currentAccessToken}`,
              },
              body: JSON.stringify({ newAva: avaUrl }),
            }
          );

          const updateData = await updateRes.json();

          if (updateData.success) {
            // Cập nhật giao diện
            userData.avatar = avaUrl;
            document.getElementById("user-avatar").src = avaUrl;
            document.getElementById("usr-avatar").src = avaUrl;
            showMessage("Ảnh đại diện đã được cập nhật!", "success");
          } else {
            showMessage("Lỗi khi cập nhật avatar", "errors");
          }
        } catch (err) {
          console.error("Lỗi upload avatar:", err);
          showMessage("Có lỗi xảy ra khi đổi avatar", "error");
        }
      });
    }

    // Khởi tạo tất cả
    // handleAccountForm();
    handlePasswordChange();
    handleAvatarUpload();
  }

  // ==================== PHẦN TAB ====================
  function initTabs() {
    function showTab(tabName) {
      // 1. Ẩn toàn bộ tab
      document.querySelectorAll(".account-tab").forEach((tab) => {
        tab.style.display = "none";
      });

      // 2. Xóa active khỏi menu
      document.querySelectorAll(".account-menu li").forEach((item) => {
        item.classList.remove("active");
      });

      // 3. Hiển thị tab được chọn
      const tabElement = document.getElementById(tabName);
      if (tabElement) {
        tabElement.style.display = "block";

        const menuLink = document.querySelector(
          `.account-menu a[href="#${tabName}"]`
        );
        if (menuLink?.parentElement) {
          menuLink.parentElement.classList.add("active");
        }

        // ✅ Cập nhật URL hash khi chuyển tab
        window.location.hash = tabName;
      }
    }

    // ✅ Khi trang load: kiểm tra hash trên URL
    const initialTab = window.location.hash
      ? window.location.hash.substring(1)
      : "account-info";
    showTab(initialTab);

    // ✅ Click menu tab
    document.querySelectorAll(".account-menu a").forEach((tab) => {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        const tabName = this.getAttribute("href").substring(1);
        showTab(tabName);
      });
    });
  }

  // ==================== PHẦN PHÂN TRANG ====================
  function createPagination(containerClass, itemClass, countElementId = null) {
    let currentPage = 1;
    const itemsPerPage = 5;
    let allItems = [];

    // Hiển thị trang cụ thể
    function showPage(page) {
      currentPage = page;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Ẩn tất cả items
      allItems.forEach((item) => (item.style.display = "none"));

      // Hiển thị items trong trang hiện tại
      allItems.slice(startIndex, endIndex).forEach((item) => {
        item.style.display = "flex";
      });
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Hiệu ứng cuộn mượt
      });

      updatePaginationButtons();
      updateEmptyState();
    }

    // Cập nhật nút phân trang
    function updatePaginationButtons() {
      const totalPages = Math.ceil(allItems.length / itemsPerPage);
      const paginationContainer = document.querySelector(`.${containerClass}`);
      if (!paginationContainer) return;

      // Xóa nút cũ
      paginationContainer.innerHTML = "";

      // Nút Previous
      const prevBtn = document.createElement("button");
      prevBtn.className = "page-btn prev-btn";
      prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) showPage(currentPage - 1);
      });
      if (currentPage > 1) {
        paginationContainer.appendChild(prevBtn);
      }

      // Các nút trang
      const maxVisiblePages = 5;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener("click", () => showPage(i));
        paginationContainer.appendChild(pageBtn);
      }

      // Nút Next
      const nextBtn = document.createElement("button");
      nextBtn.className = "page-btn next-btn";
      nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'; // Đã sửa thành nextBtn
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) showPage(currentPage + 1);
      });
      if (currentPage < totalPages) {
        paginationContainer.appendChild(nextBtn);
      }
    }

    // Hiển thị thông báo khi không có item
    function updateEmptyState() {
      if (!countElementId) return;

      const count = allItems.length;
      document.getElementById(countElementId).textContent = count;

      const container = document.querySelector(`${itemClass}-list`);
      if (!container) return;

      // Xóa thông báo cũ
      const existingMessage = container.querySelector(".empty-message");
      if (existingMessage) existingMessage.remove();

      // Hiển thị thông báo nếu không có item
      if (count === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "empty-message";
        emptyMessage.innerHTML = "<h3>Không có dữ liệu</h3>";
        container.appendChild(emptyMessage);
      }
    }

    // Xử lý unsave/remove item
    function handleRemoveItem(btnClass, callback) {
      document.querySelectorAll(btnClass).forEach((btn) => {
        btn.addEventListener("click", async function () {
          const item = this.closest(itemClass);
          const postId = this.dataset.articleId;
          const originalText = this.innerHTML;
          const accessToken = window.currentAccessToken;

          if (!postId || !accessToken) {
            console.warn("Thiếu postId hoặc accessToken");
            return;
          }

          // Loading UI
          this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
          this.disabled = true;

          try {
            const res = await fetch(
              `http://localhost:5501/api/unsave/${postId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (!res.ok) throw new Error("Xoá thất bại từ server");

            // Xoá khỏi giao diện
            item.style.opacity = "0";
            setTimeout(() => {
              item.remove();
              allItems = Array.from(document.querySelectorAll(itemClass));

              showPage(
                Math.min(currentPage, Math.ceil(allItems.length / itemsPerPage))
              );

              if (callback) callback();
            }, 300);
          } catch (err) {
            console.error("❌ Gỡ lưu thất bại:", err);
            this.innerHTML = originalText;
            this.disabled = false;
            alert("Không thể gỡ lưu bài viết.");
          }
        });
      });
    }

    // Khởi tạo
    function init() {
      allItems = Array.from(document.querySelectorAll(itemClass));
      showPage(1);
    }

    return { init, handleRemoveItem };
  }

  // Khởi tạo phân trang cho Saved Articles
  const savedArticlesPagination = createPagination(
    "pagination",
    ".saved-article-item",
    "saved-count"
  );
  savedArticlesPagination.init();
  savedArticlesPagination.handleRemoveItem(".btn-unsave", () => {
    userData.savedCount = allItems.length - 1;
    document.getElementById("saved-count").textContent = userData.savedCount;
  });

  // Khởi tạo phân trang cho Reading History
  const readArticlesPagination = createPagination(
    "pagination-read",
    ".read-article-item",
    "read-count"
  );
  readArticlesPagination.init();
  // Khởi tạo phân trang cho Cmt History
  const CommentArticlesPagination = createPagination(
    "pagination-cmt",
    ".cmt-article-item"
  );
  CommentArticlesPagination.init();

  //Khởi tạo phân trang cho tab bài viết đã đăng
  const PostedArticlePagination = createPagination(
    "pagination-posted",
    ".posted-article-item"
  );
  PostedArticlePagination.init();

  // Khởi tạo phân trang cho tab noti
  const NotiPagination = createPagination("pagination-noti", ".noti-item");
  NotiPagination.init();

  //=====================PHẦN THÔNG BÁO==============
  document
    .getElementById("notiStatusFilter")
    .addEventListener("change", function () {
      const selectedStatus = this.value;
      loadNotifications(selectedStatus);
    });

  async function loadNotifications(status = "") {
    const accessToken = window.currentAccessToken;
    if (!accessToken) return;

    const url = new URL("http://localhost:5501/api/noti/");
    if (status) url.searchParams.append("status", status);

    try {
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi khi lấy danh sách thông báo");

      const result = await res.json();
      const notiList = result.data || [];

      const container = document.querySelector(".noti-list");
      const pagi = document.querySelector(".pagination-noti");

      container.innerHTML = "";

      if (notiList.length === 0) {
        container.innerHTML = "<p>Chưa có thông báo nào.</p>";
        pagi.style.display = "none";
        return;
      }

      notiList.forEach((noti) => {
        const notiItem = document.createElement("div");
        notiItem.className = "noti-item";
        if (noti.is_read) notiItem.classList.add("read"); // Nếu đã đọc từ đầu

        notiItem.dataset.id = noti.id; // Để biết ID khi click

        const titleDiv = document.createElement("div");
        titleDiv.className = "noti-title";
        titleDiv.textContent = noti.title;

        const contentDiv = document.createElement("div");
        contentDiv.className = "noti-content";
        contentDiv.textContent = noti.message;

        const metaDiv = document.createElement("div");
        metaDiv.className = "noti-meta";

        if (noti.created_at) {
          const date = new Date(noti.created_at);
          metaDiv.textContent = date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }

        notiItem.appendChild(titleDiv);
        notiItem.appendChild(contentDiv);
        notiItem.appendChild(metaDiv);

        // Gắn sự kiện click: đánh dấu đã đọc
        notiItem.addEventListener("click", async () => {
          const notificationId = notiItem.dataset.id;

          try {
            const res = await fetch(
              `http://localhost:5501/api/noti/read/${notificationId}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (!res.ok) throw new Error("Không thể đánh dấu là đã đọc");

            notiItem.classList.add("read"); // Gắn class đã đọc
          } catch (err) {
            console.error("❌ Lỗi khi đánh dấu đã đọc:", err);
          }
        });

        container.appendChild(notiItem);
      });

      NotiPagination.init();
    } catch (err) {
      console.error("❌ Lỗi khi tải thông báo:", err);
    }
  }

  // ==================== PHẦN ĐÃ ĐỌC ====================
  async function loadViewedPosts() {
    const accessToken = window.currentAccessToken;
    if (!accessToken) {
      console.warn("Người dùng chưa đăng nhập.");
      return;
    }

    try {
      const tokenPayload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      const userId = decodedPayload.id;

      const res = await fetch(
        `http://localhost:5501/api/viewed-posts/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Lỗi khi lấy bài viết đã đọc");

      const result = await res.json();
      const posts = result.data;

      const container = document.querySelector(".reading-history-list");
      container.innerHTML = ""; // Xóa cũ

      if (posts.length === 0) {
        container.innerHTML = "<p>Bạn chưa đọc bài viết nào.</p>";
        return;
      }

      posts.forEach((post) => {
        const imageUrl = post.featuredimage?.startsWith("http")
          ? post.featuredimage
          : `http://localhost:5501${post.featuredimage}`;

        const date = new Date(post.createdat).toLocaleDateString("vi-VN");

        const item = document.createElement("div");
        item.className = "read-article-item";

        item.innerHTML = `
          <div class="article-image">
            <img src="${imageUrl}" alt="${post.title}" />
          </div>
          <div class="article-info">
            <h3 class="article-title">
              <a href="/pages/trangbaiviet.html?slug=${post.slug}">
                ${post.title}
              </a>
            </h3>
            <div class="article-social">
              <p class="article-meta">${date}</p>
            </div>
          </div>
        `;

        container.appendChild(item);
      });
      readArticlesPagination.init();
      document.getElementById("read-count").textContent =
        document.querySelectorAll(".read-article-item").length;
    } catch (err) {
      console.error("Không thể tải bài viết đã đọc:", err);
    }
  }

  // ==================== PHẦN ĐĂNG KÝ TÁC GIẢ ====================
  async function loadAuthorCategories() {
    try {
      const response = await fetch(
        "http://localhost:5501/api/categories?parent_id=null"
      );
      const result = await response.json();

      if (result.success) {
        const categories = result.data;
        const checkboxGroup = document.querySelector(".checkbox-group");
        if (!checkboxGroup) return;

        checkboxGroup.innerHTML = "";

        categories.forEach((category) => {
          const label = document.createElement("label");
          label.innerHTML = `
            <input type="checkbox" name="topics" value="${category.id}" />
            ${category.name}
          `;
          checkboxGroup.appendChild(label);
        });
      } else {
        console.error("❌ Load categories thất bại:", result.message);
      }
    } catch (error) {
      console.error("💥 Lỗi khi load categories:", error);
    }
  }

  async function uploadImageAndGetUrl(file) {
    const formData = new FormData();
    formData.append("upload", file);

    const response = await fetch(
      "http://localhost:5501/api/uploads?folder=register",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (result.url) {
      return result.url;
    } else {
      throw new Error(result.message || "Upload failed");
    }
  }

  function initAuthorRegistration() {
    loadAuthorCategories();

    const authorForm = document.getElementById("authorRegistrationForm");
    if (!authorForm) return;

    function handleImagePreview(inputId, previewId, hiddenInputId) {
      const input = document.getElementById(inputId);
      const previewContainer = document.getElementById(previewId);
      const hiddenInput = document.getElementById(hiddenInputId);

      input?.addEventListener("change", async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        clearError(inputId);

        if (!file.type.match("image.*")) {
          showError(inputId, "Chỉ chấp nhận file ảnh (JPEG, PNG)");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          showError(inputId, "Ảnh không được vượt quá 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
          previewContainer.innerHTML = `
            <div class="preview-item">
              <img src="${event.target.result}" alt="Preview">
              <button type="button" class="remove-btn">&times;</button>
            </div>
          `;
          previewContainer
            .querySelector(".remove-btn")
            .addEventListener("click", (e) => {
              e.preventDefault();
              previewContainer.innerHTML = "";
              input.value = "";
              hiddenInput.value = "";
            });
        };
        reader.readAsDataURL(file);

        try {
          const uploadedUrl = await uploadImageAndGetUrl(file);
          hiddenInput.value = uploadedUrl;
        } catch (error) {
          showError(inputId, "Lỗi khi upload ảnh: " + error.message);
        }
      });
    }

    handleImagePreview("frontIdCard", "frontPreview", "frontIdCardUrl");
    handleImagePreview("backIdCard", "backPreview", "backIdCardUrl");

    function validateForm() {
      let valid = true;

      const fullname = document.getElementById("fullname1").value.trim();
      const email = document.getElementById("email1").value.trim();
      const phone = document.getElementById("phone1").value.trim();
      const experience = document.getElementById("experience").value.trim();

      const frontUrl = document.getElementById("frontIdCardUrl").value;
      const backUrl = document.getElementById("backIdCardUrl").value;

      const selectedTopics = document.querySelectorAll(
        'input[name="topics"]:checked'
      );

      if (!fullname) {
        showError("fullname1", "Vui lòng nhập họ tên");
        valid = false;
      } else clearError("fullname1");

      if (!email) {
        showError("email1", "Vui lòng nhập email");
        valid = false;
      } else clearError("email1");

      if (!phone) {
        showError("phone1", "Vui lòng nhập số điện thoại");
        valid = false;
      } else clearError("phone1");

      if (!experience) {
        showError("experience", "Vui lòng chia sẻ kinh nghiệm viết");
        valid = false;
      } else clearError("experience");

      if (!frontUrl) {
        showError("frontIdCard", "Vui lòng upload ảnh mặt trước");
        valid = false;
      } else clearError("frontIdCard");

      if (!backUrl) {
        showError("backIdCard", "Vui lòng upload ảnh mặt sau");
        valid = false;
      } else clearError("backIdCard");

      if (selectedTopics.length < 3) {
        showError("topics", "Vui lòng chọn ít nhất 3 lĩnh vực");
        valid = false;
      } else clearError("topics");

      return valid;
    }

    authorForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = authorForm.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;

      if (!validateForm()) return;

      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData();

        formData.append("userId", userData.id);
        formData.append(
          "fullname",
          document.getElementById("fullname1").value.trim()
        );
        formData.append(
          "email",
          document.getElementById("email1").value.trim()
        );
        formData.append(
          "phone",
          document.getElementById("phone1").value.trim()
        );
        formData.append(
          "experience",
          document.getElementById("experience").value.trim()
        );

        const portfolio = document.getElementById("portfolio").value.trim();
        if (portfolio) formData.append("portfolio", portfolio);

        // Gửi URL thay vì file
        formData.append(
          "frontIdCardUrl",
          document.getElementById("frontIdCardUrl").value
        );
        formData.append(
          "backIdCardUrl",
          document.getElementById("backIdCardUrl").value
        );

        document
          .querySelectorAll('input[name="topics"]:checked')
          .forEach((checkbox) => {
            formData.append("topics", checkbox.value);
          });

        const accessToken = window.currentAccessToken;
        const tokenPayload = accessToken.split(".")[1];
        const decodedPayload = JSON.parse(atob(tokenPayload));
        const userId = decodedPayload.id;
        if (!accessToken) {
          showMessage("Vui lòng đăng nhập lại", "errors");
          return;
        }

        const response = await fetch(
          "http://localhost:5501/api/register-author",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        const result = await response.json();

        if (result.success) {
          sendNotification({
            title: "Đăng ký viết bài",
            message:
              "Đơn đăng ký trở thành tác giả của bạn đã được gửi thành công. Kết quả sẽ có trong 1-2 ngày làm việc",
            toUserId: userId,
          });
          showMessage(
            "Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.",
            "success"
          );
          authorForm.reset();
          document.getElementById("frontPreview").innerHTML = "";
          document.getElementById("backPreview").innerHTML = "";
        } else {
          showMessage("Đăng ký thất bại: " + result.message, "errors");
        }
      } catch (error) {
        console.error("Lỗi gửi form:", error);
        showMessage("Có lỗi xảy ra, vui lòng thử lại!", "errors");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // =====================PHẦN BÀI VIẾT ĐÃ LƯU=======================
  async function loadSavedArticles() {
    const accessToken = window.currentAccessToken;
    if (!accessToken) {
      console.warn("Người dùng chưa đăng nhập.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5501/api/saved", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi khi lấy danh sách bài viết đã lưu");

      const result = await res.json();
      const articles = result.data;
      const container = document.querySelector(".saved-articles-list");
      const pagi = document.querySelector(".save .pagination");

      container.innerHTML = ""; // Xóa nội dung cũ

      if (articles.length === 0) {
        container.innerHTML = "<p>Chưa có bài viết nào được lưu.</p>";
        pagi.style.display = "none";
        return;
      }

      articles.forEach((post) => {
        const imageUrl = post.featuredimage?.startsWith("http")
          ? post.featuredimage
          : `http://localhost:5501${post.featuredimage}`;

        const date = new Date(post.createdat).toLocaleDateString("vi-VN");

        const item = document.createElement("div");
        item.className = "saved-article-item";

        item.innerHTML = `
          <div class="article-image">
            <img src="${imageUrl}" alt="${post.title}" />
          </div>
          <div class="article-info">
            <h3 class="article-title">
              <a href="/pages/trangbaiviet.html?slug=${post.slug}">${post.title}</a>
            </h3>
            <div class="article-social">
              <p class="article-meta">${date}</p>
              <button class="btn-unsave" data-article-id="${post.postid}">
                <i class="fas fa-bookmark"></i>
              </button>
            </div>
          </div>
        `;

        container.appendChild(item);
      });

      savedArticlesPagination.init();
      savedArticlesPagination.handleRemoveItem(".btn-unsave", () => {
        userData.savedCount = document.querySelectorAll(
          ".saved-article-item"
        ).length;
        document.getElementById("saved-count").textContent =
          userData.savedCount;
      });
    } catch (err) {
      console.error("❌ Không thể tải bài viết đã lưu:", err);
    }
  }

  // =======================PHẦN BÌNH LUẬN============================
  async function loadUserComments() {
    const accessToken = window.currentAccessToken;
    if (!accessToken) {
      console.warn("Người dùng chưa đăng nhập.");
      return;
    }

    try {
      const tokenPayload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      const userId = decodedPayload.id;

      const res = await fetch(
        `http://localhost:5501/api/comments/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Lỗi khi lấy bình luận người dùng");

      const result = await res.json();
      const comments = result.data;
      const container = document.querySelector(".cmt-history-list");

      container.innerHTML = ""; // Xoá cũ

      if (comments.length === 0) {
        container.innerHTML = "<p>Chưa có bình luận nào.</p>";
        return;
      }

      comments.forEach((cmt) => {
        const imageUrl = cmt.featuredimage?.startsWith("http")
          ? cmt.featuredimage
          : `http://localhost:5501${cmt.featuredimage}`;

        const date = new Date(cmt.createdat).toLocaleDateString("vi-VN");
        const postUrl = `/pages/trangbaiviet.html?slug=${cmt.slug || ""}`;
        const item = document.createElement("div");
        item.className = "cmt-article-item";

        item.innerHTML = `
          <div class="article-image">
            <img src="${imageUrl}" alt="${cmt.posttitle}" />
          </div>
          <div class="article-info">
            <h3 class="article-title">
              <a href="${postUrl}">${cmt.posttitle}</a>
            </h3>
            <div class="cmt-detail">${cmt.content}</div>
            <div class="article-social">
              <p class="article-meta">${date}</p>
            </div>
          </div>
        `;
        container.appendChild(item);
      });
      // Thêm dấu ngoặc kép cho comment
      document.querySelectorAll(".cmt-detail").forEach((detail) => {
        const content = detail.textContent.trim();
        if (!content.startsWith('"')) detail.textContent = `"${content}`;
        if (!content.endsWith('"'))
          detail.textContent = `${detail.textContent}"`;
      });

      CommentArticlesPagination.init();
    } catch (err) {
      console.error("❌ Không thể tải bình luận người dùng:", err);
    }
  }

  //==================== PHẦN ĐĂNG BÀI VIẾT ==================
  async function loadCategories() {
    try {
      const response = await fetch("http://localhost:5501/api/categories");
      const result = await response.json();

      if (result.success) {
        const categories = result.data;
        const container = document.querySelector(".category-selects");
        container.innerHTML = "";

        categories.forEach((parent) => {
          const select = document.createElement("select");
          select.className = "form-control category-select";
          select.setAttribute("data-parent-id", parent.id);

          const defaultOption = document.createElement("option");
          defaultOption.value = "";
          defaultOption.textContent = `-- Chọn danh mục ${parent.name} --`;
          select.appendChild(defaultOption);

          if (parent.children && parent.children.length > 0) {
            parent.children.forEach((child) => {
              const option = document.createElement("option");
              option.value = child.id;
              option.textContent = child.name;
              select.appendChild(option);
            });
          }

          container.appendChild(select);
        });
      } else {
        console.error("Lỗi load categories:", result.message);
      }
    } catch (error) {
      console.error("Lỗi fetch categories:", error);
    }
  }
  function initAuthorSite() {
    loadCategories();

    const articleForm = document.getElementById("articleForm");
    const imageInput = document.getElementById("articleImages");
    const imagePreview = document.getElementById("imagePreview");
    let selectedFiles = [];

    function validateForm() {
      let valid = true;

      const title = document.getElementById("articleTitle").value.trim();
      const tagsInput = document.getElementById("tagInput").value.trim();
      const editorContent = window.articleEditor.getData();

      if (!title) {
        showError("articleTitle", "Tiêu đề là bắt buộc");
        valid = false;
      } else {
        clearError("articleTitle");
      }

      if (!editorContent.trim()) {
        showError("articleContent", "Nội dung không được để trống");
        valid = false;
      } else {
        clearError("articleContent");
      }

      if (!tagsInput) {
        showError("tagInput", "Vui lòng nhập ít nhất 1 hashtag");
        valid = false;
      } else {
        clearError("tagInput");
      }

      const selectedCategories = document.querySelectorAll(
        ".category-selects select"
      );
      const hasCategorySelected = Array.from(selectedCategories).some(
        (select) => select.value !== ""
      );
      if (!hasCategorySelected) {
        showError("article-topics", "Chọn ít nhất 1 danh mục");
        valid = false;
      } else {
        clearError("article-topics");
      }

      if (selectedFiles.length === 0) {
        showError("articleImages", "Cần ít nhất 1 ảnh bìa");
        valid = false;
      } else {
        clearError("articleImages");
      }

      return valid;
    }

    function displayImagePreviews(files) {
      imagePreview.innerHTML = "";
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const div = document.createElement("div");
          div.className = "image-preview-item";
          div.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button type="button" class="remove-image-btn" data-index="${index}">&times;</button>
          `;
          div
            .querySelector(".remove-image-btn")
            .addEventListener("click", function () {
              selectedFiles.splice(index, 1);
              displayImagePreviews(selectedFiles);
            });
          imagePreview.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    }

    imageInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      selectedFiles = files;
      displayImagePreviews(files);
    });

    articleForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      const submitBtn = articleForm.querySelector(".btn-add");
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

      try {
        const formData = new FormData();
        const title = document.getElementById("articleTitle").value.trim();
        const content = window.articleEditor.getData();
        const tagsInput = document.getElementById("tagInput").value.trim();

        formData.append("title", title);
        formData.append("content", content);

        const plainText = content.replace(/<[^>]+>/g, "");
        const excerpt = plainText.substring(0, 300);
        formData.append("excerpt", excerpt);

        if (selectedFiles.length > 0) {
          formData.append("featuredImage", selectedFiles[0]);
        }

        const selectedCategories = document.querySelectorAll(
          ".category-selects select"
        );
        selectedCategories.forEach((select) => {
          if (select.value !== "") {
            formData.append("categoryIds", select.value);
          }
        });

        const tags = tagsInput
          .split(/[#,\s]+/)
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");
        tags.forEach((tag) => {
          formData.append("tags", tag);
        });

        const accessToken = window.currentAccessToken;
        const tokenPayload = accessToken.split(".")[1];
        const decodedPayload = JSON.parse(atob(tokenPayload));
        const userId = decodedPayload.id;

        if (!accessToken) {
          throw new Error(
            "Không tìm thấy accessToken. Vui lòng đăng nhập lại."
          );
        }

        const response = await fetch("http://localhost:5501/api/posts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          sendNotification({
            title: "Gửi bài viết thành công",
            message:
              "Bài viết của bạn đã được gửi đi đợi duyệt, kết quả sẽ có sau 1-2 ngày làm việc",
            toUserId: userId,
          });
          showMessage("Gửi bài thành công!", "success");
          articleForm.reset();
          imagePreview.innerHTML = "";
          window.articleEditor.setData("");
        } else {
          showMessage("Đăng bài thất bại: " + result.message, "errors");
        }
      } catch (error) {
        console.error("Error submitting article:", error);
        showMessage("Có lỗi xảy ra, vui lòng thử lại sau!", "errors");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });

    document.addEventListener("change", function (e) {
      const categorySelect = e.target.closest(".category-selects select");
      if (categorySelect) {
        const selectedCategories = document.querySelectorAll(
          ".category-selects select"
        );
        const hasCategorySelected = Array.from(selectedCategories).some(
          (select) => select.value !== ""
        );
        if (!hasCategorySelected) {
          showError("article-topics", "Chọn ít nhất 1 danh mục");
        } else {
          clearError("article-topics");
        }
      }
    });
  }

  //======================PHẦN BÀI VIẾT ĐÃ ĐĂNG ======================
  document
    .getElementById("postStatusFilter")
    .addEventListener("change", function () {
      const selectedStatus = this.value;
      loadPostedArticles(selectedStatus);
    });
  async function loadPostedArticles(status = "") {
    const accessToken = window.currentAccessToken;
    if (!accessToken) return;

    const tokenPayload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    const userId = decodedPayload.id;

    let url = `http://localhost:5501/api/posts/author/${userId}`;
    if (status) {
      url += `?status=${status}`;
    }

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi khi lấy bài viết");

      const result = await res.json();
      const posts = result.data;
      const container = document.querySelector(".posted-history-list");
      container.innerHTML = "";

      if (posts.length === 0) {
        container.innerHTML = "<p>Không có bài viết.</p>";
        return;
      }

      posts.forEach((post) => {
        const imageUrl = post.featuredimage?.startsWith("http")
          ? post.featuredimage
          : `http://localhost:5501${post.featuredimage}`;

        const date = new Date(post.createdat).toLocaleDateString("vi-VN");

        const item = document.createElement("div");
        item.className = "posted-article-item";
        item.innerHTML = `
            <div class="article-image">
              <img src="${imageUrl}" alt="${post.title}" />
            </div>
            <div class="article-info">
              <h3 class="article-title">
                <a href="/pages/trangbaiviet.html?slug=${post.slug}">${
          post.title
        }</a>
              </h3>
              <div class="article-social">
                <p class="article-meta">${date}</p>
                <div class="article-action">${post.views || 0} views</div>
              </div>
            </div>
          `;
        container.appendChild(item);
      });

      PostedArticlePagination.init();
    } catch (err) {
      console.error("Không thể tải bài viết đã đăng:", err);
    }
  }

  //==================== XỬ LÝ LOGOUT ========================
  async function handleLogout() {
    const logoutBtn = document.getElementById("logout-btn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      try {
        const accessToken = window.currentAccessToken;
        if (!accessToken) {
          throw new Error("Access token không tồn tại. Không thể đăng xuất.");
        }

        const res = await fetch("http://localhost:5501/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Đăng xuất thất bại");

        window.location.href = "/pages/index.html";
      } catch (err) {
        console.error("Lỗi khi đăng xuất:", err);
        alert("Có lỗi khi đăng xuất. Vui lòng thử lại!");
      }
    });
  }

  // =====================PHẦN THỐNG KÊ======================
  async function loadPostData() {
    const accessToken = window.currentAccessToken;
    if (!accessToken) return;

    const tokenPayload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    const userId = decodedPayload.id;

    let url = `http://localhost:5501/api/posts/author/${userId}?status=published`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi khi lấy bài viết");

      const result = await res.json();
      const posts = result.data;
      return posts;
    } catch (err) {
      console.log(err);
    }
  }
  function groupPostsByMonth(posts) {
    const monthly = {};

    posts.forEach((post) => {
      const date = new Date(post.createdat);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!monthly[monthKey]) {
        monthly[monthKey] = { count: 0, views: 0 };
      }

      monthly[monthKey].count += 1;
      monthly[monthKey].views += post.views || 0;
    });

    const labels = Object.keys(monthly).sort();
    const counts = labels.map((key) => monthly[key].count);
    const views = labels.map((key) => monthly[key].views);

    return { labels, counts, views };
  }

  async function initChart() {
    const posts = await loadPostData(); // ✅ đợi dữ liệu xong

    if (!posts) return;

    const { labels, counts, views } = groupPostsByMonth(posts);

    const ctx = document.getElementById("author-chart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Số bài viết",
            data: counts,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
          {
            label: "Lượt xem",
            data: views,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Biểu đồ thống kê bài viết theo tháng",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
  }
  // ==================== KHỞI TẠO CHÍNH ====================
  await window.updateNavbarAuthState();
  await initAccountSection();
  initTabs();
  loadNotifications();
  loadSavedArticles();
  loadViewedPosts();
  loadUserComments();
  loadPostedArticles();
  initAuthorRegistration();
  initAuthorSite();
  initChart();
  handleLogout();
});
