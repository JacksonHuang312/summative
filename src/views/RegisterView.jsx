import { useNavigate } from "react-router-dom";
import "./RegisterView.css";
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRef } from "react";
import { useStoreContext } from "../context";
import { auth, googleProvider, firestore } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Register() {
    const { setUser, setSelectedGenres } = useStoreContext();
    const navigate = useNavigate();

    const firstName = useRef('');
    const lastName = useRef('');
    const email = useRef('');
    const password = useRef('');
    const confirmedPassword = useRef('');

    const genres = [
        "Sci-Fi", "Thriller", "Adventure", "Family", "Animation",
        "Action", "History", "Fantasy", "Horror", "Comedy"
    ];

    const saveUserToFirestore = async (userEmail, userData) => {
        const userDocRef = doc(firestore, "users", userEmail);
        await setDoc(userDocRef, userData);
    };

    const handleGoogleSignIn = async () => {
        // Check genres first
        const selectedGenres = Array.from(document.querySelectorAll('.Genre-select input:checked')).map(input => input.value);
        if (selectedGenres.length < 5) {
            alert("Please select at least 5 genres before registering.");
            return;
        }

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Extract first and last name from displayName
            const names = user.displayName ? user.displayName.split(' ') : ['', ''];
            const firstName = names[0] || '';
            const lastName = names.slice(1).join(' ') || '';

            // Save user data to Firestore
            await saveUserToFirestore(user.email, {
                firstName,
                lastName,
                email: user.email,
                genres: selectedGenres
            });
            
            setUser(user);
            setSelectedGenres(selectedGenres);
            
            navigate('/movies');
        } catch (error) {
            console.error("Error with Google sign-in:", error);
            alert(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedGenres = Array.from(document.querySelectorAll('.Genre-select input:checked')).map(input => input.value);
        if (selectedGenres.length < 5) {
            alert("Please select at least 5 genres.");
            return;
        }

        if (confirmedPassword.current.value !== password.current.value) {
            alert("Your passwords don't match!");
            return;
        }

        try {
            // Check if email already exists
            const signInMethods = await fetchSignInMethodsForEmail(auth, email.current.value);
            if (signInMethods.length > 0) {
                alert("This email is already registered. Please use a different email or try logging in.");
                return;
            }

            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email.current.value,
                password.current.value
            );

            // Save user data to Firestore
            await saveUserToFirestore(email.current.value, {
                firstName: firstName.current.value,
                lastName: lastName.current.value,
                email: email.current.value,
                genres: selectedGenres
            });

            setUser(userCredential.user);
            setSelectedGenres(selectedGenres);

            navigate('/movies');
        } catch (error) {
            console.error("Error during registration:", error);
            alert(error.message);
        }
    };

    return (
        <div className="Register-view">
            <Header />
            <div className="Register-container">
                <div className="Register-box">
                    <h2>Register to Continue</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="Register-group">
                            <input type="text" placeholder="First Name" ref={firstName} required />
                        </div>
                        <div className="Register-group">
                            <input type="text" placeholder="Last Name" ref={lastName} required />
                        </div>
                        <div className="Register-group">
                            <input type="email" placeholder="Email" ref={email} required />
                        </div>
                        <div className="Register-group">
                            <input type="password" placeholder="Password" ref={password} required />
                        </div>
                        <div className="Register-group">
                            <input type="password" placeholder="Re-enter Password" ref={confirmedPassword} required />
                        </div>
                        <div className="Genre-select">
                            <h1>Select at least 5 Genres</h1>
                            {genres.map(genre => (
                                <div className="Genre-select-group" key={genre}>
                                    <input type="checkbox" id={genre} name={genre} value={genre} />
                                    <label htmlFor={genre}>{genre}</label>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="Register-button">Register with Email</button>
                    </form>
                    <div className="Register-divider">
                        <span>OR</span>
                    </div>
                    <button onClick={handleGoogleSignIn} className="Google-button">
                        Continue with Google
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Register;