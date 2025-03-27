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