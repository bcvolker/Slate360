export default function HeroSection() {
  return (
    <section id="hero" className="snap-item">
      <div className="text-center space-y-8">
        <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          SLATE360
        </h1>
        <h2 className="text-2xl lg:text-3xl font-semibold text-white">
          The Future of Construction Technology
        </h2>
        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Experience the next generation of construction workflows, 3D modeling, and immersive technologies in one unified platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Get Started
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold border border-white/20 transition-colors">
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
}
