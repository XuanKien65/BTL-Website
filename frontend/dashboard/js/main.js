// Khởi tạo khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", function () {
  // Thêm style toast vào head
  document.head.appendChild(toastStyles);

  // Khởi tạo layout
  initSidebar();
  initTabs();
  initModals();

  // Khởi tạo biểu đồ
  initCharts();

  // Khởi tạo các module chức năng
  initUserManagement();
  loadAndRenderCategories();
  // Thêm sự kiện cho các nút chung
  document
    .getElementById("confirmAction")
    ?.addEventListener("click", confirmAction);
  document.getElementById("modal-close")?.addEventListener("click", closeModal);
});
