import { Outlet, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./MovieView.css";

function MovieView() {
    const genres = [
        { genre: "Sci-Fi", id: 878 },
        { genre: "Thriller", id: 53 },
        { genre: "Adventure", id: 12 },
        { genre: "Family", id: 10751 },
        { genre: "Animation", id: 16 },
        { genre: "Action", id: 28 },
        { genre: "History", id: 36 },
        { genre: "Fantasy", id: 14 },
        { genre: "Horror", id: 27 },
        { genre: "Comedy", id: 35 }
    ];

    return (
        <div className="app-container">
            <Header />
            <h1 className="movieview-title">Movies by Genre</h1>
            <div className="genre-container">
                <div className="genre-list">
                    {genres.map(genre => (
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