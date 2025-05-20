
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import OTPVerification from "./OTPVerification";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, config: any) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [isTurnstileLoaded, setIsTurnstileLoaded] = useState(false);
  const captchaRef = useRef<HTMLDivElement>(null);
  
  const { user, signInWithOtp } = useAuth();

  // If user is already logged in, close the modal
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  // Load Turnstile script
  useEffect(() => {
    if (!isOpen) return;
    
    // Check if Turnstile script already exists or is loaded
    if (window.turnstile) {
      console.log("Turnstile already loaded in window");
      setIsTurnstileLoaded(true);
      return;
    }
    
    if (!document.querySelector('script[src*="turnstile"]')) {
      console.log("Adding Turnstile script");
      const script = document.createElement('script');
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Turnstile script loaded successfully");
        setIsTurnstileLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Turnstile script");
      };
      document.head.appendChild(script);
    } else {
      console.log("Turnstile script already in DOM");
      setIsTurnstileLoaded(true);
    }
  }, [isOpen]);

  // Render Turnstile widget when script is loaded
  useEffect(() => {
    if (!isOpen || !captchaRef.current || showOTP) return;
    
    console.log("isTurnstileLoaded:", isTurnstileLoaded);
    console.log("window.turnstile available:", typeof window.turnstile !== 'undefined');
    
    // If turnstile is not loaded yet, check again after a delay
    if (!isTurnstileLoaded || typeof window.turnstile === 'undefined') {
      console.log("Turnstile not fully loaded yet, will check again");
      const checkAgain = setTimeout(() => {
        if (typeof window.turnstile !== 'undefined') {
          console.log("Turnstile now available in delayed check");
          setIsTurnstileLoaded(true);
        }
      }, 500);
      
      return () => clearTimeout(checkAgain);
    }
    
    console.log("Attempting to render Turnstile widget");
    
    try {
      // Reset any existing widget
      if (widgetId && window.turnstile) {
        console.log("Resetting existing widget:", widgetId);
        window.turnstile.reset(widgetId);
      }
      
      // Render new widget
      console.log("Rendering new Turnstile widget");
      const id = window.turnstile.render(captchaRef.current, {
        sitekey: "0x4AAAAAAACvyDzP2OvELbuz", // Supabase's sitekey for Turnstile
        callback: (token: string) => {
          console.log("CAPTCHA token received:", token.substring(0, 10) + "...");
          setTurnstileToken(token);
        },
        "expired-callback": () => {
          console.log("CAPTCHA token expired");
          setTurnstileToken(null);
        },
        "error-callback": (error: any) => {
          console.log("CAPTCHA error occurred:", error);
          setTurnstileToken(null);
        }
      });
      
      console.log("Turnstile widget rendered with ID:", id);
      setWidgetId(id);
    } catch (error) {
      console.error("Error rendering Turnstile widget:", error);
    }
  }, [isOpen, captchaRef.current, showOTP, isTurnstileLoaded]);

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
    
    if (!turnstileToken) {
      toast({
        title: "CAPTCHA Required",
        description: "Please complete the CAPTCHA verification",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Sending OTP with token:", turnstileToken.substring(0, 10) + "...");
      const { error } = await signInWithOtp(email, turnstileToken);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP",
          variant: "destructive",
        });
        
        // Reset CAPTCHA on error
        if (widgetId) {
          window.turnstile.reset(widgetId);
          setTurnstileToken(null);
        }
        
        setIsSubmitting(false);
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
      
      // Reset CAPTCHA on error
      if (widgetId) {
        window.turnstile.reset(widgetId);
        setTurnstileToken(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = () => {
    onClose();
  };

  // Debug info for button state
  const isValidEmail = email.trim() && email.includes('@');
  const canSubmit = isValidEmail && turnstileToken !== null;
  
  console.log("Email valid:", isValidEmail);
  console.log("CAPTCHA token:", turnstileToken ? "Present" : "Not present");
  console.log("Button can submit:", canSubmit);

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
            
            {/* Turnstile CAPTCHA container */}
            <div className="flex justify-center mb-2">
              <div ref={captchaRef} className="turnstile-container"></div>
            </div>
            
            {/* Debug info (temporary) */}
            <div className="text-xs text-gray-500">
              <p>Email valid: {isValidEmail ? "Yes" : "No"}</p>
              <p>CAPTCHA completed: {turnstileToken ? "Yes" : "No"}</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!canSubmit || isSubmitting}
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
