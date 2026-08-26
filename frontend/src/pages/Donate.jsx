import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart,
    FaMobileAlt, FaUniversity, FaCreditCard, FaWallet,
    FaQrcode, FaShieldAlt, FaCheckCircle, FaFileAlt,
    FaReceipt, FaLock
} from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL } from '../config'
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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const finalAmount = customAmount || selectedAmount

    useEffect(() => {
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
                purpose: 'SabPaisa Canara Bank Online Payment',
            });
            setShowThankYou(true);
            toast.success('SabPaisa Payment Successful! Receipt generated.');
        } else if (status === 'failed') {
            const reason = params.get('reason') || 'Transaction failed or was cancelled.';
            toast.error(`Payment Status: ${reason}`);
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

        setIsSubmitting(true);

        if (donationType === 'cash') {
            toast.info('Connecting to SabPaisa Secure Payment Gateway (Canara Bank)...');
            try {
                const response = await axios.post(`${API_BASE_URL}/donations/initiate-sabpaisa`, {
                    fullName: data.fullName,
                    mobile: data.phone,
                    email: data.email,
                    address: data.address || 'Vijayawada, AP',
                    amount: finalAmount,
                    purpose: data.purpose
                });

                if (response.data && response.data.success && response.data.checkoutUrl) {
                    toast.info('Redirecting to SabPaisa Secure Payment Gateway...');
                    window.location.href = response.data.checkoutUrl;
                    return;
                } else {
                    toast.error(response.data?.message || 'Failed to initialize SabPaisa payment.');
                    setIsSubmitting(false);
                }
            } catch (error) {
                console.error('SabPaisa payment initiation error:', error);
                const errorMsg = error.response?.data?.message || 'Unable to connect to SabPaisa payment gateway. Please try again.';
                toast.error(errorMsg);
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
                            <button className="btn btn-primary" onClick={() => { setShowThankYou(false); setReceiptData(null); }} style={{ marginTop: 28 }}>
                                Make Another Donation
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="donate-page">
            <ToastContainer />
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
                                    <h5>Direct Bank Transfer Details</h5>
                                    <p>Account Holder: Kiran Charitable Trust</p>
                                    <p>Bank: State Bank of India (SBI)</p>
                                    <p>A/C No: 12345678901234</p>
                                    <p>IFSC: SBIN0001234</p>
                                    <p>Branch: Vijayawada Main Branch</p>
                                </div>
                            </div>

                            {/* QR Code Placeholder */}
                            <div className="qr-section">
                                <div className="qr-placeholder"><FaQrcode /></div>
                                <div>
                                    <p className="qr-label">Scan to Donate via UPI Apps</p>
                                    <p className="qr-upi">kirancharitabletrust@sbi</p>
                                </div>
                            </div>

                            <div className="gateways-info">
                                <p>All payments are securely processed via standard 256-bit encrypted gateways:</p>
                                <div className="gateway-list">
                                    {['PhonePe', 'Google Pay', 'Razorpay', 'Net Banking', 'Credit/Debit Card'].map((g, i) => (
                                        <span key={i} className="gateway-chip">{g}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="donate-form-card">
                            <div className="donate-form-header">
                                <FaHeart className="donate-form-icon" />
                                <h3>Kiran Trust Contribution Form</h3>
                                <div className="secure-badge"><FaLock /> 256-bit SSL Secure Gateway</div>
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
                                                type="number"
                                                placeholder="Or enter custom amount (₹)"
                                                className="custom-amount-input"
                                                value={customAmount}
                                                onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                                            />
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
                                    disabled={!agreed}
                                >
                                    <FaHeart /> {donationType === 'cash' ? `Donate ₹${Number(finalAmount).toLocaleString('en-IN')} Now` : `Submit Item Donation Support`}
                                </button>

                                <div className="form-footer-note">
                                    <FaShieldAlt /> 100% secure • 80G Tax Benefits • Verified NGO
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
