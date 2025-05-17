
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Check, Mail, User, Calendar, Clock, MessageCircle } from "lucide-react";

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
    // Updated Google Apps Script URL with proper deployment ID
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyyJYkhFSYUMH_xKhKET7o_EBJ4bnNsnRrmQGlKB6JCut3ckdSiEn18UpHXZMToGWH-Wg/exec";
    
    try {
      // Use fetch with no-cors mode to handle CORS issues
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors", // This is important for cross-origin requests to Google Scripts
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

      return true; // Assume success since no-cors doesn't return readable response
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
    <div className="min-h-screen bg-gradient-to-b from-white to-health-light pb-16">
      <header className="py-10 text-white bg-gradient-to-r from-health-primary to-health-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158')] bg-cover bg-center opacity-15"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 animate-fade-in">
            <span className="text-health-light">Free</span> Health Consultation
          </h1>
          <p className="text-center text-lg text-health-light opacity-90 max-w-2xl mx-auto">
            Connect with our expert health coaches who will guide you through your personal wellness journey
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 -mt-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white rounded-xl shadow-lg overflow-hidden border-0">
            <div className="md:grid md:grid-cols-5">
              {/* Left side - Image column for desktop */}
              <div className="hidden md:block md:col-span-2 bg-health-primary/10">
                <div className="h-full relative">
                  <img 
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                    alt="Health consultation" 
                    className="object-cover h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-health-primary/60 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-semibold mb-2">Why Get a Consultation?</h3>
                    <ul className="text-white text-sm space-y-2">
                      <li className="flex items-center"><Clock className="h-4 w-4 mr-2" /> Personalized advice</li>
                      <li className="flex items-center"><Calendar className="h-4 w-4 mr-2" /> Customized health plan</li>
                      <li className="flex items-center"><MessageCircle className="h-4 w-4 mr-2" /> Follow-up support</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Right side - Form column */}
              <div className="p-6 md:p-8 md:col-span-3">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Book Your Free Consultation</h2>
                
                {isSubmitted ? (
                  <div className="p-6 text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">Thank you for your interest!</h3>
                    <p className="text-gray-600 mb-6">
                      We've received your consultation request. One of our health experts will reach out to you within 24 hours.
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
                    <p className="text-gray-600 mb-6">
                      Fill out this short form and we'll connect you with a health expert who specializes in your area of interest.
                    </p>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name Field */}
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input placeholder="Enter your full name" className="pl-10 border-gray-300" {...field} />
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
                              <FormLabel className="text-gray-700">Gender</FormLabel>
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
                              <FormLabel className="text-gray-700">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input type="email" placeholder="you@example.com" className="pl-10 border-gray-300" {...field} />
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
                              <FormLabel className="text-gray-700">Country</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-gray-300">
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
                        
                        <div className="p-4 bg-health-light rounded-md border border-health-primary/20 mt-6">
                          <p className="text-health-primary font-medium flex items-start">
                            <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Your free consultation will last approximately 30 minutes and can be scheduled at your convenience.</span>
                          </p>
                        </div>
                        
                        <div className="flex justify-center pt-4">
                          <Button type="submit" className="px-10 py-6 text-base font-medium bg-health-primary hover:bg-health-dark" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Request Your Free Consultation"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </>
                )}
              </div>
            </div>
          </Card>
          
          {/* Additional information cards */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Calendar className="h-8 w-8 text-health-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600">Choose a time that works best for you. We offer consultations 7 days a week.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MessageCircle className="h-8 w-8 text-health-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Expert Advice</h3>
                <p className="text-gray-600">Our health professionals have years of experience in personalized health coaching.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <User className="h-8 w-8 text-health-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Personalized Plan</h3>
                <p className="text-gray-600">Receive a custom health plan designed specifically for your needs and goals.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Consultation;
