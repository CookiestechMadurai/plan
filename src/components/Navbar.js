import React, { useState, useEffect, useRef } from 'react';
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaEnvelope,
  FaRobot // AI icon
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const categoriesList = [
  'Photography', 'Food', 'Music', 'Catering', 'Venue', 'Return Gift',
  'Travel', 'DJ', 'Cakes & Bakery', 'Decoration', 'Orchestra',
  'Wedding', 'Beautician', 'Other'
];

  const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
    const [aiBoxOpen, setAiBoxOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const sidebarRef = React.useRef(null);

    React.useEffect(() => {
      function handleClickOutside(event) {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      }
      if (menuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [menuOpen]);

  useEffect(() => {
    if (aiBoxOpen && chatMessages.length === 0) {
      setChatMessages([{ sender: 'claura', text: 'Hi, welcome this is ms.Claura your ai assistant. Say hi to begin' }]);
      setChatStep('initial');
    }
  }, [aiBoxOpen]);
  const [userInput, setUserInput] = useState('');
  const [chatStep, setChatStep] = useState('initial'); // initial, waitingForHi, eventName, categories, budget, results
  const [eventName, setEventName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budget, setBudget] = useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const addMessage = (sender, text) => {
    setChatMessages(prev => [...prev, { sender, text }]);
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const handleUserInputSubmit = async (e) => {
    e.preventDefault();
    const input = userInput.trim();
    if (!input) return;

    addMessage('user', input);
    setUserInput('');

    if (chatStep === 'initial') {
      if (input.toLowerCase().startsWith('hi')) {
        setTimeout(() => {
          addMessage('claura', 'What is your event name?');
          setChatStep('eventName');
        }, 1000);
      } else {
        addMessage('claura', 'Please say "hi" to continue.');
      }
      return;
    }

    if (chatStep === 'eventName') {
      setEventName(input);
      await delay(3000);
      addMessage('claura', `Thanks! Your event name is "${input}". What categories do you need? Please select from below.`);
      setChatStep('categories');
    } else if (chatStep === 'budget') {
      if (isNaN(Number(input)) || Number(input) <= 0) {
        addMessage('claura', 'Please enter a valid positive number for budget.');
        return;
      }
      setBudget(input);
      addMessage('claura', `Great! Searching companies under budget ${input}...`);
      setChatStep('results');
      await fetchCompanies(input, selectedCategories);
    }
  };

  const handleCategorySelect = (category) => {
    let newSelected;
    if (selectedCategories.includes(category)) {
      newSelected = selectedCategories.filter(c => c !== category);
    } else {
      newSelected = [...selectedCategories, category];
    }
    setSelectedCategories(newSelected);
  };

  const handleCategoriesConfirm = () => {
    if (selectedCategories.length === 0) {
      addMessage('claura', 'Please select at least one category.');
      return;
    }
    addMessage('user', `Selected categories: ${selectedCategories.join(', ')}`);
    addMessage('claura', 'What is your budget? Please enter a number.');
    setChatStep('budget');
  };

  const fetchCompanies = async (budgetLimit, categories) => {
    setLoading(true);
    try {
      let q;
      if (categories.length > 0) {
        q = query(
          collection(db, 'postorder'),
          where('eventname', 'in', categories)
        );
      } else {
        q = query(collection(db, 'postorder'));
      }
      const snap = await getDocs(q);
      let companiesList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      companiesList = companiesList.filter(c => c.minprice <= Number(budgetLimit));
      if (companiesList.length === 0) {
        addMessage('claura', 'No companies found under your budget and selected categories.');
      } else {
        addMessage('claura', 'Here are the companies under your budget:');
        companiesList.forEach(c => {
          addMessage('claura', `${c.businessname} - Minimum Price: ${c.minprice}`);
        });
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      addMessage('claura', 'Sorry, there was an error fetching companies.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const qText = e.target.value;
    setSearchQuery(qText);

    if (!qText) {
      setCompanies([]);
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, 'postorder'),
        where('businessname', '>=', qText),
        where('businessname', '<=', qText + '\uf8ff')
      );
      const snap = await getDocs(q);
      setCompanies(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (company) => {
    if (!user) {
      navigate('/login');
      setMenuOpen(false);
      return;
    }
    navigate(`/company/${company.id}`);
    setSearchQuery('');
    setCompanies([]);
    setMenuOpen(false);
  };

  const handleNavClick = (path) => {
    if (!user) {
      navigate('/login');
      setMenuOpen(false);
      return;
    }
    navigate(path);
    setMenuOpen(false);
  };

  const handleAiButtonClick = () => {
    setAiBoxOpen(prev => !prev);
    if (!aiBoxOpen) {
      // Reset chat on open
      setChatMessages([]);
      setChatStep('initial');
      setEventName('');
      setSelectedCategories([]);
      setBudget('');
      setUserInput('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-main">
        <div className="nav-left">
          <div className="navbar-logo" onClick={() => navigate('/home')}>Planora</div>
        </div>

        <div className="nav-center">
          <div className="navbar-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <div className="search-results">
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : companies.length ? (
                  companies.map((c) => (
                    <div
                      key={c.id}
                      className="result-item"
                      onClick={() => handleSelect(c)}
                    >
                      {c.businessname}
                    </div>
                  ))
                ) : (
                  <div className="no-results">No matches found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="nav-right">
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li onClick={() => { handleNavClick('/home'); setMenuOpen(false); }}>Home</li>
          <li onClick={() => { handleNavClick('/orders'); setMenuOpen(false); }}>Orders</li>
          <li onClick={() => { handleNavClick('/post-order'); setMenuOpen(false); }}>Post Order</li>
          <li onClick={() => { handleAiButtonClick(); setMenuOpen(false); }}><FaRobot /> AI</li>
          <li onClick={() => { handleNavClick('/profile'); setMenuOpen(false); }}><FaUser /> Profile</li>
          <li onClick={() => { handleNavClick('/messages'); setMenuOpen(false); }}><FaEnvelope /> Messages</li>
          <li onClick={() => { handleNavClick('/cart'); setMenuOpen(false); }}><FaShoppingCart /> Cart</li>
        </ul>
          <div className="hamburger" onClick={() => setMenuOpen(prev => !prev)} aria-label="Toggle menu" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMenuOpen(prev => !prev); }}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>

      {menuOpen && (
        <>
          <div className="overlay" onClick={() => setMenuOpen(false)}></div>
          <div className="sidebar-menu">
            <div className="sidebar-header">
              <div className="sidebar-logo" onClick={() => { navigate('/home'); setMenuOpen(false); }}>Planora</div>
              <div className="close-icon" onClick={() => setMenuOpen(false)} aria-label="Close menu" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMenuOpen(false); }}>
                <FaTimes />
              </div>
            </div>
            <div className="sidebar-section">
              <h3>Menu</h3>
            <ul className="sidebar-menu-list">
              <li onClick={() => { handleNavClick('/home'); setMenuOpen(false); }} className="sidebar-menu-item">Home</li>
              <li onClick={() => { handleNavClick('/orders'); setMenuOpen(false); }} className="sidebar-menu-item">Orders</li>
              <li onClick={() => { handleNavClick('/post-order'); setMenuOpen(false); }} className="sidebar-menu-item">Post Order</li>
              <li onClick={() => { handleAiButtonClick(); setMenuOpen(false); }} className="sidebar-menu-item ai-button"><FaRobot /> AI</li>
              <li onClick={() => { handleNavClick('/profile'); setMenuOpen(false); }} className="sidebar-menu-item">Profile</li>
              <li onClick={() => { handleNavClick('/messages'); setMenuOpen(false); }} className="sidebar-menu-item">Messages</li>
              <li onClick={() => { handleNavClick('/cart'); setMenuOpen(false); }} className="sidebar-menu-item">Cart</li>
            </ul>
            </div>
            {/* Additional sections can be added here */}
          </div>
        </>
      )}


      {aiBoxOpen && (
        <div className="ai-chat-box" role="dialog" aria-modal="true" aria-labelledby="ai-chat-header">
          <div className="ai-chat-header" id="ai-chat-header">
            <div>AI Chat</div>
            <button
              className="ai-chat-close"
              onClick={() => setAiBoxOpen(false)}
              aria-label="Close AI chat"
              type="button"
            >
              <FaTimes />
            </button>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === 'claura' ? 'claura' : 'user'}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {chatStep === 'categories' ? (
            <div className="categories-buttons">
              {categoriesList.map(category => (
                <button
                  key={category}
                  className={selectedCategories.includes(category) ? 'category-btn selected' : 'category-btn'}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
              <button className="confirm-btn" onClick={handleCategoriesConfirm}>Confirm</button>
            </div>
          ) : (
            <>
              {chatStep === 'budget' ? (
                <div className="budget-slider-container">
                <input
                  type="range"
                  min="500"
                  max="1000000"
                  step="100"
                  value={budget || 500}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
                <input
                  type="number"
                  min="500"
                  max="1000000"
                  step="100"
                  value={budget || 500}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (val < 500) val = 500;
                    else if (val > 1000000) val = 1000000;
                    setBudget(val);
                  }}
                  style={{ marginTop: '10px', padding: '5px', borderRadius: '5px', border: 'none', fontSize: '1rem' }}
                />
                <div className="budget-value">Selected Budget: {budget || 500}</div>
                <button className="confirm-btn" onClick={() => {
                  if (!budget || isNaN(Number(budget)) || Number(budget) < 500) {
                    addMessage('claura', 'Please select a budget between 500 and 1,000,000.');
                    return;
                  }
                  addMessage('user', `Selected budget: ${budget}`);
                  addMessage('claura', `Great! Searching companies under budget ${budget}...`);
                  setChatStep('results');
                  fetchCompanies(budget, selectedCategories);
                }}>Confirm</button>
              </div>
              ) : (
                <form className="chat-input-form" onSubmit={handleUserInputSubmit}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={handleUserInputChange}
                    autoFocus
                    disabled={chatStep === 'categories' || chatStep === 'results'}
                  />
                  <button type="submit" disabled={chatStep === 'categories' || chatStep === 'results'}>Send</button>
                </form>
              )}
            </>
          )}
        </div>
      )}

        <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .navbar {
          background: #003f66;
          color: #fff;
          padding: 0.5rem 1rem;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .navbar-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .nav-left {
          flex: 1;
          order: 1;
        }

        .nav-center {
          flex: 2;
          display: flex;
          justify-content: center;
          order: 2;
        }

        .nav-right {
          flex: 2;
          display: flex;
          justify-content: flex-end;
          order: 3;
        }

        .navbar-logo {
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
        }

        .navbar-search {
          position: relative;
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 0.3rem 0.65rem;
        }

        .navbar-search input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          margin-left: 0.5rem;
          font-size: 0.9rem;
          outline: none;
        }

        .search-icon {
          color: #ddd;
        }

        .search-results {
          position: absolute;
          top: 110%;
          left: 0;
          width: 100%;
          background: #fff;
          color: #333;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-height: 200px;
          overflow-y: auto;
          z-index: 1001;
        }

        .result-item, .loading, .no-results {
          padding: 0.5rem;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }

        .result-item:hover {
          background: #f0f0f0;
        }

        .hamburger {
          display: none;
          font-size: 1.5rem;
          color: #fff;
          cursor: pointer;
        }

        .nav-links {
          list-style: none;
          display: flex;
          gap: 1.9rem;
          align-items: center;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .nav-links.active {
            display: flex !important;
            flex-direction: column;
            width: 100%;
            background-color: #003f66;
            position: absolute;
            top: 60px;
            left: 0;
            padding: 1rem 0;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
          }
          .nav-links li {
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            white-space: normal;
          }
        }

        .nav-links li {
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          white-space: nowrap;
        }

        .nav-links li:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .ai-chat-box {
          position: absolute;
          top: 60px;
          right: 10px;
          width: 400px;
          max-height: 600px;
          background: #ffffff; /* Changed to white background */
          color: #333333; /* Dark text for contrast */
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1100;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          background: #ffffff; /* white background for chat messages */
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chat-message {
          max-width: 80%;
          padding: 12px 20px;
          border-radius: 20px;
          font-size: 1rem;
          line-height: 1.4;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .chat-message.claura {
          background: #0078d7; /* bright blue for AI messages */
          color: #fff;
          align-self: flex-start;
          border-bottom-left-radius: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .chat-message.user {
          background: #e1e1e1; /* light gray for user messages */
          color: #333333;
          align-self: flex-end;
          border-bottom-right-radius: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .chat-input-form {
          display: flex;
          padding: 10px;
          background: #f5f5f5; /* light background for input area */
          border-top: 1px solid #ddd;
        }

        .chat-input-form input {
          flex: 1;
          border: none;
          border-radius: 10px;
          padding: 10px 15px;
          font-size: 1rem;
          background: #fff;
          color: #333;
          outline: none;
        }

        .chat-input-form input::placeholder {
          color: #999;
        }

        .chat-input-form button {
          background: #0078d7;
          border: none;
          color: white;
          padding: 0 20px;
          margin-left: 10px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s;
        }

        .chat-input-form button:hover {
          background: #005a99;
        }

        .categories-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px;
          background: #40414f;
          border-top: 1px solid #52525b;
          border-radius: 0 0 15px 15px;
        }

        .category-btn {
          background: #303136;
          color: #fff;
          border: none;
          padding: 8px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s;
        }

        .category-btn.selected {
          background: #10a37f;
        }

        .category-btn:hover {
          background: #50535a;
        }

        .confirm-btn {
          background: #10a37f;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          margin-left: auto;
          transition: background 0.3s;
        }

        .confirm-btn:hover {
          background: #0e8e6e;
        }

        @media (max-width: 768px) {
          .ai-chat-box {
            width: 90%;
            right: 5%;
            bottom: 10px;
            max-height: 400px;
          }
          .hamburger {
            display: block;
          }
          .nav-links {
            display: none;
            flex-direction: column;
            width: 100%;
            background-color: #003f66;
            position: absolute;
            top: 60px;
            left: 0;
            padding: 1rem 0;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
          }
          .nav-links.active {
            display: flex;
          }
          .nav-links li {
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            white-space: normal;
          }
          .nav-center {
            order: 3;
            width: 100%;
            margin-top: 0.5rem;
            justify-content: flex-start;
          }
          .nav-left {
            flex: none;
          }
          .nav-right {
            flex: none;
          }
        }
        .budget-slider-container {
          display: flex;
          flex-direction: column;
          padding: 10px;
          background: #40414f;
          border-top: 1px solid #52525b;
          border-radius: 0 0 15px 15px;
          gap: 10px;
        }
        .budget-slider-container input[type="range"] {
          width: 100%;
          -webkit-appearance: none;
          height: 8px;
          border-radius: 5px;
          background: #303136;
          outline: none;
          cursor: pointer;
        }
        .budget-slider-container input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10a37f;
          cursor: pointer;
          border: none;
          margin-top: -6px;
        }
        .budget-slider-container input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10a37f;
          cursor: pointer;
          border: none;
        }
        .budget-value {
          color: #fff;
          font-size: 1rem;
          text-align: center;
        }
        @media (max-width: 768px) {
          .sidebar-menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .sidebar-menu-item {
            padding: 15px 20px;
            margin: 8px 15px;
            border-radius: 12px;
            background-color: #005a8c;
            color: white;
            font-size: 1.1rem;
            text-align: center;
            cursor: pointer;
            transition: background-color 0.3s ease;
            user-select: none;
          }
          .sidebar-menu-item:hover {
            background-color: #0078d7;
          }
          .sidebar-menu-item.ai-button {
            background-color: #0e6eb8;
            font-weight: 600;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
          }
          .ai-chat-box {
            position: fixed;
            top: 60px;
            right: 10px;
            width: 90%;
            max-width: 400px;
            max-height: 600px;
            background: #ffffff;
            color: #333333;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 1500;
          }
          .ai-chat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 1rem;
            background-color: #003f66;
            color: white;
            font-weight: 600;
            font-size: 1.2rem;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
          }
          .ai-chat-close {
            cursor: pointer;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
