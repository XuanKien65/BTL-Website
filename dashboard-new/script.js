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
                        this.innerHTML = '<i class="fas fa-unlock"></i>';
                        this.classList.remove('btn-ban');
                        this.classList.add('btn-unban');
                        showToast('Đã khóa tài khoản', 'success');
                    } else {
                        statusBadge.textContent = 'Hoạt động';
                        statusBadge.className = 'status-badge active';
                        this.innerHTML = '<i class="fas fa-lock"></i>';
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
    
    // ==================== CÁC HÀM XỬ LÝ FORM ====================
    
    // Xử lý form bài viết
    function submitPostForm() {
        const title = document.getElementById('postTitle')?.value;
        const category = document.getElementById('postCategory')?.value;
        const content = document.getElementById('postContent')?.value;
        
        if (!title || !category || !content) {
            showToast('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }
        
        // Ở đây có thể thêm code gửi dữ liệu đến server
        showToast('Đã thêm bài viết thành công', 'success');
        closeModal();
        
        // Reset form
        document.getElementById('postForm')?.reset();
    }
    
    // Xử lý form danh mục
    function submitCategoryForm() {
        const name = document.getElementById('categoryName')?.value;
        const slug = document.getElementById('categorySlug')?.value;
        
        if (!name || !slug) {
            showToast('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }
        
        // Ở đây có thể thêm code gửi dữ liệu đến server
        showToast('Đã thêm danh mục thành công', 'success');
        closeModal();
        
        // Reset form
        document.getElementById('categoryForm')?.reset();
    }
    
    // Xử lý form người dùng
    function submitUserForm() {
        const name = document.getElementById('userName')?.value;
        const email = document.getElementById('userEmail')?.value;
        const password = document.getElementById('userPassword')?.value;
        const role = document.getElementById('userRole')?.value;
        
        if (!name || !email || !password || !role) {
            showToast('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }
        
        // Ở đây có thể thêm code gửi dữ liệu đến server
        showToast('Đã thêm người dùng thành công', 'success');
        closeModal();
        
        // Reset form
        document.getElementById('userForm')?.reset();
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
            bottom: 20px;
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