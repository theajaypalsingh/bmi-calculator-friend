import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { convertHeightToMeters, convertCmToMeters, convertLbsToKg, calculateBMI, getBMICategory, getBMICategoryDescription } from "@/utils/bmiCalculator";
interface BMICalculatorProps {}
const BMICalculator: React.FC<BMICalculatorProps> = () => {
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(10);
  const [cm, setCm] = useState<number>(177.8);
  const [weight, setWeight] = useState<number>(70);
  const [useMetric, setUseMetric] = useState<boolean>(true);
  const [useKg, setUseKg] = useState<boolean>(true);
  const [bmi, setBMI] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  useEffect(() => {
    setCm(convertHeightToMeters(feet, inches) * 100);
  }, [feet, inches]);
  const checkValuesWithinLimits = () => {
    if (useMetric) {
      if (cm < 50 || cm > 300) {
        setError("Please enter a height between 50cm and 300cm.");
        return false;
      }
    } else {
      if (feet < 1 || feet > 8) {
        setError("Please enter a valid height in feet (1-8).");
        return false;
      }
      if (inches < 0 || inches > 11) {
        setError("Please enter valid inches (0-11).");
        return false;
      }
    }
    if (weight < 20 || weight > 500) {
      setError("Please enter a weight between 20kg and 500kg.");
      return false;
    }
    setError("");
    return true;
  };
  const calculateResult = () => {
    if (!checkValuesWithinLimits()) {
      setBMI(0);
      setCategory("");
      setDescription("");
      setShowResults(false);
      return;
    }
    let heightInMeters: number;
    let weightInKg: number;
    let heightInCm: number = useMetric ? cm : parseFloat((convertHeightToMeters(feet, inches) * 100).toFixed(1));
    if (useMetric) {
      heightInMeters = convertCmToMeters(cm);
    } else {
      heightInMeters = convertHeightToMeters(feet, inches);
    }
    if (useKg) {
      weightInKg = weight;
    } else {
      weightInKg = convertLbsToKg(weight);
    }

    // Fix: calculateBMI expects weight first, height second according to implementation
    const calculatedBMI = calculateBMI(weightInKg, heightInMeters);
    setBMI(calculatedBMI);
    const bmiCategory = getBMICategory(calculatedBMI);
    setCategory(bmiCategory);
    setDescription(getBMICategoryDescription(bmiCategory, heightInCm));
    setShowResults(true);
  };
  const handleHeightUnitToggle = () => {
    setUseMetric(!useMetric);
  };
  const handleWeightUnitToggle = () => {
    setUseKg(!useKg);
  };
  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFeet(value);
    setCm(convertHeightToMeters(value, inches) * 100);
  };
  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setInches(value);
    setCm(convertHeightToMeters(feet, value) * 100);
  };
  const handleCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCm(value);
  };
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWeight(value);
  };
  const handleCalculateBMI = () => {
    calculateResult();
  };
  const getBMIColor = () => {
    if (bmi < 18.5) {
      return "#facc15"; // Underweight - Yellow
    } else if (bmi < 25) {
      return "#34d399"; // Normal - Green
    } else if (bmi < 30) {
      return "#fca5a5"; // Overweight - Light Red
    } else {
      return "#ef4444"; // Obese - Red
    }
  };

  // Function to determine if dietary tips link should be shown
  const shouldShowDietaryTips = () => {
    return bmi >= 25; // Show dietary tips link for overweight and obese
  };
  return <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-white rounded-t-lg bg-gray-800">
        <CardTitle className="text-2xl font-bold text-center">BMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Height Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="height-toggle" className="text-base font-medium">Height</Label>
            <div className="flex items-center">
              <span className={`mr-2 text-sm ${!useMetric ? "font-medium" : "text-gray-500"}`}>ft/in</span>
              <Switch id="height-toggle" checked={useMetric} onCheckedChange={handleHeightUnitToggle} />
              <span className={`ml-2 text-sm ${useMetric ? "font-medium" : "text-gray-500"}`}>cm</span>
            </div>
          </div>
          
          {useMetric ? <div>
              <Input type="number" id="height-cm" value={cm} onChange={handleCmChange} className="w-full" step="0.1" min="50" max="300" />
            </div> : <div className="flex gap-2">
              <div className="w-1/2">
                <Input type="number" id="height-feet" value={feet} onChange={handleFeetChange} className="w-full" min="1" max="8" />
                <Label htmlFor="height-feet" className="text-xs text-gray-500">Feet</Label>
              </div>
              <div className="w-1/2">
                <Input type="number" id="height-inches" value={inches} onChange={handleInchesChange} className="w-full" min="0" max="11" step="0.1" />
                <Label htmlFor="height-inches" className="text-xs text-gray-500">Inches</Label>
              </div>
            </div>}
        </div>

        {/* Weight Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="weight-toggle" className="text-base font-medium">Weight</Label>
            <div className="flex items-center">
              <span className={`mr-2 text-sm ${!useKg ? "font-medium" : "text-gray-500"}`}>lbs</span>
              <Switch id="weight-toggle" checked={useKg} onCheckedChange={handleWeightUnitToggle} />
              <span className={`ml-2 text-sm ${useKg ? "font-medium" : "text-gray-500"}`}>kg</span>
            </div>
          </div>
          
          <Input type="number" id="weight" value={weight} onChange={handleWeightChange} className="w-full" step="0.1" min="20" max="500" />
        </div>

        {/* Error Message */}
        {error && <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>}
        
        {/* Calculate BMI Button */}
        <div className="flex justify-center mt-4">
          <Button onClick={handleCalculateBMI} className="w-auto px-6 bg-red-800 hover:bg-red-700">
            Calculate BMI
          </Button>
        </div>

        {/* BMI Result Box - Now shown below the button */}
        {showResults && bmi > 0 && <div className="mt-4 p-4 rounded-lg border bg-gray-50">
            <h3 className="text-center font-medium mb-2">Your BMI Result</h3>
            <p className="text-center text-2xl font-bold" style={{
          color: getBMIColor()
        }}>
              {bmi.toFixed(1)}
            </p>
            <p className="text-center font-medium mb-1" style={{
          color: getBMIColor()
        }}>
              {category}
            </p>
            <p className="text-center text-sm text-gray-600">
              {description}
            </p>
            {shouldShowDietaryTips() && <Link to="/dietary-tips" className="block mt-2 text-center text-blue-600 hover:text-blue-800 text-sm">
                Get dietary tips for weight loss
              </Link>}
          </div>}
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-sm text-gray-500 text-center">
          BMI is a measure of body fat based on height and weight.<br />
          <span className="font-medium">BMI Categories:</span> Underweight (&lt;18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30)
        </p>
      </CardFooter>
    </Card>;
};
export default BMICalculator;