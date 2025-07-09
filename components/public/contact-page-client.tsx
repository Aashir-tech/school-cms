"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useInitialPublicData } from "@/hooks/useInitialPublicData";
import { Spinner } from "@/components/ui/spinner"


interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function ContactPageClient() {
  const [submitting, setSubmitting] = useState(false);
  const { isLoading, publicData } = useInitialPublicData();

  const { settings } = publicData;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        });
        reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="large" />
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us. We'd love to hear from you and answer any
            questions you may have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Address */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Visit Us
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {settings.address}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Call Us
                      </h3>
                      <p className="text-gray-600">
                        <a
                          href={`tel:${settings.contactPhone}`}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {settings.contactPhone}
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Email Us
                      </h3>
                      <p className="text-gray-600">
                        <a
                          href={`mailto:${settings.contactEmail}`}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {settings.contactEmail}
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Office Hours
                      </h3>
                      <div className="text-gray-600 whitespace-pre-line">
                        {typeof settings.businessHours === "string"
                          ? settings.businessHours
                          : Object.entries(settings.businessHours).map(
                              ([day, time]) => (
                                <div key={day} className="capitalize">
                                  {/* @ts-ignore */}
                                  {day}: {time}
                                </div>
                              )
                            )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        {...register("name", { required: "Name is required" })}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        {...register("subject", {
                          required: "Subject is required",
                        })}
                        className={errors.subject ? "border-red-500" : ""}
                        placeholder="What is this regarding?"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      {...register("message", {
                        required: "Message is required",
                      })}
                      className={errors.message ? "border-red-500" : ""}
                      rows={6}
                      placeholder="Please provide details about your inquiry..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Find Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>Interactive map would be embedded here</p>
                  <p className="text-sm">{settings.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What are your admission requirements?
                </h3>
                <p className="text-gray-600">
                  We welcome students of all backgrounds. Please contact our
                  admissions office for specific requirements and to schedule a
                  tour.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you offer financial aid?
                </h3>
                <p className="text-gray-600">
                  Yes, we offer various financial aid options including
                  scholarships and payment plans. Contact our financial aid
                  office for more information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What extracurricular activities do you offer?
                </h3>
                <p className="text-gray-600">
                  We offer a wide range of activities including sports, arts,
                  music, drama, debate, and various clubs. Visit our activities
                  page for a complete list.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How can I schedule a school tour?
                </h3>
                <p className="text-gray-600">
                  You can schedule a tour by calling our main office or filling
                  out the contact form above. We offer tours Monday through
                  Friday.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
