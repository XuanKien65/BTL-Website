// kien js
// Sample user data
let users = [
    { id: 1, fullName: 'Nguyễn Văn A', email: 'nguyenvana@example.com', username: 'nguyenvana', status: 'active', created: '20/02/2025' },
    { id: 2, fullName: 'Trần Thị B', email: 'tranthib@example.com', username: 'tranthib', status: 'active', created: '15/02/2025' },
    { id: 3, fullName: 'Lê Văn C', email: 'levanc@example.com', username: 'levanc', status: 'inactive', created: '10/02/2025' },
    { id: 4, fullName: 'Phạm Thị D', email: 'phamthid@example.com', username: 'phamthid', status: 'pending', created: '05/02/2025' },
    { id: 5, fullName: 'Hoàng Văn E', email: 'hoangvane@example.com', username: 'hoangvane', status: 'active', created: '01/02/2025' },
    { id: 6, fullName: 'Đỗ Thị F', email: 'dothif@example.com', username: 'dothif', status: 'active', created: '28/01/2025' },
    { id: 7, fullName: 'Vũ Văn G', email: 'vuvang@example.com', username: 'vuvang', status: 'inactive', created: '25/01/2025' },
    { id: 8, fullName: 'Ngô Thị H', email: 'ngothih@example.com', username: 'ngothih', status: 'active', created: '20/01/2025' },
    { id: 9, fullName: 'Đặng Văn I', email: 'dangvani@example.com', username: 'dangvani', status: 'pending', created: '15/01/2025' },
    { id: 10, fullName: 'Bùi Thị K', email: 'buithik@example.com', username: 'buithik', status: 'active', created: '10/01/2025' },
];

let currentPage = 1;
const usersPerPage = 5;
let currentUserIdToDelete = null;

// DOM elements
const userTableBody = document.getElementById('userTableBody');
const pagination = document.getElementById('pagination');
const viewModal = document.getElementById('viewModal');
const deleteModal = document.getElementById('deleteModal');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Close modals
document.getElementById('closeViewModal').addEventListener('click', () => {
    viewModal.style.display = 'none';
});

document.getElementById('closeViewButton').addEventListener('click', () => {
    viewModal.style.display = 'none';
});

document.getElementById('closeDeleteModal').addEventListener('click', () => {
    deleteModal.style.display = 'none';
});

document.getElementById('cancelDelete').addEventListener('click', () => {
    deleteModal.style.display = 'none';
});

// Handle delete confirmation
document.getElementById('confirmDelete').addEventListener('click', () => {
    if (currentUserIdToDelete) {
        users = users.filter(user => user.id !== currentUserIdToDelete);
        renderUsers();
        deleteModal.style.display = 'none';
        currentUserIdToDelete = null;
    }
});

// Handle search
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        const filteredUsers = users.filter(user => 
            user.fullName.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm) ||
            user.status.toLowerCase().includes(searchTerm)
        );
        renderUsersTable(filteredUsers);
        pagination.innerHTML = '';
    } else {
        renderUsers();
    }
});

// Enter key for search
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// View user info
function viewUser(userId) {
    const user = users.find(u => u.id === userId);
    
    if (user) {
        document.getElementById('viewFullName').value = user.fullName;
        document.getElementById('viewEmail').value = user.email;
        document.getElementById('viewUsername').value = user.username;
        
        const statusDisplay = {
            'active': 'Hoạt động',
            'inactive': 'Không hoạt động',
            'pending': 'Chờ xác nhận'
        };
        
        document.getElementById('viewStatus').value = statusDisplay[user.status];
        document.getElementById('viewCreated').value = user.created;
        
        viewModal.style.display = 'flex';
    }
}

// Render users table
function renderUsersTable(usersToRender) {
    userTableBody.innerHTML = '';
    
    usersToRender.forEach((user, index) => {
        const row = document.createElement('tr');
        
        const statusDisplay = {
            'active': '<span class="badge badge-active">Hoạt động</span>',
            'inactive': '<span class="badge badge-inactive">Không hoạt động</span>',
            'pending': '<span class="badge badge-pending">Chờ xác nhận</span>'
        };
        
        const displayNumber = (currentPage - 1) * usersPerPage + index + 1;
        
        row.innerHTML = `
            <td>${displayNumber}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${statusDisplay[user.status]}</td>
            <td>${user.created}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-info btn-view" data-id="${user.id}">Xem</button>
                    <button class="btn btn-danger btn-delete" data-id="${user.id}">Xóa</button>
                </div>
            </td>
        `;
        
        userTableBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = parseInt(e.target.getAttribute('data-id'));
            viewUser(userId);
        });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = parseInt(e.target.getAttribute('data-id'));
            currentUserIdToDelete = userId;
            deleteModal.style.display = 'flex';
        });
    });
}

// Render users with pagination
function renderUsers() {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    
    renderUsersTable(currentUsers);
    renderPagination();
}

// Render pagination
function renderPagination() {
    pagination.innerHTML = '';
    const pageCount = Math.ceil(users.length / usersPerPage);
    
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        if (i === currentPage) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            currentPage = i;
            renderUsers();
        });
        
        pagination.appendChild(button);
    }
}

// Initial render
renderUsers();

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === viewModal) {
        viewModal.style.display = 'none';
    }
    if (e.target === deleteModal) {
        deleteModal.style.display = 'none';
    }
});


// beo js
document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");


    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("expand");
    });
});

function setupUserDropdown() {
    const dropdownButton = document.getElementById('dropdownMenuButton');
    
    // Tạo dropdown menu tương thích với Bootstrap
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');
    
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu dropdown-menu-end';
    dropdownMenu.setAttribute('aria-labelledby', 'dropdownMenuButton');
    dropdownMenu.innerHTML = `
        <div class="dropdown-item-text">
            <div class="d-flex align-items-center p-2">
                <img src="https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg" class="rounded-circle" width="50" alt="User">
                <div class="ms-3">
                    <h6 class="mb-0">${getUserName()}</h6>
                    <small class="text-muted">Administrator</small>
                </div>
            </div>
        </div>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item d-flex align-items-center" href="#">
            <span class="material-icons me-2">person</span>
            Thông tin cá nhân
        </a>
        <a class="dropdown-item d-flex align-items-center" href="#">
            <span class="material-icons me-2">settings</span>
            Cài đặt tài khoản
        </a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item d-flex align-items-center text-danger" href="#">
            <span class="material-icons me-2">help</span>
            Trợ giúp
        </a>
    `;

    // Thêm dropdown menu vào DOM
    dropdownButton.parentNode.appendChild(dropdownMenu);
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
