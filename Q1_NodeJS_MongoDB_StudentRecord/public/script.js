const API = '/api/students';

async function loadStudents() {
    const res = await fetch(API);
    const json = await res.json();
    renderTable(json.data);
    document.getElementById('totalCount').textContent = json.count;
}

async function searchStudents() {
    const name = document.getElementById('searchName').value;
    const course = document.getElementById('searchCourse').value;
    const year = document.getElementById('searchYear').value;
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (course) params.append('course', course);
    if (year) params.append('year', year);
    const res = await fetch(`${API}/search/query?${params}`);
    const json = await res.json();
    renderTable(json.data);
}

function renderTable(students) {
    const tbody = document.getElementById('studentBody');
    if (!students || students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">No students found.</td></tr>`;
        return;
    }
    tbody.innerHTML = students.map(s => {
        const marks = s.marks ?? 'N/A';
        let badgeClass = 'marks-mid';
        if (s.marks >= 75) badgeClass = 'marks-high';
        else if (s.marks < 50) badgeClass = 'marks-low';
        const marksHtml = s.marks !== undefined
            ? `<span class="marks-badge ${badgeClass}">${s.marks}%</span>`
            : `<span style="color:#475569">N/A</span>`;
        return `<tr>
            <td><strong>${s.name}</strong></td>
            <td>${s.rollNo}</td>
            <td>${s.course}</td>
            <td>Year ${s.year}</td>
            <td>${marksHtml}</td>
            <td style="display:flex;gap:6px;">
                <button class="btn btn-edit" onclick="editStudent('${s._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent('${s._id}')">Delete</button>
            </td>
        </tr>`;
    }).join('');
}

async function submitForm(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const payload = {
        name: document.getElementById('name').value,
        rollNo: document.getElementById('rollNo').value,
        email: document.getElementById('email').value,
        course: document.getElementById('course').value,
        year: parseInt(document.getElementById('year').value),
        marks: document.getElementById('marks').value ? parseFloat(document.getElementById('marks').value) : undefined
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
    document.getElementById('email').value = s.email;
    document.getElementById('course').value = s.course;
    document.getElementById('year').value = s.year;
    document.getElementById('marks').value = s.marks ?? '';
    document.getElementById('formTitle').textContent = '✏️ Update Student';
    document.getElementById('submitBtn').textContent = 'Update Record';
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    showMsg(json.message, json.success ? 'success' : 'error');
    if (json.success) loadStudents();
}

function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('formTitle').textContent = '➕ Add New Student';
    document.getElementById('submitBtn').textContent = 'Insert Record';
    const msg = document.getElementById('formMsg');
    msg.classList.add('hidden');
}

function showMsg(text, type) {
    const msg = document.getElementById('formMsg');
    msg.textContent = text;
    msg.className = `message ${type}`;
    setTimeout(() => msg.classList.add('hidden'), 4000);
}

window.onload = loadStudents;
