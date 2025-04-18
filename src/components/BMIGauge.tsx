
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface BMIGaugeProps {
  bmi: number;
  category: string;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi, category }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  // Define BMI ranges and colors with more precise segments
  const ranges = [
    { min: 0, max: 16, category: 'Underweight', color: '#ef4444' },
    { min: 16, max: 17, category: 'Slightly underweight', color: '#f97316' },
    { min: 17, max: 18.5, category: 'Normal', color: '#facc15' },
    { min: 18.5, max: 25, category: 'Healthy', color: '#22c55e' },
    { min: 25, max: 30, category: 'Overweight', color: '#facc15' },
    { min: 30, max: 35, category: 'Obesity', color: '#f97316' },
    { min: 35, max: 40, category: 'High Obesity', color: '#ef4444' },
  ];

  // Calculate needle rotation based on BMI value
  const getNeedleRotation = () => {
    const minBMI = 0;
    const maxBMI = 40;
    const degrees = ((Math.min(Math.max(bmi, minBMI), maxBMI) - minBMI) / (maxBMI - minBMI)) * 180;
    return degrees;
  };

  // Get color for BMI value
  const getBMIColor = () => {
    const range = ranges.find(r => bmi >= r.min && bmi < r.max) || ranges[ranges.length - 1];
    return range.color;
  };

  // Create gauge segments data with adjusted values for better visualization
  const gaugeData = ranges.map(range => ({
    value: range.max - range.min,
    category: range.category,
    min: range.min,
    max: range.max,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto mt-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">
          BMI = {bmi.toFixed(1)} kg/m<sup>2</sup>{' '}
          <span style={{ color: getBMIColor() }}>({category})</span>
        </h2>
      </div>

      <div className="relative">
        <PieChart width={300} height={200}>
          <Pie
            data={gaugeData}
            cx={150}
            cy={150}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            {ranges.map((range, index) => (
              <Cell key={`cell-${index}`} fill={range.color} />
            ))}
          </Pie>
          
          {/* Add labels for each segment */}
          {gaugeData.map((entry, index) => {
            const angle = 180 - (index + 0.5) * (180 / gaugeData.length);
            const x = 150 + Math.cos((angle * Math.PI) / 180) * 95;
            const y = 150 - Math.sin((angle * Math.PI) / 180) * 95;
            return (
              <text
                key={`label-${index}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-zinc-700"
                transform={`rotate(${angle < 90 ? angle - 180 : angle}, ${x}, ${y})`}
              >
                {entry.category}
              </text>
            );
          })}

          {/* Add BMI value numbers */}
          {gaugeData.map((entry, index) => {
            if (index === 0) return null;
            const angle = 180 - (index) * (180 / gaugeData.length);
            const x = 150 + Math.cos((angle * Math.PI) / 180) * 82;
            const y = 150 - Math.sin((angle * Math.PI) / 180) * 82;
            return (
              <text
                key={`value-${index}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] fill-zinc-600"
              >
                {entry.min}
              </text>
            );
          })}
        </PieChart>

        {/* Center BMI value */}
        <div className="absolute left-1/2 bottom-[85px] -translate-x-1/2 text-xl font-bold">
          BMI = {bmi.toFixed(1)}
        </div>

        {/* Needle */}
        <div
          className="absolute left-1/2 bottom-[70px] w-1 h-[60px] bg-zinc-800 origin-bottom transition-transform duration-1000"
          style={{
            transform: `translateX(-50%) rotate(${getNeedleRotation()}deg)`,
          }}
        />
        <div className="absolute left-1/2 bottom-[65px] w-4 h-4 rounded-full bg-zinc-800 -translate-x-1/2" />
      </div>

      <div className={cn(
        "text-center transition-opacity duration-500 mt-4",
        animationComplete ? "opacity-100" : "opacity-0"
      )}>
        <div className="grid grid-cols-2 gap-2 text-xs mt-4 px-4">
          {ranges.map((range, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: range.color }} />
              <span>
                {range.category} ({range.min}-{range.max})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BMIGauge;
