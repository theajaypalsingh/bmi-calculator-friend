
import { useState, useRef, useEffect } from "react";
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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const { refreshSession, signInWithOtp } = useAuth();

  // Load Turnstile script
  useEffect(() => {
    // Add Turnstile script if it doesn't exist
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement('script');
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Render Turnstile widget when script is loaded
  useEffect(() => {
    if (!captchaRef.current) return;

    const interval = setInterval(() => {
      if (window.turnstile && captchaRef.current) {
        clearInterval(interval);
        
        // Reset any existing widget
        if (widgetId) {
          window.turnstile.reset(widgetId);
        }
        
        // Render new widget with Supabase's sitekey
        const id = window.turnstile.render(captchaRef.current, {
          sitekey: "0x4AAAAAAACvyDzP2OvELbuz", // Use Supabase's actual sitekey for Turnstile
          callback: (token: string) => {
            console.log("CAPTCHA token received for resend");
            setTurnstileToken(token);
          },
        });
        
        setWidgetId(id);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [captchaRef.current]);

  const handleResend = async () => {
    if (!turnstileToken) {
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA verification to resend the code",
        variant: "destructive",
      });
      return;
    }
    
    setIsResending(true);
    try {
      // Use the signInWithOtp method from AuthContext
      const { error } = await signInWithOtp(email, turnstileToken);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend OTP",
          variant: "destructive",
        });
        
        // Reset CAPTCHA on error
        if (widgetId) {
          window.turnstile.reset(widgetId);
          setTurnstileToken(null);
        }
        
        setIsResending(false);
        return;
      }
      
      // Reset the CAPTCHA after successful request
      if (widgetId) {
        window.turnstile.reset(widgetId);
        setTurnstileToken(null);
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
      
      // Reset CAPTCHA on error
      if (widgetId) {
        window.turnstile.reset(widgetId);
        setTurnstileToken(null);
      }
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

      <Button
        onClick={handleVerify}
        disabled={isSubmitting || otp.length !== 6}
        className="w-full"
      >
        {isSubmitting ? "Verifying..." : "Verify & Sign In"}
      </Button>
      
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Didn't receive the code? Complete the CAPTCHA below to resend.
        </p>
        
        {/* Turnstile CAPTCHA container for resend */}
        <div className="flex justify-center">
          <div ref={captchaRef} className="turnstile-container"></div>
        </div>
        
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isResending || !turnstileToken}
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
