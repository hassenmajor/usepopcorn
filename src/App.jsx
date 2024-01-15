import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) => 
  arr.reduce((acc, cur, i, arr) => 
  acc + cur / arr.length, 0);

const KEY = "c18d9862";

export default function App() {
  let [watched, setWatched] = useState([]/*tempWatchedData*/);
  let [query, setQuery] = useState("");
  let [selectedId, setSelectedId] = useState(null);

  let {movies, isLoading, error} = useMovies(query, setSelectedId);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumberResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {
            isLoading? 
              <Loader /> 
            : error? 
              <ErrorMessage message={error} /> 
            : 
              <MovieList movies={movies} selectedId={selectedId} setSelectedId={setSelectedId} />
          }
        </Box>
        <Box>
          {
          selectedId?
            <MovieDetails watched={watched}
              setWatched={setWatched} 
              selectedId={selectedId} 
              setSelectedId={setSelectedId} />
          :
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} setWatched={setWatched} />
            </>
          }
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>
}
function ErrorMessage({message}) {
  return <p className="error">
    <span>🩸</span> {message}
  </p>
}

function NavBar({children}) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({query, setQuery}) {
  let inputElement = useRef(null);
  

  useEffect(function() {
    const callback = (event)=>{
      if (document.activeElement==inputElement.current)
        return;
      if (event.code == "Enter")
        inputElement.current.focus();
    }
    document.addEventListener('keydown', callback)
  }, [])

  return (
    <input className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}
function NumberResults({movies}) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Main({children}) {
  return (
    
    <main className="main">
      {children}
    </main>
  );
}
function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (children)}
    </div>
  );
}
function MovieList({movies, selectedId, setSelectedId}) {

  function handleSelectedMovie(id) {
    setSelectedId(selectedId=>(id==selectedId? null:id));
  }

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
      <li key={movie.imdbID} onClick={()=>handleSelectedMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
      ))}
    </ul>
  );
}
function MovieDetails({selectedId, setSelectedId, setWatched, watched}) {
  let [movie, setMovie] = useState({});
  let [isLoading, setIsLoading] = useState(false)
  let [userRating, setUserRating] = useState("");

  let countRef = useRef(0);
  useEffect(function() {
    if (userRating)
      countRef.current++;
  }, [userRating]);

  let isWatched = watched.map((movie)=>movie.imdbID).includes(selectedId);

  useEffect(function() {
    const callback = (event) => {
      if (event.code=="Escape")
        setSelectedId(null);
    }
    document.addEventListener('keydown', callback);
    return function() {
      document.addEventListener('keydown', callback);
    }
  }, []);
  
  function addWatchedMovie(watchedMovie) {
    let newWatchedMovie = {
      ...watchedMovie,
      userRating,
      countRef,
    };

    setWatched((watched)=>[...watched, newWatchedMovie])
    setSelectedId(null);
  }

  useEffect(function() {
    (async function() {
      setIsLoading(true);
      let res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}&r=json`)
      if (!res.ok)
        throw new Error("Sometning went wrong with fetching movies");
      let data = await res.json()
      console.log(data);
      setMovie(data);
      setIsLoading(false);
    })()
  }, [selectedId])

  useEffect(function() {
    if (movie.Title)
      document.title = `Movie | ${movie.Title}`;
    return function() {
      document.title = "usePopcorn";
    }
  }, [movie.Title])

  return (
    <div className="details">
      {
      isLoading? 
        <Loader /> :
        <>
        <header>
          <button className="btn-back" onClick={()=>setSelectedId(null)}>
            &larr;
          </button>
          <img src={movie.Poster} alt={`Poster of ${movie.Title}`} />
          <div className="details-overview">
            <h2>{movie.Title}</h2>
            <p>
              {movie.Released} &bull; {movie.Runtime}
            </p>
            <p>{movie.Genre}</p>
            <p>
              <span>⭐</span>
              {movie.imdbRating} IMDb rating
            </p>
          </div>
        </header>
        <section>
          <div className="rating">
            {!isWatched ?
              <>
              <StarRating maxRating={10} size={24} onRateChange={setUserRating} />
              {userRating>0 && 
              <button className="btn-add" onClick={()=>addWatchedMovie(movie)}>
                + Add to list
              </button>}
              </>
              :
              <p>
                You rated this movie 
                 {" "+watched.find((movie)=>movie.imdbID==selectedId)?.userRating}
                <span>🌟</span>
              </p>
            }
          </div>
          <p><em>{movie.Plot}</em></p>
          <p>Starring {movie.Actors}</p>
          <p>Directed by {movie.Director}</p>
        </section>
        </>
      }
    </div>
  )
}
function WatchedSummary({watched}) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime.replace(' min', '')));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedList({watched, setWatched}) {

  function deleteWatched(id) {
    setWatched((watched)=>watched.filter((movie)=>movie.imdbID!=id));
  }

  return (
    <ul className="list">
    {watched.map((movie) => (
      <li key={movie.imdbID}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.Runtime}</span>
          </p>
          <button className="btn-delete" onClick={()=>deleteWatched(movie.imdbID)}>
            X
          </button>
        </div>
      </li>
    ))}
    </ul>
  );
}
