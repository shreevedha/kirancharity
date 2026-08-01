import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStethoscope, FaHeart, FaUsers, FaCheckCircle, FaHospital } from 'react-icons/fa'
import { toast } from 'react-toastify'
import healthcareImg from '../assets/cause_healthcare.png'
import './CausePage.css'

const highlights = [
    'Free OPD with specialist doctors every quarter',
    'Free medicines, diagnostics & lab tests',
    'Eye check-up camps with free spectacles',
    'Dental camps for children and adults',
    'Blood pressure, diabetes & cancer screenings',
]

const stats = [
    { num: '10+', label: 'Medical Camps', icon: <FaHospital /> },
    { num: '300+', label: 'Patients Served', icon: <FaUsers /> },
    { num: '2026', label: 'Est. Year', icon: <FaHeart /> },
]

export default function CauseHealthcare() {
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
        toast.success(`Thank you ${name}! Your healthcare donation of ₹${amount} was successful.`)
        setName('')
        setEmail('')
        setPhone('')
    }

    return (
        <div className="cause-page">
            <div className="cause-hero">
                <img src={healthcareImg} alt="Healthcare Program" className="cause-hero-img" />
                <div className="cause-hero-overlay">
                    <div className="container cause-hero-content">
                        <div className="cause-icon-badge" style={{ background: 'rgba(231,76,60,0.9)' }}>
                            <FaStethoscope />
                        </div>
                        <p className="cause-tagline">Healthcare for All</p>
                        <h1>Free Medical Camps</h1>
                        <p className="cause-subtitle">
                            Quality healthcare is a right, not a privilege. We bring it to every doorstep.
                        </p>
                        <div className="cause-hero-btns">
                            <a href="#cause-donate" className="btn btn-primary"><FaHeart /> Support Medical Camps</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cause-stats-bar">
                <div className="container cause-stats-inner">
                    {stats.map((s, i) => (
                        <div key={i} className="cause-stat">
                            <span className="cause-stat-icon" style={{ color: '#E74C3C' }}>{s.icon}</span>
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
                            <h3>Support Healthcare Program</h3>
                            <p className="form-subtext">Funding is used for medical kits, specialized setup and medicine bills</p>
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

                                <button type="submit" className="btn btn-primary cause-submit-btn" style={{ background: '#E74C3C' }}>
                                    Donate ₹{amount} Now
                                </button>
                            </form>
                        </div>

                        <div className="cause-text">
                            <p className="tagline-label">Our Healthcare Mission</p>
                            <h2>Healthcare That<br /><span className="gradient-text">Reaches Everyone</span></h2>
                            <p>
                                Millions of rural and urban poor in India lack access to affordable healthcare.
                                Our free medical camps bridge this gap by bringing qualified doctors, medicines,
                                and modern diagnostic equipment directly to underserved communities.
                            </p>
                            <div className="cause-highlights">
                                {highlights.map((h, i) => (
                                    <div key={i} className="cause-highlight-item">
                                        <FaCheckCircle style={{ color: '#E74C3C', flexShrink: 0 }} />
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
