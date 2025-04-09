document.addEventListener('DOMContentLoaded', function() {
    // ==================== CÁC BIẾN TOÀN CỤC ====================
    let currentModal = null;
    let itemToDelete = null;
    let actionCallback = null;
    
    // ==================== KHỞI TẠO SIDEBAR VÀ TAB ====================
    initSidebar();
    initTabs();
    
    // ==================== KHỞI TẠO CÁC MODAL ====================
    initModals();
    
    // ==================== KHỞI TẠO BẢNG DỮ LIỆU ====================
    initDataTables();
    
    // ==================== KHỞI TẠO BIỂU ĐỒ ====================
    initCharts();
    
    // ==================== CÁC SỰ KIỆN ====================
    document.getElementById('addPostBtn')?.addEventListener('click', () => openModal('addPostModal'));
    document.getElementById('addCategoryBtn')?.addEventListener('click', () => openModal('addCategoryModal'));
    document.getElementById('addUserBtn')?.addEventListener('click', () => openModal('addUserModal'));
    
    document.getElementById('submitPost')?.addEventListener('click', submitPostForm);
    document.getElementById('submitCategory')?.addEventListener('click', submitCategoryForm);
    document.getElementById('submitUser')?.addEventListener('click', submitUserForm);
    document.getElementById('confirmAction')?.addEventListener('click', confirmAction);
    document.getElementById('modal-close')?.addEventListener('click', () => closeModal);
    
    // ==================== CÁC HÀM KHỞI TẠO ====================
    
    // Khởi tạo sidebar với hover
    function initSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        // Xử lý hover cho sidebar
        if (sidebar) {
            let hoverTimeout;
            const sidebarWidth = '260px';
            const collapsedWidth = '80px';
            
            // Mở rộng sidebar khi hover vào
            sidebar.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                this.style.width = sidebarWidth;
                if (mainContent) {
                    mainContent.style.marginLeft = sidebarWidth;
                }
                
                // Hiển thị text trong các menu item
                document.querySelectorAll('.sidebar-link span:not(.material-icons)').forEach(span => {
                    span.style.opacity = '1';
                });
                
                // Hiển thị logo đầy đủ
                const logoImg = document.querySelector('.sidebar-logo img');
                if (logoImg) {
                    logoImg.style.maxWidth = '80%';
                }
            });
            
            // Thu nhỏ sidebar khi rời chuột
            sidebar.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    this.style.width = collapsedWidth;
                    if (mainContent) {
                        mainContent.style.marginLeft = collapsedWidth;
                    }
                    
                    // Ẩn text trong các menu item
                    document.querySelectorAll('.sidebar-link span:not(.material-icons)').forEach(span => {
                        span.style.opacity = '0';
                    });
                    
                    // Thu nhỏ logo
                    const logoImg = document.querySelector('.sidebar-logo img');
                    if (logoImg) {
                        logoImg.style.maxWidth = '40px';
                    }
                }, 300);
            });
            
            // Giữ sidebar mở nếu hover vào dropdown menu
            document.querySelectorAll('.sidebar-dropdown').forEach(dropdown => {
                dropdown.addEventListener('mouseenter', () => {
                    clearTimeout(hoverTimeout);
                    sidebar.style.width = sidebarWidth;
                    if (mainContent) {
                        mainContent.style.marginLeft = sidebarWidth;
                    }
                });
            });
        }
    }
    
    // Khởi tạo các tab
    function initTabs() {
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        const contentSections = document.querySelectorAll('.content-section');
        
        // Lấy hash từ URL nếu có
        const hash = window.location.hash;
        let activeTab = hash || '#dashboard';
        
        // Kích hoạt tab từ hash
        activateTab(activeTab);
        
        // Thêm sự kiện click cho các nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const target = this.getAttribute('href');
                    activateTab(target);
                    history.pushState(null, null, target);
                }
                // Các link khác (external) sẽ hoạt động bình thường
            });
        });
    }
    
    // Kích hoạt tab
    function activateTab(target) {
        // Ẩn tất cả các section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Xóa active class từ tất cả các nav item
        document.querySelectorAll('.sidebar-nav li').forEach(item => {
            item.classList.remove('active');
        });
        
        // Thêm active class cho nav item tương ứng
        const navItem = document.querySelector(`.sidebar-nav a[href="${target}"]`)?.parentElement;
        if (navItem) {
            navItem.classList.add('active');
        }
        
        // Hiển thị section tương ứng
        const targetSection = document.querySelector(target);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Cập nhật tiêu đề header
        updateHeaderTitle(target);
    }
    
    // Cập nhật tiêu đề header
    function updateHeaderTitle(target) {
        const headerTitle = document.querySelector('.header-left h1');
        const sectionTitle = document.querySelector(`${target} .section-header h2`);
        
        if (headerTitle) {
            if (sectionTitle) {
                headerTitle.textContent = sectionTitle.textContent;
            } else {
                headerTitle.textContent = 'Dashboard';
            }
        }
    }
    
    // Khởi tạo các modal
    function initModals() {
        // Mở modal
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                openModal(modalId);
            });
        });
        
        // Đóng modal khi click nút đóng
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        // Đóng modal khi click bên ngoài
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
        });
        
        // Đóng modal khi nhấn ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && currentModal) {
                closeModal();
            }
        });
    }
    
    // Khởi tạo data tables
    function initDataTables() {
        // Thêm sự kiện cho các nút xóa
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                showConfirmModal('Bạn có chắc chắn muốn xóa mục này?', () => {
                    row.remove();
                    showToast('Đã xóa thành công', 'success');
                });
            });
        });
        
        // Thêm sự kiện cho các nút chỉnh sửa
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                // Ở đây có thể mở modal chỉnh sửa với dữ liệu từ hàng tương ứng
                showToast('Chức năng chỉnh sửa', 'info');
            });
        });
        
        // Thêm sự kiện cho các nút duyệt bài viết
        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', function() {
                const statusBadge = this.closest('tr').querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.textContent = 'Đã xuất bản';
                    statusBadge.className = 'status-badge published';
                    showToast('Đã duyệt bài viết', 'success');
                }
            });
        });
        
        // Thêm sự kiện cho các nút khóa/mở khóa người dùng
        document.querySelectorAll('.btn-ban, .btn-unban').forEach(btn => {
            btn.addEventListener('click', function() {
                const isBan = this.classList.contains('btn-ban');
                const statusBadge = this.closest('tr')?.querySelector('.status-badge');
                
                if (statusBadge) {
                    if (isBan) {
                        statusBadge.textContent = 'Đã khóa';
                        statusBadge.className = 'status-badge banned';
                        this.innerHTML = '<i class="fas fa-lock"></i>';
                        this.classList.remove('btn-ban');
                        this.classList.add('btn-unban');
                        showToast('Đã khóa tài khoản', 'success');
                    } else {
                        statusBadge.textContent = 'Hoạt động';
                        statusBadge.className = 'status-badge active';
                        this.innerHTML = '<i class="fas fa-unlock"></i>';
                        this.classList.remove('btn-unban');
                        this.classList.add('btn-ban');
                        showToast('Đã mở khóa tài khoản', 'success');
                    }
                }
            });
        });

        // Xử lý bình luận - chỉ giữ lại nút duyệt và xóa
        document.querySelectorAll('#comments .btn-approve').forEach(btn => {
            btn.addEventListener('click', function() {
                const statusBadge = this.closest('tr')?.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.textContent = 'Đã duyệt';
                    statusBadge.className = 'status-badge approved';
                    showToast('Đã duyệt bình luận', 'success');
                }
            });
        });
        
        document.querySelectorAll('#comments .btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                showConfirmModal('Bạn có chắc chắn muốn xóa bình luận này?', () => {
                    row.remove();
                    showToast('Đã xóa bình luận', 'success');
                });
            });
        });
    }
    
    // Khởi tạo biểu đồ
    function initCharts() {
        // Biểu đồ bài viết
        const postsCtx = document.getElementById('postsChart')?.getContext('2d');
        if (postsCtx) {
            new Chart(postsCtx, {
                type: 'line',
                data: {
                    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                    datasets: [{
                        label: 'Bài viết',
                        data: [12, 19, 15, 27, 24, 32],
                        backgroundColor: 'rgba(67, 97, 238, 0.2)',
                        borderColor: 'rgba(67, 97, 238, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Bài viết theo tháng'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // Biểu đồ người dùng
        const usersCtx = document.getElementById('usersChart')?.getContext('2d');
        if (usersCtx) {
            new Chart(usersCtx, {
                type: 'bar',
                data: {
                    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                    datasets: [{
                        label: 'Người dùng mới',
                        data: [8, 12, 15, 18, 21, 25],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Người dùng mới theo tháng'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
    
    // ==================== CÁC HÀM XỬ LÝ MODAL ====================
    
    // Mở modal
    function openModal(modalId) {
        currentModal = document.getElementById(modalId);
        if (currentModal) {
            currentModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Đóng modal
    function closeModal() {
        if (currentModal) {
            currentModal.style.display = 'none';
            currentModal = null;
            document.body.style.overflow = 'auto';
        }
    }
    
    // Hiển thị modal xác nhận
    function showConfirmModal(message, callback) {
        const confirmModal = document.getElementById('confirmModal');
        if (confirmModal) {
            confirmModal.querySelector('.modal-body p').textContent = message;
            actionCallback = callback;
            openModal('confirmModal');
        }
    }
    
    // Xác nhận hành động
    function confirmAction() {
        if (actionCallback) {
            actionCallback();
            actionCallback = null;
        }
        closeModal();
    }
      
    // ==================== CÁC HÀM TIỆN ÍCH ====================
    
    // Hiển thị thông báo
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Thêm style cho toast
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .toast.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .toast-success {
            background-color: #2ecc71;
        }
        
        .toast-error {
            background-color: #e74c3c;
        }
        
        .toast-info {
            background-color: #3498db;
        }
    `;
    document.head.appendChild(toastStyles);
    initSettings();
    initActivities();
});

function initSettings() {
    // Chuyển tab cài đặt
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Xóa active từ tất cả các tab
            document.querySelectorAll('.settings-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Thêm active cho tab hiện tại
            this.classList.add('active');
            
            // Ẩn tất cả nội dung tab
            document.querySelectorAll('.settings-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Hiển thị nội dung tab tương ứng
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Chọn theme
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Xóa active từ tất cả các option
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Thêm active cho option được chọn
            this.classList.add('active');
            
            // Ở đây có thể thêm code áp dụng theme
            console.log('Đã chọn theme:', theme);
        });
    });
    
    // Xử lý form cài đặt
    document.querySelectorAll('.settings-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Cài đặt đã được lưu thành công', 'success');
        });
    });
}

function initActivities() {
    // Lọc hoạt động
    document.getElementById('activity-type')?.addEventListener('change', function() {
        const type = this.value;
        filterActivities(type);
    });
    
    document.getElementById('activity-time')?.addEventListener('change', function() {
        const time = this.value;
        filterActivities(null, time);
    });
    
    function filterActivities(type = 'all', time = 'today') {
        console.log('Lọc hoạt động theo:', type, time);
        // Ở đây có thể thêm code lọc hoạt động thực tế
    }
    
    // Xử lý nút xem thêm
    document.querySelector('.activity-pagination button')?.addEventListener('click', function() {
        // Ở đây có thể thêm code tải thêm hoạt động
        showToast('Đang tải thêm hoạt động...', 'info');
    });
}

// ================================================================= Users==========================================================

// Biến toàn cục
let usersData = [];
let currentEditingUserId = null;
let currentPage = 1;
const usersPerPage = 5;

// Mock data - Danh sách người dùng ban đầu
const mockUsers = [
    {
        id: 1,
        username: "Admin",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        createdAt: "2023-01-01T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 2,
        username: "Biên tập viên",
        email: "editor@example.com",
        role: "editor",
        status: "active",
        createdAt: "2023-02-15T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 3,
        username: "Người dùng 1",
        email: "user1@example.com",
        role: "user",
        status: "active",
        createdAt: "2023-03-20T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 4,
        username: "Người dùng bị khóa",
        email: "banned@example.com",
        role: "user",
        status: "banned",
        createdAt: "2023-04-10T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 5,
        username: "Admin",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        createdAt: "2023-01-01T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 6,
        username: "Biên tập viên",
        email: "editor@example.com",
        role: "editor",
        status: "active",
        createdAt: "2023-02-15T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 7,
        username: "Người dùng 1",
        email: "user1@example.com",
        role: "user",
        status: "active",
        createdAt: "2023-03-20T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 8,
        username: "Người dùng bị khóa",
        email: "banned@example.com",
        role: "user",
        status: "banned",
        createdAt: "2023-04-10T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 9,
        username: "Admin",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        createdAt: "2023-01-01T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 10,
        username: "Biên tập viên",
        email: "editor@example.com",
        role: "editor",
        status: "active",
        createdAt: "2023-02-15T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 11,
        username: "Người dùng 1",
        email: "user1@example.com",
        role: "user",
        status: "active",
        createdAt: "2023-03-20T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    },
    {
        id: 12,
        username: "Người dùng bị khóa",
        email: "banned@example.com",
        role: "user",
        status: "banned",
        createdAt: "2023-04-10T00:00:00Z",
        avatar: "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg"
    }
];

// Khởi tạo quản lý người dùng
function initUserManagement() {
    // Sử dụng mock data thay vì gọi API
    usersData = [...mockUsers];
    renderUserTable(usersData);
    setupUserEventListeners();
    updatePagination(usersData.length); 
    
    // Thêm sự kiện tìm kiếm
    document.querySelector('#users .search-group input')?.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchUsers(e.target.value.toLowerCase());
        }
    });
}

// Hiển thị danh sách người dùng lên bảng
function renderUserTable(users) {
    const tbody = document.querySelector('#users tbody');
    if (!tbody) return;

    // Tính toán số lượng người dùng cần hiển thị
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = users.slice(startIndex, endIndex);

    tbody.innerHTML = paginatedUsers.map(user => `
        <tr data-id="${user.id}">
            <td>${user.id}</td>
            <td>
                <div class="user-info">
                    <img src="${user.avatar || 'https://tinyurl.com/ms4ebrkc'}" alt="User ">
                    <span>${user.username}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${getRoleName(user.role)}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td><span class="status-badge ${user.status}">${getStatusName(user.status)}</span></td>
            <td>
                <button class="btn btn-edit" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                ${user.status === 'active' 
                    ? `<button class="btn btn-ban" data-id="${user.id}"><i class="fas fa-unlock"></i></button>`
                    : `<button class="btn btn-unban" data-id="${user.id}"><i class="fas fa-lock"></i></button>`}
                <button class="btn btn-delete" data-id="${user.id}"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    updatePagination(users.length);
}

function updatePagination(totalUsers) {
    console.log("Tổng số người dùng:", totalUsers); // Kiểm tra tổng số người dùng
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    // Tính toán số trang
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    console.log("Tổng số trang:", totalPages); // Kiểm tra tổng số trang
    paginationContainer.innerHTML = '';
    console.log("Phần tử pagination:", paginationContainer);

    // Tạo nút "Trước"
    const prevButton = document.createElement('button');
    prevButton.className = 'btn btn-prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        renderUserTable(usersData);
    });
    paginationContainer.appendChild(prevButton);

    // Tạo nút cho từng trang
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `btn btn-page ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderUserTable(usersData);
        });
        paginationContainer.appendChild(pageButton);
    }

    // Tạo nút "Tiếp theo"
    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentPage++;
        renderUserTable(usersData);
    });
    paginationContainer.appendChild(nextButton);
}

// Thiết lập sự kiện cho các nút
function setupUserEventListeners() {
    // Nút thêm người dùng
    document.getElementById('addUserBtn')?.addEventListener('click', () => {
        currentEditingUserId = null;
        resetUserForm();
        openModal('addUserModal');
    });
    
    // Nút lưu người dùng
    document.getElementById('submitUser')?.addEventListener('click', submitUserForm);
    
    // Sự kiện cho các nút trong bảng
    document.querySelector('#users tbody')?.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const userId = parseInt(btn.getAttribute('data-id'));
        if (!userId) return;
        
        if (btn.classList.contains('btn-edit')) {
            editUser(userId);
        } else if (btn.classList.contains('btn-ban')) {
            updateUserStatus(userId, 'banned');
        } else if (btn.classList.contains('btn-unban')) {
            updateUserStatus(userId, 'active');
        } else if (btn.classList.contains('btn-delete')) {
            deleteUser(userId);
        }
    });
    
    // Lọc người dùng
    document.getElementById('userFilter')?.addEventListener('change', (e) => {
        filterUsers(e.target.value);
    });
    
    // Tìm kiếm người dùng
    document.querySelector('#users .search-group button')?.addEventListener('click', () => {
        const searchTerm = document.querySelector('#users .search-group input').value.toLowerCase();
        searchUsers(searchTerm);
    });
}

// Chỉnh sửa người dùng (sử dụng mock data)
function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) {
        showToast('Không tìm thấy người dùng', 'error');
        return;
    }
    
    currentEditingUserId = userId;
    
    // Điền dữ liệu vào form
    document.getElementById('userName').value = user.username;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    // Mật khẩu để trống vì lý do bảo mật
    
    openModal('addUserModal');
}

// Gửi form người dùng (mock)
function submitUserForm() {
    const form = document.getElementById('userForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const userData = {
        username: formData.get('userName'),
        email: formData.get('userEmail'),
        role: formData.get('userRole'),
        password: formData.get('userPassword'),
        status: 'active',
        createdAt: new Date().toISOString(),
        avatar: 'https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg'
    };
    
    // Validate
    if (!userData.username || !userData.email || !userData.role) {
        showToast('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    
    // Nếu là thêm mới và không có password
    if (!currentEditingUserId && !userData.password) {
        showToast('Vui lòng nhập mật khẩu', 'error');
        return;
    }
    
    try {
        if (currentEditingUserId) {
            // Cập nhật người dùng
            const index = usersData.findIndex(u => u.id === currentEditingUserId);
            if (index !== -1) {
                usersData[index] = {
                    ...usersData[index],
                    username: userData.username,
                    email: userData.email,
                    role: userData.role
                };
                showToast('Cập nhật thành công', 'success');
            }
        } else {
            // Thêm người dùng mới
            const newId = Math.max(...usersData.map(u => u.id)) + 1;
            usersData.push({
                id: newId,
                ...userData
            });
            showToast('Thêm người dùng thành công', 'success');
        }
        
        closeModal();
        renderUserTable(usersData);
    } catch (error) {
        showToast('Có lỗi xảy ra', 'error');
    }
}

// Cập nhật trạng thái người dùng (mock)
function updateUserStatus(userId, status) {
    showConfirmModal(`Bạn có chắc muốn ${status === 'banned' ? 'khóa' : 'mở khóa'} người dùng này?`, () => {
        const user = usersData.find(u => u.id === userId);
        if (user) {
            user.status = status;
            renderUserTable(usersData);
            showToast(`Đã ${status === 'banned' ? 'khóa' : 'mở khóa'} người dùng thành công`, 'success');
        } else {
            showToast('Không tìm thấy người dùng', 'error');
        }
    });
}

// Xóa người dùng (mock)
function deleteUser(userId) {
    showConfirmModal('Bạn có chắc muốn xóa người dùng này?', () => {
        const index = usersData.findIndex(u => u.id === userId);
        if (index !== -1) {
            usersData.splice(index, 1);
            renderUserTable(usersData);
            showToast('Đã xóa người dùng thành công', 'success');
        } else {
            showToast('Không tìm thấy người dùng', 'error');
        }
    });
}

// Lọc người dùng
function filterUsers(filter) {
    if (filter === 'all') {
        renderUserTable(usersData);
        return;
    }
    
    const filteredUsers = usersData.filter(user => {
        if (filter === 'banned') return user.status === 'banned';
        return user.role === filter;
    });
    
    renderUserTable(filteredUsers);
}

// Tìm kiếm người dùng
function searchUsers(term) {
    if (!term) {
        renderUserTable(usersData);
        return;
    }
    
    const filteredUsers = usersData.filter(user => 
        user.username.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
    );
    
    renderUserTable(filteredUsers);
}

// Reset form người dùng
function resetUserForm() {
    const form = document.getElementById('userForm');
    if (form) {
        form.reset();
        document.getElementById('userPassword').required = true;
    }
}

// Helper: Chuyển đổi role sang tên hiển thị
function getRoleName(role) {
    const roles = {
        'admin': 'Quản trị viên',
        'editor': 'Biên tập viên',
        'author': 'Tác giả',
        'user': 'Người dùng'
    };
    return roles[role] || role;
}

// Helper: Chuyển đổi status sang tên hiển thị
function getStatusName(status) {
    const statuses = {
        'active': 'Hoạt động',
        'banned': 'Đã khóa',
        'pending': 'Chờ xác nhận'
    };
    return statuses[status] || status;
}

// Helper: Định dạng ngày tháng
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Helper: Hiển thị thông báo
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Helper: Hiển thị modal xác nhận
function showConfirmModal(message, callback) {
    const confirmModal = document.getElementById('confirmModal');
    if (!confirmModal) return;
    
    const modalBody = confirmModal.querySelector('.modal-body p');
    if (modalBody) modalBody.textContent = message;
    
    // Xử lý sự kiện xác nhận
    const confirmBtn = confirmModal.querySelector('#confirmAction');
    if (confirmBtn) {
        // Xóa sự kiện cũ trước khi thêm mới
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        confirmModal.querySelector('#confirmAction').addEventListener('click', () => {
            callback();
            closeModal();
        });
    }
    
    openModal('confirmModal');
}

// Helper: Mở modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Helper: Đóng modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Xử lý form người dùng
function submitUserForm() {
    const name = document.getElementById('userName')?.value;
    const email = document.getElementById('userEmail')?.value;
    const password = document.getElementById('userPassword')?.value;
    const role = document.getElementById('userRole')?.value;

    if (!name || !email || !role) {
        showToast('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    // Nếu đang chỉnh sửa
    if (currentEditingUserId) {
        const index = usersData.findIndex(u => u.id === currentEditingUserId);
        if (index !== -1) {
            usersData[index] = { ...usersData[index], username: name, email: email, role: role };
            showToast('Cập nhật thành công', 'success');
        }
    } else {
        // Thêm người dùng mới
        const newId = Math.max(...usersData.map(u => u.id)) + 1;
        usersData.push({ id: newId, username: name, email: email, role: role, status: 'active' });
        showToast('Thêm người dùng thành công', 'success');
    }

    closeModal();
    renderUserTable(usersData);
}

// Gọi khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', initUserManagement);

// ==================== QUẢN LÝ DANH MỤC ====================

// Dữ liệu danh mục giả
let categoriesData = [
    { id: 1, name: 'Tin tức', slug: 'tin-tuc', parent_id: null, post_count: 45 },
    { id: 2, name: 'Hướng dẫn', slug: 'huong-dan', parent_id: null, post_count: 32 },
    { id: 3, name: 'Sản phẩm', slug: 'san-pham', parent_id: null, post_count: 28 },
    { id: 4, name: 'Công nghệ', slug: 'cong-nghe', parent_id: 1, post_count: 15 },
    { id: 5, name: 'Giải trí', slug: 'giai-tri', parent_id: 1, post_count: 12 }
];

// Hiển thị danh sách danh mục
function renderCategories() {
    const tbody = document.querySelector('#categories table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    categoriesData.forEach(category => {
        const parentName = category.parent_id 
            ? categoriesData.find(c => c.id === category.parent_id)?.name || 'N/A' 
            : 'Không có';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.slug}</td>
            <td>${category.post_count}</td>
            <td>${parentName}</td>
            <td>
                <button class="btn btn-edit" data-id="${category.id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" data-id="${category.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Thêm sự kiện cho các nút
    addCategoryEvents();
}

// Thêm sự kiện cho các nút trong bảng danh mục
function addCategoryEvents() {
    // Sự kiện xóa
    document.querySelectorAll('#categories .btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const category = categoriesData.find(c => c.id === id);
            
            showConfirmModal(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`, () => {
                // Xóa danh mục khỏi dữ liệu
                categoriesData = categoriesData.filter(c => c.id !== id);
                
                // Cập nhật lại danh sách
                renderCategories();
                
                showToast('Đã xóa danh mục thành công', 'success');
            });
        });
    });
    
    // Sự kiện chỉnh sửa
    document.querySelectorAll('#categories .btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const category = categoriesData.find(c => c.id === id);
            
            if (category) {
                openEditCategoryModal(category);
            }
        });
    });
}

// Mở modal thêm/chỉnh sửa danh mục
function openEditCategoryModal(category = null) {
    const modal = document.getElementById('addCategoryModal');
    const form = document.getElementById('categoryForm');
    const modalTitle = modal.querySelector('.modal-header h3');
    
    if (category) {
        // Chế độ chỉnh sửa
        modalTitle.textContent = 'Chỉnh sửa danh mục';
        form.querySelector('#categoryName').value = category.name;
        form.querySelector('#categorySlug').value = category.slug;
        form.querySelector('#categoryParent').value = category.parent_id || '';
        form.querySelector('#categoryDescription').value = category.description || '';
        
        // Lưu id vào form để biết đang chỉnh sửa
        form.dataset.editId = category.id;
    } else {
        // Chế độ thêm mới
        modalTitle.textContent = 'Thêm danh mục mới';
        form.reset();
        delete form.dataset.editId;
    }
    
    // Cập nhật dropdown danh mục cha
    updateParentCategoryDropdown();
    
    openModal('addCategoryModal');
}

// Cập nhật dropdown danh mục cha
function updateParentCategoryDropdown() {
    const select = document.getElementById('categoryParent');
    if (!select) return;
    
    // Giữ lại giá trị đang chọn
    const currentValue = select.value;
    
    // Xóa tất cả option trừ option đầu tiên
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Thêm các danh mục cha (không có parent_id)
    categoriesData
        .filter(c => !c.parent_id)
        .forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    
    // Khôi phục giá trị đã chọn
    if (currentValue) {
        select.value = currentValue;
    }
}

// Xử lý submit form danh mục
function submitCategoryForm() {
    const form = document.getElementById('categoryForm');
    const name = form.querySelector('#categoryName').value.trim();
    const slug = form.querySelector('#categorySlug').value.trim();
    const parentId = form.querySelector('#categoryParent').value 
        ? parseInt(form.querySelector('#categoryParent').value) 
        : null;
    const description = form.querySelector('#categoryDescription').value.trim();
    
    if (!name || !slug) {
        showToast('Vui lòng điền đầy đủ tên và slug cho danh mục', 'error');
        return;
    }
    
    // Kiểm tra slug đã tồn tại chưa (trừ trường hợp đang edit)
    const isEdit = form.dataset.editId;
    const existingSlug = categoriesData.find(c => 
        c.slug === slug && (!isEdit || c.id !== parseInt(isEdit))
    );
    
    if (existingSlug) {
        showToast('Slug đã tồn tại, vui lòng chọn slug khác', 'error');
        return;
    }
    
    if (isEdit) {
        // Cập nhật danh mục
        const id = parseInt(form.dataset.editId);
        const index = categoriesData.findIndex(c => c.id === id);
        
        if (index !== -1) {
            categoriesData[index] = {
                ...categoriesData[index],
                name,
                slug,
                parent_id: parentId,
                description
            };
            
            showToast('Cập nhật danh mục thành công', 'success');
        }
    } else {
        // Thêm danh mục mới
        const newId = categoriesData.length > 0 
            ? Math.max(...categoriesData.map(c => c.id)) + 1 
            : 1;
        
        categoriesData.push({
            id: newId,
            name,
            slug,
            parent_id: parentId,
            description,
            post_count: 0
        });
        
        showToast('Thêm danh mục mới thành công', 'success');
    }
    
    // Đóng modal và render lại danh sách
    closeModal();
    renderCategories();
}

// Khởi tạo quản lý danh mục khi DOM tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Thêm sự kiện cho nút thêm danh mục
    document.getElementById('addCategoryBtn')?.addEventListener('click', () => {
        openEditCategoryModal();
    });
    
    // Thêm sự kiện submit form
    document.getElementById('submitCategory')?.addEventListener('click', submitCategoryForm);
    
    // Render danh sách ban đầu
    renderCategories();
});

// Xử lý form danh mục
function submitCategoryForm() {
    const form = document.getElementById('categoryForm');
    const name = form.querySelector('#categoryName').value.trim();
    const slug = form.querySelector('#categorySlug').value.trim();
    const parentId = form.querySelector('#categoryParent').value 
        ? parseInt(form.querySelector('#categoryParent').value) 
        : null;
    const description = form.querySelector('#categoryDescription').value.trim();
    
    if (!name || !slug) {
        showToast('Vui lòng điền đầy đủ tên và slug cho danh mục', 'error');
        return;
    }
    
    const isEdit = form.dataset.editId;
    const existingSlug = categoriesData.find(c => 
        c.slug === slug && (!isEdit || c.id !== parseInt(isEdit))
    );
    
    if (existingSlug) {
        showToast('Slug đã tồn tại, vui lòng chọn slug khác', 'error');
        return;
    }
    
    if (isEdit) {
        const id = parseInt(form.dataset.editId);
        const index = categoriesData.findIndex(c => c.id === id);
        
        if (index !== -1) {
            categoriesData[index] = {
                ...categoriesData[index],
                name,
                slug,
                parent_id: parentId,
                description
            };
            showToast('Cập nhật danh mục thành công', 'success');
        } 
    } else {
        const newId = categoriesData.length > 0 
            ? Math.max(...categoriesData.map(c => c.id)) + 1 
            : 1;
        
        categoriesData.push({
            id: newId,
            name,
            slug,
            parent_id: parentId,
            description,
            post_count: 0
        });
        
        showToast('Thêm danh mục mới thành công', 'success');
    }
    
    closeModal(); // Đảm bảo gọi hàm này để đóng modal
    renderCategories(); // Cập nhật danh sách danh mục
}

// ==================== QUẢN LÝ BÀI VIẾT ====================

// Dữ liệu giả cho bài viết
let postsData = [
    {
        id: 1,
        title: "Hướng dẫn sử dụng trang quản trị",
        category: "Hướng dẫn",
        author: "Admin",
        date: "10/05/2023",
        status: "published",
        content: "Nội dung hướng dẫn sử dụng trang quản trị chi tiết..."
    },
    {
        id: 2,
        title: "Tin tức mới nhất tháng 5",
        category: "Tin tức",
        author: "Editor",
        date: "08/05/2023",
        status: "pending",
        content: "Các tin tức nổi bật trong tháng 5..."
    },
    {
        id: 3,
        title: "Bài viết mẫu",
        category: "Khác",
        author: "Admin",
        date: "05/05/2023",
        status: "draft",
        content: "Đây là bài viết mẫu để thử nghiệm..."
    }
];

// Khởi tạo bảng bài viết
function initPostsTable() {
    renderPostsTable();
    
    // Sự kiện lọc bài viết
    document.getElementById('postFilter')?.addEventListener('change', function() {
        renderPostsTable(this.value);
    });
    
    // Sự kiện tìm kiếm bài viết
    document.querySelector('#posts .btn-search')?.addEventListener('click', function() {
        const searchTerm = document.querySelector('#posts input[type="text"]').value.toLowerCase();
        const filteredPosts = postsData.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.author.toLowerCase().includes(searchTerm) ||
            post.category.toLowerCase().includes(searchTerm)
        );
        renderPostsTable(document.getElementById('postFilter').value, filteredPosts);
    });
}

// Render bảng bài viết
function renderPostsTable(filter = 'all', data = postsData) {
    const tableBody = document.querySelector('#posts tbody');
    if (!tableBody) return;
    
    // Lọc dữ liệu theo trạng thái
    let filteredData = data;
    if (filter !== 'all') {
        filteredData = data.filter(post => post.status === filter);
    }
    
    tableBody.innerHTML = '';
    
    filteredData.forEach(post => {
        const row = document.createElement('tr');
        
        // Chuyển đổi trạng thái sang tiếng Việt
        let statusText = '';
        let statusClass = '';
        switch(post.status) {
            case 'published':
                statusText = 'Đã xuất bản';
                statusClass = 'published';
                break;
            case 'pending':
                statusText = 'Chờ duyệt';
                statusClass = 'pending';
                break;
            case 'draft':
                statusText = 'Bản nháp';
                statusClass = 'draft';
                break;
        }
        
        row.innerHTML = `
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.category}</td>
            <td>${post.author}</td>
            <td>${post.date}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                ${post.status === 'pending' ? 
                    '<button class="btn btn-approve"><i class="fas fa-check"></i></button>' : 
                    ''}
                <button class="btn btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Thêm sự kiện cho các nút trong bảng
    addPostsTableEvents();
}

// Thêm sự kiện cho bảng bài viết
function addPostsTableEvents() {
    // Sự kiện duyệt bài viết
    document.querySelectorAll('#posts .btn-approve').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const postId = parseInt(row.cells[0].textContent);
            
            // Tìm và cập nhật bài viết trong dữ liệu
            const postIndex = postsData.findIndex(post => post.id === postId);
            if (postIndex !== -1) {
                postsData[postIndex].status = 'published';
                showToast('Bài viết đã được duyệt', 'success');
                renderPostsTable(document.getElementById('postFilter').value);
            }
        });
    });
    
    // Sự kiện xóa bài viết
    document.querySelectorAll('#posts .btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const postId = parseInt(row.cells[0].textContent);
            
            showConfirmModal('Bạn có chắc chắn muốn xóa bài viết này?', () => {
                // Xóa bài viết khỏi dữ liệu
                postsData = postsData.filter(post => post.id !== postId);
                showToast('Đã xóa bài viết', 'success');
                renderPostsTable(document.getElementById('postFilter').value);
            });
        });
    });
    
    // Sự kiện chỉnh sửa bài viết
    document.querySelectorAll('#posts .btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const postId = parseInt(row.cells[0].textContent);
            const post = postsData.find(p => p.id === postId);
            
            if (post) {
                openEditPostModal(post);
            }
        });
    });
}

// Mở modal chỉnh sửa bài viết
function openEditPostModal(post) {
    // Điền dữ liệu vào form
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    
    // Chọn danh mục
    const categorySelect = document.getElementById('postCategory');
    if (categorySelect) {
        for (let i = 0; i < categorySelect.options.length; i++) {
            if (categorySelect.options[i].text === post.category) {
                categorySelect.selectedIndex = i;
                break;
            }
        }
    }
    
    // Chọn trạng thái
    const statusSelect = document.getElementById('postStatus');
    if (statusSelect) {
        for (let i = 0; i < statusSelect.options.length; i++) {
            if (statusSelect.options[i].value === post.status) {
                statusSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    // Thay đổi tiêu đề modal
    const modalTitle = document.querySelector('#addPostModal .modal-header h3');
    if (modalTitle) {
        modalTitle.textContent = 'Chỉnh sửa bài viết';
    }
    
    // Thay đổi sự kiện submit
    const submitBtn = document.getElementById('submitPost');
    if (submitBtn) {
        submitBtn.onclick = function() {
            updatePost(post.id);
        };
    }
    
    openModal('addPostModal');
}

// Cập nhật bài viết
function updatePost(postId) {
    const title = document.getElementById('postTitle')?.value;
    const category = document.getElementById('postCategory')?.value;
    const content = document.getElementById('postContent')?.value;
    const status = document.getElementById('postStatus')?.value;
    
    if (!title || !category || !content || !status) {
        showToast('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    
    // Tìm và cập nhật bài viết
    const postIndex = postsData.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        postsData[postIndex] = {
            ...postsData[postIndex],
            title,
            category: document.getElementById('postCategory').options[document.getElementById('postCategory').selectedIndex].text,
            content,
            status
        };
        
        showToast('Đã cập nhật bài viết', 'success');
        renderPostsTable(document.getElementById('postFilter').value);
        closeModal();
        
        // Reset form và sự kiện submit
        document.getElementById('postForm')?.reset();
        document.getElementById('submitPost').onclick = submitPostForm;
    }
}

// Thêm bài viết mới
function submitPostForm() {
    const title = document.getElementById('postTitle')?.value;
    const category = document.getElementById('postCategory')?.value;
    const content = document.getElementById('postContent')?.value;
    const status = document.getElementById('postStatus')?.value;
    
    if (!title || !category || !content || !status) {
        showToast('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    
    // Tạo ID mới
    const newId = postsData.length > 0 ? Math.max(...postsData.map(post => post.id)) + 1 : 1;
    
    // Thêm bài viết mới vào dữ liệu
    postsData.push({
        id: newId,
        title,
        category: document.getElementById('postCategory').options[document.getElementById('postCategory').selectedIndex].text,
        author: "Admin", // Mặc định là admin khi thêm mới
        date: new Date().toLocaleDateString('vi-VN'),
        status,
        content
    });
    
    showToast('Đã thêm bài viết mới', 'success');
    renderPostsTable();
    closeModal();
    
    // Reset form
    document.getElementById('postForm')?.reset();
}

// Khởi tạo bảng bài viết
initPostsTable();