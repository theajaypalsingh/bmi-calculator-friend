
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

const BMIResultBar: React.FC<BMIResultBarProps> = ({ bmi, category, visible }) => {
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  // Animate bar fill to BMI value
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

  return (
    <div className="w-full flex flex-col items-center mt-8 space-y-2 animate-fade-in">
      <div className="relative w-[90%] max-w-lg h-6 rounded-full overflow-hidden glass card-gradient shadow">
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
        <div
          className="absolute left-0 top-0 h-full z-10 transition-all duration-700"
          style={{
            width: `${progress}%`,
            background:
              getBMIRange(bmi)?.color || "#ddd",
            opacity: 0.7,
            borderRadius: "9999px",
          }}
        />
        {/* Marker */}
        {bmi > 0 && (
          <div
            style={{
              left: `calc(${pointerLeft} - 10px)`,
              top: "-14px",
            }}
            className="absolute"
          >
            {/* Triangle marker */}
            <svg width="20" height="16" viewBox="0 0 20 16">
              <polygon
                points="10,0 20,16 0,16"
                fill={getBMIRange(bmi).color}
                stroke="#555"
                strokeWidth="1"
              />
            </svg>
          </div>
        )}
        {/* Range ticks/labels */}
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
        </div>
      )}
    </div>
  );
};

export default BMIResultBar;
