import React, { useState } from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiGoogleplay } from 'react-icons/si';

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const openTerms = (e) => {
    e.preventDefault();
    setShowTerms(true);
  };

  const closeTerms = () => {
    setShowTerms(false);
  };

  const openPrivacy = (e) => {
    e.preventDefault();
    setShowPrivacy(true);
  };

  const closePrivacy = () => {
    setShowPrivacy(false);
  };

  return (
    <>
      <footer style={styles.footer}>
        {/* Navigation links */}
        <div style={styles.section}>
          <a href="/about" style={styles.link}>About Us</a>
          <a href="/careers" style={styles.link}>Careers</a>
          <a href="#" onClick={openTerms} style={styles.link}>Terms & Conditions</a>
          <a href="/advertise" style={styles.link}>Advertise</a>
        </div>
        <hr style={styles.divider} />

        {/* Social icons */}
        <div style={styles.section}>
          <span style={styles.label}>Connect with us:</span>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaFacebookF style={styles.icon} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaXTwitter style={styles.icon} />
          </a>
          <a href="https://www.instagram.com/planora_app?igsh=aTV1b2wxam8xZ3hy" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaInstagram style={styles.icon} />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <FaLinkedinIn style={styles.icon} />
          </a>
        </div>

        {/* App download icons */}
        <div style={styles.section}>
          <span style={styles.label}>Download Our App:</span>
          <a href="https://play.google.com/store/apps/details?id=com.mycompany.plan" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
            <SiGoogleplay style={styles.storeIcon} title="Google Play" />
          </a>
        </div>
        <hr style={styles.divider} />

        {/* Branding and copyright */}
        <div style={styles.section}>
          <span style={styles.brand}>Cookies Tech</span>
          <span style={styles.copy}>© Cookies Tech.</span>
          <a href="#" onClick={openPrivacy} style={styles.link}>Privacy Policy</a>
        </div>
      </footer>

      {showTerms && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              onClick={closeTerms}
              style={styles.closeButton}
              aria-label="Close Terms and Conditions"
              onMouseEnter={e => e.currentTarget.style.color = '#ffcc00'}
              onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: '15px', borderBottom: '2px solid #ffcc00', paddingBottom: '8px' }}>Terms and Conditions</h2>
            <div style={styles.termsText}>
              <p>Using the application, they assume that you have obtained permission from the bill payer.</p>

              <p>Similarly, the Service Provider cannot always assume responsibility for your usage of the application. For instance, it is your responsibility to ensure that your device remains charged. If your device runs out of battery and you are unable to access the Service, the Service Provider cannot be held responsible.</p>

              <p>In terms of the Service Provider's responsibility for your use of the application, it is important to note that while they strive to ensure that it is updated and accurate at all times, they do rely on third parties to provide information to them so that they can make it available to you. The Service Provider accepts no liability for any loss, direct or indirect, that you experience as a result of relying entirely on this functionality of the application.</p>

              <p>The Service Provider may wish to update the application at some point. The application is currently available as per the requirements for the operating system (and for any additional systems they decide to extend the availability of the application to) may change, and you will need to download the updates if you want to continue using the application. The Service Provider does not guarantee that it will always update the application so that it is relevant to you and/or compatible with the particular operating system version installed on your device. However, you agree to always accept updates to the application when offered to you. The Service Provider may also wish to cease providing the application and may terminate its use at any time without providing termination notice to you. Unless they inform you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must cease using the application, and (if necessary) delete it from your device.</p>

              <h3 style={{ marginTop: '25px', borderBottom: '1px solid #ffcc00', paddingBottom: '6px' }}>Changes to These Terms and Conditions</h3>
              <p>The Service Provider may periodically update their Terms and Conditions. Therefore, you are advised to review this page regularly for any changes. The Service Provider will notify you of any changes by posting the new Terms and Conditions on this page.</p>

              <p>These terms and conditions are effective as of 2024-10-20</p>

              <h3 style={{ marginTop: '25px', borderBottom: '1px solid #ffcc00', paddingBottom: '6px' }}>Contact Us</h3>
              <p>If you have any questions or suggestions about the Terms and Conditions, please do not hesitate to contact the Service Provider at <a href="mailto:tech.cookies1@gmail.com" style={{ color: '#ffcc00' }}>tech.cookies1@gmail.com</a>.</p>
            </div>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              onClick={closePrivacy}
              style={styles.closeButton}
              aria-label="Close Privacy Policy"
              onMouseEnter={e => e.currentTarget.style.color = '#ffcc00'}
              onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: '15px', borderBottom: '2px solid #ffcc00', paddingBottom: '8px' }}>Planora Privacy Policy</h2>
            <div style={styles.termsText}>
              <p>This privacy policy applies to the Planora app (hereby referred to as "Application") for mobile devices that was created by Cookies Tech (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".</p>

              <h3>Information Collection and Use</h3>
              <p>The Application collects information when you download and use it. This information may include information such as</p>
              <ul>
                <li>Your device's Internet Protocol address (e.g. IP address)</li>
                <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li>
                <li>The time spent on the Application</li>
                <li>The operating system you use on your mobile device</li>
              </ul>
              <p>The Application does not gather precise information about the location of your mobile device.</p>

              <p>The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions. For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information, including but not limited to Name,email id, location, phone number, address . The information that the Service Provider request will be retained by them and used as described in this privacy policy.</p>

              <h3>Third Party Access</h3>
              <p>Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.</p>

              <p>Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:</p>
              <ul>
                <li>Google Play Services</li>
                <li>AdMob</li>
                <li>Google Analytics for Firebase</li>
                <li>Firebase Crashlytics</li>
              </ul>

              <h3>The Service Provider may disclose User Provided and Automatically Collected Information:</h3>
              <ul>
                <li>as required by law, such as to comply with a subpoena, or similar legal process;</li>
                <li>when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li>
                <li>with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.</li>
              </ul>

              <h3>Opt-Out Rights</h3>
              <p>You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.</p>

              <h3>Data Retention Policy</h3>
              <p>The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at tech.cookies1@gmail.com and they will respond in a reasonable time.</p>

              <h3>Children</h3>
              <p>The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.</p>

              <p>The Application does not address anyone under the age of 13. The Service Provider does not knowingly collect personally identifiable information from children under 13 years of age. In the case the Service Provider discover that a child under 13 has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact the Service Provider (tech.cookies1@gmail.com) so that they will be able to take the necessary actions.</p>

              <h3>Security</h3>
              <p>The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.</p>

              <h3>Changes</h3>
              <p>This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.</p>
              <p>This privacy policy is effective as of 2024-10-20</p>

              <h3>Your Consent</h3>
              <p>By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.</p>

              <h3>Contact Us</h3>
              <p>If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at <a href="mailto:tech.cookies1@gmail.com" style={{ color: '#ffcc00' }}>tech.cookies1@gmail.com</a>.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
    cursor: 'pointer',
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 63, 102, 0.95)', // dark blue with opacity
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
    overflowY: 'auto',
  },
  modalContent: {
    backgroundColor: '#003f66', // dark blue
    color: '#ffffff', // white text
    maxWidth: '800px',
    width: '100%',
    borderRadius: '8px',
    padding: '30px 25px',
    position: 'relative',
    boxShadow: '0 2px 15px rgba(0,0,0,0.7)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: '15px',
    lineHeight: '1.7',
    maxHeight: '80vh',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#ffcc00 #003f66',
  },
  // Webkit scrollbar styles for Chrome, Safari, Edge
  '@global': {
    'div::-webkit-scrollbar': {
      width: '8px',
    },
    'div::-webkit-scrollbar-track': {
      background: '#003f66',
      borderRadius: '8px',
    },
    'div::-webkit-scrollbar-thumb': {
      backgroundColor: '#ffcc00',
      borderRadius: '8px',
      border: '2px solid #003f66',
    },
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '18px',
    background: 'none',
    border: 'none',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#ffffff',
    transition: 'color 0.3s',
  },
  termsText: {
    textAlign: 'left',
    lineHeight: '1.8',
    marginTop: '15px',
  },
};

export default Footer;
// </attempt_completion>
