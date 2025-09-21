"use client";

import { useState, useEffect } from "react";
import { Save, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { FileUpload } from "@/components/admin/file-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor"; // Ensure this is theme-aware
import { AdminLayout } from "@/components/admin/layout";
import Image from "next/image";

interface AboutContent {
  content: string;
  image?: string;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutContent>({
    content: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/about");
      if (response.ok) {
        const data = await response.json();
        setAboutData(data.data || { content: "", image: "" });
      } else {
        throw new Error("Failed to fetch content");
      }
    } catch (error) {
      console.error("Failed to fetch about content:", error);
      toast({
        title: "Error",
        description: "Failed to fetch about content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(aboutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save content");
      }
      
      toast({
        title: "Success",
        description: "About content updated successfully.",
      });
    } catch (error: any) {
      console.error("Failed to save about content:", error);
      toast({
        title: "Error",
        description: `Failed to save: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (content: string) => {
    setAboutData((prev) => ({ ...prev, content }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setAboutData((prev) => ({ ...prev, image: imageUrl }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-background">
          <Spinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-background">
        <div className="relative z-10 bg-card/80 backdrop-blur-xl border-b border-border p-8 shadow-sm flex justify-between items-center animate-fade-in-down">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              About Us Management
            </h1>
            <p className="text-muted-foreground text-lg mt-1">
              Craft your school's story with compelling content and visuals.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Spinner size="small" className="mr-2" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
            <div className="lg:col-span-2 animate-fade-in-up">
              <Card>
                <CardHeader>
                  <CardTitle>About Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    value={aboutData.content}
                    onChange={handleContentChange}
                    placeholder="Write about your school's history, mission, and values here..."
                    height="500px"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8 animate-fade-in-up" style={{animationDelay: '100ms'}}>
              <Card>
                <CardHeader>
                  <CardTitle>About Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onUpload={handleImageUpload}
                    currentImage={aboutData.image}
                  />
                  <p className="text-sm text-muted-foreground mt-4">
                    Upload a captivating image that represents your school.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-6 w-6 mr-2 text-yellow-400" /> Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-3 text-sm">
                  <p>• Use clear, concise language to tell your school's story.</p>
                  <p>• Highlight unique programs, achievements, and values.</p>
                  <p>• Incorporate keywords for better search engine visibility.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {aboutData.content && (
            <div className="mt-8 animate-fade-in-up" style={{animationDelay: '200ms'}}>
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div
                      className="prose dark:prose-invert max-w-none text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: aboutData.content }}
                    />
                    {aboutData.image && (
                      <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={aboutData.image}
                          alt="About Us Preview"
                          fill
                          className="object-cover"
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/000000/FFFFFF?text=Error'; }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
       <style jsx global>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
      `}</style>
    </AdminLayout>
  );
}
