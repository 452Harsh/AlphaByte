'use client'
import 'aos/dist/aos.css'; // Import AOS CSS
import AOS from 'aos'; // Import AOS JS
import { useEffect } from 'react';
import Link from 'next/link'; // Import Next.js Link for navigation
import TeamSection from '@/components/TeamProfileCard';

export default function Home() {
  // Initialize AOS on page load
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration for animation
      easing: 'ease-out', // Easing function for smooth transitions
      once: true, // Animation happens only once when it enters the viewport
    });
  }, []);

  return (
    <div className="bg-gray-900 text-white">

      {/* Navbar */}
      <nav className="bg-black/40 backdrop-blur-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-bold text-green-600">
            Sandalwood Bot
          </div>
          <div className="space-x-8 text-lg text-white">
            <a href="#home" className="hover:text-green-600 transition-all">Home</a>
            <a href="#features" className="hover:text-green-600 transition-all">Idea</a>
            <a href="#about" className="hover:text-green-600 transition-all">About</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/your-sandalwood-background.jpg")' }} id="home">
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Hero Text */}
        <div className="relative z-10 flex items-center justify-center w-full h-full text-center">
          <div data-aos="fade-up" className="text-white px-6 md:px-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6">
              Revolutionizing Sandalwood Cultivation
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-serif mb-8">
              Harness the power of AI to optimize sandalwood growth and sustainability.
            </p>
            <Link href="/">
              <button
                className="bg-green-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-green-500 transition-all duration-300"
                data-aos="fade-up" data-aos-delay="300"
              >
                ChatBot
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How We Made It Section with Curvy Vertical Line */}
      <section className="py-16" id="features">
  <div className="container mx-auto space-y-8 relative">
    <h2 className="text-3xl font-bold text-center mb-16 pb-5">How We Made It</h2>

    {/* Curvy Line */}
    <div className="absolute left-1/2 top-0 w-px h-full bg-transparent z-0">
      <div className="h-full w-px bg-green-600 absolute left-1/2 top-0 rounded-full transform -translate-x-1/2 mt-5"></div>
    </div>

    {/* Timeline Steps */}
    {[
      {
        title: 'Step 1: Initial Audio Transcription',
        description: 'We transcribed audio into text using speech recognition technology.',
        link: 'https://github.com/452Harsh/AlphaByte/blob/main/Whisper.ipynb',
      },
      {
        title: 'Step 2: Kannada to English Conversion',
        description: 'We translated Kannada texts into English text.',
        link: 'https://github.com/452Harsh/AlphaByte/blob/main/Transalation_kannda_english.ipynb',
      },
      {
        title: 'Step 3: Vector Embedding And Model Creation ',
        description: 'We created a vector embedding model to process data efficiently.',
        link: 'https://github.com/452Harsh/AlphaByte/blob/main/Model.ipynb',
      },
      {
        title: 'Step 4: UI Integration',
        description: 'Finally, we integrated everything into a seamless user interface.',
        link: '#',
      }
    ].map((step, index) => (
      <div key={index} className={`relative ${index % 2 === 0 ? 'flex justify-start' : 'flex justify-end'} items-center mb-16`}>
        {/* Step Number */}
        <div 
          className={`w-20 h-20 bg-blue-500 rounded-full shadow-lg flex items-center justify-center z-10 ${index % 2 === 1 ? 'mr-8' : ''}`}
          data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
        >
          <span className="text-2xl font-bold text-white">{index + 1}</span>
        </div>

        {/* Step Content */}
        <div 
          className={`inline-block ${index % 2 === 0 ? 'ml-8' : 'mr-8'} bg-white/10 p-6 rounded-xl backdrop-blur-lg shadow-xl border border-white/20`} 
          data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
        >
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-sm mb-4">{step.description}</p>
          <a
            href={step.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            Learn more
          </a>
        </div>

        {/* Vertical line between left and right */}
        {index % 2 === 0 && (
          <div className="absolute left-1/2 w-px h-full bg-green-600 z-0 transform -translate-x-1/2"></div>
        )}
        {index % 2 !== 0 && (
          <div className="absolute right-1/2 w-px h-full bg-green-600 z-0 transform translate-x-1/2"></div>
        )}
      </div>
    ))}
  </div>
</section>


      {/* About Section */}
      <section id="about">
        <TeamSection />
      </section>

      {/* Footer Section */}
      <footer className="bg-black/80 text-white py-8 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; 2024 Sandalwood Bot. All rights reserved.</p>
          <div className="mt-4">
            <a href="https://twitter.com" className="text-white hover:text-green-600 px-3">Twitter</a>
            <a href="https://facebook.com" className="text-white hover:text-green-600 px-3">Facebook</a>
            <a href="https://instagram.com" className="text-white hover:text-green-600 px-3">Instagram</a>
            <a href="mailto:contact@sandalwoodbot.com" className="text-white hover:text-green-600 px-3">Email</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
