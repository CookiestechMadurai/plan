import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import Navbar from '../components/Navbar';  // Import the Navbar component

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchOrders = async () => {
    if (!user) return; // Return if no user is logged in
    setLoading(true);
    try {
      // Query to fetch orders, using 'vendorid' as the correct field
      const q = query(
        collection(db, 'placeorder'), // Target the 'placeorder' collection
        where('vendorid', '==', user.uid) // Ensure the vendorid matches the current user's uid
      );

      // Fetch orders using the query
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Orders fetched:', results);

      if (results.length === 0) {
        console.log("No orders found.");
      }

      setOrders(results);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const orderRef = doc(db, 'placeorder', orderId);
      await updateDoc(orderRef, { status });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error(`Failed to update order status to ${status}:`, err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <div style={styles.container}>
      <Navbar />  {/* Add the Navbar here */}
      <h2 style={styles.header}>Received Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders received.</p>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Mobile Number:</strong> {order.mobilenumber}</p>
              <p><strong>Location:</strong> {order.location}</p>
              <p><strong>Date of Event:</strong> {order.dateofevent}</p> {/* Displaying date of event */}
              <p><strong>Status:</strong> {order.status || 'Pending'}</p>
              <div style={styles.buttonGroup}>
                <button
                  style={{ ...styles.button, backgroundColor: '#4caf50' }}
                  onClick={() => handleUpdateStatus(order.id, 'Accepted')}
                  disabled={order.status === 'Accepted'}
                >
                  Accept
                </button>
                <button
                  style={{ ...styles.button, backgroundColor: '#f44336' }}
                  onClick={() => handleUpdateStatus(order.id, 'Rejected')}
                  disabled={order.status === 'Rejected'}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    padding: '1rem',
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
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
  },
  button: {
    padding: '0.5rem 1rem',
    border: 'none',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Orders;
