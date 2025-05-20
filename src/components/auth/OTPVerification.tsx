
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email: string;
  onVerificationComplete?: () => void;
}

const OTPVerification = ({ email, onVerificationComplete }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { refreshSession } = useAuth();

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Create auth URL with current origin for redirection
      const redirectTo = `${window.location.origin}`;
      
      // Resend OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectTo,
        }
      });
      
      if (error) {
        if (error.message.includes('captcha')) {
          toast({
            title: "CAPTCHA Required",
            description: "Please enable CAPTCHA in your Supabase Authentication settings or try again later.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to resend OTP",
            variant: "destructive",
          });
        }
        return;
      }
      
      toast({
        title: "Success",
        description: "Check your email for the new OTP code",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
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

    setIsSubmitting(true);
    try {
      // Verify the OTP token
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email"
      });

      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message || "Invalid OTP code",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Refresh the session after successful verification
      await refreshSession();
      
      toast({
        title: "Success",
        description: "You have been successfully logged in",
        variant: "success",
      });

      if (onVerificationComplete) {
        onVerificationComplete();
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

  return (
    <div className="space-y-4 pt-4">
      <p className="text-center">
        We've sent a verification code to <strong>{email}</strong>.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Check your email and enter the 6-digit code below.
      </p>
      
      <div className="flex justify-center">
        <InputOTP 
          maxLength={6}
          value={otp}
          onChange={setOtp}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots && slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} index={index} />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleVerify}
          disabled={isSubmitting || otp.length !== 6}
          className="w-full"
        >
          {isSubmitting ? "Verifying..." : "Verify & Sign In"}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isResending}
          className="w-full"
        >
          {isResending ? "Sending..." : "Resend Code"}
        </Button>
      </div>
      
      <div className="text-center text-sm text-amber-600">
        Note: If you don't receive the email, please check your spam folder.
      </div>
    </div>
  );
};

export default OTPVerification;
