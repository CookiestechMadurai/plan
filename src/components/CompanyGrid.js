import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CompanyGrid = () => {
  const [companies, setCompanies] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const isManualScrolling = useRef(false);
  const manualScrollTimeout = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'postorder'));
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter((item, index, self) =>
            index === self.findIndex(t =>
              (t.businessname?.toLowerCase() === item.businessname?.toLowerCase()) &&
              (t.image === item.image)
            )
          )
          .sort((a, b) =>
            (a.businessname || '').toLowerCase().localeCompare((b.businessname || '').toLowerCase())
          );
        setCompanies(list);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollStep = 1;
    let animationFrameId;

    const step = () => {
      if (!isManualScrolling.current) {
        el.scrollLeft += scrollStep;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);
    };
  }, [companies]);

  const scrollLeft = () => {
    const el = scrollRef.current;
    if (!el) return;
    isManualScrolling.current = true;
    el.scrollBy({ left: -200, behavior: 'smooth' });
    if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);
    manualScrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 2000);
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;
    isManualScrolling.current = true;
    el.scrollBy({ left: 200, behavior: 'smooth' });
    if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);
    manualScrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 2000);
  };

  return (
    <div style={styles.wrapper}>
      {/* Hide scrollbar */}
      <style>{`
        .scrollWrapper::-webkit-scrollbar { display: none; }
        .scrollWrapper { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <h2 style={styles.heading}>Vendors</h2>

      <div style={styles.scrollArea}>
        <button onClick={scrollLeft} style={styles.arrowButton}>
          <FaChevronLeft size={20} />
        </button>

        <div className="scrollWrapper" style={styles.scrollWrapper} ref={scrollRef}>
          <div style={styles.grid}>
            {[...companies, ...companies].map((c, index) => (
              <div
                key={c.id + '-' + index}
                style={styles.card}
                onClick={() => navigate(`/company/${c.id}`)}
              >
                <img
                  src={c.image || '/images/default.jpg'}
                  alt={c.businessname}
                  style={styles.image}
                  loading="lazy"
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
                <p style={styles.name}>{c.businessname || 'Unknown'}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={scrollRight} style={styles.arrowButton}>
          <FaChevronRight size={20} />
        </button>
      </div>

      {/* Show All Vendors button */}
      <button onClick={() => setShowAll(!showAll)} style={styles.showAllButton}>
        {showAll ? 'Hide All Vendors' : 'Show All Vendors'}
      </button>

      {/* Full Grid of Vendors */}
      {showAll && (
        <div style={styles.fullGrid}>
          {companies.map(c => (
            <div
              key={c.id}
              style={styles.card}
              onClick={() => navigate(`/company/${c.id}`)}
            >
              <img
                src={c.image || '/images/default.jpg'}
                alt={c.businessname}
                style={styles.image}
                loading="lazy"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              <p style={styles.name}>{c.businessname || 'Unknown'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#003f66',
    padding: '40px 20px',
    overflow: 'hidden',
    position: 'relative',
  },
  heading: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 600,
    marginBottom: '30px',
  },
  scrollArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  scrollWrapper: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
  },
  grid: {
    display: 'inline-flex',
    gap: '20px',
  },
  fullGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '20px',
    marginTop: '30px',
    justifyItems: 'center',
  },
  card: {
    flex: '0 0 auto',
    width: '160px',
    height: '210px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginBottom: '12px',
  },
  name: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    wordBreak: 'break-word',
  },
  arrowButton: {
    background: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showAllButton: {
    position: 'absolute',
    right: '20px',
    bottom: '20px',
    backgroundColor: '#ffffff',
    color: '#003f66',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    transition: 'background-color 0.2s',
  },
};

export default CompanyGrid;
