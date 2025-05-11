document.addEventListener('DOMContentLoaded', async function () {
  // ===== 1. Chuyển Tab =====
  const tabs = document.querySelectorAll('.settings-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      document.querySelectorAll('.settings-tab, .settings-tab-content').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      const contentEl = document.getElementById(targetTab);
      if (contentEl) contentEl.classList.add('active');
      else console.error('❌ Không tìm thấy nội dung tab:', targetTab);
    });
  });

  // ===== 2. Xử lý Preview Ảnh =====
  function handleImageUpload(input, previewId) {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" alt="Preview" class="preview-image">`;
      };
      reader.readAsDataURL(file);
    }
  }

  document.getElementById('homepageLogoUpload').addEventListener('change', e => {
    handleImageUpload(e.target, 'homepageLogoPreview');
  });

  document.getElementById('homepageBannerUpload').addEventListener('change', e => {
    handleImageUpload(e.target, 'homepageBannerPreview');
  });

  // ===== 3. Load dữ liệu localStorage (font size, dark mode, general) =====
  document.getElementById('dark-mode').checked = localStorage.getItem('darkMode') === 'true';
  document.getElementById('dark-mode').addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
    localStorage.setItem('darkMode', e.target.checked);
  });

  const fontSizeSelect = document.getElementById('fontSizeSelect');
  const savedFontSize = localStorage.getItem('fontSize') || 'medium';
  fontSizeSelect.value = savedFontSize;
  document.documentElement.style.fontSize = getFontSize(savedFontSize);
  fontSizeSelect.addEventListener('change', (e) => {
    document.documentElement.style.fontSize = getFontSize(e.target.value);
    localStorage.setItem('fontSize', e.target.value);
  });

  function getFontSize(size) {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    return sizes[size] || '16px';
  }

  if (localStorage.getItem('generalSettings')) {
    const saved = JSON.parse(localStorage.getItem('generalSettings'));
    document.getElementById('homepageSlogan').value = saved.slogan || '';
    document.getElementById('footerAddress').value = saved.address || '';
    document.getElementById('footerEmail').value = saved.email || '';
    document.getElementById('footerPhone').value = saved.phone || '';
  }

  // ===== 4. Submit Cài Đặt Chung =====
  document.querySelector('#general form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const slogan = document.getElementById('homepageSlogan').value;
    const address = document.getElementById('footerAddress').value;
    const email = document.getElementById('footerEmail').value;
    const phone = document.getElementById('footerPhone').value;
    const logoFile = document.getElementById('homepageLogoUpload').files[0];
    const bannerFile = document.getElementById('homepageBannerUpload').files[0];

    // Lưu local
    const localSettings = { slogan, address, email, phone };
    localStorage.setItem('generalSettings', JSON.stringify(localSettings));

    // Gửi API
    const formData = new FormData();
    if (slogan) formData.append('slogan', slogan);
    if (address) formData.append('address', address);
    if (email) formData.append('email', email);
    if (phone) formData.append('phone', phone);
    if (logoFile) formData.append('logo', logoFile);
    if (bannerFile) formData.append('banner', bannerFile);

    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await getAccessTokenFromRefresh()}`
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Cập nhật thất bại');
      showToast('✅ Cập nhật thành công!', 'success');
      setTimeout(() => location.reload(), 1500);
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      showToast(error.message, 'error');
    }
  });

  // ===== 5. Submit Giao Diện =====
  document.querySelector('#appearance form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Cài đặt giao diện đã được lưu!', 'success');
  });

  console.log('Settings JS đã sẵn sàng');
});
