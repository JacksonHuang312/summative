import { Outlet, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./MovieView.css";
import { useStoreContext } from "../Context";

function MovieView() {
    const { selectedGenres } = useStoreContext();
    
    const genreIds = {
        "Sci-Fi": 878,
        "Thriller": 53,
        "Adventure": 12,
        "Family": 10751,
        "Animation": 16,
        "Action": 28,
        "History": 36,
        "Fantasy": 14,
        "Horror": 27,
        "Comedy": 35
    };

    // Convert selected genre names to objects with id and genre
    const selectedGenreObjects = selectedGenres.map(genreName => ({
        genre: genreName,
        id: genreIds[genreName]
    }));

    return (
        <div className="app-container">
            <Header />
            <h1 className="movieview-title">Movies by Genre</h1>
            <div className="genre-container">
                <div className="genre-list">
                    {selectedGenreObjects.map(genre => (
                        <Link
                            key={genre.id}
                            to={`/movies/genre/${genre.id}`}
                            className="genre-item"
                        >
                            {genre.genre}
                        </Link>
                    ))}
                </div>
                <div className="genre-movies">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MovieView;