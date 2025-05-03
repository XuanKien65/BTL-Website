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
      document.dispatchEvent(new Event("headerLoaded"));
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

//Khởi tạo category
async function loadCategoriesToNavbar() {
  try {
    const response = await fetch("http://localhost:5501/api/categories");
    const result = await response.json();

    if (!result.success) {
      console.error("Không lấy được categories:", result.message);
      return;
    }

    const categories = result.data;
    const navbar = document.querySelector(".navbar");
    navbar.innerHTML = ""; // Clear cũ nếu có

    categories.forEach((parent) => {
      const li = document.createElement("li");
      li.className = "main-category";

      const a = document.createElement("a");
      a.className = "category";
      a.href = "http://localhost:5501/pages/topic.html"; //sửa lại sau khi có topic
      a.textContent = parent.name;
      li.appendChild(a);

      // Nếu có danh mục con
      if (parent.children && parent.children.length > 0) {
        const subnav = document.createElement("ul");
        subnav.className = "subnav";

        parent.children.forEach((child) => {
          const subLi = document.createElement("li");
          const subA = document.createElement("a");
          subA.className = "subnav-link";
          subA.href = `http://localhost:5501/pages/topic.html`; //sửa lại sau khi có topic
          subA.textContent = child.name;

          subLi.appendChild(subA);
          subnav.appendChild(subLi);
        });

        li.appendChild(subnav);
      }

      navbar.appendChild(li);
    });
  } catch (error) {
    console.error("Lỗi khi load categories:", error);
  }
}

// Khởi tạo sau khi tất cả đã load xong
document.addEventListener("DOMContentLoaded", () => {
  Promise.all([loadHeader(), loadFooter(), loadCategoriesToNavbar()])
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

window.currentId = null;
window.currentAccessToken = null;
window.updateNavbarAuthState = async function () {
  let loginLink, userInfoElement, usernameElement, profileLink;

  try {
    const response = await fetch("http://localhost:5501/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Không lấy được access token");

    const data = await response.json();
    const accessToken = data.accessToken;
    window.currentAccessToken = accessToken;

    if (!accessToken || accessToken.split(".").length !== 3) {
      throw new Error("Access token không hợp lệ");
    }

    const payloadBase64 = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(base64UrlDecode(payloadBase64));
    const userId = decodedPayload.id;
    window.currentId = userId;

    const username =
      decodedPayload.username ||
      decodedPayload.name ||
      decodedPayload.id ||
      "User";

    // DOM elements
    loginLink = document.getElementById("login-link");
    userInfoElement = document.querySelector(".user-info");
    usernameElement = document.querySelector(".username");
    profileLink = document.getElementById("user-profile-link");

    // Cập nhật UI nếu DOM sẵn sàng
    if (loginLink && userInfoElement && usernameElement) {
      loginLink.style.display = "none";
      userInfoElement.style.display = "block";
      usernameElement.textContent = username;
    } else {
      console.warn("Không thể cập nhật UI navbar – DOM chưa sẵn sàng");
    }

    // Gán link đến trang profile nếu có ID
    if (profileLink && userId) {
      profileLink.href = `/pages/user-profile.html?id=${userId}`;

      // Phòng khi userId vẫn chưa có
      profileLink.addEventListener("click", function (e) {
        if (!window.currentId) {
          e.preventDefault();
          alert("Thông tin người dùng chưa sẵn sàng!");
        }
      });
    }
  } catch (err) {
    console.warn("Không thể xác thực:", err.message);

    // Thử lấy lại các phần tử DOM để ẩn phần user nếu cần
    loginLink = document.getElementById("login-link");
    userInfoElement = document.querySelector(".user-info");

    if (loginLink && userInfoElement) {
      loginLink.style.display = "block";
      userInfoElement.style.display = "none";
    }
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
      window.currentAccessToken = accessToken;
    } catch (err) {
      console.warn("⚠️ Auto refresh failed:", err.message);
    }
  }
  await refreshToken();
  setInterval(refreshToken, refreshInterval);
};
console.log(window.currentAccessToken);

document.addEventListener("headerLoaded", () => {
  const searchInput = document.querySelector(".search input[type='text']");
  const searchButton = document.querySelector(".search button");

  function performSearch() {
    const keyword = searchInput.value.trim();
    if (!keyword) {
      // alert("Vui lòng nhập từ khóa để tìm kiếm.");
      return;
    }
    const encoded = encodeURIComponent(keyword);
    window.location.href = `/pages/search.html?keyword=${encoded}`;
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", performSearch);
  }
});
