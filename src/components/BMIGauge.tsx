
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface BMIGaugeProps {
  bmi: number;
  category: string;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi, category }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  // Define BMI ranges and colors to match the reference image
  const ranges = [
    { min: 0, max: 16, category: 'Underweight', color: '#ea384c' },
    { min: 16, max: 17, category: 'Slightly underweight', color: '#ea384c' },
    { min: 17, max: 18.5, category: 'Normal', color: '#facc15' },
    { min: 18.5, max: 25, category: 'Healthy', color: '#22c55e' },
    { min: 25, max: 30, category: 'Overweight', color: '#facc15' },
    { min: 30, max: 35, category: 'Obesity', color: '#f97316' },
    { min: 35, max: 40, category: 'High Obesity', color: '#ea384c' },
  ];

  // Calculate needle rotation based on BMI value with improved accuracy
  const getNeedleRotation = () => {
    const minBMI = 0;
    const maxBMI = 40;
    // Calculate angle (0-180 degrees) based on BMI
    const degrees = ((Math.min(Math.max(bmi, minBMI), maxBMI) - minBMI) / (maxBMI - minBMI)) * 180;
    return degrees;
  };

  // Get color for BMI value
  const getBMIColor = () => {
    const range = ranges.find(r => bmi >= r.min && bmi < r.max) || ranges[ranges.length - 1];
    return range.color;
  };

  // Calculate segment sizes proportionally to their BMI range
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
      <div className="relative">
        {/* Semi-circular gauge */}
        <svg width="300" height="180" viewBox="0 0 300 180" className="mx-auto">
          <g transform="translate(150, 150)">
            {/* Draw gauge segments */}
            {gaugeData.map((entry, index, arr) => {
              const totalValue = arr.reduce((sum, item) => sum + item.value, 0);
              const startAngle = arr.slice(0, index).reduce((sum, item) => sum + (item.value / totalValue) * 180, 0);
              const endAngle = startAngle + (entry.value / totalValue) * 180;
              
              // Convert angles to radians for calculations
              const startRad = ((180 - startAngle) * Math.PI) / 180;
              const endRad = ((180 - endAngle) * Math.PI) / 180;
              
              // Calculate path for the arc
              const outerRadius = 80;
              const innerRadius = 60;
              
              const x1 = Math.cos(startRad) * outerRadius;
              const y1 = -Math.sin(startRad) * outerRadius;
              const x2 = Math.cos(endRad) * outerRadius;
              const y2 = -Math.sin(endRad) * outerRadius;
              const x3 = Math.cos(endRad) * innerRadius;
              const y3 = -Math.sin(endRad) * innerRadius;
              const x4 = Math.cos(startRad) * innerRadius;
              const y4 = -Math.sin(startRad) * innerRadius;
              
              // Path for the arc segment
              const path = [
                `M ${x1} ${y1}`,
                `A ${outerRadius} ${outerRadius} 0 0 0 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${innerRadius} ${innerRadius} 0 0 1 ${x4} ${y4}`,
                'Z'
              ].join(' ');

              // Calculate positions for category labels and value markers
              const midAngle = ((startAngle + endAngle) / 2);
              const midRad = ((180 - midAngle) * Math.PI) / 180;
              const labelRadius = 95;
              const labelX = Math.cos(midRad) * labelRadius;
              const labelY = -Math.sin(midRad) * labelRadius;
              
              const valuePos = (180 - startAngle) * Math.PI / 180;
              const valueX = Math.cos(valuePos) * 82;
              const valueY = -Math.sin(valuePos) * 82;
              
              return (
                <g key={`segment-${index}`}>
                  {/* Arc segment */}
                  <path d={path} fill={entry.color} stroke="#fff" strokeWidth="0.5" />
                  
                  {/* Category label */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-zinc-700"
                    transform={`rotate(${midAngle < 90 ? midAngle - 180 : midAngle}, ${labelX}, ${labelY})`}
                  >
                    {entry.category}
                  </text>
                  
                  {/* Value marker (if not the first segment) */}
                  {index > 0 && (
                    <text
                      x={valueX}
                      y={valueY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-bold fill-zinc-600"
                    >
                      {entry.min}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Needle */}
            <g 
              transform={`rotate(${getNeedleRotation()})`} 
              style={{ transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <line x1="0" y1="0" x2="0" y2="-60" stroke="#000" strokeWidth="2" />
              <circle cx="0" cy="0" r="6" fill="#000" />
            </g>
          </g>
        </svg>

        {/* Center BMI value - positioned at the bottom of the gauge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="text-2xl font-bold">
            BMI = {bmi.toFixed(1)}
            <span style={{ color: getBMIColor() }} className="ml-2">({category})</span>
          </h2>
        </div>
      </div>

      {/* Legend section - appears with fade-in animation */}
      <div className={cn(
        "text-center transition-opacity duration-500 mt-4",
        animationComplete ? "opacity-100" : "opacity-0"
      )}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-4 px-4">
          {ranges.map((range, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: range.color }} />
              <span className="truncate">
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
