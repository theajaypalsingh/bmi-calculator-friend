
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email: string;
  captchaToken: string;
  onVerificationComplete?: () => void;
}

// Declare turnstile types
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const OTPVerification = ({ email, captchaToken: initialCaptchaToken, onVerificationComplete }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [newCaptchaToken, setNewCaptchaToken] = useState("");
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetId = useRef<string | null>(null);
  const { refreshSession, signInWithOtp } = useAuth();

  // Initialize Turnstile for resend functionality
  useEffect(() => {
    // If turnstile is already loaded, render the captcha
    if (window.turnstile && captchaContainerRef.current) {
      console.log("Rendering resend captcha");
      renderCaptcha();
    }

    return () => {
      if (captchaWidgetId.current && window.turnstile) {
        window.turnstile.reset(captchaWidgetId.current);
      }
    };
  }, []);

  // Function to render the captcha
  const renderCaptcha = () => {
    if (captchaContainerRef.current && window.turnstile) {
      // Reset any existing widget
      if (captchaWidgetId.current) {
        window.turnstile.reset(captchaWidgetId.current);
      }
      
      // Render new widget
      try {
        captchaWidgetId.current = window.turnstile.render(captchaContainerRef.current, {
          sitekey: '0x4AAAAAAAMQBljiQn2VdT3W',  // Using the provided site key
          callback: (token: string) => {
            console.log("Resend captcha verified:", token.substring(0, 10) + "...");
            setNewCaptchaToken(token);
          },
          'theme': 'light',
          'refresh-expired': 'auto'
        });
        console.log("Resend captcha widget rendered with ID:", captchaWidgetId.current);
      } catch (error) {
        console.error("Error rendering resend captcha:", error);
      }
    } else {
      console.warn("Cannot render resend captcha - container or turnstile not available");
    }
  };

  const handleResend = async () => {
    if (!newCaptchaToken) {
      toast({
        title: "Captcha Required",
        description: "Please complete the captcha verification to resend the code",
        variant: "destructive",
      });
      return;
    }
    
    setIsResending(true);
    try {
      console.log("Resending OTP to email:", email);
      console.log("With captcha token:", newCaptchaToken.substring(0, 10) + "...");
      
      const { error } = await signInWithOtp(email, newCaptchaToken);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend OTP",
          variant: "destructive",
        });
        setIsResending(false);
        
        // Reset captcha on error
        if (captchaWidgetId.current && window.turnstile) {
          window.turnstile.reset(captchaWidgetId.current);
          setNewCaptchaToken("");
        }
        return;
      }
      
      toast({
        title: "Success",
        description: "Check your email for the new OTP code",
      });
      
      // Reset captcha after successful resend
      if (captchaWidgetId.current && window.turnstile) {
        window.turnstile.reset(captchaWidgetId.current);
        setNewCaptchaToken("");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      
      // Reset captcha on error
      if (captchaWidgetId.current && window.turnstile) {
        window.turnstile.reset(captchaWidgetId.current);
        setNewCaptchaToken("");
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
          Didn't receive the code? You can request another one.
        </p>
        
        {/* Captcha Container for Resend */}
        <div className="flex justify-center my-4">
          <div 
            ref={captchaContainerRef} 
            className="min-h-[65px] flex items-center justify-center"
          >
            {!window.turnstile && (
              <div className="text-sm text-muted-foreground">Loading captcha...</div>
            )}
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isResending || !newCaptchaToken}
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
