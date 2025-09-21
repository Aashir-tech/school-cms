"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Search,
  Copy,
  Image as ImageIcon,
  FileText,
  Film,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

type MediaCategory = 'images' | 'documents' | 'gifs';

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [authFetch, setAuthFetch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<MediaCategory>('images');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
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
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor: string | null;
    previousCursors: (string | null)[];
  }>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
    nextCursor: null,
    previousCursors: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    setAuthFetch(() => createAuthenticatedFetch());
    fetchMediaFiles();
  }, [pagination.page]);

  const fetchMediaFiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (pagination.page > 1 && pagination.nextCursor) {
        params.set("cursor", pagination.nextCursor);
      }

      const response = await fetch(`/api/media?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMediaFiles(data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          hasNext: data.pagination.hasNext,
          hasPrev: data.pagination.hasPrev,
          nextCursor: data.pagination.nextCursor,
          pages: data.pagination.pages,
        }));
      } else {
        throw new Error("Failed to fetch media files");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch media files",
        variant: "destructive",
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

      if (!response.ok) throw new Error("Failed to delete media file(s)");

      toast({
        title: "Success",
        description: `Media file${deleteDialog.isMultiple ? "s" : ""} deleted successfully`,
      });
      fetchMediaFiles();
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete media file(s)",
        variant: "destructive",
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

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    toast({
      title: "Success",
      description: "URL copied to clipboard",
    });
  };

  const categorizeFile = (file: MediaFile): MediaCategory => {
    const format = file.format.toLowerCase();
    if (format === 'gif') return 'gifs';
    if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'bmp', 'tiff'].includes(format)) return 'images';
    return 'documents';
  };

  const getFilteredFiles = () => {
    return mediaFiles.filter(file => {
      const matchesSearch = searchQuery === "" ||
        file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.public_id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categorizeFile(file) === activeCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const getCategoryCount = (category: MediaCategory) => {
    return mediaFiles.filter(file => categorizeFile(file) === category).length;
  };

  const getCategoryIcon = (category: MediaCategory) => {
    switch (category) {
      case 'images': return <ImageIcon className="h-5 w-5" />;
      case 'documents': return <FileText className="h-5 w-5" />;
      case 'gifs': return <Film className="h-5 w-5" />;
    }
  };

  const filteredFiles = getFilteredFiles();

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
      <div className="space-y-8 bg-background min-h-screen p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Media Library
          </h1>
          <p className="text-muted-foreground text-lg">Organize and manage your digital assets</p>
        </div>

        <div className="flex justify-center">
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-border">
            <div className="flex space-x-2">
              {(['images', 'documents', 'gifs'] as MediaCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSelectedFiles([]);
                  }}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground shadow-lg transform scale-105'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {getCategoryIcon(category)}
                  <span className="capitalize font-semibold">{category}</span>
                  <Badge variant={activeCategory === category ? 'default' : 'secondary'}>
                    {getCategoryCount(category)}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-border">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder={`Search ${activeCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="px-4 py-2 text-base">
              {selectedFiles.length} selected
            </Badge>
            
            {selectedFiles.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setDeleteDialog({ open: true, fileId: null, isMultiple: true })}
                className="h-12 px-6"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedFiles.length})
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredFiles.map((file) => (
            <Card
              key={file.public_id}
              onClick={() => handleSelectFile(file.public_id)}
              className={`group relative overflow-hidden bg-card border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                selectedFiles.includes(file.public_id) ? "ring-2 ring-primary shadow-primary/20" : "border-border"
              }`}
            >
              <div className={`absolute top-3 left-3 z-20 transition-all duration-300 ${selectedFiles.includes(file.public_id) || 'group-hover:opacity-100 opacity-0'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    selectedFiles.includes(file.public_id)
                      ? 'bg-primary text-primary-foreground scale-110'
                      : 'bg-background/80 border-2 border-border'
                  }`}
                >
                  {selectedFiles.includes(file.public_id) && <Check className="h-4 w-4" />}
                </div>
              </div>

              <div className="relative h-40 bg-muted overflow-hidden rounded-t-2xl">
                {activeCategory === 'documents' ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <span className="text-xs text-muted-foreground font-medium">{file.format.toUpperCase()}</span>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={file.url}
                    alt={file.filename}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                  />
                )}
                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <Button size="icon" variant="secondary" onClick={(e) => handleCopyUrl(file.url, e)} className="h-8 w-8 rounded-full">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={(e) => { e.stopPropagation(); setDeleteDialog({ open: true, fileId: file.public_id, isMultiple: false }); }} className="h-8 w-8 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-3">
                <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors" title={file.filename}>
                  {file.filename}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFiles.length === 0 && !loading && (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-12">
                <div className="text-muted-foreground mb-6 text-6xl">
                  {activeCategory === 'images' && '🖼️'}
                  {activeCategory === 'documents' && '�'}
                  {activeCategory === 'gifs' && '🎬'}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {searchQuery ? `No matching ${activeCategory} found` : `No ${activeCategory} found`}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search criteria." : `Upload ${activeCategory} to see them here.`}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center">
            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-border">
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1, nextCursor: prev.previousCursors[prev.page - 2] || null, previousCursors: prev.previousCursors.slice(0, -1) }))} disabled={!pagination.hasPrev}>
                  Previous
                </Button>
                <span className="text-sm font-medium text-muted-foreground px-4">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button variant="outline" onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1, previousCursors: [...prev.previousCursors, prev.nextCursor] }))} disabled={!pagination.hasNext}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, fileId: null, isMultiple: false })}
          title={`Delete Media File${deleteDialog.isMultiple ? "s" : ""}`}
          description={`Are you sure you want to delete ${deleteDialog.isMultiple ? `${selectedFiles.length} selected file${selectedFiles.length > 1 ? "s" : ""}` : "this media file"}? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDeleteFiles}
          variant="destructive"
        />
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