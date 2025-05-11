import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Check, Mail, User } from "lucide-react";

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  gender: z.enum(["male", "female", "other"], { 
    required_error: "Please select a gender option" 
  }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  country: z.string().min(1, { message: "Please select a country" })
});

type FormValues = z.infer<typeof formSchema>;

// Top countries list for the dropdown
const countries = [
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Italy",
  "Japan",
  "Mexico",
  "Russia",
  "South Africa",
  "South Korea",
  "Spain",
  "United Kingdom",
  "United States",
];

const Consultation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      email: "",
      country: "",
    },
  });

  const submitToGoogleSheet = async (data: FormValues) => {
  const scriptUrl = "https://script.google.com/macros/s/AKfycbyyJYkhFSYUMH_xKhKET7o_EBJ4bnNsnRrmQGlKB6JCut3ckdSiEn18UpHXZMToGWH-Wg/exec";
  
  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: data.name,
        gender: data.gender,
        email: data.email,
        country: data.country,
        timestamp: new Date().toISOString(),
      }),
    });

    return true; // Assume success (no-cors mode)
  } catch (error) {
    console.error("Error submitting form:", error);
    return false;
  }
};


  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await submitToGoogleSheet(data);
      
      if (result) {
        setIsSubmitted(true);
        toast.success("Your consultation request has been received!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-health-light">
      <header className="py-6 text-white bg-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Free Consultation</h1>
          <p className="text-center mt-2 text-health-light">Get expert advice for your health journey</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Book Your Free Consultation</h2>
            
            {isSubmitted ? (
              <div className="p-6 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Thank you for your interest!</h3>
                <p className="text-gray-600 mb-6">
                  We've received your consultation request. One of our health experts will reach out to you shortly.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  variant="outline"
                  className="mx-auto"
                >
                  Request Another Consultation
                </Button>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-6">
                  Fill out the form below to schedule a free consultation with our health experts and get personalized advice for your health journey.
                </p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input placeholder="Enter your full name" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Gender Field */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-wrap gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">Male</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">Female</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="other" />
                                </FormControl>
                                <FormLabel className="font-normal">Other</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input type="email" placeholder="you@example.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Country Field */}
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                      <p className="text-purple-700">
                        Personalized guidance from health professionals can significantly improve your chances of achieving your health goals.
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button type="submit" className="px-10" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Request Consultation"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="text-white py-6 mt-12 bg-zinc-950">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Health Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Consultation;
