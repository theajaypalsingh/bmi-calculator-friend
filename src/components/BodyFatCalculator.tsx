import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Ruler, User, UserRound } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Conversion functions
const convertCmToInches = (cm: number): number => Math.round(cm / 2.54);
const convertInchesToCm = (inches: number): number => {
  // Format to one decimal place while converting
  return Math.round(inches * 2.54 * 10) / 10;
};
const convertFeetToInches = (feet: number, inches: number): number => feet * 12 + inches;
const convertInchesToFeet = (totalInches: number): {
  feet: number;
  inches: number;
} => {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;
  return {
    feet,
    inches
  };
};
const BodyFatCalculator: React.FC = () => {
  // Units and inputs state
  const [gender, setGender] = useState<"male" | "female">("male");
  const [useMetric, setUseMetric] = useState<boolean>(true);
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(10);
  const [heightCm, setHeightCm] = useState<number>(177.8); // ~5'10"

  // Measurements with single fields and unit toggle
  const [useMetricWaist, setUseMetricWaist] = useState<boolean>(true);
  const [waistCm, setWaistCm] = useState<number>(85);
  const [waistInch, setWaistInch] = useState<number>(33.5);
  const [useMetricNeck, setUseMetricNeck] = useState<boolean>(true);
  const [neckCm, setNeckCm] = useState<number>(37);
  const [neckInch, setNeckInch] = useState<number>(14.6);
  const [useMetricHip, setUseMetricHip] = useState<boolean>(true);
  const [hipCm, setHipCm] = useState<number>(95);
  const [hipInch, setHipInch] = useState<number>(37.4);

  // Result state
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Handle height unit changes
  const handleHeightUnitToggle = () => {
    setUseMetric(!useMetric);
    if (useMetric) {
      // Convert from cm to feet and inches
      const totalInches = convertCmToInches(heightCm);
      const {
        feet: calculatedFeet,
        inches: calculatedInches
      } = convertInchesToFeet(totalInches);
      setFeet(calculatedFeet);
      setInches(calculatedInches);
    } else {
      // Convert from feet and inches to cm
      const totalInches = convertFeetToInches(feet, inches);
      setHeightCm(convertInchesToCm(totalInches));
    }
  };

  // Handle height changes
  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFeet(value);
    const totalInches = convertFeetToInches(value, inches);
    setHeightCm(convertInchesToCm(totalInches));
  };
  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setInches(value);
    const totalInches = convertFeetToInches(feet, value);
    setHeightCm(convertInchesToCm(totalInches));
  };
  const handleCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setHeightCm(value);
  };

  // Handle waist measurement changes
  const handleWaistUnitToggle = () => {
    setUseMetricWaist(!useMetricWaist);
    if (useMetricWaist) {
      setWaistInch(convertCmToInches(waistCm));
    } else {
      setWaistCm(convertInchesToCm(waistInch));
    }
  };
  const handleWaistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (useMetricWaist) {
      setWaistCm(value);
      setWaistInch(convertCmToInches(value));
    } else {
      setWaistInch(value);
      setWaistCm(convertInchesToCm(value));
    }
  };

  // Handle neck measurement changes
  const handleNeckUnitToggle = () => {
    setUseMetricNeck(!useMetricNeck);
    if (useMetricNeck) {
      setNeckInch(convertCmToInches(neckCm));
    } else {
      setNeckCm(convertInchesToCm(neckInch));
    }
  };
  const handleNeckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (useMetricNeck) {
      setNeckCm(value);
      setNeckInch(convertCmToInches(value));
    } else {
      setNeckInch(value);
      setNeckCm(convertInchesToCm(value));
    }
  };

  // Handle hip measurement changes
  const handleHipUnitToggle = () => {
    setUseMetricHip(!useMetricHip);
    if (useMetricHip) {
      setHipInch(convertCmToInches(hipCm));
    } else {
      setHipCm(convertInchesToCm(hipInch));
    }
  };
  const handleHipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (useMetricHip) {
      setHipCm(value);
      setHipInch(convertCmToInches(value));
    } else {
      setHipInch(value);
      setHipCm(convertInchesToCm(value));
    }
  };

  // Get category based on body fat percentage and gender
  const getBodyFatCategory = (percentage: number, gender: "male" | "female"): string => {
    if (gender === "male") {
      if (percentage < 6) return "Essential Fat";
      if (percentage < 14) return "Athletic";
      if (percentage < 18) return "Fitness";
      if (percentage < 25) return "Average";
      return "Obese";
    } else {
      if (percentage < 16) return "Essential Fat";
      if (percentage < 21) return "Athletic";
      if (percentage < 25) return "Fitness";
      if (percentage < 32) return "Average";
      return "Obese";
    }
  };

  // Get description based on category
  const getCategoryDescription = (category: string): string => {
    switch (category) {
      case "Essential Fat":
        return "This is the minimum amount of fat necessary for basic physical and physiological health.";
      case "Athletic":
        return "This range is typical for athletes and those with very active lifestyles.";
      case "Fitness":
        return "This is considered a good range for general health and fitness.";
      case "Average":
        return "This is the average range for the general population.";
      case "Obese":
        return "Consider adopting healthier habits to reduce body fat percentage for better health outcomes.";
      default:
        return "";
    }
  };

  // Validate inputs
  const validateInputs = (): boolean => {
    if (heightCm <= 0) {
      setError("Please enter a valid height.");
      return false;
    }
    if (waistCm <= 0) {
      setError("Please enter a valid waist circumference.");
      return false;
    }
    if (neckCm <= 0) {
      setError("Please enter a valid neck circumference.");
      return false;
    }
    if (gender === "female" && hipCm <= 0) {
      setError("Please enter a valid hip circumference.");
      return false;
    }
    setError("");
    return true;
  };

  // Calculate body fat percentage
  const calculateBodyFat = () => {
    if (!validateInputs()) {
      setBodyFatPercentage(null);
      setCategory("");
      return;
    }
    setIsCalculating(true);

    // Simulate calculation delay for loading animation
    setTimeout(() => {
      try {
        let bodyFat: number;
        if (gender === "male") {
          bodyFat = 86.010 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
        } else {
          bodyFat = 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(heightCm) - 78.387;
        }

        // Ensure the result is valid
        if (isNaN(bodyFat) || bodyFat < 0) {
          setError("Invalid measurements. Please check your inputs.");
          setBodyFatPercentage(null);
          setCategory("");
        } else {
          // Round to 1 decimal
          const roundedBodyFat = Math.round(bodyFat * 10) / 10;
          setBodyFatPercentage(roundedBodyFat);
          const cat = getBodyFatCategory(roundedBodyFat, gender);
          setCategory(cat);
        }
      } catch (e) {
        setError("An error occurred during calculation. Please check your inputs.");
        setBodyFatPercentage(null);
        setCategory("");
      }
      setIsCalculating(false);
    }, 600); // 600ms delay for the loading animation
  };
  return <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-white rounded-t-lg bg-gray-800">
        <CardTitle className="text-2xl font-bold text-center">Body Fat Calculator</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Gender Selection */}
        <div className="mb-6">
          <Label htmlFor="gender" className="text-base font-medium mb-2 block">Gender</Label>
          <RadioGroup id="gender" value={gender} onValueChange={(value: "male" | "female") => setGender(value)} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="flex items-center">
                <User className="mr-1 h-5 w-5" />
                Male
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="flex items-center">
                <UserRound className="mr-1 h-5 w-5" />
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Height */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="height-toggle" className="text-base font-medium">Height</Label>
            <div className="flex items-center">
              <span className={`mr-2 text-sm ${!useMetric ? "font-medium" : "text-gray-500"}`}>ft/in</span>
              <Switch id="height-toggle" checked={useMetric} onCheckedChange={handleHeightUnitToggle} />
              <span className={`ml-2 text-sm ${useMetric ? "font-medium" : "text-gray-500"}`}>cm</span>
            </div>
          </div>
          
          {useMetric ? <div>
              <Input type="number" id="height-cm" value={heightCm} onChange={handleCmChange} className="w-full" step="0.1" min="50" max="300" placeholder="Height in cm" />
            </div> : <div className="flex gap-2">
              <div className="w-1/2">
                <Input type="number" id="height-feet" value={feet} onChange={handleFeetChange} className="w-full" min="1" max="8" placeholder="Feet" />
                <Label htmlFor="height-feet" className="text-xs text-gray-500">Feet</Label>
              </div>
              <div className="w-1/2">
                <Input type="number" id="height-inches" value={inches} onChange={handleInchesChange} className="w-full" min="0" max="11" step="0.1" placeholder="Inches" />
                <Label htmlFor="height-inches" className="text-xs text-gray-500">Inches</Label>
              </div>
            </div>}
        </div>
        
        {/* Waist Circumference */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="waist-toggle" className="text-base font-medium">Waist Circumference</Label>
            <div className="flex items-center">
              <span className={`mr-2 text-sm ${!useMetricWaist ? "font-medium" : "text-gray-500"}`}>inches</span>
              <Switch id="waist-toggle" checked={useMetricWaist} onCheckedChange={handleWaistUnitToggle} />
              <span className={`ml-2 text-sm ${useMetricWaist ? "font-medium" : "text-gray-500"}`}>cm</span>
            </div>
          </div>
          <Input type="number" id="waist" value={useMetricWaist ? waistCm : waistInch} onChange={handleWaistChange} className="w-full" step="0.1" placeholder={useMetricWaist ? "Waist in cm" : "Waist in inches"} />
        </div>
        
        {/* Neck Circumference */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="neck-toggle" className="text-base font-medium">Neck Circumference</Label>
            <div className="flex items-center">
              <span className={`mr-2 text-sm ${!useMetricNeck ? "font-medium" : "text-gray-500"}`}>inches</span>
              <Switch id="neck-toggle" checked={useMetricNeck} onCheckedChange={handleNeckUnitToggle} />
              <span className={`ml-2 text-sm ${useMetricNeck ? "font-medium" : "text-gray-500"}`}>cm</span>
            </div>
          </div>
          <Input type="number" id="neck" value={useMetricNeck ? neckCm : neckInch} onChange={handleNeckChange} className="w-full" step="0.1" placeholder={useMetricNeck ? "Neck in cm" : "Neck in inches"} />
        </div>
        
        {/* Hip Circumference (only for females) */}
        {gender === "female" && <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="hip-toggle" className="text-base font-medium">Hip Circumference</Label>
              <div className="flex items-center">
                <span className={`mr-2 text-sm ${!useMetricHip ? "font-medium" : "text-gray-500"}`}>inches</span>
                <Switch id="hip-toggle" checked={useMetricHip} onCheckedChange={handleHipUnitToggle} />
                <span className={`ml-2 text-sm ${useMetricHip ? "font-medium" : "text-gray-500"}`}>cm</span>
              </div>
            </div>
            <Input type="number" id="hip" value={useMetricHip ? hipCm : hipInch} onChange={handleHipChange} className="w-full" step="0.1" placeholder={useMetricHip ? "Hip in cm" : "Hip in inches"} />
          </div>}
        
        {/* Error Message */}
        {error && <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>}
        
        {/* Calculate Button */}
        <div className="flex justify-center mt-6">
          <Button onClick={calculateBodyFat} disabled={isCalculating} className="w-auto px-6 bg-red-800 hover:bg-red-700">
            {isCalculating ? <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </> : "Calculate Body Fat %"}
          </Button>
        </div>
        
        {/* Results */}
        {bodyFatPercentage !== null && <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-100 animate-fade-in">
            <h3 className="text-lg font-semibold text-center mb-2">Results</h3>
            
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2 px-4 py-2 rounded-md bg-health-light text-health-dark">
                {bodyFatPercentage}% <span className="text-base font-normal">Body Fat</span>
              </div>
              
              <div className="text-center">
                <p className="text-xl font-medium text-health-primary">{category}</p>
                <p className="mt-1 text-gray-700">{getCategoryDescription(category)}</p>
              </div>
            </div>
          </div>}
        
        {/* Information Section */}
        <div className="mt-6">
          <Collapsible open={showInfo} onOpenChange={setShowInfo}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium hover:bg-gray-100">
              <span className="flex items-center">
                <Ruler className="mr-2 h-4 w-4" />
                About Body Fat Percentage
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 transition-transform ${showInfo ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 text-sm text-gray-600">
              <p>
                Body fat percentage is a measurement of how much of your body composition is fat versus lean mass (muscle, bones, organs, etc).
              </p>
              <p className="mt-2">
                The U.S. Navy Method calculates body fat using measurements of height, neck, waist, and hip (for females).
                While not as accurate as methods like DEXA scans, it provides a good estimate for most people.
              </p>
              <p className="mt-2">
                <span className="font-medium">General recommendations:</span>
              </p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Men: 10-20% for optimal health</li>
                <li>Women: 18-28% for optimal health</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-sm text-gray-500 text-center">
          This calculator provides an estimate based on the U.S. Navy formula.<br />
          For medical advice, please consult a healthcare professional.
        </p>
      </CardFooter>
    </Card>;
};
export default BodyFatCalculator;