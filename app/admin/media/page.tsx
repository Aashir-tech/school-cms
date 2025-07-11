"use client";

/**
 * Media Management Page
 * Admin interface for managing Cloudinary media files
 */
import { useState, useEffect } from "react";
import {
  Trash2,
  Search,
  Filter,
  Download,
  Copy,
  Eye,
  HardDrive,
  Image as ImageIcon,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Spinner } from "@/components/ui/spinner";
import { AdminLayout } from "@/components/admin/layout";
import { createAuthenticatedFetch } from "@/lib/api-helpers";
import Image from "next/image";

interface MediaFile {
  public_id: string;
  url: string;
  format: string;
  size: number;
  width: number;
  height: number;
  created_at: string;
  folder: string;
  filename: string;
}

interface MediaPreview {
  file: MediaFile;
  open: boolean;
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [authFetch, setAuthFetch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [previewDialog, setPreviewDialog] = useState<MediaPreview>({
    file: null as any,
    open: false,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    fileId: string | null;
    isMultiple: boolean;
  }>({
    open: false,
    fileId: null,
    isMultiple: false,
  });
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
    nextCursor: string | null
    previousCursors: (string | null)[]
  }>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
    nextCursor: null,
    previousCursors: [],
  })
  const { toast } = useToast();

  useEffect(() => {
    setAuthFetch(() => createAuthenticatedFetch());
    fetchMediaFiles();
  }, [pagination.page, selectedFolder]);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(selectedFolder && { folder: selectedFolder }),
      });

      if (pagination.page > 1 && pagination.nextCursor) {
        params.set("cursor", pagination.nextCursor);
      }

      const response = await fetch(`/api/media?${params}`);
    //   console.log("Response ", response);
      if (response.ok) {
        const data = await response.json();
        // console.log("Data", data);
        setMediaFiles(data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          hasNext: data.pagination.hasNext,
          hasPrev: data.pagination.hasPrev,
          nextCursor: data.pagination.nextCursor,
          pages : data.pagination.pages
        }));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch media files",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFiles = async () => {
    try {
      const body = deleteDialog.isMultiple
        ? { public_ids: selectedFiles }
        : { public_id: deleteDialog.fileId };

      const response = await authFetch("/api/media", {
        method: "DELETE",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Media file${
            deleteDialog.isMultiple ? "s" : ""
          } deleted successfully`,
        });
        fetchMediaFiles();
        setSelectedFiles([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete media file(s)",
      });
    } finally {
      setDeleteDialog({ open: false, fileId: null, isMultiple: false });
    }
  };

  const handleSelectFile = (publicId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(publicId)
        ? prev.filter((id) => id !== publicId)
        : [...prev, publicId]
    );
  };

  const handleSelectAll = () => {
    setSelectedFiles(
      selectedFiles.length === mediaFiles.length
        ? []
        : mediaFiles.map((file) => file.public_id)
    );
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Success",
      description: "URL copied to clipboard",
    });
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredFiles = mediaFiles.filter(
    (file) =>
      searchQuery === "" ||
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.public_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueFolders = [
    ...new Set(mediaFiles.map((file) => file.folder).filter(Boolean)),
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
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
            <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600">Manage your Cloudinary media files</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm bg-blue-500">
              {selectedFiles.length} selected
            </Badge>
            <Badge variant="outline" className="text-sm bg-green-700">
              {pagination.total} total files
            </Badge>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-1 space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-300"
              />
            </div>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder="All folders"
                  className="bg-blue-500"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="bg-blue-500">
                  All folders
                </SelectItem>
                {uniqueFolders.map((folder) => (
                  <SelectItem key={folder} value={folder}>
                    {folder}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="bg-blue-500"
              onClick={handleSelectAll}
              disabled={filteredFiles.length === 0}
            >
              {selectedFiles.length === filteredFiles.length
                ? "Deselect All"
                : "Select All"}
            </Button>
            {selectedFiles.length > 0 && (
              <Button
                variant="destructive"
                className="bg-red-500"
                onClick={() =>
                  setDeleteDialog({
                    open: true,
                    fileId: null,
                    isMultiple: true,
                  })
                }
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedFiles.length})
              </Button>
            )}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.public_id}
              className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                selectedFiles.includes(file.public_id)
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => handleSelectFile(file.public_id)}
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={file.url}
                  alt={file.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    size="sm"
                    className="bg-blue-500"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewDialog({ file, open: true });
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteDialog({
                        open: true,
                        fileId: file.public_id,
                        isMultiple: false,
                      });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.public_id)}
                    onChange={() => handleSelectFile(file.public_id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <h3
                    className="font-medium text-sm truncate"
                    title={file.filename}
                  >
                    {file.filename}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{file.format.toUpperCase()}</span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>
                      {file.width} × {file.height}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(file.url);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file.url, file.filename);
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ImageIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery
                  ? "No matching files found"
                  : "No media files found"}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Upload images to see them here"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              className="bg-blue-500"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                  nextCursor: prev.previousCursors[prev.page - 2] || null, // Go back to previous
                  previousCursors: prev.previousCursors.slice(0, -1),
                }))
              }
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              className="bg-blue-500"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                  previousCursors: [...prev.previousCursors, prev.nextCursor],
                }))
              }
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        )}

        {/* Preview Dialog */}
        {previewDialog.open && previewDialog.file && (
          <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {previewDialog.file.filename}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setPreviewDialog({ file: null as any, open: false })
                  }
                >
                  ×
                </Button>
              </div>
              <div className="p-4 overflow-auto">
                <div className="relative mb-4">
                  <Image
                    src={previewDialog.file.url}
                    alt={previewDialog.file.filename}
                    width={previewDialog.file.width}
                    height={previewDialog.file.height}
                    className="max-w-full h-auto"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Format:</strong>{" "}
                    {previewDialog.file.format.toUpperCase()}
                  </div>
                  <div>
                    <strong>Size:</strong>{" "}
                    {formatFileSize(previewDialog.file.size)}
                  </div>
                  <div>
                    <strong>Dimensions:</strong> {previewDialog.file.width} ×{" "}
                    {previewDialog.file.height}
                  </div>
                  <div>
                    <strong>Created:</strong>{" "}
                    {formatDate(previewDialog.file.created_at)}
                  </div>
                  <div className="col-span-2">
                    <strong>URL:</strong>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs flex-1 truncate">
                        {previewDialog.file.url}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyUrl(previewDialog.file.url)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            setDeleteDialog({ open, fileId: null, isMultiple: false })
          }
          title={`Delete Media File${deleteDialog.isMultiple ? "s" : ""}`}
          description={`Are you sure you want to delete ${
            deleteDialog.isMultiple
              ? `${selectedFiles.length} selected file${
                  selectedFiles.length > 1 ? "s" : ""
                }`
              : "this media file"
          }? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDeleteFiles}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  );
}
