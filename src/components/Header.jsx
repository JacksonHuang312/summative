import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../Context';

function Header() {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, firstName } = useStoreContext();

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

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleSearch = () => {
    navigate('/movies/search');
  };

  return (
    <header className="header">
      <h1 className="title" onClick={handleHome}>Fentstreams</h1>
      
      <div className="header-content">
        {loggedIn && (
          <>
            <div className="welcome-message">
              Hello {firstName}!
            </div>
          </>
        )}

        <div className="buttons">
          {!loggedIn ? (
            <>
              <button className="nav-button" onClick={handleLogin}>Login</button>
              <button className="nav-button" onClick={handleRegister}>Register</button>
            </>
          ) : (
            <>
              <button className="nav-button" onClick={handleSearch}>Search</button>
              <button className="nav-button" onClick={handleCart}>Cart</button>
              <button className="nav-button" onClick={handleSettings}>Settings</button>
              <button className="nav-button" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;