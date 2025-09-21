"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "./file-upload";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { addCategory, removeCategory } from "@/redux/slices/gallerySlice";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface GalleryItem {
  _id?: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface GalleryFormProps {
  item?: GalleryItem | null;
  onSave: (data: Partial<GalleryItem>) => void;
  onCancel: () => void;
}

export function GalleryForm({ item, onSave, onCancel }: GalleryFormProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(
    (state: RootState) => state.gallery.categories
  );

  const [newCategory, setNewCategory] = useState("");
  const [imageUrl, setImageUrl] = useState(item?.url || "");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [showCategoryDeleteDialog, setShowCategoryDeleteDialog] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GalleryItem>({
    defaultValues: {
      alt: item?.alt || "",
      title: item?.title || "",
      description: item?.description || "",
      category: item?.category || "Events",
      order: item?.order || 1,
      isActive: item?.isActive ?? true,
    },
  });

  const isActive = watch("isActive");
  const category = watch("category");

  useEffect(() => {
    setValue("url", imageUrl);
  }, [imageUrl, setValue]);

  const onSubmit = (data: GalleryItem) => {
    onSave({
      ...data,
      url: imageUrl,
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 bg-card border-border rounded-2xl shadow-2xl animate-scale-in custom-scrollbar">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border">
          <CardTitle className="text-2xl font-bold text-foreground">
            {item ? "Edit Gallery Item" : "Add New Gallery Item"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Image *</Label>
              <FileUpload onUpload={setImageUrl} currentImage={imageUrl} className="mt-1" />
              {!imageUrl && <p className="text-sm font-medium text-destructive mt-2">Image is required</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="alt">Alt Text *</Label>
                <Input
                  id="alt"
                  {...register("alt", { required: "Alt text is required" })}
                  className={`mt-1 ${errors.alt ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Describe the image"
                />
                {errors.alt && <p className="text-sm font-medium text-destructive mt-1">{errors.alt.message}</p>}
              </div>
              <div>
                <Label htmlFor="title">Title (Optional)</Label>
                <Input id="title" {...register("title")} placeholder="Image title" className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" {...register("description")} placeholder="Brief description of the image" rows={3} className="mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <div key={cat} className="flex items-center justify-between pr-2 group">
                        <SelectItem value={cat} className="flex-1">{cat}</SelectItem>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryToDelete(cat);
                            setShowCategoryDeleteDialog(true);
                          }}
                          className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    id="newCategory"
                    placeholder="Add new category..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newCategory.trim()) {
                        dispatch(addCategory(newCategory));
                        setValue("category", newCategory.trim());
                        setNewCategory("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="order">Display Order *</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  {...register("order", {
                    required: "Order is required",
                    min: { value: 1, message: "Order must be at least 1" },
                  })}
                  className={`mt-1 ${errors.order ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.order && <p className="text-sm font-medium text-destructive mt-1">{errors.order.message}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-border">
              <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
              <Label htmlFor="isActive">Active (visible on website)</Label>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
              <Button type="submit" disabled={!imageUrl}>
                <Save className="h-4 w-4 mr-2" />
                {item ? "Update Item" : "Create Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showCategoryDeleteDialog}
        onOpenChange={(open) => {
          setShowCategoryDeleteDialog(open);
          if (!open) setCategoryToDelete(null);
        }}
        title="Delete Category"
        description={`Are you sure you want to delete the category "${categoryToDelete}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={() => {
          if (categoryToDelete) {
            dispatch(removeCategory(categoryToDelete));
            if (category === categoryToDelete) {
              setValue("category", categories.filter(c => c !== categoryToDelete)[0] || "");
            }
          }
          setCategoryToDelete(null);
          setShowCategoryDeleteDialog(false);
        }}
        variant="destructive"
      />
       <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
