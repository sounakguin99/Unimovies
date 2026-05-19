"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFilm, faCompass } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden px-4 py-16 md:py-24">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-purple-950/10 to-black opacity-80 z-0 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 text-center overflow-hidden"
      >
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>

        <div className="mb-6 flex justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md"
          >
            <FontAwesomeIcon icon={faCompass} className="text-4xl text-blue-400" />
          </motion.div>
        </div>

        <div className="relative mb-6">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-8xl md:text-9xl font-black text-white/5 select-none tracking-tighter"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg">
              Lost in Space
            </h2>
          </div>
        </div>

        <p className="text-gray-300 max-w-md mx-auto text-base md:text-lg leading-relaxed mb-10 font-medium">
          The movie or page you are looking for has vanished from our cinematic universe, or the reel was misplaced.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-shadow duration-300 group"
            >
              <FontAwesomeIcon icon={faHome} className="text-lg group-hover:-translate-y-0.5 transition-transform" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
          <Link href="/movie">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold rounded-xl backdrop-blur-md shadow-xl transition-colors duration-300 group"
            >
              <FontAwesomeIcon icon={faFilm} className="text-lg group-hover:rotate-12 transition-transform" />
              <span>Browse Movies</span>
            </motion.button>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-gray-500 font-semibold tracking-wider uppercase">
          <span>Unimovies Cinematic Database</span>
          <span>•</span>
          <span>Error 404</span>
        </div>
      </motion.div>
    </div>
  );
}
