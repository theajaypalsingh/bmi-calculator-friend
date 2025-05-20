
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
  const { refreshSession, signInWithOtp } = useAuth();

  const handleResend = async () => {
    setIsResending(true);
    try {
      console.log("Resending OTP to email:", email);
      
      const { error } = await signInWithOtp(email);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend OTP",
          variant: "destructive",
        });
        setIsResending(false);
        return;
      }
      
      toast({
        title: "Magic Link Resent",
        description: "Check your email for the new login link and OTP code",
        variant: "success",
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
        We've sent a verification email to <strong>{email}</strong>.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Check your email for the magic link to sign in instantly.
      </p>
      <p className="text-center text-sm font-medium">
        Or enter the 6-digit code below:
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

      <Button
        onClick={handleVerify}
        disabled={isSubmitting || otp.length !== 6}
        className="w-full"
      >
        {isSubmitting ? "Verifying..." : "Verify & Sign In"}
      </Button>
      
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Didn't receive the email? You can request another one.
        </p>
        
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isResending}
          className="w-full"
        >
          {isResending ? "Sending..." : "Resend Magic Link"}
        </Button>
      </div>
      
      <div className="text-center text-sm text-amber-600">
        Note: If you don't receive the email, please check your spam folder.
      </div>
    </div>
  );
};

export default OTPVerification;
