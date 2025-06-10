import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Header() {
  const navigate = useNavigate();
  const { user, setUser, setSelectedGenres, cart, setCart, authLoading, firstName } = useStoreContext();

  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleRegister = () => {
    navigate('/register');
  };

  const handleCart = () => {
    navigate('/cart');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleLogout = async () => {
    try {
      // Clear user data first
      setUser(null);
      setSelectedGenres([]);
      setCart(new Map());
      
      // Remove cart from localStorage with email-based key
      if (auth.currentUser?.email) {
        localStorage.removeItem(`cart-${auth.currentUser.email}`);
      }
      
      // Then sign out
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleHome = () => {
    if (user) {
      navigate('/movies');
    } else {
      navigate('/');
    }
  };

  const handleSearch = () => {
    navigate('/movies/search');
  };

  return (
    <header className="header">
      <h1 className="title" onClick={handleHome}>Fentstreams</h1>
        <div className="header-content">
        {!authLoading && user && (
          <>
            <div className="welcome-message">
              Hello {firstName || 'there'}!
            </div>
          </>
        )}

        <div className="buttons">
          {!authLoading && (user ? (
            <>
              <button className="header-button" onClick={handleSearch}>Search</button>
              <button className="header-button" onClick={handleCart}>
                Cart {cart.size > 0 ? `(${cart.size})` : ''}
              </button>
              <button className="header-button" onClick={handleSettings}>Settings</button>
              <button className="header-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="header-button" onClick={handleLogin}>Login</button>
              <button className="header-button" onClick={handleRegister}>Register</button>
            </>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;