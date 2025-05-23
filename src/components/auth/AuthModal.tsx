
import { useState, useEffect } from "react";
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

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  
  const { user, signInWithOtp } = useAuth();

  // If user is already logged in, close the modal
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

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
    
    setIsSubmitting(true);
    
    try {
      console.log("Sending OTP to email:", email);
      
      const { error } = await signInWithOtp(email);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      setShowOTP(true);
      toast({
        title: "Magic Link Sent",
        description: "Check your email for the login link. You can also use the OTP sent to your email.",
        variant: "success",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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
              ? "Check your email for the magic link or enter the 6-digit code sent to your email"
              : "We'll send you a verification link and code to your email"
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
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!isValidEmail || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Magic Link"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              We'll send you a magic link and verification code to sign in instantly.
            </p>
            <div className="text-center text-sm text-amber-600">
              Note: If you're experiencing issues with verification, please check your spam folder for the email.
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
