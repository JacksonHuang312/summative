import './SearchView.css';
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useStoreContext } from "../context";

function SearchView() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { cart, updateCart, purchaseHistory } = useStoreContext();

    // Handle debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [query]);

    // Reset page when query changes
    useEffect(() => {
        setPage(1);
    }, [debouncedQuery]);

    const isMoviePurchased = (movieId) => {
        return purchaseHistory.some(purchase => 
            Object.values(purchase.items).some(item => item.id === movieId)
        );
    };

    const handleAddToCart = (movie) => {
        if (isMoviePurchased(movie.id)) {
            alert("You already own this movie!");
            return;
        }
        updateCart(cart.set(movie.id, movie));
    };

    const handleRemoveFromCart = (movieId) => {
        updateCart(cart.delete(movieId));
    };

    const fetchSearchResults = useCallback(async () => {
        if (!debouncedQuery.trim()) {
            setMovies([]);
            setTotalPages(0);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${encodeURIComponent(debouncedQuery)}&page=${page}`
            );
            setMovies(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error("Error searching movies:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery, page]);

    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);

    return (
        <div className='search-view'>
            <div className="main-content">
                <div className="search-container">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search for movies..." 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                    />
                </div>
                
                {loading ? (
                    <div className="loading">Searching...</div>
                ) : (
                    <div>
                        {debouncedQuery && (
                            <h2 className="search-results-title">
                                Results for "{debouncedQuery}" {totalPages > 0 ? `(Page ${page} of ${totalPages})` : ''}
                            </h2>
                        )}
                        
                        <div className="search-results">
                            {movies.length > 0 ? (
                                movies.map((movie) => {
                                    const isPurchased = isMoviePurchased(movie.id);
                                    return (
                                        <div key={movie.id} className="search-result-item">
                                            <div className="search-result-poster">
                                                <Link to={`/movies/details/${movie.id}`}>
                                                    {movie.poster_path ? (
                                                        <img 
                                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                                                            alt={movie.title} 
                                                            className="search-result-image"
                                                        />
                                                    ) : (
                                                        <div className="no-image">No Image Available</div>
                                                    )}
                                                </Link>
                                            </div>
                                            <h3 className="movie-title">{movie.title}</h3>
                                            {isPurchased ? (
                                                <button 
                                                    className="cart-button purchased"
                                                    disabled
                                                >
                                                    Owned
                                                </button>
                                            ) : cart.has(movie.id) ? (
                                                <button 
                                                    className="cart-button added"
                                                    onClick={() => handleRemoveFromCart(movie.id)}
                                                >
                                                    Remove
                                                </button>
                                            ) : (
                                                <button 
                                                    className="cart-button"
                                                    onClick={() => handleAddToCart(movie)}
                                                >
                                                    Buy
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                debouncedQuery && <p className="no-results">No movies found for your search</p>
                            )}
                        </div>
                        
                        {totalPages > 0 && (
                            <div className="pagination">
                                <button 
                                    className="pagination-button" 
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                                    disabled={page <= 1}
                                >
                                    Previous
                                </button>
                                <span className="page-info">Page {page} of {totalPages}</span>
                                <button 
                                    className="pagination-button" 
                                    onClick={() => setPage(prev => prev < totalPages ? prev + 1 : prev)} 
                                    disabled={page >= totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchView;