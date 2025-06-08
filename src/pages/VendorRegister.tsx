import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const VendorRegister = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    storeName: "",
    whatsappNumber: "",
    description: "",
    studentId: "",
    studentCardImage: null as File | null,
    studentIdImage: null as File | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Prefill form with user data if available
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
        whatsappNumber: profile.phone || "",
      }));
    }
  }, [profile]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (files[0].size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setError(null);
    }
  };
  
  const validateEmail = (email: string) => {
    const studentIdMatch = email.match(/^(\d+)@/);
    if (studentIdMatch && studentIdMatch[1]) {
      if (!formData.studentId) {
        setFormData(prev => ({
          ...prev,
          studentId: studentIdMatch[1]
        }));
      }
    }
    
    return email.includes('@');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in or register before applying as a vendor",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError("Please use a valid email address");
      return;
    }
    
    if (!formData.studentCardImage || !formData.studentIdImage) {
      setError("Please upload both your student card and a selfie photo of yourself");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Starting vendor registration process");
      
      // Check if vendor-documents bucket exists, if not handle gracefully
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'vendor-documents');
      
      if (!bucketExists) {
        console.log("Creating vendor-documents bucket");
        const { error: bucketError } = await supabase.storage.createBucket('vendor-documents', {
          public: false,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (bucketError) {
          console.error("Bucket creation error:", bucketError);
        }
      }
      
      // Upload student card image
      const cardFilePath = `${user.id}/${Date.now()}_student_card.${formData.studentCardImage.name.split('.').pop()}`;
      console.log("Uploading student card to:", cardFilePath);
      
      const { error: cardUploadError, data: cardData } = await supabase.storage
        .from("vendor-documents")
        .upload(cardFilePath, formData.studentCardImage, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (cardUploadError) {
        console.error("Card upload error:", cardUploadError);
        throw new Error(`Error uploading student card: ${cardUploadError.message}`);
      }
      
      console.log("Student card uploaded successfully:", cardData);
      
      // Upload student ID image
      const idFilePath = `${user.id}/${Date.now()}_student_id.${formData.studentIdImage.name.split('.').pop()}`;
      console.log("Uploading student ID to:", idFilePath);
      
      const { error: idUploadError, data: idData } = await supabase.storage
        .from("vendor-documents")
        .upload(idFilePath, formData.studentIdImage, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (idUploadError) {
        console.error("ID upload error:", idUploadError);
        throw new Error(`Error uploading student ID: ${idUploadError.message}`);
      }
      
      console.log("Student ID uploaded successfully:", idData);
      
      // Create vendor record
      console.log("Creating vendor record for user:", user.id);
      
      const { error: vendorError } = await supabase
        .from("vendors")
        .insert({
          user_id: user.id,
          name: formData.name,
          email: formData.email,
          store_name: formData.storeName,
          whatsapp_number: formData.whatsappNumber,
          description: formData.description,
          student_id: formData.studentId,
          student_card_image: cardFilePath,
          student_id_image: idFilePath,
          verified: false
        });
        
      if (vendorError) {
        console.error("Vendor record error:", vendorError);
        throw new Error(`Error registering vendor: ${vendorError.message}`);
      }
      
      console.log("Vendor record created successfully");
      
      toast({
        title: "Registration submitted",
        description: "Your vendor application has been submitted for review",
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Vendor registration error:", error);
      let errorMessage = "An unexpected error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <main className="container px-4 py-12 mx-auto">
          <div className="max-w-md p-6 mx-auto border rounded-lg bg-card">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold">Application Submitted</h1>
              <p className="mb-6 text-muted-foreground">
                Thank you for applying to become a vendor on CampusEats. We'll review your
                application and get back to you via email within 1-2 business days.
              </p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="container px-4 py-8 mx-auto md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="mb-2 text-2xl font-bold text-center">Become a Vendor</h1>
          <p className="mb-8 text-center text-muted-foreground">
            Register to sell your food and snacks to fellow students on campus
          </p>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-card">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="storeName" className="block mb-1 text-sm font-medium">
                    Store Name *
                  </label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    required
                    placeholder="Your store/business name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  For student emails, we'll automatically extract your student number
                </p>
              </div>
              
              <div>
                <label htmlFor="whatsappNumber" className="block mb-1 text-sm font-medium">
                  WhatsApp Number *
                </label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 071 234 5678"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block mb-1 text-sm font-medium">
                  Business Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the food/snacks you'll be selling, your specialties, etc."
                  rows={4}
                />
              </div>
              
              <div>
                <label htmlFor="studentId" className="block mb-1 text-sm font-medium">
                  Student Number *
                </label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  placeholder="Your student number"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentCardImage" className="block mb-1 text-sm font-medium">
                    Student Card Photo *
                  </label>
                  <Input
                    id="studentCardImage"
                    name="studentCardImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload a clear photo of your student card (max 5MB)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="studentIdImage" className="block mb-1 text-sm font-medium">
                    Verification Selfie *
                  </label>
                  <Input
                    id="studentIdImage"
                    name="studentIdImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload a selfie holding your student card for verification (max 5MB)
                  </p>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 p-4 text-sm bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Application Process:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Submit your application with required documents</li>
              <li>Admin reviews your application and documents</li>
              <li>Receive approval notification via email</li>
              <li>Start selling to fellow students!</li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VendorRegister;
