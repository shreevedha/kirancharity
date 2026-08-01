import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUserFriends, FaHeart, FaUsers, FaCheckCircle, FaSmile } from 'react-icons/fa'
import { toast } from 'react-toastify'
import seniorImg from '../assets/cause_senior.png'
import './CausePage.css'

const highlights = [
    'Monthly visits to old age homes across Vijayawada',
    'Free medicines and health check-ups for seniors',
    'Festive celebrations — Ugadi, Sankranti, Diwali',
    'Emotional support, companionship & storytelling',
    'Nutrition packs and blankets in winter',
]

const stats = [
    { num: '50+', label: 'Seniors Supported', icon: <FaUserFriends /> },
    { num: '8+', label: 'Support Visits Done', icon: <FaSmile /> },
    { num: '2026', label: 'Est. Year', icon: <FaHeart /> },
]

export default function CauseSeniorCitizens() {
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
        toast.success(`Thank you ${name}! Your senior care donation of ₹${amount} was successful.`)
        setName('')
        setEmail('')
        setPhone('')
    }

    return (
        <div className="cause-page">
            <div className="cause-hero">
                <img src={seniorImg} alt="Senior Citizens Program" className="cause-hero-img" />
                <div className="cause-hero-overlay">
                    <div className="container cause-hero-content">
                        <div className="cause-icon-badge" style={{ background: 'var(--primary)' }}>
                            <FaUserFriends />
                        </div>
                        <p className="cause-tagline">Honoring Our Elders</p>
                        <h1>Senior Citizens Care</h1>
                        <p className="cause-subtitle">
                            Our elders built the world we live in. It's our turn to care for them with love.
                        </p>
                        <div className="cause-hero-btns">
                            <a href="#cause-donate" className="btn btn-primary"><FaHeart /> Support Senior Care</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cause-stats-bar">
                <div className="container cause-stats-inner">
                    {stats.map((s, i) => (
                        <div key={i} className="cause-stat">
                            <span className="cause-stat-icon" style={{ color: 'var(--primary)' }}>{s.icon}</span>
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
                            <p className="tagline-label">Our Senior Care Mission</p>
                            <h2>Every Elder Deserves<br /><span className="gradient-text">Love & Dignity</span></h2>
                            <p>
                                In a rapidly changing world, many senior citizens find themselves lonely, forgotten,
                                or unable to afford basic healthcare. At Kiran Charitable Trust, we believe our elders
                                deserve the same warmth and care they once gave to their families.
                            </p>
                            <div className="cause-highlights">
                                {highlights.map((h, i) => (
                                    <div key={i} className="cause-highlight-item">
                                        <FaCheckCircle style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                        <span>{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cause-side-form-card" id="cause-donate">
                            <h3>Support Senior Citizens</h3>
                            <p className="form-subtext">Funding goes directly to medical aids, blankets and meals</p>
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
                                        placeholder="Enter phone number"
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
