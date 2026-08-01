const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// POST /api/donations
router.post('/', async (req, res) => {
    try {
        const {
            donationType, fullName, mobile, email, address,
            amount, purpose, paymentMethod,
            itemCategory, itemName, itemQuantity, deliveryMethod
        } = req.body;

        if (!fullName || !mobile || !email || !address) {
            return res.status(400).json({ success: false, message: 'Contact details (Name, Mobile, Email, Address) are required' });
        }

        const isCash = donationType !== 'item';

        if (isCash) {
            if (!amount || !purpose || !paymentMethod) {
                return res.status(400).json({ success: false, message: 'Amount, purpose and payment method are required for cash donation' });
            }
            if (amount < 1) {
                return res.status(400).json({ success: false, message: 'Donation amount must be at least ₹1' });
            }
        } else {
            if (!itemCategory || !itemName || !itemQuantity || !deliveryMethod) {
                return res.status(400).json({ success: false, message: 'Item category, description, quantity and delivery method are required for item donation' });
            }
        }

        const donation = new Donation({
            donationType: donationType || 'cash',
            fullName,
            mobile,
            email,
            address,
            amount: isCash ? parseFloat(amount) : undefined,
            purpose: isCash ? purpose : undefined,
            paymentMethod: isCash ? paymentMethod : undefined,
            itemCategory: !isCash ? itemCategory : undefined,
            itemName: !isCash ? itemName : undefined,
            itemQuantity: !isCash ? itemQuantity : undefined,
            deliveryMethod: !isCash ? deliveryMethod : undefined,
            status: isCash ? 'completed' : 'pending',
            transactionId: isCash ? 'TXN-' + Date.now() : undefined
        });

        await donation.save();

        res.status(201).json({
            success: true,
            message: isCash
                ? 'Donation recorded successfully! Thank you for your generous contribution.'
                : 'Item donation request received successfully! Our logistics team will contact you shortly.',
            data: donation
        });
    } catch (error) {
        console.error('Donation error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// GET /api/donations (admin)
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });
        const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
        res.json({ success: true, data: donations, totalAmount, count: donations.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
