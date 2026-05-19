"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent scrolling when menu is open
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movie" },
    { name: "People", path: "/people" },
    { name: "TV", path: "/tv" },
    { name: "Awards", path: "/awards" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/70 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3"
            : "bg-gradient-to-b from-black/80 to-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-900 rounded-xl border border-white/10 shadow-lg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all overflow-hidden">
                <Image
                  src="/logo.svg"
                  alt="Unimovies Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text drop-shadow-md">
                UNIMOVIES
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-inner">
              {navLinks.map((link) => {
                const isActive = pathname === link.path || (pathname?.startsWith(link.path) && link.path !== "/");
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`relative px-5 py-2 rounded-full text-sm lg:text-base font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-full -z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
                    )}
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Button (Desktop) */}
            <div className="hidden md:flex items-center justify-end w-[180px]">
              <Link
                href="/contact"
                className="px-6 py-2.5 rounded-full font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105 border border-white/10"
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden relative z-[60] p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white backdrop-blur-md shadow-lg"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon
                icon={isOpen ? faTimes : faBars}
                className="text-xl"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-lg z-50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-gray-950/95 backdrop-blur-2xl shadow-2xl z-50 border-l border-white/10 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-8 overflow-y-auto">
          {/* Mobile Menu Links */}
          <div className="flex flex-col space-y-3 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (pathname?.startsWith(link.path) && link.path !== "/");
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={closeMenu}
                  className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-300 text-lg font-bold tracking-wide ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Mobile Contact Button */}
            <div className="pt-4 mt-4 border-t border-white/10">
              <Link
                href="/contact"
                onClick={closeMenu}
                className="flex items-center justify-center w-full px-6 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 active:scale-95 border border-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <p className="text-gray-500 text-sm text-center font-medium">
              UNIMOVIES &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

