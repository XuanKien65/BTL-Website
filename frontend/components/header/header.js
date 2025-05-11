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

function handleScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  nav.classList.toggle("scrolled", window.scrollY > 200);
}

function setupMobileMenu() {
  const menu = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  if (!menu || !navbar) return;

  const navbarLinks = document.querySelectorAll(".navbar a");
  const searchBox = document.querySelector(".search");

  menu.onclick = () => {
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("open");
    document.body.style.overflow = navbar.classList.contains("open")
      ? "hidden"
      : "";
  };

  navbarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("bx-x");
      navbar.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

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

function handleResponsive() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  if (window.matchMedia("(min-width: 992px)").matches) {
    navbar.classList.remove("open");
    document.querySelector("#menu-icon")?.classList.remove("bx-x");
    document.body.style.overflow = "";
  }
}

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
    navbar.innerHTML = "";

    categories.forEach((parent) => {
      const li = document.createElement("li");
      li.className = "main-category";

      const a = document.createElement("a");
      a.className = "category";
      a.href = `/pages/topic.html?categoryName=${encodeURIComponent(
        parent.name
      )}`;
      a.textContent = parent.name;
      li.appendChild(a);

      if (parent.children && parent.children.length > 0) {
        const subnav = document.createElement("ul");
        subnav.className = "subnav";

        parent.children.forEach((child) => {
          const subLi = document.createElement("li");
          const subA = document.createElement("a");
          subA.className = "subnav-link";
          subA.href = `/pages/topic.html?categoryName=${encodeURIComponent(
            child.name
          )}`;
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

document.addEventListener("DOMContentLoaded", () => {
  Promise.all([loadHeader(), loadFooter(), loadCategoriesToNavbar()])
    .then(() => {
      loadHeaderFooterSettings();
      handleScroll();
      setupMobileMenu();
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResponsive);
    })
    .catch((error) => {
      console.error("Lỗi khi khởi tạo:", error);
    });
});

function base64UrlDecode(input) {
  if (!input || typeof input !== "string")
    throw new Error("Invalid base64 input");
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  return atob(base64);
}

function handleBannedUser(userData, userId) {
  if (userData?.data?.status === "banned") {
    console.warn("🚫 Tài khoản bị khóa!");
    window.isBannedUser = true;
    localStorage.setItem("bannedUser", "1");

    //Đảm bảo chỉ hiển thị modal 1 lần
    if (!window.bannedModalDisplayed) {
      window.bannedModalDisplayed = true;
      showBannedModal(userId);
    }

    return true;
  }

  //User không bị khóa
  localStorage.removeItem("bannedUser");
  window.isBannedUser = false;
  return false;
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

    const userRes = await fetch(`http://localhost:5501/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = await userRes.json();
    const isBanned = handleBannedUser(userData, userId);
    if (isBanned) return;

    loginLink = document.getElementById("login-link");
    userInfoElement = document.querySelector(".user-info");
    usernameElement = document.querySelector(".username");
    profileLink = document.getElementById("user-profile-link");

    const username =
      decodedPayload.username ||
      decodedPayload.name ||
      decodedPayload.id ||
      "User";

    if (loginLink && userInfoElement && usernameElement) {
      loginLink.style.display = "none";
      userInfoElement.style.display = "block";
      usernameElement.textContent = username;
    }

    if (profileLink && userId) {
      profileLink.href = `/pages/user-profile.html?id=${userId}`;
      profileLink.addEventListener("click", function (e) {
        if (!window.currentId) {
          e.preventDefault();
          alert("Thông tin người dùng chưa sẵn sàng!");
        }
      });
    }
  } catch (err) {
    console.warn("Không thể xác thực:", err.message);
    loginLink = document.getElementById("login-link");
    userInfoElement = document.querySelector(".user-info");

    if (loginLink && userInfoElement) {
      loginLink.style.display = "block";
      userInfoElement.style.display = "none";
    }
  }
};

function showBannedModal(userId) {
  const overlay = document.createElement("div");
  overlay.style = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
  `;

  const modal = document.createElement("div");
  modal.style = `
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    padding: 3rem 2rem 2rem;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    transform: translateY(30px);
    animation: modalEnter 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    position: relative;
    border: 1px solid rgba(255,255,255,0.2);
  `;

  modal.innerHTML = `
    <div style="
      position: absolute;
      top: -50px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 80px;
      background: linear-gradient(45deg, #ff4444, #dc3545);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(220,53,69,0.4);
      border: 3px solid #fff;
      animation: iconPulse 1.5s infinite ease-in-out;
    ">
      <svg style="width: 40px; height: 40px;" viewBox="0 0 24 24">
        <path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" 
              style="transform-origin: center; animation: iconShake 1.2s infinite;"/>
      </svg>
    </div>

    <h3 style="
      color: #2d3748;
      margin: 2.5rem 0 1.5rem;
      font-size: 3rem;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
      line-height: 1.3;
      letter-spacing: -0.5px;
    ">Tài Khoản Đã Bị Khóa</h3>
    
    <p style="
      color: #4a5568;
      line-height: 1.6;
      margin-bottom: 2.5rem;
      font-size: 2rem;
      padding: 0 1.5rem;
      font-family: 'Inter', sans-serif;
      font-weight: 400;
    ">Tài khoản của bạn đã bị khóa do vi phạm chính sách. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.</p>
    
    <button id="confirm-ban-btn" style="
      padding: 1rem 2.5rem;
      background: linear-gradient(135deg, #ff4444 0%, #dc3545 100%);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(220,53,69,0.3);
      font-family: 'Inter', sans-serif;
      letter-spacing: 0.5px;
      transform: translateZ(0);
    ">
      <span style="position: relative; z-index: 2">Xác Nhận</span>
      <div style="
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(120deg, 
          transparent 25%,
          rgba(255,255,255,0.25) 50%,
          transparent 75%);
        transition: 0.6s;
        z-index: 1;
      "></div>
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Thêm animation keyframes
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes modalEnter {
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
    
    @keyframes iconPulse {
      0% { transform: translateX(-50%) scale(1); }
      50% { transform: translateX(-50%) scale(1.15); }
      100% { transform: translateX(-50%) scale(1); }
    }
    
    @keyframes iconShake {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }
  `;
  document.head.appendChild(style);

  // Thêm hiệu ứng nút
  const btn = document.getElementById("confirm-ban-btn");
  btn.addEventListener("mouseover", () => {
    btn.style.transform = "translateZ(0) scale(1.05)";
    btn.querySelector("div").style.left = "200%";
  });

  btn.addEventListener("mouseout", () => {
    btn.style.transform = "translateZ(0) scale(1)";
    btn.querySelector("div").style.left = "-100%";
  });

  btn.addEventListener("mousedown", () => {
    btn.style.transform = "scale(0.95)";
  });

  btn.addEventListener("mouseup", () => {
    btn.style.transform = "scale(1.05)";
  });

  document
    .getElementById("confirm-ban-btn")
    .addEventListener("click", async () => {
      try {
        await fetch("http://localhost:5501/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.warn("Lỗi logout:", err);
      }

      // ✅ Dọn dẹp mọi thứ tận gốc
      resetUserStateCompletely();

      document.body.removeChild(overlay);
    });
}

window.setupAutoRefreshToken = async function () {
  if (window.isBannedUser) {
    console.warn("⛔ Không setup auto refresh vì user đã bị khóa.");
    return;
  }

  const refreshInterval = 29 * 60 * 1000;

  async function refreshToken() {
    if (window.isBannedUser) return;
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
  window.refreshIntervalId = setInterval(refreshToken, refreshInterval);
};

document.addEventListener("headerLoaded", () => {
  const searchInput = document.querySelector(".search input[type='text']");
  const searchButton = document.querySelector(".search button");

  function performSearch() {
    const keyword = searchInput?.value.trim();
    if (!keyword) return;
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

  if (typeof window.updateNavbarAuthState === "function") {
    window.updateNavbarAuthState();
  }
});

function resetUserStateCompletely() {
  console.warn("🧹 Reset toàn bộ trạng thái người dùng...");

  // Xóa toàn bộ thông tin từ window
  delete window.currentAccessToken;
  delete window.currentId;
  delete window.isBannedUser;
  delete window.updateNavbarAuthState;
  delete window.setupAutoRefreshToken;

  // Xóa flags
  window.bannedModalDisplayed = true;
  if (window.refreshIntervalId) {
    clearInterval(window.refreshIntervalId);
    window.refreshIntervalId = null;
  }

  // Xóa localStorage
  localStorage.clear();

  // Xóa tất cả cookie
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  console.log("✅ Toàn bộ thông tin người dùng đã được xoá.");
}

// Trong header.js
async function loadHeaderFooterSettings() {
  try {
    const response = await fetch("/api/homepage-settings");
    const result = await response.json();
    const data = result.data;
    const timestamp = `?t=${Date.now()}`;

    // ✅ Cập nhật logo
    if (data.logo_url) {
      document.querySelectorAll('.logo, .banner-logo').forEach(img => {
        img.src = data.logo_url + timestamp;
      });
    }

    // ✅ Cập nhật banner
    if (data.banner_url) {
      const bannerImg = document.querySelector('.banner-logo');
      if (bannerImg) bannerImg.src = data.banner_url + timestamp;
    }

    // ✅ Cập nhật footer
    if (data.slogan) {
      const sloganEl = document.querySelector('#footer-slogan');
      if (sloganEl) sloganEl.textContent = data.slogan;
    }

    if (data.contact_info) {
      document.getElementById('footer-address').innerHTML =
        `<strong>Location:</strong> ${data.contact_info.address}`;
      document.getElementById('footer-email').innerHTML =
        `<strong>Email:</strong> ${data.contact_info.email}`;
      document.getElementById('footer-phone').innerHTML =
        `<strong>Phone:</strong> ${data.contact_info.phone}`;
    }

  } catch (error) {
    console.error('Lỗi tải cài đặt:', error);
  }
}

