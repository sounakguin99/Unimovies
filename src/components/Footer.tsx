import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-12 border-t border-gray-900">
      <div className="container mx-auto px-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8 mb-12 text-center lg:text-left">
          {/* Brand & Description */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/4 max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image src="/logo.svg" alt="Unimovies Logo" width={40} height={40} className="w-10 h-10 transition-transform group-hover:scale-110" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text m-0">
                UNIMOVIES
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for all movie information, reviews, and
              trailers. Stay updated with the latest in the movie world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full lg:w-auto">
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/movie"
                  className="hover:text-blue-400 transition-colors"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/people"
                  className="hover:text-blue-400 transition-colors"
                >
                  People
                </Link>
              </li>
              <li>
                <Link
                  href="/tv"
                  className="hover:text-blue-400 transition-colors"
                >
                  TV Shows
                </Link>
              </li>
              <li>
                <Link
                  href="/awards"
                  className="hover:text-blue-400 transition-colors"
                >
                  Awards
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="w-full lg:w-auto">
            <h3 className="text-xl font-bold mb-4 text-white">
              Legal & Support
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Info */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-start">
            <h3 className="text-xl font-bold mb-4 text-white">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://www.linkedin.com/in/sounak-guin-6a7a84209/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition duration-300 transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
              <a
                href="https://github.com/sounakguin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
              <a
                href="https://www.instagram.com/sounak__guin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition duration-300 transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition duration-300 transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faYoutube} size="lg" />
              </a>
            </div>
            <div className="text-sm text-gray-500 space-y-1 text-center lg:text-left">
              <p>Email: sounak.guin@gmail.com</p>
              <p>Location: Kolkata, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-sm gap-4">
          <p className="m-0 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Unimovies. All rights reserved.
          </p>
          <p className="m-0 text-center sm:text-right">
            Designed & Developed by
            <a
              href="https://www.sounakguin.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 ml-1 font-medium transition-colors hover:underline"
            >
              Sounak Guin
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
