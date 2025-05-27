
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Timer } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerificationComplete?: () => void;
  onBackToEmail?: () => void;
}

const OTPVerification = ({ email, onVerificationComplete, onBackToEmail }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isExpired, setIsExpired] = useState(false);
  const { refreshSession, signInWithOtp } = useAuth();
  const navigate = useNavigate();

  // 30-second countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsExpired(true);
    }
  }, [timeLeft]);

  const handleResendOTP = async () => {
    try {
      console.log("Resending OTP to email:", email);
      
      const { error } = await signInWithOtp(email);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend OTP",
          variant: "destructive",
        });
        return;
      }
      
      // Reset timer and expired state
      setTimeLeft(30);
      setIsExpired(false);
      setOtp("");
      
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email",
        variant: "success",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    if (isExpired) {
      toast({
        title: "OTP Expired",
        description: "The OTP has expired. Please request a new one.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Verifying OTP for email:", email, "with code:", otp);
      
      // Verify the OTP token
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email"
      });

      console.log("OTP verification response:", { data, error });

      if (error) {
        toast({
          title: "OTP Incorrect",
          description: "Please enter correct OTP",
          variant: "destructive",
        });
        setOtp(""); // Clear the OTP field
        return;
      }

      if (data?.user) {
        console.log("OTP verification successful, user:", data.user.email);
        
        // Refresh the session after successful verification
        await refreshSession();
        
        toast({
          title: "Success",
          description: "You have been successfully logged in",
          variant: "success",
        });

        // Redirect to dashboard
        navigate("/dashboard");

        if (onVerificationComplete) {
          onVerificationComplete();
        }
      } else {
        console.warn("OTP verification returned no user");
        toast({
          title: "Verification Issue",
          description: "Verification succeeded but no user was returned",
          variant: "warning",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during verification",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `00:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pt-4">
      <p className="text-center">
        Enter the 6-digit OTP sent to <strong>{email}</strong>
      </p>
      
      <div className="flex justify-center">
        <InputOTP 
          maxLength={6}
          value={otp}
          onChange={setOtp}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, i) => (
                <InputOTPSlot key={i} {...slot} index={i} />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>

      {/* Timer Display */}
      <div className="flex items-center justify-center space-x-2">
        <Timer className="h-4 w-4" />
        <span className={`text-sm font-medium ${isExpired ? 'text-red-500' : 'text-gray-600'}`}>
          {isExpired ? "OTP Expired" : `OTP expires in ${formatTime(timeLeft)}`}
        </span>
      </div>

      <Button
        onClick={handleVerify}
        disabled={isSubmitting || otp.length !== 6 || isExpired}
        className="w-full"
      >
        {isSubmitting ? "Verifying..." : "Verify & Sign In"}
      </Button>
      
      <div className="space-y-2">
        {isExpired && (
          <Button
            variant="outline"
            onClick={handleResendOTP}
            className="w-full"
          >
            Resend OTP
          </Button>
        )}
        
        <Button
          variant="ghost"
          onClick={onBackToEmail}
          className="w-full text-sm"
        >
          Change Email Address
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
