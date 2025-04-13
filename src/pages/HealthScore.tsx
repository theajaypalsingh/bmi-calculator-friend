
import React from "react";

const HealthScore = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-health-light">
      <header className="py-6 text-white bg-gray-950">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Health Score</h1>
          <p className="text-center mt-2 text-health-light">Calculate your overall health score</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Health Score Calculator</h2>
            <p className="text-gray-700 mb-4">
              This comprehensive health assessment tool is coming soon. It will evaluate multiple health factors to give you a personalized health score.
            </p>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700">
                A holistic health score takes into account physical fitness, nutrition, sleep quality, and mental wellbeing.
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
    </div>
  );
};

export default HealthScore;
