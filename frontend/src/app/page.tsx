export default function Homepage() {
  return (
    <div>
      {/* Header */}
      <header className="slate360-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">SLATE360</div>
            <nav className="space-x-6">
              <a href="/about" className="hover:text-blue-400">About</a>
              <a href="/examples" className="hover:text-blue-400">Examples</a>
              <a href="/contact" className="hover:text-blue-400">Contact</a>
              <a href="/dashboard" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">Dashboard</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="slate360-hero">
        <h1 className="text-6xl font-bold mb-6">SLATE360</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          All-in-one platform for construction workflows, 3D modeling, and immersive technologies
        </p>
        <div className="space-x-4">
          <a href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 inline-block">
            Get Started
          </a>
          <a href="/examples" className="bg-white/10 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/20 border border-white/20 inline-block">
            View Examples
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div className="slate360-feature-grid">
          <div className="tile">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Project Management</h3>
            <p className="text-gray-400">Centralize all your construction projects with advanced tracking</p>
          </div>
          <div className="tile">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold mb-2">3D Modeling</h3>
            <p className="text-gray-400">Create detailed 3D models with CAD import/export capabilities</p>
          </div>
          <div className="tile">
            <div className="text-4xl mb-4">👁️</div>
            <h3 className="text-xl font-semibold mb-2">360° Tours</h3>
            <p className="text-gray-400">Build immersive virtual tours for client presentations</p>
          </div>
          <div className="tile">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-400">Advanced project analytics and reporting for decision making</p>
          </div>
        </div>
      </section>

      {/* Dashboard Tiles */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Dashboard Features</h2>
        <div className="slate360-dashboard-tiles">
          <div className="tile">Project Management</div>
          <div className="tile">3D Modeling</div>
          <div className="tile">Collaboration Tools</div>
          <div className="tile">Analytics & Reporting</div>
          <div className="tile">File Management</div>
          <div className="tile">Subscription Plans</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-400">
        <p>© 2024 SLATE360. All rights reserved.</p>
      </footer>
    </div>
  );
}
