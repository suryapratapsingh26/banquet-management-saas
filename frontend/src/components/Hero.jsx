import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500/70 via-pink-600 to-rose-500/70 text-white">
      <div className="max-w-5xl text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Our services and solutions.
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Discover how our tech solutions can transform your banquet business.
          Explore features and scale effortlessly.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="#features"
            className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600"
          >
            Learn More
          </a>

          <Link
            to="/register"
            className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}