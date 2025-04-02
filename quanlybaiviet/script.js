document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addPostBtn = document.getElementById('add-post-btn');
    const postModal = document.getElementById('post-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const postForm = document.getElementById('post-form');
    const postsList = document.getElementById('posts-list');
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const imageInput = document.getElementById('post-image');
    const imagePreview = document.getElementById('image-preview');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const hashtagFilters = document.getElementById('hashtag-filters');
    const hashtagInput = document.getElementById('post-hashtags');
    // Thêm biến toàn cục
    let currentAction = null; // 'approve' hoặc 'reject'
    // Sample data - now with hashtags
    let posts = [
        {
            id: 1,
            title: 'Giới thiệu về JavaScript',
            content: 'JavaScript là ngôn ngữ lập trình phổ biến...',
            category: 'phim-anh',
            hashtags: ['javascript', 'web', 'frontend'],
            image: 'https://via.placeholder.com/150',
            status: 'published',
            createdAt: '2023-05-15'
        },
        {
            id: 2,
            title: 'Cách học ReactJS hiệu quả',
            content: 'ReactJS là thư viện JavaScript phổ biến...',
            category: 'am-nhac',
            hashtags: ['react', 'javascript', 'frontend'],
            image: 'https://via.placeholder.com/150',
            status: 'pending',
            createdAt: '2023-05-18'
        },
        {
            id: 3,
            title: 'Bài viết nháp về CSS',
            content: 'CSS giúp tạo style cho trang web...',
            category: 'beauty-fashion',
            hashtags: ['css', 'design'],
            image: 'https://via.placeholder.com/150',
            status: 'draft',
            createdAt: '2023-05-20'
        },
        {
            id: 4,
            title: 'Hướng dẫn học Toán cơ bản',
            content: 'Các khái niệm toán học cơ bản...',
            category: 'doi-song',
            hashtags: ['math', 'education'],
            image: 'https://via.placeholder.com/150',
            status: 'pending',
            createdAt: '2023-05-22'
        },
        {
            id: 5,
            title: 'Hướng dẫn học Toán cơ bản',
            content: 'Các khái niệm toán học cơ bản...',
            category: 'xa-hoi',
            hashtags: ['math', 'education'],
            image: 'https://via.placeholder.com/150',
            status: 'pending',
            createdAt: '2023-05-22'
        },
        {
            id: 6,
            title: 'Hướng dẫn học Toán cơ bản',
            content: 'Các khái niệm toán học cơ bản...',
            category: 'suc-khoe',
            hashtags: ['math', 'education'],
            image: 'https://via.placeholder.com/150',
            status: 'published',
            createdAt: '2023-05-22'
        }
    ];
    
    let currentPostId = null;
    let isEditMode = false;
    let activeHashtagFilter = null;

    // Thêm hàm này vào script.js
    function updateStats() {
        const publishedCount = posts.filter(post => post.status === 'published').length;
        const pendingCount = posts.filter(post => post.status === 'pending').length;
        const draftCount = posts.filter(post => post.status === 'draft').length;
        const totalCount = posts.length;
        
        document.getElementById('published-count').textContent = publishedCount;
        document.getElementById('pending-count').textContent = pendingCount;
        document.getElementById('draft-count').textContent = draftCount;
        document.getElementById('total-count').textContent = totalCount;
    }
    
    // Initialize the app
    function init() {
        renderPosts();
        renderHashtagFilters();
        updateStats(); 
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Open add post modal
        addPostBtn.addEventListener('click', openAddPostModal);
        
        // Close modal buttons
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === postModal) closeModal();
            if (e.target === confirmModal) closeConfirmModal();
        });
        
        // Form submission
        postForm.addEventListener('submit', handleFormSubmit);
        
        // Filter and search
        statusFilter.addEventListener('change', renderPosts);
        categoryFilter.addEventListener('change', renderPosts);
        searchInput.addEventListener('input', renderPosts);
        
        // Image preview
        imageInput.addEventListener('change', handleImageUpload);
        
        // Confirm delete buttons
        confirmDeleteBtn.addEventListener('click', deletePost);
        cancelDeleteBtn.addEventListener('click', closeConfirmModal);
        document.querySelectorAll('.action-btn.approve').forEach(btn => {
            btn.addEventListener('click', () => approvePost(parseInt(btn.dataset.id)));
        });
        document.getElementById('confirm-approve').addEventListener('click', handleApproveReject);
        document.getElementById('confirm-reject').addEventListener('click', handleApproveReject);
        document.getElementById('cancel-approve').addEventListener('click', closeAllModals);
        document.getElementById('cancel-reject').addEventListener('click', closeAllModals);
    }
    
    function approvePost(postId) {
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
            // Chỉ duyệt bài đang ở trạng thái chờ duyệt
            if (posts[postIndex].status === 'pending') {
                posts[postIndex].status = 'published';
                renderPosts();
                updateStats();
                alert('Bài viết đã được duyệt và xuất bản!');
            } else {
                alert('Chỉ có thể duyệt bài viết đang ở trạng thái "Chờ duyệt"');
            }
        }
    }


    // Render posts to the table
    function renderPosts() {
        const statusFilterValue = statusFilter.value;
        const categoryFilterValue = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        // Filter posts
        const filteredPosts = posts.filter(post => {
            // Filter by status
            const matchesStatus = statusFilterValue === 'all' || post.status === statusFilterValue;
            
            // Filter by category
            const matchesCategory = categoryFilterValue === 'all' || post.category === categoryFilterValue;
            
            // Filter by search term (title, content or hashtags)
            const matchesSearch = searchTerm === '' || 
                post.title.toLowerCase().includes(searchTerm) || 
                post.content.toLowerCase().includes(searchTerm) ||
                (post.hashtags && post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm)));
            
            // Filter by hashtag
            const matchesHashtag = !activeHashtagFilter || 
                (post.hashtags && post.hashtags.includes(activeHashtagFilter));
            
            return matchesStatus && matchesCategory && matchesSearch && matchesHashtag;

            
        });
        
        // Clear the table
        postsList.innerHTML = '';
        
        // Add each post to the table
        filteredPosts.forEach(post => {
            const row = document.createElement('tr');
            
            // Get category name
            const categoryNames = {
                'phim-anh': 'Phim ảnh',
                'am-nhac': 'Âm nhạc',
                'beauty-fashion': 'Beauty & Fashion',
                'doi-song': 'Đời sống',
                'xa-hoi': 'Xã hội',
                'suc-khoe': 'Sức khỏe'
            };
            
            // Get status badge
            let statusBadge = '';
            if (post.status === 'draft') {
                statusBadge = '<span class="status-badge status-draft">Nháp</span>';
            } else if (post.status === 'pending') {
                statusBadge = '<span class="status-badge status-pending">Chờ duyệt</span>';
            } else if (post.status === 'rejected') {
                statusBadge = '<span class="status-badge status-rejected">Từ chối</span>';
            }
            else {
                statusBadge = '<span class="status-badge status-published">Đã xuất bản</span>';
            } 
            
            // Render hashtags
            let hashtagsHTML = '';
            if (post.hashtags && post.hashtags.length > 0) {
                hashtagsHTML = `<div class="post-hashtags">${
                    post.hashtags.map(tag => 
                        `<span class="post-hashtag">#${tag}</span>`
                    ).join('')
                }</div>`;
            }
            
            row.innerHTML = `
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${categoryNames[post.category] || post.category}</td>
                <td>${hashtagsHTML}</td>
                <td>${statusBadge}</td>
                <td>${formatDate(post.createdAt)}</td>
                <td>
                    <button class="action-btn edit" data-id="${post.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-id="${post.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="action-btn approve" data-id="${post.id}">
                                <i class="fas fa-check"></i>
                    </button>
                </td>
            `;
            
            postsList.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', () => openEditPostModal(parseInt(btn.dataset.id)));
        });
        
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', () => openConfirmModal(parseInt(btn.dataset.id)));
        });

        // Sau khi render xong, cập nhật thống kê
        updateStats();
    }
    
    // Render hashtag filters
    function renderHashtagFilters() {
        // Get all unique hashtags from posts
        const allHashtags = [];
        posts.forEach(post => {
            if (post.hashtags) {
                post.hashtags.forEach(tag => {
                    if (!allHashtags.includes(tag)) {
                        allHashtags.push(tag);
                    }
                });
            }
        });
        
        // Clear existing filters
        hashtagFilters.innerHTML = '';
        
        // Add "All" option
        const allButton = document.createElement('span');
        allButton.className = `hashtag-item ${!activeHashtagFilter ? 'active' : ''}`;
        allButton.textContent = 'Tất cả';
        allButton.addEventListener('click', () => {
            activeHashtagFilter = null;
            renderHashtagFilters();
            renderPosts();
        });
        hashtagFilters.appendChild(allButton);
        
        // Add hashtag filters
        allHashtags.sort().forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = `hashtag-item ${activeHashtagFilter === tag ? 'active' : ''}`;
            tagElement.textContent = `#${tag}`;
            tagElement.addEventListener('click', () => {
                activeHashtagFilter = activeHashtagFilter === tag ? null : tag;
                renderHashtagFilters();
                renderPosts();
            });
            hashtagFilters.appendChild(tagElement);
        });
    }
    
    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }
    
    // Open modal for adding a new post
    function openAddPostModal() {
        isEditMode = false;
        currentPostId = null;
        document.getElementById('modal-title').textContent = 'Thêm bài viết mới';
        postForm.reset();
        imagePreview.innerHTML = '';
        postModal.style.display = 'block';
    }
    
    // Open modal for editing a post
    function openEditPostModal(postId) {
        isEditMode = true;
        currentPostId = postId;
        document.getElementById('modal-title').textContent = 'Sửa bài viết';
        
        const post = posts.find(p => p.id === postId);
        if (post) {
            document.getElementById('post-id').value = post.id;
            document.getElementById('post-title').value = post.title;
            document.getElementById('post-content').value = post.content;
            document.getElementById('post-category').value = post.category;
            document.getElementById('post-status').value = post.status;
            document.getElementById('post-hashtags').value = post.hashtags ? post.hashtags.join(', ') : '';
            
            // Display current image
            imagePreview.innerHTML = `<img src="${post.image}" alt="Ảnh hiện tại">`;
        }
        
        postModal.style.display = 'block';
    }
    
    // Open confirm delete modal
    function openConfirmModal(postId) {
        currentPostId = postId;
        confirmModal.style.display = 'block';
    }
    
    // Cập nhật hàm mở modal
    function openApproveModal(postId) {
        currentPostId = postId;
        currentAction = 'approve';
        document.getElementById('approve-modal').style.display = 'block';
    }

    function openRejectModal(postId) {
        currentPostId = postId;
        currentAction = 'reject';
        document.getElementById('reject-modal').style.display = 'block';
    }

    // Hàm xử lý khi xác nhận
    function handleApproveReject() {
        const postIndex = posts.findIndex(p => p.id === currentPostId);
        if (postIndex !== -1) {
            if (currentAction === 'approve') {
                posts[postIndex].status = 'published';
                alert('Bài viết đã được duyệt!');
            } else {
                posts[postIndex].status = 'rejected';
                alert('Bài viết đã bị từ chối!');
            }
            renderPosts();
            updateStats();
        }
        closeAllModals();
    }

    // Đóng tất cả modal
    function closeAllModals() {
        document.getElementById('approve-modal').style.display = 'none';
        document.getElementById('reject-modal').style.display = 'none';
        document.getElementById('confirm-modal').style.display = 'none';
        document.getElementById('post-modal').style.display = 'none';
    }

    // Close modal
    function closeModal() {
        postModal.style.display = 'none';
    }
    
    // Close confirm modal
    function closeConfirmModal() {
        confirmModal.style.display = 'none';
    }
    
    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const category = document.getElementById('post-category').value;
        const status = document.getElementById('post-status').value;
        
        // Process hashtags
        const hashtagsInput = document.getElementById('post-hashtags').value;
        const hashtags = hashtagsInput 
            ? hashtagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag)
            : [];
        
        // Get image - in a real app, you would upload this to a server
        let image = 'https://via.placeholder.com/150';
        if (imagePreview.querySelector('img')) {
            image = imagePreview.querySelector('img').src;
        }
        
        if (isEditMode) {
            // Update existing post
            const postIndex = posts.findIndex(p => p.id === currentPostId);
            if (postIndex !== -1) {
                posts[postIndex] = {
                    ...posts[postIndex],
                    title,
                    content,
                    category,
                    hashtags,
                    image,
                    status
                };
            }
        } else {
            // Add new post
            const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
            const newPost = {
                id: newId,
                title,
                content,
                category,
                hashtags,
                image,
                status,
                createdAt: new Date().toISOString().split('T')[0]
            };
            posts.push(newPost);
        }
        
        renderPosts();
        renderHashtagFilters();
        closeModal();
        updateStats(); 
    }
    
    // Handle image upload and preview
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Ảnh xem trước">`;
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Delete a post
    function deletePost() {
        posts = posts.filter(post => post.id !== currentPostId);
        renderPosts();
        renderHashtagFilters();
        closeConfirmModal();
        updateStats(); 
    }
    
    // Initialize the application
    init();
});



// Thêm hàm xử lý duyệt bài
function approvePost(postId) {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        // Chỉ duyệt bài đang ở trạng thái chờ duyệt
        if (posts[postIndex].status === 'pending') {
            posts[postIndex].status = 'published';
            renderPosts();
            updateStats();
            alert('Bài viết đã được duyệt và xuất bản!');
        } else {
            alert('Chỉ có thể duyệt bài viết đang ở trạng thái "Chờ duyệt"');
        }
    }
}
