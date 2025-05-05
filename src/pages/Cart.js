// src/pages/Cart.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'placeorder'), where('userid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    if (status === 'Rejected') return { color: 'red' };
    if (status === 'Accepted') return { color: 'green' };
    return {};
  };

  const handleChatClick = (vendorId, vendorName) => {
    if (!vendorId || !vendorName) return;
    navigate(`/messages?vendorId=${vendorId}&vendorName=${encodeURIComponent(vendorName)}`);
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.header}>Your Orders</h2>
        {loading ? (
          <p>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <p><strong>Company Name:</strong> {order.businessname}</p>
                <p><strong>Location:</strong> {order.location}</p>
                <p><strong>Date of Event:</strong> {order.dateofevent}</p>
                <p style={getStatusColor(order.status)}>
                  <strong>Status:</strong> {order.status || 'Pending'}
                </p>
                <button
                  style={styles.chatButton}
                  onClick={() => handleChatClick(order.vendorid || order.businessid, order.businessname)}
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '1rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#003f66',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  orderCard: {
    padding: '1rem',
    backgroundColor: '#f1f1f1',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  chatButton: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#003f66',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Cart;
