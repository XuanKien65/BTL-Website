document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("expand");
    });
    
    const date = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    const paper = [100,200,300,500,400,100,700,1000,900,1000,1100,200,100,200,300,500,400,100,700,1000,900,1000,1100,200,100,200,300,500,400,100];
    const ctx = document.getElementById("chart").getContext("2d");

new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [
                {
                    label: 'Lượng truy cập',
                    data: paper,
                    backgroundColor: 'rgba(253, 86, 86, 0.69)',
                    borderColor: 'rgb(241, 228, 34)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.5
                },
                {   
                    label: 'Số bài báo',
                    data: [50, 150, 150, 200, 2500, 300, 350, 40, 450, 50, 550, 600,50, 150, 150, 200, 2500, 300, 350, 40, 450, 50, 550, 600,50, 150, 150, 200, 2500, 300, 350, 40, 450, 50, 550, 600],
                    backgroundColor: 'rgba(241, 61, 100, 0.2)',
                    borderColor: 'rgba(182, 25, 230, 0.9)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.5
                }
            ]
        },
        options: {
            devicePixelRatio: 2,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Biểu đồ thống kê',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 0
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 50, // 🔹 Giảm kích thước ô màu
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#000' // 🔹 Chữ đậm màu hơn
                    },
                    padding: {
                        top: 0,
                        bottom: 10
                    }
                }
            },
            fullSize: true,
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
});

// Tạo file script.js hoặc thêm vào file JavaScript hiện có

// Thêm dropdown menu vào sau button
function setupUserDropdown() {
    const dropdownButton = document.getElementById('dropdownMenuButton');
    
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

