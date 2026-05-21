"use client";
import React, { lazy, Suspense, useState, useEffect } from "react";
import NextImage from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import Movielist from "./HomePageData/Movielist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";
import { Movie } from "@/types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { motion } from "framer-motion";

const CustomLeftArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={() => onClick()}
      className="absolute left-4 md:left-6 lg:left-8 z-30 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-black/60 border border-white/15 text-white hover:bg-neutral-900 hover:scale-105 transition-all active:scale-95 cursor-pointer"
      aria-label="Previous Slide"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

const CustomRightArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={() => onClick()}
      className="absolute right-4 md:right-6 lg:right-8 z-30 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-black/60 border border-white/15 text-white hover:bg-neutral-900 hover:scale-105 transition-all active:scale-95 cursor-pointer"
      aria-label="Next Slide"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const heroResponsive = {
  all: {
    breakpoint: { max: 4000, min: 0 },
    items: 1,
  }
};

const CustomDot = ({ onClick, active, index }: any) => {
  return (
    <button
      className={`inline-block mx-1 rounded-full cursor-pointer transition-all duration-300 border-0 outline-none ${active ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white"
        }`}
      onClick={() => onClick()}
      title={`Slide ${index + 1}`}
      aria-label={`Slide ${index + 1}`}
    />
  );
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
            showDots={true}
            customDot={<CustomDot />}
            customLeftArrow={<CustomLeftArrow />}
            customRightArrow={<CustomRightArrow />}
            responsive={heroResponsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={6000}
            keyBoardControl={true}
            transitionDuration={800}
            arrows={!isMobile}
            swipeable={true}
            draggable={true}
            containerClass="relative w-full"
            dotListClass="custom-dot-list-style absolute bottom-6 left-0 right-0 flex justify-center z-20"
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

                <div className="absolute inset-0 flex flex-col items-start justify-end h-full text-left z-10">
                  <div className="container mx-auto px-4 md:px-12 pb-32 md:pb-44 lg:pb-50 w-full">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={staggerContainer}
                      className="max-w-2xl w-full ml-4 md:ml-10 lg:ml-14"
                    >
                      {/* Clean overlay without background */}
                      <div className=" w-full">
                        <motion.h1
                          variants={itemVariants}
                          className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white drop-shadow-2xl mb-4 leading-tight"
                        >
                          {movie.original_title}
                        </motion.h1>

                        <motion.div
                          variants={itemVariants}
                          className="flex flex-wrap items-center gap-4 md:gap-6 mb-4"
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
                            className="text-gray-300 text-base md:text-lg line-clamp-3 leading-relaxed drop-shadow-md"
                          >
                            {movie.overview}
                          </motion.p>
                        )}
                      </div>

                      <motion.div
                        variants={itemVariants}
                        className="flex gap-5 mt-4 md:mt-6"
                      >
                        <Link href={`/movie/${movie.id}`}>
                          <button className="px-8 py-3 md:px-10 md:py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transform hover:-translate-y-1">
                            View Details
                          </button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
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
