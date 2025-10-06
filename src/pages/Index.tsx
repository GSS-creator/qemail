import React, { useState } from 'react';
import LoginWindow from '@/components/LoginWindow';
import EmailInterface from '@/components/EmailInterface';
import { toast } from 'sonner';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [authToken, setAuthToken] = useState('');

  const handleLogin = (user: string, token: string) => {
    setIsAuthenticated(true);
    setUsername(user);
    setAuthToken(token);
    // Set the auth token in the API service
    import('@/services/api').then(({ qemailApi }) => {
      qemailApi.setToken(token);
    }).catch((error) => {
      console.error('Failed to set auth token:', error);
    });
    toast.success(`Welcome to QSSN Email System, ${user}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setAuthToken('');
    toast.info('Logged out successfully');
  };

  return (
    <div className="min-h-screen">
      {!isAuthenticated ? (
        <LoginWindow onLogin={handleLogin} />
      ) : (
        <EmailInterface username={username} authToken={authToken} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;