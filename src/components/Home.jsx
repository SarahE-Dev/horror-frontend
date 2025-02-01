// src/components/Home.jsx
const Home = () => {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-black">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Horror <span className="text-red-600">Collection</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto text-center">
              Discover and share your favorite horror movies, stories, and experiences
              with fellow enthusiasts.
            </p>
            <div className="mt-8">
              <button className="bg-red-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-red-700 transition-colors">
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;