const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    rollNo: {
        type: String,
        required: [true, 'Roll number is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    course: {
        type: String,
        required: [true, 'Course is required']
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: 1,
        max: 4
    },
    marks: {
        type: Number,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
