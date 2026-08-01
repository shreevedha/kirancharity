import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFemale, FaHeart, FaUsers, FaCheckCircle, FaHandHoldingUsd } from 'react-icons/fa'
import { toast } from 'react-toastify'
import womenImg from '../assets/cause_women.png'
import './CausePage.css'

const highlights = [
    'Tailoring, stitching & handicraft skill training',
    'Self-Help Group (SHG) formation & support',
    'Legal rights awareness workshops',
    'Micro-finance & entrepreneurship assistance',
    'Digital literacy programs for women',
]

const stats = [
    { num: '30+', label: 'Women Trained', icon: <FaFemale /> },
    { num: '8+', label: 'Entrepreneurs Created', icon: <FaHandHoldingUsd /> },
    { num: '2026', label: 'Launch Year', icon: <FaHeart /> },
]

export default function CauseWomenEmpowerment() {
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
        toast.success(`Thank you ${name}! Your women empowerment donation of ₹${amount} was successful.`)
        setName('')
        setEmail('')
        setPhone('')
    }

    return (
        <div className="cause-page">
            <div className="cause-hero">
                <img src={womenImg} alt="Women Empowerment Program" className="cause-hero-img" />
                <div className="cause-hero-overlay">
                    <div className="container cause-hero-content">
                        <div className="cause-icon-badge" style={{ background: 'rgba(155,89,182,0.9)' }}>
                            <FaFemale />
                        </div>
                        <p className="cause-tagline">Empowering Every Woman</p>
                        <h1>Women Empowerment</h1>
                        <p className="cause-subtitle">
                            When you empower a woman, you transform a family, a community, and a nation.
                        </p>
                        <div className="cause-hero-btns">
                            <a href="#cause-donate" className="btn btn-primary"><FaHeart /> Support Women Empowerment</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cause-stats-bar">
                <div className="container cause-stats-inner">
                    {stats.map((s, i) => (
                        <div key={i} className="cause-stat">
                            <span className="cause-stat-icon" style={{ color: '#9B59B6' }}>{s.icon}</span>
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
                            <h3>Support Women Empowerment</h3>
                            <p className="form-subtext">Funding goes directly to sewing machines, trainers and setup kits</p>
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

                                <button type="submit" className="btn btn-primary cause-submit-btn" style={{ background: '#9B59B6' }}>
                                    Donate ₹{amount} Now
                                </button>
                            </form>
                        </div>

                        <div className="cause-text">
                            <p className="tagline-label">Our Women's Mission</p>
                            <h2>From Dependent<br /><span className="gradient-text">To Self-Reliant</span></h2>
                            <p>
                                Women's empowerment is at the heart of Kiran Charitable Trust's mission.
                                We believe that economically independent and socially aware women are the
                                foundation of a healthy, progressive society.
                            </p>
                            <div className="cause-highlights">
                                {highlights.map((h, i) => (
                                    <div key={i} className="cause-highlight-item">
                                        <FaCheckCircle style={{ color: '#9B59B6', flexShrink: 0 }} />
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
