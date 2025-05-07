
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ActivitySquare } from 'lucide-react';

export type FormData = {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
};

interface StepCountFormProps {
  onSubmit: (data: FormData) => void;
}

const StepCountForm: React.FC<StepCountFormProps> = ({ onSubmit }) => {
  const form = useForm<FormData>({
    defaultValues: {
      age: 30,
      weight: 70,
      height: 170,
      gender: 'male',
      activityLevel: 'lightlyActive'
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField 
          control={form.control} 
          name="age" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age (years)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="10" 
                  max="100" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                />
              </FormControl>
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="height" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="100" 
                  max="250" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                />
              </FormControl>
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="weight" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="30" 
                  max="200" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                />
              </FormControl>
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="gender" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="activityLevel" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Physical Activity Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary – Little or no exercise</SelectItem>
                  <SelectItem value="lightlyActive">Lightly Active – Light exercise 1–3 days/week</SelectItem>
                  <SelectItem value="moderatelyActive">Moderately Active – Moderate exercise 3–5 days/week</SelectItem>
                  <SelectItem value="veryActive">Very Active – Hard exercise 6–7 days/week</SelectItem>
                  <SelectItem value="superActive">Super Active – Intense training or physical job daily</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} 
        />

        <div className="flex justify-center mt-6">
          <Button type="submit" className="px-6 bg-red-800 hover:bg-red-700">
            <ActivitySquare className="mr-2 h-4 w-4" />
            Calculate Step Goal
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StepCountForm;
