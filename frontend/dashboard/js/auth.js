// ==================== AUTH TOKEN ====================
let accessToken = null;
let tokenExpiration = 0;
async function getAccessTokenFromRefresh() {
  // Kiểm tra nếu token còn hiệu lực
  if (accessToken && Date.now() < tokenExpiration) {
    return accessToken;
  }

  try {
    const response = await fetch("http://localhost:5501/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Không thể làm mới access token");
    }

    const data = await response.json();
    accessToken = data.accessToken;

    // Giả sử token hết hạn sau 30 phút (1800s)
    tokenExpiration = Date.now() + 1800 * 1000;

    return accessToken;
  } catch (error) {
    console.error("Lỗi refresh token:", error);
    window.location.href = "http://localhost:5501/pages/login.html";
    throw error;
  }
}

// ==================== XỬ LÝ LOGOUT ====================
document
  .querySelector(".sidebar-footer .sidebar-link")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const token = await getAccessTokenFromRefresh();

      const response = await fetch("http://localhost:5501/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        // Xóa token và chuyển hướng
        accessToken = null;
        tokenExpiration = 0;
        window.location.href = "http://localhost:5501/pages/login.html";
      } else {
        const errorData = await response.json();
        showToast(errorData.message || "Đăng xuất thất bại", "error");
      }
    } catch (error) {
      console.error("Lỗi logout:", error);
      showToast("Lỗi kết nối khi đăng xuất", "error");
    }
  });