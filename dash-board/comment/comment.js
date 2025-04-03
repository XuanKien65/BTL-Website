document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");


    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("expand");
    });

});
function setupUserDropdown() {
    const dropdownButton = document.getElementById('userDropdown');
   
    // Tạo dropdown menu
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.className = 'dropdown-menu dropdown-menu-end';
    dropdownMenu.innerHTML = `
        <li>
            <div class="dropdown-item-text">
                <div class="d-flex align-items-center p-2">
                    <img src="https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg" class="rounded-circle" width="50" alt="User">
                    <div class="ms-3">
                        <h6 class="mb-0">${getUserName()}</h6>
                        <small class="text-muted">Administrator</small>
                    </div>
                </div>
            </div>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
            <a class="dropdown-item d-flex align-items-center" href="#">
                <span class="material-icons me-2">person</span>
                Thông tin cá nhân
            </a>
        </li>
        <li>
            <a class="dropdown-item d-flex align-items-center" href="#">
                <span class="material-icons me-2">settings</span>
                Cài đặt tài khoản
            </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
            <a class="dropdown-item d-flex align-items-center text-danger" href="#">
                <span class="material-icons me-2">help</span>
                Trợ giúp
            </a>
        </li>
    `;
   
    // Chèn dropdown menu vào sau button
    dropdownButton.after(dropdownMenu);


    // Xử lý sự kiện click cho các menu items
    dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = e.currentTarget.textContent.trim();
           
            switch(action) {
                case 'Thông tin cá nhân':
                    console.log('Mở trang thông tin cá nhân');
                    // Thêm code chuyển hướng đến trang thông tin cá nhân
                    break;
                   
                case 'Cài đặt tài khoản':
                    console.log('Mở trang cài đặt');
                    // Thêm code chuyển hướng đến trang cài đặt
                    break;
            }
        });
    });
}


// Hàm lấy tên người dùng - có thể thay đổi theo logic của bạn
function getUserName() {
    // Tạm thời return giá trị mặc định
    // Sau này có thể lấy từ session/localStorage hoặc API
    return "Admin User";
}


// Hàm lấy icon theo thời gian
function getTimeIcon() {
    const hour = new Date().getHours();
   
    if (hour >= 5 && hour < 12) {
        return "☀️"; // Icon mặt trời cho buổi sáng
    } else if (hour >= 12 && hour < 18) {
        return "🌤️"; // Icon mặt trời có mây cho buổi chiều
    } else {
        return '<span class="material-icons moon-icon">nightlight</span>'; // Icon mặt trăng xám
    }
}


// Hàm lấy lời chào theo thời gian
function getGreeting() {
    const hour = new Date().getHours();
    const userName = getUserName();
    let greetingText = '';
    let timeText = '';
   
    if (hour >= 5 && hour < 12) {
        greetingText = "Chào buổi sáng";
        timeText = "Chúc bạn một ngày tốt lành!";
    } else if (hour >= 12 && hour < 18) {
        greetingText = "Chào buổi chiều";
        timeText = "Chúc bạn làm việc hiệu quả!";
    } else {
        greetingText = "Chào buổi tối";
        timeText = "Chúc bạn nghỉ ngơi thật tốt!";
    }


    return {
        icon: getTimeIcon(),
        greeting: greetingText,
        name: userName,
        message: timeText
    };
}


// Hàm cập nhật lời chào
function updateGreeting() {
    const greetingContainer = document.querySelector('.greeting-container');
    const greetingData = getGreeting();
   
    // Tạo HTML cho lời chào
    const greetingHTML = `
        <div class="greeting-content">
            <div class="greeting-icon">${greetingData.icon}</div>
            <div class="greeting-text">
                <div class="greeting-main">
                    <span class="greeting">${greetingData.greeting}</span>
                    <span class="user-name">${greetingData.name}</span>
                </div>
                <div class="greeting-message">${greetingData.message}</div>
            </div>
        </div>
    `;
   
    greetingContainer.innerHTML = greetingHTML;
}


// Khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    updateGreeting();
   
    // Cập nhật lời chào mỗi phút
    setInterval(updateGreeting, 60000);
    setupUserDropdown();
});


// Thêm sự kiện để cập nhật lời chào khi tab được focus lại
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateGreeting();
    }
});


// Dữ liệu mẫu
const commentsData = [
    {
        id: 1,
        user: "Nguyễn Văn A",
        post: "Cách xây dựng website năm 2025",
        comment: "Bài viết rất hay! Tôi đã học được nhiều điều về phát triển web.",
        date: "2025-03-15",
        status: "approved"
    },
    {
        id: 2,
        user: "Trần Thị B",
        post: "10 mẹo để SEO tốt hơn",
        comment: "Tôi không đồng ý với điểm số 5. Theo kinh nghiệm của tôi, mật độ từ khóa vẫn quan trọng cho thứ hạng.",
        date: "2025-03-14",
        status: "pending"
    },
    {
        id: 3,
        user: "Lê Văn C",
        post: "Giới thiệu về JavaScript",
        comment: "Hướng dẫn này quá cơ bản. Tôi đã mong đợi các khái niệm nâng cao hơn.",
        date: "2025-03-13",
        status: "approved"
    },
    {
        id: 4,
        user: "Phạm Thị D",
        post: "Cách xây dựng website năm 2025",
        comment: "Tôi đã làm theo hướng dẫn của bạn nhưng bị mắc kẹt ở phần hosting. Bạn có thể cung cấp thêm chi tiết không?",
        date: "2025-03-12",
        status: "pending"
    },
    {
        id: 5,
        user: "Hoàng Văn E",
        post: "Tương lai của phát triển web",
        comment: "Quan điểm thú vị! Tôi nghĩ AI sẽ đóng vai trò lớn hơn nhiều so với dự đoán của bạn.",
        date: "2025-03-11",
        status: "approved"
    },
    {
        id: 6,
        user: "Ngô Thị F",
        post: "CSS Grid so với Flexbox",
        comment: "So sánh này thực sự giúp tôi hiểu khi nào nên sử dụng từng hệ thống bố cục. Cảm ơn bạn!",
        date: "2025-03-10",
        status: "approved"
    },
    {
        id: 7,
        user: "Vũ Văn G",
        post: "10 mẹo để SEO tốt hơn",
        comment: "Tôi đã áp dụng những mẹo này trong một tháng và lưu lượng truy cập của tôi đã tăng 30%!",
        date: "2025-03-09",
        status: "approved"
    },
    {
        id: 8,
        user: "Mai Thị H",
        post: "Giới thiệu về JavaScript",
        comment: "Có lỗi chính tả trong ví dụ mã cho phần trình xử lý sự kiện.",
        date: "2025-03-08",
        status: "pending"
    },
    {
        id: 9,
        user: "Đinh Văn I",
        post: "Tương lai của phát triển web",
        comment: "Bài viết này chứa thông tin sai lệch. WebAssembly không hoạt động như cách bạn mô tả.",
        date: "2025-03-07",
        status: "rejected"
    },
    {
        id: 10,
        user: "Lý Thị K",
        post: "CSS Grid so với Flexbox",
        comment: "Bạn có thể thêm nhiều ví dụ về bố cục responsive sử dụng Grid không?",
        date: "2025-03-06",
        status: "approved"
    }
];

// Các phần tử DOM
const commentTableBody = document.getElementById('comments-table-body');
const searchInput = document.getElementById('search-comments');
const filterButtons = document.querySelectorAll('.filter-btn');
const commentModal = document.getElementById('comment-modal');
const modalClose = document.querySelector('.modal-close');
const btnClose = document.getElementById('btn-close');
const btnApprove = document.getElementById('btn-approve');
const btnReject = document.getElementById('btn-reject');

// Bộ lọc hiện tại
let currentFilter = 'all';
let currentCommentId = null;

// Tải thống kê
function loadStats() {
    const total = commentsData.length;
    const pending = commentsData.filter(comment => comment.status === 'pending').length;
    const approved = commentsData.filter(comment => comment.status === 'approved').length;
    const rejected = commentsData.filter(comment => comment.status === 'rejected').length;

    document.getElementById('total-comments').textContent = total;
    document.getElementById('pending-comments').textContent = pending;
    document.getElementById('approved-comments').textContent = approved;
    document.getElementById('rejected-comments').textContent = rejected;
}

// Tải bình luận
function loadComments() {
    // Xóa bảng
    commentTableBody.innerHTML = '';

    // Lọc bình luận
    let filteredComments = commentsData;
    
    // Áp dụng bộ lọc trạng thái
    if (currentFilter !== 'all') {
        filteredComments = commentsData.filter(comment => comment.status === currentFilter);
    }
    
    // Áp dụng bộ lọc tìm kiếm
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredComments = filteredComments.filter(comment => 
            comment.user.toLowerCase().includes(searchTerm) || 
            comment.post.toLowerCase().includes(searchTerm) || 
            comment.comment.toLowerCase().includes(searchTerm)
        );
    }

    // Hiển thị bình luận
    filteredComments.forEach(comment => {
        const row = document.createElement('tr');
        
        // Ánh xạ trạng thái sang tiếng Việt
        let statusText = "";
        switch(comment.status) {
            case "pending": statusText = "Chờ duyệt"; break;
            case "approved": statusText = "Đã duyệt"; break;
            case "rejected": statusText = "Đã từ chối"; break;
        }
        
        row.innerHTML = `
            <td>${comment.id}</td>
            <td>${comment.user}</td>
            <td>${comment.post}</td>
            <td class="comment-content">${comment.comment}</td>
            <td>${formatDate(comment.date)}</td>
            <td><span class="comment-status status-${comment.status}">${statusText}</span></td>
            <td class="comment-actions">
                <button class="action-btn btn-view" data-id="${comment.id}">Xem</button>
                ${comment.status === 'pending' ? `
                    <button class="action-btn btn-approve" data-id="${comment.id}">Duyệt</button>
                    <button class="action-btn btn-reject" data-id="${comment.id}">Từ chối</button>
                ` : ''}
            </td>
        `;
        commentTableBody.appendChild(row);
    });

    // Thêm trình nghe sự kiện cho các nút hành động
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => openCommentModal(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', () => approveComment(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', () => rejectComment(parseInt(btn.dataset.id)));
    });
}

// Định dạng ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Mở modal bình luận
function openCommentModal(commentId) {
    const comment = commentsData.find(c => c.id === commentId);
    if (!comment) return;

    currentCommentId = commentId;

    document.getElementById('modal-user').textContent = comment.user;
    document.getElementById('modal-post').textContent = comment.post;
    document.getElementById('modal-comment').textContent = comment.comment;
    document.getElementById('modal-date').textContent = formatDate(comment.date);
    
    // Ánh xạ trạng thái sang tiếng Việt
    let statusText = "";
    switch(comment.status) {
        case "pending": statusText = "Chờ duyệt"; break;
        case "approved": statusText = "Đã duyệt"; break;
        case "rejected": statusText = "Đã từ chối"; break;
    }
    document.getElementById('modal-status').textContent = statusText;
    
    // Hiển thị/ẩn các nút duyệt/từ chối dựa trên trạng thái
    if (comment.status === 'pending') {
        btnApprove.style.display = 'inline-block';
        btnReject.style.display = 'inline-block';
    } else {
        btnApprove.style.display = 'none';
        btnReject.style.display = 'none';
    }

    commentModal.style.display = 'flex';
}

// Đóng modal bình luận
function closeCommentModal() {
    commentModal.style.display = 'none';
    currentCommentId = null;
}

// Duyệt bình luận
function approveComment(commentId) {
    const commentIndex = commentsData.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
        commentsData[commentIndex].status = 'approved';
        loadStats();
        loadComments();
        if (currentCommentId === commentId) {
            closeCommentModal();
        }
    }
}

// Từ chối bình luận
function rejectComment(commentId) {
    const commentIndex = commentsData.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
        commentsData[commentIndex].status = 'rejected';
        loadStats();
        loadComments();
        if (currentCommentId === commentId) {
            closeCommentModal();
        }
    }
}

// Trình nghe sự kiện
searchInput.addEventListener('input', loadComments);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Cập nhật bộ lọc hoạt động
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        loadComments();
    });
});

// Trình nghe sự kiện modal
modalClose.addEventListener('click', closeCommentModal);
btnClose.addEventListener('click', closeCommentModal);
btnApprove.addEventListener('click', () => approveComment(currentCommentId));
btnReject.addEventListener('click', () => rejectComment(currentCommentId));

// Khởi tạo
loadStats();
loadComments();