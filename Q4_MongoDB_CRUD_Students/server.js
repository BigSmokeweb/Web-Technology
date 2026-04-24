require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Student = require('./model/Student');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected — collegeDB'))
    .catch(err => console.error('❌ Error:', err));

// CREATE
app.post('/api/students', async (req, res) => {
    try {
        const s = await Student.create(req.body);
        res.status(201).json({ success: true, message: 'Student record added', data: s });
    } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

// READ ALL
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json({ success: true, count: students.length, data: students });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// READ ONE
app.get('/api/students/:id', async (req, res) => {
    try {
        const s = await Student.findById(req.params.id);
        if (!s) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: s });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// UPDATE
app.put('/api/students/:id', async (req, res) => {
    try {
        const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!s) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Student updated', data: s });
    } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

// DELETE
app.delete('/api/students/:id', async (req, res) => {
    try {
        const s = await Student.findByIdAndDelete(req.params.id);
        if (!s) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Student deleted' });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(process.env.PORT, () => console.log(`🚀 Server: http://localhost:${process.env.PORT}`));
