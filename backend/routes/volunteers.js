const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// POST /api/volunteers
router.post('/', async (req, res) => {
    try {
        const {
            volunteerType, name, email, phone, occupation, address, skills,
            availability, reason, careerPosition, resumeText
        } = req.body;

        const type = volunteerType || 'volunteer';

        if (!name || !email || !phone || !reason) {
            return res.status(400).json({ success: false, message: 'Name, email, phone, and motivation reason are required' });
        }

        if (type === 'volunteer') {
            if (!availability) {
                return res.status(400).json({ success: false, message: 'Availability is required for volunteer registration' });
            }
        } else {
            if (!careerPosition || !resumeText) {
                return res.status(400).json({ success: false, message: 'Target position and resume details are required for career application' });
            }
        }

        const existing = await Volunteer.findOne({ email, volunteerType: type });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: type === 'volunteer'
                    ? 'You have already registered as a volunteer with this email.'
                    : 'You have already submitted a job application with this email.'
            });
        }

        const volunteer = new Volunteer({
            volunteerType: type,
            name,
            email,
            phone,
            occupation: occupation || 'Unspecified',
            address: address || 'Unspecified',
            skills: skills || 'Unspecified',
            availability: type === 'volunteer' ? availability : undefined,
            careerPosition: type === 'career' ? careerPosition : undefined,
            resumeText: type === 'career' ? resumeText : undefined,
            reason
        });

        await volunteer.save();
        res.status(201).json({
            success: true,
            message: type === 'volunteer'
                ? 'Thank you for registering! We will contact you shortly.'
                : 'Job application submitted successfully! Our HR team will contact you shortly.',
            data: volunteer
        });
    } catch (error) {
        console.error('Volunteer error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// GET /api/volunteers (admin)
router.get('/', async (req, res) => {
    try {
        const volunteers = await Volunteer.find().sort({ createdAt: -1 });
        res.json({ success: true, data: volunteers, count: volunteers.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
