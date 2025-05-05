import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userRef = collection(db, 'user');
      const q = query(userRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('No user found. Please sign up.');
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home', { state: { showInstallPrompt: true } });
    } catch (error) {
      alert(error.message);
    }
  };

  const EyeIcon = ({ visible }) => (
    <div style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
      {visible ? (
        // Open eye
        <svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 24 24" fill="none" stroke="#003f66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        // New Closed eye
        <svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 24 24" fill="none" stroke="#003f66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.66 21.66 0 014.56-5.94M1 1l22 22" />
          <path d="M9.53 9.53a3.5 3.5 0 014.95 4.95" />
        </svg>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.tabContainer}>
          <h2 style={{ ...styles.tab, borderBottom: '2px solid #003f66' }}>Login</h2>
          <h2 style={{ ...styles.tab, color: '#0077cc', cursor: 'pointer' }} onClick={() => navigate('/signup')}>Sign up</h2>
        </div>

        <h1 style={styles.heading}>WELCOME</h1>
        <p style={styles.subtext}>Let's get started by filling out the form below.</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...styles.input, paddingRight: '40px' }}
            />
            <EyeIcon visible={showPassword} />
          </div>

          <button type="submit" style={styles.button}>Get Started</button>
        </form>

        <p style={styles.forgot}>Forgot Password?</p>
        <p style={styles.terms}>
          By clicking "Get Started," you agree to Our App<br />
          <strong>Privacy Policy</strong> and <strong>Terms & Conditions</strong>
        </p>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#e6efff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
    border: '2px solid #003f66',
    textAlign: 'center',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  tab: {
    fontSize: '18px',
    fontWeight: '500',
    paddingBottom: '5px',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#003f66',
  },
  subtext: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: '50px',
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    borderRadius: '30px',
    border: '2px solid #003f66',
    backgroundColor: '#e6efff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  eyeIcon: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: '15px',
    fontSize: '16px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#003f66',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  },
  forgot: {
    marginTop: '10px',
    color: '#333',
    fontWeight: '500',
  },
  terms: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#333',
  },
};

export default Login;
