
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import OTPVerification from "./OTPVerification";
import { supabase } from "@/integrations/supabase/client";

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
  const captchaRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();

  // If user is already logged in, close the modal
  if (user && isOpen) {
    onClose();
    return null;
  }

  // Load Turnstile script
  useEffect(() => {
    if (!isOpen) return;
    
    // Add Turnstile script if it doesn't exist
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement('script');
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [isOpen]);

  // Render Turnstile widget when script is loaded
  useEffect(() => {
    if (!isOpen || !captchaRef.current || showOTP) return;

    const interval = setInterval(() => {
      if (window.turnstile && captchaRef.current) {
        clearInterval(interval);
        
        // Reset any existing widget
        if (widgetId) {
          window.turnstile.reset(widgetId);
        }
        
        // Render new widget
        const id = window.turnstile.render(captchaRef.current, {
          sitekey: "1x00000000000000000000AA", // This is a placeholder - Supabase handles the actual sitekey
          callback: (token: string) => {
            setTurnstileToken(token);
          },
        });
        
        setWidgetId(id);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, captchaRef.current, showOTP]);

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
      // Create auth URL with current origin for redirection
      const redirectTo = `${window.location.origin}`;
      
      // Sign in with OTP via email, including the CAPTCHA token
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectTo,
          captchaToken: turnstileToken
        }
      });
      
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
            <div className="flex justify-center">
              <div ref={captchaRef} className="turnstile-container"></div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !turnstileToken}
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
