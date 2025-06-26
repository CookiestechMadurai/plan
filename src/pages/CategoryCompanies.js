import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CategoryCompanies = () => {
  const { categoryName } = useParams();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, 'postorder'),
          where('eventname', '==', categoryName)
        );
        const querySnapshot = await getDocs(q);
        const fetchedCompanies = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCompanies(fetchedCompanies);
      } catch (err) {
        setError('Failed to fetch companies.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [categoryName]);

  const handleCompanyClick = (id) => {
    navigate(`/company/${id}`);
  };

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <h1 style={styles.heading}>Companies Offering {categoryName}</h1>
        {loading && <p style={styles.message}>Loading companies...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {!loading && companies.length === 0 && (
          <p style={styles.message}>No companies found for "{categoryName}"</p>
        )}
        <div style={styles.gridContainer}>
          {companies.map(company => (
            <div
              key={company.id}
              style={styles.card}
              onClick={() => handleCompanyClick(company.id)}
            >
              <img
                src={company.image || (process.env.PUBLIC_URL + '/images/default.jpg')}
                alt={company.businessname}
                style={styles.image}
              />
              <h3 style={styles.companyName}>{company.businessname || 'No Name'}</h3>
              <p style={styles.location}>{company.location || 'Unknown Location'}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  wrapper: {
    padding: '20px',
    backgroundColor: '#003f66',
    minHeight: '80vh',
    color: '#ffffff',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: '16px',
  },
  error: {
    textAlign: 'center',
    color: '#ff4d4f',
    fontSize: '16px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '15px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s ease',
    color: '#003f66',
  },
  image: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  companyName: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  location: {
    fontSize: '14px',
  },
};

export default CategoryCompanies;
