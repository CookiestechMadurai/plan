import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Photography', image: process.env.PUBLIC_URL + '/images/photography.jpg' },
  { name: 'Food', image: process.env.PUBLIC_URL + '/images/food.jpg' },
  { name: 'Music', image: process.env.PUBLIC_URL + '/images/music.jpg' },
  { name: 'Catering', image: process.env.PUBLIC_URL + '/images/catering.jpg' },
  { name: 'Venue', image: process.env.PUBLIC_URL + '/images/venue.jpg' },
  { name: 'Return Gift', image: process.env.PUBLIC_URL + '/images/gifts.jpg' },
  { name: 'Travel', image: process.env.PUBLIC_URL + '/images/travel.jpg' },
  { name: 'DJ', image: process.env.PUBLIC_URL + '/images/dj.jpg' },
  { name: 'Cakes & Bakery', image: process.env.PUBLIC_URL + '/images/cakes.jpg' },
  { name: 'Decoration', image: process.env.PUBLIC_URL + '/images/decoration.jpg' },
  { name: 'Orchestra', image: process.env.PUBLIC_URL + '/images/orchestra.jpg' },
  { name: 'Wedding', image: process.env.PUBLIC_URL + '/images/wedding.jpg' },
  { name: 'Beautician', image: process.env.PUBLIC_URL + '/images/beautician.jpg' },
  { name: 'Other', image: process.env.PUBLIC_URL + '/images/other.jpg' }
];

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleCategories = searchTerm
    ? filteredCategories
    : showAll
      ? categories
      : categories.slice(0, 8);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>Select Category</h1>
      <input
        type="text"
        placeholder="Search for category"
        style={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={styles.gridContainer}>
        {visibleCategories.map((cat, i) => (
          <div key={i} style={styles.card} onClick={() => handleCategoryClick(cat.name)}>
            <img src={cat.image} alt={cat.name} style={styles.image} />
            <p style={styles.label}>{cat.name}</p>
          </div>
        ))}
      </div>

      {/* Show More/Show Less button only if no search term */}
      {!searchTerm && (
        <div style={{ marginTop: '20px', marginBottom: '30px', textAlign: 'center' }}>
          <button style={styles.showAllBtn} onClick={() => setShowAll(prev => !prev)}>
            {showAll ? 'Show Less ▲' : 'Show All ▼'}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#003f66',
    padding: '20px',
    margin: '0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    minHeight: '50vh'
  },
  heading: {
    color: '#ffffff',
    marginBottom: '10px'
  },
  searchInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    fontSize: '16px'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '10px'
  },
  card: {
    width: '100%',
    height: '150px',
    textAlign: 'center',
    padding: '10px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px'
  },
  label: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px'
  },
  showAllBtn: {
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default SearchSection;
