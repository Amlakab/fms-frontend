'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  FaUsers,
  FaStar,
  FaAward,
  FaHeart,
  FaHome,
  FaMapMarkerAlt,
  FaPhone,
  FaBuilding,
  FaChartLine,
  FaHandshake,
  FaShieldAlt,
  FaGlobe,
  FaTree,
  FaTrophy,
} from 'react-icons/fa';

const images = {
  aboutHero: '/INSA/image22.jpg',
  team: '/INSA/image15.jpg',
  mission: '/INSA/image11.jpg',
  values: '/INSA/image12.jpg',
  office: '/INSA/image18.jpg',
  team1: '/images/amlakie1.jpg',
  team2: '/images/bezab1.jpg',
  team3: '/images/amlakie2.jpg',
  team4: '/images/bezabh2.jpg',
};

export default function AboutPage() {
  const { theme } = useTheme();
  const { t, isAmharic } = useLanguage();
  const [activeTeam, setActiveTeam] = useState(0);

  const teamMembers = [
    {
      name: 'Amare Tesfa',
      role: isAmharic ? 'ዋና ሥራ አስኪያጅ' : 'General Manager',
      bio: isAmharic 
        ? 'በኢንጂነሪንግ እና ንግድ ዘርፍ ከ18 ዓመታት በላይ ባካበቱት ሰፊ ልምድ፣ MAT Engineering & Trading PLCን በታማኝነት እና በራዕይ ይመራሉ። ስልክ፡ 0911 994 405'
        : 'With over 18 years in engineering, procurement, and contracting, Amare leads MAT Engineering & Trading PLC with strategic vision and integrity. Phone: 0911 994 405',
      image: images.team1,
    },
    {
      name: 'Abebe Tadesse',
      role: isAmharic ? 'የሽያጭ ኃላፊ (Sales Staff)' : 'Head of Sales & Negotiation',
      bio: isAmharic 
        ? 'በግንባታ እቃዎች እና በብረት አቅርቦት ሽያጭ እና የዋጋ ድርድር የ12 ዓመታት ልምድ አላቸው።'
        : 'Abebe brings 12 years of construction materials and steel procurement experience, overseeing customer negotiations and milestone orders.',
      image: images.team2,
    },
    {
      name: 'Eng. Dawit Haile',
      role: isAmharic ? 'ዋና የመዋቅር መሃንዲስ' : 'Lead Structural Engineer',
      bio: isAmharic 
        ? 'የመጋዘን ትረስ፣ የብረት መዋቅሮች እና የህንፃ ግንባታ ፕሮጀክቶችን በከፍተኛ ጥራት ይመራሉ።'
        : 'Dawit leads structural design, warehouse steel trusses, and structural engineering compliance for commercial projects.',
      image: images.team3,
    },
    {
      name: 'Tigist Assefa',
      role: isAmharic ? 'የምርት እና የጥራት ቁጥጥር ኃላፊ' : 'Production & Quality Assurance',
      bio: isAmharic 
        ? 'የፈርኒቸር ማምረቻ እና የብረት ስራ ጥራት ቁጥጥርን እና የምርት ሂደቶችን በብቃት ይከታተላሉ።'
        : 'Tigist ensures rigorous quality assurance across all custom furniture manufacturing lines and steel fabrication workflows.',
      image: images.team4,
    },
  ];

  const values = [
    {
      icon: <FaHandshake />,
      title: isAmharic ? 'ቀዳሚ ታማኝነት' : 'Integrity First',
      description: isAmharic ? 'በእምነት እና በስነ-ምግባር ላይ የተመሰረተ ግልፅ እና ሐቀኛ አሰራርን እንከተላለን።' : 'We believe in honest, transparent transactions built on trust and ethical practices.',
    },
    {
      icon: <FaHeart />,
      title: isAmharic ? 'ደንበኛ ተኮር' : 'Client Centric',
      description: isAmharic ? 'የደንበኞቻችን ፍላጎት የእኛ ቀዳሚ ግብ ነው። ለፍላጎትዎ ትክክለኛውን ምርት እናቀርባለን።' : 'Your engineering goals are our priority. We fabricate and deliver tailored solutions.',
    },
    {
      icon: <FaStar />,
      title: isAmharic ? 'የላቀ ጥራት' : 'Certified Excellence',
      description: isAmharic ? 'Grade 60 ብረቶች፣ ደረጃቸውን የጠበቁ ሲሚንቶዎች እና ዘመናዊ የቤት እቃዎችን በጥራት እናቀርባለን።' : 'Grade 60 certified structural steel, tested cement grades, and precision-crafted furniture.',
    },
    {
      icon: <FaChartLine />,
      title: isAmharic ? 'የ25% / 75% ተለዋዋጭ ክፍያ' : 'Milestone Financing',
      description: isAmharic ? '25% ቅድመ ክፍያ ለምርት ማስጀመሪያ፣ ቀሪ 75% በርክክብ ወቅት የሚከፈልበት አመቺ ስልት።' : 'Accessible 25% down payment model with remaining 75% due only upon verified completion.',
    },
    {
      icon: <FaShieldAlt />,
      title: isAmharic ? 'ደህንነት እና ጥበቃ' : 'Quality Guarantee',
      description: isAmharic ? 'እያንዳንዱ ምርት ጥራቱ ተፈትሾ እና ተረጋግጦ ይረከባል።' : 'Every batch is inspected for structural integrity and standards compliance.',
    },
    {
      icon: <FaGlobe />,
      title: isAmharic ? 'ሰፊ ተደራሽነት' : 'Nationwide Supply',
      description: isAmharic ? 'በመላው ኢትዮጵያ ለሚገኙ ፕሮጀክቶች አስተማማኝ አቅርቦት።' : 'Reliable delivery and logistics network servicing engineering projects across Ethiopia.',
    },
  ];

  const achievements = [
    { number: '1,500+', label: isAmharic ? 'የተጠናቀቁ ፕሮጀክቶች' : 'Completed Projects', icon: <FaBuilding /> },
    { number: '25,000+ T', label: isAmharic ? 'የተሰራጨ ብረትና እቃዎች' : 'Tons Materials Supplied', icon: <FaTrophy /> },
    { number: '99.4%', label: isAmharic ? 'የደንበኞች እርካታ' : 'Client Satisfaction', icon: <FaStar /> },
    { number: '15+ Yrs', label: isAmharic ? 'የኢንዱስትሪ ልምድ' : 'Industry Experience', icon: <FaAward /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTeam((prev) => (prev + 1) % teamMembers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [teamMembers.length]);

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
              src={images.aboutHero}
              alt="MAT Engineering & Trading PLC"
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
                {isAmharic ? 'ስለ ኤምኤቲ ኢንጂነሪንግ እና ትሬዲንግ' : 'About MAT Engineering & Trading PLC'}
              </h1>
              <p className="text-sm sm:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto px-2 leading-relaxed drop-shadow">
                {isAmharic 
                  ? 'ከ2005 ዓ.ም ጀምሮ በኢትዮጵያ ውስጥ በግንባታ እቃዎች፣ በብረት አቅርቦት እና በዘመናዊ የቢሮ እና የቤት እቃዎች ማምረት የታመነ አጋር።' 
                  : 'Delivering excellence in certified construction materials, steel fabrication, and custom furniture manufacturing across Ethiopia.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className={`py-12 sm:py-20 px-4 ${theme === 'dark' ? 'bg-[#0a192f]' : 'bg-white'}`}>
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative h-64 sm:h-80 md:h-96 w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-800"
              >
                <Image
                  src={images.mission}
                  alt="MAT Engineering Facility"
                  fill
                  className="object-cover"
                />
              </motion.div>
              
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase block mb-2">
                  {isAmharic ? 'ታሪካችን' : 'Our Story'}
                </span>
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isAmharic ? 'የኢንጂነሪንግ ጥራት እና አስተማማኝ አቅርቦት' : 'Engineering Excellence & Reliable Supply'}
                </h2>
                <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p>
                    {isAmharic 
                      ? 'ኤምኤቲ ኢንጂነሪንግ እና ትሬዲንግ ኃ/የተ/የግ/ማ (MAT Engineering & Trading PLC) በዋና ሥራ አስኪያጅ አማረ ተስፋ መሪነት የተቋቋመ ሲሆን፣ በግንባታ ዘርፍ ላይ ከፍተኛ ጥራት ያላቸውን ማቴሪያሎች እና የኢንጂነሪንግ መፍትሄዎችን በማቅረብ ይታወቃል።' 
                      : 'Founded under the leadership of General Manager Amare Tesfa, MAT Engineering & Trading PLC was established to bridge the gap in dependable, certified construction materials and precision engineering services in Ethiopia.'}
                  </p>
                  <p>
                    {isAmharic 
                      ? 'ኩባንያችን በሶስት ዋና ዋና ዘርፎች ያተኩራል፡ 1) የኮንክሪት ብረት፣ ሲሚንቶ፣ ቆርቆሮ እና አጠቃላይ የግንባታ ማቴሪያሎች አቅርቦት፤ 2) ለቢሮዎች፣ ለሆቴሎች እና ለመኖሪያ ቤቶች ተስማሚ ዘመናዊ የቤት እቃዎችን ማምረት፤ 3) የመጋዘን ትረስ፣ የብረት መዋቅሮች እና አጠቃላይ የኮንትራክቲንግ ስራዎች።' 
                      : 'Our operations center on three specialized divisions: 1) Wholesale supply of Grade 60 structural rebar, certified cement, concrete hollow blocks, and roofing sheets; 2) Custom commercial and residential furniture manufacturing; 3) Structural steel truss fabrication, warehouse framing, and general contracting.'}
                  </p>
                  <p>
                    {isAmharic 
                      ? 'ለደንበኞቻችን ምቹ የሆነውን የ25% ቅድመ ክፍያ እና 75% ምርቱ ሲጠናቀቅ የሚፈፀም የክፍያ ስልት በመከተል፣ እንዲሁም የምርት ሂደቱን የቀጥታ ክትትል በማቅረብ ግንባር ቀደም ነን።' 
                      : 'Through our pioneering 25% advance / 75% completion payment plan and live milestone tracking, we ensure financial ease and complete peace of mind for contractors and private clients alike.'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className={`py-12 sm:py-16 px-4 ${
          theme === 'dark' ? 'bg-[#112240]/60' : 'bg-slate-50'
        }`}>
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {achievements.map((item, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border text-center transition-all ${
                    theme === 'dark' ? 'bg-[#112240] border-slate-700' : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                    theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.number}
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className={`py-12 sm:py-20 px-4 ${theme === 'dark' ? 'bg-[#0a192f]' : 'bg-white'}`}>
          <div className="container mx-auto">
            <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('about.values_title', 'Our Core Values')}
              </h2>
              <p className={`text-sm sm:text-base ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isAmharic 
                  ? 'በእያንዳንዱ ግንኙነት እና የሥራ ሂደት ውስጥ የምንከተላቸው መርሆዎች' 
                  : 'The principles that guide every interaction and transaction'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border ${
                    theme === 'dark' ? 'bg-[#112240] border-slate-700' : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <span className="text-xl">{value.icon}</span>
                  </div>
                  <h3 className={`text-base sm:text-lg font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {value.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className={`py-12 sm:py-20 px-4 ${
          theme === 'dark' ? 'bg-[#112240]/60' : 'bg-slate-50'
        }`}>
          <div className="container mx-auto">
            <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('about.team_title', 'Meet Our Leadership Team')}
              </h2>
              <p className={`text-sm sm:text-base ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isAmharic 
                  ? 'ልምድ ያላቸው እና ቁርጠኛ የሆኑ የአመራር እና የኢንጂነሪንግ አባሎቻችን' 
                  : 'Experienced leaders and engineers dedicated to your manufacturing, procurement, and project success'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className={`rounded-2xl overflow-hidden border transition-all ${
                    theme === 'dark' ? 'bg-[#112240] border-slate-700' : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="relative h-64 sm:h-72 w-full bg-gray-200 dark:bg-slate-800">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className={`text-base font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {member.name}
                    </h3>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mb-2">
                      {member.role}
                    </span>
                    <p className={`text-xs leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment & Office Section */}
        <section className={`py-12 sm:py-20 px-4 ${theme === 'dark' ? 'bg-[#0a192f]' : 'bg-white'}`}>
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
              <div className="lg:w-1/2">
                <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase block mb-2">
                  {isAmharic ? 'ቁርጠኝነታችን' : 'Our Commitment'}
                </span>
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isAmharic ? 'ለደንበኞቻችን ያለን ጽኑ ቃል ኪዳን' : 'Our Commitment to You'}
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: <FaShieldAlt className="text-blue-500" />, title: isAmharic ? 'ግልፅነት' : 'Transparency', desc: isAmharic ? 'የተሟላ የንብረት መረጃ፣ የገበያ ዋጋ እና ህጋዊ የውል ሂደቶች።' : 'Full disclosure of property details, market analysis, and legal processes.' },
                    { icon: <FaChartLine className="text-blue-500" />, title: isAmharic ? 'የገበያ እውቀት' : 'Market Expertise', desc: isAmharic ? 'ኢንቨስትመንትዎን የሚያሳድግ ጥልቅ የአካባቢ ገበያ ትንታኔ።' : 'Deep local market knowledge to maximize your investment return.' },
                    { icon: <FaTree className="text-blue-500" />, title: isAmharic ? 'ዘላቂነት' : 'Sustainability', desc: isAmharic ? 'ለአካባቢ ተስማሚ የሆኑ እና ዘመናዊ ቤቶችን እናበረታታለን።' : 'Promoting eco-friendly properties and sustainable building practices.' },
                    { icon: <FaTrophy className="text-blue-500" />, title: isAmharic ? 'የላቀ ደረጃ' : 'Excellence', desc: isAmharic ? 'በኢንዱስትሪው ውስጥ በተደጋጋሚ የተመሰገነ የደንበኞች እርካታ።' : 'Award-winning service recognized by industry leaders and satisfied clients.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                        theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className={`text-sm sm:text-base font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.title}
                        </h3>
                        <p className={`text-xs sm:text-sm mt-0.5 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-64 sm:h-80 md:h-96 w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-800">
                <Image
                  src={images.office}
                  alt="Modern Office"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Contact CTA */}
        <section className={`py-12 sm:py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900 to-blue-950' : 'bg-gradient-to-r from-blue-600 to-blue-800'}`}>
          <div className="container mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {isAmharic ? 'የህልምዎን ቤት አብረን እንፈልግ' : 'Let’s Find Your Dream Property Together'}
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto mb-6">
              {isAmharic 
                ? 'ዛሬውኑ ከባለሙያዎቻችን ጋር ይገናኙ እና ፍላጎትዎን ያሳኩ።' 
                : 'Connect with our expert team today to start your journey.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/public/houses"
                className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md"
              >
                {t('action.browse_properties', 'Browse Properties')}
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 border-2 border-white hover:bg-white/10 text-white rounded-xl font-bold text-sm sm:text-base transition-all"
              >
                {t('nav.contact', 'Contact Us')}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}