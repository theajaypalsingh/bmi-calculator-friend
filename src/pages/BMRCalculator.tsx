
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ActivitySquare, Calculator, Loader2 } from 'lucide-react';
import { bmrCalculator } from '@/utils/bmrCalculator';

const BMRCalculator = () => {
  // Gender state
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  // Height state
  const [useMetricHeight, setUseMetricHeight] = useState<boolean>(true);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(7);
  
  // Weight state
  const [useMetricWeight, setUseMetricWeight] = useState<boolean>(true);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [weightLbs, setWeightLbs] = useState<number>(154);
  
  // Circumference measurements
  const [useMetricWaist, setUseMetricWaist] = useState<boolean>(true);
  const [waistCm, setWaistCm] = useState<number>(80);
  const [waistInch, setWaistInch] = useState<number>(31.5);
  
  const [useMetricNeck, setUseMetricNeck] = useState<boolean>(true);
  const [neckCm, setNeckCm] = useState<number>(35);
  const [neckInch, setNeckInch] = useState<number>(13.8);
  
  const [useMetricHip, setUseMetricHip] = useState<boolean>(true);
  const [hipCm, setHipCm] = useState<number>(90);
  const [hipInch, setHipInch] = useState<number>(35.4);
  
  // Activity level
  const [activityLevel, setActivityLevel] = useState<string>("1-3 times a week");
  
  // Results
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // Handle height unit toggle and conversions
  const handleHeightUnitToggle = () => {
    setUseMetricHeight(!useMetricHeight);
    if (useMetricHeight) {
      // Convert cm to feet and inches
      const totalInches = heightCm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round((totalInches % 12) * 10) / 10;
      setHeightFeet(feet);
      setHeightInches(inches);
    } else {
      // Convert feet and inches to cm
      const totalInches = (heightFeet * 12) + heightInches;
      const cm = Math.round(totalInches * 2.54 * 10) / 10;
      setHeightCm(cm);
    }
  };
  
  const handleHeightCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setHeightCm(value);
    // Update feet and inches for reference
    const totalInches = value / 2.54;
    setHeightFeet(Math.floor(totalInches / 12));
    setHeightInches(Math.round((totalInches % 12) * 10) / 10);
  };
  
  const handleHeightFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setHeightFeet(value);
    // Update cm value
    const totalInches = (value * 12) + heightInches;
    setHeightCm(Math.round(totalInches * 2.54 * 10) / 10);
  };
  
  const handleHeightInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setHeightInches(value);
    // Update cm value
    const totalInches = (heightFeet * 12) + value;
    setHeightCm(Math.round(totalInches * 2.54 * 10) / 10);
  };
  
  // Handle weight unit toggle and conversions
  const handleWeightUnitToggle = () => {
    setUseMetricWeight(!useMetricWeight);
    if (useMetricWeight) {
      // Convert kg to lbs
      setWeightLbs(Math.round(weightKg * 2.20462 * 10) / 10);
    } else {
      // Convert lbs to kg
      setWeightKg(Math.round(weightLbs / 2.20462 * 10) / 10);
    }
  };
  
  const handleWeightKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setWeightKg(value);
    setWeightLbs(Math.round(value * 2.20462 * 10) / 10);
  };
  
  const handleWeightLbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setWeightLbs(value);
    setWeightKg(Math.round(value / 2.20462 * 10) / 10);
  };
  
  // Handle circumference unit toggles and conversions
  const handleWaistUnitToggle = () => {
    setUseMetricWaist(!useMetricWaist);
    if (useMetricWaist) {
      setWaistInch(Math.round(waistCm / 2.54 * 10) / 10);
    } else {
      setWaistCm(Math.round(waistInch * 2.54 * 10) / 10);
    }
  };
  
  const handleWaistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (useMetricWaist) {
      setWaistCm(value);
      setWaistInch(Math.round(value / 2.54 * 10) / 10);
    } else {
      setWaistInch(value);
      setWaistCm(Math.round(value * 2.54 * 10) / 10);
    }
  };
  
  const handleNeckUnitToggle = () => {
    setUseMetricNeck(!useMetricNeck);
    if (useMetricNeck) {
      setNeckInch(Math.round(neckCm / 2.54 * 10) / 10);
    } else {
      setNeckCm(Math.round(neckInch * 2.54 * 10) / 10);
    }
  };
  
  const handleNeckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (useMetricNeck) {
      setNeckCm(value);
      setNeckInch(Math.round(value / 2.54 * 10) / 10);
    } else {
      setNeckInch(value);
      setNeckCm(Math.round(value * 2.54 * 10) / 10);
    }
  };
  
  const handleHipUnitToggle = () => {
    setUseMetricHip(!useMetricHip);
    if (useMetricHip) {
      setHipInch(Math.round(hipCm / 2.54 * 10) / 10);
    } else {
      setHipCm(Math.round(hipInch * 2.54 * 10) / 10);
    }
  };
  
  const handleHipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (useMetricHip) {
      setHipCm(value);
      setHipInch(Math.round(value / 2.54 * 10) / 10);
    } else {
      setHipInch(value);
      setHipCm(Math.round(value * 2.54 * 10) / 10);
    }
  };
  
  // Validate inputs before calculation
  const validateInputs = (): boolean => {
    // Reset any previous errors
    setError("");
    
    if (heightCm <= 0) {
      setError("Please enter a valid height.");
      return false;
    }
    
    if (weightKg <= 0) {
      setError("Please enter a valid weight.");
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
    
    if (gender === 'female' && hipCm <= 0) {
      setError("Please enter a valid hip circumference.");
      return false;
    }
    
    // Validation for log10 calculations
    if (gender === 'male' && waistCm <= neckCm) {
      setError("Waist circumference must be greater than neck circumference.");
      return false;
    }
    
    if (gender === 'female' && (waistCm + hipCm) <= neckCm) {
      setError("Sum of waist and hip must be greater than neck circumference.");
      return false;
    }
    
    return true;
  };
  
  // Calculate BMR and TDEE
  const handleCalculate = () => {
    if (!validateInputs()) {
      setBmr(null);
      setTdee(null);
      setBodyFatPercentage(null);
      return;
    }
    
    setIsCalculating(true);
    
    // Simulate calculation delay for loading animation
    setTimeout(() => {
      try {
        const activityMultiplier = bmrCalculator.activityLevelMap[activityLevel as keyof typeof bmrCalculator.activityLevelMap];
        
        let calculatedBmr: number;
        let calculatedTdee: number;
        let calculatedBodyFat: number;
        
        if (gender === 'male') {
          calculatedBodyFat = bmrCalculator.calculateBodyFatMale(heightCm, waistCm, neckCm);
          calculatedBmr = bmrCalculator.calculateBMRMale(heightCm, waistCm, neckCm, weightKg);
          calculatedTdee = calculatedBmr * activityMultiplier;
        } else {
          calculatedBodyFat = bmrCalculator.calculateBodyFatFemale(heightCm, waistCm, neckCm, hipCm);
          calculatedBmr = bmrCalculator.calculateBMRFemale(heightCm, waistCm, neckCm, hipCm, weightKg);
          calculatedTdee = calculatedBmr * activityMultiplier;
        }
        
        // Round to whole numbers
        setBmr(Math.round(calculatedBmr));
        setTdee(Math.round(calculatedTdee));
        setBodyFatPercentage(Math.round(calculatedBodyFat * 10) / 10);
        
      } catch (e) {
        console.error("Calculation error:", e);
        setError("An error occurred during calculation. Please check your measurements.");
        setBmr(null);
        setTdee(null);
        setBodyFatPercentage(null);
      }
      
      setIsCalculating(false);
    }, 600);
  };
  
  return (
    <div className="container-fluid p-0">
      <div className="bg-gray-800 text-white py-6 w-full">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">BMR Calculator</h1>
          <p className="text-center mt-2">Calculate your Basal Metabolic Rate and Total Daily Energy Expenditure</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
              <Calculator className="h-5 w-5" />
              Basal Metabolic Rate (BMR) Calculator
            </CardTitle>
            <CardDescription className="text-center">
              Find out how many calories your body needs at rest and with daily activity
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            {/* Gender Selection */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-base font-medium">Gender</Label>
              <RadioGroup 
                id="gender" 
                value={gender} 
                onValueChange={(value: 'male' | 'female') => setGender(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Height Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="height" className="text-base font-medium">Height</Label>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm ${!useMetricHeight ? "font-medium" : "text-gray-500"}`}>ft/in</span>
                  <Switch 
                    id="height-unit" 
                    checked={useMetricHeight}
                    onCheckedChange={handleHeightUnitToggle}
                  />
                  <span className={`ml-2 text-sm ${useMetricHeight ? "font-medium" : "text-gray-500"}`}>cm</span>
                </div>
              </div>
              
              {useMetricHeight ? (
                <div>
                  <Input
                    type="number"
                    id="height-cm"
                    value={heightCm}
                    onChange={handleHeightCmChange}
                    min="50"
                    max="250"
                    step="0.1"
                    className="w-full"
                    placeholder="Height in cm"
                  />
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <Input
                      type="number"
                      id="height-feet"
                      value={heightFeet}
                      onChange={handleHeightFeetChange}
                      min="1"
                      max="8"
                      className="w-full"
                      placeholder="Feet"
                    />
                    <Label htmlFor="height-feet" className="text-xs text-gray-500">Feet</Label>
                  </div>
                  <div className="w-1/2">
                    <Input
                      type="number"
                      id="height-inches"
                      value={heightInches}
                      onChange={handleHeightInchesChange}
                      min="0"
                      max="11"
                      step="0.1"
                      className="w-full"
                      placeholder="Inches"
                    />
                    <Label htmlFor="height-inches" className="text-xs text-gray-500">Inches</Label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Weight Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="weight" className="text-base font-medium">Weight</Label>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm ${!useMetricWeight ? "font-medium" : "text-gray-500"}`}>lbs</span>
                  <Switch 
                    id="weight-unit" 
                    checked={useMetricWeight}
                    onCheckedChange={handleWeightUnitToggle}
                  />
                  <span className={`ml-2 text-sm ${useMetricWeight ? "font-medium" : "text-gray-500"}`}>kg</span>
                </div>
              </div>
              
              {useMetricWeight ? (
                <Input
                  type="number"
                  id="weight-kg"
                  value={weightKg}
                  onChange={handleWeightKgChange}
                  min="30"
                  max="300"
                  step="0.1"
                  className="w-full"
                  placeholder="Weight in kg"
                />
              ) : (
                <Input
                  type="number"
                  id="weight-lbs"
                  value={weightLbs}
                  onChange={handleWeightLbsChange}
                  min="66"
                  max="660"
                  step="0.1"
                  className="w-full"
                  placeholder="Weight in lbs"
                />
              )}
            </div>
            
            {/* Waist Circumference */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="waist" className="text-base font-medium">Waist Circumference</Label>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm ${!useMetricWaist ? "font-medium" : "text-gray-500"}`}>inches</span>
                  <Switch 
                    id="waist-unit" 
                    checked={useMetricWaist}
                    onCheckedChange={handleWaistUnitToggle}
                  />
                  <span className={`ml-2 text-sm ${useMetricWaist ? "font-medium" : "text-gray-500"}`}>cm</span>
                </div>
              </div>
              
              <Input
                type="number"
                id="waist"
                value={useMetricWaist ? waistCm : waistInch}
                onChange={handleWaistChange}
                min="20"
                max="200"
                step="0.1"
                className="w-full"
                placeholder={useMetricWaist ? "Waist in cm" : "Waist in inches"}
              />
              <p className="text-xs text-gray-500">Measure at the narrowest point, usually above the belly button.</p>
            </div>
            
            {/* Neck Circumference */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="neck" className="text-base font-medium">Neck Circumference</Label>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm ${!useMetricNeck ? "font-medium" : "text-gray-500"}`}>inches</span>
                  <Switch 
                    id="neck-unit" 
                    checked={useMetricNeck}
                    onCheckedChange={handleNeckUnitToggle}
                  />
                  <span className={`ml-2 text-sm ${useMetricNeck ? "font-medium" : "text-gray-500"}`}>cm</span>
                </div>
              </div>
              
              <Input
                type="number"
                id="neck"
                value={useMetricNeck ? neckCm : neckInch}
                onChange={handleNeckChange}
                min="20"
                max="60"
                step="0.1"
                className="w-full"
                placeholder={useMetricNeck ? "Neck in cm" : "Neck in inches"}
              />
              <p className="text-xs text-gray-500">Measure below your Adam's apple, keeping the tape horizontal.</p>
            </div>
            
            {/* Hip Circumference - only for females */}
            {gender === 'female' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="hip" className="text-base font-medium">Hip Circumference</Label>
                  <div className="flex items-center">
                    <span className={`mr-2 text-sm ${!useMetricHip ? "font-medium" : "text-gray-500"}`}>inches</span>
                    <Switch 
                      id="hip-unit" 
                      checked={useMetricHip}
                      onCheckedChange={handleHipUnitToggle}
                    />
                    <span className={`ml-2 text-sm ${useMetricHip ? "font-medium" : "text-gray-500"}`}>cm</span>
                  </div>
                </div>
                
                <Input
                  type="number"
                  id="hip"
                  value={useMetricHip ? hipCm : hipInch}
                  onChange={handleHipChange}
                  min="50"
                  max="180"
                  step="0.1"
                  className="w-full"
                  placeholder={useMetricHip ? "Hip in cm" : "Hip in inches"}
                />
                <p className="text-xs text-gray-500">Measure at the widest part of your buttocks.</p>
              </div>
            )}
            
            {/* Activity Level Selection */}
            <div className="space-y-2">
              <Label htmlFor="activity-level" className="text-base font-medium">Physical Activity Level</Label>
              <Select 
                value={activityLevel} 
                onValueChange={setActivityLevel}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No exercise at all">No exercise at all</SelectItem>
                  <SelectItem value="Once a week">Once a week</SelectItem>
                  <SelectItem value="1-3 times a week">1-3 times a week</SelectItem>
                  <SelectItem value="4-5 times a week">4-5 times a week</SelectItem>
                  <SelectItem value="6-7 times a week">6-7 times a week</SelectItem>
                  <SelectItem value="More than 7 times a week">More than 7 times a week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Calculate Button */}
            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleCalculate} 
                disabled={isCalculating}
                className="w-auto px-8 py-6 bg-red-800 hover:bg-red-700 text-lg"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <ActivitySquare className="mr-2 h-5 w-5" />
                    Calculate BMR & TDEE
                  </>
                )}
              </Button>
            </div>
            
            {/* Results Display */}
            {bmr !== null && tdee !== null && bodyFatPercentage !== null && (
              <div className="mt-8 p-6 bg-green-50 rounded-md border border-green-200 animate-fade-in space-y-4">
                <h3 className="text-lg font-semibold text-center">Your Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-md shadow text-center">
                    <p className="text-sm text-gray-600">Body Fat Percentage</p>
                    <p className="text-2xl font-bold text-red-800">{bodyFatPercentage}%</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow text-center">
                    <p className="text-sm text-gray-600">Basal Metabolic Rate</p>
                    <p className="text-2xl font-bold text-red-800">{bmr.toLocaleString()} calories/day</p>
                    <p className="text-xs text-gray-500 mt-1">Calories needed at complete rest</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow text-center">
                    <p className="text-sm text-gray-600">Total Daily Energy Expenditure</p>
                    <p className="text-2xl font-bold text-red-800">{tdee.toLocaleString()} calories/day</p>
                    <p className="text-xs text-gray-500 mt-1">Calories needed with activity level</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <h4 className="font-medium mb-2">What do these numbers mean?</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">BMR (Basal Metabolic Rate):</span> The number of calories your body needs to maintain basic physiological functions at complete rest.
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">TDEE (Total Daily Energy Expenditure):</span> The estimated number of calories you burn per day when your activity level is taken into account.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t px-6 py-4">
            <p className="text-sm text-gray-500 text-center w-full">
              This calculator uses the Katch-McArdle formula combined with the U.S. Navy body fat estimation method.
              <br />It provides an estimate and should not replace professional medical advice.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BMRCalculator;
