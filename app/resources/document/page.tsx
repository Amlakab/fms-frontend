'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useTheme } from '@/lib/theme-context';
import { FaDownload, FaEnvelope, FaKey, FaUser, FaCity, FaUserTag } from 'react-icons/fa';
import Image from 'next/image';

// Import MAT Engineering technical documents and catalogs
const documents = [
  {
    id: 1,
    title: 'MAT Structural Steel Specification & Rebar Grade 60 Standards',
    description: 'Comprehensive technical datasheet outlining chemical composition, tensile yield strength (420-620 MPa), and ASTM A615 Grade 60 standards for reinforcement rebar supply.',
    downloadLink: '/documents/Document1.pdf',
    image: '/images/image23.jpg',
  },
  {
    id: 2,
    title: 'Cement & Concrete Aggregates Quality Compliance Certificate',
    description: 'Official Ethiopian Standards (ES) and EN 197-1 compliance certificates for National and Dangote PPC/OPC 42.5N cement and Class A/B hollow concrete blocks.',
    downloadLink: '/documents/Document2.pdf',
  },
  {
    id: 3,
    title: 'Executive Office & Home Furniture Technical Product Catalog',
    description: 'Full product directory detailing hardwood dining suites, modern sectional sofas, executive boardroom tables, and ergonomic office chairs manufactured by MAT Engineering & Trading PLC.',
    downloadLink: '/documents/Document3.pdf',
    image: '/images/image22.jpg',
  },
  {
    id: 4,
    title: 'Pre-Engineered Steel Structures & Industrial Truss Fabrication Manual',
    description: 'Engineering blueprint guidelines for architectural steel truss welding, anti-corrosive primer coating, and warehouse superstructure fabrication.',
    downloadLink: '/documents/Document4.pdf',
  },
  {
    id: 5,
    title: 'Commercial Supply Terms, 25% Advance Milestone & Warranty Manual',
    description: 'Contractual guidelines detailing the 25% upfront advance deposit, price negotiation protocol with Sales Staff, and 75% final payment upon product completion and handover.',
    downloadLink: '/documents/Document5.pdf',
    image: '/images/image22.jpg',
  },
];

export default function DocumentPage() {
  const { theme } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('USER');
  const [otp, setOtp] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic here
    setShowOtpModal(true);
    setShowLogin(false);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Signup logic here
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // OTP verification logic here
    setShowOtpModal(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#0a192f] to-[#112240] text-white' 
        : 'bg-background text-text-primary'
    }`}>
      <Navbar />
      
      <div className="pt-16">
        {/* Document Sections */}
        {documents.map((doc, index) => (
          <section
            key={doc.id}
            className={`py-16 px-4 ${
              index % 2 === 0 
                ? (theme === 'dark' ? 'bg-transparent' : 'bg-background')
                : (theme === 'dark' ? 'bg-surface/20' : 'bg-surface')
            }`}
          >
            <div className="container mx-auto">
              {/* First Section: Image on Right (index % 3 === 0) */}
              {index % 3 === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Content Column */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="text-center lg:text-left"
                  >
                    <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
                      theme === 'dark' ? 'text-primary' : 'text-primary'
                    }`}>
                      {doc.title}
                    </h2>
                    <p className={`text-base mb-8 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-text-secondary'
                    }`}>
                      {doc.description}
                    </p>
                    <a
                      href={doc.downloadLink}
                      download
                      className="inline-flex items-center px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-medium text-base transition-colors duration-300"
                    >
                      <FaDownload className="mr-2" />
                      Download PDF
                    </a>
                  </motion.div>

                  {/* Image Column */}
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                  >
                    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-xl">
                      <Image
                        src={doc.image || '/images/image22.jpg'}
                        alt={doc.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </motion.div>
                </div>
              ) : null}

              {/* Second Section: No Image (index % 3 === 1) */}
              {index % 3 === 1 ? (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto text-center"
                >
                  <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
                    theme === 'dark' ? 'text-primary' : 'text-primary'
                  }`}>
                    {doc.title}
                  </h2>
                  <p className={`text-base mb-8 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-text-secondary'
                  }`}>
                    {doc.description}
                  </p>
                  <a
                    href={doc.downloadLink}
                    download
                    className="inline-flex items-center px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-medium text-base transition-colors duration-300"
                  >
                    <FaDownload className="mr-2" />
                    Download PDF
                  </a>
                </motion.div>
              ) : null}

              {/* Third Section: Image on Left (index % 3 === 2) */}
              {index % 3 === 2 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Image Column */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center order-2 lg:order-1"
                  >
                    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-xl">
                      <Image
                        src={doc.image || '/images/image22.jpg'}
                        alt={doc.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </motion.div>

                  {/* Content Column */}
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="text-center lg:text-left order-1 lg:order-2"
                  >
                    <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
                      theme === 'dark' ? 'text-primary' : 'text-primary'
                    }`}>
                      {doc.title}
                    </h2>
                    <p className={`text-base mb-8 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-text-secondary'
                    }`}>
                      {doc.description}
                    </p>
                    <a
                      href={doc.downloadLink}
                      download
                      className="inline-flex items-center px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-medium text-base transition-colors duration-300"
                    >
                      <FaDownload className="mr-2" />
                      Download PDF
                    </a>
                  </motion.div>
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full max-w-md rounded-xl shadow-xl ${
              theme === 'dark' ? 'bg-surface border-border' : 'bg-white border'
            }`}
          >
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-border' : 'border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-primary' : 'text-primary'
              }`}>
                Login
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={`flex items-center space-x-2 mb-2 ${
                    theme === 'dark' ? 'text-primary' : 'text-primary'
                  }`}>
                    <FaEnvelope />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-surface/50 border-border text-white' 
                        : 'bg-background border-border text-text-primary'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`flex items-center space-x-2 mb-2 ${
                    theme === 'dark' ? 'text-primary' : 'text-primary'
                  }`}>
                    <FaKey />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-surface/50 border-border text-white' 
                        : 'bg-background border-border text-text-primary'
                    }`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-medium text-base transition-colors duration-300"
                >
                  Login
                </button>
                <p className={`text-center mt-4 ${
                  theme === 'dark' ? 'text-primary' : 'text-primary'
                }`}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogin(false);
                      setShowSignup(true);
                    }}
                    className="underline hover:text-secondary transition-colors"
                  >
                    Signup
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full max-w-md rounded-xl shadow-xl ${
              theme === 'dark' ? 'bg-surface border-border' : 'bg-white border'
            }`}
          >
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-border' : 'border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-primary' : 'text-primary'
              }`}>
                Signup
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className={`flex items-center space-x-2 mb-2 ${
                    theme === 'dark' ? 'text-primary' : 'text-primary'
                  }`}>
                    <FaUser />
                    <span>Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-surface/50 border-border text-white' 
                        : 'bg-background border-border text-text-primary'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`flex items-center space-x-2 mb-2 ${
                    theme === 'dark' ? 'text-primary' : 'text-primary'
                  }`}>
                    <FaEnvelope />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-surface/50 border-border text-white' 
                        : 'bg-background border-border text-text-primary'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`flex items-center space-x-2 mb-2 ${
                    theme === 'dark' ? 'text-primary' : 'text-primary'
                  }`}>
                    <FaCity />
                    <span>City</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter City"
                    value={signupCity}
                    onChange={(e) => setSignupCity(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-surface/50 border-border text-white' 
                        : 'bg-background border-border text-text-primary'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`flex items-center space-x-2 mb-2 ${
                    theme === 'dark' ? 'text-primary' : 'text-primary'
                  }`}>
                    <FaKey />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-surface/50 border-border text-white' 
                        : 'bg-background border-border text-text-primary'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`flex items-center space-x-2 mb-2 ${
                    theme === 'dark' ? 'text-primary' : 'text-primary'
                  }`}>
                    <FaUserTag />
                    <span>Role</span>
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-surface/50 border-border text-white' 
                        : 'bg-background border-border text-text-primary'
                    }`}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-medium text-base transition-colors duration-300"
                >
                  Signup
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full max-w-md rounded-xl shadow-xl ${
              theme === 'dark' ? 'bg-surface border-border' : 'bg-white border'
            }`}
          >
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-border' : 'border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-primary' : 'text-primary'
              }`}>
                OTP Verification
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleOtp} className="space-y-4">
                <div>
                  <label className={`block mb-2 ${
                    theme === 'dark' ? 'text-primary' : 'text-primary'
                  }`}>
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-surface/50 border-border text-white' 
                        : 'bg-background border-border text-text-primary'
                    }`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-medium text-base transition-colors duration-300"
                >
                  Verify OTP
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}