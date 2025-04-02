
        // Sample data with additional fields
const authors = [
    {
        id: 1,
        username: "author1",
        status: "approved",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        fullName: "Nguyễn Văn A",
        email: "author1@example.com",
        password: "password123",
        phone: "0912345678",
        dob: "15/05/1985",
        gender: "Nam",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        experience: "5 năm viết bài cho các tạp chí Âm nhạc",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Âm nhạc", "Phim ảnh", "Xã hội"],
        samples: [
            "https://example.com/bai-viet-mau-1",
            "https://example.com/bai-viet-mau-2"
        ]
    },
    {
        id: 2,
        username: "author2",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        fullName: "Trần Thị B",
        email: "author2@example.com",
        password: "password456",
        phone: "0987654321",
        dob: "20/10/1990",
        gender: "Nữ",
        address: "456 Đường XYZ, Quận 3, TP.HCM",
        experience: "2 năm viết bài công nghệ freelance",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Beauty & Fashion", "Đời sống"],
        samples: [
            "https://example.com/bai-viet-cong-nghe-1",
            "https://example.com/bai-viet-startup"
        ]
    },
    {
        id: 3,
        username: "author3",
        status: "approved",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        fullName: "Lê Văn C",
        email: "author3@example.com",
        password: "password789",
        phone: "0905123456",
        dob: "05/03/1980",
        gender: "Nam",
        address: "789 Đường DEF, Quận 5, TP.HCM",
        experience: "10 năm biên tập viên báo Đời sống",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Đời sống", "Âm nhạc"],
        samples: [
            "https://example.com/bai-phong-su-the-thao",
            "https://example.com/bai-binh-luan-bong-da"
        ]
    },
    {
        id: 4,
        username: "author4",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Beauty & Fashion", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 5,
        username: "author5",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Phim ảnh", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 6,
        username: "author6",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Beauty & Fashion", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 7,
        username: "author7",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Beauty & Fashion"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 8,
        username: "author8",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Đời sống", "Xã hội"],
        samples: [
            // "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 9,
        username: "author9",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Xã hội", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 10,
        username: "author10",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Âm nhạc", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 11,
        username: "author11",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Đời sống", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 12,
        username: "author12",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Phim ảnh", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 13,
        username: "author13",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Beauty & Fashion", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 14,
        username: "author14",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Xã hội", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    },
    {
        id: 15,
        username: "author15",
        status: "pending",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        fullName: "Phạm Thị D",
        email: "author4@example.com",
        password: "password101",
        phone: "0978123456",
        dob: "12/12/1995",
        gender: "Nữ",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        experience: "Mới bắt đầu viết lách",
        idFront: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc",
        idBack: "https://via.placeholder.com/150x100?text=M%E1%BA%B7t+sau",
        fields: ["Âm nhạc", "Sức khỏe"],
        samples: [
            "https://example.com/bai-huong-dan-lam-dep"
        ]
    }
];

// DOM elements
const authorsList = document.getElementById('authors-list');
const pagination = document.getElementById('pagination');
const modal = document.getElementById('authorModal');
const closeBtn = document.querySelector('.close-btn');
const totalAuthorsEl = document.getElementById('total-authors');
const approvedAuthorsEl = document.getElementById('approved-authors');
const pendingAuthorsEl = document.getElementById('pending-authors');
const rejectedAuthorsEl = document.getElementById('rejected-authors');

// Variables
const itemsPerPage = 10;
let currentPage = 1;
 let currentFilter = {
            searchTerm: '',
            field: ''
        };


// Initialize
function init() {
    updateStats();
    renderAuthors();
    renderPagination();
}

// Update statistics
// Cập nhật hàm updateStats (bỏ phần rejected)
function updateStats() {
            const total = authors.length;
            const approved = authors.filter(a => a.status === 'approved').length;
            const pending = authors.filter(a => a.status === 'pending').length;

            totalAuthorsEl.textContent = total;
            approvedAuthorsEl.textContent = approved;
            pendingAuthorsEl.textContent = pending;
        }

// Hàm lọc tác giả
function filterAuthors() {
    return authors.filter(a => {
            const matchesSearch = a.username.toLowerCase().includes(currentFilter.searchTerm) ||
                    a.email.toLowerCase().includes(currentFilter.searchTerm) ||
                    a.phone.includes(currentFilter.searchTerm);
                
            const matchesField = currentFilter.field === '' || 
                    a.fields.includes(currentFilter.field);
                return matchesSearch && matchesField && a.status !== 'rejected';
    });
}

// Phần JavaScript cập nhật
function handleSearch() {
    currentFilter.searchTerm = document.getElementById('search-input').value.toLowerCase();
    currentPage = 1;
    renderAuthors();
    renderPagination();
}

function applyFilter() {
    currentFilter.field = document.getElementById('field-filter').value;
    currentPage = 1;
    renderAuthors();
    renderPagination();
}
// Render authors table
function renderAuthors() {
    authorsList.innerHTML = '';
    const filteredAuthors = filterAuthors();        
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredAuthors.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const author = filteredAuthors[i];
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        
        switch (author.status) {
            case 'approved':
                statusClass = 'status-approved';
                statusText = 'Đã duyệt';
                break;
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Chờ duyệt';
                break;
        }
        
        let actionsHTML = '';
        if (author.status === 'approved') {
            actionsHTML = `
                <button class="action-btn view-btn" onclick="viewAuthor(${author.id})">Xem</button>
                <button class="action-btn delete-btn" onclick="deleteAuthor(${author.id})">Xóa</button>
            `;
        } else if (author.status === 'pending') {
            actionsHTML = `
                <div class="approval-dropdown">
                    <button class="action-btn view-btn" onclick="viewAuthor(${author.id})">Xem</button>
                    <button class="approve-option" onclick="approveAuthor(${author.id})">Duyệt</button>
                    <button class="reject-option" onclick="rejectAuthor(${author.id})">Từ chối</button>            
                </div>
            `;
        }
        
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${author.username}</td>
            <td>${author.gender}</td>
            <td>${author.fields}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>${actionsHTML}</td>
        `;
        
        authorsList.appendChild(row);
    }
}

// Render pagination
function renderPagination() {
    pagination.innerHTML = '';
    const filteredAuthors = filterAuthors();
    const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);
    
    if (totalPages <= 1) return;
    
    // Previous button
    if (currentPage > 1) {
        const prevLi = document.createElement('li');
        prevLi.innerHTML = `<a href="#" onclick="changePage(${currentPage - 1})">&laquo;</a>`;
        pagination.appendChild(prevLi);
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        if (i === currentPage) {
            li.innerHTML = `<a href="#" class="active">${i}</a>`;
        } else {
            li.innerHTML = `<a href="#" onclick="changePage(${i})">${i}</a>`;
        }
        pagination.appendChild(li);
    }
    
    // Next button
    if (currentPage < totalPages) {
        const nextLi = document.createElement('li');
        nextLi.innerHTML = `<a href="#" onclick="changePage(${currentPage + 1})">&raquo;</a>`;
        pagination.appendChild(nextLi);
    }
}

// Thêm hàm xử lý tìm kiếm và lọc
function handleSearch() {
            currentFilter.searchTerm = document.getElementById('search-input').value.toLowerCase();
            currentPage = 1;
            renderAuthors();
            renderPagination();
        }

        function applyFilter() {
            currentFilter.field = document.getElementById('field-filter').value;
            currentPage = 1;
            renderAuthors();
            renderPagination();
        }

// Change page
function changePage(page) {
    currentPage = page;
    renderAuthors();
    renderPagination();
    window.scrollTo(0, 0);
}

// View author details
function viewAuthor(id) {
    const author = authors.find(a => a.id === id);
    if (author) {
        // Basic info
        document.getElementById('modal-avatar').src = author.avatar;
        document.getElementById('modal-name').textContent = author.fullName;
        document.getElementById('modal-email').textContent = author.email;
        document.getElementById('modal-password').textContent = author.password;
        document.getElementById('modal-phone').textContent = author.phone;
        document.getElementById('modal-dob').textContent = author.dob;
        document.getElementById('modal-gender').textContent = author.gender;
        document.getElementById('modal-address').textContent = author.address;
        document.getElementById('modal-experience').textContent = author.experience;
        
        // ID photos
        document.getElementById('modal-id-front').src = author.idFront;
        document.getElementById('modal-id-back').src = author.idBack;
        
        // Writing fields
        const fieldsContainer = document.getElementById('modal-fields');
        fieldsContainer.innerHTML = '';
        author.fields.forEach(field => {
            const fieldTag = document.createElement('span');
            fieldTag.className = 'field-tag';
            fieldTag.textContent = field;
            fieldsContainer.appendChild(fieldTag);
        });
        
        // Writing samples
        const samplesContainer = document.getElementById('modal-samples');
        samplesContainer.innerHTML = '';
        author.samples.forEach(sample => {
            const sampleLink = document.createElement('a');
            sampleLink.href = sample;
            sampleLink.target = '_blank';
            sampleLink.className = 'sample-link';
            sampleLink.textContent = sample;
            samplesContainer.appendChild(sampleLink);
        });
        
        modal.style.display = 'block';
    }
}

// Delete author
function deleteAuthor(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tác giả này?')) {
        const index = authors.findIndex(a => a.id === id);
        if (index !== -1) {
            authors.splice(index, 1);
            updateStats();
            renderAuthors();
            renderPagination();
        }
    }
}

// Approve author
function approveAuthor(id) {
    const author = authors.find(a => a.id === id);
    if (author) {
        author.status = 'approved';
        updateStats();
        renderAuthors();
    }
}

// Reject author
function rejectAuthor(id) {
    const index = authors.findIndex(a => a.id === id);
    if (index !== -1) {
        authors.splice(index, 1);
        updateStats();
        renderAuthors();
        renderPagination();
    }
}

// Toggle dropdown
function toggleDropdown(button) {
    const dropdown = button.nextElementSibling;
    dropdown.classList.toggle('show');
    
    // Close when clicking outside
    window.onclick = function(event) {
        if (!event.target.matches('.approve-btn')) {
            const dropdowns = document.getElementsByClassName("approval-options");
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
}

// Close modal
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Initialize the page
init();

