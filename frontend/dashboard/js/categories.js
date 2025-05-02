// ==================== QUẢN LÝ DANH MỤC ====================
const CATEGORY_API_URL = 'http://localhost:5501/api/categories';

let categoryListFlattened = [];
let categoryPageIndex = 1;
const categoryPerPage = 10;

// Tải và xử lý danh mục
async function loadAndRenderCategories() {
    try {
        const response = await fetch(CATEGORY_API_URL);
        if (!response.ok) throw new Error('Không thể tải danh mục');

        const data = await response.json();

        categoryListFlattened = flattenAndSortCategoriesByParentGroup(data.data);
        categoryPageIndex = 1;
        renderCategoryTablePage();
    } catch (error) {
        console.error(error);
        showToast(error.message, 'error');
    }
}

// Làm phẳng và sắp xếp theo parent_id tăng dần, tên A-Z
function flattenAndSortCategoriesByParentGroup(categories) {
    const flat = [];

    const processFlat = (list) => {
        list.forEach(cat => {
            const { id, name, slug, parent_id, post_count, description } = cat;
            flat.push({ id, name, slug, parent_id, post_count, description });
            if (cat.children?.length > 0) {
                processFlat(cat.children);
            }
        });
    };

    processFlat(categories);

    flat.sort((a, b) => {
        const parentA = a.parent_id === null ? -1 : a.parent_id;
        const parentB = b.parent_id === null ? -1 : b.parent_id;

        if (parentA !== parentB) return parentA - parentB;
        return a.name.localeCompare(b.name, 'vi');
    });

    return flat;
}

// Hiển thị 1 trang danh mục
function renderCategoryTablePage() {
    const tbody = document.querySelector('#categories table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const start = (categoryPageIndex - 1) * categoryPerPage;
    const end = start + categoryPerPage;
    const pageItems = categoryListFlattened.slice(start, end);

    pageItems.forEach((cat, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + idx + 1}</td>
            <td>${cat.name}</td>
            <td>${cat.slug}</td>
            <td>${cat.post_count || 0}</td>
            <td>${cat.parent_id || 'Không có'}</td>
            <td>
                <button class="btn btn-edit" data-id="${cat.id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" data-id="${cat.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    renderCategoryPagination();
    attachCategoryActionEvents();
}

// Tạo nút phân trang
function renderCategoryPagination() {
    const container = document.getElementById('paginationControls');
    if (!container) return;

    container.innerHTML = '';
    const totalPages = Math.ceil(categoryListFlattened.length / categoryPerPage);

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = categoryPageIndex === 1;
    prevBtn.addEventListener('click', () => {
        categoryPageIndex--;
        renderCategoryTablePage();
    });
    container.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-page';
        btn.textContent = i;
        if (i === categoryPageIndex) btn.classList.add('active');
        btn.addEventListener('click', () => {
            categoryPageIndex = i;
            renderCategoryTablePage();
        });
        container.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = categoryPageIndex === totalPages;
    nextBtn.addEventListener('click', () => {
        categoryPageIndex++;
        renderCategoryTablePage();
    });
    container.appendChild(nextBtn);
}

// Sự kiện xóa / sửa
let hasAttachedCategoryEvents = false;

function attachCategoryActionEvents() {
    const tbody = document.querySelector('#categories table tbody');
    if (!tbody || hasAttachedCategoryEvents) return;

    console.log('[DEBUG] Gắn sự kiện tbody');

    tbody.addEventListener('click', async function (event) {
        console.log('[DEBUG] Click trong tbody:', event.target);

        const btn = event.target.closest('button');
        if (!btn) {
            console.log('[DEBUG] Không phải nút button');
            return;
        }

        const id = btn.dataset.id;
        if (!id) {
            console.log('[DEBUG] Không có data-id trên button');
            return;
        }

        console.log(`[DEBUG] Button click - Class: ${btn.className}, ID: ${id}`);

        if (btn.classList.contains('btn-delete')) {
            console.log('[DEBUG] Xử lý nút xóa');

            try {
                const res = await fetch(`${CATEGORY_API_URL}/${id}`);
                const cat = await res.json();

                showConfirmModal(`Xóa danh mục "${cat.data.name}"?`, async () => {
                    try {
                        const token = await getAccessTokenFromRefresh();
                        const delRes = await fetch(`${CATEGORY_API_URL}/${id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (!delRes.ok) throw new Error('Lỗi xóa danh mục');
                        showToast('Xóa thành công', 'success');
                        await loadAndRenderCategories();
                    } catch (e) {
                        console.error('[ERROR] Trong modal xóa:', e);
                        showToast(e.message, 'error');
                    }
                });
            } catch (e) {
                console.error('[ERROR] Không lấy được dữ liệu danh mục để xóa:', e);
                showToast('Lỗi lấy thông tin danh mục', 'error');
            }
        }

        if (btn.classList.contains('btn-edit')) {
            console.log('[DEBUG] Xử lý nút sửa');

            try {
                const res = await fetch(`${CATEGORY_API_URL}/${id}`);
                const cat = await res.json();
                openCategoryEditModal(cat.data);
            } catch (e) {
                console.error('[ERROR] Không lấy được dữ liệu danh mục để sửa:', e);
                showToast('Lỗi lấy thông tin danh mục', 'error');
            }
        }
    });

    hasAttachedCategoryEvents = true;
}



// Mở modal chỉnh sửa / thêm mới
async function openCategoryEditModal(category = null) {
    const modal = document.getElementById('addCategoryModal');
    const form = document.getElementById('categoryForm');
    const title = modal.querySelector('.modal-header h3');

    form.reset();
    delete form.dataset.editId;

    if (category) {
        title.textContent = 'Chỉnh sửa danh mục';
        form.querySelector('#categoryName').value = category.name;
        form.querySelector('#categorySlug').value = category.slug;
        form.querySelector('#categoryParent').value = category.parent_id || '';
        form.querySelector('#categoryDescription').value = category.description || '';
        form.dataset.editId = category.id;
    } else {
        title.textContent = 'Thêm danh mục mới';
    }

    await updateCategoryParentDropdown(category?.id);
    openModal('addCategoryModal');
}

// Cập nhật dropdown danh mục cha
async function updateCategoryParentDropdown(excludeId = null) {
    const select = document.getElementById('categoryParent');
    const currentValue = select.value;

    try {
        const res = await fetch(`${CATEGORY_API_URL}?parent_id=null`);
        const data = await res.json();

        select.innerHTML = '<option value="">-- Không có --</option>';
        data.data.forEach(cat => {
            if (excludeId && cat.id == excludeId) return;
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });

        select.value = currentValue;
    } catch (e) {
        console.error(e);
        showToast('Lỗi tải danh mục cha', 'error');
    }
}

// Gửi form thêm / sửa
async function submitCategoryFormHandler() {
    const form = document.getElementById('categoryForm');
    const name = form.querySelector('#categoryName').value.trim();
    const slug = form.querySelector('#categorySlug').value.trim();
    const parentId = form.querySelector('#categoryParent').value || null;
    const description = form.querySelector('#categoryDescription').value.trim();

    if (!name || !slug) {
        showToast('Vui lòng nhập tên và slug', 'error');
        return;
    }

    try {
        const token = await getAccessTokenFromRefresh();

        const isEdit = form.dataset.editId;
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `${CATEGORY_API_URL}/${form.dataset.editId}` : CATEGORY_API_URL;

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name, slug, parent_id: parentId, description
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Lỗi xử lý danh mục');
        }

        showToast(isEdit ? 'Cập nhật thành công' : 'Thêm thành công', 'success');
        closeModal();
        await loadAndRenderCategories();
    } catch (e) {
        console.error(e);
        showToast(e.message, 'error');
    }
}


// Khởi động
document.addEventListener('DOMContentLoaded', () => {
    // Nút "Thêm danh mục"
    document.getElementById('addCategoryBtn')?.addEventListener('click', () => openCategoryEditModal());

    // Nút "Lưu danh mục"
    document.getElementById('submitCategory')?.addEventListener('click', submitCategoryFormHandler);

    // ✅ Gắn sự kiện nút "Xác nhận" trong modal xác nhận (chỉ 1 lần duy nhất)
    const confirmBtn = document.querySelector('#confirmModal .btn-confirm');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmAction);
    }

    // Tải dữ liệu ban đầu
    loadAndRenderCategories();
});
