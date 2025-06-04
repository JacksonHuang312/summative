import { useNavigate } from "react-router-dom";
import "./LoginView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStoreContext } from "../context";
import { useRef } from "react";

function LoginView() {
    const navigate = useNavigate();
    const { email: storedEmail, password: storedPassword, setLoggedIn } = useStoreContext();
    const emailRef = useRef('');
    const passwordRef = useRef('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // If no stored credentials, redirect to register
        if (!storedEmail || !storedPassword) {
            alert("No account found. Please register first.");
            navigate('/register');
            return;
        }

        // Check if credentials match
        if (emailRef.current.value === storedEmail && 
            passwordRef.current.value === storedPassword) {
            setLoggedIn(true);
            navigate('/movies');
        } else {
            alert("Invalid email or password!");
        }
    };

    return (
        <div className="login-view">
            <Header />
            <div className="login-container">
                <div className="login-box">
                    <h2>Login to Continue</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input type="email" placeholder="Email" ref={emailRef} required/>
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Password" ref={passwordRef} required/>
                        </div>
                        <button type="submit" className="login-button">Login</button>
                        <p className="register-prompt">
                            Don't have an account?  
                            <span className="register-link" onClick={() => navigate('/register')}> Register here </span>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LoginView;