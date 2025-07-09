/**
 * About Us Management Page
 * Admin interface for managing About Us content
 */
"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { FileUpload } from "@/components/admin/file-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { AdminLayout } from "@/components/admin/layout";

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

  // Fetch about content on component mount
  useEffect(() => {
    fetchAboutContent();
  }, []);

  // Fetch about content from API
  const fetchAboutContent = async () => {
    try {
      const response = await fetch("/api/about");
      if (response.ok) {
        const data = await response.json();
        setAboutData(data.data || { content: "", image: "" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch about content",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save about content
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

      if (response.ok) {
        toast({
          title: "Success",
          description: "About content updated successfully",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save about content",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle content change
  const handleContentChange = (content: string) => {
    setAboutData({ ...aboutData, content });
  };

  // Handle image upload
  const handleImageUpload = (imageUrl: string) => {
    setAboutData({ ...aboutData, image: imageUrl });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Spinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
          <p className="text-gray-600">Manage your school's about us content</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Spinner size="large" className="mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About Content</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={aboutData.content}
                onChange={handleContentChange}
                placeholder="Write about your school..."
                height="500px"
              />
            </CardContent>
          </Card>
        </div>

        {/* Image Upload */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>About Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onUpload={handleImageUpload}
                currentImage={aboutData.image}
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload an image to accompany your about content. This will be
                displayed alongside the text on your website.
              </p>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>• Use headings to structure your content</p>
              <p>• Keep paragraphs concise and readable</p>
              <p>• Include your school's mission and values</p>
              <p>• Highlight what makes your school unique</p>
              <p>• Add contact information if needed</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Section */}
      {aboutData.content && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: aboutData.content }}
              />
              {aboutData.image && (
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={aboutData.image || "/placeholder.svg"}
                    alt="About Us"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </AdminLayout>
  );
}
