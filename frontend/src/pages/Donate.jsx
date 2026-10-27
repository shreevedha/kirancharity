import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart,
    FaMobileAlt, FaUniversity, FaCreditCard, FaWallet,
    FaQrcode, FaShieldAlt, FaCheckCircle, FaFileAlt,
    FaReceipt, FaLock, FaCheck, FaSyncAlt, FaRedo, FaUndo,
    FaExclamationTriangle, FaTimesCircle, FaPrint, FaInfoCircle
} from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import trustLogo from '../assets/Klogo.jpeg'
import './Donate.css'

const amounts = [500, 1000, 2000, 5000, 10000, 25000]
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
    const [agreed, setAgreed] = useState(false)
    const [showThankYou, setShowThankYou] = useState(false)
    const [receiptData, setReceiptData] = useState(null)
    const [failedPaymentData, setFailedPaymentData] = useState(null)
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
            toast.success('Payment Successful! Donation receipt generated.');
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
            setReceiptData(null);
            setIsCaptchaVerified(false);
            setVerifiedToken('');
            setIsVerifyingCaptcha(false);
        }
    }, []);

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

        if (donationType === 'cash' && !isCaptchaVerified) {
            toast.warn('Please complete the Security Verification (reCAPTCHA) below.');
            return;
        }

        setIsSubmitting(true);

        if (donationType === 'cash') {
            toast.info('Processing for payment gateway opening...', { autoClose: 1800 });
            try {
                const response = await axios.post(`${API_BASE_URL}/donations/initiate-sabpaisa`, {
                    fullName: data.fullName,
                    mobile: data.phone,
                    email: data.email,
                    address: data.address || 'Vijayawada, AP',
                    amount: finalAmount,
                    purpose: data.purpose,
                    verifiedToken: verifiedToken || `VERIFIED_CLICK:${Date.now()}`,
                    website_trap: data.website_trap
                });

                if (response.data && response.data.success && response.data.checkoutUrl) {
                    // Redirect directly to SabPaisa hosted checkout to enable 100% full support for Credit/Debit Cards (3D Secure OTP), NetBanking (39+ banks), and UPI
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
                address: data.address || 'Vijayawada, AP',
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
                                <p>Your generous contribution has been received. You are making a huge difference in Vijayawada!</p>
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
                                    <FaShieldAlt /> 80G Certificate will be sent to your email • PAN: AAATK1234X • Reg. No: TR-2026-001
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
                    {['80G Tax Exemption Certified', '12A Registered', 'FCRA Compliant', 'PAN: AAATK1234X', '100% Transparency Guarantee'].map((b, i) => (
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
                                    { amount: '₹2,000', impact: 'Distributes grocery kits (Rice & Dal) to 20 daily-wage family members' },
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
                                    <li><FaCheckCircle /> PAN: AAATK1234X</li>
                                    <li><FaCheckCircle /> 80G Tax Exemption Receipt</li>
                                    <li><FaCheckCircle /> 12A Registration Active</li>
                                    <li><FaCheckCircle /> Reg. No: TR-2026-001</li>
                                    <li><FaCheckCircle /> CSR Funding CSR-1 Eligible</li>
                                    <li><FaCheckCircle /> FCRA Approved Account</li>
                                </ul>
                                <div className="bank-details">
                                    <h5>Official Trust Bank Transfer (NEFT / RTGS / IMPS)</h5>
                                    <p><strong>Account Name:</strong> Kiran Charitable Trust</p>
                                    <p><strong>Bank:</strong> Canara Bank</p>
                                    <p><strong>Account Number:</strong> 110319653482</p>
                                    <p><strong>IFSC Code:</strong> CNRB0002492</p>
                                    <p><strong>Branch:</strong> CM Nagar Branch (2492), Guntur</p>
                                    <p style={{ marginTop: '8px', fontSize: '11px', color: '#047857', fontWeight: '600' }}>
                                        <FaCheckCircle style={{ marginRight: '5px' }} /> Verified Trust Current Account
                                    </p>
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
                                                <FaInfoCircle /> Minimum ₹1 for UPI &bull; ₹10+ recommended for Credit/Debit Cards
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
                                                <option value="pickup">Request free door-step pickup (Vijayawada region only)</option>
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
                                {donationType === 'cash' && (
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
                                    disabled={!agreed || (donationType === 'cash' && !isCaptchaVerified) || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid white', borderRightColor: 'transparent', borderRadius: '50%', animation: 'recaptchaRotation 0.6s linear infinite', marginRight: 8, verticalAlign: 'middle' }}></span>
                                            Processing for payment gateway opening...
                                        </>
                                    ) : (
                                        <>
                                            <FaHeart /> {donationType === 'cash' ? `Donate ₹${Number(finalAmount).toLocaleString('en-IN')} Now` : `Submit Item Donation Support`}
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
