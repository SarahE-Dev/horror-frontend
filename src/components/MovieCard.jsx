const MovieCard = ({ movie }) => {
    return (
      <div className="bg-gray-800 w-66 m-7 rounded-lg overflow-hidden shadow-lg hover:transform hover:scale-105 transition-transform">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-white text-xl font-bold mb-2">{movie.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-3">{movie.overview}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-red-500 text-sm">
              Rating: {movie.vote_average}
            </span>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default MovieCard;