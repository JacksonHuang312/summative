import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './SettingsView.css';

function Settings() {
    const navigate = useNavigate();
    const {
        firstName,
        lastName,
        email,
        selectedGenres,
        setFirst,
        setLast,
        setSelected,
        loggedIn
    } = useStoreContext();

    const [newFirstName, setNewFirstName] = useState(firstName);
    const [newLastName, setNewLastName] = useState(lastName);
    const [selectedGenresList, setSelectedGenresList] = useState(selectedGenres);

    // Redirect if not logged in
    useEffect(() => {
        if (!loggedIn) {
            navigate('/login');
        }
    }, [loggedIn, navigate]);

    const genres = [
        "Sci-Fi", "Thriller", "Adventure", "Family", "Animation",
        "Action", "History", "Fantasy", "Horror", "Comedy"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate at least 5 genres are selected
        if (selectedGenresList.length < 5) {
            alert("Please select at least 5 genres.");
            return;
        }

        // Update user information
        setFirst(newFirstName);
        setLast(newLastName);
        setSelected(selectedGenresList);
        alert("Settings updated successfully!");
    };

    const handleGenreToggle = (genre) => {
        setSelectedGenresList(prev => {
            if (prev.includes(genre)) {
                return prev.filter(g => g !== genre);
            } else {
                return [...prev, genre];
            }
        });
    };

    return (
        <div className="settings-view">
            <Header />
            <div className="settings-container">
                <div className="settings-box">
                    <h2 className="settings-title">Account Settings</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="settings-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={newFirstName}
                                onChange={(e) => setNewFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="settings-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={newLastName}
                                onChange={(e) => setNewLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="settings-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                            />
                        </div>
                        <div className="genre-select">
                            <h3>Update Preferred Genres (Select at least 5)</h3>
                            {genres.map(genre => (
                                <div className="genre-select-group" key={genre}>
                                    <input
                                        type="checkbox"
                                        id={genre}
                                        checked={selectedGenresList.includes(genre)}
                                        onChange={() => handleGenreToggle(genre)}
                                    />
                                    <label htmlFor={genre}>{genre}</label>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="settings-button">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Settings;