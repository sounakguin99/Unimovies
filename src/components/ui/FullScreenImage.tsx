"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface FullScreenImageProps {
  images: any[]; // Changed from string[] to any[] to handle image objects with file_path
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function FullScreenImage({
  images,
  initialIndex,
  isOpen,
  onClose,
}: FullScreenImageProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]); // Added handlePrev/Next to deps via useCallback if needed, but simple function ref is fine here

  if (!isOpen) return null;

  // Helper to get image URL whether it's a string or an object
  const getImageUrl = (image: any) => {
    if (typeof image === "string") return image;
    return `https://image.tmdb.org/t/p/original${image.file_path}`;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-300">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex space-x-4 z-50">
        <button
          onClick={onClose}
          className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          title="Close"
        >
          <FontAwesomeIcon icon={faTimes} size="xl" />
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-50 hidden md:block"
      >
        <FontAwesomeIcon icon={faChevronLeft} size="2x" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-50 hidden md:block"
      >
        <FontAwesomeIcon icon={faChevronRight} size="2x" />
      </button>

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="w-10 h-10 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          fill
          src={getImageUrl(images[currentIndex])}
          alt={`Gallery image ${currentIndex + 1}`}
          className={`object-contain transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} shadow-2xl rounded-lg p-4`}
          onLoad={() => setIsLoading(false)}
        />

        {/* Mobile Tap Navigation overlay could be added here if needed, but buttons/swiping is better */}
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm font-medium border border-white/10">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
