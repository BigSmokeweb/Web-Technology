const API = 'api/products.php';
let editingId = null;

async function loadProducts(search = '') {
    const url = search ? `${API}?search=${encodeURIComponent(search)}` : API;
    const res = await fetch(url);
    const json = await res.json();
    renderTable(json.data || []);
    updateStats(json.data || []);
}

function renderTable(products) {
    const tbody = document.getElementById('tableBody');
    if (!products.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty">No products found.</td></tr>`;
        return;
    }
    tbody.innerHTML = products.map(p => {
        const qty = parseInt(p.quantity);
        const status = qty === 0 ? 'out' : qty <= 10 ? 'low' : 'ok';
        const statusText = qty === 0 ? '● Out of Stock' : qty <= 10 ? '● Low Stock' : '● In Stock';
        return `<tr>
            <td><span class="pid">${p.product_id}</span></td>
            <td><strong>${p.name}</strong></td>
            <td class="price-val">₹${parseFloat(p.price).toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
            <td>${p.quantity} units</td>
            <td><span class="status ${status}">${statusText}</span></td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editProduct(${p.id},'${p.name}',${p.price},${p.quantity})">Edit</button>
                <button class="btn btn-sm btn-del" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        </tr>`;
    }).join('');
}

function updateStats(products) {
    document.getElementById('statTotal').textContent = products.length;
    const stock = products.reduce((s, p) => s + parseInt(p.quantity), 0);
    document.getElementById('statStock').textContent = stock.toLocaleString();
    const val = products.reduce((s, p) => s + (parseFloat(p.price) * parseInt(p.quantity)), 0);
    document.getElementById('statVal').textContent = '₹' + val.toLocaleString('en-IN', {maximumFractionDigits:0});
}

function filterProducts() {
    loadProducts(document.getElementById('searchInput').value);
}

function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('modalSubmit').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('modalMsg').classList.add('hidden');
    document.getElementById('modal').classList.remove('hidden');
}

function editProduct(id, name, price, qty) {
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Update Product';
    document.getElementById('modalSubmit').textContent = 'Update';
    document.getElementById('editId').value = id;
    document.getElementById('pName').value = name;
    document.getElementById('pPrice').value = price;
    document.getElementById('pQty').value = qty;
    document.getElementById('modalMsg').classList.add('hidden');
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    editingId = null;
}

async function submitProduct(e) {
    e.preventDefault();
    const payload = {
        id: editingId,
        name: document.getElementById('pName').value,
        price: parseFloat(document.getElementById('pPrice').value),
        quantity: parseInt(document.getElementById('pQty').value)
    };
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(API, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const json = await res.json();
    const msg = document.getElementById('modalMsg');
    msg.textContent = json.message;
    msg.className = `msg ${json.success ? 'success' : 'error'}`;
    if (json.success) { setTimeout(() => { closeModal(); loadProducts(); }, 1000); }
}

async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`${API}?id=${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) loadProducts();
}

window.onload = loadProducts;
