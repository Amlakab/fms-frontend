'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  FaHome,
  FaKey,
  FaChartLine,
  FaBuilding,
  FaHandshake,
  FaShieldAlt,
  FaSearch,
  FaFileSignature,
  FaMoneyBillWave,
  FaCalculator,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaClock,
  FaStar,
  FaAward,
  FaTools,
  FaIndustry,
  FaCubes,
  FaTruck,
  FaHandHoldingUsd,
  FaCogs
} from 'react-icons/fa';

const images = {
  hero: '/INSA/image1.jpg',
};

export default function ServicePage() {
  const { theme } = useTheme();
  const { t, isAmharic } = useLanguage();
  const [activeService, setActiveService] = useState<string | null>(null);

  const services = [
    {
      id: 'materials',
      icon: <FaIndustry />,
      title: isAmharic ? 'የግንባታ እቃዎች አቅርቦት' : 'Construction Material Supply',
      description: isAmharic 
        ? 'የተረጋገጡ የኮንክሪት ብረቶች (Grade 60)፣ ሲሚንቶ፣ ቆርቆሮ እና አጠቃላይ የግንባታ ማቴሪያሎችን በጅምላና በችርቻሮ እናቀርባለን።'
        : 'Wholesale and retail supply of Grade 60 structural rebar, certified cement, corrugated roofing sheets, and concrete hollow blocks.',
      features: [
        isAmharic ? 'ASTM A615 Grade 60 የኮንክሪት ብረት' : 'ASTM A615 Grade 60 structural rebar',
        isAmharic ? 'የጥራት ደረጃቸው የተረጋገጠ ሲሚንቶዎች' : 'PPC / OPC certified cement grades',
        isAmharic ? 'የተለያዩ መጠን ያላቸው ቆርቆሮዎች' : 'Galvanized & pre-painted roofing sheets',
        isAmharic ? 'ፈጣን የትራንስፖርት እና የማጓጓዝ አገልግሎት' : 'Reliable job-site delivery and logistics',
      ],
      cta: isAmharic ? 'እቃዎችን ይዘዙ' : 'Order Materials',
      ctaLink: '/public/houses',
      color: 'blue'
    },
    {
      id: 'furniture',
      icon: <FaBuilding />,
      title: isAmharic ? 'የቢሮ እና የቤት እቃዎች ማምረት' : 'Custom Furniture Manufacturing',
      description: isAmharic 
        ? 'ለዘመናዊ ቢሮዎች እና ለመኖሪያ ቤቶች ተስማሚ የሆኑ ከፍተኛ ጥራት ያላቸውን የቤት እቃዎች በማምረት እናቀርባለን።'
        : 'Design and fabrication of executive office desks, boardroom conference tables, ergonomic seating, and custom residential suites.',
      features: [
        isAmharic ? 'አስፈፃሚ የቢሮ ጠረጴዛዎች እና ወንበሮች' : 'Executive desks and ergonomic mesh chairs',
        isAmharic ? 'የመሰብሰቢያ አዳራሽ ዘመናዊ ጠረጴዛዎች' : 'Modular boardroom & conference suites',
        isAmharic ? 'የመኖሪያ ቤት ሶፋዎች እና አልባሳት ማስቀመጫዎች' : 'Living room sofas and custom wardrobes',
        isAmharic ? 'የተስተካከለ ዲዛይን እና የጥራት ዋስትና' : 'Custom dimensional styling with 1-year warranty',
      ],
      cta: isAmharic ? 'የቤት እቃዎችን ያስሱ' : 'Browse Furniture',
      ctaLink: '/public/houses',
      color: 'green'
    },
    {
      id: 'contracting',
      icon: <FaTools />,
      title: isAmharic ? 'የብረት ስራ እና አጠቃላይ ኮንትራክቲንግ' : 'Steel Fabrication & Contracting',
      description: isAmharic 
        ? 'የመጋዘን ትረስ፣ የህንፃ ብረት መዋቅሮች፣ እና የተሟላ አጠቃላይ የግንባታ ስራዎችን በሙያዊ ብቃት እንሰራለን።'
        : 'Industrial steel trusses, warehouse framing, mezzanine floors, metal railings, and turnkey contracting solutions.',
      features: [
        isAmharic ? 'የኢንዱስትሪ መጋዘን ትረስ ዝርጋታ' : 'Industrial warehouse structural truss fabrication',
        isAmharic ? 'የብረት መዋቅር እና የመገጣጠም ስራዎች' : 'Structural steel framing and precision welding',
        isAmharic ? 'የህንፃ አጠቃላይ ኮንትራክቲንግ' : 'Turnkey building contracting and fit-outs',
      ],
      cta: isAmharic ? 'ፕሮጀክት ያማክሩ' : 'Consult on Project',
      ctaLink: '/contact',
      color: 'purple'
    },
    {
      id: 'payment_plan',
      icon: <FaHandHoldingUsd />,
      title: isAmharic ? '25% / 75% ምቹ የክፍያ ስልት' : '25% Advance Milestone Payment',
      description: isAmharic 
        ? 'ማንኛውንም ምርት በ25% ቅድመ ክፍያ ማዘዝ ይቻላል፤ ቀሪው 75% የሚከፈለው ምርቱ ተጠናቆ ሲረከቡ ብቻ ነው።'
        : 'Pay only 25% advance deposit to begin custom fabrication. Settle the remaining 75% upon final inspection and product handover.',
      features: [
        isAmharic ? 'ዝቅተኛ የቅድመ ክፍያ ጫና (25%)' : 'Low upfront commitment (25% advance deposit)',
        isAmharic ? 'ቀሪ 75% ምርቱ ሲጠናቀቅ ብቻ የሚከፈል' : 'Remaining 75% balance due on product readiness',
        isAmharic ? 'የኢስክሮው እና ህጋዊ ደረሰኝ ጥበቃ' : 'Protected milestone receipts and verification',
      ],
      cta: isAmharic ? 'ዝርዝሩን ይመልከቱ' : 'Learn More',
      ctaLink: '/contact',
      color: 'orange'
    },
    {
      id: 'tracking',
      icon: <FaClock />,
      title: isAmharic ? 'የቀጥታ ምርት ሂደት ክትትል' : 'Live Production Progress Tracking',
      description: isAmharic 
        ? 'ትዕዛዝዎ ከእቃ ዝግጅት፣ ከምርት፣ ከጥራት ፍተሻ እስከ ርክክብ ያለውን ሂደት በፖርታልዎ ይከታተሉ።'
        : 'Real-time visibility into production stages from raw material sourcing, assembly, quality control to ready-for-pickup.',
      features: [
        isAmharic ? 'የእያንዳንዱ ደረጃ የቀጥታ ፐርሰንት' : 'Step-by-step milestone percentage tracking (0-100%)',
        isAmharic ? 'ከቴክኒሻኖች የሚሰጡ ዝርዝር ማስታወሻዎች' : 'Direct technician updates and status notifications',
        isAmharic ? 'ምርቱ ሲጠናቀቅ የሚላክ ፈጣን ማሳወቂያ' : 'Automatic alert when product is finished and ready',
      ],
      cta: isAmharic ? 'ፖርታል ይጎብኙ' : 'Open Portal',
      ctaLink: '/admin/customer',
      color: 'red'
    },
    {
      id: 'negotiation',
      icon: <FaHandshake />,
      title: isAmharic ? 'ቀጥታ የዋጋ ድርድር' : 'Direct Price Negotiation',
      description: isAmharic 
        ? 'ከሽያጭ ሰራተኞቻችን ጋር በፖርታሉ አማካኝነት በቀጥታ የዋጋ ድርድር በማድረግ ተስማሚ ዋጋ ላይ መድረስ።'
        : 'Fair two-way counter-offer proposals with our dedicated Sales Staff to reach agreeable terms for custom orders.',
      features: [
        isAmharic ? 'ቀጥታ የዋጋ ማሻሻያ ሀሳብ ማቅረብ' : 'Transparent counter-offer proposal system',
        isAmharic ? 'የጅምላ ትዕዛዝ ልዩ ቅናሾች' : 'Volume pricing discounts for contractors',
        isAmharic ? 'የዋጋ ስምምነት ፈጣን ማረጋገጫ' : 'Fast price agreement lock-in',
      ],
      cta: isAmharic ? 'የሽያጭ ሰራተኛ ያነጋግሩ' : 'Negotiate Quote',
      ctaLink: '/contact',
      color: 'teal'
    },
  ];

  const stats = [
    { number: '1,500+', label: isAmharic ? 'የተጠናቀቁ ፕሮጀክቶች' : 'Completed Projects', icon: <FaBuilding /> },
    { number: '25,000+ T', label: isAmharic ? 'የተሰራጨ ማቴሪያል' : 'Materials Supplied', icon: <FaIndustry /> },
    { number: '99.4%', label: isAmharic ? 'የደንበኞች እርካታ' : 'Client Satisfaction', icon: <FaStar /> },
    { number: '25% / 75%', label: isAmharic ? 'ተለዋዋጭ ክፍያ' : 'Milestone Model', icon: <FaHandHoldingUsd /> },
    { number: '24/7', label: isAmharic ? 'የሽያጭ ሰራተኞች ድጋፍ' : 'Sales Support', icon: <FaClock /> },
    { number: '15+', label: isAmharic ? 'የልምድ ዓመታት' : 'Years Experience', icon: <FaAward /> },
  ];

  const processSteps = [
    {
      step: '01',
      title: isAmharic ? 'ትዕዛዝ ወይም የዋጋ ጥያቄ ማቅረብ' : 'Order & Quote Submission',
      desc: isAmharic ? 'የሚፈልጉትን የግንባታ ማቴሪያል ወይም የቤት እቃ መጠን እና ስፔሲፊኬሽን ይምረጡ።' : 'Select materials or furniture specifications and submit your order quantity and bid.',
      icon: <FaSearch />
    },
    {
      step: '02',
      title: isAmharic ? 'የዋጋ ድርድር ከሽያጭ ሰራተኛ ጋር' : 'Price Negotiation with Sales Staff',
      desc: isAmharic ? 'ከሽያጭ ሰራተኛችን ጋር በፖርታሉ አማካኝነት በመደራደር በዋጋ ላይ ይስማሙ።' : 'Collaborate directly with our Sales Staff via counter-offers to agree on the final unit price.',
      icon: <FaHandshake />
    },
    {
      step: '03',
      title: isAmharic ? '25% ቅድመ ክፍያ እና የምርት ሂደት' : '25% Advance & Live Production',
      desc: isAmharic ? 'በ25% ቅድመ ክፍያ ምርት ይጀምራል፤ ሂደቱን ከፖርታልዎ በቀጥታ መከታተል ይችላሉ።' : 'Pay 25% upfront to start manufacturing; track step-by-step progress up to 100%.',
      icon: <FaTools />
    },
    {
      step: '04',
      title: isAmharic ? 'ቀሪ 75% ክፍያ እና ርክክብ' : '75% Settlement & Handover',
      desc: isAmharic ? 'ምርቱ ተጠናቆ ሲረጋገጥ ቀሪውን 75% በመክፈል እቃዎን በሰላም ይረከባሉ።' : 'When production is finished, pay the remaining 75% balance and confirm product acceptance.',
      icon: <FaCheckCircle />
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-[#0a192f] text-gray-100' 
        : 'bg-[#f8fafc] text-gray-900'
    }`}>
      <Navbar />
      
      <div className="pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={images.hero}
              alt="MAT Engineering & Trading Services"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 text-white drop-shadow-md">
                {isAmharic ? 'የኢንጂነሪንግ እና አቅርቦት አገልግሎቶች' : 'Engineering & Supply Services'}
              </h1>
              <p className="text-sm sm:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto px-2 leading-relaxed drop-shadow mb-8">
                {isAmharic 
                  ? 'ከግንባታ እቃዎች እና የብረት አቅርቦት እስከ ዘመናዊ የቢሮ/የቤት እቃዎች ማምረት እና የኮንትራክቲንግ ስራዎች'
                  : 'Certified construction materials, custom furniture fabrication, and turnkey steel contracting with flexible 25% advance milestone payments.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all"
                >
                  {isAmharic ? 'የሽያጭ ሰራተኛ ያነጋግሩ' : 'Contact Sales Staff'}
                </Link>
                <Link
                  href="/public/houses"
                  className="w-full sm:w-auto px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-xl font-bold text-sm sm:text-base transition-all"
                >
                  {isAmharic ? 'ምርቶችን ይመልከቱ' : 'Browse Products & Materials'}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={`py-12 sm:py-16 px-4 ${
          theme === 'dark' ? 'bg-[#112240]/60' : 'bg-slate-50'
        }`}>
          <div className="container mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    theme === 'dark' ? 'bg-[#112240] border-slate-700' : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2.5 ${
                    theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className={`py-12 sm:py-20 px-4 ${theme === 'dark' ? 'bg-[#0a192f]' : 'bg-white'}`}>
          <div className="container mx-auto">
            <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {isAmharic ? 'የምንሰጣቸው አገልግሎቶች' : 'What We Offer'}
              </h2>
              <p className={`text-sm sm:text-base ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isAmharic 
                  ? 'ለቤት ገዢዎች፣ ሻጮች፣ ተከራዮች እና ባለሀብቶች የተሟሉ መፍትሄዎች' 
                  : 'End-to-end solutions designed for home buyers, sellers, renters, and investors'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const isExpanded = activeService === service.id;
                return (
                  <div
                    key={service.id}
                    className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                      theme === 'dark' 
                        ? 'bg-[#112240] border-slate-700 hover:border-blue-500 shadow-md' 
                        : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <span className="text-2xl">{service.icon}</span>
                    </div>

                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {service.title}
                    </h3>

                    <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-6 border-t border-gray-100 dark:border-slate-800 pt-3">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={service.ctaLink}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>{service.cta}</span>
                      <FaArrowRight size={10} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={`py-12 sm:py-20 px-4 ${
          theme === 'dark' ? 'bg-[#112240]/60' : 'bg-slate-50'
        }`}>
          <div className="container mx-auto">
            <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {isAmharic ? 'የስራ ሂደታችን' : 'Our Simple Process'}
              </h2>
              <p className={`text-sm sm:text-base ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isAmharic 
                  ? 'ከምክክር ጀምሮ እስከ ቁልፍ ርክክብ ድረስ ግልፅ እና ቀጥተኛ አሰራር' 
                  : 'A transparent, reliable 4-step path from first inquiry to property keys'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border relative ${
                    theme === 'dark' ? 'bg-[#112240] border-slate-700' : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  <span className="text-3xl font-black text-blue-600/30 dark:text-blue-400/20 absolute top-4 right-4">
                    {step.step}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 ${
                    theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <h3 className={`text-base font-bold mb-1.5 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className={`py-12 sm:py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900 to-blue-950' : 'bg-gradient-to-r from-blue-600 to-blue-800'}`}>
          <div className="container mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {isAmharic ? 'ዛሬውኑ ከእኛ ጋር ይጀምሩ' : 'Ready to Procure Engineering Materials & Furniture?'}
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto mb-6">
              {isAmharic 
                ? 'ጥራት ያላቸው የግንባታ እቃዎችን፣ የቤትና ቢሮ ፈርኒቸር ለማዘዝ ወይም የዋጋ ድርድር ለመጀመር የሽያጭ ሰራተኞቻችንን ያነጋግሩ።' 
                : 'Connect with our Sales Staff and engineering team for certified construction materials, custom furniture orders, or competitive price negotiations.'}
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md"
            >
              {isAmharic ? 'አሁን ያነጋግሩን' : 'Get in Touch Today'}
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}