document.addEventListener('DOMContentLoaded', function() {
    // Tab switching chỉ còn 2 tab
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        document.querySelectorAll('.settings-tab, .settings-tab-content').forEach(el => {
          el.classList.remove('active');
        });
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });
  
    // General Settings
    const generalForm = document.querySelector('#general form');
    // Load saved values
    if(localStorage.getItem('generalSettings')) {
        const savedSettings = JSON.parse(localStorage.getItem('generalSettings'));
        document.getElementById('site-name').value = savedSettings.siteName;
        document.getElementById('site-description').value = savedSettings.siteDescription;
        document.getElementById('timezone').value = savedSettings.timezone;
        document.getElementById('maintenance-mode').checked = savedSettings.maintenanceMode;
    }
    
    // Save general settings
    generalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = {
        siteName: document.getElementById('site-name').value,
        siteDescription: document.getElementById('site-description').value,
        timezone: document.getElementById('timezone').value,
        maintenanceMode: document.getElementById('maintenance-mode').checked
        };
        localStorage.setItem('generalSettings', JSON.stringify(settings));
        showToast('Cài đặt chung đã được lưu thành công!');
    });
    
    // Appearance Settings
    const appearanceForm = document.querySelector('#appearance form');
    
    // Theme handling
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        themeOptions.forEach(theme => theme.classList.remove('active'));
        option.classList.add('active');
        const theme = option.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
      });
    });
  
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode');
    darkModeToggle.checked = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.addEventListener('change', (e) => {
      document.body.classList.toggle('dark-mode', e.target.checked);
      localStorage.setItem('darkMode', e.target.checked);
    });
  
    // Font size selector   
    const fontSizeSelect = document.getElementById('font-size');
    fontSizeSelect.value = localStorage.getItem('fontSize') || 'medium';
    fontSizeSelect.addEventListener('change', (e) => {
      document.documentElement.style.fontSize = getFontSize(e.target.value);
      localStorage.setItem('fontSize', e.target.value);
    });
  });
  
  function getFontSize(size) {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    return sizes[size] || '16px';
  }