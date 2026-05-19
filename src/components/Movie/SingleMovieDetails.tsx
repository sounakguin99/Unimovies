"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from "react-responsive";

import FullScreenImage from "@/components/ui/FullScreenImage";

const CustomHeaderWithArrows = ({ next, previous, title, showArrows }: any) => (
  <div className="flex items-center justify-between mb-4 mt-12 px-2">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-7 bg-blue-500 rounded-full inline-block"></div>
      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
        {title}
      </h2>
    </div>
    {showArrows && (
      <div className="flex items-center gap-2">
        <button
          onClick={() => previous?.()}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900/80 backdrop-blur-md border border-white/10 hover:border-blue-500 hover:bg-gray-800 text-white flex items-center justify-center transition-all shadow-lg active:scale-95 group"
          aria-label="Previous"
        >
          <svg
            className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => next?.()}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900/80 backdrop-blur-md border border-white/10 hover:border-blue-500 hover:bg-gray-800 text-white flex items-center justify-center transition-all shadow-lg active:scale-95 group"
          aria-label="Next"
        >
          <svg
            className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    )}
  </div>
);

interface CarouselProps {
  items: any[];
  responsive: any;
  renderItem: (item: any, index: number) => React.ReactNode;
  autoPlay: boolean;
  showArrows?: boolean;
  title: string;
}

// Memoized Carousel component to prevent unnecessary re-renders
const MemoizedCarousel = React.memo(
  ({
    items,
    responsive,
    renderItem,
    autoPlay,
    showArrows,
    title,
  }: CarouselProps) => (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={autoPlay}
      autoPlaySpeed={5000}
      keyBoardControl={true}
      transitionDuration={1000}
      arrows={false}
      showDots={false}
      containerClass="carousel-container"
      itemClass="carousel-item"
      draggable={true} // Enable dragging
      swipeable={true} // Enable swiping
      renderButtonGroupOutside={true}
      customButtonGroup={
        <CustomHeaderWithArrows title={title} showArrows={showArrows} />
      }
    >
      {items.map((item, index) => renderItem(item, index))}
    </Carousel>
  ),
);

const SingleMovieDetails = () => {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const params = useParams();
  const id = params?.id as string;

  const [videos, setVideos] = useState<any[]>([]);
  const [posters, setPosters] = useState<any[]>([]);
  const [backdrops, setBackdrops] = useState<any[]>([]);
  const [credits, setCredits] = useState<any[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<any[]>([]);

  // State for FullScreenImage
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const [fullScreenImages, setFullScreenImages] = useState<any[]>([]);

  const fetchMovieData = useCallback(async () => {
    try {
      const [
        videosResponse,
        postersResponse,
        backdropsResponse,
        creditsResponse,
        similarResponse,
        recommendationResponse,
      ] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`,
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&language=en-US&include_image_language=en,null`,
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&language=en-US&include_image_language=null,en`,
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`,
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US`,
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`,
        ),
      ]);

      if (
        !videosResponse.ok ||
        !postersResponse.ok ||
        !backdropsResponse.ok ||
        !creditsResponse.ok ||
        !similarResponse.ok ||
        !recommendationResponse.ok
      ) {
        throw new Error("Failed to fetch some movie data");
      }

      const [
        videosData,
        postersData,
        backdropsData,
        creditsData,
        similarData,
        recommendationData,
      ] = await Promise.all([
        videosResponse.json(),
        postersResponse.json(),
        backdropsResponse.json(),
        creditsResponse.json(),
        similarResponse.json(),
        recommendationResponse.json(),
      ]);

      setVideos(videosData.results);
      setPosters(postersData.posters);
      setBackdrops(backdropsData.backdrops);
      setCredits(creditsData.cast);
      setSimilar(similarData.results);
      setRecommendation(recommendationData.results);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const isDesktopOrLarger = useMediaQuery({ minWidth: 1024 });

  const responsiveCredits = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 8 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 8 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  const responsiveVideos = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  const responsiveBackdrops = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  const responsivePosters = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 8 },
    desktop: { breakpoint: { max: 3000, min: 1200 }, items: 7 },
    laptop: { breakpoint: { max: 1200, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  const handleImageClick = (images: any[], index: number) => {
    setFullScreenImages(images);
    setInitialImageIndex(index);
    setIsImageOpen(true);
  };

  const renderCredits = (credit: any) => (
    <Link href={`/people/${credit.id}`} key={credit.id}>
      <div className="px-2 py-4 flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1.5">
        <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-blue-500 transition-all duration-300 shadow-xl bg-gray-900 flex items-center justify-center">
          {credit.profile_path ? (
            <Image
              fill
              sizes="(max-width: 768px) 8rem, 10rem"
              src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
              alt={credit.name}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-gray-500 text-sm px-2 text-center font-medium">
              {credit.name}
            </span>
          )}
        </div>
        <p className="text-white text-center font-bold text-sm md:text-base mt-4 group-hover:text-blue-400 transition-colors line-clamp-1 px-1">
          {credit.name}
        </p>
        {credit.character && (
          <p className="text-gray-400 text-center text-xs md:text-sm line-clamp-1 px-1 mt-0.5">
            {credit.character}
          </p>
        )}
      </div>
    </Link>
  );

  const renderVideos = (video: any) => (
    <div key={video.key} className="px-2 py-4">
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-gray-900">
        <iframe
          src={`https://www.youtube.com/embed/${video.key}`}
          title={video.name}
          className="absolute inset-0 w-full h-full border-none"
          allowFullScreen
        ></iframe>
      </div>
      <p className="text-gray-300 text-sm font-semibold mt-3 px-1 line-clamp-1 text-center md:text-left">
        {video.name}
      </p>
    </div>
  );

  const renderImages = (
    image: any,
    baseUrl: string,
    altText: string,
    onClick?: () => void,
    isBackdrop = false,
  ) => (
    <div
      key={image.file_path}
      className="px-2 py-4 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`relative ${isBackdrop ? "aspect-video" : "aspect-[2/3]"} w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl group bg-gray-900`}
      >
        <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
          <span className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold border border-white/20 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            Click to View
          </span>
        </div>
        <Image
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          src={`${baseUrl}${image.file_path}`}
          alt={altText}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );

  const renderMovies = (movie: any, baseUrl: string, altText: string) => (
    <Link href={`/movie/${movie.id}`} key={movie.id}>
      <div className="px-2 py-4 group cursor-pointer">
        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gray-900 transition-transform duration-500 group-hover:scale-[1.03]">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10 flex flex-col justify-end p-4">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
              View Details
            </span>
            <p className="text-white font-bold text-sm line-clamp-2 mb-1">
              {movie.title}
            </p>
            {movie.release_date && (
              <span className="text-gray-400 text-xs">
                {movie.release_date.substring(0, 4)}
              </span>
            )}
          </div>
          {movie.poster_path ? (
            <Image
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              src={`${baseUrl}${movie.poster_path}`}
              alt={altText}
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <img
              src="/Images/klkl.jpg"
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        <p className="text-white text-center font-bold text-sm pt-3 px-1 group-hover:text-blue-400 transition-colors line-clamp-1">
          {movie.title}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 w-full mx-auto">
      {credits.length > 0 && (
        <div className=" flex flex-col-reverse">
          <MemoizedCarousel
            items={credits}
            responsive={responsiveCredits}
            renderItem={renderCredits}
            autoPlay={false}
            showArrows={isDesktopOrLarger}
            title="Cast & Crew"
          />
        </div>
      )}

      {videos.length > 0 && (
        <div className=" flex flex-col-reverse">
          <MemoizedCarousel
            items={videos}
            responsive={responsiveVideos}
            renderItem={renderVideos}
            autoPlay={false}
            showArrows={isDesktopOrLarger}
            title="Official Trailers & Videos"
          />
        </div>
      )}

      {backdrops.length > 0 && (
        <div className=" flex flex-col-reverse">
          <MemoizedCarousel
            items={backdrops}
            responsive={responsiveBackdrops}
            renderItem={(image, index) =>
              renderImages(
                image,
                "https://image.tmdb.org/t/p/original",
                "backdrop",
                () => handleImageClick(backdrops, index),
                true,
              )
            }
            autoPlay={true}
            showArrows={isDesktopOrLarger}
            title="Cinematic Backdrops"
          />
        </div>
      )}

      {posters.length > 0 && (
        <div className=" flex flex-col-reverse">
          <MemoizedCarousel
            items={posters}
            responsive={responsivePosters}
            renderItem={(image, index) =>
              renderImages(
                image,
                "https://image.tmdb.org/t/p/original",
                "poster",
                () => handleImageClick(posters, index),
                false,
              )
            }
            autoPlay={true}
            showArrows={isDesktopOrLarger}
            title="Movie Posters"
          />
        </div>
      )}

      {similar.length > 0 && (
        <div className=" flex flex-col-reverse">
          <MemoizedCarousel
            items={similar}
            responsive={responsivePosters}
            renderItem={(movie) =>
              renderMovies(
                movie,
                "https://image.tmdb.org/t/p/original",
                "similar movie",
              )
            }
            autoPlay={true}
            showArrows={isDesktopOrLarger}
            title="Similar Movies"
          />
        </div>
      )}

      {recommendation.length > 0 && (
        <div className=" flex flex-col-reverse">
          <MemoizedCarousel
            items={recommendation}
            responsive={responsivePosters}
            renderItem={(movie) =>
              renderMovies(
                movie,
                "https://image.tmdb.org/t/p/original",
                "recommendation movie",
              )
            }
            autoPlay={true}
            showArrows={isDesktopOrLarger}
            title="Recommended For You"
          />
        </div>
      )}

      {/* Full Screen Image Modal */}
      <FullScreenImage
        images={fullScreenImages}
        initialIndex={initialImageIndex}
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />
    </div>
  );
};

export default SingleMovieDetails;
