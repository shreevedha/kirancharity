import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTint, FaHeart, FaUsers, FaCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import bloodImg from '../assets/gallery_health.png'
import './CausePage.css'

const highlights = [
    'In collaboration with top government blood blocks',
    'Safest donation camps using sterile certified setup',
    'Free health reports provided to donors after test',
    '24/7 blood support hotline for emergencies',
    'Units collected and delivered to local blood banks',
]

const stats = [
    { num: '2+', label: 'Camps Organized', icon: <FaTint /> },
    { num: '80+', label: 'Units Contributed', icon: <FaHeart /> },
    { num: '50+', label: 'Registered Donors', icon: <FaUsers /> },
]

export default function CauseBloodDonation() {
    const [amount, setAmount] = useState('1000')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    const handleDonate = (e) => {
        e.preventDefault()
        if (!name || !email || !phone) {
            toast.error('Please input details.')
            return
        }
        toast.success(`Thank you ${name}! Your blood drive donation of ₹${amount} was successful.`)
        setName('')
        setEmail('')
        setPhone('')
    }

    return (
        <div className="cause-page">
            <div className="cause-hero">
                <img src={bloodImg} alt="Blood Donation Program" className="cause-hero-img" />
                <div className="cause-hero-overlay">
                    <div className="container cause-hero-content">
                        <div className="cause-icon-badge" style={{ background: 'rgba(192,57,43,0.9)' }}>
                            <FaTint />
                        </div>
                        <p className="cause-tagline">Save Lives Today</p>
                        <h1>Blood Donation</h1>
                        <p className="cause-subtitle">
                            Your gift of blood is the gift of life. Join our drives to save lives.
                        </p>
                        <div className="cause-hero-btns">
                            <a href="#cause-donate" className="btn btn-primary"><FaHeart /> Support Blood Drives</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cause-stats-bar">
                <div className="container cause-stats-inner">
                    {stats.map((s, i) => (
                        <div key={i} className="cause-stat">
                            <span className="cause-stat-icon" style={{ color: '#C0392B' }}>{s.icon}</span>
                            <span className="cause-stat-num">{s.num}</span>
                            <span className="cause-stat-lbl">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <section className="section-padding">
                <div className="container">
                    <div className="cause-content-grid reverse">
                        <div className="cause-side-form-card" id="cause-donate">
                            <h3>Support Blood Donation Drives</h3>
                            <p className="form-subtext">Funding helps buy camps, kits, snacks, and medical support</p>
                            <form onSubmit={handleDonate}>
                                <div className="amt-options">
                                    {['500', '1000', '2000', '5000'].map(val => (
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
                                        placeholder="Custom (₹)"
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
                                        placeholder="Enter name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group-cause">
                                    <label>Email ID</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter email ID"
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

                                <button type="submit" className="btn btn-primary cause-submit-btn" style={{ background: '#C0392B' }}>
                                    Donate ₹{amount} Now
                                </button>
                            </form>
                        </div>

                        <div className="cause-text">
                            <p className="tagline-label">Gift of Life</p>
                            <h2>One Unit of Blood<br /><span className="gradient-text">Can Save Three Lives</span></h2>
                            <p>
                                Every second, someone somewhere in India needs blood. For accident victims, surgical patients, and
                                cancer treatments, timely access to blood is critical.
                            </p>
                            <p>
                                Kiran Charitable Trust works year-round to organize donor camps, awareness campaigns, and safe donation
                                drives. Our partnerships with key hospitals ensure donor blood matches direct needs immediately.
                            </p>
                            <div className="cause-highlights">
                                {highlights.map((h, i) => (
                                    <div key={i} className="cause-highlight-item">
                                        <FaCheckCircle style={{ color: '#C0392B', flexShrink: 0 }} />
                                        <span>{h}</span>
                                    </div>
                                ))}
                            </div>
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
