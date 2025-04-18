
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface BMIGaugeProps {
  bmi: number;
  category: string;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi, category }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  // Simplified BMI ranges with clear color coding
  const ranges = [
    { min: 0, max: 18.5, category: 'Underweight', color: '#ea384c' },
    { min: 18.5, max: 25, category: 'Normal', color: '#22c55e' },
    { min: 25, max: 30, category: 'Overweight', color: '#facc15' },
    { min: 30, max: 40, category: 'Obese', color: '#f97316' }
  ];

  // Calculate needle rotation based on BMI value
  const getNeedleRotation = () => {
    const minBMI = 0;
    const maxBMI = 40;
    // Calculate degrees (0 to 180) based on BMI value
    const degrees = ((Math.min(Math.max(bmi, minBMI), maxBMI) - minBMI) / (maxBMI - minBMI)) * 180;
    return degrees;
  };

  // Get color for current BMI value
  const getBMIColor = () => {
    const range = ranges.find(r => bmi >= r.min && bmi < r.max) || ranges[ranges.length - 1];
    return range.color;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto mt-6">
      {/* SVG Gauge */}
      <div className="relative">
        <svg viewBox="0 0 210 120" className="w-full max-w-[300px] mx-auto">
          {/* Semi-circular gauge */}
          <g transform="translate(105, 100)">
            {/* Draw gauge segments */}
            {ranges.map((range, index) => {
              // Calculate the angle for this segment
              const startAngle = (range.min / 40) * 180;
              const endAngle = (range.max / 40) * 180;
              
              // Convert to radians for path calculation
              const startRad = ((180 - startAngle) * Math.PI) / 180;
              const endRad = ((180 - endAngle) * Math.PI) / 180;
              
              // Radius values for outer and inner arcs
              const outerRadius = 80;
              const innerRadius = 60;
              
              // Calculate path coordinates
              const x1 = Math.cos(startRad) * outerRadius;
              const y1 = -Math.sin(startRad) * outerRadius;
              const x2 = Math.cos(endRad) * outerRadius;
              const y2 = -Math.sin(endRad) * outerRadius;
              const x3 = Math.cos(endRad) * innerRadius;
              const y3 = -Math.sin(endRad) * innerRadius;
              const x4 = Math.cos(startRad) * innerRadius;
              const y4 = -Math.sin(startRad) * innerRadius;
              
              // SVG path for the segment
              const path = [
                `M ${x1} ${y1}`,
                `A ${outerRadius} ${outerRadius} 0 0 0 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${innerRadius} ${innerRadius} 0 0 1 ${x4} ${y4}`,
                'Z'
              ].join(' ');

              // Calculate position for segment label
              const midAngle = (startAngle + endAngle) / 2;
              const midRad = ((180 - midAngle) * Math.PI) / 180;
              const labelRadius = outerRadius + 15;
              const labelX = Math.cos(midRad) * labelRadius;
              const labelY = -Math.sin(midRad) * labelRadius;
              
              return (
                <g key={range.category}>
                  {/* Segment path */}
                  <path
                    d={path}
                    fill={range.color}
                    stroke="#fff"
                    strokeWidth="0.5"
                  />
                  {/* Value at segment boundary */}
                  {index > 0 && (
                    <text
                      x={x1}
                      y={y1 - 2}
                      textAnchor="middle"
                      fill="#374151"
                      fontSize="6"
                      alignmentBaseline="bottom"
                    >
                      {range.min}
                    </text>
                  )}
                  {/* Final value at last segment boundary */}
                  {index === ranges.length - 1 && (
                    <text
                      x={x2}
                      y={y2 - 2}
                      textAnchor="middle"
                      fill="#374151"
                      fontSize="6"
                      alignmentBaseline="bottom"
                    >
                      {range.max}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Needle */}
            <g 
              transform={`rotate(${getNeedleRotation()})`}
              style={{ transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-65"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#000"
              />
            </g>
          </g>
        </svg>

        {/* BMI value and category */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-8 text-center">
          <p className="text-xl font-semibold">
            BMI = {bmi.toFixed(1)}
            <span className="ml-2" style={{ color: getBMIColor() }}>
              ({category})
            </span>
          </p>
        </div>
      </div>

      {/* Category labels */}
      <div className={cn(
        "mt-16 transition-opacity duration-500",
        animationComplete ? "opacity-100" : "opacity-0"
      )}>
        <div className="grid grid-cols-4 gap-2 text-sm justify-center">
          {ranges.map((range) => (
            <div key={range.category} className="flex items-center gap-2 justify-center">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: range.color }}
              />
              <span className="text-xs sm:text-sm">{range.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BMIGauge;
