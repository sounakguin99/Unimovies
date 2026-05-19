"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset status after a few seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen bg-black text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-purple-950/10 to-black opacity-80 z-0 blur-3xl"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 md:mb-24"
        >
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text mb-6 drop-shadow-lg tracking-tight">
            Get in Touch
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Have questions about UNIMOVIES? We'd love to hear from you. Send us
            a message and our cinematic support team will respond as soon as possible.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch"
        >
          {/* Contact Information */}
          <motion.div variants={itemVariants} className="relative group h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
            <div className="relative bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] h-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-10 text-white flex items-center gap-4 tracking-tight">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                  Contact Information
                </h2>

                <div className="space-y-8 md:space-y-10">
                  <div className="flex items-start space-x-6 group/item cursor-default">
                    <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-400 border border-blue-500/20 shadow-inner group-hover/item:scale-110 group-hover/item:bg-blue-500/20 group-hover/item:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300">
                      <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover/item:text-blue-400 transition-colors">
                        Email
                      </h3>
                      <p className="text-gray-300 hover:text-white transition-colors font-medium">support@unimovies.com</p>
                      <p className="text-gray-300 hover:text-white transition-colors font-medium">info@unimovies.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group/item cursor-default">
                    <div className="bg-purple-500/10 p-4 rounded-2xl text-purple-400 border border-purple-500/20 shadow-inner group-hover/item:scale-110 group-hover/item:bg-purple-500/20 group-hover/item:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
                      <FontAwesomeIcon icon={faPhone} className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover/item:text-purple-400 transition-colors">
                        Phone
                      </h3>
                      <p className="text-gray-300 font-medium">+1 (555) 123-4567</p>
                      <p className="text-gray-300 font-medium">+1 (555) 987-6543</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group/item cursor-default">
                    <div className="bg-pink-500/10 p-4 rounded-2xl text-pink-400 border border-pink-500/20 shadow-inner group-hover/item:scale-110 group-hover/item:bg-pink-500/20 group-hover/item:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl px-1" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover/item:text-pink-400 transition-colors">
                        Office
                      </h3>
                      <p className="text-gray-300 leading-relaxed font-medium">
                        123 Movie Street, Cinema City
                        <br />
                        Los Angeles, CA 90028
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-white/10">
                <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  {[
                    { icon: faTwitter, color: "hover:bg-[#1DA1F2]" },
                    { icon: faFacebookF, color: "hover:bg-[#4267B2] px-1" },
                    { icon: faInstagram, color: "hover:bg-[#E1306C]" },
                    { icon: faLinkedinIn, color: "hover:bg-[#0077B5]" },
                  ].map((social, idx) => (
                    <motion.a
                      href="#"
                      key={idx}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 shadow-lg backdrop-blur-md ${social.color}`}
                    >
                      <FontAwesomeIcon icon={social.icon} className={`text-xl ${social.color.includes('px-1') ? 'px-1' : ''}`} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="relative group h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
            <div className="relative bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] h-full flex flex-col justify-between">
              <h2 className="text-3xl font-bold mb-10 text-white flex items-center gap-4 tracking-tight">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-between flex-1">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-300 ml-1"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/[0.08] transition-all placeholder-gray-600 shadow-inner backdrop-blur-md font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-300 ml-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/[0.08] transition-all placeholder-gray-600 shadow-inner backdrop-blur-md font-medium"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-300 ml-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/[0.08] transition-all placeholder-gray-600 shadow-inner backdrop-blur-md font-medium"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-300 ml-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={7}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/[0.08] transition-all placeholder-gray-600 shadow-inner backdrop-blur-md font-medium resize-none"
                      placeholder="Tell us everything..."
                    ></textarea>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || submitStatus === "success"}
                  className={`w-full flex items-center justify-center space-x-3 py-4 px-8 rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] mt-8 ${
                    submitStatus === "success"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                      : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-[0_0_40px_rgba(79,70,229,0.5)]"
                  } disabled:opacity-80 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Transmitting...</span>
                    </div>
                  ) : submitStatus === "success" ? (
                    <div className="flex items-center space-x-2">
                      <span>Message Received</span>
                      <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                    </div>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FontAwesomeIcon icon={faPaperPlane} className="text-base group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
