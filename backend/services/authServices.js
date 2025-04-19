// ==================== CORE FETCH WITH AUTH ====================
export async function fetchWithAuth(url, options = {}) {
  // Set default headers
  options.headers = options.headers || {};

  // Add content type if not specified
  if (!options.headers["Content-Type"] && !options.formData) {
    options.headers["Content-Type"] = "application/json";
  }

  // Add authorization header if access token exists
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Always include credentials for cookies
  options.credentials = "include";

  // First attempt with current token
  let response = await fetch(url, options);

  // If unauthorized (401), try to refresh the token
  if (response.status === 401) {
    try {
      const refreshResponse = await fetch(
        "http://localhost:5501/api/auth/refresh",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        // Get new access token
        const { accessToken: newAccessToken } = await refreshResponse.json();

        // Store the new token
        localStorage.setItem("accessToken", newAccessToken);

        // Retry original request with new token
        options.headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(url, options);
      } else {
        // Refresh token failed - user needs to log in again
        console.log("Refresh token expired or invalid. Logging out...");
        await handleLogout();
        window.location.href = "/pages/login.html";
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      await handleLogout();
      window.location.href = "/pages/login.html";
      return null;
    }
  }

  return response;
}

// ==================== AUTH FUNCTIONS ====================
export async function handleLogin(email, password) {
  try {
    const response = await fetch("http://localhost:5501/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function handleRegister(username, email, password) {
  try {
    const response = await fetch("http://localhost:5501/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function handleLogout() {
  try {
    await fetch("http://localhost:5501/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // Clear local storage
    localStorage.removeItem("accessToken");

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // Still remove the token even if the request fails
    localStorage.removeItem("accessToken");
    return {
      success: false,
      message: error.message,
    };
  }
}

// ==================== PROFILE API ====================
export async function fetchUserProfile() {
  try {
    const response = await fetchWithAuth(
      "http://localhost:5501/api/user/profile"
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch profile");
    }

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

// ==================== TOKEN VERIFICATION ====================
export function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}

// Function to check if user is authorized based on role
export async function checkUserRole(requiredRole) {
  try {
    const profileResponse = await fetchUserProfile();
    if (!profileResponse.success) {
      return false;
    }

    return profileResponse.data.role === requiredRole;
  } catch (error) {
    return false;
  }
}
