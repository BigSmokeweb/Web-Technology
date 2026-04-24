const API = 'api/products.php';
let editingId = null;

async function loadProducts() {
    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const res = await fetch(`${API}?${params}`);
    const json = await res.json();
    renderProducts(json.data || []);
    updateStats(json.data || []);
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    if (!products.length) {
        grid.innerHTML = `<div class="empty-state"><span>📭</span><p>No products found. Add one!</p></div>`;
        return;
    }
    grid.innerHTML = products.map(p => {
        const qtyClass = p.quantity > 20 ? 'qty-ok' : p.quantity > 0 ? 'qty-low' : 'qty-zero';
        const qtyLabel = p.quantity > 0 ? `${p.quantity} in stock` : 'Out of stock';
        return `<div class="product-card">
            <div class="pc-header">
                <span class="pc-name">${p.name}</span>
                <span class="pc-cat">${p.category}</span>
            </div>
            <div class="pc-price">₹${parseFloat(p.price).toLocaleString('en-IN', {minimumFractionDigits:2})}</div>
            <p class="pc-desc">${p.description || 'No description provided.'}</p>
            <div class="pc-footer">
                <span class="pc-qty ${qtyClass}">● ${qtyLabel}</span>
                <div class="pc-actions">
                    <button class="btn btn-sm btn-edit" onclick="editProduct(${p.id})">Edit</button>
                    <button class="btn btn-sm btn-del" onclick="deleteProduct(${p.id})">Delete</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function updateStats(products) {
    document.getElementById('statTotal').textContent = products.length;
    const cats = new Set(products.map(p => p.category));
    document.getElementById('statCategories').textContent = cats.size;
    const stock = products.reduce((sum, p) => sum + parseInt(p.quantity), 0);
    document.getElementById('statStock').textContent = stock;
}

function openModal(id = null) {
    editingId = id;
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('formMsg').classList.add('hidden');
    if (!id) {
        document.getElementById('modalTitle').textContent = 'Add Product';
        document.getElementById('submitBtn').textContent = 'Add Product';
        document.getElementById('productForm').reset();
    }
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    editingId = null;
}

async function editProduct(id) {
    const res = await fetch(`${API}?id=${id}`);
    const json = await res.json();
    const p = json.data.find(x => x.id == id) || (await fetch(API).then(r=>r.json())).data.find(x=>x.id==id);
    document.getElementById('pName').value = p.name;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pQty').value = p.quantity;
    document.getElementById('pDesc').value = p.description || '';
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('submitBtn').textContent = 'Update Product';
    openModal(id);
}

async function submitProduct(e) {
    e.preventDefault();
    const payload = {
        id: editingId,
        name: document.getElementById('pName').value,
        category: document.getElementById('pCategory').value,
        price: parseFloat(document.getElementById('pPrice').value),
        quantity: parseInt(document.getElementById('pQty').value),
        description: document.getElementById('pDesc').value
    };
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(API, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await res.json();
    showMsg(json.message, json.success ? 'success' : 'error');
    if (json.success) { setTimeout(() => { closeModal(); loadProducts(); }, 1200); }
}

async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`${API}?id=${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) loadProducts();
}

function showMsg(text, type) {
    const el = document.getElementById('formMsg');
    el.textContent = text;
    el.className = `message ${type}`;
}

window.onload = loadProducts;
