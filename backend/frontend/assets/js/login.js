const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Sample list of existing usernames (in a real application, this would come from a database)
const existingUsernames = ["admin", "user1", "test123", "johndoe"];

// Configuration for username constraints
const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 20;

// Configuration for password constraints
const MIN_PASSWORD_LENGTH = 8;

// Function to validate username
function validateUsername(username) {
  // Check if username is too short
  if (username.length < MIN_USERNAME_LENGTH) {
    return `Tên đăng nhập quá ngắn (tối thiểu ${MIN_USERNAME_LENGTH} ký tự)`;
  }
  
  // Check if username is too long
  if (username.length > MAX_USERNAME_LENGTH) {
    return `Tên đăng nhập quá dài (tối đa ${MAX_USERNAME_LENGTH} ký tự)`;
  }
  
  // Check if username already exists
  if (existingUsernames.includes(username)) {
    return "Tên đăng nhập đã tồn tại";
  }
  
  return null; // No error
}

// Function to validate password
function validatePassword(password) {
  // Check if password is too short
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Mật khẩu quá ngắn (tối thiểu ${MIN_PASSWORD_LENGTH} ký tự)`;
  }
  
  // Check if password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất một chữ cái in hoa";
  }
  
  // Check if password contains at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt";
  }
  
  // Check if password contains at least one digit
  if (!/\d/.test(password)) {
    return "Mật khẩu phải chứa ít nhất một chữ số";
  }
  
  return null; // No error
}

// Function to add error message
function showError(inputElement, message) {
  // Remove any existing error message
  const existingError = inputElement.parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }
  
  // Create and add new error message
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  inputElement.parentElement.appendChild(errorElement);
}

// Function to remove error message
function removeError(inputElement) {
  const existingError = inputElement.parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }
}

// Add event listeners to handle form validation
document.addEventListener("DOMContentLoaded", function() {
  // Get username input fields
  const loginUsernameInput = document.querySelector(".login .input-box input[type='text']");
  const registerUsernameInput = document.querySelector(".register .input-box input[type='text']");
  
  // Get password input fields
  const loginPasswordInput = document.querySelector(".login .input-box input[type='password']");
  const registerPasswordInput = document.querySelector(".register .input-box input[type='password']");
  
  // Validate username on blur (when user clicks away from the field)
  if (loginUsernameInput) {
    loginUsernameInput.addEventListener("blur", function() {
      const username = this.value.trim();
      if (username) {
        const error = validateUsername(username);
        if (error) {
          showError(this, error);
        } else {
          removeError(this);
        }
      }
    });
  }
  
  if (registerUsernameInput) {
    registerUsernameInput.addEventListener("blur", function() {
      const username = this.value.trim();
      if (username) {
        const error = validateUsername(username);
        if (error) {
          showError(this, error);
        } else {
          removeError(this);
        }
      }
    });
  }
  
  // Validate password on blur
  if (loginPasswordInput) {
    loginPasswordInput.addEventListener("blur", function() {
      const password = this.value;
      if (password) {
        const error = validatePassword(password);
        if (error) {
          showError(this, error);
        } else {
          removeError(this);
        }
      }
    });
  }
  
  if (registerPasswordInput) {
    registerPasswordInput.addEventListener("blur", function() {
      const password = this.value;
      if (password) {
        const error = validatePassword(password);
        if (error) {
          showError(this, error);
        } else {
          removeError(this);
        }
      }
    });
  }
  
  // Validate forms on submit
  const loginForm = document.querySelector(".login form");
  const registerForm = document.querySelector(".register form");
  
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      const username = loginUsernameInput.value.trim();
      const usernameError = validateUsername(username);
      
      const password = loginPasswordInput.value;
      const passwordError = validatePassword(password);
      
      if (usernameError) {
        e.preventDefault(); // Prevent form submission
        showError(loginUsernameInput, usernameError);
      }
      
      if (passwordError) {
        e.preventDefault(); // Prevent form submission
        showError(loginPasswordInput, passwordError);
      }
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
      const username = registerUsernameInput.value.trim();
      const usernameError = validateUsername(username);
      
      const password = registerPasswordInput.value;
      const passwordError = validatePassword(password);
      
      if (usernameError) {
        e.preventDefault(); // Prevent form submission
        showError(registerUsernameInput, usernameError);
      }
      
      if (passwordError) {
        e.preventDefault(); // Prevent form submission
        showError(registerPasswordInput, passwordError);
      }
    });
  }
});

// Original toggle functionality
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});