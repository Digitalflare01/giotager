import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer glass-panel" style={{ margin: '0', borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}>
            <div className="container">
                <div className="footer-grid">

                    {/* About Section */}
                    <div className="footer-col">
                        <h3 className="footer-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src="/logo.svg" alt="NextGen Kerala Logo" style={{ height: '24px', width: 'auto' }} />
                            NextGen Kerala
                        </h3>
                        <p className="footer-text">
                            Show your online presence in the digital world. In the fast-growing world of today, we help you establish yourself here too.
                        </p>
                    </div>

                    {/* Help Desk */}
                    <div className="footer-col">
                        <h4 className="footer-subtitle">Help Desk</h4>
                        <ul className="footer-links">
                            <li><a href="#">Customer Care</a></li>
                            <li><a href="#">Legal Help</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Refund Policy</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-col">
                        <h4 className="footer-subtitle">Services</h4>
                        <ul className="footer-links">
                            <li><a href="#">Most Enquiries</a></li>
                            <li><a href="#">Website Development</a></li>
                            <li><a href="#">Amazon, Flipkart Listing</a></li>
                            <li><a href="#">SEO & Google Business Profile</a></li>
                            <li><a href="#">Content Creation</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-col">
                        <h4 className="footer-subtitle">Head Office</h4>
                        <ul className="footer-contact">
                            <li>
                                <MapPin size={16} className="text-primary" />
                                <span>
                                    <strong>Meet Directors</strong><br />
                                    212 Shopping complex,<br />
                                    Kattappana, Kerala 685515
                                </span>
                            </li>
                            <li>
                                <Phone size={16} className="text-secondary" />
                                <a href="tel:+916238005674">+91 6238 005 674</a>
                            </li>
                            <li>
                                <Mail size={16} className="text-primary" />
                                <a href="mailto:info@nextgenkerala.in">info@nextgenkerala.in</a>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>
                        Copyright {currentYear} All rights reserved | This design is made with <a href="https://nextgenkerala.in/" target="_blank" rel="noopener noreferrer" className="footer-brand-link">NextGen Kerala <ExternalLink size={12} style={{ display: 'inline', marginBottom: '-2px' }} /></a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
