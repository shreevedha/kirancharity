import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import {
    FaHeart, FaGraduationCap, FaStethoscope, FaUtensils, FaFemale,
    FaHandsHelping, FaTint, FaPaw, FaUserFriends, FaArrowRight,
    FaCalendarAlt, FaQuoteLeft, FaChevronLeft, FaChevronRight,
    FaStar, FaUsers, FaHospital, FaBook, FaLeaf, FaHome, FaPhone,
    FaEnvelope, FaShieldAlt
} from 'react-icons/fa'
import slide1 from '../assets/Poor_children.png'
import slide2 from '../assets/Food_Distribution.png'
import slide3 from '../assets/medical_camp.png'
import welcomeImg from '../assets/help.png'
import ctaBgImg from '../assets/cta-bg.png'
import galleryHero from '../assets/medical_camp.png'
import galleryHero1 from '../assets/hero1.png'
import galleryHero3 from '../assets/hero3.png'
import './Home.css'

/* ─── Hero Slides ─── */
const heroSlides = [
    {
        id: 1,
        img: slide1,
        overlay: 'linear-gradient(120deg, rgba(26,26,46,0.85) 0%, rgba(255,107,53,0.5) 100%)',
        icon: <FaGraduationCap />,
        accentColor: '#FFD700',
        tagline: 'Brighter Futures',
        heading: 'Helping Poor Children',
        subtext: 'Every child deserves quality education and a chance to grow. Join us in transforming lives through learning.',
        bgPos: 'center 15%',
    },
    {
        id: 2,
        img: slide2,
        overlay: 'linear-gradient(120deg, rgba(26,46,26,0.85) 0%, rgba(39,174,96,0.5) 100%)',
        icon: <FaUtensils />,
        accentColor: '#4ade80',
        tagline: 'No One Hungry',
        heading: 'Food Distribution',
        subtext: 'Feeding thousands of underprivileged families every month. Because hunger should never stand in the way of dignity.',
        bgPos: 'center 20%',
    },
    {
        id: 3,
        img: slide3,
        overlay: 'linear-gradient(120deg, rgba(26,26,46,0.85) 0%, rgba(52,152,219,0.5) 100%)',
        icon: <FaStethoscope />,
        accentColor: '#7dd3fc',
        tagline: 'Healthcare for All',
        heading: 'Free Medical Camps',
        subtext: 'Free health check-ups, medicines, and consultations reaching the most remote communities across Andhra Pradesh.',
        bgPos: 'center 25%',
    },
]

/* ─── Cause Navigation Buttons ─── */
const causeTabs = [
    { label: 'Education', path: '/causes/education', icon: <FaGraduationCap />, color: 'var(--primary)' },
    { label: 'Healthcare', path: '/causes/healthcare', icon: <FaStethoscope />, color: '#E74C3C' },
    { label: 'Food Distribution', path: '/causes/food-distribution', icon: <FaUtensils />, color: '#27AE60' },
    { label: 'Women Empowerment', path: '/causes/women-empowerment', icon: <FaFemale />, color: '#9B59B6' },
    { label: 'Senior Citizens', path: '/causes/senior-citizens', icon: <FaUserFriends />, color: '#D97706' },
]

/* ─── All 8 Activities - configured to link to their dedicated pages with info & forms ─── */
const activities = [
    { icon: <FaGraduationCap />, title: 'Education', desc: 'Scholarships and school supplies for underprivileged students', color: 'var(--primary)', path: '/causes/education' },
    { icon: <FaStethoscope />, title: 'Medical Camps', desc: 'Free health check-ups and medicine distribution', color: '#E74C3C', path: '/causes/healthcare' },
    { icon: <FaUtensils />, title: 'Food Distribution', desc: 'Daily meals for hundreds of needy families', color: '#27AE60', path: '/causes/food-distribution' },
    { icon: <FaFemale />, title: 'Women Empowerment', desc: 'Skill training and self-help groups for women', color: '#9B59B6', path: '/causes/women-empowerment' },
    { icon: <FaHome />, title: 'Disaster Relief', desc: 'Emergency aid and rehabilitation during disasters', color: '#E67E22', path: '/causes/disaster-relief' },
    { icon: <FaTint />, title: 'Blood Donation', desc: 'Organizing blood donation camps to save lives', color: '#C0392B', path: '/causes/blood-donation' },
    { icon: <FaPaw />, title: 'Animal Welfare', desc: 'Rescue, treatment and care for stray animals', color: '#16A085', path: '/causes/animal-welfare' },
    { icon: <FaUserFriends />, title: 'Old Age Support', desc: 'Companionship and care for senior citizens', color: '#D97706', path: '/causes/senior-citizens' },
]

const stats = [
    { value: 500, suffix: '+', label: 'People Helped', icon: <FaHeart /> },
    { value: 50, suffix: '+', label: 'Active Volunteers', icon: <FaUsers /> },
    { value: 10, suffix: '+', label: 'Medical Camps', icon: <FaHospital /> },
    { value: 150, suffix: '+', label: 'Students Supported', icon: <FaBook /> },
]

const latestActivities = [
    {
        title: 'Blood Donation Camp 2026',
        date: 'June 15, 2026',
        desc: 'Successfully organized our first major blood donation camp with 60+ donors in Vijayawada. Lives were saved and community came together.',
        icon: <FaTint />, color: '#C0392B',
    },
    {
        title: 'Monsoon Relief Distribution',
        date: 'July 2, 2026',
        desc: 'Distributed dry rations and essential kits to 150+ families affected by seasonal rains and waterlogging.',
        icon: <FaHandsHelping />, color: 'var(--primary)',
    },
    {
        title: 'Free Medical Check-up Camp',
        date: 'May 10, 2026',
        desc: 'Partnered with local doctors to provide free health check-ups and medicines to 200+ underprivileged families.',
        icon: <FaStethoscope />, color: '#27AE60',
    },
]

const testimonials = [
    {
        name: 'Priya Sharma', role: 'Volunteer',
        text: 'Joining Kiran Charitable Trust was the best decision of my year. The impact we create together is truly transformational. Every weekend spent here fills my heart with purpose.',
        rating: 5,
    },
    {
        name: 'K. Srinivasa Prasad', role: 'Donor',
        text: 'I have been donating to Kiran Trust since their launch. The transparency and accountability is commendable. I can see my money creating real change in people\'s lives.',
        rating: 5,
    },
    {
        name: 'Savita Devi', role: 'Beneficiary',
        text: 'Kiran Trust gave my children the education support we could never afford. Now my children attend school regularly with proper supplies. I am forever grateful.',
        rating: 5,
    },
]

const sponsors = [
    'TechCorp India', 'Sunrise Foundation', 'GreenLeaf NGO', 'Hope Industries',
    'United Charities', 'Global Impact', 'Care Foundation', 'Vision Trust',
]

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
        }, 10000)
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
          HERO SECTION — Real Slide Images
      ══════════════════════════════════ */}
            <section className="hero-section">
                {/* Background images stacked, fade between them */}
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
                {/* Gradient overlay */}
                <div className="hero-overlay" style={{ background: slide.overlay }} />

                {/* Content */}
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
                            <FaUsers /> Become Volunteer
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

                {/* Scroll hint */}
                <div className="hero-scroll-hint">
                    <div className="scroll-mouse"><div className="scroll-wheel" /></div>
                    <span>Scroll Down</span>
                </div>
            </section>

            {/* ══════════════════════════════════
          WELCOME SECTION — Now with real image welcomeImg
      ══════════════════════════════════ */}
            <section className="welcome-section section-padding">
                <div className="container">
                    <div className="welcome-grid">
                        <div className="welcome-text">
                            <p className="tagline-label">Our Story</p>
                            <h2>Welcome to<br /><span className="gradient-text">Kiran Charitable Trust</span></h2>
                            <p className="welcome-para">
                                Established in 2026, Kiran Charitable Trust has been a beacon of hope for the most
                                vulnerable sections of society. We believe that compassion, when channeled through
                                dedicated action, can transform lives and build a more equitable world.
                            </p>
                            <p className="welcome-para">
                                Through our campaigns, we are working to support communities across Andhra Pradesh — through
                                education, healthcare, food security, and social justice. Every rupee donated is
                                utilized with complete transparency and accountability.
                            </p>
                            <div className="welcome-badges">
                                <div className="badge"><FaLeaf /> Eco Friendly</div>
                                <div className="badge"><FaHandsHelping /> Community First</div>
                                <div className="badge"><FaHeart /> Transparent</div>
                            </div>
                            <Link to="/about" className="btn btn-primary">
                                Learn More <FaArrowRight />
                            </Link>
                        </div>
                        <div className="welcome-right">
                            <div className="welcome-image-card">
                                <img src={welcomeImg} alt="Kiran Charitable Trust Welcome representation" className="welcome-real-img" />
                            </div>
                            <div className="vision-mission-cards">
                                <div className="vm-card vision">
                                    <div className="vm-icon"><FaStar /></div>
                                    <div><h4>Our Vision</h4><p>Creating Better Future</p></div>
                                </div>
                                <div className="vm-card mission">
                                    <div className="vm-icon"><FaHeart /></div>
                                    <div><h4>Our Mission</h4><p>Serving Humanity</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
          WHAT WE DO — clickable cards redirecting correctly
      ══════════════════════════════════ */}
            <section className="activities-section section-padding">
                <div className="container">
                    <div className="section-title">
                        <p className="tagline">Our Work</p>
                        <h2>What We Do</h2>
                        <p>Comprehensive programs addressing the most critical needs of our community</p>
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
                                    Learn More <FaArrowRight />
                                </div>
                                <div className="activity-hover-bar" style={{ background: act.color }} />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
          STATS
      ══════════════════════════════════ */}
            <section className="stats-section" ref={statsRef}>
                <div className="stats-overlay" />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="section-title" style={{ marginBottom: '50px' }}>
                        <p className="tagline" style={{ color: '#FFD700' }}>Our Impact</p>
                        <h2 style={{ color: 'white' }}>Making a Real Difference</h2>
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
          LATEST ACTIVITIES
      ══════════════════════════════════ */}
            <section className="latest-section section-padding">
                <div className="container">
                    <div className="section-title">
                        <p className="tagline">Recent Work</p>
                        <h2>Latest Activities</h2>
                        <p>Stay updated with our recent initiatives and community outreach programs</p>
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
                                    <Link to="/activities" className="read-more-btn">Read More <FaArrowRight /></Link>
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
                        <p className="tagline">Visual Impact</p>
                        <h2>Featured Gallery</h2>
                        <p>Moments of connection, service, and hope captured in our direct outreach drives</p>
                        <div className="title-underline"><span /><span /><span /></div>
                    </div>
                    <div className="featured-gallery-grid">
                        <div className="fg-card">
                            <div className="fg-img-wrap">
                                <img src={galleryHero} alt="Community Gathering & Operations" className="fg-img" />
                            </div>
                            <div className="fg-info">
                                <h4>Medical & Support Drive</h4>
                                <p>Reaching out to regional families with medical consultations and support kits.</p>
                            </div>
                        </div>
                        <div className="fg-card">
                            <div className="fg-img-wrap">
                                <img src={galleryHero1} alt="Rations Distribution Drive" className="fg-img" />
                            </div>
                            <div className="fg-info">
                                <h4>Essential Rations Relief</h4>
                                <p>Ensuring complete food security and dry grocery pack availability.</p>
                            </div>
                        </div>
                        <div className="fg-card">
                            <div className="fg-img-wrap">
                                <img src={galleryHero3} alt="Educational Classroom Support" className="fg-img" />
                            </div>
                            <div className="fg-info">
                                <h4>Children Education Program</h4>
                                <p>Providing classroom resources, books and materials for rural primary scholars.</p>
                            </div>
                        </div>
                    </div>
                    <div className="view-all-wrap" style={{ marginTop: '40px' }}>
                        <Link to="/gallery" className="btn btn-primary">
                            View Full Gallery
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
            <section className="testimonials-section section-padding">
                <div className="container">
                    <div className="section-title">
                        <p className="tagline">Voices of Impact</p>
                        <h2>What People Say</h2>
                        <p>Stories from our volunteers, donors, and beneficiaries</p>
                        <div className="title-underline"><span /><span /><span /></div>
                    </div>
                    <div className="testimonial-slider">
                        <button className="test-arrow test-arrow-left" onClick={prevTestimonial} aria-label="Prev"><FaChevronLeft /></button>
                        <div className="testimonial-card">
                            <FaQuoteLeft className="quote-icon" />
                            <p className="testimonial-text">{testimonials[currentTestimonial].text}</p>
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
          SPONSORS
      ══════════════════════════════════ */}
            <section className="sponsors-section section-padding">
                <div className="container">
                    <div className="section-title">
                        <p className="tagline">Our Partners</p>
                        <h2>Trusted By</h2>
                        <div className="title-underline"><span /><span /><span /></div>
                    </div>
                    <div className="sponsors-track-wrap">
                        <div className="sponsors-track">
                            {[...sponsors, ...sponsors].map((s, i) => (
                                <div key={i} className="sponsor-logo-item">{s}</div>
                            ))}
                        </div>
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
                    <p className="cta-tagline">Be The Change</p>
                    <h2>Together We Can Make a Difference</h2>
                    <p>Every contribution, big or small, helps us reach more lives. Join thousands of changemakers.</p>
                    <div className="cta-btns">
                        <Link to="/donate" className="btn btn-primary"><FaHeart /> Donate Now</Link>
                        <Link to="/careers" className="btn btn-secondary"><FaUsers /> Become Volunteer</Link>
                    </div>
                </div>
            </section>

        </div>
    )
}
