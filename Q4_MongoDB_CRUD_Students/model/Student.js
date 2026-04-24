const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:       { type: String, required: true, trim: true },
    rollNo:     { type: String, required: true, unique: true },
    department: { type: String, required: true },
    semester:   { type: Number, required: true, min: 1, max: 8 },
    phone:      { type: String, trim: true },
    address:    { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
