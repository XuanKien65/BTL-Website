// Dữ liệu mẫu
const sampleArticles = [
    {
        id: 1,
        title: "10 xu hướng thiết kế web năm 2023 10 xu hướng thiết kế web năm 2023",
        excerpt: "Khám phá các xu hướng thiết kế web hàng đầu sẽ thống trị trong năm 2023 và cách áp dụng chúng vào dự án của bạn.Khám phá các xu hướng thiết kế web hàng đầu sẽ thống trị trong năm 2023 và cách áp dụng chúng vào dự án của bạn.Khám phá các xu hướng thiết kế web hàng đầu sẽ thống trị trong năm 2023 và cách áp dụng chúng vào dự án của bạn.Khám phá các xu hướng thiết kế web hàng đầu sẽ thống trị trong năm 2023 và cách áp dụng chúng vào dự án của bạn.Khám phá các xu hướng thiết kế web hàng đầu sẽ thống trị trong năm 2023 và cách áp dụng chúng vào dự án của bạn.Khám phá các xu hướng thiết kế web hàng đầu sẽ thống trị trong năm 2023 và cách áp dụng chúng vào dự án của bạn.",
        category: "Beauty & Fashion",
        date: "2023-05-15",
        views: 1245,
        image: "https://images2.thanhnien.vn/528068263637045248/2024/12/4/3-17332802768611370004247.jpg"
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
const articlesPerPage = 12;
let filteredArticles = [...sampleArticles];
const viewOptions = document.querySelectorAll('.view-option');

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const resultsList = document.getElementById('results-list');
const resultsCount = document.getElementById('results-count');
const pagination = document.getElementById('pagination');

// Hàm khởi tạo
function init() {
    renderArticles();
    setupEventListeners();
}

// Thiết lập event listeners
function setupEventListeners() {
    // Tìm kiếm
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Bộ lọc
    categoryFilter.addEventListener('change', handleFilterChange);
    sortBy.addEventListener('change', handleFilterChange);

    // Chuyển đổi view
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            currentView = option.dataset.view;
            resultsList.classList.toggle('grid-view', currentView === 'grid');
            renderArticles();
        });
    });
}

// Xử lý tìm kiếm
function handleSearch() {
    currentPage = 1;
    handleFilterChange();
}

// Xử lý thay đổi bộ lọc
function handleFilterChange() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const sortValue = sortBy.value;

    // Lọc bài viết
    filteredArticles = sampleArticles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm) || 
                            article.excerpt.toLowerCase().includes(searchTerm);
        const matchesCategory = category === '' || article.category === category;
        return matchesSearch && matchesCategory;
    });

    // Sắp xếp bài viết
    switch(sortValue) {
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
            <a href="#" class="article-image">
                <img src="${article.image}" alt="${article.title}">
            </a>
            <div class="article-content">
                <span class="article-category">${getCategoryName(article.category)}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <a href="#" class="read-more">
                <span>Đọc thêm </span> 
                <span class="material-icons">trending_flat</span> </a>
                <div class="article-meta">
                    <span>${(article.date)}</span>
                    <span> ${article.views.toLocaleString()} lượt xem</span>
                    </span>
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
    prevButton.innerHTML = `<span class="material-icons">chevron_left</span>`;
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
    nextButton.innerHTML = `<span class="material-icons">chevron_right</span>`;
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
// function formatDate(dateString) {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('vi-VN', options);
// }

// Khởi chạy ứng dụng
init();

document.addEventListener('DOMContentLoaded', function() {
    const searchContainer = document.getElementById('searchContainer');
    // const searchToggle = document.getElementById('searchToggle');
    
    // Toggle advanced search panel
    searchToggle.addEventListener('click', function() {
        searchContainer.classList.toggle('active');
    });
    
    // Apply filters
    applyFiltersBtn.addEventListener('click', function() {
        // Lấy giá trị radio button đã chọn (sắp xếp)
        const selectedSort = document.querySelector('input[name="filter-type"]:checked').value;
        
        // Lấy tất cả các loại nội dung đã chọn
        const contentTypes = [];
        document.querySelectorAll('input[name="content-type"]:checked').forEach(function(checkbox) {
            contentTypes.push(checkbox.value);
        });
        
        // Lấy tất cả các danh mục đã chọn
        const categories = [];
        document.querySelectorAll('input[name="category"]:checked').forEach(function(checkbox) {
            categories.push(checkbox.value);
        });
        
        // Tạo object chứa tất cả bộ lọc
        const filters = {
            sortBy: selectedSort,
            contentTypes: contentTypes,
            categories: categories
        };
        searchContainer.classList.remove('active');
        
        // Trong ứng dụng thực tế, bạn sẽ gọi API hoặc lọc dữ liệu tại đây
        // applyFiltersToData(filters);
    });
    
});