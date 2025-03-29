document.addEventListener("DOMContentLoaded", function () {
  // Simulated user data (in a real app, this would come from an API)
  const userData = {
    id: 12345,
    username: "nguyenvana",
    fullname: "Nguyễn Văn A",
    email: "user@example.com",
    phone: "0987654321",
    birthday: "1990-01-01",
    gender: "male",
    address: "27 Trần Phú, Hà Đông, Hà Nội",
    avatar: "../the-outsider/assets/img/image-amyrobson.png",
    readCount: 128,
    savedCount: 24,
    joinDate: "12/2023",
  };

  // DOM Elements
  const accountForm = document.getElementById("account-form");
  const passwordForm = document.getElementById("password-form");
  const passwordModal = document.getElementById("password-modal");
  const changePasswordBtn = document.getElementById("change-password-btn");
  const changeAvatarBtn = document.getElementById("change-avatar-btn");
  const avatarUpload = document.getElementById("avatar-upload");
  const userAvatar = document.getElementById("user-avatar");
  const logoutBtn = document.getElementById("logout-btn");

  // Initialize form with user data
  function initUserData() {
    document.getElementById("fullname").value = userData.fullname;
    document.getElementById("email").value = userData.email;
    document.getElementById("phone").value = userData.phone;
    document.getElementById("birthday").value = userData.birthday;
    document.getElementById("gender").value = userData.gender;
    document.getElementById("address").value = userData.address;
    document.getElementById("display-username").textContent = userData.fullname;
    document.getElementById("display-email").textContent = userData.email;
    document.getElementById("read-count").textContent = userData.readCount;
    document.getElementById("saved-count").textContent = userData.savedCount;
    document.getElementById("join-date").textContent = userData.joinDate;
    userAvatar.src = userData.avatar;
  }

  // Handle account form submission
  accountForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = accountForm.querySelector(".btn-save");
    const originalBtnText = submitBtn.textContent;
    submitBtn.innerHTML = '<div class="loading-spinner"></div>';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Update user data
      userData.fullname = document.getElementById("fullname").value;
      userData.phone = document.getElementById("phone").value;
      userData.birthday = document.getElementById("birthday").value;
      userData.gender = document.getElementById("gender").value;
      userData.address = document.getElementById("address").value;

      // Update displayed name
      document.getElementById("display-username").textContent =
        userData.fullname;

      // Reset button
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;

      // Show success message
      showMessage("Cập nhật thông tin thành công!", "success");
    }, 1500);
  });

  // Handle password change form submission
  passwordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate passwords
    if (newPassword !== confirmPassword) {
      showMessage("Mật khẩu mới không khớp!", "error");
      return;
    }

    if (newPassword.length < 6) {
      showMessage("Mật khẩu phải có ít nhất 6 ký tự!", "error");
      return;
    }

    // Show loading state
    const submitBtn = passwordForm.querySelector(".btn-save");
    const originalBtnText = submitBtn.textContent;
    submitBtn.innerHTML = '<div class="loading-spinner"></div>';
    submitBtn.disabled = true;

    // Simulate API call to change password
    setTimeout(() => {
      // In a real app, you would send this to your backend
      console.log("Password changed successfully");

      // Reset form and button
      passwordForm.reset();
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;

      // Close modal and show success message
      passwordModal.style.display = "none";
      showMessage("Đổi mật khẩu thành công!", "success");
    }, 1500);
  });

  // Toggle password visibility
  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const passwordInput = document.getElementById(targetId);

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      }
    });
  });

  // Handle avatar upload
  changeAvatarBtn.addEventListener("click", function () {
    avatarUpload.click();
  });

  avatarUpload.addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (event) {
        userAvatar.src = event.target.result;
        userData.avatar = event.target.result;

        // In a real app, you would upload the image to your server here
        showMessage("Ảnh đại diện đã được cập nhật!", "success");
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Handle logout
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // In a real app, you would call your logout API
    // Then redirect to login page
    window.location.href = "/login/login_ver2.html";
  });

  // Show message function
  function showMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = text;

    // Insert after the form
    accountForm.parentNode.insertBefore(messageDiv, accountForm.nextSibling);

    // Show the message
    messageDiv.style.display = "block";

    // Remove after 3 seconds
    setTimeout(() => {
      messageDiv.style.opacity = "0";
      setTimeout(() => {
        messageDiv.remove();
      }, 300);
    }, 3000);
  }

  // Initialize the page
  initUserData();
});

document.addEventListener("DOMContentLoaded", function () {
  const togglePasswordBtn = document.getElementById("toggle-password-btn");
  const changePasswordForm = document.getElementById("change-password-form");

  // Toggle form đổi mật khẩu
  togglePasswordBtn.addEventListener("click", function () {
    if (changePasswordForm.style.display === "none") {
      // Hiển thị form
      changePasswordForm.style.display = "block";
      togglePasswordBtn.textContent = "Đóng";
    } else {
      // Ẩn form
      changePasswordForm.style.display = "none";
      togglePasswordBtn.textContent = "Đổi mật khẩu";
    }
  });

  // Xử lý submit đổi mật khẩu
  const submitPasswordChange = document.getElementById(
    "submit-password-change"
  );
  submitPasswordChange.addEventListener("click", function () {
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Gửi yêu cầu đổi mật khẩu (ở đây chỉ là demo)
    console.log("Đang đổi mật khẩu...", {
      currentPassword,
      newPassword,
    });

    // Hiển thị thông báo thành công
    alert("Đổi mật khẩu thành công!");

    // Reset form và ẩn đi
    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
    changePasswordForm.style.display = "none";
    togglePasswordBtn.textContent = "Đổi mật khẩu";
  });
});
// Hàm hiển thị tab được chọn
function showTab(tabName) {
  // Ẩn tất cả các tab
  document.querySelectorAll(".account-tab").forEach((tab) => {
    tab.style.display = "none";
  });

  // Xóa active class từ tất cả các tab menu
  document.querySelectorAll(".account-menu li").forEach((item) => {
    item.classList.remove("active");
  });

  // Hiển thị tab được chọn và thêm active class cho menu
  if (tabName === "saved-articles") {
    document.getElementById("saved-articles").style.display = "block";
    document
      .querySelector('.account-menu a[href="#saved-articles"]')
      .parentElement.classList.add("active");
  } else {
    // Mặc định hiển thị tab thông tin cá nhân
    document.getElementById("account-info").style.display = "block";
    document
      .querySelector('.account-menu a[href="#account-info"]')
      .parentElement.classList.add("active");
  }
}

// Khởi tạo - hiển thị tab thông tin cá nhân khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  showTab("account-info"); // Tab mặc định

  // Thêm sự kiện click cho các tab menu
  document.querySelectorAll(".account-menu a").forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabName = this.getAttribute("href").substring(1); // Bỏ ký tự #
      showTab(tabName);
    });
  });
});

// Xử lý nút bỏ lưu bài viết
document.querySelectorAll(".btn-unsave").forEach((btn) => {
  btn.addEventListener("click", function () {
    const articleId = this.getAttribute("data-article-id");
    const articleItem = this.closest(".saved-article-item");

    // Hiệu ứng loading
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    this.disabled = true;

    // Giả lập API call
    setTimeout(() => {
      // Xóa bài viết khỏi danh sách
      articleItem.style.opacity = "0";
      setTimeout(() => {
        articleItem.remove();

        // Cập nhật số lượng bài viết đã lưu
        updateSavedCount();
      }, 300);

      console.log(`Đã bỏ lưu bài viết ID: ${articleId}`);
    }, 1000);
  });
});

function updateSavedCount() {
  const count = document.querySelectorAll(".saved-article-item").length;
  document.getElementById("saved-count").textContent = count;

  // Xóa thông báo cũ nếu tồn tại
  const existingMessage = document.querySelector(".empty-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Nếu không còn bài viết nào
  if (count === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-message";
    emptyMessage.innerHTML = `
      <h3>Bạn chưa lưu bài viết nào</h3>
    `;
    document.querySelector(".saved-articles-list").appendChild(emptyMessage);
  }
}

// Kiểm tra nếu không có bài viết nào khi tải trang
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelectorAll(".saved-article-item").length === 0) {
    updateSavedCount();
  }
});
// Biến lưu trữ
let currentPage = 1;
const itemsPerPage = 5;
let allArticles = [];

// Hàm khởi tạo phân trang
function initPagination() {
  allArticles = Array.from(document.querySelectorAll(".saved-article-item"));
  updatePagination();
  showPage(currentPage);
}

// Hàm hiển thị trang cụ thể
function showPage(page) {
  currentPage = page;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Ẩn tất cả bài viết
  allArticles.forEach((article) => {
    article.style.display = "none";
  });

  // Hiển thị bài viết trong trang hiện tại
  const visibleArticles = allArticles.slice(startIndex, endIndex);
  visibleArticles.forEach((article) => {
    article.style.display = "flex"; // Hoặc 'block' tùy vào CSS của bạn
  });

  // Cập nhật trạng thái nút phân trang
  updatePaginationButtons();
}

// Hàm cập nhật nút phân trang
function updatePaginationButtons() {
  const totalPages = Math.ceil(allArticles.length / itemsPerPage);
  const pageButtons = document.querySelectorAll(".page-btn");

  // Xóa active khỏi tất cả nút
  pageButtons.forEach((btn) => {
    btn.classList.remove("active");
    const pageNum = parseInt(btn.textContent);
    btn.style.display = pageNum <= totalPages ? "block" : "none";
  });

  // Active trang hiện tại
  const currentPageBtn = document.querySelector(
    `.page-btn:nth-child(${currentPage})`
  );
  if (currentPageBtn) {
    currentPageBtn.classList.add("active");
  }

  // Ẩn nút "Tiếp" nếu ở trang cuối
  document.querySelector(".next-btn").style.display =
    currentPage >= totalPages ? "none" : "block";
}

// Hàm cập nhật toàn bộ phân trang
function updatePagination() {
  const totalPages = Math.ceil(allArticles.length / itemsPerPage);
  const paginationContainer = document.querySelector(".pagination");

  // Xóa các nút trang cũ (giữ lại nút "Tiếp")
  const nextBtn = document.querySelector(".next-btn");
  paginationContainer.innerHTML = "";

  // Tạo nút trang mới
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-btn ${i === 1 ? "active" : ""}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener("click", () => showPage(i));
    paginationContainer.appendChild(pageBtn);
  }

  // Thêm nút "Tiếp" lại
  paginationContainer.appendChild(nextBtn);
  nextBtn.addEventListener("click", () => showPage(currentPage + 1));
}

// Hàm cập nhật khi xóa bài viết
function handleUnsaveArticle() {
  const articleId = this.getAttribute("data-article-id");
  const articleItem = this.closest(".saved-article-item");
  const originalText = this.innerHTML;

  this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
  this.disabled = true;

  setTimeout(() => {
    articleItem.style.opacity = "0";
    setTimeout(() => {
      articleItem.remove();
      // Cập nhật danh sách bài viết và phân trang
      allArticles = Array.from(
        document.querySelectorAll(".saved-article-item")
      );
      updateSavedCount();
      updatePagination();
      showPage(
        Math.min(currentPage, Math.ceil(allArticles.length / itemsPerPage))
      );
    }, 300);
  }, 1000);
}

// Khởi tạo khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  initPagination();

  // Cập nhật lại phân trang khi có thay đổi
  document.querySelectorAll(".btn-unsave").forEach((btn) => {
    btn.addEventListener("click", handleUnsaveArticle);
  });
});
