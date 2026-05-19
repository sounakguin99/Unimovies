"use client";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faRotateRight,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden px-4 py-16 md:py-24">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-orange-950/10 to-black opacity-80 z-0 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 text-center overflow-hidden"
      >
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)]"></div>

        <div className="mb-8 flex justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)] backdrop-blur-md"
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-5xl text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            />
          </motion.div>
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent tracking-tight drop-shadow-md"
        >
          System Transmission Interrupted
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-300 max-w-lg mx-auto text-base md:text-lg leading-relaxed mb-10 font-medium"
        >
          We encountered an unexpected glitch in our cinematic broadcast feed. Please try reloading the transmission or return to base.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-shadow duration-300 group"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-lg group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </motion.button>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold rounded-xl backdrop-blur-md shadow-xl transition-colors duration-300 group"
            >
              <FontAwesomeIcon icon={faHome} className="text-lg group-hover:-translate-y-0.5 transition-transform" />
              <span>Back Home</span>
            </motion.button>
          </Link>
        </motion.div>

        {error.digest && (
          <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-gray-500 font-semibold tracking-wider">
            <span>Error Code:</span>
            <span className="font-mono bg-white/5 px-2.5 py-1 rounded border border-white/10 text-gray-400">{error.digest}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
