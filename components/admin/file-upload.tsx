/**
 * File Upload Component
 * Drag and drop file upload with preview
 */
"use client"

import { useCallback } from "react"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface FileUploadProps {
  onUpload: (url: string) => void
  accept?: string
  maxSize?: number
  currentImage?: string
  className?: string
}

export function FileUpload({
  onUpload,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  currentImage,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const { toast } = useToast()

  // Handle file upload
  const uploadFile = async (file: File) => {
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setPreview(data.url)
      onUpload(data.url)

      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
      })
    } finally {
      setUploading(false)
    }
  }

  // Dropzone configuration
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        uploadFile(file)
      }
    },
    [], // Removed uploadFile from dependencies
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple: false,
  })

  // Remove current image
  const removeImage = () => {
    setPreview(null)
    onUpload("")
  }

  return (
    <div className={className}>
      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 bg-red-600"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-500" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isDragActive ? "Drop the file here" : "Drag & drop a file here, or click to select"}
                </p>
                <p className="text-xs text-gray-500">Max file size: {Math.round(maxSize / 1024 / 1024)}MB</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
