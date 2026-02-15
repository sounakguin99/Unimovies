"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faCheckCircle,
  faFileContract,
} from "@fortawesome/free-solid-svg-icons";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 text-blue-400 mb-6">
            <FontAwesomeIcon icon={faFileContract} className="text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Review the terms governing your use of UNIMOVIES services and
            platforms.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last Updated: February 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-800 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="bg-blue-600 w-1.5 h-6 rounded-full mr-3"></span>
              1. Acceptance of Terms
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                By accessing or using UNIMOVIES ("we," "our," or "us"), you
                agree to be bound by these Terms and Conditions and our Privacy
                Policy. If you disagree with any part of these terms, you may
                not access the service.
              </p>
              <p>
                We reserve the right to modify these terms at any time without
                prior notice. Your continued use of the site following any
                changes signifies your acceptance of the new terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="bg-purple-600 w-1.5 h-6 rounded-full mr-3"></span>
              2. User Content & Conduct
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                You are responsible for any content you post, including reviews
                and comments. By posting on UNIMOVIES, you grant us a
                non-exclusive license to use, reproduce, and display your
                content.
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Do not post illegal, harmful, or offensive content.</li>
                <li>
                  Do not attempt to disrupt our services or access restricted
                  areas.
                </li>
                <li>Respect the intellectual property rights of others.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="bg-pink-600 w-1.5 h-6 rounded-full mr-3"></span>
              3. Intellectual Property
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                All original content, features, and functionality on UNIMOVIES
                are owned by us and are protected by international copyright,
                trademark, and other intellectual property laws.
              </p>
              <p>
                Movie posters, images, and metadata are provided by TMDB and are
                the property of their respective owners. We do not claim
                ownership of third-party content.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="bg-orange-500 w-1.5 h-6 rounded-full mr-3"></span>
              4. Disclaimer of Warranties
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                The service is provided on an "AS IS" and "AS AVAILABLE" basis.
                We make no warranties, expressed or implied, regarding the
                operation of the site or the accuracy of the information
                provided.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="bg-green-500 w-1.5 h-6 rounded-full mr-3"></span>
              5. Contact Us
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                If you have any questions about these Terms, feel free to
                contact us:
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Go to Contact Page{" "}
                <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
