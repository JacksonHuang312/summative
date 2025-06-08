import { useNavigate } from "react-router-dom";
import "./LoginView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRef } from "react";
import { useStoreContext } from "../context";
import { auth, googleProvider, firestore } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function LoginView() {
    const navigate = useNavigate();
    const { setUser, setSelectedGenres } = useStoreContext();
    
    const emailRef = useRef('');
    const passwordRef = useRef('');

    const checkUserInFirestore = async (email) => {
        const userDocRef = doc(firestore, "users", email);
        const userDoc = await getDoc(userDocRef);
        return userDoc.exists();
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Check if the user exists in Firestore
            const userExists = await checkUserInFirestore(user.email);
            if (!userExists) {
                alert("This Google account is not registered. Please register first.");
                navigate('/register');
                return;
            }

            // If user exists, proceed with login
            const userDocRef = doc(firestore, "users", user.email);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();
            
            setUser(user);
            setSelectedGenres(userData.genres || []);
            
            navigate('/movies');
        } catch (error) {
            console.error("Error with Google sign-in:", error);
            alert(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Check if email exists in Firestore first
            const userExists = await checkUserInFirestore(emailRef.current.value);
            if (!userExists) {
                alert("No account found with this email. Please register first.");
                navigate('/register');
                return;
            }

            // Try to sign in with email and password
            const userCredential = await signInWithEmailAndPassword(
                auth,
                emailRef.current.value,
                passwordRef.current.value
            );

            const user = userCredential.user;
            
            // Get user data from Firestore
            const userDocRef = doc(firestore, "users", user.email);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            setUser(user);
            setSelectedGenres(userData.genres || []);
            
            navigate('/movies');
        } catch (error) {
            console.error("Error during login:", error);
            if (error.code === 'auth/wrong-password') {
                alert("Incorrect password. Please try again.");
            } else if (error.code === 'auth/too-many-requests') {
                alert("Too many failed attempts. Please try again later.");
            } else {
                alert(error.message);
            }
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
                        <button type="submit" className="login-button">Login with Email</button>
                    </form>
                    <div className="login-divider">
                        <span>OR</span>
                    </div>
                    <button onClick={handleGoogleSignIn} className="google-button">
                        Continue with Google
                    </button>
                    <p className="register-prompt">
                        Don't have an account?  
                        <span className="register-link" onClick={() => navigate('/register')}> Register here </span>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LoginView;