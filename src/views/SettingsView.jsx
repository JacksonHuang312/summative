import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './SettingsView.css';

function Settings() {
    const navigate = useNavigate();
    const {
        user,
        authLoading,
        firstName,
        lastName,
        selectedGenres,
        updateUserProfile,
        purchaseHistory
    } = useStoreContext();

    const [newFirstName, setNewFirstName] = useState(firstName);
    const [newLastName, setNewLastName] = useState(lastName);
    const [selectedGenresList, setSelectedGenresList] = useState(selectedGenres);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        setNewFirstName(firstName);
        setNewLastName(lastName);
        setSelectedGenresList(selectedGenres);
    }, [firstName, lastName, selectedGenres]);

    if (authLoading) {
        return (
            <div className="settings-view">
                <Header />
                <div className="settings-container">
                    <div className="settings-box">
                        <h2>Loading...</h2>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    const genres = [
        "Sci-Fi", "Thriller", "Adventure", "Family", "Animation",
        "Action", "History", "Fantasy", "Horror", "Comedy"
    ];

    const handleGenreToggle = (genre) => {
        setSelectedGenresList(prev => {
            if (prev.includes(genre)) {
                return prev.filter(g => g !== genre);
            } else {
                return [...prev, genre];
            }
        });
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear any existing messages when submitting
        setMessage({ text: '', type: '' });

        if (selectedGenresList.length < 5) {
            showMessage("Please select at least 5 genres.", "error");
            return;
        }

        if (newPassword) {
            if (!currentPassword) {
                showMessage("Please enter your current password.", "error");
                return;
            }
            if (newPassword.length < 6) {
                showMessage("New password must be at least 6 characters long.", "error");
                return;
            }
            if (newPassword !== confirmPassword) {
                showMessage("New passwords don't match!", "error");
                return;
            }
        }

        const updates = {
            genres: selectedGenresList
        };

        const isEmailUser = user.providerData[0].providerId === 'password';
        if (isEmailUser) {
            updates.firstName = newFirstName;
            updates.lastName = newLastName;
            if (newPassword) {
                updates.newPassword = newPassword;
                updates.currentPassword = currentPassword;
            }
        }

        try {
            const success = await updateUserProfile(updates);
            if (success) {
                showMessage("Settings updated successfully!");
                setNewPassword('');
                setConfirmPassword('');
                setCurrentPassword('');
            }
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                showMessage("Current password is incorrect.", "error");
            } else if (error.code === 'auth/requires-recent-login') {
                showMessage("Please log out and log back in before changing your password.", "error");
            } else if (error.code === 'auth/weak-password') {
                showMessage("Password should be at least 6 characters long.", "error");
            } else {
                showMessage(error.message || "Error updating settings. Please try again.", "error");
            }
        }
    };

    const isEmailUser = user.providerData[0].providerId === 'password';

    return (
        <div className="settings-view">
            <Header />
            <div className="settings-container">
                <div className="settings-box">
                    <h2 className="settings-title">Account Settings</h2>
                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="settings-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={newFirstName}
                                onChange={(e) => setNewFirstName(e.target.value)}
                                disabled={!isEmailUser}
                                required
                            />
                        </div>
                        <div className="settings-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={newLastName}
                                onChange={(e) => setNewLastName(e.target.value)}
                                disabled={!isEmailUser}
                                required
                            />
                        </div>
                        <div className="settings-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                            />
                        </div>
                        
                        {isEmailUser && (
                            <div className="password-section">
                                <h3>Change Password</h3>
                                <div className="settings-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                                <div className="settings-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="settings-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

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

                    <div className="purchase-history">
                        <h3>Purchase History</h3>
                        {purchaseHistory.length > 0 ? (
                            <div className="purchase-list">
                                {purchaseHistory.map((purchase, index) => (
                                    <div key={index} className="purchase-item">
                                        <div className="purchase-header">
                                            <span className="purchase-date">
                                                {new Date(purchase.timestamp).toLocaleDateString()}
                                            </span>
                                            <span className="purchase-total">
                                                {Object.keys(purchase.items).length} items
                                            </span>
                                        </div>
                                        <div className="purchase-movies">
                                            {Object.values(purchase.items).map(movie => (
                                                <div key={movie.id} className="purchased-movie">
                                                    {movie.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-purchases">No purchase history yet</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Settings;