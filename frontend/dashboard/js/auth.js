// ==================== AUTH TOKEN ====================
let accessToken = null;
let tokenExpiration = 0;
let refreshInProgress = null;

async function getAccessTokenFromRefresh() {
  if (accessToken && Date.now() < tokenExpiration) {
    console.log("✅ Token còn hiệu lực, không cần refresh.");
    return accessToken;
  }

  if (refreshInProgress) {
    console.log("⏳ Chờ refresh token hiện tại hoàn tất...");
    return refreshInProgress;
  }

  refreshInProgress = (async () => {
    try {
      console.log("🔁 Gọi API refresh...");
      const response = await fetch("http://localhost:5501/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      console.log("📡 Kết quả phản hồi từ refresh API:", response.status);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Không thể làm mới access token (Status: ${response.status}, Body: ${text})`);
      }

      const data = await response.json();
      accessToken = data.accessToken;

      const payload = JSON.parse(atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      tokenExpiration = payload.exp * 1000;

      console.log("✅ Access token mới nhận:", accessToken);
      console.log("⌛ Token sẽ hết hạn lúc:", new Date(tokenExpiration).toLocaleString());

      return accessToken;
    } catch (error) {
      console.error("💥 Lỗi refresh token:", error);
      throw error;
    } finally {
      refreshInProgress = null; // ✅ Reset sau khi xong
    }
  })();

  return refreshInProgress;
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
