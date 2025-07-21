// src/components/HeroSection.jsx
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

    return (
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Your subscriptions are quietly picking your pocket.<br />
            <span className="text-yellow-300">We catch them red-handed.</span>
          </h1>
          <p className="mt-6 text-lg opacity-90">
            Track, analyze, and control every recurring payment in one place.
          </p>
          <button
            className="mt-8 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-semibold py-3 px-8 rounded-lg shadow-lg transition"
            onClick={() => navigate('/register')}
          >
            Get Started ➜
          </button>
        </div>
      </header>
    );
  }
  