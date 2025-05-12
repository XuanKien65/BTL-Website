// ==================== CÁC HÀM KHỞI TẠO ====================

// Khởi tạo sidebar với hover
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  let hoverTimeout;

  sidebar.addEventListener("mouseenter", () => {
    clearTimeout(hoverTimeout);
    document.body.classList.add("sidebar-expanded");
  });

  sidebar.addEventListener("mouseleave", () => {
    hoverTimeout = setTimeout(() => {
      document.body.classList.remove("sidebar-expanded");
    }, 300);
  });
}

// Khởi tạo các tab
function initTabs() {
  const navLinks = document.querySelectorAll(".sidebar-nav a");
  const contentSections = document.querySelectorAll(".content-section");

  // Lấy hash từ URL nếu có
  const hash = window.location.hash;
  let activeTab = hash || "#dashboard";

  // Kích hoạt tab từ hash
  activateTab(activeTab);

  // Thêm sự kiện click cho các nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const target = this.getAttribute("href");
        activateTab(target);
        history.pushState(null, null, target);
      }
    });
  });
}

// Kích hoạt tab
function activateTab(target) {
  // Ẩn tất cả các section
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active");
  });

  // Xóa active class từ tất cả các nav item
  document.querySelectorAll(".sidebar-nav li").forEach((item) => {
    item.classList.remove("active");
  });

  // Thêm active class cho nav item tương ứng
  const navItem = document.querySelector(
    `.sidebar-nav a[href="${target}"]`
  )?.parentElement;
  if (navItem) {
    navItem.classList.add("active");
  }

  // Hiển thị section tương ứng
  const targetSection = document.querySelector(target);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Cập nhật tiêu đề header
  updateHeaderTitle(target);
}

// Cập nhật tiêu đề header
function updateHeaderTitle(target) {
  const headerTitle = document.querySelector(".header-left h1");
  const sectionTitle = document.querySelector(`${target} .section-header h2`);

  if (headerTitle) {
    if (sectionTitle) {
      headerTitle.textContent = sectionTitle.textContent;
    } else {
      headerTitle.textContent = "Dashboard";
    }
  }
}

// Khởi tạo các modal
function initModals() {
  // Mở modal
  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal");
      openModal(modalId);
    });
  });

  // Đóng modal khi click nút đóng
  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  // Đóng modal khi click bên ngoài
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal();
      }
    });
  });

  // Đóng modal khi nhấn ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && currentModal) {
      closeModal();
    }
  });
}

function updateGreeting() {
  const greetingMain = document.querySelector(".greeting-main");
  const greetingIcon = document.querySelector(".greeting-icon");
  const greetingMessage = document.querySelector(".greeting-message");
  const userName = document.querySelector(".user-name")?.textContent || "bạn";

  const now = new Date();
  const hour = now.getHours();

  let greetingKey = "";
  let messageKey = "";
  let icon = "";

  if (hour >= 5 && hour < 11) {
    greetingKey = "greet-morning";
    messageKey = "greet-morning-msg";
    icon = "wb_sunny";
  } else if (hour >= 11 && hour < 14) {
    greetingKey = "greet-noon";
    messageKey = "greet-noon-msg";
    icon = "lunch_dining";
  } else if (hour >= 14 && hour < 18) {
    greetingKey = "greet-afternoon";
    messageKey = "greet-afternoon-msg";
    icon = "wb_cloudy";
  } else if (hour >= 18 && hour < 23) {
    greetingKey = "greet-evening";
    messageKey = "greet-evening-msg";
    icon = "nightlight";
  } else {
    greetingKey = "greet-night";
    messageKey = "greet-night-msg";
    icon = "nights_stay";
  }

  if (greetingMain) {
    greetingMain.setAttribute("data-i18n", greetingKey);
    greetingMain.innerHTML = `${i18next.t(
      greetingKey
    )}, <span class="user-name">${userName}</span>`;
  }

  if (greetingMessage) {
    greetingMessage.setAttribute("data-i18n", messageKey);
    greetingMessage.textContent = i18next.t(messageKey);
  }

  if (greetingIcon) {
    greetingIcon.textContent = icon;
  }
}

document.addEventListener("DOMContentLoaded", updateGreeting);

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".settings-tab");
  const tabContents = document.querySelectorAll(".settings-tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Bỏ active khỏi tất cả
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Thêm active cho cái được chọn
      this.classList.add("active");
      document.getElementById(targetTab)?.classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("dark-mode"); // checkbox trong cài đặt
  const iconToggle =
    document.querySelector(".material-icons[title='darkmode']") ||
    document.querySelector(".material-icons.toggle-dark");

  // Hàm cập nhật giao diện & icon
  function applyDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
      if (darkModeToggle) darkModeToggle.checked = true;
      if (iconToggle) iconToggle.innerText = "dark_mode";
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
      if (darkModeToggle) darkModeToggle.checked = false;
      if (iconToggle) iconToggle.innerText = "light_mode";
    }
    updateChartTheme();
  }

  // Khi load trang: áp dụng dark mode nếu đã lưu
  applyDarkMode(localStorage.getItem("darkMode") === "enabled");

  // Sự kiện checkbox (cài đặt)
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", () => {
      applyDarkMode(darkModeToggle.checked);
    });
  }

  // Sự kiện icon trên navbar
  if (iconToggle) {
    iconToggle.style.cursor = "pointer";
    iconToggle.addEventListener("click", () => {
      const enabled = !document.body.classList.contains("dark-mode");
      applyDarkMode(enabled);
    });
  }
});

function updateText(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const rawKey = el.getAttribute("data-i18n");
    let value;

    if (rawKey.includes(".")) {
      const [mainKey, subKey] = rawKey.split(".");
      const data = translations[lang]?.[mainKey];
      if (Array.isArray(data)) {
        value = data[parseInt(subKey)];
      } else if (typeof data === "object" && data !== null) {
        value = data[subKey];
      }
    } else {
      value = translations[lang]?.[rawKey];
      if (Array.isArray(value)) value = value[0];
    }

    if (value) {
      if ("placeholder" in el) {
        el.placeholder = value;
      } else if (el.tagName === "OPTION") {
        el.textContent = value;
      } else {
        el.innerText = value;
      }
    }
  });
}

document.getElementById("language").addEventListener("change", function () {
  const selectedLang = this.value;
  localStorage.setItem("lang", selectedLang); // Lưu ngôn ngữ đã chọn
  updateText(selectedLang);
});

// Tải lại trang vẫn giữ ngôn ngữ cũ
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "vietnamese";
  document.getElementById("language").value = savedLang;
  updateText(savedLang);
});

document.getElementById("languageToggle").addEventListener("click", () => {
  // Lấy lang hiện tại
  const currentLang = localStorage.getItem("lang") || "vietnamese";

  // Đổi ngôn ngữ
  const newLang = currentLang === "vietnamese" ? "english" : "vietnamese";
  localStorage.setItem("lang", newLang);

  // Gọi lại hàm dịch
  updateText(newLang);

  // (Tùy chọn) đổi icon theo ngôn ngữ
  const icon = document.getElementById("languageToggle");
  icon.src =
    newLang === "vietnamese"
      ? "https://tinyurl.com/ybzjcrrj"
      : "https://flagcdn.com/gb.svg"; // ví dụ icon English
  icon.alt = newLang === "vietnamese" ? "Vietnam" : "English";
});

document.getElementById("fontSizeSelect").addEventListener("change", (e) => {
  const size = e.target.value;

  document.documentElement.classList.remove(
    "font-small",
    "font-medium",
    "font-large"
  );
  document.documentElement.classList.add(`font-${size}`);

  // Lưu lại nếu cần dùng sau
  localStorage.setItem("fontSize", size);
});

document
  .getElementById("saveSettingsBtn")
  .addEventListener("click", (event) => {
    event.preventDefault(); // ✅ chặn form submit reload

    const token = localStorage.getItem("accessToken");
    if (!token) return alert("Bạn chưa đăng nhập.");

    const settings = {
      dark_mode: localStorage.getItem("darkMode") === "enabled",
      language: localStorage.getItem("lang") || "vietnamese",
      font_size: localStorage.getItem("fontSize") || "medium",
    };

    fetch("/api/user-settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lưu");
        return res.json();
      })
      .then(() => alert("Đã lưu cài đặt thành công!"))
      .catch(() => alert("Lưu cài đặt thất bại."));
  });

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  fetch("/api/user-settings", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((settings) => {
      if (!settings) return;

      // 1. Áp dụng dark mode
      const enableDark = settings.dark_mode;
      if (enableDark) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
      }

      // 2. Áp dụng ngôn ngữ
      if (settings.language) {
        localStorage.setItem("lang", settings.language);
        document.getElementById("language").value = settings.language;
        updateText(settings.language);
      }

      // 3. Áp dụng font size
      if (settings.font_size) {
        document.documentElement.classList.remove(
          "font-small",
          "font-medium",
          "font-large"
        );
        document.documentElement.classList.add(`font-${settings.font_size}`);
        document.getElementById("fontSizeSelect").value = settings.font_size;
        localStorage.setItem("fontSize", settings.font_size);
      }
    })
    .catch((err) => {
      console.warn("Không thể tải cài đặt người dùng:", err);
    });
});

// ==================== HOME PAGE SETTINGS ====================
// Xử lý upload ảnh
function handleImageUpload(input, previewId) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById(previewId).innerHTML = `
        <img src="${e.target.result}" alt="Preview" class="preview-image">
      `;
    };
    reader.readAsDataURL(file);
  }
}

// Xử lý submit form để cập nhật real-time
async function handleSettingsSubmit(e) {
  e.preventDefault();

  const formData = new FormData();

  const slogan = document.getElementById("homepageSlogan").value;
  const address = document.getElementById("footerAddress").value;
  const email = document.getElementById("footerEmail").value;
  const phone = document.getElementById("footerPhone").value;
  const logoFile = document.getElementById("homepageLogoUpload").files[0];
  const bannerFile = document.getElementById("homepageBannerUpload").files[0];

  // Append từng trường nếu có giá trị
  if (slogan) formData.append("slogan", slogan);
  if (address) formData.append("address", address);
  if (email) formData.append("email", email);
  if (phone) formData.append("phone", phone);
  if (logoFile) formData.append("logo", logoFile);
  if (bannerFile) formData.append("banner", bannerFile);

  try {
    const response = await fetch("/api/homepage-settings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await getAccessTokenFromRefresh()}`,
        // Không đặt 'Content-Type' khi dùng FormData
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Cập nhật thất bại");

    showToast("Cập nhật thành công!", "success");
    setTimeout(() => location.reload(), 1500);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function loadHomepageSettings() {
  try {
    const response = await fetch("/api/homepage-settings");
    const data = await response.json();

    if (data.slogan)
      document.getElementById("homepageSlogan").value = data.slogan;
    if (data.address)
      document.getElementById("footerAddress").value = data.address;
    if (data.email) document.getElementById("footerEmail").value = data.email;
    if (data.phone) document.getElementById("footerPhone").value = data.phone;

    // Cập nhật preview ảnh
    const updatePreview = (previewId, url) => {
      if (url) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${url}?t=${Date.now()}" class="preview-image">`;
      }
    };

    updatePreview("homepageLogoPreview", data.logoUrl);
    updatePreview("homepageBannerPreview", data.bannerUrl);
  } catch (error) {
    console.error("Lỗi tải cài đặt:", error);
  }
}

// Khởi tạo sự kiện
document.addEventListener("DOMContentLoaded", () => {
  loadHomepageSettings();
  // Xử lý preview ảnh
  document
    .getElementById("homepageLogoUpload")
    .addEventListener("change", (e) => {
      handleImageUpload(e.target, "homepageLogoPreview");
    });

  document
    .getElementById("homepageBannerUpload")
    .addEventListener("change", (e) => {
      handleImageUpload(e.target, "homepageBannerPreview");
    });

  // Submit form
  document
    .querySelector("#general form")
    .addEventListener("submit", handleSettingsSubmit);
});
