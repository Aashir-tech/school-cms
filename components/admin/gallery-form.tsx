"use client";

/**
 * Gallery Form Component
 * Form for creating and editing gallery items
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
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
  const [showCategoryDeleteDialog, setShowCategoryDeleteDialog] =
    useState(false);

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
    <div className="fixed inset-0 bg-transparent text-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {item ? "Edit Gallery Item" : "Add New Gallery Item"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Image *</Label>
              <FileUpload
                onUpload={setImageUrl}
                currentImage={imageUrl}
                className="mt-2"
              />
              {!imageUrl && (
                <p className="text-red-500 text-sm mt-1">Image is required</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alt Text */}
              <div>
                <Label htmlFor="alt">Alt Text *</Label>
                <Input
                  id="alt"
                  {...register("alt", { required: "Alt text is required" })}
                  className={errors.alt ? "border-red-500" : ""}
                  placeholder="Describe the image"
                />
                {errors.alt && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.alt.message}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Image title"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Brief description of the image"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        className="flex items-center justify-between px-2 py-1 group hover:bg-gray-100 rounded"
                      >
                        <SelectItem value={cat} className="flex-1">
                          {cat}
                        </SelectItem>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryToDelete(cat);
                            setShowCategoryDeleteDialog(true);
                          }}
                          className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Add New Category */}
              <div className="mt-3">
                <Label htmlFor="newCategory">Add New Category</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="newCategory"
                    placeholder="Enter new category"
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
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Order */}
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
                  className={errors.order ? "border-red-500" : ""}
                />
                {errors.order && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.order.message}
                  </p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 cursor-pointer "
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active (visible on website)</Label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!imageUrl}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
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
              setValue("category", categories[0] || "");
            }
          }
          setCategoryToDelete(null);
          setShowCategoryDeleteDialog(false);
        }}
        variant="destructive"
      />
    </div>
  );
}
