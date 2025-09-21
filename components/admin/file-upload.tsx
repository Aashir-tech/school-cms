"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Spinner } from "@/components/ui/spinner" // Assuming you have a spinner component

interface FileUploadProps {
  onUpload: (url: string) => void
  accept?: string
  maxSize?: number
  currentImage?: string | null
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
  const [publicId, setPublicId] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const { toast } = useToast()

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData, // No need for Content-Type header, browser sets it with boundary
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setPreview(data.url)
      onUpload(data.url)
      setPublicId(data.public_id)

      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      uploadFile(file)
    }
  }, []) // uploadFile is not a dependency as it's defined in the component scope

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple: false,
  })

  const removeImage = async () => {
    // Logic to delete from cloud storage if needed
    setPreview(null)
    setPublicId(null)
    onUpload("") // Notify parent that image is removed
  }

  return (
    <div className={className}>
      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/000000/FFFFFF?text=Error'; }}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "bg-secondary/50 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 h-32">
            {uploading ? (
              <>
                <Spinner size="small" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? "Drop the file here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground">Max file size: {Math.round(maxSize / 1024 / 1024)}MB</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
