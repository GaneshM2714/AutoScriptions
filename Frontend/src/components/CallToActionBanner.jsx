// src/components/CallToActionBanner.jsx
export default function CallToActionBanner() {
    return (
      <section className="bg-indigo-700 text-white py-14">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold">
            Ready to stop money leaks? Start monitoring your subscriptions today.
          </h2>
          <button
            className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-semibold py-3 px-8 rounded-lg shadow-lg transition"
            onClick={() => window.location.href = '/register'}
          >
            Sign Up Free
          </button>
        </div>
      </section>
    );
  }
  
  