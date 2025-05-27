
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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setShowOTP(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSendOTP = async (e: React.FormEvent) => {
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
        title: "OTP Sent",
        description: "Please check your email for the 6-digit OTP code",
        variant: "success",
      });
    } catch (error) {
      console.error("Send OTP error:", error);
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

  const handleBackToEmail = () => {
    setShowOTP(false);
    setEmail("");
  };

  // Email validation
  const isValidEmail = email.trim() && email.includes('@');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showOTP ? "Enter Verification Code" : "Sign In"}
          </DialogTitle>
          <DialogDescription>
            {showOTP 
              ? "Enter the 6-digit OTP sent to your email"
              : "Enter your email address to receive an OTP"
            }
          </DialogDescription>
        </DialogHeader>
        
        {showOTP ? (
          <OTPVerification 
            email={email} 
            onVerificationComplete={handleVerificationComplete}
            onBackToEmail={handleBackToEmail}
          />
        ) : (
          <form onSubmit={handleSendOTP} className="space-y-4 pt-4">
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
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
