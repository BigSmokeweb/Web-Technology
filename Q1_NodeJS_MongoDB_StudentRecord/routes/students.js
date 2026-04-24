const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// INSERT - Add a new student
router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        const saved = await student.save();
        res.status(201).json({ success: true, message: 'Student inserted successfully', data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// READ - Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json({ success: true, count: students.length, data: students });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// READ - Get student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: student });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// QUERY - Search by course or year
router.get('/search/query', async (req, res) => {
    try {
        const { course, year, name } = req.query;
        let filter = {};
        if (course) filter.course = new RegExp(course, 'i');
        if (year) filter.year = Number(year);
        if (name) filter.name = new RegExp(name, 'i');
        const results = await Student.find(filter);
        res.json({ success: true, count: results.length, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// UPDATE - Update student by ID
router.put('/:id', async (req, res) => {
    try {
        const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, message: 'Student updated successfully', data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE - Delete student by ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
