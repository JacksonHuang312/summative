import { useNavigate } from "react-router-dom";
import "./RegisterView.css";
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRef } from "react";
import { useStoreContext } from "../Context";

function Register() {
    const {
        setFirst,
        setLast,
        setEmail,
        setPassword,
        setSelected,
        setCurrentGenre,
        setLoggedIn
      } = useStoreContext();

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedGenres = Array.from(document.querySelectorAll('.Genre-select input:checked')).map(input => input.value);
        if (selectedGenres.length < 5) {
            alert("Please select at least 5 genres.");
            return;
        }

        if (confirmedPassword.current.value != password.current.value) {
            alert("Your passwords don't match!");
            return;
          }
      
          setFirst(firstName.current.value);
          setLast(lastName.current.value);
          setEmail(email.current.value);
          setPassword(password.current.value);
          setSelected(selectedGenres);
          setLoggedIn(true); // Set login state to true after successful registration

        navigate('/movies');
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
                        <button type="submit" className="Register-button">Register</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Register;