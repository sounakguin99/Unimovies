"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faLock,
  faCookieBite,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-purple-500/10 text-purple-400 mb-6">
            <FontAwesomeIcon icon={faUserShield} className="text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We are committed to protecting your privacy. Learn how we collect,
            use, and safeguard your data.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last Updated: February 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-800 space-y-12">
          <section>
            <div className="flex items-center mb-6">
              <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400 mr-4">
                <FontAwesomeIcon icon={faDatabase} className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Information We Collect
              </h2>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-4 ml-0 md:ml-16">
              <p>
                We collect information you provide directly to us when you
                create an account, contact us, or participate in interactive
                features. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-purple-500">
                <li>Personal identifiers (name, email address)</li>
                <li>Usage data (browsing history, preferences)</li>
                <li>Device information (IP address, browser type)</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-6">
              <div className="bg-green-500/20 p-3 rounded-lg text-green-400 mr-4">
                <FontAwesomeIcon icon={faLock} className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                How We Use Your Data
              </h2>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-4 ml-0 md:ml-16">
              <p>We use the collected data to:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-purple-500">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your experience and recommendations</li>
                <li>Send you technical notices and support messages</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-6">
              <div className="bg-orange-500/20 p-3 rounded-lg text-orange-400 mr-4">
                <FontAwesomeIcon icon={faCookieBite} className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Cookies & Tracking
              </h2>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-4 ml-0 md:ml-16">
              <p>
                We use cookies and similar tracking technologies to track
                activity on our service and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-6">
              <div className="bg-red-500/20 p-3 rounded-lg text-red-400 mr-4">
                <FontAwesomeIcon icon={faUserShield} className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Data Security</h2>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-4 ml-0 md:ml-16">
              <p>
                The security of your data is important to us, but remember that
                no method of transmission over the Internet, or method of
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your Personal Data, we
                cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-center">
              Have privacy concerns?{" "}
              <Link
                href="/contact"
                className="text-purple-400 hover:text-purple-300 font-medium ml-1 transition-colors"
              >
                Contact our Data Protection Officer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
