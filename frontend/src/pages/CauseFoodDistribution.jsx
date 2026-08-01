import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUtensils, FaHeart, FaUsers, FaCheckCircle, FaBoxOpen } from 'react-icons/fa'
import { toast } from 'react-toastify'
import foodImg from '../assets/cause_food.png'
import './CausePage.css'

const highlights = [
    '150+ nutritious food boxes distributed per drive',
    'Dry ration support kits for needy families',
    'Festival special food distribution events',
    'Nutrition support for disadvantaged students',
    'Emergency food relief during local emergencies',
]

const stats = [
    { num: '150+', label: 'Meals Distributed', icon: <FaUtensils /> },
    { num: '20+', label: 'Families Supported', icon: <FaBoxOpen /> },
    { num: '2026', label: 'Est. Year', icon: <FaHeart /> },
]

export default function CauseFoodDistribution() {
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
        toast.success(`Thank you ${name}! Your food distribution donation of ₹${amount} was successful.`)
        setName('')
        setEmail('')
        setPhone('')
    }

    return (
        <div className="cause-page">
            <div className="cause-hero">
                <img src={foodImg} alt="Food Distribution Program" className="cause-hero-img" />
                <div className="cause-hero-overlay">
                    <div className="container cause-hero-content">
                        <div className="cause-icon-badge" style={{ background: 'rgba(39,174,96,0.9)' }}>
                            <FaUtensils />
                        </div>
                        <p className="cause-tagline">No One Goes Hungry</p>
                        <h1>Food Distribution</h1>
                        <p className="cause-subtitle">
                            Because every human being deserves a warm, nutritious meal every single day.
                        </p>
                        <div className="cause-hero-btns">
                            <a href="#cause-donate" className="btn btn-primary"><FaHeart /> Support Food Drive</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cause-stats-bar">
                <div className="container cause-stats-inner">
                    {stats.map((s, i) => (
                        <div key={i} className="cause-stat">
                            <span className="cause-stat-icon" style={{ color: '#27AE60' }}>{s.icon}</span>
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
                            <p className="tagline-label">Our Food Mission</p>
                            <h2>Feeding Families,<br /><span className="gradient-text">Restoring Dignity</span></h2>
                            <p>
                                Food insecurity remains one of the most pressing challenges for millions of Indians.
                                At Kiran Charitable Trust, our Food Distribution Program ensures that daily wage workers,
                                homeless individuals, and disaster-affected families never sleep hungry.
                            </p>
                            <div className="cause-highlights">
                                {highlights.map((h, i) => (
                                    <div key={i} className="cause-highlight-item">
                                        <FaCheckCircle style={{ color: '#27AE60', flexShrink: 0 }} />
                                        <span>{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cause-side-form-card" id="cause-donate">
                            <h3>Support Food Distribution</h3>
                            <p className="form-subtext">Funding goes directly for purchasing rice, lentils, oil, and spices</p>
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

                                <button type="submit" className="btn btn-primary cause-submit-btn" style={{ background: '#27AE60' }}>
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
