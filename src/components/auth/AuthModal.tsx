
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import OTPVerification from "./OTPVerification";

// Declare turnstile types
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    };
    onloadTurnstileCallback: () => void;
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetId = useRef<string | null>(null);
  
  const { user, signInWithOtp } = useAuth();

  // If user is already logged in, close the modal
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  // Initialize Turnstile
  useEffect(() => {
    // Load Turnstile script if not already loaded
    if (!document.getElementById('turnstile-script') && isOpen && !showOTP) {
      const script = document.createElement('script');
      script.id = 'turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      
      // Callback when script is loaded
      window.onloadTurnstileCallback = () => {
        if (captchaContainerRef.current && window.turnstile) {
          renderCaptcha();
        }
      };
      
      script.onload = window.onloadTurnstileCallback;
      document.head.appendChild(script);
    } else if (isOpen && !showOTP && window.turnstile) {
      // If script is already loaded, render captcha
      renderCaptcha();
    }

    // Reset captcha when dialog closes
    return () => {
      if (captchaWidgetId.current && window.turnstile) {
        window.turnstile.reset(captchaWidgetId.current);
      }
    };
  }, [isOpen, showOTP]);

  // Function to render the captcha
  const renderCaptcha = () => {
    if (captchaContainerRef.current && window.turnstile) {
      // Reset any existing widget
      if (captchaWidgetId.current) {
        window.turnstile.reset(captchaWidgetId.current);
      }
      
      // Render new widget
      captchaWidgetId.current = window.turnstile.render(captchaContainerRef.current, {
        sitekey: '0x4AAAAAAAMQBljiQn2VdT3W',  // Replace with your Turnstile site key
        callback: (token: string) => {
          console.log("Captcha verified:", token);
          setCaptchaToken(token);
        },
        'theme': 'light',
        'refresh-expired': 'auto'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!captchaToken) {
      toast({
        title: "Captcha Required",
        description: "Please complete the captcha verification",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Sending OTP to email:", email);
      
      const { error } = await signInWithOtp(email, captchaToken);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP",
          variant: "destructive",
        });
        setIsSubmitting(false);
        
        // Reset captcha on error
        if (captchaWidgetId.current && window.turnstile) {
          window.turnstile.reset(captchaWidgetId.current);
          setCaptchaToken("");
        }
        return;
      }
      
      setShowOTP(true);
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      
      // Reset captcha on error
      if (captchaWidgetId.current && window.turnstile) {
        window.turnstile.reset(captchaWidgetId.current);
        setCaptchaToken("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = () => {
    onClose();
  };

  // Email validation
  const isValidEmail = email.trim() && email.includes('@');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showOTP ? "Enter Verification Code" : "Sign In / Sign Up"}
          </DialogTitle>
          <DialogDescription>
            {showOTP 
              ? "Enter the 6-digit code sent to your email"
              : "We'll send you a verification code to your email"
            }
          </DialogDescription>
        </DialogHeader>
        
        {showOTP ? (
          <OTPVerification 
            email={email} 
            captchaToken={captchaToken}
            onVerificationComplete={handleVerificationComplete}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            {/* Captcha Container */}
            <div className="flex justify-center my-4">
              <div ref={captchaContainerRef}></div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!isValidEmail || !captchaToken || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              We'll send you a verification code to sign in instantly.
            </p>
            <div className="text-center text-sm text-amber-600">
              Note: If you're experiencing issues with verification, please check your spam folder for the OTP email.
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
