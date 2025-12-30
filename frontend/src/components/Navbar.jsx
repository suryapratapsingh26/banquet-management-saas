import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 z-50 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-white font-bold text-lg">
          ASYNCOTEL
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#help" className="hover:text-white">Help</a>
          <a href="#contact" className="hover:text-white">Contact</a>
          <Link to="/login" className="hover:text-white">Login</Link>
        </div>

        <Link 
          to="/register"
          className="bg-green-400 hover:bg-green-500 text-black px-5 py-2 rounded-full text-sm font-semibold"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}