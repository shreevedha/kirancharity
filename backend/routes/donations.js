const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Donation = require('../models/Donation');

// SabPaisa Canara Bank Merchant Credentials (PG 3.0)
const SABPAISA_CLIENT_CODE = process.env.SABPAISA_CLIENT_CODE || 'SQUA102';
const SABPAISA_API_KEY = process.env.SABPAISA_API_KEY || 'sp_itOrld7Rm0SGjkqg_VSEXBtZXqi8T26-pMPfpUCxUQo';
const SABPAISA_SECRET_KEY = process.env.SABPAISA_SECRET_KEY || 'sec_lLao-1-yDLmV81YjExxgR00a8o7FgJ8-HLSJj9Od4hY';
const SABPAISA_BASE_URL = process.env.SABPAISA_BASE_URL || 'https://staging-sb-merchant-api.sabpaisa.in';

// Helper: Generate SabPaisa PG 3.0 Checksum (HMAC SHA-256)
function generateSabpaisaChecksum(merchantId, merchantTxnId, amount, timestamp) {
    const rawString = `${merchantId}|${merchantTxnId}|${amount}|INR|${timestamp}`;
    return crypto.createHmac('sha256', SABPAISA_SECRET_KEY).update(rawString).digest('hex');
}

// POST /api/donations/initiate-sabpaisa — Create payment session on SabPaisa PG 3.0
router.post('/initiate-sabpaisa', async (req, res) => {
    try {
        const { fullName, mobile, email, address, amount, purpose } = req.body;

        if (!fullName || !mobile || !email || !address || !amount) {
            return res.status(400).json({ success: false, message: 'Donor Name, Mobile, Email, Address, and Amount are required.' });
        }

        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount < 1) {
            return res.status(400).json({ success: false, message: 'Donation amount must be at least ₹1.' });
        }

        const timestamp = Math.floor(Date.now() / 1000).toString();
        const clientTxnId = 'KCT-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

        const donation = new Donation({
            donationType: 'cash',
            fullName,
            mobile,
            email,
            address,
            amount: numAmount,
            purpose: purpose || 'General Donation',
            paymentMethod: 'SabPaisa PG',
            transactionId: clientTxnId,
            status: 'pending'
        });

        await donation.save();

        const host = req.headers.origin || req.headers.referer || process.env.CLIENT_URL || 'https://kiran-charitable-trust.vercel.app';
        const cleanHost = host.endsWith('/') ? host.slice(0, -1) : host;
        const callbackUrl = `${cleanHost}/api/donations/sabpaisa-callback`;

        const checksum = generateSabpaisaChecksum(SABPAISA_CLIENT_CODE, clientTxnId, numAmount, timestamp);

        const payload = {
            merchantId: SABPAISA_CLIENT_CODE,
            merchantTxnId: clientTxnId,
            amount: numAmount,
            currency: 'INR',
            returnUrl: callbackUrl,
            customerName: fullName,
            customerEmail: email,
            customerMobile: mobile,
            timestamp,
            checksum
        };

        const response = await fetch(`${SABPAISA_BASE_URL}/api/v2/payments`, {
            method: 'POST',
            headers: {
                'X-Api-Key': SABPAISA_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const sabpaisaData = await response.json();
        console.log('SabPaisa API Response:', sabpaisaData);

        if (sabpaisaData && sabpaisaData.success && sabpaisaData.checkoutUrl && sabpaisaData.clientSecret) {
            const fullCheckoutUrl = `${sabpaisaData.checkoutUrl}?clientSecret=${sabpaisaData.clientSecret}`;
            return res.status(200).json({
                success: true,
                message: 'SabPaisa checkout URL generated successfully.',
                checkoutUrl: fullCheckoutUrl,
                paymentId: sabpaisaData.paymentId,
                clientTxnId
            });
        }

        return res.status(500).json({
            success: false,
            message: sabpaisaData?.error?.message || sabpaisaData?.message || 'Failed to generate SabPaisa payment checkout URL.'
        });
    } catch (error) {
        console.error('SabPaisa Init Error:', error.message || error);
        res.status(500).json({ success: false, message: error.message || 'Payment initiation failed.' });
    }
});

// Callback Handler (POST & GET) — Receives payment outcome from SabPaisa
const handleCallback = async (req, res) => {
    try {
        const data = { ...req.query, ...req.body };
        console.log('SabPaisa Callback Notification:', data);

        const clientTxnId = data.merchantTxnId || data.clientTxnId || data.client_txn_id || data.txnId;
        const statusCode = data.statusCode || data.status_code || data.code;
        const statusMsg = (data.status || data.statusMsg || '').toUpperCase();
        const pgTxnNo = data.paymentId || data.sabpaisaTxnId || data.pgTxnNo || clientTxnId;

        const isSuccess = statusCode === '0000' || statusMsg === 'SUCCESS' || statusMsg === 'SUCCESSFUL' || statusMsg === 'COMPLETED';

        const donation = await Donation.findOne({ transactionId: clientTxnId });
        const clientRedirectUrl = process.env.CLIENT_URL || 'https://kiran-charitable-trust.vercel.app';

        if (donation) {
            donation.status = isSuccess ? 'completed' : 'failed';
            if (pgTxnNo) donation.transactionId = pgTxnNo;
            await donation.save();

            if (isSuccess) {
                return res.redirect(`${clientRedirectUrl}/donate?status=success&txnId=${encodeURIComponent(pgTxnNo)}&receiptNo=${encodeURIComponent(donation.receiptNumber)}&name=${encodeURIComponent(donation.fullName)}&amount=${donation.amount}`);
            } else {
                return res.redirect(`${clientRedirectUrl}/donate?status=failed&reason=${encodeURIComponent(data.statusMsg || 'Transaction cancelled or failed')}`);
            }
        }

        return res.redirect(`${clientRedirectUrl}/donate?status=failed&reason=Donation+record+not+found`);
    } catch (error) {
        console.error('SabPaisa Callback Error:', error);
        const clientRedirectUrl = process.env.CLIENT_URL || 'https://kiran-charitable-trust.vercel.app';
        return res.redirect(`${clientRedirectUrl}/donate?status=failed&reason=Processing+error`);
    }
};

router.post('/sabpaisa-callback', handleCallback);
router.get('/sabpaisa-callback', handleCallback);

// POST /api/donations — Direct donation recording (offline/cash/item)
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
        const numAmount = isCash ? Number(amount) || 0 : undefined;

        if (isCash) {
            if (!amount || !purpose || !paymentMethod) {
                return res.status(400).json({ success: false, message: 'Amount, purpose and payment method are required for cash donation' });
            }
            if (numAmount < 1) {
                return res.status(400).json({ success: false, message: 'Donation amount must be at least ₹1' });
            }
        } else {
            if (!itemCategory || !itemName || !itemQuantity || !deliveryMethod) {
                return res.status(400).json({ success: false, message: 'Item category, description, quantity and delivery method are required for item donation' });
            }
        }

        const donation = new Donation({
            donationType: isCash ? 'cash' : 'item',
            fullName,
            mobile,
            email,
            address,
            amount: isCash ? numAmount : undefined,
            purpose: isCash ? String(purpose) : undefined,
            paymentMethod: isCash ? String(paymentMethod) : undefined,
            itemCategory: !isCash ? String(itemCategory) : undefined,
            itemName: !isCash ? String(itemName) : undefined,
            itemQuantity: !isCash ? String(itemQuantity) : undefined,
            deliveryMethod: !isCash ? String(deliveryMethod) : undefined,
            status: isCash ? 'completed' : 'pending'
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
        console.error('Donation error:', error.message || error);
        res.status(500).json({ success: false, message: error.message || 'Server error. Please try again.' });
    }
});

// GET /api/donations (admin)
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });
        const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
        res.json({ success: true, data: donations, totalAmount, count: donations.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
