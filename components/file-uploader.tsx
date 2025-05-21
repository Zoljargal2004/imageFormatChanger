"use client";

import type React from "react";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import WrapperContext from "./wrapper";

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const { file, setFile } = useContext(WrapperContext);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      toast("Please upload an image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    // Check file size (limit to 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 10MB",
      });
      return;
    }

    setFile(selectedFile);

    // Create a URL for the file and store it in localStorage for preview
    const fileUrl = URL.createObjectURL(selectedFile);

    router.refresh();
  };



  const removeFile = () => {
    setFile(null);
    router.refresh();
  };

  return (
    <Card
      className={`border-2 ${isDragging ? "border-primary" : "border-dashed"}`}
    >
      <CardContent className="p-6">
        {!file ? (
          <div
            className="flex flex-col items-center justify-center gap-4 py-8"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PNG, JPG, WEBP (Max 10MB)
              </p>
            </div>
            <Button variant="outline" className="mt-2">
              <label className="cursor-pointer">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="h-10 w-10 object-cover rounded"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB •{" "}
                  {file.type.split("/")[1].toUpperCase()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
