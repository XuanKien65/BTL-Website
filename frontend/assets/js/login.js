// ========== DOM ELEMENTS ==========
const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
const loginForm = document.querySelector(".login form");
const registerForm = document.querySelector(".register form");

// Input fields
const loginEmailInput = document.querySelector(
  ".login .input-box input[type='email']"
);
const registerUsernameInput = document.querySelector(
  ".register .input-box input[type='text']"
);
const loginPasswordInput = document.querySelector(
  ".login .input-box input[type='password']"
);
const registerPasswordInput = document.querySelector(
  ".register .input-box input[type='password']"
);
const registerEmailInput = document.querySelector(
  ".register .input-box input[type='email']"
);

// ========== CONFIGURATION ==========
const CONFIG = {
  username: {
    minLength: 4,
    maxLength: 20,
    // Removed the existing reference as it's not defined
  },
  password: {
    minLength: 8,
    requires: {
      uppercase: true,
      specialChar: true,
      digit: true,
    },
  },
};

// ========== STATE ==========
let state = {
  email: "",
  username: "",
  password: "",
};

// ========== UTILITY FUNCTIONS ==========
function showError(inputElement, message) {
  removeError(inputElement);
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  inputElement.parentElement.appendChild(errorElement);
}

function removeError(inputElement) {
  const existingError =
    inputElement.parentElement.querySelector(".error-message");
  if (existingError) existingError.remove();
}

// ========== VALIDATION FUNCTIONS ==========
function validateUsername(username) {
  if (username.length < CONFIG.username.minLength) {
    return `Tên đăng nhập quá ngắn (tối thiểu ${CONFIG.username.minLength} ký tự)`;
  }

  if (username.length > CONFIG.username.maxLength) {
    return `Tên đăng nhập quá dài (tối đa ${CONFIG.username.maxLength} ký tự)`;
  }

  return null;
}

function validatePassword(password) {
  if (password.length < CONFIG.password.minLength) {
    return `Mật khẩu quá ngắn (tối thiểu ${CONFIG.password.minLength} ký tự)`;
  }

  if (CONFIG.password.requires.uppercase && !/[A-Z]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất một chữ cái in hoa";
  }

  if (
    CONFIG.password.requires.specialChar &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt";
  }

  if (CONFIG.password.requires.digit && !/\d/.test(password)) {
    return "Mật khẩu phải chứa ít nhất một chữ số";
  }

  return null;
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email không được để trống";
  if (!regex.test(email)) return "Email không hợp lệ";
  return null;
}

// ========== EVENT HANDLERS ==========
function handleEmailChange(value) {
  state.email = value.trim();
  console.log("Email updated:", state.email);
}

function handleUsernameChange(value) {
  state.username = value.trim();
  console.log("Username updated:", state.username);
}

function handlePasswordChange(value) {
  state.password = value;
  console.log("Password updated:", state.password);
}

function handleInputBlur(e, isLogin = true) {
  const value = e.target.value;
  const inputType = e.target.type;
  const inputName = e.target.name;

  if (isLogin) {
    // Login form validation
    if (inputType === "email") {
      handleEmailChange(value);
      if (value) {
        const error = validateEmail(value);
        if (error) showError(e.target, error);
        else removeError(e.target);
      } else {
        removeError(e.target);
      }
    } else if (inputType === "password") {
      handlePasswordChange(value);
      if (value) {
        const error = validatePassword(value);
        if (error) showError(e.target, error);
        else removeError(e.target);
      } else {
        removeError(e.target);
      }
    }
  } else {
    // Register form validation
    if (inputType === "text") {
      handleUsernameChange(value);
      if (value) {
        const error = validateUsername(value);
        if (error) showError(e.target, error);
        else removeError(e.target);
      } else {
        removeError(e.target);
      }
    } else if (inputType === "email") {
      handleEmailChange(value);
      if (value) {
        const error = validateEmail(value);
        if (error) showError(e.target, error);
        else removeError(e.target);
      } else {
        removeError(e.target);
      }
    } else if (inputType === "password") {
      handlePasswordChange(value);
      if (value) {
        const error = validatePassword(value);
        if (error) showError(e.target, error);
        else removeError(e.target);
      } else {
        removeError(e.target);
      }
    }
  }
}

// Hàm xử lý submit form đăng nhập
async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;

  // Validate
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  removeError(loginEmailInput);
  removeError(loginPasswordInput);

  if (emailError || passwordError) {
    if (emailError) showError(loginEmailInput, emailError);
    if (passwordError) showError(loginPasswordInput, passwordError);
    return;
  }

  try {
    const response = await fetch("http://localhost:5501/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Important for cookies
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok) {
      const user = data.data;
      localStorage.setItem("accessToken", data.accessToken);
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      setTimeout(() => {
        window.location.href = "/pages/index.html";
      }, 100);
    } else {
      // Xử lý lỗi từ server
      const errorField = data.error?.field || "password";
      const targetInput =
        errorField === "email" ? loginEmailInput : loginPasswordInput;
      showError(targetInput, data.message || "Đăng nhập thất bại");
    }
  } catch (error) {
    showError(loginPasswordInput, "Lỗi kết nối đến server");
  }
}

// Hàm xử lý submit form đăng ký
async function handleRegisterSubmit(e) {
  e.preventDefault();

  const username = registerUsernameInput.value.trim();
  const email = registerEmailInput.value.trim();
  const password = registerPasswordInput.value;

  // Validate các trường
  const usernameError = validateUsername(username);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  // Xóa tất cả lỗi trước khi kiểm tra lại
  removeError(registerUsernameInput);
  removeError(registerEmailInput);
  removeError(registerPasswordInput);

  if (usernameError || emailError || passwordError || confirmError) {
    if (usernameError) showError(registerUsernameInput, usernameError);
    if (emailError) showError(registerEmailInput, emailError);
    if (passwordError) showError(registerPasswordInput, passwordError);
    return; // Dừng nếu có lỗi
  }

  try {
    // Fixed endpoint URL to match your API
    const response = await fetch("http://localhost:5501/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Đăng ký thất bại");

    // Registration successful - redirect to login page
    window.location.href = "/pages/login.html";
  } catch (error) {
    showError(registerPasswordInput, error.message);
  }
}

// ========== EVENT LISTENERS ==========
// Toggle between login/register forms
if (registerBtn)
  registerBtn.addEventListener("click", () =>
    container.classList.add("active")
  );
if (loginBtn)
  loginBtn.addEventListener("click", () =>
    container.classList.remove("active")
  );

// Input validation - Using optional chaining to prevent errors if elements don't exist
loginEmailInput?.addEventListener("blur", (e) => handleInputBlur(e, true));
loginEmailInput?.addEventListener("input", (e) => {
  handleEmailChange(e.target.value);
});

loginPasswordInput?.addEventListener("blur", (e) => handleInputBlur(e, true));
loginPasswordInput?.addEventListener("input", (e) => {
  handlePasswordChange(e.target.value);
});

registerUsernameInput?.addEventListener("blur", (e) =>
  handleInputBlur(e, false)
);
registerUsernameInput?.addEventListener("input", (e) =>
  handleUsernameChange(e.target.value)
);

registerEmailInput?.addEventListener("blur", (e) => handleInputBlur(e, false));
registerEmailInput?.addEventListener("input", (e) =>
  handleEmailChange(e.target.value)
);

registerPasswordInput?.addEventListener("blur", (e) =>
  handleInputBlur(e, false)
);
registerPasswordInput?.addEventListener("input", (e) =>
  handlePasswordChange(e.target.value)
);

// Form submission
loginForm?.addEventListener("submit", handleLoginSubmit);
registerForm?.addEventListener("submit", handleRegisterSubmit);
