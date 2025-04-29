import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { registerSchema } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { Loader2 } from "lucide-react";

// Generate a random hex color for avatar
const generateRandomColor = () => {
  const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function Register() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      avatarColor: generateRandomColor(),
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      await register(values);
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      navigate("/create-household");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <svg
              className="w-8 h-8 text-primary mr-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 8.36842C22 9.57438 21.1046 10.5453 20 10.5453C18.8954 10.5453 18 9.57438 18 8.36842C18 7.16247 18.8954 6.19153 20 6.19153C21.1046 6.19153 22 7.16247 22 8.36842Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.873 9.36842H9.12704C7.25337 9.36842 5.73313 10.9839 5.73313 12.9785V19.0001H18.2668V12.9785C18.2668 10.9839 16.7466 9.36842 14.873 9.36842ZM12 12.9474C11.0572 12.9474 10.2934 13.7694 10.2934 14.7895C10.2934 15.8095 11.0572 16.6316 12 16.6316C12.9428 16.6316 13.7066 15.8095 13.7066 14.7895C13.7066 13.7694 12.9428 12.9474 12 12.9474Z"
                fill="currentColor"
              />
              <path
                d="M12 8.36842C13.1046 8.36842 14 7.39748 14 6.19153C14 4.98557 13.1046 4.01463 12 4.01463C10.8954 4.01463 10 4.98557 10 6.19153C10 7.39748 10.8954 8.36842 12 8.36842Z"
                fill="currentColor"
              />
              <path
                d="M6 10.5453C7.10457 10.5453 8 9.57438 8 8.36842C8 7.16247 7.10457 6.19153 6 6.19153C4.89543 6.19153 4 7.16247 4 8.36842C4 9.57438 4.89543 10.5453 6 10.5453Z"
                fill="currentColor"
              />
              <path
                d="M5.73313 19.0001H18.2668V20.0001H5.73313V19.0001Z"
                fill="currentColor"
              />
            </svg>
            <h1 className="text-2xl font-bold text-primary">ChoreSync</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">
            Start managing your household chores
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center w-full">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
