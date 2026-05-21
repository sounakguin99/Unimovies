"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import SingleTVpage from "./SingleTVpage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faImdb,
} from "@fortawesome/free-brands-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { TVShow } from "@/types";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function TVDetails() {
  const params = useParams();
  const id = params?.id as string;
  const [tvDetails, setTVDetails] = useState<TVShow | null>(null);
  const [externalLinks, setExternalLinks] = useState<any>({});
  const [isInList, setIsInList] = useState(false);

  const renderFallbackImage = (text: string) => {
    return `/Images/ok.jpeg`; // Using existing fallback image
  };

  // Fetch TV details
  const fetchTVDetail = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch TV data");
      }
      const data = await response.json();
      setTVDetails(data);

      const linksResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=${TMDB_API_KEY}&language=en-US`,
      );
      if (!linksResponse.ok) {
        throw new Error("Failed to fetch external links data");
      }
      const linksData = await linksResponse.json();
      setExternalLinks(linksData);

      // Check if the TV show is in the user's Firestore list
      // Check if the TV show is in the user's local storage list
      const storedList = localStorage.getItem("myTVList");
      if (storedList) {
        const list = JSON.parse(storedList);
        setIsInList(list.includes(id));
      } else {
        setIsInList(false);
      }
    } catch (error) {
      console.error("Error fetching TV data:", error);
    }
  };

  useEffect(() => {
    fetchTVDetail();
  }, [id]);

  // Handle adding/removing TV show from list
  const handleMyListClick = async () => {
    // Update local storage
    const storedList = localStorage.getItem("myTVList");
    const myTVList = storedList ? JSON.parse(storedList) : [];

    if (isInList) {
      localStorage.setItem(
        "myTVList",
        JSON.stringify(myTVList.filter((item: string) => item !== id)),
      );
    } else {
      localStorage.setItem("myTVList", JSON.stringify([...myTVList, id]));
    }

    // Update the state after modifying the list
    setIsInList(!isInList);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {tvDetails ? (
        <div className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-gray-900">
          {/* Backdrop Image */}
          {tvDetails.backdrop_path ? (
            <Image
              fill
              unoptimized
              className="object-cover object-top filter brightness-[0.9] md:brightness-[0.9] transition-all duration-700"
              src={`https://image.tmdb.org/t/p/original${tvDetails.backdrop_path}`}
              alt={tvDetails.original_name || tvDetails.name || "Backdrop"}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-900 to-gray-950" />
          )}

          {/* Multi-layer Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/50 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

          {/* Main Content Container */}
          <div className="container mx-auto px-4 md:px-8 relative z-10 pt-28 pb-16 md:py-32">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-14">
              {/* Poster Section */}
              <div className="w-64 md:w-80 flex-shrink-0 relative group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-2xl group-hover:bg-blue-500/30 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 aspect-[2/3] bg-gray-900 transition-transform duration-500 group-hover:scale-[1.02]">
                  {tvDetails.poster_path ? (
                    <Image
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      src={`https://image.tmdb.org/t/p/original${tvDetails.poster_path}`}
                      alt={
                        tvDetails.original_name || tvDetails.name || "Poster"
                      }
                    />
                  ) : (
                    <img
                      src="/Images/ok.jpeg"
                      alt="Fallback Poster"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Heart / My List Button */}
                  <button
                    onClick={handleMyListClick}
                    className={`absolute top-4 right-4 h-12 w-12 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${isInList
                      ? "bg-red-500/20 text-red-500 border-red-500/40"
                      : "bg-black/50 text-white hover:bg-black/70"
                      }`}
                    title={isInList ? "Remove from My List" : "Add to My List"}
                  >
                    <FontAwesomeIcon
                      icon={isInList ? faHeartSolid : faHeartRegular}
                      className="text-xl"
                    />
                  </button>

                  {/* Social Links Bar */}
                  <div className="absolute inset-x-4 bottom-4 bg-black/70 backdrop-blur-md border border-white/10 py-3 rounded-xl flex justify-center space-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl">
                    {externalLinks?.facebook_id && (
                      <a
                        href={`https://facebook.com/${externalLinks.facebook_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl text-blue-500 hover:text-blue-400 transition-transform transform hover:-translate-y-1"
                      >
                        <FontAwesomeIcon icon={faFacebook} />
                      </a>
                    )}
                    {externalLinks?.twitter_id && (
                      <a
                        href={`https://twitter.com/${externalLinks.twitter_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl text-blue-400 hover:text-blue-300 transition-transform transform hover:-translate-y-1"
                      >
                        <FontAwesomeIcon icon={faTwitter} />
                      </a>
                    )}
                    {externalLinks?.instagram_id && (
                      <a
                        href={`https://www.instagram.com/${externalLinks.instagram_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl text-pink-500 hover:text-pink-400 transition-transform transform hover:-translate-y-1"
                      >
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    )}
                    {externalLinks?.imdb_id && (
                      <a
                        href={`https://www.imdb.com/name/${externalLinks.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl text-yellow-500 hover:text-yellow-400 transition-transform transform hover:-translate-y-1"
                      >
                        <FontAwesomeIcon icon={faImdb} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Text Section */}
              <div className="flex-1 text-center md:text-left flex flex-col justify-center">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2 drop-shadow-lg">
                  {tvDetails.original_name || tvDetails.name}
                </h1>

                {tvDetails.tagline && (
                  <p className="text-lg md:text-xl font-medium text-blue-400 italic mb-6 drop-shadow">
                    &ldquo;{tvDetails.tagline}&rdquo;
                  </p>
                )}

                {/* Meta Info Row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-gray-300 mb-6">
                  {tvDetails.vote_average > 0 && (
                    <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-1.5 rounded-full backdrop-blur-md shadow-inner">
                      <FontAwesomeIcon icon={faStar} />
                      <span>{tvDetails.vote_average.toFixed(1)}</span>
                      {(tvDetails.vote_count ?? 0) > 0 && (
                        <span className="text-gray-400 text-xs font-normal">
                          ({tvDetails.vote_count} votes)
                        </span>
                      )}
                    </div>
                  )}

                  {tvDetails.episode_run_time &&
                    tvDetails.episode_run_time.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-white shadow-inner">
                        {tvDetails.episode_run_time[0]} mins
                      </div>
                    )}

                  {tvDetails.first_air_date && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-white shadow-inner">
                      First air date: {tvDetails.first_air_date}
                    </div>
                  )}
                </div>

                {/* Genres */}
                {tvDetails.genres && tvDetails.genres.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                    {tvDetails.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 backdrop-blur-md shadow-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Synopsis */}
                {tvDetails.overview && (
                  <div className="max-w-3xl">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-2 text-left">
                      <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
                      Synopsis
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg text-left md:text-left">
                      {tvDetails.overview}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Skeleton Loading State
        <div className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-gray-900 bg-gray-950">
          <div className="container mx-auto px-4 md:px-8 relative z-10 pt-32 pb-16 md:py-32">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-14">
              <div className="w-64 md:w-80 flex-shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
                <Skeleton
                  height="100%"
                  baseColor="#111"
                  highlightColor="#222"
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                />
              </div>
              <div className="flex-1 w-full flex flex-col pt-4">
                <Skeleton
                  width="70%"
                  height={50}
                  baseColor="#111"
                  highlightColor="#222"
                  className="mb-4"
                />
                <Skeleton
                  width="40%"
                  height={25}
                  baseColor="#111"
                  highlightColor="#222"
                  className="mb-8"
                />
                <div className="flex gap-4 mb-8">
                  <Skeleton
                    width={100}
                    height={35}
                    borderRadius={20}
                    baseColor="#111"
                    highlightColor="#222"
                  />
                  <Skeleton
                    width={100}
                    height={35}
                    borderRadius={20}
                    baseColor="#111"
                    highlightColor="#222"
                  />
                  <Skeleton
                    width={120}
                    height={35}
                    borderRadius={20}
                    baseColor="#111"
                    highlightColor="#222"
                  />
                </div>
                <Skeleton
                  count={4}
                  baseColor="#111"
                  highlightColor="#222"
                  className="mb-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <SingleTVpage />
    </div>
  );
}
