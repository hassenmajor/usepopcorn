import { useState, useEffect } from "react";

const KEY = "c18d9862";

export function useMovies(query, setSelectedId) {
  let [movies, setMovies] = useState([]/*tempMovieData*/);
  let [isLoading, setIsLoading] = useState(false)
  let [error, setError] = useState("");

  useEffect(function() {
    if (query.length<3) {
      setMovies([]);
      setError("");
      return;
    }
    const controller = new AbortController();
    (async function() {
      setSelectedId(null);
      setIsLoading(true);
      setError("");
      try {
        let res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}&r=json`,
          { signal: controller.signal },
        );
        if (!res.ok)
          throw new Error("Sometning went wrong with fetching movies");
        let data = await res.json()
        if (data.Error)
          throw new Error(data.Error)
        setMovies(data.Search);
        setError("");
      } catch(err) {
        if (err.name!="AbortError")
          setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })()

    return function() {
      controller.abort();
    }
  }, [query]);

  return {movies, isLoading, error};
}
