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
  


  
