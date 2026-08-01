import { Link } from 'react-router-dom'
import { FaFileAlt, FaEnvelope } from 'react-icons/fa'
import './Legal.css'

export default function TermsConditions() {
    return (
        <div className="legal-page">
            <div className="page-banner">
                <div className="banner-circles" />
                <div className="container">
                    <h1>Terms & Conditions</h1>
                    <p className="breadcrumb"><span>Home / </span>Terms & Conditions</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="container legal-container">
                    <div className="legal-card">
                        <div className="legal-hero">
                            <FaFileAlt className="legal-hero-icon" />
                            <div>
                                <h2>Terms of Use</h2>
                                <p>Last updated: January 1, 2024 | Effective: January 1, 2024</p>
                            </div>
                        </div>

                        <div className="legal-intro">
                            <p>
                                Please read these Terms and Conditions carefully before using the Kiran Charitable Trust website.
                                By accessing or using our website, you agree to be bound by these terms. If you disagree with
                                any part, please do not use our website.
                            </p>
                        </div>

                        <div className="legal-sections">
                            <div className="legal-section">
                                <h3>1. Acceptance of Terms</h3>
                                <p>
                                    By using this website, you confirm that you are at least 18 years of age and have read,
                                    understood, and agree to comply with these Terms & Conditions. Your continued use of the
                                    website constitutes acceptance of these terms.
                                </p>
                            </div>

                            <div className="legal-section">
                                <h3>2. Donation Policy</h3>
                                <ul>
                                    <li>All donations are voluntary and non-refundable unless documented error occurred</li>
                                    <li>Donations are used for charitable purposes as permitted by our registration</li>
                                    <li>We will issue 80G certificates for eligible donations to Indian donors</li>
                                    <li>Minimum donation amount is ₹100</li>
                                    <li>All transactions are processed through secure, certified payment gateways</li>
                                    <li>For FCRA compliance, foreign donations require additional documentation</li>
                                </ul>
                            </div>

                            <div className="legal-section">
                                <h3>3. Refund Policy</h3>
                                <p>
                                    Donations to charitable trusts are generally non-refundable. However, in cases of
                                    duplicate payments or technical errors, we will review refund requests within 7 working
                                    days. Refunds (if approved) will be processed to the original payment method within
                                    10-15 working days.
                                </p>
                                <div className="legal-highlight" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaEnvelope /> For refund requests, email us at kirancharitabletrust01@gmail.com with your Transaction ID.
                                </div>
                            </div>

                            <div className="legal-section">
                                <h3>4. Use of Website</h3>
                                <p>You agree not to:</p>
                                <ul>
                                    <li>Use the website for any unlawful purpose or to collect data about others</li>
                                    <li>Transmit harmful, offensive, or fraudulent content</li>
                                    <li>Attempt to gain unauthorized access to any part of the website</li>
                                    <li>Use automated scripts or bots to access the website</li>
                                    <li>Impersonate the Trust or its representatives</li>
                                </ul>
                            </div>

                            <div className="legal-section">
                                <h3>5. Intellectual Property</h3>
                                <p>
                                    All content on this website, including text, images, logos, and graphics, is the property
                                    of Kiran Charitable Trust and is protected by applicable copyright laws. You may not
                                    reproduce, distribute, or create derivative works without our written consent.
                                </p>
                            </div>

                            <div className="legal-section">
                                <h3>6. Volunteer Agreement</h3>
                                <p>By registering as a volunteer, you agree to:</p>
                                <ul>
                                    <li>Abide by the Trust's Code of Conduct</li>
                                    <li>Maintain confidentiality of beneficiary information</li>
                                    <li>Not represent the Trust without prior authorization</li>
                                    <li>Participate in mandatory orientation sessions</li>
                                </ul>
                            </div>

                            <div className="legal-section">
                                <h3>7. Limitation of Liability</h3>
                                <p>
                                    Kiran Charitable Trust shall not be liable for any indirect, incidental, or consequential
                                    damages arising from your use of this website. Our total liability for any claims
                                    shall not exceed the amount you donated in the preceding 12 months.
                                </p>
                            </div>

                            <div className="legal-section">
                                <h3>8. Governing Law</h3>
                                <p>
                                    These Terms shall be governed by and construed in accordance with the laws of India,
                                    specifically the laws of Andhra Pradesh. Any disputes shall be subject to the exclusive
                                    jurisdiction of courts in Vijayawada, Andhra Pradesh.
                                </p>
                            </div>

                            <div className="legal-section">
                                <h3>9. Changes to Terms</h3>
                                <p>
                                    We reserve the right to update these Terms at any time. Changes will be posted on this
                                    page with an updated date. Continued use of the website after changes constitutes
                                    acceptance of the new Terms.
                                </p>
                            </div>

                            <div className="legal-section">
                                <h3>10. Contact</h3>
                                <div className="legal-contact-info">
                                    <p><strong>Kiran Charitable Trust</strong></p>
                                    <p>Mandepudi, Nemalikallu, Amaravathi, Palnaadu, Guntur - 522018</p>
                                    <p><FaEnvelope /> kirancharitabletrust01@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="legal-footer-nav">
                            <Link to="/privacy-policy" className="btn btn-outline">View Privacy Policy</Link>
                            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
