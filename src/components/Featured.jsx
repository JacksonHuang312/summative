import { useState, useEffect } from 'react';
import axios from 'axios';
import './Featured.css';

function Featured() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );
      const allMovies = response.data.results;
      const randomMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, 5);
      setMovies(randomMovies);
    };
    
    getData();
  }, []);

  return (
    <div className="featured-section">
      <h2 className="featured-title">Featured Movies</h2>
      <div className="movie-container">
        {movies && movies.map(movie => (
          <div className="movie-card" key={movie.id}>
            <h1>{`${movie.title}`}</h1>
            <img className="movie-poster" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Featured;