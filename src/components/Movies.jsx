import React, { useEffect, useState } from 'react'
import MovieCard from './MovieCard';

function Movies() {
    const [movies, setMovies] = useState([]);
    console.log(movies);
    useEffect(() => {
        fetch('http://localhost:5000/movies')
            .then(response => response.json())
            .then(data => setMovies(data.results))
            .catch(error => console.error('Error fetching movies:', error));
    }, [])
  return (
    <div>
        <h1>Movies</h1>
        <div className='flex justify-center items-center flex-wrap w-full'>
            {movies.map((movie)=>(
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
        
    </div>
  )
}

export default Movies