ClassicEditor.create(document.querySelector("#articleContent"), {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
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
    toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
  },
  simpleUpload: {
    uploadUrl: "/api/uploads", // cần tạo route này trong backend
    headers: {
      // Nếu cần auth:
      // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    },
  },
})
  .then((editor) => {
    window.articleEditor = editor;
  })
  .catch((error) => {
    console.error("CKEditor load failed:", error);
  });

document.addEventListener("DOMContentLoaded", function () {
  // ==================== PHẦN KHỞI TẠO DỮ LIỆU ====================
  let userData = null;

  async function getUserData() {
    try {
      // Gọi refresh token API để lấy accessToken mới
      const refreshRes = await fetch("http://localhost:5501/api/auth/refresh", {
        method: "POST",
        credentials: "include", // để gửi cookie chứa refreshToken
      });

      if (!refreshRes.ok) throw new Error("Không thể refresh token");

      const { accessToken } = await refreshRes.json();

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
  function initAccountSection() {
    getUserData().then((data) => {
      if (!data) {
        return;
      }
      initUserData();
    });
    // Khởi tạo dữ liệu người dùng
    function initUserData() {
      document.getElementById("fullname").value = userData.username;
      document.getElementById("email").value = userData.email;
      document.getElementById("display-username").textContent =
        userData.username;
      document.getElementById(
        "display-email"
      ).textContent = `Tham gia từ ${userData.joinDate}`;
      document.getElementById("saved-count").textContent =
        document.querySelectorAll(".saved-article-item").length;
      document.getElementById("read-count").textContent =
        document.querySelectorAll(".read-article-item").length;
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
      } else if (userData.role == "author") {
        author_register.style.display = "none";
      }
    }

    // Xử lý form thông tin tài khoản
    function handleAccountForm() {
      const accountForm = document.getElementById("account-form");
      if (!accountForm) return;

      accountForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const submitBtn = accountForm.querySelector(".btn-save");
        const originalBtnText = submitBtn.textContent;

        // Hiệu ứng loading
        submitBtn.innerHTML = '<div class="loading-spinner"></div>';
        submitBtn.disabled = true;

        setTimeout(() => {
          userData.fullname = document.getElementById("fullname").value;

          // Khôi phục button
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          console.log("ok");
          showMessage("Cập nhật thông tin thành công!", "success");
        }, 1500);
      });
    }

    // Xử lý đổi mật khẩu
    function handlePasswordChange() {
      const passwordForm = document.getElementById("change-password-form");
      const togglePasswordBtn = document.getElementById("toggle-password-btn");
      const submitPasswordChange = document.getElementById(
        "submit-password-change"
      );

      if (!passwordForm || !togglePasswordBtn || !submitPasswordChange) return;

      // Toggle hiển thị form đổi mật khẩu
      togglePasswordBtn.addEventListener("click", function () {
        passwordForm.style.display =
          passwordForm.style.display === "none" ? "block" : "none";
        this.textContent =
          passwordForm.style.display === "none" ? "Đổi mật khẩu" : "Đóng";
      });

      // Validate mật khẩu khi nhập
      document
        .getElementById("new-password")
        ?.addEventListener("input", function () {
          const password = this.value;
          clearError("new-password");

          if (password.length > 0 && password.length < 8) {
            showError("new-password", "Mật khẩu phải có ít nhất 8 ký tự");
          }
        });

      // Xử lý submit đổi mật khẩu
      submitPasswordChange.addEventListener("click", function () {
        const currPassword = document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword =
          document.getElementById("confirm-password").value;

        // Reset lỗi
        clearError("current-password");
        clearError("new-password");
        clearError("confirm-password");

        // Validate
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

        let strengthCriteria = [
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

        // Hiệu ứng loading
        const originalBtnText = submitPasswordChange.textContent;
        submitPasswordChange.innerHTML = '<div class="loading-spinner"></div>';
        submitPasswordChange.disabled = true;

        // Giả lập gọi API
        setTimeout(() => {
          // Hiển thị thông báo thành công
          document.getElementById("password-change-success").textContent =
            "Đổi mật khẩu thành công!";
          document.getElementById("password-change-success").style.display =
            "block";

          // Khôi phục button
          submitPasswordChange.textContent = originalBtnText;
          submitPasswordChange.disabled = false;

          // Ẩn form sau 2 giây
          setTimeout(() => {
            passwordForm.reset();
            passwordForm.style.display = "none";
            togglePasswordBtn.textContent = "Đổi mật khẩu";
            document.getElementById("password-change-success").style.display =
              "none";
          }, 2000);
        }, 1500);
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

      avatarUpload.addEventListener("change", function (e) {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();

          reader.onload = function (event) {
            userData.avatar = event.target.result;
            document.getElementById("user-avatar").src = userData.avatar;
            document.getElementById("usr-avatar").src = userData.avatar;
            showMessage("Ảnh đại diện đã được cập nhật!", "success");
          };

          reader.readAsDataURL(e.target.files[0]);
        }
      });
    }
    // Khởi tạo tất cả
    handleAccountForm();
    handlePasswordChange();
    handleAvatarUpload();
  }

  // ==================== PHẦN TAB ====================
  function initTabs() {
    function showTab(tabName) {
      document.querySelectorAll(".account-tab").forEach((tab) => {
        tab.style.display = "none";
      });

      // Xóa active class từ menu
      document.querySelectorAll(".account-menu li").forEach((item) => {
        item.classList.remove("active");
      });

      // Hiển thị tab được chọn
      const tabElement = document.getElementById(tabName);
      if (tabElement) {
        tabElement.style.display = "block";
        document
          .querySelector(`.account-menu a[href="#${tabName}"]`)
          .parentElement.classList.add("active");
      }
    }

    // Mặc định hiển thị tab thông tin cá nhân
    showTab("account-info");

    // Xử lý click menu tab
    document.querySelectorAll(".account-menu a").forEach((tab) => {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        showTab(this.getAttribute("href").substring(1));
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
      console.log("Current page:", page, "Total items:", allItems.length); // Thêm dòng này vào đầu hàm showPage()
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
        btn.addEventListener("click", function () {
          const item = this.closest(itemClass);
          const originalText = this.innerHTML;

          // Hiệu ứng loading
          this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
          this.disabled = true;

          // Giả lập gọi API
          setTimeout(() => {
            item.style.opacity = "0";

            setTimeout(() => {
              item.remove();
              allItems = Array.from(document.querySelectorAll(itemClass));

              // Cập nhật UI
              showPage(
                Math.min(currentPage, Math.ceil(allItems.length / itemsPerPage))
              );
              if (callback) callback();
            }, 300);
          }, 1000);
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

  // ==================== PHẦN COMMENT ====================
  // Thêm dấu ngoặc kép cho comment
  document.querySelectorAll(".cmt-detail").forEach((detail) => {
    const content = detail.textContent.trim();
    if (!content.startsWith('"')) detail.textContent = `"${content}`;
    if (!content.endsWith('"')) detail.textContent = `${detail.textContent}"`;
  });
  // ==================== PHẦN ĐĂNG KÝ TÁC GIẢ ====================
  function initAuthorRegistration() {
    const authorForm = document.getElementById("authorRegistrationForm");
    if (!authorForm) return;

    // 1. Xử lý preview ảnh thẻ nhà báo
    function handleImagePreview(inputId, previewId) {
      const input = document.getElementById(inputId);
      const previewContainer = document.getElementById(previewId);

      input?.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // Clear previous error
        clearError(inputId);

        // Validate file type
        if (!file.type.match("image.*")) {
          showError(inputId, "Chỉ chấp nhận file ảnh (JPEG, PNG)");
          return;
        }

        // Validate file size
        if (file.size > 5 * 1024 * 1024) {
          // 5MB
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

          // Xử lý nút xóa ảnh
          previewContainer
            .querySelector(".remove-btn")
            .addEventListener("click", (e) => {
              e.preventDefault();
              previewContainer.innerHTML = "";
              input.value = "";
            });
        };
        reader.readAsDataURL(file);
      });
    }
    // Khởi tạo preview cho 2 ảnh
    handleImagePreview("frontIdCard", "frontPreview");
    handleImagePreview("backIdCard", "backPreview");

    // 2. Xử lý submit form
    authorForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;

      // Validate
      const requiredFields = ["fullname1", "email1", "phone1", "experience"];
      requiredFields.forEach((field) => {
        const value = document.getElementById(field).value.trim();
        if (!value) {
          showError(field, "Thông tin bắt buộc");
          isValid = false;
        } else {
          clearError(field);
        }
      });
      // Validate email
      const email1 = document.getElementById("email1").value.trim();
      if (email1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email1)) {
        showError("email1", "Email không hợp lệ");
        isValid = false;
      } else if (email1) {
        clearError("email1");
      }

      // Validate ảnh thẻ nhà báo
      if (!document.getElementById("frontIdCard").files[0]) {
        showError("frontIdCard", "Vui lòng tải lên ảnh mặt trước");
        isValid = false;
      }

      if (!document.getElementById("backIdCard").files[0]) {
        showError("backIdCard", "Vui lòng tải lên ảnh mặt sau");
        isValid = false;
      }
      // Validate checkbox topics (phải chọn ít nhất 3)
      const checkedTopics = document.querySelectorAll(
        'input[name="topics"]:checked'
      );
      if (checkedTopics.length < 3) {
        showError("topics", "Vui lòng chọn ít nhất 3 lĩnh vực");
        isValid = false;
      } else {
        clearError("topics");
      }

      if (isValid) {
        const submitBtn = authorForm.querySelector(".submit-btn");
        const originalText = submitBtn.innerHTML;

        // Hiệu ứng loading
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        submitBtn.disabled = true;

        // Giả lập gửi form (thực tế sẽ dùng fetch/axios)
        setTimeout(() => {
          // Xử lý gửi dữ liệu ở đây
          const formData = new FormData(authorForm);
          console.log("Form data:", Object.fromEntries(formData));

          // Hiển thị thông báo thành công
          showMessage(
            "Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.",
            "success"
          );

          // Reset form
          authorForm.reset();
          document.getElementById("frontPreview").innerHTML = "";
          document.getElementById("backPreview").innerHTML = "";

          // Khôi phục nút submit
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  }
  //==================== PHẦN ĐĂNG BÀI VIẾT ==================
  function initAuthorSite() {
    const articleForm = document.getElementById("articleForm");
    const imageInput = document.getElementById("articleImages");
    const imagePreview = document.getElementById("imagePreview");
    const maxFiles = 10;
    let selectedFiles = []; // Mảng lưu trữ file đã chọn
    // danh sách các select box
    const topicSelects = [
      document.getElementById("film-cate"),
      document.getElementById("music-cate"),
      document.getElementById("beauty-cate"),
      document.getElementById("life-cate"),
      document.getElementById("social-cate"),
      document.getElementById("health-cate"),
    ];
    // Hàm kiểm tra ít nhất 1 select được chọn
    function validateTopics() {
      const isTopicSelected = topicSelects.some(
        (select) => select.selectedIndex > 0
      );
      if (!isTopicSelected) {
        showError("article-topics", "Vui lòng chọn ít nhất 1 chủ đề");
        return false;
      }
      clearError("article-topics");
      return true;
    }
    // Hàm kiểm tra ảnh hợp lệ
    function validateImages(files) {
      let isValid = true;

      // Kiểm tra số lượng ảnh
      if (files.length === 0) {
        showError("articleImages", "Bài viết cần tối thiểu 1 ảnh");
        return false;
      }

      // Kiểm tra từng file
      files.forEach((file) => {
        if (!file.type.match("image.*")) {
          showError("articleImages", "Chỉ chấp nhận file ảnh (JPEG, PNG)");
          isValid = false;
        } else if (file.size > 5 * 1024 * 1024) {
          showError("articleImages", "Ảnh không được vượt quá 5MB");
          isValid = false;
        }
      });

      if (files.length > maxFiles) {
        showError("articleImages", `Bạn chỉ được chọn tối đa ${maxFiles} ảnh`);
        isValid = false;
      }

      if (isValid) clearError("articleImages");
      return isValid;
    }

    imageInput.addEventListener("change", function (e) {
      const files = Array.from(e.target.files);
      selectedFiles = files; // Cập nhật danh sách file

      if (validateImages(files)) {
        displayImagePreviews(files);
      } else {
        imagePreview.innerHTML = ""; // Xóa preview nếu có lỗi
      }
    });

    // Hàm hiển thị preview
    function displayImagePreviews(files) {
      imagePreview.innerHTML = ""; // Xóa preview cũ

      files.forEach((file, index) => {
        if (!file.type.match("image.*")) return;

        const reader = new FileReader();
        reader.onload = function (event) {
          const previewItem = document.createElement("div");
          previewItem.className = "image-preview-item";

          previewItem.innerHTML = `
              <img src="${event.target.result}" alt="Preview">
              <button type="button" class="remove-image-btn" data-index="${index}">&times;</button>
            `;

          // Xử lý nút xóa ảnh
          previewItem
            .querySelector(".remove-image-btn")
            .addEventListener("click", function () {
              const indexToRemove = parseInt(this.getAttribute("data-index"));
              selectedFiles.splice(indexToRemove, 1); // Xóa file khỏi mảng
              displayImagePreviews(selectedFiles); // Cập nhật lại preview
            });

          imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
      });
    }
    articleForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;
      const requiredFields = ["articleTitle", "tagInput", "articleContent"];
      requiredFields.forEach((field) => {
        const value = document.getElementById(field).value.trim();
        if (!value) {
          showError(field, "Thông tin bắt buộc");
          isValid = false;
        } else {
          clearError(field);
        }
      });
      isValid = validateTopics() && isValid;
      isValid = validateImages(selectedFiles) && isValid;
      if (isValid) {
        console.log("ok");
        const submitBtn = articleForm.querySelector(".btn-add");
        const originalText = submitBtn.innerHTML;

        // Hiệu ứng loading
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        submitBtn.disabled = true;

        // Giả lập gửi form (thực tế sẽ dùng fetch/axios)
        setTimeout(() => {
          // Xử lý gửi dữ liệu ở đây
          const formData = new FormData(articleForm);
          console.log("Form data:", Object.fromEntries(formData));

          // Hiển thị thông báo thành công
          showMessage("Gửi bài thành công!", "success");

          // Reset form
          articleForm.reset();
          document.getElementById("imagePreview").innerHTML = "";

          // Khôi phục nút submit
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
    topicSelects.forEach((select) => {
      select.addEventListener("change", validateTopics);
    });
  }
  //==================== XỬ LÝ LOGOUT ========================
  async function handleLogout() {
    const logoutBtn = document.getElementById("logout-btn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      try {
        // Gọi refresh để lấy access token mới
        const refreshRes = await fetch(
          "http://localhost:5501/api/auth/refresh",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshRes.ok) throw new Error("Không thể refresh token");

        const { accessToken } = await refreshRes.json();

        // Gửi logout kèm accessToken
        const res = await fetch("http://localhost:5501/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // 👈 gửi token ở đây
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

  // ==================== KHỞI TẠO CHÍNH ====================
  initAccountSection();
  initTabs();
  initAuthorRegistration();
  initAuthorSite();
  handleLogout();
});
