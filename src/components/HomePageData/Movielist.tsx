"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPopularTvShows,
  fetchTopRatedMovies,
  fetchPopularMovies,
  fetchUpcomingMovies,
  fetchPopularAnimationTvShows,
} from "../../store/AllmovieSlice";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import LatestMovieTrailers from "../HomePageData/LatestMovieTrailers";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Movie, TVShow } from "@/types";
import { RootState, AppDispatch } from "@/store/store";

const removeDuplicatesByPath = (array: any[]) => {
  const seen = new Set();
  return array.filter((item) => {
    const path = item.poster_path;
    if (seen.has(path)) {
      return false;
    }
    seen.add(path);
    return true;
  });
};

interface MovieItemProps {
  movie: any;
  type: "movie" | "tv";
}

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1536 },
    items: 7,
  },
  desktop: {
    breakpoint: { max: 1536, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 2,
  },
};

const MovieItem = React.memo(({ movie, type }: MovieItemProps) => (
  <div className="movie-item">
    <Link
      href={`/${type}/${movie.id}`}
      style={{ textDecoration: "none", color: "white" }}
    >
      <LazyLoadImage
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt={type === "movie" ? movie.original_title : movie.original_name}
        className="cards__img"
        effect="blur"
        placeholderSrc="path/to/placeholder-image.jpg"
      />
      <div className="hidden md:block">
        <div className="cards__overlay">
          <div className="card__title">
            {type === "movie" ? movie.original_title : movie.original_name}
          </div>
          <div className="card__runtime">
            {type === "movie" ? movie.release_date : movie.first_air_date}
          </div>
          <div className="card__description">
            {movie.overview.slice(0, 115) + "..."}
          </div>
        </div>
      </div>
    </Link>
  </div>
));

const MovieList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    popularTvShows,
    topRatedMovies,
    upcomingMovies,
    popularMovies,
    popularAnimationTvShows,
    status,
    error,
  } = useSelector((state: RootState) => state.tmdb);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        dispatch(fetchTopRatedMovies()),
        dispatch(fetchPopularTvShows()),
        dispatch(fetchPopularMovies()),
        dispatch(fetchUpcomingMovies()),
        dispatch(fetchPopularAnimationTvShows()),
      ]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      fetchAllData();
    }
  }, [status, fetchAllData]);

  useEffect(() => {
    if (status === "succeeded") {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-8">
            <Skeleton
              width={200}
              height={30}
              className="mb-4"
              baseColor="#202020"
              highlightColor="#444"
            />
            <div className="flex gap-4 overflow-hidden">
              {[...Array(12)].map((_, j) => (
                <div
                  key={j}
                  className="flex-shrink-0"
                  style={{ width: "160px" }}
                >
                  <Skeleton
                    height={240}
                    className="mb-2"
                    baseColor="#202020"
                    highlightColor="#444"
                  />
                  <Skeleton
                    width={120}
                    height={20}
                    className="mb-1"
                    baseColor="#202020"
                    highlightColor="#444"
                  />
                  <Skeleton
                    width={80}
                    height={15}
                    baseColor="#202020"
                    highlightColor="#444"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const uniqueUpcomingMovies = removeDuplicatesByPath(upcomingMovies);

  const carouselSettings = {
    responsive,
    infinite: true,
    autoPlay: true,
    autoPlaySpeed: 5000,
    keyBoardControl: true,
    transitionDuration: 1000,
    swipeable: true,
    draggable: true,
    showDots: false,
    arrows: isDesktop, // Show arrows only on desktop
  };

  return (
    <div>
      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Popular TV Shows
        </h2>
        <Carousel {...carouselSettings}>
          {popularTvShows.map((movie: TVShow) => (
            <MovieItem key={movie.id} movie={movie} type="tv" />
          ))}
        </Carousel>
      </section>

      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Top-Rated Movies
        </h2>
        <Carousel {...carouselSettings}>
          {topRatedMovies.map((movie: Movie) => (
            <MovieItem key={movie.id} movie={movie} type="movie" />
          ))}
        </Carousel>
      </section>

      <div className="hidden md:block">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Latest Movie Trailers
        </h2>
        <LatestMovieTrailers />
      </div>

      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Popular Movies
        </h2>
        <Carousel {...carouselSettings}>
          {popularMovies.map((movie: Movie) => (
            <MovieItem key={movie.id} movie={movie} type="movie" />
          ))}
        </Carousel>
      </section>

      <div className="pt-0">
        <p className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Exclusively on Hotstar
        </p>
        <a
          href="https://www.hotstar.com/in/home?ref=%2Fin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="Images/banner.webp"
            className="opacity-90"
            alt="Hotstar Banner"
          />
        </a>
      </div>

      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Popular Anime
        </h2>
        <Carousel {...carouselSettings}>
          {popularAnimationTvShows.map((movie: TVShow) => (
            <MovieItem key={movie.id} movie={movie} type="tv" />
          ))}
        </Carousel>
      </section>

      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Upcoming Movies
        </h2>
        <Carousel {...carouselSettings}>
          {uniqueUpcomingMovies.map((movie: Movie) => (
            <MovieItem key={movie.id} movie={movie} type="movie" />
          ))}
        </Carousel>
      </section>
    </div>
  );
};

export default MovieList;
