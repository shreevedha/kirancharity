import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPaw, FaHeart, FaUsers, FaCheckCircle, FaClinicMedical } from 'react-icons/fa'
import { toast } from 'react-toastify'
import animalImg from '../assets/gallery_animal.png'
import './CausePage.css'

const highlights = [
    'Free treatment & ambulance service for stray animals',
    'Weekly stray feeding and water bowl distribution',
    'Anti-rabies and multi-disease vaccination drives',
    'Safe adoption program for stray puppies & kittens',
    'Rescue operations for injured animals',
]

const stats = [
    { num: '20+', label: 'Animals Rescued', icon: <FaPaw /> },
    { num: '2+', label: 'Local Vets Assisted', icon: <FaClinicMedical /> },
    { num: '2026', label: 'Est. Year', icon: <FaHeart /> },
]

export default function CauseAnimalWelfare() {
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
        toast.success(`Thank you ${name}! Your animal welfare donation of ₹${amount} was successful.`)
        setName('')
        setEmail('')
        setPhone('')
    }

    return (
        <div className="cause-page">
            <div className="cause-hero">
                <img src={animalImg} alt="Animal Welfare Program" className="cause-hero-img" />
                <div className="cause-hero-overlay">
                    <div className="container cause-hero-content">
                        <div className="cause-icon-badge" style={{ background: 'rgba(22,160,133,0.9)' }}>
                            <FaPaw />
                        </div>
                        <p className="cause-tagline">Compassion For Strays</p>
                        <h1>Animal Welfare</h1>
                        <p className="cause-subtitle">
                            Giving a voice, food, shelter and medical care to stray animals in need.
                        </p>
                        <div className="cause-hero-btns">
                            <a href="#cause-donate" className="btn btn-primary"><FaHeart /> Support Animal Welfare</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cause-stats-bar">
                <div className="container cause-stats-inner">
                    {stats.map((s, i) => (
                        <div key={i} className="cause-stat">
                            <span className="cause-stat-icon" style={{ color: '#16A085' }}>{s.icon}</span>
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
                            <p className="tagline-label">Compassion in Action</p>
                            <h2>Advocating for the<br /><span className="gradient-text">Voices of Strays</span></h2>
                            <p>
                                Thousands of stray dogs, cats, and cows survive on street garbage across our cities.
                                Our animal welfare program ensures they receive daily nourishment, vital vaccines,
                                and urgent medical treatments for injuries or trauma.
                            </p>
                            <p>
                                We run vaccination drives monthly to create safe communities for animals and residents.
                                Our team distributes clay water bowls during warm summer months to prevent dehydration.
                            </p>
                            <div className="cause-highlights">
                                {highlights.map((h, i) => (
                                    <div key={i} className="cause-highlight-item">
                                        <FaCheckCircle style={{ color: '#16A085', flexShrink: 0 }} />
                                        <span>{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cause-side-form-card" id="cause-donate">
                            <h3>Support Animal Welfare</h3>
                            <p className="form-subtext">Funding goes directly to medical aids, surgery and meals</p>
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

                                <button type="submit" className="btn btn-primary cause-submit-btn" style={{ background: '#16A085' }}>
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
