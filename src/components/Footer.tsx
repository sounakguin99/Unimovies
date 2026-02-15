import React from "react";
import Link from "next/link";
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
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              UNIMOVIES
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your one-stop destination for all movie information, reviews, and
              trailers. Stay updated with the latest in the movie world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
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
                  href="/movies"
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
                  Person
                </Link>
              </li>
              <li>
                <Link
                  href="/tv"
                  className="hover:text-blue-400 transition-colors"
                >
                  TV
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="text-center md:text-left">
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
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4 text-white">
              Connect With Us
            </h3>
            <div className="flex justify-center md:justify-start space-x-4 mb-6">
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
            <div className="text-sm text-gray-500 space-y-1">
              <p>Email: sounak.guin@gmail.com</p>
              <p>Location: Kolkata, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Unimovies. All rights reserved.
          </p>
          <p className="mt-2">
            Designed & Developed by
            <span className="text-blue-400 hover:text-blue-300 ml-1 font-medium cursor-pointer transition-colors">
              Sounak Guin
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
