import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaHeart } from 'react-icons/fa'
import KLogo from '../assets/Klogo.jpeg'
import './Header.css'

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/activities', label: 'Activities' },
    { path: '/founder-desk', label: 'Founder Desk' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact' },
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
                    <FaHeart /> Donate Now
                </Link>
            </div>
        </header>
    )
}
