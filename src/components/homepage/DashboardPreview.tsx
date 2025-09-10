export default function DashboardPreview() {
  return (
    <section id="dashboard" className="snap-item">
      <div className="text-center space-y-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-white">
          Dashboard
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Powerful analytics and project insights at your fingertips.
        </p>
        <div className="bg-gray-800/50 p-8 rounded-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">150+</div>
              <div className="text-gray-300">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">98%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
