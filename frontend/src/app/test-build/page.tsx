export default function TestBuild() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Slate360 Build Test
        </h1>
        <p className="text-gray-600 text-lg">
          If you can see this, the build is working correctly.
        </p>
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            ✅ Build successful - This is a minimal test page
          </p>
        </div>
      </div>
    </div>
  );
}
