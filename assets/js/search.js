// Dữ liệu mẫu
const sampleArticles = [
    {
        id: 1,
        title: "10 xu hướng thiết kế web năm 2023",
        excerpt: "Khám phá các xu hướng thiết kế web hàng đầu sẽ thống trị trong năm 2023 và cách áp dụng chúng vào dự án của bạn.",
        category: "Beauty & Fashion",
        date: "2023-05-15",
        views: 1245,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 2,
        title: "Hướng dẫn React JS cho người mới bắt đầu",
        excerpt: "Bài viết này sẽ hướng dẫn bạn từng bước cách xây dựng ứng dụng đầu tiên với React JS.",
        category: "Phim ảnh",
        date: "2023-04-22",
        views: 2873,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 3,
        title: "Chiến lược tiếp thị nội dung hiệu quả",
        excerpt: "Tìm hiểu cách xây dựng chiến lược tiếp thị nội dung giúp tăng trưởng doanh nghiệp của bạn.",
        category: "Âm nhạc",
        date: "2023-06-10",
        views: 892,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 4,
        title: "Cách tối ưu hóa SEO cho website",
        excerpt: "Các kỹ thuật SEO quan trọng giúp cải thiện thứ hạng trang web của bạn trên công cụ tìm kiếm.",
        category: "Sức khỏe",
        date: "2023-03-18",
        views: 3567,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 5,
        title: "Lối sống tối giản: Bắt đầu từ đâu?",
        excerpt: "Hướng dẫn thực tế để áp dụng lối sống tối giản vào cuộc sống hàng ngày của bạn.",
        category: "Đời sống",
        date: "2023-05-30",
        views: 1532,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 6,
        title: "Công nghệ AI và tương lai của ngành công nghiệp",
        excerpt: "Phân tích tác động của trí tuệ nhân tạo đến các ngành công nghiệp trong tương lai gần.",
        category: "Xã hội",
        date: "2023-06-05",
        views: 2104,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 7,
        title: "Công nghệ AI và tương lai của ngành công nghiệp",
        excerpt: "Phân tích tác động của trí tuệ nhân tạo đến các ngành công nghiệp trong tương lai gần.",
        category: "Xã hội",
        date: "2023-06-05",
        views: 2104,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 8,
        title: "Công nghệ AI và tương lai của ngành công nghiệp",
        excerpt: "Phân tích tác động của trí tuệ nhân tạo đến các ngành công nghiệp trong tương lai gần.",
        category: "Xã hội",
        date: "2023-06-05",
        views: 2104,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 9,
        title: "Công nghệ AI và tương lai của ngành công nghiệp",
        excerpt: "Phân tích tác động của trí tuệ nhân tạo đến các ngành công nghiệp trong tương lai gần.",
        category: "Xã hội",
        date: "2023-06-05",
        views: 2104,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 10,
        title: "Công nghệ AI và tương lai của ngành công nghiệp",
        excerpt: "Phân tích tác động của trí tuệ nhân tạo đến các ngành công nghiệp trong tương lai gần.",
        category: "Xã hội",
        date: "2023-06-05",
        views: 2104,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 11,
        title: "Công nghệ AI và tương lai của ngành công nghiệp",
        excerpt: "Phân tích tác động của trí tuệ nhân tạo đến các ngành công nghiệp trong tương lai gần.",
        category: "Xã hội",
        date: "2023-06-05",
        views: 2104,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 12,
        title: "Công nghệ AI và tương lai của ngành công nghiệp",
        excerpt: "Phân tích tác động của trí tuệ nhân tạo đến các ngành công nghiệp trong tương lai gần.",
        category: "Xã hội",
        date: "2023-06-05",
        views: 2104,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 13,
        title: "Công nghệ AI và tương lai của ngành công nghiệp",
        excerpt: "Phân tích tác động của trí tuệ nhân tạo đến các ngành công nghiệp trong tương lai gần.",
        category: "Xã hội",
        date: "2023-06-05",
        views: 2104,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    },
    {
        id: 14,
        title: "Công nghệ AI và tương lai của ngành công nghiệp",
        excerpt: "Phân tích tác động của trí tuệ nhân tạo đến các ngành công nghiệp trong tương lai gần.",
        category: "Xã hội",
        date: "2023-06-05",
        views: 2104,
        image: "https://sieupet.com/sites/default/files/phoi_giong_aln2.png"
    }
];

// Biến toàn cục
let currentView = 'list';
let currentPage = 1;
const articlesPerPage = 9;
let filteredArticles = [...sampleArticles];

// Biến để theo dõi các bộ lọc đã chọn và đang chờ áp dụng
let selectedFilters = {
    contentTypes: new Set(),
    categories: new Set(),
    sortBy: 'newest'
};

// Biến để lưu trữ các lựa chọn tạm thời
let tempFilters = {
    contentTypes: new Set(),
    categories: new Set(),
    sortBy: 'newest'
};

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const resultsList = document.getElementById('results-list');
const resultsCount = document.getElementById('results-count');
const pagination = document.getElementById('pagination');
const viewOptions = document.querySelectorAll('.view-option');
const searchContainer = document.getElementById('searchContainer');
const searchToggle = document.getElementById('searchToggle');
const advancedSearch = document.getElementById('advancedSearch');
const applyFiltersBtn = document.getElementById('applyFilters');

// Hàm khởi tạo
function init() {
    // Kiểm tra xem các phần tử DOM cần thiết đã tồn tại chưa
    if (resultsList && resultsCount) {
        renderArticles();
    }
    setupEventListeners();
}

// Thiết lập event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Tìm kiếm nâng cao
    if (searchToggle && advancedSearch) {
        console.log('Found search toggle and advanced search elements');
        searchToggle.addEventListener('click', function(e) {
            console.log('Toggle button clicked');
            e.stopPropagation();
            advancedSearch.classList.toggle('active');
            // Thay đổi icon mũi tên
            const chevronIcon = searchToggle.querySelector('.material-icons');
            if (advancedSearch.classList.contains('active')) {
                chevronIcon.textContent = 'expand_less';
            } else {
                chevronIcon.textContent = 'expand_more';
            }
        });
    } else {
        console.log('Missing search toggle or advanced search elements');
    }

    // Xử lý cho các checkbox loại nội dung
    document.querySelectorAll('input[name="content-type"]').forEach(checkbox => {
        checkbox.addEventListener('change', function(e) {
            e.stopPropagation();
            if (this.checked) {
                tempFilters.contentTypes.add(this.value);
            } else {
                tempFilters.contentTypes.delete(this.value);
            }
        });
    });

    // Xử lý cho các checkbox danh mục
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', function(e) {
            e.stopPropagation();
            if (this.checked) {
                tempFilters.categories.add(this.value);
            } else {
                tempFilters.categories.delete(this.value);
            }
        });
    });

    // Xử lý cho radio buttons sắp xếp
    document.querySelectorAll('input[name="filter-type"]').forEach(radio => {
        radio.addEventListener('change', function(e) {
            e.stopPropagation();
            tempFilters.sortBy = this.value;
        });
    });

    // Xử lý nút áp dụng bộ lọc
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Cập nhật selectedFilters từ tempFilters
            selectedFilters.contentTypes = new Set(tempFilters.contentTypes);
            selectedFilters.categories = new Set(tempFilters.categories);
            selectedFilters.sortBy = tempFilters.sortBy;

            // Cập nhật hiển thị và kết quả
            updateSelectedFiltersDisplay();
            handleFilterChange();

            // Đóng panel
            if (advancedSearch) {
                advancedSearch.classList.remove('active');
                const chevronIcon = searchToggle.querySelector('.material-icons');
                chevronIcon.textContent = 'expand_more';
            }
        });
    }
    
    // Thêm hiệu ứng hover cho các mục lựa chọn
    const checkboxes = document.querySelectorAll('.inner-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f0f0f0';
        });
        
        checkbox.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
}

// Xử lý thay đổi bộ lọc
function handleFilterChange() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    // Lọc bài viết
    filteredArticles = sampleArticles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm) || 
                            article.excerpt.toLowerCase().includes(searchTerm);
        const matchesContentTypes = selectedFilters.contentTypes.size === 0 || 
                                  selectedFilters.contentTypes.has(article.category);
        const matchesCategories = selectedFilters.categories.size === 0 || 
                                selectedFilters.categories.has(article.category);
        
        return matchesSearch && matchesContentTypes && matchesCategories;
    });

    // Sắp xếp bài viết
    switch(selectedFilters.sortBy) {
        case 'newest':
            filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'popular':
            filteredArticles.sort((a, b) => b.views - a.views);
            break;
    }

    renderArticles();
}

// Hiển thị bài viết
function renderArticles() {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

    resultsList.innerHTML = '';
    resultsCount.textContent = `${filteredArticles.length} kết quả tìm thấy`;

    if (paginatedArticles.length === 0) {
        resultsList.innerHTML = '<p class="no-results">Không tìm thấy bài viết phù hợp.</p>';
        pagination.innerHTML = '';
        return;
    }

    paginatedArticles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.className = 'article-card';
        articleEl.innerHTML = `
            <div class="article-image" style="background-image: url('${article.image}')"></div>
            <div class="article-content">
                <span class="article-category">${getCategoryName(article.category)}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <span>${formatDate(article.date)}</span>
                    <span><i class="fas fa-eye"></i> ${article.views.toLocaleString()} lượt xem</span>
                </div>
            </div>
        `;
        resultsList.appendChild(articleEl);
    });

    renderPagination();
}

// Hiển thị phân trang
function renderPagination() {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    pagination.innerHTML = '';

    // Nút Previous
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderArticles();
        }
    });
    pagination.appendChild(prevButton);

    // Các nút trang
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderArticles();
        });
        pagination.appendChild(pageButton);
    }

    // Nút Next
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderArticles();
        }
    });
    pagination.appendChild(nextButton);
}

// Hàm trợ giúp: Lấy tên chuyên mục 
function getCategoryName(category) {
    const categories = {
        'technology': 'Công nghệ',
        'design': 'Thiết kế',
        'business': 'Kinh doanh',
        'lifestyle': 'Lối sống'
    };
    return categories[category] || category;    
}

// Hàm trợ giúp: Định dạng ngày
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
}

// Kiểm tra và khởi tạo lại nếu cần
function reinitialize() {
    // Reset các biến toàn cục
    currentView = 'list';
    currentPage = 1;
    filteredArticles = [...sampleArticles];
    
    // Khởi tạo lại các event listeners
    setupEventListeners();
    
    // Render lại kết quả
    renderArticles();
}

// Thêm event listener cho việc load lại trang
window.addEventListener('load', reinitialize);

// Thêm event listener cho việc visibility change
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        reinitialize();
    }
});

// Hàm cập nhật hiển thị các bộ lọc đã chọn
function updateSelectedFiltersDisplay() {
    const selectedFiltersContainer = document.getElementById('selected-filters');
    if (!selectedFiltersContainer) return;

    // Xóa tất cả các bộ lọc hiện tại
    selectedFiltersContainer.innerHTML = '';

    // Hiển thị các loại nội dung đã chọn
    selectedFilters.contentTypes.forEach(type => {
        const filterTag = document.createElement('div');
        filterTag.className = 'filter-tag';
        filterTag.innerHTML = `
            ${type}
            <span class="remove-filter" data-type="contentType" data-value="${type}">&times;</span>
        `;
        selectedFiltersContainer.appendChild(filterTag);
    });

    // Hiển thị các danh mục đã chọn
    selectedFilters.categories.forEach(category => {
        const filterTag = document.createElement('div');
        filterTag.className = 'filter-tag';
        filterTag.innerHTML = `
            ${category}
            <span class="remove-filter" data-type="category" data-value="${category}">&times;</span>
        `;
        selectedFiltersContainer.appendChild(filterTag);
    });

    // Thêm event listeners cho nút xóa
    document.querySelectorAll('.remove-filter').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            const value = this.dataset.value;
            removeFilter(type, value);
        });
    });
}

// Hàm xóa bộ lọc
function removeFilter(type, value) {
    if (type === 'contentType') {
        selectedFilters.contentTypes.delete(value);
        tempFilters.contentTypes.delete(value);
        // Bỏ check checkbox tương ứng
        const checkbox = document.querySelector(`input[name="content-type"][value="${value}"]`);
        if (checkbox) checkbox.checked = false;
    } else if (type === 'category') {
        selectedFilters.categories.delete(value);
        tempFilters.categories.delete(value);
        // Bỏ check checkbox tương ứng
        const checkbox = document.querySelector(`input[name="category"][value="${value}"]`);
        if (checkbox) checkbox.checked = false;
    }
    
    // Cập nhật hiển thị và áp dụng bộ lọc
    updateSelectedFiltersDisplay();
    handleFilterChange();
}

// Khởi tạo
function initializeSearch() {
    console.log('Initializing search...');
    setupEventListeners();
    console.log('Search initialized');
}

// Chạy khi DOM đã load xong
document.addEventListener('DOMContentLoaded', initializeSearch);

// Chạy khi trang được load lại
window.addEventListener('load', initializeSearch);

// Chạy khi trang được hiển thị lại (khi quay lại từ tab khác)
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        initializeSearch();
    }
});