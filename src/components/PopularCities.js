import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const cities = [
  { name: 'Chennai', image: `${process.env.PUBLIC_URL}/images/chennai.jpg` },
  { name: 'Madurai', image: `${process.env.PUBLIC_URL}/images/madurai.jpg` },
  { name: 'Kanchi', image: `${process.env.PUBLIC_URL}/images/kanchi.jpg` },
  { name: 'Thanjavur', image: `${process.env.PUBLIC_URL}/images/thanjavur.jpg` },
  { name: 'Coimbatore', image: `${process.env.PUBLIC_URL}/images/coimbatore.jpg` },
  { name: 'Tirunelveli', image: `${process.env.PUBLIC_URL}/images/tirunelveli.jpg` },
  { name: 'Trichy', image: `${process.env.PUBLIC_URL}/images/trichy.jpg` },
  { name: 'Hosur', image: `${process.env.PUBLIC_URL}/images/hosur.jpg` },
  { name: 'Kodaikanal', image: `${process.env.PUBLIC_URL}/images/kodaikanal.jpg` },
  { name: 'Thoothukudi', image: `${process.env.PUBLIC_URL}/images/kodaikanal.jpg` },
];

const PopularCities = () => {
  const [results, setResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const handleCityClick = async (cityName) => {
    setSelectedCity(cityName);
    try {
      const q = query(collection(db, 'postorder'), where('location', '==', cityName));
      const snap = await getDocs(q);
      setResults(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching companies by city:', error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Popular Cities</h2>

      <div style={styles.grid}>
        {cities.map((city, idx) => (
          <div
            key={idx}
            style={styles.cityCard}
            onClick={() => handleCityClick(city.name)}
            className="city-card"
          >
            <img
              src={city.image}
              alt={city.name}
              style={styles.cityImage}
              onError={e => (e.target.style.display = 'none')}
            />
            <p style={styles.cityName}>{city.name}</p>
          </div>
        ))}
      </div>

      {selectedCity && (
        <div style={styles.resultSection}>
          <h3 style={styles.resultHeading}>Companies in {selectedCity}</h3>
          {results.length === 0 ? (
            <p style={styles.noResults}>No companies found in {selectedCity}</p>
          ) : (
            <div style={styles.scrollRow}>
              {results.map(company => (
                <Link
                  key={company.id}
                  to={`/company/${company.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={styles.resultCard}>
                    <img
                      src={company.image || `${process.env.PUBLIC_URL}/images/default.jpg`}
                      alt={company.businessname}
                      style={styles.resultImage}
                      onError={e => (e.target.style.display = 'none')}
                    />
                    <h4 style={styles.resultName}>{company.businessname || 'No Name'}</h4>
                    <p style={styles.location}>{company.location || 'Unknown Location'}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#003f66', // Light background for contrast
    padding: '50px 20px',
    color: '#333', // Darker text for better readability
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 600,
    marginBottom: '30px',
    textAlign: 'center',
    color: '#ffffff', // Strong accent color
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // Adjust for responsive design
    gap: '30px',
    maxWidth: '1300px',
    margin: '0 auto 40px',
  },
  cityCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect
    '&:hover': {
      transform: 'translateY(-8px)', // Lift effect on hover
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    },
  },
  cityImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '12px',
    transition: 'transform 0.3s ease',
  },
  cityName: {
    color: '#003f66',
    fontWeight: 600,
    fontSize: '16px',
    textAlign: 'center',
    marginTop: '10px',
  },
  resultSection: {
    maxWidth: '1300px',
    margin: '0 auto',
  },
  resultHeading: {
    fontSize: '26px',
    fontWeight: 600,
    marginBottom: '30px',
    color: '#003f66',
  },
  noResults: {
    fontStyle: 'italic',
    fontSize: '18px',
    color: '#777',
  },
  scrollRow: {
    display: 'flex',
    gap: '25px',
    overflowX: 'auto',
    paddingBottom: '10px',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    width: '220px',
    height: '280px',
    flex: '0 0 auto',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect for result card
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
    },
  },
  resultImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '15px',
  },
  resultName: {
    color: '#003f66',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  location: {
    color: '#666',
    fontSize: '14px',
    margin: '0',
  },
};

export default PopularCities;
