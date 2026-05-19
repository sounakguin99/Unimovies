"use client";
import React, { lazy, Suspense, useState, useEffect } from "react";
import NextImage from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Link from "next/link";
import Movielist from "./HomePageData/Movielist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";
import { Movie } from "@/types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { motion } from "framer-motion";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Index() {
  const [fetchData, setFetchData] = useState<Movie[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Consider moving API key to environment variable: process.env.NEXT_PUBLIC_TMDB_API_KEY
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const ApiData = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}`,
      );
      const data = await res.json();
      setFetchData(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    ApiData();
  }, []);

  useEffect(() => {
    fetchData.forEach((movie) => {
      // Preload images
      if (typeof window !== "undefined") {
        const img = new Image();
        img.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
      }
    });
  }, [fetchData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="index-container bg-black min-h-screen text-white overflow-hidden">
      <div className="poster relative">
        {fetchData.length === 0 ? (
          <div className="h-[60vh] md:h-[85vh] w-full relative">
            <Skeleton height="100%" baseColor="#111" highlightColor="#333" />
          </div>
        ) : (
          <Carousel
            showThumbs={false}
            autoPlay={true}
            transitionTime={800}
            interval={6000}
            infiniteLoop={true}
            showStatus={false}
            showIndicators={true}
            showArrows={!isMobile}
            renderIndicator={(onClickHandler, isSelected, index, label) => {
              if (isSelected) {
                return (
                  <li
                    className="inline-block w-8 h-2 bg-blue-500 mx-1 rounded-full cursor-pointer transition-all duration-300"
                    aria-label={`Selected: ${label} ${index + 1}`}
                    title={`Selected: ${label} ${index + 1}`}
                  />
                );
              }
              return (
                <li
                  className="inline-block w-2 h-2 bg-white/50 hover:bg-white mx-1 rounded-full cursor-pointer transition-all duration-300"
                  onClick={onClickHandler}
                  onKeyDown={onClickHandler}
                  value={index}
                  key={index}
                  role="button"
                  tabIndex={0}
                  title={`${label} ${index + 1}`}
                  aria-label={`${label} ${index + 1}`}
                />
              );
            }}
          >
            {fetchData.map((movie, index) => (
              <div
                key={movie.id}
                className="relative h-[60vh] md:h-[90vh] w-full"
              >
                <NextImage
                  fill
                  priority={index === 0}
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.original_title || "Backdrop"}
                  className="object-cover object-top"
                />
                {/* Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 lg:p-24 flex flex-col items-start justify-end h-full text-left">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="max-w-4xl"
                  >
                    <motion.h1
                      variants={itemVariants}
                      className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl mb-4 leading-tight"
                    >
                      {movie.original_title}
                    </motion.h1>

                    <motion.div
                      variants={itemVariants}
                      className="flex flex-wrap items-center gap-4 md:gap-6 mb-6"
                    >
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-md text-sm md:text-lg font-semibold border border-white/20">
                        {movie.release_date}
                      </span>
                      <span className="flex items-center gap-2 text-lg md:text-xl font-bold text-yellow-400 drop-shadow-md">
                        <FontAwesomeIcon icon={faStar} />
                        <span className="text-white">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </span>
                    </motion.div>

                    {!isMobile && (
                      <motion.p
                        variants={itemVariants}
                        className="text-gray-300 text-lg md:text-xl line-clamp-3 mb-8 max-w-3xl leading-relaxed drop-shadow-md"
                      >
                        {movie.overview}
                      </motion.p>
                    )}

                    <motion.div variants={itemVariants} className="flex gap-4">
                      <Link href={`/movie/${movie.id}`}>
                        <button className="px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transform hover:-translate-y-1">
                          View Details
                        </button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            ))}
          </Carousel>
        )}

        <div className="container mx-auto px-4 md:px-8 mt-12 md:mt-24 z-10 relative">
          <Movielist />
        </div>

        {/* Replaced Streaming Partners and Contact Us with dynamic TMDB content (handled in Movielist) */}

        <Footer />
      </div>
    </div>
  );
}
