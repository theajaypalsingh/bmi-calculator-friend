
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const DietaryTips = () => {
  const handleLinkClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return <div className="min-h-screen bg-gradient-to-b from-white to-health-light">
      <header className="py-6 text-white bg-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Dietary Tips for Weight Loss</h1>
          <p className="text-center mt-2 text-health-light">Simple and effective tips to help with your weight loss journey</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
              <ArrowLeft size={16} /> Back to BMI Calculator
            </Link>
          </Button>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-950">🔟 Easy Dietary Tips for Weight Loss</h2>
            
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">✅ Eat More Protein</h3>
                <p>Helps keep you full for longer and boosts metabolism. Add dal, paneer, curd, eggs, or sprouts to your meals.</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">🥦 Half Your Plate = Vegetables</h3>
                <p>Low in calories, high in fiber—great for fullness and gut health.</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">🕐 Don't Skip Meals (Especially Breakfast!)</h3>
                <p>Skipping meals slows metabolism and increases cravings later.</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">💧 Drink Water Before Meals</h3>
                <p>Helps you eat less. Sometimes, thirst feels like hunger!</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">📏 Portion Control is Key</h3>
                <p>Even healthy food in excess can cause weight gain. Use smaller plates!</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">🍵 Cut Sugary Drinks &amp; Limit Processed Foods</h3>
                <p>Switch to lemon water, coconut water, or unsweetened tea instead of sodas or packaged juices.</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">⏳ Fix Your Meal Timing</h3>
                <p>Eating your last meal before 8 PM can make a huge difference.</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">😴 Sleep 7–8 Hours Daily</h3>
                <p>Poor sleep disrupts hunger hormones and makes you crave junk.</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">🧠 Mindful Eating &gt; Mindless Snacking</h3>
                <p>Focus on what you're eating. No phones or Netflix while eating.</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-200">
                <h3 className="text-xl font-semibold mb-2">🎯 Follow 80-20 Rule</h3>
                <p>80% clean eating, 20% your fav treats. No guilt, just balance.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default DietaryTips;
