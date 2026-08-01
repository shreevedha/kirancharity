const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    occupation: { type: String, required: true },
    address: { type: String, required: true },
    skills: { type: String, required: true },
    volunteerType: { type: String, default: 'volunteer' },
    careerPosition: { type: String },
    resumeText: { type: String },
    availability: {
        type: String,
        required: function () { return this.volunteerType === 'volunteer'; }
    },
    reason: { type: String, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
