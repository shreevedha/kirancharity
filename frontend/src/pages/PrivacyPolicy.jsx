import { Link } from 'react-router-dom'
import { FaShieldAlt, FaEnvelope } from 'react-icons/fa'
import './Legal.css'

export default function PrivacyPolicy() {
    return (
        <div className="legal-page">
            <div className="page-banner">
                <div className="banner-circles" />
                <div className="container">
                    <h1>Privacy Policy</h1>
                    <p className="breadcrumb"><span>Home / </span>Privacy Policy</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="container legal-container">
                    <div className="legal-card">
                        <div className="legal-hero">
                            <FaShieldAlt className="legal-hero-icon" />
                            <div>
                                <h2>Our Privacy Commitment</h2>
                                <p>Last updated: January 1, 2024 | Effective: January 1, 2024</p>
                            </div>
                        </div>

                        <div className="legal-intro">
                            <p>
                                At Kiran Charitable Trust ("we", "our", or "the Trust"), we are committed to protecting your
                                personal information and your right to privacy. This Privacy Policy explains how we collect, use,
                                disclose, and safeguard your information when you visit our website or make a donation.
                            </p>
                        </div>

                        <div className="legal-toc">
                            <h4>Table of Contents</h4>
                            <ol>
                                {['Information We Collect', 'How We Use Your Information', 'Sharing Your Information',
                                    'Data Security', 'Cookies', 'Your Rights', 'Contact Us'].map((item, i) => (
                                        <li key={i}><a href={`#pp-${i + 1}`}>{item}</a></li>
                                    ))}
                            </ol>
                        </div>

                        <div className="legal-sections">
                            <div id="pp-1" className="legal-section">
                                <h3>1. Information We Collect</h3>
                                <p>We collect information you provide directly to us, including:</p>
                                <ul>
                                    <li><strong>Personal Identification:</strong> Name, email address, phone number, mailing address</li>
                                    <li><strong>Financial Information:</strong> Payment details for processing donations (we do not store card numbers)</li>
                                    <li><strong>Volunteer Information:</strong> Occupation, skills, availability when you register as a volunteer</li>
                                    <li><strong>Communication Data:</strong> Messages and inquiries sent through our contact form</li>
                                    <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage data collected automatically</li>
                                </ul>
                            </div>

                            <div id="pp-2" className="legal-section">
                                <h3>2. How We Use Your Information</h3>
                                <p>We use the information we collect to:</p>
                                <ul>
                                    <li>Process your donations and send receipts, including 80G certificates</li>
                                    <li>Communicate with you about our activities and events</li>
                                    <li>Manage volunteer registrations and assignments</li>
                                    <li>Maintain records for statutory and legal compliance</li>
                                    <li>Send newsletters and updates (with your consent)</li>
                                    <li>Improve our website and services</li>
                                </ul>
                            </div>

                            <div id="pp-3" className="legal-section">
                                <h3>3. Sharing Your Information</h3>
                                <p>We do not sell, trade, or transfer your personal information to third parties, except:</p>
                                <ul>
                                    <li><strong>Payment Processors:</strong> To process donations (Razorpay, PhonePe, etc.)</li>
                                    <li><strong>Legal Obligations:</strong> To comply with applicable laws or government requests</li>
                                    <li><strong>Service Providers:</strong> Trusted third parties who assist in operating our website under strict confidentiality agreements</li>
                                </ul>
                            </div>

                            <div id="pp-4" className="legal-section">
                                <h3>4. Data Security</h3>
                                <p>
                                    We implement appropriate technical and organizational measures to protect your personal information
                                    against unauthorized access, alteration, disclosure, or destruction. All financial transactions are
                                    encrypted using SSL technology.
                                </p>
                                <div className="legal-highlight">
                                    <FaShieldAlt /> Your donation data is always encrypted and stored securely. We are PCI-DSS compliant through our payment partners.
                                </div>
                            </div>

                            <div id="pp-5" className="legal-section">
                                <h3>5. Cookies</h3>
                                <p>
                                    Our website may use cookies to enhance your experience. Cookies are small files that a site or its
                                    service provider transfers to your device. You may set your browser to refuse all cookies, though
                                    some features may not function properly.
                                </p>
                            </div>

                            <div id="pp-6" className="legal-section">
                                <h3>6. Your Rights</h3>
                                <p>You have the right to:</p>
                                <ul>
                                    <li>Access the personal data we hold about you</li>
                                    <li>Request correction of inaccurate data</li>
                                    <li>Request deletion of your personal data</li>
                                    <li>Opt-out of marketing communications at any time</li>
                                    <li>Withdraw consent where processing is based on consent</li>
                                </ul>
                            </div>

                            <div id="pp-7" className="legal-section">
                                <h3>7. Contact Us</h3>
                                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                                <div className="legal-contact-info">
                                    <p><strong>Kiran Charitable Trust</strong></p>
                                    <p>Mandepudi, Nemalikallu, Amaravathi, Palnaadu, Guntur - 522018</p>
                                    <p><FaEnvelope /> kirancharitabletrust01@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="legal-footer-nav">
                            <Link to="/terms-conditions" className="btn btn-outline">View Terms & Conditions</Link>
                            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
