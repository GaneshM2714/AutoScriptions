// src/components/Footer.jsx
export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} SubTrack Inc.  ·  All rights reserved.</p>
        <nav className="mt-3 space-x-4">
          <a href="/about"  className="hover:text-white">About</a>
          <a href="/privacy" className="hover:text-white">Privacy</a>
          <a href="/contact" className="hover:text-white">Contact</a>
        </nav>
      </footer>
    );
  }
  