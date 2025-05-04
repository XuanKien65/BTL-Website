// ==================== QUẢN LÝ NGƯỜI DÙNG ====================

// Biến toàn cục
let usersData = [];
let currentEditingUserId = null;
let currentPage = 1;
const usersPerPage = 10;

// Khởi tạo quản lý người dùng
async function initUserManagement() {
  try {
    showLoading("#users .table-container");
    const token = await getAccessTokenFromRefresh();

    // Lấy danh sách người dùng
    const usersResponse = await fetch("http://localhost:5501/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!usersResponse.ok) throw new Error("Lỗi khi tải danh sách người dùng");

    let users = await usersResponse.json();
    users = Array.isArray(users.data) ? users.data : users;

    // Lấy danh sách đơn đăng ký tác giả
    const authorRequestsResponse = await fetch(
      "http://localhost:5501/api/author-registrations",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    let authorRequests = [];
    if (authorRequestsResponse.ok) {
      const requestsData = await authorRequestsResponse.json();
      authorRequests = Array.isArray(requestsData.data)
        ? requestsData.data
        : requestsData;
    }

    // Đánh dấu user nào có đơn đăng ký
    usersData = users.map((user) => ({
      ...user,
      hasAuthorRequest: authorRequests.some(
        (request) =>
          request.userid === user.userid && request.status === "pending"
      ),
    }));

    renderUserTable(usersData);
    setupUserEventListeners();
    updatePagination(usersData.length);
    setupSearchFunctionality();
    hideLoading("#users .table-container");
  } catch (error) {
    console.error("Error:", error);
    showToast(error.message || "Lỗi khi tải danh sách người dùng", "error");
    hideLoading("#users .table-container");

    if (
      error.message.includes("Unauthorized") ||
      error.message.includes("token")
    ) {
      window.location.href = "http://localhost:5501/pages/login.html";
    }
  }
}

// Hiển thị danh sách người dùng lên bảng
function renderUserTable(users) {
  const tbody = document.querySelector("#users tbody");
  if (!tbody) return;

  // Sắp xếp theo tên (alphabet)
  const sortedUsers = [...users].sort((a, b) => {
    const nameA = (a.username || "").toLowerCase();
    const nameB = (b.username || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Phân trang
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  // Render bảng với STT
  tbody.innerHTML = paginatedUsers
    .map(
      (user, index) => `
        <tr data-id="${user.userid}">
            <td>${startIndex + index + 1}</td> <!-- STT -->
            <td>
                <div class="user-info">
                    <span>${user.username}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${getRoleName(
        user.role
      )}</span></td>
            <td>${formatDateTime(user.createdat)}</td>
            <td><span class="status-badge ${
              user.status || "active"
            }">${getStatusName(user.status || "active")}</span></td>
            <td>
                ${
                  user.hasAuthorRequest
                    ? `<button class="btn btn-approve-author" data-id="${user.userid}" title="Duyệt làm tác giả">
                        <i class="fas fa-user-check"></i>
                    </button>`
                    : ""
                }
                ${
                  user.role === "author"
                    ? `<button class="btn btn-revoke-author" data-id="${user.userid}" title="Hủy quyền tác giả">
                        <i class="fas fa-user-times"></i>
                       </button>`
                    : ""
                }
                ${
                  user.status === "active" || !user.status
                    ? `<button class="btn btn-ban" data-id="${user.userid}" title="Khóa tài khoản">
                        <i class="fas fa-unlock"></i>
                       </button>`
                    : `<button class="btn btn-unban" data-id="${user.userid}" title="Mở khóa">
                        <i class="fas fa-lock"></i>
                       </button>`
                }
                <button class="btn btn-delete" data-id="${
                  user.userid
                }" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `
    )
    .join("");

  // Cập nhật phân trang
  updatePagination(users.length);
}

// Cập nhật phân trang
function updatePagination(totalUsers) {
  const paginationContainer = document.querySelector("#users .pagination");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalUsers / usersPerPage);
  paginationContainer.innerHTML = "";

  // Nút Previous
  const prevButton = document.createElement("button");
  prevButton.className = "btn btn-prev";
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderUserTable(usersData);
    }
  });
  paginationContainer.appendChild(prevButton);

  // Các nút trang
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    const firstPageButton = document.createElement("button");
    firstPageButton.className = "btn btn-page";
    firstPageButton.textContent = "1";
    firstPageButton.addEventListener("click", () => {
      currentPage = 1;
      renderUserTable(usersData);
    });
    paginationContainer.appendChild(firstPageButton);

    if (startPage > 2) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "pagination-ellipsis";
      ellipsis.textContent = "...";
      paginationContainer.appendChild(ellipsis);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = `btn btn-page ${i === currentPage ? "active" : ""}`;
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderUserTable(usersData);
    });
    paginationContainer.appendChild(pageButton);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "pagination-ellipsis";
      ellipsis.textContent = "...";
      paginationContainer.appendChild(ellipsis);
    }

    const lastPageButton = document.createElement("button");
    lastPageButton.className = "btn btn-page";
    lastPageButton.textContent = totalPages;
    lastPageButton.addEventListener("click", () => {
      currentPage = totalPages;
      renderUserTable(usersData);
    });
    paginationContainer.appendChild(lastPageButton);
  }

  // Nút Next
  const nextButton = document.createElement("button");
  nextButton.className = "btn btn-next";
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderUserTable(usersData);
    }
  });
  paginationContainer.appendChild(nextButton);
}

// Thiết lập sự kiện
function setupUserEventListeners() {
  // Nút thêm người dùng
  document.getElementById("addUserBtn")?.addEventListener("click", () => {
    currentEditingUserId = null;
    resetUserForm();
    openModal("addUserModal");
  });

  // Nút lưu người dùng
  document
    .getElementById("submitUser")
    ?.addEventListener("click", submitUserForm);

  // Sự kiện cho các nút trong bảng
  document
    .querySelector("#users tbody")
    ?.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      console.log("Button clicked:", btn);
      if (!btn) return;

      const userId = parseInt(btn.getAttribute("data-id"));
      console.log("UserID:", userId);
      if (!userId) return;

      if (btn.classList.contains("btn-edit")) {
        await editUser(userId);
      } else if (btn.classList.contains("btn-ban")) {
        updateUserStatus(userId, "banned");
      } else if (btn.classList.contains("btn-unban")) {
        updateUserStatus(userId, "active");
      } else if (btn.classList.contains("btn-delete")) {
        deleteUser(userId);
      } else if (btn.classList.contains("btn-approve-author")) {
        const userId = parseInt(btn.getAttribute("data-id"));
        const user = usersData.find((u) => u.userid === userId);

        if (!user?.hasAuthorRequest) {
          showToast("Người dùng này không có đơn đăng ký tác giả", "error");
          return;
        }

        try {
          const token = await getAccessTokenFromRefresh();
          const response = await fetch(
            `http://localhost:5501/api/author-registrations/user/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            throw new Error("Không tìm thấy đơn đăng ký tác giả");
          }

          const data = await response.json();
          const authorRequest = Array.isArray(data.data)
            ? data.data[0]
            : data.data;

          if (!authorRequest) {
            showToast("Không có đơn đăng ký tác giả nào", "error");
            return;
          }

          fillAuthorRequestModal(authorRequest);
          openModal("authorRequestModal");
        } catch (error) {
          console.error(error);
          showToast(
            error.message || "Lỗi khi tải đơn đăng ký tác giả",
            "error"
          );
        }
      } else if (btn.classList.contains("btn-revoke-author")) {
        const userId = parseInt(btn.getAttribute("data-id"));

        showConfirmModal(
          "Bạn có chắc muốn thu hồi quyền tác giả của người dùng này?",
          async () => {
            try {
              await updateUserRole(userId, "user");
              showToast("Đã thu hồi quyền tác giả thành công", "success");

              await sendNotification({
                title: "Thay đổi vai trò hệ thống",
                message: "Quyền tác giả của bạn đã được thu hồi.",
                toUserId: userId
              });

              // Cập nhật lại danh sách người dùng
              await initUserManagement();
            } catch (error) {
              console.error("Error:", error);
              showToast(
                error.message || "Có lỗi xảy ra khi thu hồi quyền tác giả",
                "error"
              );
            }
          }
        );
      }
    });

  // Lọc người dùng
  document.getElementById("userFilter")?.addEventListener("change", (e) => {
    filterUsers(e.target.value);
  });
}

//Hàm hiển thị dữ liệu đơn đăng ký thành tác giả
function fillAuthorRequestModal(data) {
  document.getElementById("authorFullname").textContent = data.fullname;
  document.getElementById("authorEmail").textContent = data.email;
  document.getElementById("authorPhone").textContent = data.phone || "N/A";
  document.getElementById("authorExperience").textContent =
    data.experience || "N/A";
  document.getElementById("authorPortfolio").innerHTML = data.portfolio
    ? `<a href="${data.portfolio}" target="_blank">Xem</a>`
    : "Không có";
  document.getElementById("authorTopics").textContent = (
    data.topics || []
  ).join(", ");
  document.getElementById("authorFrontId").src = data.frontidcardurl;
  document.getElementById("authorBackId").src = data.backidcardurl;

  // Gắn ID để xử lý duyệt
  document.getElementById("approveAuthorBtn").setAttribute("data-id", data.id);
  document.getElementById("rejectAuthorBtn").setAttribute("data-id", data.id);

  console.log("Gán data-id cho approveAuthorBtn:", data.id);

  const approveBtn = document.getElementById("approveAuthorBtn");
  const rejectBtn = document.getElementById("rejectAuthorBtn");

  // Gỡ bỏ event cũ nếu có
  approveBtn.replaceWith(approveBtn.cloneNode(true));
  rejectBtn.replaceWith(rejectBtn.cloneNode(true));

  // Lấy lại phần tử mới
  const newApproveBtn = document.getElementById("approveAuthorBtn");
  const newRejectBtn = document.getElementById("rejectAuthorBtn");

  // Gắn lại sự kiện
  newApproveBtn.addEventListener("click", async function () {
    const authorRequestId = this.getAttribute("data-id");
    const userId = data.userid; //Sử dụng dữ liệu sẵn có

    try {
      const token = await getAccessTokenFromRefresh();

      // 1. Cập nhật trạng thái đơn
      const response = await fetch(
        `http://localhost:5501/api/author-registrations/${authorRequestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "approved" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi duyệt đơn");
      }

      // 2. Cập nhật role người dùng
      await updateUserRole(userId, "author");

      // GỬI THÔNG BÁO CHÀO MỪNG TÁC GIẢ
      await sendNotification({
        title: "Chào mừng tác giả mới 🎉",
        message: "Chúc mừng bạn đã trở thành tác giả chính thức của Giờ Outsider!",
        toUserId: userId
      });

      // 3. Làm mới bảng
      await initUserManagement();

      // 3. Xoá dòng ngay lập tức khỏi bảng duyệt đơn
      const row = document.querySelector(
        `#authorRequestsBody tr[data-id="${authorRequestId}"]`
      );
      if (row) row.remove();

      const tbody = document.getElementById("authorRequestsBody");
      if (tbody && tbody.querySelectorAll("tr").length === 0) {
        tbody.innerHTML = `
                <tr class="no-requests">
                <td colspan="8">
                    <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <p>Không có đơn đăng ký nào</p>
                    </div>
                </td>
                </tr>`;
      }
      closeModal();
      showToast("Đã duyệt đơn và cập nhật vai trò tác giả", "success");
    } catch (error) {
      console.error("Full error:", error);
      showToast(error.message || "Lỗi khi duyệt đơn đăng ký", "error");
      console.error("Lỗi gửi thông báo:", error);
    }
  });

  newRejectBtn.addEventListener("click", async function () {
    const authorRequestId = this.getAttribute("data-id");
    const userId = data.userid;

    if (!authorRequestId || !userId) {
      console.error("Thiếu dữ liệu từ chối");
      showToast("Không đủ thông tin để từ chối đơn", "error");
      return;
    }

    showConfirmModal("Bạn có chắc muốn từ chối đơn đăng ký này?", async () => {
      try {
        const token = await getAccessTokenFromRefresh();

        const response = await fetch(
          `http://localhost:5501/api/author-registrations/${authorRequestId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "rejected" }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Lỗi khi từ chối đơn");
        }

        // THÔNG BÁO ĐƠN ĐĂNG KÝ TÁC GIẢ BỊ TỪ CHỐI
        await sendNotification({
          title: "Đơn đăng ký tác giả bị từ chối",
          message: "Rất tiếc, đơn đăng ký trở thành tác giả của bạn đã không được chấp thuận. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
          toUserId: userId
        });

        await initUserManagement();

        // Xóa dòng sau khi từ chối đơn bên bảng duyệt
        const row = document.querySelector(
          `#authorRequestsBody tr[data-id="${authorRequestId}"]`
        );
        if (row) row.remove();

        const tbody = document.getElementById("authorRequestsBody");
        if (tbody && tbody.querySelectorAll("tr").length === 0) {
          tbody.innerHTML = `
                    <tr class="no-requests">
                    <td colspan="8">
                        <div class="empty-state">
                        <i class="fas fa-file-alt"></i>
                        <p>Không có đơn đăng ký nào</p>
                        </div>
                    </td>
                    </tr>`;
        }

        // Đóng modal xác nhận
        closeModal();

        // Đóng modal authorRequestModal nếu còn đang mở
        const authorModal = document.getElementById("authorRequestModal");
        if (authorModal) {
          authorModal.style.display = "none";
        }

        // Reset currentModal nếu nó vẫn là confirmModal
        currentModal = null;

        showToast("Đã từ chối đơn đăng ký tác giả", "success");
      } catch (error) {
        console.error("Lỗi khi xử lý từ chối:", error);
        showToast(error.message || "Lỗi khi từ chối đơn đăng ký", "error");
        console.error("Lỗi gửi thông báo:", error);
      }
    });
  });
}

// Thiết lập chức năng tìm kiếm
function setupSearchFunctionality() {
  const searchInput = document.querySelector("#users .search-group input");
  const searchButton = document.querySelector("#users .search-group button");

  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        searchUsers(searchInput.value.trim().toLowerCase());
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const searchTerm = document
        .querySelector("#users .search-group input")
        .value.trim()
        .toLowerCase();
      searchUsers(searchTerm);
    });
  }
}

// Hàm cập nhật vai trò người dùng
async function updateUserRole(userId, newRole) {
  try {
    const token = await getAccessTokenFromRefresh();

    // Lấy thông tin user hiện tại
    const userResponse = await fetch(
      `http://localhost:5501/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      throw new Error(
        errorData.message || "Không thể lấy thông tin người dùng"
      );
    }

    const user = await userResponse.json();
    const userData = user.data;

    // Chỉ cập nhật role, giữ nguyên các thông tin khác
    const response = await fetch(`http://localhost:5501/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        role: newRole, // Chỉ thay đổi role
        status: userData.status || "active",
        avatarURL: userData.avatarurl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi cập nhật vai trò");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
}

// Gửi form người dùng
async function submitUserForm() {
  const form = document.getElementById("userForm");
  if (!form) return;

  const formData = new FormData(form);
  const username = (formData.get("userName") || "").trim();
  const email = (formData.get("userEmail") || "").trim();
  const password = formData.get("userPassword");

  // Ép role là admin bất kể người dùng chọn gì
  const userData = {
    username,
    email,
    password,
    role: "admin", // Chỉ cho phép tạo admin
    status: "active",
  };

  // Validate
  if (!username || !email) {
    showToast("Vui lòng điền đầy đủ thông tin", "error");
    return;
  }

  if (!validateEmail(email)) {
    showToast("Email không hợp lệ", "error");
    return;
  }

  if (!currentEditingUserId && !password) {
    showToast("Vui lòng nhập mật khẩu", "error");
    return;
  }

  try {
    const token = await getAccessTokenFromRefresh();
    let response;

    if (currentEditingUserId) {
      // Cập nhật thông tin người dùng (không cập nhật mật khẩu ở đây)
      response = await fetch(
        `http://localhost:5501/api/users/${currentEditingUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username,
            email,
            role: "admin", // luôn là admin
          }),
        }
      );
    } else {
      // Thêm mới admin
      response = await fetch("http://localhost:5501/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Có lỗi khi thêm/cập nhật người dùng"
      );
    }

    showToast(
      currentEditingUserId
        ? "Cập nhật thành công"
        : "Thêm quản trị viên thành công",
      "success"
    );
    closeModal();
    await initUserManagement();
  } catch (error) {
    console.error("submitUserForm error:", error);
    showToast(error.message || "Đã xảy ra lỗi", "error");
  }
}

// Cập nhật trạng thái người dùng
async function updateUserStatus(userId, status) {
  showConfirmModal(
    `Bạn có chắc muốn ${
      status === "banned" ? "khóa" : "mở khóa"
    } người dùng này?`,
    async () => {
      try {
        const token = await getAccessTokenFromRefresh();

        // ⚠️ Lấy lại toàn bộ thông tin user trước khi update
        const userResponse = await fetch(
          `http://localhost:5501/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(
            errorData.message || "Không thể lấy thông tin người dùng"
          );
        }

        const user = await userResponse.json();
        const userData = user.data;

        const response = await fetch(
          `http://localhost:5501/api/users/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              username: userData.username,
              email: userData.email,
              role: userData.role,
              status: status,
              avatarURL: userData.avatarurl,
            }),
          }
        );

        console.log("API response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error response:", errorData);
          throw new Error(errorData.message || "Lỗi khi cập nhật trạng thái");
        }
        
        // GỬI THÔNG BÁO TRẠNG THÁI
        await sendNotification({
          title: status === "banned" ? "Tài khoản bị khóa 🔒" : "Tài khoản đã mở khóa 🎉",
          message: status === "banned" 
            ? "Tài khoản của bạn đã bị khóa do vi phạm điều khoản cộng đồng." 
            : "Tài khoản của bạn đã được kích hoạt lại. Chào mừng quay trở lại!",
          toUserId: userId
        });

        await initUserManagement();
        showToast(
          `Đã ${
            status === "banned" ? "khóa" : "mở khóa"
          } người dùng thành công`,
          "success"
        );
      } catch (error) {
        console.error("updateUserStatus error:", error);
        showToast(error.message || "Có lỗi xảy ra", "error");
        console.error("Lỗi gửi thông báo:", error);
      }
    }
  );
}

// Xóa người dùng
async function deleteUser(userId) {
  showConfirmModal(
    "Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác.",
    async () => {
      try {
        const token = await getAccessTokenFromRefresh();
        const response = await fetch(
          `http://localhost:5501/api/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Lỗi khi xóa người dùng");
        }

        await initUserManagement();
        showToast("Đã xóa người dùng thành công", "success");
      } catch (error) {
        console.error("Error:", error);
        showToast(error.message || "Có lỗi xảy ra", "error");
      }
    }
  );
}

// Lọc người dùng
function filterUsers(filter) {
  if (filter === "all") {
    renderUserTable(usersData);
    return;
  }

  const filteredUsers = usersData.filter((user) => {
    if (filter === "banned") return user.status === "banned";
    if (filter === "active") return !user.status || user.status === "active";
    return user.role === filter;
  });

  currentPage = 1; // Reset về trang đầu tiên
  renderUserTable(filteredUsers);
}

// Tìm kiếm người dùng
function searchUsers(term) {
  if (!term) {
    renderUserTable(usersData);
    return;
  }

  const filteredUsers = usersData.filter(
    (user) =>
      (user.username && user.username.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term))
  );

  currentPage = 1; // Reset về trang đầu tiên
  renderUserTable(filteredUsers);
}

// Reset form người dùng
function resetUserForm() {
  const form = document.getElementById("userForm");
  if (form) {
    form.reset();
    document.getElementById("userPassword").required = true;
    document.getElementById("passwordField").style.display = "block";
    currentEditingUserId = null;
  }
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

// Khởi tạo khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", function () {
  initUserManagement();

  // Thêm CSS cho loading
  const style = document.createElement("style");
  style.textContent = `
        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4361ee;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .pagination-ellipsis {
            padding: 0 10px;
            display: inline-block;
        }
    `;
  document.head.appendChild(style);
});

//================== ĐƠN ĐĂNG KÝ ===========

async function initAuthorRequests() {
  try {
    const token = await getAccessTokenFromRefresh();
    const res = await fetch("http://localhost:5501/api/author-registrations", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Lỗi khi tải danh sách đơn đăng ký");
    const data = await res.json();
    const requests = (Array.isArray(data.data) ? data.data : data).filter(
      (r) => r.status === "pending"
    );
    renderAuthorRequests(requests);
  } catch (error) {
    console.error(error);
    showToast(error.message || "Lỗi khi tải đơn đăng ký", "error");
  }
}

function renderAuthorRequests(requests) {
  const tbody = document.getElementById("authorRequestsBody");
  if (!tbody) return;

  if (requests.length === 0) {
    tbody.innerHTML = `
        <tr class="no-requests">
          <td colspan="8">
            <div class="empty-state">
              <i class="fas fa-file-alt"></i>
              <p>Không có đơn đăng ký nào</p>
            </div>
          </td>
        </tr>`;
    return;
  }

  // Sắp xếp theo ngày tạo (tăng dần) và đánh số
  requests
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .forEach((r, i) => (r.displayId = i + 1));

  tbody.innerHTML = requests
    .map(
      (r) => `
      <tr data-id="${r.id}" data-userid="${r.userid}">
        <td>${r.displayId}</td>
        <td>${r.fullname}</td>
        <td>${r.email}</td>
        <td>${r.phone || "N/A"}</td>
        <td>${r.experience || "N/A"}</td>
        <td>${r.topics?.join(", ") || "N/A"}</td>
        <td>${new Date(r.created_at).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-view-author" data-id="${r.id}">
            <i class="fas fa-eye"></i> Xem
          </button>
        </td>
      </tr>`
    )
    .join("");

  // Gán dữ liệu và sự kiện
  document.querySelectorAll("#authorRequestsBody tr").forEach((tr, i) => {
    tr.__data = requests[i];
  });

  document.querySelectorAll(".btn-view-author").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const row = e.target.closest("tr");
      const userId = row?.dataset.userid;
      const requestData = row?.__data;

      if (!userId || !requestData)
        return showToast("Không thể tìm dữ liệu đơn đăng ký", "error");
      fillAuthorRequestModal(requestData);
      openModal("authorRequestModal");
    });
  });
}
