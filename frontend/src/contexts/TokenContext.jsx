import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserTokens } from '../services/tokenService';
import { useAuth } from './AuthContext';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokenBalance, setTokenBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchTokenBalance = async () => {
    if (!currentUser) {
      setTokenBalance(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getUserTokens();
      if (response.success) {
        setTokenBalance(response.data.balance);
      } else {
        setError("Failed to load token data");
      }
    } catch (err) {
      console.error("Error fetching token data:", err);
      setError("Error loading token balance");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tokens when user changes
  useEffect(() => {
    fetchTokenBalance();
    
    // Refresh token balance every 15 seconds
    const interval = setInterval(fetchTokenBalance, 15000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Function to manually update token balance
  const updateTokenBalance = (newBalance) => {
    setTokenBalance(newBalance);
  };

  return (
    <TokenContext.Provider
      value={{
        tokenBalance,
        loading,
        error,
        fetchTokenBalance,
        updateTokenBalance
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => useContext(TokenContext);

export default TokenContext; 