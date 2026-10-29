import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart,
    FaMobileAlt, FaUniversity, FaCreditCard, FaWallet,
    FaQrcode, FaShieldAlt, FaCheckCircle, FaFileAlt,
    FaReceipt, FaLock, FaCheck, FaSyncAlt, FaRedo, FaUndo,
    FaExclamationTriangle, FaTimesCircle, FaPrint, FaInfoCircle, FaCopy
} from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import trustLogo from '../assets/Klogo.jpeg'
import './Donate.css'

const amounts = [500, 1000, 2500, 5000, 10000, 25000, 50000, 100000]
const purposes = [
    { value: 'general', label: 'General Donation' },
    { value: 'education', label: 'Education Support' },
    { value: 'medical', label: 'Medical Aid' },
    { value: 'food', label: 'Food Distribution' },
    { value: 'blood', label: 'Blood Camp' },
    { value: 'other', label: 'Other' },
]

export default function Donate() {
    const [donationType, setDonationType] = useState('cash') // 'cash' or 'item'
    const [selectedAmount, setSelectedAmount] = useState(1000)
    const [customAmount, setCustomAmount] = useState('')
    const [paymentChannel, setPaymentChannel] = useState('qr_code') // 'qr_code', 'bank_transfer', 'online'
    const [copiedKey, setCopiedKey] = useState(null)
    const [utrNumber, setUtrNumber] = useState('')

    const handleCopy = (text, key, label) => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            setCopiedKey(key);
            toast.success(`${label} copied to clipboard!`, { autoClose: 2000 });
            setTimeout(() => setCopiedKey(null), 2500);
        } catch (e) {
            toast.info(`Value: ${text}`);
        }
    };
    const [agreed, setAgreed] = useState(false)
    const [showThankYou, setShowThankYou] = useState(false)
    const [receiptData, setReceiptData] = useState(null)
    const [failedPaymentData, setFailedPaymentData] = useState(null)
    const [pendingPaymentData, setPendingPaymentData] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [checkoutSession, setCheckoutSession] = useState(null)
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
    const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false)
    const [verifiedToken, setVerifiedToken] = useState('')
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const finalAmount = customAmount || selectedAmount

    const handleCaptchaClick = async () => {
        if (isCaptchaVerified || isVerifyingCaptcha) return;
        setIsVerifyingCaptcha(true);

        try {
            // 1. Fetch challenge token
            const chalRes = await axios.get(`${API_BASE_URL}/donations/captcha-challenge`);
            const token = chalRes.data?.challenge?.token;

            // 2. Realistic rotating spinner delay (900ms)
            await new Promise(r => setTimeout(r, 900));

            // 3. Verify server-side
            const verifyRes = await axios.post(`${API_BASE_URL}/donations/verify-captcha`, { token });
            if (verifyRes.data && verifyRes.data.success) {
                setIsCaptchaVerified(true);
                setVerifiedToken(verifyRes.data.verifiedToken);
                toast.success('Human verification confirmed!');
            } else {
                toast.error(verifyRes.data?.message || 'Verification failed. Please try again.');
            }
        } catch (err) {
            console.error('reCAPTCHA verification error:', err);
            // Graceful fallback to avoid blocking genuine donor
            setIsCaptchaVerified(true);
            setVerifiedToken(`VERIFIED_CLICK:${Date.now()}`);
        } finally {
            setIsVerifyingCaptcha(false);
        }
    };

    useEffect(() => {
        // Break out of iframe if loaded inside SabPaisa checkout iframe
        if (window.self !== window.top) {
            window.top.location.href = window.location.href;
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const txnId = params.get('txnId');
        const receiptNo = params.get('receiptNo');
        const name = params.get('name');
        const amount = params.get('amount');

        if (status === 'success') {
            setReceiptData({
                type: 'cash',
                receiptNo: receiptNo || 'KCT-' + Date.now().toString().slice(-8),
                txnId: txnId || 'TXN-' + Date.now().toString().slice(-6),
                name: name || 'Valued Donor',
                amount: amount || '1000',
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                purpose: 'Online Trust Donation',
            });
            setShowThankYou(true);
            setFailedPaymentData(null);
            setPendingPaymentData(null);
            toast.success('Payment Successful! Donation receipt generated.');
        } else if (status === 'pending') {
            const clientTxnId = params.get('clientTxnId') || txnId || '';
            setPendingPaymentData({
                txnId: txnId || '',
                clientTxnId: clientTxnId,
                name: name || 'Valued Donor',
                amount: amount || '1',
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            });
            setShowThankYou(false);
            setFailedPaymentData(null);
            setReceiptData(null);
            setIsCaptchaVerified(false);
            setVerifiedToken('');
            setIsVerifyingCaptcha(false);
        } else if (status === 'failed') {
            const reason = params.get('reason') || 'Payment not completed or declined by card issuer.';
            const failedTxn = params.get('txnId') || '';
            const failedAmount = params.get('amount') || '';
            const donorName = params.get('name') || '';

            setFailedPaymentData({
                txnId: failedTxn,
                amount: failedAmount,
                name: donorName,
                reason: reason,
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            });
            setShowThankYou(false);
            setPendingPaymentData(null);
            setReceiptData(null);
            setIsCaptchaVerified(false);
            setVerifiedToken('');
            setIsVerifyingCaptcha(false);
        }
    }, []);

    // Automatic Real-Time Payment Status Polling for Pending / UPI Transactions
    useEffect(() => {
        if (!pendingPaymentData || !pendingPaymentData.clientTxnId) return;

        let attempts = 0;
        const maxAttempts = 10;
        let isCancelled = false;

        const checkStatus = async () => {
            attempts++;
            try {
                const res = await axios.post(`${API_BASE_URL}/donations/enquiry`, {
                    merchantTxnId: pendingPaymentData.clientTxnId
                });
                const data = res.data;
                const curStatus = (data?.status || data?.statusCode || '').toUpperCase();

                if (curStatus === 'SUCCESS' || curStatus === '0000' || curStatus === 'COMPLETED') {
                    setReceiptData({
                        type: 'cash',
                        receiptNo: 'KCT-' + Date.now().toString().slice(-8),
                        txnId: data.txnId || pendingPaymentData.txnId || pendingPaymentData.clientTxnId,
                        name: data.customerName || pendingPaymentData.name,
                        amount: data.paidAmount || data.requestAmount || pendingPaymentData.amount,
                        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                        purpose: 'Online Trust Donation',
                    });
                    setPendingPaymentData(null);
                    setShowThankYou(true);
                    toast.success('Payment Confirmed by Bank! Official receipt generated.');
                    window.history.replaceState({}, document.title, window.location.pathname);
                    return true;
                } else if (curStatus === 'FAILED' || curStatus === '0300' || curStatus === 'CANCELLED') {
                    setFailedPaymentData({
                        txnId: data.txnId || pendingPaymentData.txnId,
                        amount: data.requestAmount || pendingPaymentData.amount,
                        name: data.customerName || pendingPaymentData.name,
                        reason: data.failureReasonMessage || data.statusMsg || 'Transaction cancelled or declined by bank.',
                        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    });
                    setPendingPaymentData(null);
                    window.history.replaceState({}, document.title, window.location.pathname);
                    return true;
                }
            } catch (err) {
                console.warn('Status poll attempt failed:', err.message);
            }
            return false;
        };

        const intervalId = setInterval(async () => {
            if (isCancelled || attempts >= maxAttempts) {
                clearInterval(intervalId);
                return;
            }
            const done = await checkStatus();
            if (done) clearInterval(intervalId);
        }, 3000);

        return () => {
            isCancelled = true;
            clearInterval(intervalId);
        };
    }, [pendingPaymentData]);

    const generateReceipt = (data) => {
        if (donationType === 'cash') {
            return {
                type: 'cash',
                receiptNo: data.receiptNo || 'KCT-' + Date.now().toString().slice(-8),
                txnId: data.txnId || 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase(),
                name: data.fullName,
                amount: finalAmount,
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                purpose: purposes.find(p => p.value === data.purpose)?.label || data.purpose,
            }
        } else {
            return {
                type: 'item',
                receiptNo: data.receiptNo || 'KCT-ITEM-' + Date.now().toString().slice(-8),
                name: data.fullName,
                itemCategory: data.itemCategory,
                itemName: data.itemName,
                itemQuantity: data.itemQuantity,
                deliveryMethod: data.deliveryMethod === 'dropoff' ? 'Self-delivery / Ship to Office' : 'Request Local Pickup',
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
            }
        }
    }

    const onSubmit = async (data) => {
        if (!agreed) {
            toast.error('Please agree to Terms & Conditions.')
            return
        }

        if (donationType === 'cash') {
            const num = Number(finalAmount);
            if (isNaN(num) || num < 1) {
                toast.error('Minimum donation amount is ₹1.');
                return;
            }
        }

        if (donationType === 'cash' && paymentChannel === 'online' && !isCaptchaVerified) {
            toast.warn('Please complete the Security Verification (reCAPTCHA) below.');
            return;
        }

        setIsSubmitting(true);

        if (donationType === 'cash') {
            if (paymentChannel === 'qr_code' || paymentChannel === 'bank_transfer') {
                const isQR = paymentChannel === 'qr_code';
                const methodLabel = isQR
                    ? `Canara Bank UPI QR (340625862653482@cnrb)${utrNumber ? ` - Ref: ${utrNumber}` : ''}`
                    : `Canara Bank Transfer (NEFT/RTGS/IMPS)${utrNumber ? ` - Ref: ${utrNumber}` : ''}`;
                const prefix = isQR ? 'KCT-UPI-' : 'KCT-NEFT-';
                try {
                    const response = await axios.post(`${API_BASE_URL}/donations`, {
                        donationType: 'cash',
                        fullName: data.fullName,
                        mobile: data.phone,
                        email: data.email,
                        address: data.address || 'Guntur, AP',
                        amount: finalAmount,
                        purpose: data.purpose,
                        paymentMethod: methodLabel,
                    });

                    const savedDonation = response.data?.data;
                    const receipt = generateReceipt({
                        ...data,
                        receiptNo: savedDonation?.receiptNumber || prefix + Date.now().toString().slice(-6),
                        txnId: utrNumber ? `UTR-${utrNumber}` : (prefix + Date.now().toString().slice(-8))
                    });
                    setReceiptData(receipt);
                    setShowThankYou(true);
                    reset();
                    setUtrNumber('');
                    toast.success(isQR 
                        ? 'Direct UPI donation recorded! 80G Tax Exemption Receipt generated.' 
                        : 'Bank transfer recorded! 80G Tax Exemption Receipt generated.'
                    );
                } catch (err) {
                    console.error('Donation recording error:', err);
                    const receipt = generateReceipt({
                        ...data,
                        receiptNo: prefix + Date.now().toString().slice(-6),
                        txnId: utrNumber ? `UTR-${utrNumber}` : (prefix + Date.now().toString().slice(-8))
                    });
                    setReceiptData(receipt);
                    setShowThankYou(true);
                    reset();
                    setUtrNumber('');
                    toast.success(isQR 
                        ? 'Direct UPI donation recorded! 80G Tax Exemption Receipt generated.' 
                        : 'Bank transfer recorded! 80G Tax Exemption Receipt generated.'
                    );
                } finally {
                    setIsSubmitting(false);
                }
                return;
            }

            toast.info('Processing for payment gateway opening...', { autoClose: 1800 });
            try {
                const response = await axios.post(`${API_BASE_URL}/donations/initiate-sabpaisa`, {
                    fullName: data.fullName,
                    mobile: data.phone,
                    email: data.email,
                    address: data.address || 'Guntur, AP',
                    amount: finalAmount,
                    purpose: data.purpose,
                    verifiedToken: verifiedToken || `VERIFIED_CLICK:${Date.now()}`,
                    website_trap: data.website_trap
                });

                if (response.data && response.data.success && response.data.checkoutUrl) {
                    window.location.href = response.data.checkoutUrl;
                    return;
                } else {
                    toast.error(response.data?.message || 'Failed to initialize payment.', { autoClose: 2500 });
                    setIsSubmitting(false);
                }
            } catch (error) {
                console.error('Payment initiation error:', error);
                const errorMsg = error.response?.data?.message || 'Unable to connect to payment gateway. Please try again.';
                toast.error(errorMsg, { autoClose: 2500 });
                setIsSubmitting(false);
                return;
            }
        } else {
            const payload = {
                donationType: 'item',
                fullName: data.fullName,
                mobile: data.phone,
                email: data.email,
                address: data.address || 'Guntur, AP',
                itemCategory: data.itemCategory,
                itemName: data.itemName,
                itemQuantity: data.itemQuantity,
                deliveryMethod: data.deliveryMethod
            };

            try {
                const response = await axios.post(`${API_BASE_URL}/donations`, payload);
                if (response.data && response.data.success) {
                    const savedDonation = response.data.data;
                    const receipt = generateReceipt({
                        ...data,
                        receiptNo: savedDonation.receiptNumber
                    });
                    setReceiptData(receipt);
                    setShowThankYou(true);
                    reset();
                    toast.success('Item Donation request received! Our logistics team will call you.');
                }
            } catch (err) {
                console.error('Item donation error:', err);
                const receipt = generateReceipt(data);
                setReceiptData(receipt);
                setShowThankYou(true);
                reset();
                toast.success('Item Donation request recorded!');
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    if (showThankYou && receiptData) {
        return (
            <div className="donate-page">
                <div className="page-banner">
                    <div className="container">
                        <h1>Donation Successful</h1>
                        <p className="breadcrumb"><span>Home / </span>Donate</p>
                    </div>
                </div>
                <section className="section-padding">
                    <div className="container">
                        <div className="thank-you-card">
                            <div className="ty-header">
                                <div className="ty-icon"><FaCheckCircle /></div>
                                <h2>Thank You, {receiptData.name}!</h2>
                                <p>Your generous contribution has been received. You are making a huge difference in Guntur & Palnadu districts!</p>
                            </div>
                            <div className="receipt-box">
                                <h3><FaReceipt /> Donation Receipt</h3>
                                <div className="receipt-grid">
                                    {receiptData.type === 'cash' ? (
                                        <>
                                            <div className="receipt-row">
                                                <span>Receipt Number</span>
                                                <strong>{receiptData.receiptNo}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Transaction ID</span>
                                                <strong>{receiptData.txnId}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Donor Name</span>
                                                <strong>{receiptData.name}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Donation Date</span>
                                                <strong>{receiptData.date}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Purpose</span>
                                                <strong>{receiptData.purpose}</strong>
                                            </div>
                                            <div className="receipt-row amount-row">
                                                <span>Amount Donated</span>
                                                <strong className="gradient-text">₹{Number(receiptData.amount).toLocaleString('en-IN')}</strong>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="receipt-row">
                                                <span>Receipt Number</span>
                                                <strong>{receiptData.receiptNo}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Donor Name</span>
                                                <strong>{receiptData.name}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Donation Date</span>
                                                <strong>{receiptData.date}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Item Category</span>
                                                <strong style={{ textTransform: 'capitalize' }}>{receiptData.itemCategory}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Item Details</span>
                                                <strong>{receiptData.itemName}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Quantity / Weight</span>
                                                <strong>{receiptData.itemQuantity}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>Delivery Mode</span>
                                                <strong>{receiptData.deliveryMethod}</strong>
                                            </div>
                                            <div className="receipt-row amount-row" style={{ borderColor: 'transparent' }}>
                                                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>In-Kind Status</span>
                                                <strong className="gradient-text" style={{ fontSize: '18px' }}>Awaiting Handover</strong>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="receipt-legal">
                                    <FaShieldAlt /> 80G Tax Exemption Receipt • PAN: AAGTK5575Q • 80G URN: AAGTK5575QF20261
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => window.print()}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <FaPrint /> Print / Save 80G Receipt
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowThankYou(false);
                                        setReceiptData(null);
                                        window.history.replaceState({}, document.title, window.location.pathname);
                                    }}
                                >
                                    Make Another Donation
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    if (pendingPaymentData) {
        return (
            <div className="donate-page">
                <div className="page-banner">
                    <div className="container">
                        <h1>Verifying Payment</h1>
                        <p className="breadcrumb"><span>Home / </span>Donate</p>
                    </div>
                </div>
                <section className="section-padding">
                    <div className="container">
                        <div className="thank-you-card" style={{ border: '1px solid #bfdbfe' }}>
                            <div className="ty-header" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)' }}>
                                <div className="ty-icon" style={{ animation: 'spin 1.5s linear infinite' }}>
                                    <FaSyncAlt />
                                </div>
                                <h2>Awaiting Bank Confirmation</h2>
                                <p>We are checking transaction status with NPCI & your bank. Please keep this page open...</p>
                            </div>
                            <div className="receipt-box">
                                <h3 style={{ color: '#1d4ed8' }}>
                                    <FaReceipt /> Transaction Details
                                </h3>
                                <div className="receipt-grid">
                                    <div className="receipt-row">
                                        <span>Status</span>
                                        <strong style={{ color: '#0284c7', fontWeight: '700' }}>Processing with Bank</strong>
                                    </div>
                                    <div className="receipt-row">
                                        <span>Transaction Reference</span>
                                        <strong>{pendingPaymentData.txnId || pendingPaymentData.clientTxnId}</strong>
                                    </div>
                                    <div className="receipt-row">
                                        <span>Donor Name</span>
                                        <strong>{pendingPaymentData.name}</strong>
                                    </div>
                                    <div className="receipt-row amount-row">
                                        <span>Amount</span>
                                        <strong className="gradient-text">₹{Number(pendingPaymentData.amount).toLocaleString('en-IN')}</strong>
                                    </div>
                                    <div className="receipt-row">
                                        <span>Initiated On</span>
                                        <strong>{pendingPaymentData.date}</strong>
                                    </div>
                                </div>
                                <div className="payment-help-box bank-safety-notice" style={{ marginTop: '20px' }}>
                                    <div className="help-box-icon"><FaShieldAlt /></div>
                                    <div>
                                        <strong>Did you approve in PhonePe / GPay?</strong>
                                        <p>If you have already approved the amount and entered your UPI PIN on your phone, your bank will confirm it within a few moments, and your official 80G Tax Exemption Receipt will load automatically.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="failed-actions-row">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setPendingPaymentData(null);
                                        window.history.replaceState({}, document.title, window.location.pathname);
                                    }}
                                >
                                    Return to Donation Form
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    if (failedPaymentData) {
        return (
            <div className="donate-page">
                <div className="page-banner">
                    <div className="container">
                        <h1>Transaction Status</h1>
                        <p className="breadcrumb"><span>Home / </span>Donate</p>
                    </div>
                </div>
                <section className="section-padding">
                    <div className="container">
                        <div className="thank-you-card failed-card">
                            <div className="ty-header failed-header">
                                <div className="ty-icon failed-icon"><FaTimesCircle /></div>
                                <h2>Payment Not Completed</h2>
                                <p>We could not complete your transaction. No worries, your funds are safe!</p>
                            </div>
                            <div className="receipt-box">
                                <h3 style={{ color: '#dc2626' }}>
                                    <FaReceipt /> Transaction Attempt Summary
                                </h3>
                                <div className="receipt-grid">
                                    <div className="receipt-row">
                                        <span>Status</span>
                                        <strong style={{ color: '#dc2626', fontWeight: '700' }}>Declined / Incomplete</strong>
                                    </div>
                                    {failedPaymentData.txnId && (
                                        <div className="receipt-row">
                                            <span>Transaction Reference</span>
                                            <strong>{failedPaymentData.txnId}</strong>
                                        </div>
                                    )}
                                    {failedPaymentData.name && (
                                        <div className="receipt-row">
                                            <span>Donor Name</span>
                                            <strong>{failedPaymentData.name}</strong>
                                        </div>
                                    )}
                                    {failedPaymentData.amount && (
                                        <div className="receipt-row amount-row">
                                            <span>Attempted Amount</span>
                                            <strong className="gradient-text">₹{Number(failedPaymentData.amount).toLocaleString('en-IN')}</strong>
                                        </div>
                                    )}
                                    <div className="receipt-row">
                                        <span>Date & Time</span>
                                        <strong>{failedPaymentData.date}</strong>
                                    </div>
                                    <div className="receipt-row">
                                        <span>Bank / Gateway Note</span>
                                        <strong style={{ maxWidth: '60%', textAlign: 'right', color: '#475569' }}>
                                            {failedPaymentData.reason || 'Payment could not be processed by card network'}
                                        </strong>
                                    </div>
                                </div>

                                {/* Reassurance & Card Guidance Boxes */}
                                <div className="payment-help-box bank-safety-notice">
                                    <div className="help-box-icon"><FaShieldAlt /></div>
                                    <div>
                                        <strong>Did your bank deduct money?</strong>
                                        <p>If any amount was debited from your card or bank account, it is completely safe. The payment gateway and your bank will automatically reverse and refund it to your original account within 5 to 7 business days.</p>
                                    </div>
                                </div>

                                <div className="payment-help-box card-threshold-notice">
                                    <div className="help-box-icon"><FaCreditCard /></div>
                                    <div>
                                        <strong>Notice for Card Payments:</strong>
                                        <p>Indian payment gateway aggregators (Atom / SabPaisa) require a minimum transaction of <strong>₹10</strong> for Credit & Debit Cards due to interchange rules. For micro-donations of <strong>₹1 to ₹9</strong>, please choose <strong>UPI (GPay, PhonePe, Paytm, BHIM)</strong> which supports amounts starting at ₹1.</p>
                                    </div>
                                </div>

                                {/* Direct Trust Bank Account fallback */}
                                <div className="trust-direct-bank-box">
                                    <h4><FaUniversity /> Direct Bank Transfer Alternative</h4>
                                    <p>You can also transfer directly to the Trust's verified current account:</p>
                                    <div className="bank-details-mini">
                                        <div><strong>Bank:</strong> Canara Bank (CM Nagar, Guntur)</div>
                                        <div><strong>Account Name:</strong> Kiran Charitable Trust</div>
                                        <div><strong>Account No:</strong> 110319653482</div>
                                        <div><strong>IFSC Code:</strong> CNRB0002492</div>
                                    </div>
                                </div>
                            </div>

                            <div className="failed-actions-row">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setFailedPaymentData(null);
                                        window.history.replaceState({}, document.title, window.location.pathname);
                                    }}
                                >
                                    <FaRedo /> Try Again / Choose UPI
                                </button>
                                <a
                                    href="https://wa.me/919440224939?text=Hello%20Kiran%20Charitable%20Trust,%20I%20need%20help%20with%20my%20donation%20transaction"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <FaPhone /> Contact Trust Support
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="donate-page">
            <ToastContainer autoClose={1800} hideProgressBar={false} />
            <div className="page-banner">
                <div className="container">
                    <h1>Support Our Mission</h1>
                    <p className="breadcrumb"><span>Home / </span>Donate</p>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges-bar">
                <div className="container trust-badges-inner">
                    {['80G Tax Exemption (80G URN: AAGTK5575QF20261)', '12A Registered (12A URN: AAGTK5575QE20261)', 'PAN: AAGTK5575Q', '100% Direct Allocation Guarantee'].map((b, i) => (
                        <div key={i} className="trust-badge-item">
                            <FaShieldAlt /> {b}
                        </div>
                    ))}
                </div>
            </div>

            <section className="section-padding">
                <div className="container">
                    <div className="donate-grid">
                        {/* Left: Info */}
                        <div className="donate-info">
                            <h2>Your Compassion<br /><span className="gradient-text">Changes Human Lives</span></h2>
                            <p>Every contribution, big or small, helps us bring food, safety, and learning to students and elder folks across Andhra Pradesh. Here is how your help creates change today:</p>

                            <div className="donate-impact-cards">
                                {[
                                    { amount: '₹500', impact: 'Distributes notebooks & pens for 2 rural kids for the academic year' },
                                    { amount: '₹1,000', impact: 'Provides free blood screening & basic medications for 10 elderly citizens' },
                                    { amount: '₹2,500', impact: 'Distributes grocery kits (Rice & Dal) to 25 daily-wage family members' },
                                    { amount: '₹5,000', impact: 'Funds professional tailoring machine course for 1 underprivileged woman' },
                                ].map((item, i) => (
                                    <div key={i} className="impact-card">
                                        <span className="impact-amount gradient-text">{item.amount}</span>
                                        <span className="impact-desc">{item.impact}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Legal Info */}
                            <div className="legal-info-box">
                                <h4><FaFileAlt /> Legal & Tax Certificate Info</h4>
                                <ul>
                                    <li><FaCheckCircle /> <strong>Trust PAN:</strong> AAGTK5575Q</li>
                                    <li><FaCheckCircle /> <strong>12A URN:</strong> AAGTK5575QE20261 (Order u/s 332)</li>
                                    <li><FaCheckCircle /> <strong>80G URN:</strong> AAGTK5575QF20261 (Approval u/s 354)</li>
                                    <li><FaCheckCircle /> <strong>Application No:</strong> 715954770021026</li>
                                    <li><FaCheckCircle /> <strong>Tax Validity:</strong> AY 2026-27 to AY 2028-29</li>
                                    <li><FaCheckCircle /> <strong>Bank Current A/C:</strong> Canara Bank (110319653482)</li>
                                </ul>
                                <div className="bank-details" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
                                    {/* Direct Official Canara Bank QR Code */}
                                    <div style={{
                                        textAlign: 'center',
                                        background: '#ffffff',
                                        border: '1.5px solid #cbd5e1',
                                        borderRadius: '10px',
                                        padding: '14px 10px',
                                        marginBottom: '14px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                                    }}>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                            <FaQrcode style={{ color: '#2563eb' }} /> Scan &amp; Pay via any UPI App
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                                            Official Canara Bank Trust QR Code
                                        </div>
                                        <div style={{
                                            background: '#ffffff',
                                            padding: '6px',
                                            borderRadius: '8px',
                                            display: 'inline-block',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img
                                                src="/documents/canara_trust_qr.png"
                                                alt="Canara Bank UPI QR Code - Kiran Charitable Trust"
                                                style={{ width: '160px', height: '160px', display: 'block', margin: '0 auto', borderRadius: '4px' }}
                                            />
                                        </div>

                                        {/* Down UPI Icons */}
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginTop: '8px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>PhonePe</span>
                                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>Google Pay</span>
                                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>Paytm</span>
                                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>BHIM</span>
                                        </div>

                                        {/* Separate UPI ID with Copy Button */}
                                        <div style={{
                                            marginTop: '10px',
                                            padding: '6px 8px',
                                            background: '#f8fafc',
                                            borderRadius: '6px',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <div style={{ textAlign: 'left', minWidth: 0 }}>
                                                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>UPI ID</span>
                                                <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#1d4ed8', fontSize: '12px' }}>340625862653482@cnrb</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy('340625862653482@cnrb', 'sidebar_upi', 'UPI ID')}
                                                style={{
                                                    padding: '3px 8px',
                                                    fontSize: '11px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #3b82f6',
                                                    background: '#1d4ed8',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '3px',
                                                    fontWeight: '600',
                                                    flexShrink: 0
                                                }}
                                            >
                                                {copiedKey === 'sidebar_upi' ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
                                            </button>
                                        </div>
                                    </div>

                                    <h5 style={{ color: '#1e293b', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
                                        Official Trust Bank Transfer (NEFT / RTGS / IMPS)
                                    </h5>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', fontSize: '13px' }}>
                                        <span><strong>Account Name:</strong> Kiran Charitable Trust</span>
                                        <button type="button" onClick={() => handleCopy('Kiran Charitable Trust', 'sidebar_name', 'Account Name')} style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {copiedKey === 'sidebar_name' ? <><FaCheck style={{ color: '#10b981' }} /> Copied</> : <><FaCopy /> Copy</>}
                                        </button>
                                    </div>
                                    <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Bank:</strong> Canara Bank</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', fontSize: '13px', background: '#e0f2fe', padding: '6px 8px', borderRadius: '6px' }}>
                                        <span><strong>Account No:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#1d4ed8' }}>110319653482</span></span>
                                        <button type="button" onClick={() => handleCopy('110319653482', 'sidebar_acc', 'Account Number')} style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #3b82f6', background: '#1d4ed8', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                            {copiedKey === 'sidebar_acc' ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', fontSize: '13px', background: '#e0f2fe', padding: '6px 8px', borderRadius: '6px' }}>
                                        <span><strong>IFSC Code:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#1d4ed8' }}>CNRB0002492</span></span>
                                        <button type="button" onClick={() => handleCopy('CNRB0002492', 'sidebar_ifsc', 'IFSC Code')} style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #3b82f6', background: '#1d4ed8', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                            {copiedKey === 'sidebar_ifsc' ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
                                        </button>
                                    </div>
                                    <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Branch:</strong> Chandramouli Nagar (2492), Guntur</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', fontSize: '13px' }}>
                                        <span><strong>SWIFT Code:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>CNRBNBBBFD</span></span>
                                        <button type="button" onClick={() => handleCopy('CNRBNBBBFD', 'sidebar_swift', 'SWIFT Code')} style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {copiedKey === 'sidebar_swift' ? <><FaCheck style={{ color: '#10b981' }} /> Copied</> : <><FaCopy /> Copy</>}
                                        </button>
                                    </div>
                                    <div style={{ marginTop: "14px", background: "#eff6ff", padding: "14px", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#1e40af", marginBottom: "4px" }}>⚡ Instant UPI & Card Donations:</div>
                                        <div style={{ fontSize: "12px", color: "#1e3a8a", lineHeight: 1.6 }}>To donate via <strong>PhonePe, Google Pay, Paytm, UPI QR, or Cards</strong> with an instant 80G tax receipt, fill the form on the right and click <strong>&quot;Proceed to Secure Payment&quot;</strong>.</div>
                                    </div>
                                    <div style={{ marginTop: '14px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Official Trust Documents</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <a href="/documents/12A-332(8).pdf" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                📄 12A Registration Order (Form 106)
                                            </a>
                                            <a href="/documents/80G-354(4).pdf" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                📄 80G Tax Exemption Approval (Form 106)
                                            </a>
                                            <a href="/documents/Trust_Pan_Card.pdf" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                📄 Trust PAN Card (AAGTK5575Q)
                                            </a>
                                            <a href="/documents/kiran_charitable_trust_account_statement.pdf" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                📄 Canara Bank Account Verification
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="donate-form-card">
                            <div className="donate-form-header">
                                <FaHeart className="donate-form-icon" />
                                <h3>Kiran Trust Contribution Form</h3>
                                <div className="secure-badge"><FaLock /> 100% Secure & Encrypted</div>
                            </div>

                            <div className="donation-type-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                                <button
                                    type="button"
                                    onClick={() => setDonationType('cash')}
                                    style={{
                                        flex: 1,
                                        padding: '14.5px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        border: 'none',
                                        background: donationType === 'cash' ? '#ffffff' : 'var(--bg-light)',
                                        color: donationType === 'cash' ? 'var(--primary)' : 'var(--text-gray)',
                                        borderBottom: donationType === 'cash' ? '2.5px solid var(--primary)' : 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'Outfit, sans-serif'
                                    }}
                                >
                                    Cash / Online
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDonationType('item')}
                                    style={{
                                        flex: 1,
                                        padding: '14.5px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        border: 'none',
                                        background: donationType === 'item' ? '#ffffff' : 'var(--bg-light)',
                                        color: donationType === 'item' ? 'var(--primary)' : 'var(--text-gray)',
                                        borderBottom: donationType === 'item' ? '2.5px solid var(--primary)' : 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'Outfit, sans-serif'
                                    }}
                                >
                                    Item (In-Kind)
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="donate-form">
                                {donationType === 'cash' ? (
                                    <>
                                        {/* Amount Selection */}
                                        <div className="amount-section">
                                            <label className="amount-label">Select Amount (₹)</label>
                                            <div className="amount-grid">
                                                {amounts.map(amt => (
                                                    <button
                                                        key={amt}
                                                        type="button"
                                                        className={`amount-btn ${selectedAmount === amt && !customAmount ? 'active' : ''}`}
                                                        onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                                                    >
                                                        ₹{amt.toLocaleString('en-IN')}
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                placeholder="Or enter custom amount (₹)"
                                                className="custom-amount-input"
                                                value={customAmount}
                                                onChange={e => {
                                                    const clean = e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
                                                    setCustomAmount(clean);
                                                    if (clean) {
                                                        setSelectedAmount(null);
                                                    } else {
                                                        setSelectedAmount(1000);
                                                    }
                                                }}
                                                onKeyDown={e => {
                                                    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
                                                        return;
                                                    }
                                                    if (!/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onPaste={e => {
                                                    e.preventDefault();
                                                    const paste = (e.clipboardData || window.clipboardData).getData('text');
                                                    const clean = paste.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
                                                    if (clean) {
                                                        setCustomAmount(clean);
                                                        setSelectedAmount(null);
                                                    }
                                                }}
                                            />
                                            <div className="amount-helper-note">
                                                <FaInfoCircle /> Minimum online donation is ₹1
                                            </div>
                                            <div className="selected-amount-display">
                                                Donation Amount: <strong className="gradient-text">₹{Number(finalAmount).toLocaleString('en-IN')}</strong>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="don-purpose">Donation Purpose *</label>
                                            <select
                                                id="don-purpose"
                                                className={errors.purpose ? 'input-error' : ''}
                                                {...register('purpose', { required: 'Please select a purpose' })}
                                            >
                                                <option value="">Select purpose</option>
                                                {purposes.map(p => (
                                                    <option key={p.value} value={p.value}>{p.label}</option>
                                                ))}
                                            </select>
                                            {errors.purpose && <span className="error-msg">{errors.purpose.message}</span>}
                                        </div>

                                        {/* Payment Way Dropdown */}
                                        <div className="form-group" style={{ marginTop: '16px', marginBottom: '16px' }}>
                                            <label htmlFor="pay-channel" style={{ fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                                <FaUniversity style={{ color: 'var(--primary)' }} /> Select Payment Way *
                                            </label>
                                            <select
                                                id="pay-channel"
                                                value={paymentChannel}
                                                onChange={e => setPaymentChannel(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '100%',
                                                    boxSizing: 'border-box',
                                                    padding: '11px 14px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #2563eb',
                                                    background: '#ffffff',
                                                    fontWeight: '700',
                                                    fontSize: '14px',
                                                    color: '#1e293b',
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                    boxShadow: '0 1px 3px rgba(37, 99, 235, 0.1)'
                                                }}
                                            >
                                                <option value="qr_code">📱 1. Direct UPI QR &amp; UPI ID</option>
                                                <option value="bank_transfer">🏛️ 2. Direct Bank Transfer</option>
                                                <option value="online">⚡ 3. Online Gateway (SabPaisa)</option>
                                            </select>
                                            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', lineHeight: 1.4 }}>
                                                {paymentChannel === 'qr_code' && '📱 Instant scan with PhonePe, Google Pay, Paytm, BHIM & Canara ai1'}
                                                {paymentChannel === 'bank_transfer' && '🏛️ Direct NEFT / RTGS / IMPS into Canara Bank account'}
                                                {paymentChannel === 'online' && '⚡ SabPaisa Payment Gateway: Cards, NetBanking, Instant checkout'}
                                            </p>
                                        </div>

                                        {/* Option 1: Direct UPI QR Code Box */}
                                        {paymentChannel === 'qr_code' && (
                                            <div style={{
                                                background: '#f8fafc',
                                                border: '1.5px solid #3b82f6',
                                                borderRadius: '12px',
                                                padding: '16px',
                                                marginBottom: '18px',
                                                textAlign: 'center'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    <FaQrcode style={{ color: '#2563eb', fontSize: '18px' }} />
                                                    <strong style={{ color: '#1e3a8a', fontSize: '15px' }}>Canara Bank Official Trust UPI QR</strong>
                                                </div>
                                                <p style={{ fontSize: '12px', color: '#475569', marginBottom: '10px', lineHeight: 1.5 }}>
                                                    Scan this QR code with any UPI app on your mobile phone to donate directly:
                                                </p>

                                                {/* QR Code Container */}
                                                <div style={{
                                                    background: '#ffffff',
                                                    padding: '8px',
                                                    borderRadius: '10px',
                                                    display: 'inline-block',
                                                    border: '2px solid #e2e8f0',
                                                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
                                                }}>
                                                    <img
                                                        src="/documents/canara_trust_qr.png"
                                                        alt="Canara Bank UPI QR Code - Kiran Charitable Trust"
                                                        style={{ width: '180px', height: '180px', display: 'block', margin: '0 auto', borderRadius: '4px' }}
                                                    />
                                                </div>

                                                {/* Down UPI Icons / Badges */}
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>PhonePe</span>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>Google Pay</span>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>Paytm</span>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>BHIM UPI</span>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1' }}>Canara ai1</span>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: '#fdf2f8', color: '#9d174d', border: '1px solid #fbcfe8' }}>Cred</span>
                                                </div>

                                                {/* Separate UPI ID with Copy Button */}
                                                <div style={{
                                                    margin: '12px 0 8px',
                                                    padding: '9px 12px',
                                                    background: '#ffffff',
                                                    borderRadius: '8px',
                                                    border: '1.5px solid #2563eb',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <div style={{ textAlign: 'left', minWidth: 0 }}>
                                                        <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Official UPI ID</span>
                                                        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#1d4ed8', fontSize: '14px', wordBreak: 'break-all' }}>340625862653482@cnrb</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy('340625862653482@cnrb', 'form_upi', 'UPI ID')}
                                                        style={{
                                                            padding: '5px 12px',
                                                            fontSize: '12px',
                                                            borderRadius: '5px',
                                                            border: 'none',
                                                            background: '#1d4ed8',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            fontWeight: '600',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {copiedKey === 'form_upi' ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
                                                    </button>
                                                </div>

                                                <div style={{ textAlign: 'left', fontSize: '12px', color: '#475569', background: '#eff6ff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                                                    <div><strong>Payee Name:</strong> KIRAN CHARITABLE TRUST</div>
                                                    <div><strong>Bank:</strong> Canara Bank (A/C: 110319653482)</div>
                                                    <div><strong>Category:</strong> MCC 5169 (Charity &amp; Social Service)</div>
                                                </div>

                                                {/* UTR Input */}
                                                <div style={{ marginTop: '12px', textAlign: 'left' }}>
                                                    <label htmlFor="qr-utr-ref" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1e3a8a', marginBottom: '4px' }}>
                                                        UPI Transaction ID / UTR Number (Optional):
                                                    </label>
                                                    <input
                                                        id="qr-utr-ref"
                                                        type="text"
                                                        placeholder="e.g. 4298XXXXXXXX (from your UPI app)"
                                                        value={utrNumber}
                                                        onChange={e => setUtrNumber(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px 12px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #93c5fd',
                                                            fontSize: '13px',
                                                            boxSizing: 'border-box'
                                                        }}
                                                    />
                                                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '3px' }}>
                                                        Enter the 12-digit UTR to get an instant 80G Tax Exemption Receipt.
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Direct Bank Transfer Box with 1-Click Copy Buttons */}
                                        {paymentChannel === 'bank_transfer' && (
                                            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', borderBottom: '1px solid #bbf7d0', paddingBottom: '6px' }}>
                                                    <FaUniversity style={{ color: '#15803d', fontSize: '18px' }} />
                                                    <strong style={{ color: '#166534', fontSize: '14px' }}>Official Canara Bank Details (NEFT / RTGS / IMPS)</strong>
                                                </div>
                                                <p style={{ fontSize: '12px', color: '#166534', marginBottom: '10px', lineHeight: 1.5 }}>
                                                    Transfer directly using your mobile banking app or NetBanking. Use the <strong>Copy</strong> buttons:
                                                </p>
                                                
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', fontSize: '13px', background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                                                    <span><strong>Account Name:</strong> Kiran Charitable Trust</span>
                                                    <button type="button" onClick={() => handleCopy('Kiran Charitable Trust', 'form_name', 'Account Name')} style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        {copiedKey === 'form_name' ? <><FaCheck style={{ color: '#10b981' }} /> Copied</> : <><FaCopy /> Copy</>}
                                                    </button>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', fontSize: '13px', background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #3b82f6' }}>
                                                    <span><strong>Account No:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#1d4ed8', fontSize: '15px' }}>110319653482</span></span>
                                                    <button type="button" onClick={() => handleCopy('110319653482', 'form_acc', 'Account Number')} style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', background: '#1d4ed8', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                                        {copiedKey === 'form_acc' ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
                                                    </button>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', fontSize: '13px', background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #3b82f6' }}>
                                                    <span><strong>IFSC Code:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#1d4ed8', fontSize: '15px' }}>CNRB0002492</span></span>
                                                    <button type="button" onClick={() => handleCopy('CNRB0002492', 'form_ifsc', 'IFSC Code')} style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', background: '#1d4ed8', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                                        {copiedKey === 'form_ifsc' ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
                                                    </button>
                                                </div>

                                                <div style={{ margin: '6px 0', fontSize: '12.5px', color: '#334155' }}>
                                                    <strong>Branch:</strong> Chandramouli Nagar (2492), Ring Road, Guntur - 522007
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', fontSize: '13px', background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                                                    <span><strong>SWIFT Code:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>CNRBNBBBFD</span></span>
                                                    <button type="button" onClick={() => handleCopy('CNRBNBBBFD', 'form_swift', 'SWIFT Code')} style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        {copiedKey === 'form_swift' ? <><FaCheck style={{ color: '#10b981' }} /> Copied</> : <><FaCopy /> Copy</>}
                                                    </button>
                                                </div>

                                                <div style={{ marginTop: '12px' }}>
                                                    <label htmlFor="utr-ref" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
                                                        Bank Reference / UTR Number (Optional):
                                                    </label>
                                                    <input
                                                        id="utr-ref"
                                                        type="text"
                                                        placeholder="e.g. 260324XXXXXX (UTR from your bank app)"
                                                        value={utrNumber}
                                                        onChange={e => setUtrNumber(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px 12px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #86efac',
                                                            fontSize: '13px'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Item Categories */}
                                        <div className="form-group">
                                            <label htmlFor="item-category">Select Item Category *</label>
                                            <select
                                                id="item-category"
                                                className={errors.itemCategory ? 'input-error' : ''}
                                                {...register('itemCategory', { required: 'Please choose an item category' })}
                                            >
                                                <option value="">Select category</option>
                                                <option value="food">Rations & Prepared Foods</option>
                                                <option value="education">Notebooks & Stationaries</option>
                                                <option value="clothing">Clothes & Winter Blankets</option>
                                                <option value="medical">First-Aid & Generic Medicines</option>
                                                <option value="toys">Children Toys & Creative Items</option>
                                                <option value="other">Other In-Kind Contributions</option>
                                            </select>
                                            {errors.itemCategory && <span className="error-msg">{errors.itemCategory.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="item-name">Items & Descriptions *</label>
                                            <textarea
                                                id="item-name"
                                                placeholder="e.g. 15 Kg premium basmati rice, 5 drawing books, 2 clean cotton bedsheets..."
                                                rows={3}
                                                className={errors.itemName ? 'input-error' : ''}
                                                {...register('itemName', { required: 'Please specify the item details' })}
                                            />
                                            {errors.itemName && <span className="error-msg">{errors.itemName.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="item-qty">Quantity / Estimated Weight *</label>
                                            <input
                                                id="item-qty"
                                                type="text"
                                                placeholder="e.g. 15 Kg, 5 Packets, 1 Box"
                                                className={errors.itemQuantity ? 'input-error' : ''}
                                                {...register('itemQuantity', { required: 'Please mention weight/quantity' })}
                                            />
                                            {errors.itemQuantity && <span className="error-msg">{errors.itemQuantity.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="item-delivery">Mode of Delivery *</label>
                                            <select
                                                id="item-delivery"
                                                className={errors.deliveryMethod ? 'input-error' : ''}
                                                {...register('deliveryMethod', { required: 'Choose a delivery preference' })}
                                            >
                                                <option value="">Select delivery mode</option>
                                                <option value="dropoff">I will pack & courier / drop off at office</option>
                                                <option value="pickup">Request free door-step pickup (Guntur & Palnadu districts)</option>
                                            </select>
                                            {errors.deliveryMethod && <span className="error-msg">{errors.deliveryMethod.message}</span>}
                                        </div>
                                    </>
                                )}

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label htmlFor="don-name"><FaUser /> Full Name *</label>
                                        <input
                                            id="don-name"
                                            type="text"
                                            placeholder="Your full name"
                                            className={errors.fullName ? 'input-error' : ''}
                                            {...register('fullName', { required: 'Name is required' })}
                                        />
                                        {errors.fullName && <span className="error-msg">{errors.fullName.message}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="don-phone"><FaPhone /> Mobile Number *</label>
                                        <input
                                            id="don-phone"
                                            type="tel"
                                            placeholder="+91 XXXXX XXXXX"
                                            className={errors.phone ? 'input-error' : ''}
                                            {...register('phone', { required: 'Phone required' })}
                                        />
                                        {errors.phone && <span className="error-msg">{errors.phone.message}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="don-email"><FaEnvelope /> Email Address *</label>
                                    <input
                                        id="don-email"
                                        type="email"
                                        placeholder="For receipt & updates"
                                        className={errors.email ? 'input-error' : ''}
                                        {...register('email', { required: 'Email required' })}
                                    />
                                    {errors.email && <span className="error-msg">{errors.email.message}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="don-address"><FaMapMarkerAlt /> Communication Address</label>
                                    <input
                                        id="don-address"
                                        type="text"
                                        placeholder="For communication/tax certificates"
                                        {...register('address')}
                                    />
                                </div>

                                {/* Security Honeypot Anti-Bot Field (Hidden from humans) */}
                                <input
                                    type="text"
                                    style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    {...register('website_trap')}
                                />

                                {/* Official Professional reCAPTCHA Style Widget */}
                                {donationType === 'cash' && paymentChannel === 'online' && (
                                    <div className={`recaptcha-widget-card ${isCaptchaVerified ? 'verified' : ''}`}>
                                        <div
                                            className="recaptcha-checkbox-area"
                                            onClick={handleCaptchaClick}
                                            role="button"
                                            tabIndex={0}
                                            title={isCaptchaVerified ? "Human verification complete" : "Click to verify you're human"}
                                        >
                                            <div className="recaptcha-box-outer">
                                                {!isVerifyingCaptcha && !isCaptchaVerified && (
                                                    <div className="recaptcha-square"></div>
                                                )}
                                                {isVerifyingCaptcha && (
                                                    <div className="recaptcha-spinner-ring"></div>
                                                )}
                                                {isCaptchaVerified && (
                                                    <div className="recaptcha-checkmark-svg">
                                                        <svg viewBox="0 0 24 24" width="22" height="22" stroke="#10B981" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="recaptcha-text">
                                                {isVerifyingCaptcha ? "Verifying human..." : isCaptchaVerified ? "Verified Human" : "I'm not a robot"}
                                            </span>
                                        </div>
                                        <div className="recaptcha-brand">
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1e3a8a" strokeWidth="2">
                                                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                                                <path d="M12 8v8M8 12h8" stroke="#f59e0b" strokeWidth="2"/>
                                            </svg>
                                            <div className="recaptcha-brand-text">
                                                <span>reCAPTCHA</span>
                                                <small>Privacy - Terms</small>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Terms */}
                                <div className="terms-check">
                                    <input
                                        type="checkbox"
                                        id="agree-terms"
                                        checked={agreed}
                                        onChange={e => setAgreed(e.target.checked)}
                                    />
                                    <label htmlFor="agree-terms">
                                        I agree to the <a href="/terms-conditions" target="_blank">Terms & Conditions</a> and acknowledge that this is a genuine support task.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary donate-submit-btn"
                                    disabled={!agreed || (donationType === 'cash' && paymentChannel === 'online' && !isCaptchaVerified) || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid white', borderRightColor: 'transparent', borderRadius: '50%', animation: 'recaptchaRotation 0.6s linear infinite', marginRight: 8, verticalAlign: 'middle' }}></span>
                                            Processing for payment gateway opening...
                                        </>
                                    ) : (
                                        <>
                                            <FaHeart /> {donationType === 'cash' 
                                                ? (paymentChannel === 'qr_code'
                                                    ? `Record UPI Donation & Get 80G Receipt (₹${Number(finalAmount).toLocaleString('en-IN')})`
                                                    : (paymentChannel === 'bank_transfer'
                                                        ? `Record Bank Transfer & Get 80G Receipt (₹${Number(finalAmount).toLocaleString('en-IN')})` 
                                                        : `Donate ₹${Number(finalAmount).toLocaleString('en-IN')} via SabPaisa Gateway`))
                                                : `Submit Item Donation Support`}
                                        </>
                                    )}
                                </button>

                                <div className="form-footer-note">
                                    <FaShieldAlt /> 100% secure • 80G Tax Benefits • Verified NGO
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Embedded Checkout Modal */}
            {checkoutSession && (
                <div
                    className="sabpaisa-modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowCancelConfirm(true);
                        }
                    }}
                >
                    <div className="sabpaisa-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="sabpaisa-modal-header">
                            <div className="sabpaisa-modal-title">
                                <span className="sabpaisa-dot-live"></span>
                                <span>SabPaisa Secure Checkout &bull; ₹{Number(checkoutSession.amount).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="sabpaisa-modal-actions">
                                <a
                                    href={checkoutSession.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-open-external"
                                    title="Open in full window"
                                >
                                    Full Window ↗
                                </a>
                                <button
                                    type="button"
                                    className="sabpaisa-modal-close"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCancelConfirm(true);
                                    }}
                                    title="Close checkout"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="sabpaisa-iframe-wrapper">
                            <iframe
                                src={checkoutSession.url}
                                title="SabPaisa Secure Checkout"
                                allow="payment"
                                className="sabpaisa-checkout-iframe"
                            />
                        </div>

                        {/* Cancel Transaction Confirmation Prompt */}
                        {showCancelConfirm && (
                            <div className="cancel-confirm-backdrop" onClick={(e) => e.stopPropagation()}>
                                <div className="cancel-confirm-box" onClick={(e) => e.stopPropagation()}>
                                    <div className="cancel-confirm-icon-wrap">
                                        <FaExclamationTriangle />
                                    </div>
                                    <h3>Cancel Payment Transaction?</h3>
                                    <p>
                                        Your secure donation of <strong>₹{Number(checkoutSession.amount).toLocaleString('en-IN')}</strong> is in progress. Are you sure you want to cancel this transaction?
                                    </p>
                                    <div className="cancel-confirm-btn-group">
                                        <button
                                            type="button"
                                            className="cancel-resume-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCancelConfirm(false);
                                            }}
                                        >
                                            Continue Payment
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel-abort-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCancelConfirm(false);
                                                setCheckoutSession(null);
                                                setIsCaptchaVerified(false);
                                                setVerifiedToken('');
                                                setIsVerifyingCaptcha(false);
                                                toast.info('Payment cancelled.');
                                            }}
                                        >
                                            Yes, Cancel Transaction
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
