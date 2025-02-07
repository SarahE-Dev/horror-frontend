import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {}
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      if(token){
        const userData = jwtDecode(token);
        setUser(userData);
      
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async(token) => {
    try {
      localStorage.setItem('token', token);
      const userData = await jwtDecode(token);
      setUser(userData);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Clear storage
      localStorage.removeItem('token');
      
      // Clear state
      setUser(null);
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update user function
  const updateUser = (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  // Create the context value object
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser
  };

  // Return the provider with the value
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create the custom hook for using the auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export everything needed
export { AuthProvider, useAuth };