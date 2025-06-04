import { useNavigate } from "react-router-dom";
import "./ErrorView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ErrorView() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="error-view">
            <Header />
            <div className="error-container">
                <div className="error-content">
                    <h1 className="error-title">404</h1>
                    <h2 className="error-subtitle">Page Not Found</h2>
                    <p className="error-message">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                    <button className="error-button" onClick={handleGoHome}>
                        Return to Home
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ErrorView;