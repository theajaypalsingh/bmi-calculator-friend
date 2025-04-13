import React from "react";
const StepCount = () => {
  return <div className="min-h-screen bg-gradient-to-b from-white to-health-light">
      <header className="py-6 text-white bg-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Daily Step Count Calculator</h1>
          <p className="text-center mt-2 text-health-light">Track and analyze your daily steps</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Daily Step Count Feature</h2>
            <p className="text-gray-700 mb-4">
              This feature is coming soon. You'll be able to track your daily steps and set goals for your physical activity.
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700">
                Walking 10,000 steps daily can significantly improve your cardiovascular health and help with weight management.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-white py-6 mt-12 bg-zinc-950">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Health Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default StepCount;