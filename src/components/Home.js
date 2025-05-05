// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import HeroBanner from './HeroBanner';
import SearchSection from './SearchSection';
import PopularCities from './PopularCities';
import CompanyGrid from './CompanyGrid'; // 👈 Import the new component
import Footer from './Footer'; // 👈 Import Footer

const Home = () => {
  const location = useLocation();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Show the install prompt message box only once immediately after login
    if (location.state && location.state.showInstallPrompt) {
      setShowInstallPrompt(true);
    }
  }, [location.state]);

  const handleInstallClick = () => {
    // Redirect to Play Store app link
    window.location.href = 'https://play.google.com/store/apps/details?id=com.mycompany.plan';
  };

  const handleNotNowClick = () => {
    // Close the message box and show the home page
    setShowInstallPrompt(false);
  };

  return (
    <div className="font-sans">
      <Navbar />
      <HeroBanner />
      <SearchSection />
      <PopularCities />
      <CompanyGrid /> {/* 👈 Display all companies here */}
      <Footer /> {/* 👈 Add the Footer at the bottom */}

      {showInstallPrompt && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.title}>View in App</h2>
            <div style={styles.buttonContainer}>
              <button style={{ ...styles.button, ...styles.installButton }} onClick={handleInstallClick}>
                Install
              </button>
              <button style={{ ...styles.button, ...styles.notNowButton }} onClick={handleNotNowClick}>
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 63, 102, 0.6)', // semi-transparent overlay with theme color
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    color: '#003f66', // theme color
    fontSize: '24px',
    fontWeight: '600',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    padding: '12px 25px',
    fontSize: '16px',
    borderRadius: '30px',
    border: 'none',
    cursor: 'pointer',
    minWidth: '100px',
    fontWeight: '600',
  },
  installButton: {
    backgroundColor: '#003f66', // theme color
    color: '#fff',
  },
  notNowButton: {
    backgroundColor: '#e6efff', // lighter theme color
    color: '#003f66',
  },
};

export default Home;
