export default function FeaturesPreview() {
  return (
    <section id="features" className="snap-item">
      <div className="text-center space-y-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-white">
          Features
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover the powerful tools that make SLATE360 the ultimate construction platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">Project Hub</h3>
            <p className="text-gray-300">Centralized project management with real-time collaboration.</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">BIM Studio</h3>
            <p className="text-gray-300">Advanced 3D modeling and Building Information Models.</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">360° Tours</h3>
            <p className="text-gray-300">Create immersive virtual experiences for your projects.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
