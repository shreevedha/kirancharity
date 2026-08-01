import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import {
    FaHeart, FaGraduationCap, FaStethoscope, FaUtensils, FaFemale,
    FaHandsHelping, FaTint, FaPaw, FaUserFriends, FaArrowRight,
    FaCalendarAlt, FaQuoteLeft, FaChevronLeft, FaChevronRight,
    FaStar, FaUsers, FaHospital, FaBook, FaLeaf, FaHome, FaPhone,
    FaEnvelope, FaShieldAlt, FaCheckCircle, FaHandHoldingHeart
} from 'react-icons/fa'
import slide1 from '../assets/Poor_children.png'
import slide2 from '../assets/Food_Distribution.png'
import slide3 from '../assets/medical_camp.png'
import welcomeImg from '../assets/help.png'
import ctaBgImg from '../assets/cta-bg.png'
import galleryHero from '../assets/medical_camp.png'
import galleryHero1 from '../assets/hero1.png'
import galleryHero3 from '../assets/hero3.png'
import imgDonFood1 from '../assets/6370f4a620b583aed909dadf8fb377b0.jpg'
import imgDonEdu1 from '../assets/childrens-home.jpg'
import './Home.css'

/* ─── Hero Slides — Clean Solid Overlay, No Gradients ─── */
const heroSlides = [
    {
        id: 1,
        img: slide1,
        overlay: 'rgba(15, 23, 42, 0.75)',
        icon: <FaGraduationCap />,
        accentColor: '#F59E0B',
        tagline: 'DIRECT FIELD ACTION IN ANDHRA PRADESH',
        heading: 'Empowering Children Through Education',
        subtext: 'Every child deserves books, uniform, and a safe learning environment. We provide direct educational support to rural students in Vijayawada.',
        bgPos: 'center top',
    },
    {
        id: 2,
        img: slide2,
        overlay: 'rgba(15, 23, 42, 0.75)',
        icon: <FaUtensils />,
        accentColor: '#4ADE80',
        tagline: 'NO ONE SLEEPS HUNGRY',
        heading: 'Daily Fresh Meal & Ration Drives',
        subtext: 'Serving fresh cooked meals and dry food kits to daily-wage workers, homeless elders, and struggling families across Vijayawada.',
        bgPos: 'center top',
    },
    {
        id: 3,
        img: slide3,
        overlay: 'rgba(15, 23, 42, 0.75)',
        icon: <FaStethoscope />,
        accentColor: '#60A5FA',
        tagline: 'HEALTHCARE AT THEIR DOORSTEP',
        heading: 'Free Community Health Camps',
        subtext: 'Providing free doctor consultations, diagnostic tests, and essential medicines to underserved rural villages and urban slums.',
        bgPos: 'center top',
    },
]

/* ─── Cause Navigation Tabs ─── */
const causeTabs = [
    { label: 'Education', path: '/causes/education', icon: <FaGraduationCap />, color: 'var(--primary)' },
    { label: 'Healthcare', path: '/causes/healthcare', icon: <FaStethoscope />, color: '#E74C3C' },
    { label: 'Food Distribution', path: '/causes/food-distribution', icon: <FaUtensils />, color: '#27AE60' },
    { label: 'Women Empowerment', path: '/causes/women-empowerment', icon: <FaFemale />, color: '#9B59B6' },
    { label: 'Senior Citizens', path: '/causes/senior-citizens', icon: <FaUserFriends />, color: '#D97706' },
]

/* ─── All 8 Activities ─── */
const activities = [
    { icon: <FaGraduationCap />, title: 'Children Education', desc: 'Scholarships, school bags, and learning supplies for rural children', color: 'var(--primary)', path: '/causes/education' },
    { icon: <FaStethoscope />, title: 'Free Medical Camps', desc: 'Doctor consultations, health check-ups, and medicine distribution', color: '#E74C3C', path: '/causes/healthcare' },
    { icon: <FaUtensils />, title: 'Food & Nutrition', desc: 'Fresh cooked meals & monthly grocery kits for needy families', color: '#27AE60', path: '/causes/food-distribution' },
    { icon: <FaFemale />, title: 'Women Empowerment', desc: 'Vocational skill training & micro-entrepreneurship for women', color: '#9B59B6', path: '/causes/women-empowerment' },
    { icon: <FaHome />, title: 'Disaster Emergency Aid', desc: 'Rapid emergency relief, clothes & kits during natural floods', color: '#E67E22', path: '/causes/disaster-relief' },
    { icon: <FaTint />, title: 'Blood Donation Drives', desc: 'Organizing voluntary blood donation camps to save hospital patients', color: '#C0392B', path: '/causes/blood-donation' },
    { icon: <FaPaw />, title: 'Animal Welfare', desc: 'Feeding, rescue, and veterinary care for stray animals', color: '#16A085', path: '/causes/animal-welfare' },
    { icon: <FaUserFriends />, title: 'Senior Citizen Dignity', desc: 'Companionship, healthcare support, and nutrition for homeless elders', color: '#D97706', path: '/causes/senior-citizens' },
]

const stats = [
    { value: 500, suffix: '+', label: 'Families Supported', icon: <FaHeart /> },
    { value: 50, suffix: '+', label: 'Active Field Volunteers', icon: <FaUsers /> },
    { value: 10, suffix: '+', label: 'Free Medical Camps', icon: <FaHospital /> },
    { value: 150, suffix: '+', label: 'Students Sponsored', icon: <FaBook /> },
]

const latestActivities = [
    {
        title: 'Blood Donation Camp 2026',
        date: 'June 15, 2026',
        desc: 'Organized a major blood donation camp with 60+ voluntary donors in Vijayawada, supplying local blood banks.',
        icon: <FaTint />, color: '#C0392B',
    },
    {
        title: 'Monsoon Ration Relief Drive',
        date: 'July 2, 2026',
        desc: 'Distributed dry ration kits and essential hygiene supplies to 150+ families affected by seasonal flooding.',
        icon: <FaHandsHelping />, color: 'var(--primary)',
    },
    {
        title: 'Free Rural Health Camp',
        date: 'July 20, 2026',
        desc: 'Provided free health check-ups, eye screenings, and medicines to over 200 rural villagers and elderly citizens.',
        icon: <FaStethoscope />, color: '#E74C3C',
    },
]

const testimonials = [
    {
        quote: "Kiran Charitable Trust provides direct, genuine help to children in our village. Receiving notebooks and uniforms brought immense joy to my daughter.",
        name: "Lakshmi Devi",
        role: "Parent & Community Member",
        rating: 5
    },
    {
        quote: "Volunteering with Kiran Trust in Vijayawada medical camps has been a deeply fulfilling experience. You see the direct smile on elderly patients' faces.",
        name: "Dr. Suresh Kumar",
        role: "Volunteer Physician",
        rating: 5
    },
    {
        quote: "Knowing my monthly donation goes 100% directly to buying food rations for struggling families gives me complete confidence in their transparency.",
        name: "Ramesh Reddy",
        role: "Regular Donor",
        rating: 5
    }
]

const sponsors = ["80G Certified", "12A Approved", "Regd. NGO AP", "100% Transparent", "Vijayawada Based"]

function SafeCountUp({ end, duration = 2.5 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const endVal = parseInt(end, 10);
        if (start === endVal) return;

        let startTime = null;
        let animationFrameId;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * (endVal - start) + start));
            if (progress < 1) {
                animationFrameId = window.requestAnimationFrame(step);
            }
        };

        animationFrameId = window.requestAnimationFrame(step);
        return () => {
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
}

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true })
    const intervalRef = useRef(null)

    const startTimer = () => {
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroSlides.length)
        }, 8000)
    }

    useEffect(() => { startTimer(); return () => clearInterval(intervalRef.current) }, [])

    const goToSlide = (idx) => { setCurrentSlide(idx); startTimer() }
    const prevSlide = () => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)
    const nextSlide = () => goToSlide((currentSlide + 1) % heroSlides.length)
    const prevTestimonial = () => setCurrentTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)
    const nextTestimonial = () => setCurrentTestimonial(p => (p + 1) % testimonials.length)

    const slide = heroSlides[currentSlide]

    return (
        <div className="home-page">

            {/* ══════════════════════════════════
                HERO SECTION — Humanized Banner
            ══════════════════════════════════ */}
            <section className="hero-section">
                {heroSlides.map((s, i) => (
                    <div
                        key={s.id}
                        className={`hero-bg-layer ${i === currentSlide ? 'active' : ''}`}
                        style={{
                            backgroundImage: `url(${s.img})`,
                            backgroundPosition: s.bgPos || 'center'
                        }}
                    />
                ))}
                <div className="hero-overlay" style={{ background: slide.overlay }} />

                <div className="hero-content container" key={currentSlide}>
                    <div className="hero-icon-badge" style={{ color: slide.accentColor }}>
                        {slide.icon}
                    </div>
                    <p className="hero-tagline" style={{ color: slide.accentColor }}>{slide.tagline}</p>
                    <h1 className="hero-heading">{slide.heading}</h1>
                    <p className="hero-subtext">{slide.subtext}</p>

                    {/* Cause Navigation Buttons */}
                    <div className="hero-cause-btns">
                        {causeTabs.map(cause => (
                            <Link
                                key={cause.path}
                                to={cause.path}
                                className="cause-nav-btn"
                                style={{ '--btn-color': cause.color }}
                            >
                                <span className="cause-nav-icon">{cause.icon}</span>
                                {cause.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hero-action-btns">
                        <Link to="/donate" className="btn btn-primary">
                            <FaHeart /> Donate Now
                        </Link>
                        <Link to="/careers" className="btn btn-secondary">
                            <FaUsers /> Join as Volunteer
                        </Link>
                    </div>
                </div>

                {/* Arrows */}
                <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide"><FaChevronLeft /></button>
                <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide"><FaChevronRight /></button>

                {/* Dot indicators */}
                <div className="hero-indicators">
                    {heroSlides.map((_, i) => (
                        <button
                            key={i}
                            className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════
                HUMANIZED TRUST & TRANSPARENCY BAR
            ══════════════════════════════════ */}
            <div className="trust-strip">
                <div className="container trust-strip-inner">
                    <div className="trust-item">
                        <FaShieldAlt className="trust-icon" />
                        <div>
                            <strong>80G & 12A Certified</strong>
                            <span>50% Tax Deduction Receipt Included</span>
                        </div>
                    </div>
                    <div className="trust-item">
                        <FaCheckCircle className="trust-icon" />
                        <div>
                            <strong>100% Direct Allocation</strong>
                            <span>Your donation reaches ground beneficiaries</span>
                        </div>
                    </div>
                    <div className="trust-item">
                        <FaHandHoldingHeart className="trust-icon" />
                        <div>
                            <strong>Vijayawada Registered NGO</strong>
                            <span>Serving local AP communities since 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════
                WELCOME / FOUNDER PHILOSOPHY SECTION
            ══════════════════════════════════ */}
            <section className="welcome-section section-padding">
                <div className="container">
                    <div className="welcome-grid">
                        <div className="welcome-text">
                            <p className="tagline-label">Our Story & Philosophy</p>
                            <h2>Driven by Compassion,<br /><span className="gradient-text">Grounded in Action</span></h2>
                            <p className="welcome-para">
                                Founded by Chairman <strong>Pallepogu Kiranbabu</strong> in Vijayawada, Kiran Charitable Trust was born from a personal vision: to ensure that no child goes without schooling, no family goes to bed hungry, and no elderly person suffers without medical care.
                            </p>
                            <p className="welcome-para">
                                Working side-by-side with local volunteers, medical professionals, and community leaders across Andhra Pradesh, our mission is to deliver direct, tangible assistance with complete financial transparency.
                            </p>
                            <div className="welcome-badges">
                                <div className="badge"><FaCheckCircle /> 80G Tax Exemption</div>
                                <div className="badge"><FaHandsHelping /> Direct Field Service</div>
                                <div className="badge"><FaHeart /> 100% Transparent</div>
                            </div>
                            <Link to="/about" className="btn btn-primary">
                                Read Our Full Story <FaArrowRight />
                            </Link>
                        </div>
                        <div className="welcome-right">
                            <div className="welcome-image-card">
                                <img src={welcomeImg} alt="Kiran Charitable Trust Field Support" className="welcome-real-img" />
                            </div>
                            <div className="vision-mission-cards">
                                <div className="vm-card vision">
                                    <div className="vm-icon"><FaStar /></div>
                                    <div><h4>Our Vision</h4><p>An Inclusive, Dignified Society</p></div>
                                </div>
                                <div className="vm-card mission">
                                    <div className="vm-icon"><FaHeart /></div>
                                    <div><h4>Our Mission</h4><p>Direct Community Service</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
                HUMANIZED DONATION IMPACT CALCULATOR
            ══════════════════════════════════ */}
            <section className="impact-tiers-section section-padding" style={{ background: '#FFF8F5' }}>
                <div className="container">
                    <div className="section-title">
                        <p className="tagline">How Your Contribution Helps</p>
                        <h2>Where Your Donation Goes</h2>
                        <p>Every rupee creates a direct, measurable impact in a real human life</p>
                        <div className="title-underline"><span /><span /><span /></div>
                    </div>
                    <div className="impact-tiers-grid">
                        <div className="impact-tier-card">
                            <div className="tier-amount">₹500</div>
                            <h3>10 Warm Meals</h3>
                            <p>Feeds 10 hungry children or homeless elders cooked fresh meals.</p>
                            <Link to="/donate?amount=500" className="tier-btn">Sponsor Meals <FaArrowRight /></Link>
                        </div>
                        <div className="impact-tier-card featured">
                            <div className="tier-badge">Most Popular</div>
                            <div className="tier-amount">₹1,000</div>
                            <h3>School Kit & Books</h3>
                            <p>Provides a school bag, notebooks, and stationery for 2 rural students.</p>
                            <Link to="/donate?amount=1000" className="tier-btn btn-primary">Sponsor Education <FaArrowRight /></Link>
                        </div>
                        <div className="impact-tier-card">
                            <div className="tier-amount">₹2,500</div>
                            <h3>Elderly Healthcare</h3>
                            <p>Covers health check-ups & medicines for 5 senior citizens for a month.</p>
                            <Link to="/donate?amount=2500" className="tier-btn">Sponsor Healthcare <FaArrowRight /></Link>
                        </div>
                        <div className="impact-tier-card">
                            <div className="tier-amount">₹5,000</div>
                            <h3>Family Ration Kit</h3>
                            <p>Provides a 1-month dry grocery & essential kit for a needy family.</p>
                            <Link to="/donate?amount=5000" className="tier-btn">Sponsor Ration <FaArrowRight /></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
                WHAT WE DO — Field Programs
            ══════════════════════════════════ */}
            <section className="activities-section section-padding">
                <div className="container">
                    <div className="section-title">
                        <p className="tagline">Ground Initiatives</p>
                        <h2>Our Core Programs</h2>
                        <p>Dedicated humanitarian work reaching marginalized communities across Vijayawada</p>
                        <div className="title-underline"><span /><span /><span /></div>
                    </div>
                    <div className="activities-grid-home">
                        {activities.map((act, i) => (
                            <Link key={i} to={act.path} className="activity-card-home" style={{ '--card-color': act.color }}>
                                <div className="activity-icon-home" style={{ background: act.color + '15', color: act.color }}>
                                    {act.icon}
                                </div>
                                <h3>{act.title}</h3>
                                <p>{act.desc}</p>
                                <div className="activity-learn-more" style={{ color: act.color }}>
                                    View Program Details <FaArrowRight />
                                </div>
                                <div className="activity-hover-bar" style={{ background: act.color }} />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
                STATS SECTION — Light & Clean
            ══════════════════════════════════ */}
            <section className="stats-section" ref={statsRef}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="section-title" style={{ marginBottom: '40px' }}>
                        <p className="tagline">Real Impact</p>
                        <h2>Field Action Numbers</h2>
                    </div>
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-icon">{stat.icon}</div>
                                <div className="stat-number">
                                    {statsInView ? <SafeCountUp end={stat.value} duration={2.5} /> : '0'}
                                    {stat.suffix}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
                LATEST FIELD ACTIVITIES
            ══════════════════════════════════ */}
            <section className="latest-section section-padding">
                <div className="container">
                    <div className="section-title">
                        <p className="tagline">Recent Field Work</p>
                        <h2>Latest Community Drives</h2>
                        <p>Explore our latest on-ground campaigns in Andhra Pradesh</p>
                        <div className="title-underline"><span /><span /><span /></div>
                    </div>
                    <div className="latest-grid">
                        {latestActivities.map((act, i) => (
                            <div key={i} className="latest-card card">
                                <div className="latest-card-top" style={{ background: act.color + '15', borderBottom: `3px solid ${act.color}` }}>
                                    <div className="latest-icon" style={{ background: act.color, color: 'white' }}>{act.icon}</div>
                                    <div className="latest-date"><FaCalendarAlt /> {act.date}</div>
                                </div>
                                <div className="latest-card-body">
                                    <h3>{act.title}</h3>
                                    <p>{act.desc}</p>
                                    <Link to="/activities" className="read-more-btn">Read Full Story <FaArrowRight /></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
                FEATURED GALLERY
            ══════════════════════════════════ */}
            <section className="featured-gallery-section section-padding" style={{ background: 'var(--bg-white)' }}>
                <div className="container">
                    <div className="section-title">
                        <p className="tagline">Ground Photos</p>
                        <h2>Field Action Gallery</h2>
                        <p>Real photos captured during our food distribution, medical camps, and school drives</p>
                        <div className="title-underline"><span /><span /><span /></div>
                    </div>
                    <div className="featured-gallery-grid">
                        <div className="fg-card">
                            <div className="fg-img-wrap">
                                <img src={galleryHero} alt="Community Medical Check-up Camp" className="fg-img" />
                            </div>
                            <div className="fg-info">
                                <h4>Medical & Diagnostic Camp</h4>
                                <p>Reaching rural families with free doctor consultations and medicine kits in AP.</p>
                            </div>
                        </div>
                        <div className="fg-card">
                            <div className="fg-img-wrap">
                                <img src={imgDonFood1} alt="Daily Hot Meal & Ration Drive" className="fg-img" />
                            </div>
                            <div className="fg-info">
                                <h4>Daily Hot Meal & Ration Drive</h4>
                                <p>Providing fresh meals and monthly grocery support to struggling families.</p>
                            </div>
                        </div>
                        <div className="fg-card">
                            <div className="fg-img-wrap">
                                <img src={imgDonEdu1} alt="Children Education & Care Support" className="fg-img" />
                            </div>
                            <div className="fg-info">
                                <h4>Children Education & Care Support</h4>
                                <p>Distributing notebooks, bags, and writing kits for rural primary students.</p>
                            </div>
                        </div>
                    </div>
                    <div className="view-all-wrap" style={{ marginTop: '40px' }}>
                        <Link to="/gallery" className="btn btn-primary">
                            View Full Photo Gallery
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
                COMMUNITY TESTIMONIALS
            ══════════════════════════════════ */}
            <section className="testimonials-section section-padding">
                <div className="container">
                    <div className="section-title">
                        <p className="tagline">Community Trust</p>
                        <h2>What People Say</h2>
                        <p>Feedback from local citizens, volunteers, and beneficiaries in Andhra Pradesh</p>
                        <div className="title-underline"><span /><span /><span /></div>
                    </div>
                    <div className="testimonial-slider">
                        <button className="test-arrow test-arrow-left" onClick={prevTestimonial} aria-label="Prev"><FaChevronLeft /></button>
                        <div className="testimonial-card">
                            <FaQuoteLeft className="quote-icon" />
                            <p className="testimonial-text">{testimonials[currentTestimonial].quote}</p>
                            <div className="testimonial-stars">
                                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => <FaStar key={i} />)}
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">{testimonials[currentTestimonial].name[0]}</div>
                                <div>
                                    <strong>{testimonials[currentTestimonial].name}</strong>
                                    <span>{testimonials[currentTestimonial].role}</span>
                                </div>
                            </div>
                        </div>
                        <button className="test-arrow test-arrow-right" onClick={nextTestimonial} aria-label="Next"><FaChevronRight /></button>
                    </div>
                    <div className="test-dots">
                        {testimonials.map((_, i) => (
                            <button key={i} className={`test-dot ${i === currentTestimonial ? 'active' : ''}`} onClick={() => setCurrentTestimonial(i)} aria-label={`Testimonial ${i + 1}`} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
                CALL TO ACTION
            ══════════════════════════════════ */}
            <section className="cta-section">
                <div className="cta-bg-image" style={{ backgroundImage: `url(${ctaBgImg})` }} />
                <div className="cta-overlay" />
                <div className="container cta-content">
                    <p className="cta-tagline">Make a Direct Impact Today</p>
                    <h2>Together We Can Build a Dignified Future</h2>
                    <p>Your contribution directly provides food, medical care, and education to children and families across Andhra Pradesh. All donations are 80G tax deductible.</p>
                    <div className="cta-btns">
                        <Link to="/donate" className="btn btn-primary"><FaHeart /> Make a Donation</Link>
                        <Link to="/careers" className="btn btn-secondary"><FaUsers /> Join as Volunteer</Link>
                    </div>
                </div>
            </section>

        </div>
    )
}
