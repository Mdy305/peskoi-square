import React, { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const SquareContext = createContext(null);

export const useSquare = () => {
  const context = useContext(SquareContext);
  if (!context) {
    throw new Error('useSquare must be used within SquareProvider');
  }
  return context;
};

export default function SquareProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    connected: false,
    merchantId: null,
    locationId: null,
    locationName: null,
    error: null
  });

  useEffect(() => {
    loadSquareConnection();
  }, []);

  const loadSquareConnection = async () => {
    try {
      const user = await base44.auth.me();
      
      if (!user?.square_connected || !user?.square_merchant_id) {
        setState({
          loading: false,
          connected: false,
          merchantId: null,
          locationId: null,
          locationName: null,
          error: null
        });
        return;
      }

      // Fetch active connection
      const connections = await base44.entities.SquareConnection.filter({
        merchant_id: user.square_merchant_id,
        status: 'active'
      });

      if (connections.length === 0) {
        setState({
          loading: false,
          connected: false,
          merchantId: user.square_merchant_id,
          locationId: null,
          locationName: null,
          error: 'No active connection found'
        });
        return;
      }

      const connection = connections[0];
      setState({
        loading: false,
        connected: true,
        merchantId: connection.merchant_id,
        locationId: connection.location_id,
        locationName: connection.location_name,
        error: null
      });

    } catch (error) {
      console.error('Square connection load error:', error);
      setState({
        loading: false,
        connected: false,
        merchantId: null,
        locationId: null,
        locationName: null,
        error: error.message
      });
    }
  };

  const refresh = () => {
    setState(prev => ({ ...prev, loading: true }));
    loadSquareConnection();
  };

  return (
    <SquareContext.Provider value={{ ...state, refresh }}>
      {children}
    </SquareContext.Provider>
  );
}