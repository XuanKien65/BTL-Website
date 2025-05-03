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
    // ... các bài viết khác
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
  