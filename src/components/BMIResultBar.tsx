
import React, { useEffect, useRef, useState } from "react";

type BMICategory =
  | "Underweight"
  | "Normal weight"
  | "Overweight"
  | "Obese"
  | "Severely Obese";

interface BMIResultBarProps {
  bmi: number;
  category: string;
  visible: boolean;
  heightInCm: number;
}

type BMIRange = {
  label: BMICategory;
  min: number;
  max: number;
  color: string;
};

const BMI_RANGES: BMIRange[] = [
  { label: "Underweight", min: 0, max: 18.4, color: "#D3E4FD" }, // Light Blue
  { label: "Normal weight", min: 18.5, max: 24.9, color: "#9be7ae" }, // Green
  { label: "Overweight", min: 25, max: 29.9, color: "#FEC6A1" },      // Orange
  { label: "Obese", min: 30, max: 34.9, color: "#FD9E5A" },           // Dark Orange
  { label: "Severely Obese", min: 35, max: 50, color: "#ea384c" }     // Red
];

// Find color range based on BMI
const getBMIRange = (bmi: number) => {
  return BMI_RANGES.find(r => bmi >= r.min && bmi <= r.max) || BMI_RANGES[BMI_RANGES.length - 1];
};

// Normalized BMI (0-50 scale, clamps under 0 and over 50)
const normalizeBMI = (bmi: number) => {
  if (bmi < 0) return 0;
  if (bmi > 50) return 50;
  return bmi;
};

// Get the pointer X%
const getBMIPositionPercent = (bmi: number) => {
  const norm = normalizeBMI(bmi);
  return (norm / 50) * 100;
};

const BMIResultBar: React.FC<BMIResultBarProps> = ({ bmi, category, visible, heightInCm }) => {
  const [progress, setProgress] = useState(0);

  // Animate needle position to BMI value
  useEffect(() => {
    if (visible && bmi > 0) {
      setProgress(0);
      const target = getBMIPositionPercent(bmi);
      let start = 0;
      const duration = 800;
      let startTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const newProgress = Math.min(target, (elapsed / duration) * target);
        setProgress(newProgress);
        if (elapsed < duration) {
          requestAnimationFrame(step);
        } else {
          setProgress(target);
        }
      };
      requestAnimationFrame(step);
    } else {
      setProgress(0);
    }
  }, [bmi, visible]);

  // Colors for segment background
  const segmentWidths = BMI_RANGES.map((r, idx) => {
    const next = BMI_RANGES[idx + 1]?.min ?? 50;
    return ((next - r.min) / 50) * 100;
  });

  const pointerLeft = `${progress}%`;

  // Label under marker
  let displayCategory = category;
  if (bmi >= 35) displayCategory = "Severely Obese";

  // Calculate ideal weight (height in cm - 100)
  const idealWeight = heightInCm > 0 ? (heightInCm - 100).toFixed(1) : "";

  let recommendation: string | null = null;
  if (bmi > 0 && heightInCm > 0) {
    if (bmi < 18.5) {
      recommendation = `You should consider gaining weight until you reach ${idealWeight} Kgs.`;
    } else if (bmi > 24.9) {
      recommendation = `You should consider losing weight until you reach ${idealWeight} Kgs.`;
    }
  }

  return (
    <div className="w-full flex flex-col items-center mt-8 space-y-2 animate-fade-in">
      <div className="relative w-[90%] max-w-lg h-6 rounded-full overflow-hidden glass card-gradient shadow">
        {/* Fixed color segments - always visible */}
        <div className="absolute left-0 top-0 w-full h-full flex z-0">
          {BMI_RANGES.map((range, i) => (
            <div
              key={range.label}
              style={{
                width: `${segmentWidths[i]}%`,
                background: range.color,
                height: "100%"
              }}
            />
          ))}
        </div>
        
        {/* Enhanced needle marker */}
        {bmi > 0 && (
          <div
            className="absolute z-20 transition-all duration-700 flex items-center"
            style={{
              left: `calc(${pointerLeft} - 4px)`,
              top: "-12px",
              height: "calc(100% + 24px)",
            }}
          >
            {/* Improved needle: a dark needle with a circle and subtle glow */}
            <div className="relative flex flex-col items-center">
              <div className="w-1.5 h-[32px] bg-black shadow-[0_0_7px_rgba(0,0,0,0.8)] rounded-full" />
              <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-black shadow-lg mt-[-12px]" />
            </div>
          </div>
        )}
        
        {/* Tick marks */}
        <div className="absolute top-full left-0 w-full flex justify-between mt-2 text-[11px] text-gray-700 font-medium select-none pointer-events-none">
          <span>0</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>35</span>
          <span>50</span>
        </div>
      </div>
      {/* BMI Value and Explanation */}
      {bmi > 0 && (
        <div className="w-[90%] max-w-lg text-center mt-1">
          <div className="text-base font-semibold text-gray-800">
            Your BMI is <span className="font-bold">{bmi.toFixed(1)}</span>{" "}
            ({displayCategory})
          </div>
          {recommendation && (
            <div className="mt-1 text-[15px] text-blue-700 font-medium">
              {recommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BMIResultBar;

