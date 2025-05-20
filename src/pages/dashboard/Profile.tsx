
import { useState } from "react";
import { useProfile, Profile } from "@/hooks/useProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { profile, updateProfile, loading } = useProfile();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Profile>>({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    country: profile?.country || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateProfile(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              value={user?.email || ""}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name || ""}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone_number" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number || ""}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              Country
            </label>
            <Input
              id="country"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              placeholder="Enter your country"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
