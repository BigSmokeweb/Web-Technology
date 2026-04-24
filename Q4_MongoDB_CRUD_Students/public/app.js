const API = '/api/students';
let allStudents = [];

async function loadStudents() {
    const res = await fetch(API);
    const json = await res.json();
    allStudents = json.data || [];
    renderTable(allStudents);
    updateStats(allStudents);
}

function renderTable(students) {
    const tbody = document.getElementById('tableBody');
    if (!students.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty">No student records found.</td></tr>`;
        return;
    }
    tbody.innerHTML = students.map(s => `
        <tr>
            <td><strong>${s.name}</strong></td>
            <td>${s.rollNo}</td>
            <td>${s.department}</td>
            <td>Sem ${s.semester}</td>
            <td>${s.phone || '—'}</td>
            <td>
                <button class="btn-act btn-ed" onclick="editStudent('${s._id}')">Edit</button>
                <button class="btn-act btn-dl" onclick="deleteStudent('${s._id}')">Delete</button>
            </td>
        </tr>`).join('');
}

function filterTable() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allStudents.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );
    renderTable(filtered);
}

function updateStats(students) {
    document.getElementById('statTotal').textContent = students.length;
    const depts = new Set(students.map(s => s.department));
    document.getElementById('statDepts').textContent = depts.size;
}

async function handleSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const payload = {
        name:       document.getElementById('name').value,
        rollNo:     document.getElementById('rollNo').value,
        department: document.getElementById('department').value,
        semester:   parseInt(document.getElementById('semester').value),
        phone:      document.getElementById('phone').value,
        address:    document.getElementById('address').value
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API}/${id}` : API;
    try {
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const json = await res.json();
        showMsg(json.message, json.success ? 'success' : 'error');
        if (json.success) { resetForm(); loadStudents(); }
    } catch (err) {
        showMsg('Network error. Is the server running?', 'error');
    }
}

async function editStudent(id) {
    const res = await fetch(`${API}/${id}`);
    const json = await res.json();
    const s = json.data;
    document.getElementById('editId').value = s._id;
    document.getElementById('name').value = s.name;
    document.getElementById('rollNo').value = s.rollNo;
    document.getElementById('department').value = s.department;
    document.getElementById('semester').value = s.semester;
    document.getElementById('phone').value = s.phone || '';
    document.getElementById('address').value = s.address || '';
    document.getElementById('formTitle').textContent = '✏️ Edit Student';
    document.getElementById('submitBtn').textContent = 'Update Student';
}

async function deleteStudent(id) {
    if (!confirm('Delete this student record permanently?')) return;
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    showMsg(json.message, json.success ? 'success' : 'error');
    if (json.success) loadStudents();
}

function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('formTitle').textContent = '➕ New Student';
    document.getElementById('submitBtn').textContent = 'Add Student';
    document.getElementById('msg').classList.add('hidden');
}

function showMsg(text, type) {
    const el = document.getElementById('msg');
    el.textContent = text;
    el.className = `msg ${type}`;
    setTimeout(() => el.classList.add('hidden'), 4000);
}

window.onload = loadStudents;
