
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPVerificationProps {
  email: string;
}

const OTPVerification = ({ email }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();

  const handleResend = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(email);
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend OTP",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Check your email for the new login link",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <p className="text-center">
        We've sent a login link to <strong>{email}</strong>.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Check your email and click the link to sign in.
      </p>
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Resend Email"}
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
