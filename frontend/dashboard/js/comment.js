let allComments = [];
let currentCommentPage = 1;
let commentsPerPage = 10;
let currentStatus = "all";
let currentSearch = "";

// Khởi tạo
async function initCommentManagement() {
  loadComments();
  setupCommentFilters();
  setupCommentSearch();
  setupCommentActions();
}

// Load bình luận
async function loadComments(status = "all", searchQuery = "") {
  try {
    showLoading("#comments .table-responsive");

    currentStatus = status;
    currentSearch = searchQuery;

    const token = await getAccessTokenFromRefresh();
    if (!token) return;

    const response = await fetch("/api/comments", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Lỗi tải bình luận");

    const { data: comments } = await response.json();

    allComments = comments.filter((comment) => {
      const matchesStatus = status === "all" || comment.status === status;
      const matchesSearch =
        !searchQuery ||
        comment.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    renderPaginatedComments();
  } catch (error) {
    showToast(error.message || "Lỗi tải danh sách bình luận", "error");
  } finally {
    hideLoading("#comments .table-responsive");
  }
}

// Hiển thị bảng bình luận
function renderPaginatedComments() {
  const startIndex = (currentCommentPage - 1) * commentsPerPage;
  const pageComments = allComments.slice(
    startIndex,
    startIndex + commentsPerPage
  );
  renderCommentsTable(pageComments, currentCommentPage, commentsPerPage);
  renderPagination(allComments.length, currentCommentPage, commentsPerPage);
}

function renderCommentsTable(comments, page = 1, perPage = 10) {
  const tbody = document.querySelector("#comments tbody");
  tbody.innerHTML = "";

  comments.forEach((comment, index) => {
    const rowNumber = (page - 1) * perPage + index + 1;
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${rowNumber}</td>
      <td class="comment-content">${comment.content}</td>
      <td>
        <div class="user-info">
          ${
            comment.userId
              ? `<img src="${
                  comment.avatarurl || "https://tinyurl.com/ms4ebrkc"
                }" alt="User">
                 <span>${comment.username || "Ẩn danh"}</span>`
              : "Khách"
          }
        </div>
      </td>
      <td>${comment.posttitle || "N/A"}</td>
      <td>${formatDateTime(comment.createdat)}</td>
      <td><span class="status-badge ${comment.status}" data-i18n="${comment.status}">
          ${getCommentStatusText(comment.status)}</span></td>
      <td class="comment-actions">
        ${
          comment.status === "pending"
            ? `<button class="btn btn-approve" data-id="${comment.cmtid}">
               <i class="fas fa-check"></i></button>`
            : ""
        }
        <button class="btn btn-delete" data-id="${comment.cmtid}">
          <i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderPagination(totalComments, current = 1, perPage = 10) {
  const totalPages = Math.ceil(totalComments / perPage);
  const pagination = document.querySelector("#comments .pagination");
  if (!pagination) return;

  pagination.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.className = "btn btn-prev";
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevButton.disabled = current === 1;
  prevButton.addEventListener("click", () => {
    if (currentCommentPage > 1) {
      currentCommentPage--;
      renderPaginatedComments();
    }
  });
  pagination.appendChild(prevButton);

  const maxVisiblePages = 5;
  let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    pagination.appendChild(createPageButton(1));
    if (startPage > 2) pagination.appendChild(createEllipsis());
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(createPageButton(i, i === current));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pagination.appendChild(createEllipsis());
    pagination.appendChild(createPageButton(totalPages));
  }

  const nextButton = document.createElement("button");
  nextButton.className = "btn btn-next";
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextButton.disabled = current === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentCommentPage < totalPages) {
      currentCommentPage++;
      renderPaginatedComments();
    }
  });
  pagination.appendChild(nextButton);
}

function createPageButton(pageNumber, isActive = false) {
  const btn = document.createElement("button");
  btn.className = `btn btn-page ${isActive ? "active" : ""}`;
  btn.textContent = pageNumber;
  btn.addEventListener("click", () => {
    currentCommentPage = pageNumber;
    renderPaginatedComments();
  });
  return btn;
}

function createEllipsis() {
  const span = document.createElement("span");
  span.className = "pagination-ellipsis";
  span.textContent = "...";
  return span;
}

function setupCommentFilters() {
  const filterSelect = document.getElementById("commentFilter");
  filterSelect.addEventListener("change", (e) => {
    loadComments(e.target.value);
  });
}

function setupCommentSearch() {
  const searchInput = document.querySelector("#comments .search-group input");
  const searchBtn = document.querySelector("#comments .btn-search");

  let timeout;
  const handleSearch = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const query = searchInput.value.trim();
      const status = document.getElementById("commentFilter").value;
      loadComments(status, query);
    }, 500);
  };

  searchInput.addEventListener("input", handleSearch);
  searchBtn.addEventListener("click", handleSearch);
}

function setupCommentActions() {
  document
    .querySelector("#comments tbody")
    .addEventListener("click", async (e) => {
      const target = e.target.closest("button");
      if (!target) return;

      const commentId = target.dataset.id;
      if (!commentId) return;

      try {
        if (target.classList.contains("btn-approve")) {
          await updateCommentStatus(commentId, "approved");
        } else if (target.classList.contains("btn-delete")) {
          showConfirmModal(
            "Bạn chắc chắn muốn xóa bình luận này?",
            async () => {
              await deleteComment(commentId);
            }
          );
        }
      } catch (error) {
        showToast(error.message, "error");
      }
    });
}

async function updateCommentStatus(commentId, status) {
  const token = await getAccessTokenFromRefresh();
  if (!token) return;

  try {
    const response = await fetch(`/api/comments/${commentId}/${status}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Cập nhật trạng thái thất bại");

    showToast(
      `Đã ${status === "approved" ? "duyệt" : "từ chối"} bình luận`,
      "success"
    );
    loadComments(document.getElementById("commentFilter").value);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteComment(commentId) {
  const token = await getAccessTokenFromRefresh();
  if (!token) return;

  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Xóa bình luận thất bại");

    allComments = allComments.filter((comment) => comment.cmtid !== commentId);

    const totalPages = Math.ceil(allComments.length / commentsPerPage);
    if (currentCommentPage > totalPages) {
      currentCommentPage = Math.max(1, totalPages);
    }

    renderPaginatedComments();
    showToast("Đã xóa bình luận", "success");
  } catch (error) {
    throw new Error(error.message);
  }
}

function getCommentStatusText(status) {
  const statusMap = {
    approved: "Đã duyệt",
    pending: "Chờ duyệt",
    rejected: "Từ chối",
    spam: "Spam",
  };
  return statusMap[status] || status;
}
