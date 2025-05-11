// ==================== CÁC HÀM MODAL TOÀN CỤC ====================
// Các biến toàn cục
let currentModal = null;
let itemToDelete = null;
let actionCallback = null;
let pendingAuthorMenuItem = null;
let hasPendingRequests = false;

// Hàm showToast
// Hiển thị thông báo
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Thêm style cho toast
const toastStyles = document.createElement("style");
toastStyles.textContent = `
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-success {
  background-color: #2ecc71;
}

.toast-error {
  background-color: #e74c3c;
}

.toast-info {
  background-color: #3498db;
}
`;

// Mở modal
function openModal(modalId) {
  currentModal = document.getElementById(modalId);
  if (currentModal) {
    currentModal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Gắn sự kiện click ra ngoài để đóng modal
    currentModal.addEventListener("click", handleOutsideClick);
  }
}
function handleOutsideClick(event) {
  // Nếu click vào chính phần overlay (modal), chứ không phải phần con bên trong
  if (event.target === currentModal) {
    closeModal();
  }
}

// Đóng modal
function closeModal() {
  if (currentModal) {
    currentModal.removeEventListener("click", handleOutsideClick); // gỡ sự kiện
    currentModal.style.display = "none";
    currentModal = null;
    document.body.style.overflow = "auto";
  }
}

// Hiển thị modal xác nhận
function showConfirmModal(message, callback) {
  const confirmModal = document.getElementById("confirmModal");
  if (confirmModal) {
    const modalBody = confirmModal.querySelector(".modal-body p");
    if (modalBody) modalBody.textContent = message;

    actionCallback = callback;
    openModal("confirmModal");
  } else {
    if (confirm(message)) {
      callback();
    }
  }
}

// Xác nhận hành động
async function confirmAction() {
  if (actionCallback) {
    try {
      await actionCallback();
    } catch (err) {
      console.error("Lỗi trong callback confirm:", err);
    }
    actionCallback = null;
  }
  closeModal();
}

// Helper: Chuyển đổi role sang tên hiển thị
function getRoleName(role) {
  const roles = {
    admin: "Quản trị viên",
    author: "Tác giả",
    user: "Người dùng",
  };
  return roles[role] || role;
}

// Helper: Chuyển đổi status sang tên hiển thị
function getStatusName(status) {
  const statuses = {
    active: "Hoạt động",
    banned: "Đã khóa",
    pending: "Chờ xác nhận",
  };
  return statuses[status] || status;
}

// Helper: Định dạng ngày tháng
function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    );
  } catch (e) {
    return dateString;
  }
}

// Helper: Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Helper: Hiển thị loading
function showLoading(selector) {
  const container = document.querySelector(selector);
  if (container) {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading-overlay";
    loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
    container.appendChild(loadingDiv);
  }
}

// Helper: Ẩn loading
function hideLoading(selector) {
  const container = document.querySelector(selector);
  if (container) {
    const loadingDiv = container.querySelector(".loading-overlay");
    if (loadingDiv) {
      loadingDiv.remove();
    }
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
