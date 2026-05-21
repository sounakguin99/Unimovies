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
import { motion } from "framer-motion";
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
    items: 8,
  },
  desktop: {
    breakpoint: { max: 1536, min: 1024 },
    items: 7,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 2,
  },
};

const listVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const MovieItem = React.memo(({ movie, type }: MovieItemProps) => (
  <div className="relative group px-2 cursor-pointer h-full pb-8">
    <Link href={`/${type}/${movie.id}`} className="block h-full">
      <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 transform group-hover:scale-[1.03] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-gray-900 aspect-[2/3]">
        <LazyLoadImage
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt={type === "movie" ? movie.original_title : movie.original_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          effect="blur"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
          <h3 className="text-white font-bold text-lg md:text-xl line-clamp-2 mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {type === "movie" ? movie.original_title : movie.original_name}
          </h3>
          <p className="text-blue-400 text-sm font-medium mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {type === "movie" ? movie.release_date : movie.first_air_date}
          </p>
          <p className="text-gray-300 text-xs md:text-sm line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
            {movie.overview}
          </p>
        </div>
      </div>
    </Link>
  </div>
));

const CustomButtonGroup = ({ next, previous, ...rest }: any) => {
  return (
    <div className="hidden md:flex absolute top-0 right-4 gap-3 z-10">
      <button 
        onClick={() => previous && previous()}
        className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-gray-700 hover:bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:border-gray-500 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      >
        <svg className="w-5 h-5 pr-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={() => next && next()}
        className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-gray-700 hover:bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:border-gray-500 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      >
        <svg className="w-5 h-5 pl-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
};


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

  const [trendingData, setTrendingData] = useState<any[]>([]);
  const [nowPlayingData, setNowPlayingData] = useState<Movie[]>([]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      
      const [trendingRes, nowPlayingRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}`),
        dispatch(fetchTopRatedMovies()),
        dispatch(fetchPopularTvShows()),
        dispatch(fetchPopularMovies()),
        dispatch(fetchUpcomingMovies()),
        dispatch(fetchPopularAnimationTvShows()),
      ]);

      const trendingJson = await trendingRes.json();
      const nowPlayingJson = await nowPlayingRes.json();
      
      setTrendingData(trendingJson.results || []);
      setNowPlayingData(nowPlayingJson.results || []);
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
    arrows: false,
    renderButtonGroupOutside: true,
    customButtonGroup: <CustomButtonGroup />,
  };

  if (loading) {
    return (
      <div className="space-y-16 md:space-y-24">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="movie-section relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-8 bg-gray-800 rounded-full"></div>
              <Skeleton width={250} height={35} baseColor="#111" highlightColor="#333" />
            </div>
            <Carousel {...carouselSettings}>
              {[...Array(10)].map((_, j) => (
                <div key={j} className="px-2 pb-8 h-full">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-[2/3]">
                    <Skeleton height="100%" baseColor="#111" highlightColor="#222" style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const uniqueUpcomingMovies = removeDuplicatesByPath(upcomingMovies);



  return (
    <div className="space-y-16 md:space-y-24">
      {trendingData.length > 0 && (
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={listVariants}
          className="movie-section relative"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-8 bg-gradient-to-t from-orange-500 to-red-500 rounded-full"></div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">Trending This Week</h2>
          </div>
          <Carousel {...carouselSettings}>
            {trendingData.map((item: any, index: number) => (
              <MovieItem key={`${item.id}-${index}`} movie={item} type={item.media_type || "movie"} />
            ))}
          </Carousel>
        </motion.section>
      )}

      {nowPlayingData.length > 0 && (
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={listVariants}
          className="movie-section relative"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-8 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full"></div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">Now Playing In Theaters</h2>
          </div>
          <Carousel {...carouselSettings}>
            {nowPlayingData.map((movie: Movie, index: number) => (
              <MovieItem key={`${movie.id}-${index}`} movie={movie} type="movie" />
            ))}
          </Carousel>
        </motion.section>
      )}

      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={listVariants}
        className="movie-section relative"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Popular TV Shows</h2>
        </div>
        <Carousel {...carouselSettings}>
          {popularTvShows.map((movie: TVShow, index: number) => (
            <MovieItem key={`${movie.id}-${index}`} movie={movie} type="tv" />
          ))}
        </Carousel>
      </motion.section>

      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={listVariants}
        className="movie-section relative"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Top-Rated Movies</h2>
        </div>
        <Carousel {...carouselSettings}>
          {topRatedMovies.map((movie: Movie, index: number) => (
            <MovieItem key={`${movie.id}-${index}`} movie={movie} type="movie" />
          ))}
        </Carousel>
      </motion.section>

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={listVariants}
        className="hidden md:block"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-8 bg-red-500 rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Latest Movie Trailers</h2>
        </div>
        <LatestMovieTrailers />
      </motion.div>

      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={listVariants}
        className="movie-section relative"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-8 bg-green-500 rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Popular Movies</h2>
        </div>
        <Carousel {...carouselSettings}>
          {popularMovies.map((movie: Movie, index: number) => (
            <MovieItem key={`${movie.id}-${index}`} movie={movie} type="movie" />
          ))}
        </Carousel>
      </motion.section>

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={listVariants}
        className="pt-4"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
          <p className="text-2xl md:text-4xl font-black tracking-tight">Exclusively on Hotstar</p>
        </div>
        <a
          href="https://www.hotstar.com/in/home?ref=%2Fin"
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-3xl shadow-2xl transition-transform hover:scale-[1.02] duration-500"
        >
          <img
            src="Images/banner.webp"
            className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
            alt="Hotstar Banner"
          />
        </a>
      </motion.div>

      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={listVariants}
        className="movie-section relative"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Popular Anime</h2>
        </div>
        <Carousel {...carouselSettings}>
          {popularAnimationTvShows.map((movie: TVShow, index: number) => (
            <MovieItem key={`${movie.id}-${index}`} movie={movie} type="tv" />
          ))}
        </Carousel>
      </motion.section>

      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={listVariants}
        className="movie-section relative"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-8 bg-pink-500 rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Upcoming Movies</h2>
        </div>
        <Carousel {...carouselSettings}>
          {uniqueUpcomingMovies.map((movie: Movie, index: number) => (
            <MovieItem key={`${movie.id}-${index}`} movie={movie} type="movie" />
          ))}
        </Carousel>
      </motion.section>
    </div>
  );
};

export default MovieList;
