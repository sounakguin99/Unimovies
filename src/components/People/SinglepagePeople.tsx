"use client";
import React, { useState, useEffect } from "react";
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
const ok = "/Images/ok.jpeg";
import { useMediaQuery } from "react-responsive";
import { Person } from "@/types";
import FullScreenImage from "@/components/ui/FullScreenImage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  const fetchData = async () => {
    try {
      const personalResponse = await fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`,
      );
      const personalData = await personalResponse.json();
      setActorPersonalData(personalData);

      const CreditsResponse = await fetch(
        `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}&language=en-US`,
      );
      const CreditsData = await CreditsResponse.json();
      setActorCreditsIds(CreditsData.cast);

      const ImageResponse = await fetch(
        `https://api.themoviedb.org/3/person/${id}/images?api_key=${API_KEY}`,
      );
      const ImageData = await ImageResponse.json();
      setActorImages(ImageData.profiles);

      const externalIdsResponse = await fetch(
        `https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${API_KEY}`,
      );
      const externalIdsData = await externalIdsResponse.json();
      setActorExternalIds(externalIdsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const isDesktopOrLarger = useMediaQuery({ minWidth: 1024 });

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setIsImageOpen(true);
  };

  if (!actorPersonalData || !actorExternalIds) {
    return (
      <div className="w-full min-h-screen bg-black text-white">
        <div className="relative z-10 container mx-auto px-4 md:px-8 py-12">
          <div className="bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-2xl border border-gray-800">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                <Skeleton
                  className="aspect-[2/3] w-full rounded-xl"
                  baseColor="#202020"
                  highlightColor="#444"
                />
              </div>
              <div className="flex-1 w-full">
                <Skeleton
                  height={50}
                  width="60%"
                  baseColor="#202020"
                  highlightColor="#444"
                  className="mb-6"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <Skeleton
                    count={4}
                    height={20}
                    baseColor="#202020"
                    highlightColor="#444"
                  />
                </div>
                <Skeleton count={3} baseColor="#202020" highlightColor="#444" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background Backdrop - Optional: could add backdrop image here if available */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-50 z-0"></div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 py-12">
          <div className="bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-2xl border border-gray-800">
            {actorPersonalData && (
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Profile Image */}
                <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                  {actorPersonalData.profile_path ? (
                    <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[2/3] w-full max-w-sm mx-auto lg:max-w-full">
                      <img
                        src={`https://image.tmdb.org/t/p/original${actorPersonalData.profile_path}`}
                        alt={actorPersonalData.name}
                        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-800 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="flex-1 text-white w-full">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center lg:text-left bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    {actorPersonalData.name}
                  </h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-gray-300">
                    <p className="flex flex-col">
                      <span className="text-gray-500 text-sm uppercase tracking-wide">
                        Known For
                      </span>{" "}
                      <span className="text-lg font-medium text-white">
                        {actorPersonalData.known_for_department}
                      </span>
                    </p>
                    <p className="flex flex-col">
                      <span className="text-gray-500 text-sm uppercase tracking-wide">
                        Gender
                      </span>{" "}
                      <span className="text-lg font-medium text-white">
                        {actorPersonalData.gender === 1 ? "Female" : "Male"}
                      </span>
                    </p>
                    <p className="flex flex-col">
                      <span className="text-gray-500 text-sm uppercase tracking-wide">
                        Birthday
                      </span>{" "}
                      <span className="text-lg font-medium text-white">
                        {actorPersonalData.birthday || "N/A"}
                      </span>
                    </p>
                    <p className="flex flex-col">
                      <span className="text-gray-500 text-sm uppercase tracking-wide">
                        Place of Birth
                      </span>{" "}
                      <span className="text-lg font-medium text-white">
                        {actorPersonalData.place_of_birth || "N/A"}
                      </span>
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-3 text-white border-l-4 border-blue-500 pl-3">
                      Biography
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {actorPersonalData.biography || "No biography available."}
                    </p>
                  </div>

                  <div className="flex space-x-6 justify-center lg:justify-start">
                    {actorExternalIds.facebook_id && (
                      <a
                        href={`https://facebook.com/${actorExternalIds.facebook_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110"
                      >
                        <FontAwesomeIcon icon={faFacebook} size="2x" />
                      </a>
                    )}
                    {actorExternalIds.twitter_id && (
                      <a
                        href={`https://twitter.com/${actorExternalIds.twitter_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110"
                      >
                        <FontAwesomeIcon icon={faTwitter} size="2x" />
                      </a>
                    )}
                    {actorExternalIds.instagram_id && (
                      <a
                        href={`https://www.instagram.com/${actorExternalIds.instagram_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-600 transition-colors transform hover:scale-110"
                      >
                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                      </a>
                    )}
                    {actorExternalIds.imdb_id && (
                      <a
                        href={`https://www.imdb.com/name/${actorExternalIds.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-yellow-500 transition-colors transform hover:scale-110"
                      >
                        <FontAwesomeIcon icon={faImdb} size="2x" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credits Section */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h3 className="text-3xl font-bold mb-8 text-white border-l-4 border-purple-500 pl-4">
          Combined Credits
        </h3>
        <div className="bg-gray-900/30 p-4 rounded-2xl">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            transitionDuration={500}
            arrows={isDesktopOrLarger}
            swipeable={true}
            draggable={true}
            showDots={false}
            containerClass="carousel-container"
            itemClass="px-2"
          >
            {actorCredits.map((data) => (
              <Link
                href={`/${data.media_type === "tv" ? "tv" : "movie"}/${data.id}`}
                key={`${data.id}-${data.media_type}`}
              >
                <div className="relative group rounded-xl overflow-hidden cursor-pointer">
                  <div className="aspect-[2/3] w-full">
                    {data.poster_path ? (
                      <LazyLoadImage
                        src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                        alt={data.title || data.name}
                        effect="blur"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-bold text-sm text-center w-full truncate">
                      {data.title || data.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Images Section */}
      <div className="container mx-auto px-4 md:px-8 py-12 pb-24">
        <h3 className="text-3xl font-bold mb-8 text-white border-l-4 border-pink-500 pl-4">
          Gallery
        </h3>
        <div className="bg-gray-900/30 p-4 rounded-2xl">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={false}
            keyBoardControl={true}
            transitionDuration={500}
            arrows={isDesktopOrLarger}
            swipeable={true}
            draggable={true}
            showDots={false}
            containerClass="carousel-container"
            itemClass="px-2"
          >
            {actorImages.map((imagedata, index) => (
              <div
                key={imagedata.file_path}
                className="rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => handleImageClick(index)}
              >
                <div className="aspect-[2/3] w-full">
                  <LazyLoadImage
                    src={`https://image.tmdb.org/t/p/w500${imagedata.file_path}`}
                    alt="Actor Gallery"
                    effect="blur"
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
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
