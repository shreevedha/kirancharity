import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'
import KLogo from '../assets/Klogo.jpeg'
import './Header.css'

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/activities', label: 'Our Programs' },
    { path: '/founder-desk', label: "Founder's Message" },
    { path: '/gallery', label: 'Field Gallery' },
    { path: '/careers', label: 'Join as Volunteer' },
    { path: '/contact', label: 'Contact Us' },
]

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
    }, [location])

    return (
        <>
            {/* Top Bar for Trust & Contact info */}
            <div className="top-bar">
                <div className="container top-bar-inner">
                    <div className="top-bar-left">
                        <span className="top-bar-item"><FaMapMarkerAlt /> Vijayawada, Andhra Pradesh</span>
                        <a href="tel:+917702468889" className="top-bar-item"><FaPhone /> +91 77024 68889</a>
                        <a href="mailto:connectshreevedha@gmail.com" className="top-bar-item desktop-only"><FaEnvelope /> connectshreevedha@gmail.com</a>
                    </div>
                    <div className="top-bar-right">
                        <span className="top-bar-badge"><FaShieldAlt /> 80G & 12A Certified NGO</span>
                        <span className="top-bar-badge tax-badge"><FaCheckCircle /> 50% Tax Tax Exemption</span>
                    </div>
                </div>
            </div>

            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="container header-inner">
                    {/* Logo - only Klogo.jpeg */}
                    <Link to="/" className="logo">
                        <div className="logo-img-wrap">
                            <img src={KLogo} alt="Kiran Charitable Trust Logo" className="logo-img" />
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="nav-desktop">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                end={link.path === '/'}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Donate Button */}
                    <Link to="/donate" className="btn btn-primary donate-btn">
                        <FaHeart /> Donate Now
                    </Link>

                    {/* Mobile Toggle */}
                    <button
                        className="menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Nav */}
                <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
                    {navLinks.map(link => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                            end={link.path === '/'}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <Link to="/donate" className="btn btn-primary mobile-donate-btn">
                        <FaHeart /> Support Our Cause
                    </Link>
                </div>
            </header>
        </>
    )
}
