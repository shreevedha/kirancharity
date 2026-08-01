import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaHeart, FaUsers, FaArrowRight, FaCheckCircle, FaBiohazard, FaHandHoldingHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'
import disasterImg from '../assets/cause_disaster.png'
import './CausePage.css'

const highlights = [
    'Immediate dry ration kits and clean water bottles',
    'Temporary shelters and blanket distribution',
    'Medical relief camps post-disasters',
    'Rehabilitation of families and rebuilding homes',
    'Funding crop seeds for disaster-affected farmers',
    'Life-saving rescue kits and gear for local units',
]

const stats = [
    { num: '2+', label: 'Relief Projects', icon: <FaBiohazard /> },
    { num: '100+', label: 'Relief Kits Sent', icon: <FaHome /> },
    { num: '2026', label: 'Est. Year', icon: <FaHandHoldingHeart /> },
]

export default function CauseDisasterRelief() {
    const [amount, setAmount] = useState('1000')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    const handleDonate = (e) => {
        e.preventDefault()
        if (!name || !email || !phone) {
            toast.error('Please fill in all field details.')
            return
        }
        toast.success(`Thank you ${name}! Your disaster relief donation of ₹${amount} is simulation successful.`)
        setName('')
        setEmail('')
        setPhone('')
    }

    return (
        <div className="cause-page">
            <div className="cause-hero">
                <img src={disasterImg} alt="Disaster Relief Program" className="cause-hero-img" />
                <div className="cause-hero-overlay">
                    <div className="container cause-hero-content">
                        <div className="cause-icon-badge" style={{ background: 'rgba(230,126,34,0.9)' }}>
                            <FaHome />
                        </div>
                        <p className="cause-tagline">Emergency Assistance</p>
                        <h1>Disaster Relief</h1>
                        <p className="cause-subtitle">
                            Reaching out to rebuild lives in the wake of natural disasters. Compassion in action.
                        </p>
                        <div className="cause-hero-btns">
                            <a href="#cause-donate" className="btn btn-primary"><FaHeart /> Donate for Relief Now</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cause-stats-bar">
                <div className="container cause-stats-inner">
                    {stats.map((s, i) => (
                        <div key={i} className="cause-stat">
                            <span className="cause-stat-icon" style={{ color: '#E67E22' }}>{s.icon}</span>
                            <span className="cause-stat-num">{s.num}</span>
                            <span className="cause-stat-lbl">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <section className="section-padding">
                <div className="container">
                    <div className="cause-content-grid">
                        <div className="cause-text">
                            <p className="tagline-label">Our Relief Program</p>
                            <h2>Standing Strong with<br /><span className="gradient-text">Communities in Crisis</span></h2>
                            <p>
                                When disaster strikes, basic resources are cut off instantly. Our relief team responds
                                within 24 hours to supply critical food bundles, sanitary kits, and medicine to the worst-hit villages.
                            </p>
                            <p>
                                In addition to instant relief, Kiran Charitable Trust remains involved in the long-term
                                recovery of affected families, funding the replacement of damaged housing structures and livelihood aids.
                            </p>
                            <div className="cause-highlights">
                                {highlights.map((h, i) => (
                                    <div key={i} className="cause-highlight-item">
                                        <FaCheckCircle style={{ color: '#E67E22', flexShrink: 0 }} />
                                        <span>{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sticky/Embedded Donation Form as requested by user */}
                        <div className="cause-side-form-card" id="cause-donate">
                            <h3>Support Disaster Relief</h3>
                            <p className="form-subtext">Tax Benifit 80G Certified donation</p>
                            <form onSubmit={handleDonate}>
                                <div className="amt-options">
                                    {['500', '1000', '2500', '5000'].map(val => (
                                        <button
                                            key={val}
                                            type="button"
                                            className={`amt-opt-btn ${amount === val ? 'active' : ''}`}
                                            onClick={() => setAmount(val)}
                                        >
                                            ₹{val}
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        placeholder="Custom Amt (₹)"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="custom-amt-input"
                                    />
                                </div>

                                <div className="form-group-cause">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group-cause">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group-cause">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Enter 10-digit number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary cause-submit-btn">
                                    Donate ₹{amount} Now
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="cause-breadcrumb-nav">
                        <Link to="/">← Back to Home</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
