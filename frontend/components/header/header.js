function loadHeader() {
  return fetch("../../components/header/header.html")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    })
    .then((html) => {
      const headerPlaceholder = document.getElementById("headernav");
      if (!headerPlaceholder) throw new Error("Không tìm thấy #headernav");
      headerPlaceholder.innerHTML = html;
      if (typeof window.updateNavbarAuthState === "function") {
        window.updateNavbarAuthState();
      }
      return true;
    })
    .catch((error) => {
      console.error("Lỗi khi tải header:", error);
      return false;
    });
}

function loadFooter() {
  return fetch("../../components/footer/footer.html")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    })
    .then((html) => {
      const footerPlaceholder = document.getElementById("isfooter");
      if (!footerPlaceholder) throw new Error("Không tìm thấy #isfooter");
      footerPlaceholder.innerHTML = html;
      return true;
    })
    .catch((error) => {
      console.error("Lỗi khi tải footer:", error);
      return false;
    });
}

// Hàm xử lý scroll sau khi DOM đã sẵn sàng
function handleScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return; // Thoát nếu không tìm thấy .nav

  if (window.scrollY > 200) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}

// Hàm xử lý menu mobile
function setupMobileMenu() {
  const menu = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  if (!menu || !navbar) {
    console.error("Không tìm thấy menu hoặc navbar!");
    return;
  }
  const navbarLinks = document.querySelectorAll(".navbar a");
  const searchBox = document.querySelector(".search");

  if (!menu || !navbar) return;

  // Xử lý click menu icon
  menu.onclick = () => {
    console.log("Menu clicked!"); // Kiểm tra xem có log ra không
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("open");

    // Toggle body scroll khi menu mở
    document.body.style.overflow = navbar.classList.contains("open")
      ? "hidden"
      : "";
  };

  // Đóng menu khi click vào link
  navbarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("bx-x");
      navbar.classList.remove("open");
      document.body.style.overflow = ""; // Khôi phục scroll
    });
  });

  // Xử lý search box trên mobile
  if (searchBox) {
    searchBox.addEventListener("mouseenter", function () {
      if (window.matchMedia("(max-width: 991.98px)").matches) {
        navbarLinks.forEach((a) => {
          a.style.padding = "2rem 1vw";
        });
      }
    });
  }
}

// Hàm kiểm tra kích thước màn hình và xử lý responsive
function handleResponsive() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  // Nếu là màn hình lớn, đảm bảo menu đóng
  if (window.matchMedia("(min-width: 992px)").matches) {
    navbar.classList.remove("open");
    document.querySelector("#menu-icon")?.classList.remove("bx-x");
    document.body.style.overflow = ""; // Khôi phục scroll
  }
}

// Khởi tạo sau khi tất cả đã load xong
document.addEventListener("DOMContentLoaded", () => {
  Promise.all([loadHeader(), loadFooter()])
    .then(() => {
      // Gọi hàm xử lý scroll sau khi header/footer đã tải xong
      handleScroll();

      // Thiết lập menu mobile
      setupMobileMenu();

      // Thêm event listener cho scroll
      window.addEventListener("scroll", handleScroll);

      // Thêm event listener cho resize
      window.addEventListener("resize", handleResponsive);
    })
    .catch((error) => {
      console.error("Lỗi khi khởi tạo:", error);
    });
});
function base64UrlDecode(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Invalid base64 input");
  }

  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  return atob(base64);
}

window.updateNavbarAuthState = async function () {
  const loginLink = document.getElementById("login-link");
  const userInfoElement = document.querySelector(".user-info");
  const usernameElement = document.querySelector(".username");

  if (!loginLink || !userInfoElement || !usernameElement) {
    console.warn("Navbar chưa sẵn sàng, bỏ qua update UI");
    return;
  }

  try {
    const response = await fetch("http://localhost:5501/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Không lấy được access token");

    const data = await response.json();
    const accessToken = data.accessToken;

    if (!accessToken || accessToken.split(".").length !== 3) {
      throw new Error("Access token không hợp lệ");
    }

    const payloadBase64 = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(base64UrlDecode(payloadBase64));
    const username =
      decodedPayload.username ||
      decodedPayload.name ||
      decodedPayload.id ||
      "User";

    loginLink.style.display = "none";
    userInfoElement.style.display = "block";
    usernameElement.textContent = username;
  } catch (err) {
    console.warn("Không thể xác thực:", err.message);
    loginLink.style.display = "block";
    userInfoElement.style.display = "none";
  }
};
//tự động refresh token
window.setupAutoRefreshToken = async function () {
  const refreshInterval = 29 * 60 * 1000;

  async function refreshToken() {
    try {
      const response = await fetch("http://localhost:5501/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tự động refresh token");

      const data = await response.json();
      const accessToken = data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      console.log("✅ Access token refreshed!");
    } catch (err) {
      console.warn("⚠️ Auto refresh failed:", err.message);
    }
  }
  // Thiết lập auto-refresh định kỳ
  setInterval(refreshToken, refreshInterval);
};
