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
    toolbar: ["imageTextAlternative"],
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

// Viết thêm adapter:
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file) => {
      const data = new FormData();
      data.append("upload", file);

      return fetch("http://localhost:5501/api/uploads", {
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
  async function loadCategories() {
    try {
      const response = await fetch(
        "http://localhost:5501/api/categories?parent_id=null"
      );
      const result = await response.json();

      if (result.success) {
        const categories = result.data;
        const checkboxGroup = document.querySelector(".checkbox-group");
        checkboxGroup.innerHTML = ""; // Clear dữ liệu mẫu

        categories.forEach((category) => {
          const label = document.createElement("label");
          label.innerHTML = `
            <input type="checkbox" name="topics" value="${category.id}" />
            ${category.name}
          `;
          checkboxGroup.appendChild(label);
        });
      } else {
        console.error("Load categories thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi load categories:", error);
    }
  }
  function initAuthorRegistration() {
    loadCategories();
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
    articleForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let isValid = true;
      const requiredFields = ["articleTitle", "tagInput"];
      requiredFields.forEach((field) => {
        const value = document.getElementById(field).value.trim();
        if (!value) {
          showError(field, "Thông tin bắt buộc");
          isValid = false;
        } else {
          clearError(field);
        }
      });

      const editorContent = window.articleEditor.getData();
      if (!editorContent.trim()) {
        showError("articleContent", "Nội dung bài viết không được để trống");
        isValid = false;
      } else {
        clearError("articleContent");
      }

      isValid = validateTopics() && isValid;
      isValid = validateImages(selectedFiles) && isValid;

      if (isValid) {
        const submitBtn = articleForm.querySelector(".btn-add");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        submitBtn.disabled = true;

        try {
          const formData = new FormData(articleForm);
          formData.set("articleContent", editorContent);

          const topicSelects = document.querySelectorAll(
            ".category-selects select"
          );
          const selectedCategoryIds = Array.from(topicSelects)
            .map((select) => select.value)
            .filter((value) => value !== "");

          selectedCategoryIds.forEach((categoryId) => {
            formData.append("categoryIds[]", categoryId);
          });

          const accessToken = window.currentAccessToken;
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
            showMessage("Gửi bài thành công!", "success");
            articleForm.reset();
            imagePreview.innerHTML = "";
            window.articleEditor.setData("");
          } else {
            showMessage("Đăng bài thất bại: " + result.message, "error");
          }
        } catch (error) {
          console.error("Error submitting article:", error);
          showMessage("Có lỗi xảy ra, vui lòng thử lại sau!", "error");
        } finally {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }
    });
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
          showMessage("Gửi bài thành công!", "success");
          articleForm.reset();
          imagePreview.innerHTML = "";
          window.articleEditor.setData("");
        } else {
          showMessage("Đăng bài thất bại: " + result.message, "error");
        }
      } catch (error) {
        console.error("Error submitting article:", error);
        showMessage("Có lỗi xảy ra, vui lòng thử lại sau!", "error");
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
