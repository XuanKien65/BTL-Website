document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("expand");
    });
    
    const date = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    const paper = [100,200,300,500,400,100,700,1000,900,1000,1100,200,100,200,300,500,400,100,700,1000,900,1000,1100,200,100,200,300,500,400,100];
    new Chart("chart",
        {
            type: 'line',
            data: {
                labels: date,
                datasets: [
                    {
                        label: 'Lượng truy cập',
                        data: paper,
                        backgroundColor: 'rgba(253, 86, 86, 0.69)',
                        borderColor: 'rgb(241, 228, 34)',
                    },
                    {   
                        label: 'Số bài báo',
                        data: [50, 150, 150, 200, 2500, 300, 350, 40, 450, 50, 550, 600,50, 150, 150, 200, 2500, 300, 350, 40, 450, 50, 550, 600,50, 150, 150, 200, 2500, 300, 350, 40, 450, 50, 550, 600],
                        backgroundColor: 'rgba(241, 61, 100, 0.2)',
                        borderColor: 'rgba(182, 25, 230, 0.9)',
                    }
            ]
            },
            options:{
                title: {
                    display: true,
                    text: 'Biểu đồ thống kê',
                    fontSize: 18,
                },
                responsive: true,
                devicePixelRatio: 2, // Tăng chất lượng hiển thị
                plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16, // Tăng kích thước chữ
                            weight: 'bold'
                        },
                    color: '#000' // Chữ đậm màu hơn
                }
            }
        }
            }
        }
    )
});