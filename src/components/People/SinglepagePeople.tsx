"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faImdb,
} from "@fortawesome/free-brands-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useMediaQuery } from "react-responsive";
import { Person } from "@/types";
import FullScreenImage from "@/components/ui/FullScreenImage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CustomHeaderWithArrows = ({ next, previous, title, showArrows }: any) => (
  <div className="flex items-center justify-between mb-6 mt-12 px-2">
    <div className="flex items-center gap-3">
      <div
        className={`w-1.5 h-7 rounded-full inline-block ${title === "Gallery" ? "bg-pink-500" : "bg-purple-500"}`}
      ></div>
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
      draggable={true}
      swipeable={true}
      renderButtonGroupOutside={true}
      customButtonGroup={
        <CustomHeaderWithArrows title={title} showArrows={showArrows} />
      }
    >
      {items.map((item, index) => renderItem(item, index))}
    </Carousel>
  ),
);

export default function SinglepagePeople() {
  const [actorPersonalData, setActorPersonalData] = useState<Person | null>(
    null,
  );
  const [actorExternalIds, setActorExternalIds] = useState<any>(null);
  const [actorCredits, setActorCreditsIds] = useState<any[]>([]);
  const [actorImages, setActorImages] = useState<any[]>([]);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const params = useParams();
  const id = params?.id as string;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const responsiveCredits = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 8 },
    desktop: { breakpoint: { max: 3000, min: 1200 }, items: 7 },
    laptop: { breakpoint: { max: 1200, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  const responsiveGallery = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 7 },
    desktop: { breakpoint: { max: 3000, min: 1200 }, items: 6 },
    laptop: { breakpoint: { max: 1200, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
  };

  const fetchData = useCallback(async () => {
    try {
      const [personalRes, creditsRes, imagesRes, externalIdsRes] =
        await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`,
          ),
          fetch(
            `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}&language=en-US`,
          ),
          fetch(
            `https://api.themoviedb.org/3/person/${id}/images?api_key=${API_KEY}`,
          ),
          fetch(
            `https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${API_KEY}`,
          ),
        ]);

      if (
        personalRes.ok &&
        creditsRes.ok &&
        imagesRes.ok &&
        externalIdsRes.ok
      ) {
        const [personalData, creditsData, imagesData, externalIdsData] =
          await Promise.all([
            personalRes.json(),
            creditsRes.json(),
            imagesRes.json(),
            externalIdsRes.json(),
          ]);

        setActorPersonalData(personalData);
        setActorCreditsIds(creditsData.cast || []);
        setActorImages(imagesData.profiles || []);
        setActorExternalIds(externalIdsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [id, API_KEY]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isDesktopOrLarger = useMediaQuery({ minWidth: 1024 });

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setIsImageOpen(true);
  };

  const renderCreditItem = (data: any) => (
    <Link
      href={`/${data.media_type === "tv" ? "tv" : "movie"}/${data.id}`}
      key={`${data.id}-${data.media_type}`}
    >
      <div className="px-2 py-4">
        <div className="group relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/5 cursor-pointer aspect-[2/3] transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:-translate-y-2">
          <div className="w-full h-full">
            {data.poster_path ? (
              <LazyLoadImage
                src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                alt={data.title || data.name}
                effect="blur"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay z-10"></div>

            {/* Text Content */}
            <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20">
              <h4 className="text-white font-bold text-base md:text-lg line-clamp-1 drop-shadow-md mb-1">
                {data.title || data.name}
              </h4>
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                {data.vote_average ? (
                  <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                    ★ {data.vote_average.toFixed(1)}
                  </span>
                ) : null}
                {data.release_date || data.first_air_date ? (
                  <>
                    {data.vote_average ? <span>•</span> : null}
                    <span>
                      {
                        (data.release_date || data.first_air_date)?.split(
                          "-",
                        )[0]
                      }
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <p className="text-white text-center font-bold text-sm pt-3 px-1 group-hover:text-purple-400 transition-colors line-clamp-1">
          {data.title || data.name}
        </p>
      </div>
    </Link>
  );

  const renderGalleryItem = (imagedata: any, index: number) => (
    <div className="px-2 py-4" key={imagedata.file_path}>
      <div
        className="group relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/5 cursor-pointer aspect-[2/3] transition-all duration-500 hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:-translate-y-2"
        onClick={() => handleImageClick(index)}
      >
        <LazyLoadImage
          src={`https://image.tmdb.org/t/p/w500${imagedata.file_path}`}
          alt="Actor Gallery"
          effect="blur"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay z-0"></div>
        <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
          <span className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold border border-white/20 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            Click to View
          </span>
        </div>
      </div>
    </div>
  );

  if (!actorPersonalData || !actorExternalIds) {
    return (
      <div className="w-full min-h-screen bg-black text-white">
        <div className="relative z-10 container mx-auto px-4 md:px-8 py-12">
          <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl p-6 md:p-12 shadow-2xl border border-gray-800">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                <Skeleton
                  className="aspect-[2/3] w-full rounded-2xl"
                  baseColor="#111"
                  highlightColor="#222"
                />
              </div>
              <div className="flex-1 w-full">
                <Skeleton
                  height={50}
                  width="60%"
                  baseColor="#111"
                  highlightColor="#222"
                  className="mb-6"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <Skeleton
                    count={4}
                    height={20}
                    baseColor="#111"
                    highlightColor="#222"
                  />
                </div>
                <Skeleton count={3} baseColor="#111" highlightColor="#222" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white pb-24">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-black opacity-60 z-0 blur-3xl"></div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 py-12">
          <div className="bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-6 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start relative z-10">
              {/* Profile Image with Hover Social Links */}
              <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                {actorPersonalData.profile_path ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] aspect-[2/3] w-full max-w-sm mx-auto lg:max-w-full border border-white/10 group">
                    <Image
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      src={`https://image.tmdb.org/t/p/original${actorPersonalData.profile_path}`}
                      alt={actorPersonalData.name}
                      className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>

                    {/* Social Links Bar on Hover */}
                    <div className="absolute inset-x-4 bottom-4 bg-black/70 backdrop-blur-md border border-white/10 py-3 rounded-xl flex justify-center space-x-6 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20">
                      {actorExternalIds?.facebook_id && (
                        <a
                          href={`https://facebook.com/${actorExternalIds.facebook_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl text-blue-500 hover:text-blue-400 transition-transform transform hover:-translate-y-1"
                          aria-label="Facebook"
                        >
                          <FontAwesomeIcon icon={faFacebook} />
                        </a>
                      )}
                      {actorExternalIds?.twitter_id && (
                        <a
                          href={`https://twitter.com/${actorExternalIds.twitter_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl text-blue-400 hover:text-blue-300 transition-transform transform hover:-translate-y-1"
                          aria-label="Twitter"
                        >
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                      )}
                      {actorExternalIds?.instagram_id && (
                        <a
                          href={`https://www.instagram.com/${actorExternalIds.instagram_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl text-pink-500 hover:text-pink-400 transition-transform transform hover:-translate-y-1"
                          aria-label="Instagram"
                        >
                          <FontAwesomeIcon icon={faInstagram} />
                        </a>
                      )}
                      {actorExternalIds?.imdb_id && (
                        <a
                          href={`https://www.imdb.com/name/${actorExternalIds.imdb_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl text-yellow-500 hover:text-yellow-400 transition-transform transform hover:-translate-y-1"
                          aria-label="IMDb"
                        >
                          <FontAwesomeIcon icon={faImdb} />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-800 rounded-2xl flex items-center justify-center border border-white/10">
                    <span className="text-gray-500 font-medium">No Image</span>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 text-white w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-center lg:text-left bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text tracking-tight drop-shadow-md">
                  {actorPersonalData.name}
                </h1>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1 font-semibold">
                      Known For
                    </span>
                    <span className="text-lg font-bold text-white">
                      {actorPersonalData.known_for_department}
                    </span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1 font-semibold">
                      Gender
                    </span>
                    <span className="text-lg font-bold text-white">
                      {actorPersonalData.gender === 1 ? "Female" : "Male"}
                    </span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1 font-semibold">
                      Birthday
                    </span>
                    <span className="text-lg font-bold text-white">
                      {actorPersonalData.birthday || "N/A"}
                    </span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1 font-semibold">
                      Place of Birth
                    </span>
                    <span className="text-lg font-bold text-white">
                      {actorPersonalData.place_of_birth || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Biography */}
                <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-inner">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-white">Biography</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-base md:text-lg font-normal">
                    {actorPersonalData.biography
                      ? actorPersonalData.biography.length > 550
                        ? actorPersonalData.biography.slice(0, 550) + "..."
                        : actorPersonalData.biography
                      : "No biography available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Section */}
      <div className="container mx-auto px-4  py-6">
        {actorCredits.length > 0 && (
          <div className="flex flex-col-reverse">
            <MemoizedCarousel
              items={actorCredits}
              responsive={responsiveCredits}
              renderItem={renderCreditItem}
              autoPlay={false}
              showArrows={isDesktopOrLarger}
              title="Combined Credits"
            />
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="container mx-auto px-4 py-6">
        {actorImages.length > 0 && (
          <div className="flex flex-col-reverse">
            <MemoizedCarousel
              items={actorImages}
              responsive={responsiveGallery}
              renderItem={renderGalleryItem}
              autoPlay={false}
              showArrows={isDesktopOrLarger}
              title="Gallery"
            />
          </div>
        )}
      </div>

      {/* Full Screen Image Modal */}
      <FullScreenImage
        images={actorImages}
        initialIndex={initialImageIndex}
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />
    </div>
  );
}
