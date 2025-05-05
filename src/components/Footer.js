import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiGoogleplay, SiAppstore } from 'react-icons/si';

const Footer = () => (
  <footer style={styles.footer}>
    {/* Navigation links */}
    <div style={styles.section}>
      <a href="/about" style={styles.link}>About Us</a>
      <a href="/careers" style={styles.link}>Careers</a>
      <a href="/terms" style={styles.link}>Terms & Conditions</a>
      <a href="/advertise" style={styles.link}>Advertise</a>
    </div>
    <hr style={styles.divider} />

    {/* Social icons */}
    <div style={styles.section}>
      <span style={styles.label}>Connect with us:</span>
      <FaFacebookF style={styles.icon} />
      <FaXTwitter style={styles.icon} />
      <FaInstagram style={styles.icon} />
      <FaLinkedinIn style={styles.icon} />
    </div>

    {/* App download icons */}
    <div style={styles.section}>
      <span style={styles.label}>Download Our App:</span>
      <a href="#" style={styles.iconLink}>
        <SiAppstore style={styles.storeIcon} title="App Store" />
      </a>
      <a href="https://play.google.com/store/apps/details?id=com.mycompany.plan" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
        <SiGoogleplay style={styles.storeIcon} title="Google Play" />
      </a>
    </div>
    <hr style={styles.divider} />

    {/* Branding and copyright */}
    <div style={styles.section}>
      <span style={styles.brand}>Cookies Tech</span>
      <span style={styles.copy}>© Cookies Tech.</span>
      <a href="/privacy" style={styles.link}>Privacy Policy</a>
    </div>
  </footer>
);

const styles = {
  footer: {
    backgroundColor: '#003f66',
    color: '#ffffff',
    padding: '40px 20px',
    textAlign: 'center',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    margin: 0,
  },
  section: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '12px',
    alignItems: 'center',
  },
  divider: {
    width: '80%',
    borderColor: 'rgba(255,255,255,0.2)',
    margin: '10px 0',
  },
  label: {
    opacity: 0.8,
    marginRight: '8px',
    color: '#ffffff',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    opacity: 0.8,
    margin: '0 8px',
    transition: 'opacity 0.2s',
  },
  icon: {
    color: '#ffffff',
    fontSize: '18px',
    cursor: 'pointer',
    opacity: 0.9,
    transition: 'opacity 0.2s',
  },
  iconLink: {
    display: 'inline-block',
    color: '#ffffff',
    fontSize: '28px',
    margin: '0 8px',
    transition: 'transform 0.2s',
  },
  storeIcon: {
    color: '#ffffff',
    cursor: 'pointer',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 8px',
    color: '#ffffff',
  },
  copy: {
    opacity: 0.8,
    margin: '0 8px',
    color: '#ffffff',
  },
};

export default Footer;
