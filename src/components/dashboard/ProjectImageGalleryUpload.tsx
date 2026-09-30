"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Star,
  ArrowUp,
  ArrowDown,
  Plus,
  Link as LinkIcon,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";

export interface GalleryItem {
  id?: number;
  url: string;
  alt: string;
  caption?: string | null;
  order: number;
  isFeatured?: boolean;
}

interface ProjectImageGalleryUploadProps {
  initialImages?: {
    id?: number;
    url: string;
    alt?: string | null;
    caption?: string | null;
    order?: number;
  }[];
  initialFeaturedImage?: string | null;
  projectTitle?: string;
  className?: string;
}

export default function ProjectImageGalleryUpload({
  initialImages = [],
  initialFeaturedImage = "",
  projectTitle = "",
  className = "",
}: ProjectImageGalleryUploadProps) {
  // Normalize initial items
  const [images, setImages] = useState<GalleryItem[]>(() => {
    const list: GalleryItem[] = [];
    const seen = new Set<string>();

    // If initialFeaturedImage is provided and not already in initialImages, we can prepend or align
    if (initialFeaturedImage && initialFeaturedImage.trim()) {
      const featUrl = initialFeaturedImage.trim();
      seen.add(featUrl);
      list.push({
        url: featUrl,
        alt: projectTitle || "Featured Installation Photo",
        order: 0,
        isFeatured: true,
      });
    }

    initialImages.forEach((img, idx) => {
      const url = img.url?.trim();
      if (!url) return;
      if (seen.has(url)) {
        // Mark as featured if it matched initialFeaturedImage
        const existing = list.find((item) => item.url === url);
        if (existing && !existing.isFeatured) {
          existing.isFeatured = true;
        }
        return;
      }
      seen.add(url);
      list.push({
        id: img.id,
        url,
        alt: img.alt || projectTitle || `Installation photo ${idx + 1}`,
        caption: img.caption || null,
        order: list.length,
        isFeatured: list.length === 0, // default first to featured if not set
      });
    });

    // Ensure at least one image is marked as featured if list not empty
    if (list.length > 0 && !list.some((item) => item.isFeatured)) {
      list[0].isFeatured = true;
    }

    return list;
  });

  const [uploadingCount, setUploadingCount] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlModal, setShowUrlModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Identify featured image
  const featuredItem = images.find((item) => item.isFeatured) || images[0];
  const featuredUrl = featuredItem?.url || "";

  // Upload handler for 1 or more files
  const handleUploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploadError(null);
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) return false;
        if (file.size > 8 * 1024 * 1024) return false;
        return true;
      });

      if (validFiles.length === 0) {
        setUploadError(
          "Please select valid image files (JPG, PNG, WebP, AVIF, max 8 MB each)."
        );
        return;
      }

      setUploadingCount(validFiles.length);

      try {
        const formData = new FormData();
        validFiles.forEach((file) => {
          formData.append("files", file);
        });

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed. Please try again.");
        }

        const newUrls: string[] = Array.isArray(data.urls)
          ? data.urls
          : data.url
          ? [data.url]
          : [];

        if (newUrls.length > 0) {
          setImages((prev) => {
            const updated = [...prev];
            newUrls.forEach((url, i) => {
              // Avoid duplicates
              if (!updated.some((item) => item.url === url)) {
                updated.push({
                  url,
                  alt: projectTitle
                    ? `${projectTitle} photo ${updated.length + 1}`
                    : `Project installation photo ${updated.length + 1}`,
                  order: updated.length,
                  isFeatured: updated.length === 0 && i === 0,
                });
              }
            });
            // Ensure first is featured if none was
            if (updated.length > 0 && !updated.some((it) => it.isFeatured)) {
              updated[0].isFeatured = true;
            }
            return updated;
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error uploading files.";
        setUploadError(msg);
      } finally {
        setUploadingCount(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [projectTitle]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUploadFiles(e.dataTransfer.files);
      }
    },
    [handleUploadFiles]
  );

  const handleAddUrl = useCallback(() => {
    if (!urlInput.trim()) return;
    const urls = urlInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http") || u.startsWith("/"));

    if (urls.length === 0) {
      setUploadError("Please enter a valid image URL starting with http:// or https:// or /");
      return;
    }

    setImages((prev) => {
      const updated = [...prev];
      urls.forEach((url) => {
        if (!updated.some((item) => item.url === url)) {
          updated.push({
            url,
            alt: projectTitle
              ? `${projectTitle} photo ${updated.length + 1}`
              : `Project installation photo ${updated.length + 1}`,
            order: updated.length,
            isFeatured: updated.length === 0,
          });
        }
      });
      if (updated.length > 0 && !updated.some((it) => it.isFeatured)) {
        updated[0].isFeatured = true;
      }
      return updated;
    });

    setUrlInput("");
    setShowUrlModal(false);
    setUploadError(null);
  }, [urlInput, projectTitle]);

  const handleSetFeatured = useCallback((index: number) => {
    setImages((prev) =>
      prev.map((item, i) => ({
        ...item,
        isFeatured: i === index,
      }))
    );
  }, []);

  const handleMove = useCallback((index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((item, idx) => ({ ...item, order: idx }));
    });
  }, []);

  const handleRemove = useCallback((index: number) => {
    setImages((prev) => {
      const wasFeatured = prev[index]?.isFeatured;
      const filtered = prev.filter((_, i) => i !== index);
      const reordered = filtered.map((item, idx) => ({
        ...item,
        order: idx,
      }));
      // If we removed the featured item, make the first one featured
      if (wasFeatured && reordered.length > 0) {
        reordered[0].isFeatured = true;
      }
      return reordered;
    });
  }, []);

  const handleAltChange = useCallback((index: number, alt: string) => {
    setImages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, alt } : item))
    );
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden inputs to feed FormData into Server Actions */}
      <input
        type="hidden"
        name="galleryImages"
        value={JSON.stringify(images)}
      />
      <input type="hidden" name="featuredImage" value={featuredUrl} />
      <input
        type="hidden"
        name="imageUrls"
        value={images.map((img) => img.url).join("\n")}
      />

      {/* Header Info */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-brand" />
            Project Image Gallery & Carousel Photos
          </label>
          <p className="text-xs text-slate-500">
            Upload 1 or more images. All photos will automatically appear in the
            interactive frontend showcase carousel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {images.length} {images.length === 1 ? "image" : "images"}
          </span>
          <button
            type="button"
            onClick={() => setShowUrlModal((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <LinkIcon className="h-3 w-3 text-slate-500" />
            Paste URL
          </button>
        </div>
      </div>

      {/* Optional URL Paste Box */}
      {showUrlModal && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              Add Image by Web URL or Cloudinary
            </span>
            <button
              type="button"
              onClick={() => setShowUrlModal(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            rows={2}
            placeholder="https://example.com/solar-1.jpg&#10;https://example.com/solar-2.jpg"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowUrlModal(false)}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddUrl}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-dark transition"
            >
              <Plus className="h-3 w-3" /> Add URLs
            </button>
          </div>
        </div>
      )}

      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
          isDragOver
            ? "border-brand bg-brand/5 scale-[1.008]"
            : "border-slate-300 hover:border-brand/60 hover:bg-slate-50/70"
        } ${uploadingCount > 0 ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUploadFiles(e.target.files);
            }
          }}
          className="hidden"
        />

        {uploadingCount > 0 ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-xs font-semibold text-slate-800">
              Uploading {uploadingCount} {uploadingCount === 1 ? "image" : "images"}…
            </p>
            <p className="text-[10px] text-slate-400">Optimizing and storing assets</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-brand ring-1 ring-amber-200/60 group-hover:scale-105 transition">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Click or drag & drop 1 or more images here
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload all installation photos at once · High-res JPG, PNG, WebP up to 8 MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {uploadError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Images List / Grid */}
      {images.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <SlidersHorizontal className="h-3 w-3" />
              Carousel Slides Order ({images.length})
            </span>
            <span className="text-[11px]">
              ⭐ Star marks the Cover / Featured photo
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((img, index) => {
              const isFirst = index === 0;
              const isLast = index === images.length - 1;

              return (
                <div
                  key={`${img.url}-${index}`}
                  className={`group relative flex flex-col rounded-2xl border p-3 transition-all ${
                    img.isFeatured
                      ? "border-amber-400 bg-amber-50/30 ring-1 ring-amber-300/80 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                      <Image
                        src={img.url}
                        alt={img.alt || `Photo ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
                        #{index + 1}
                      </span>
                      {img.isFeatured && (
                        <span className="absolute top-1 left-1 rounded-full bg-amber-500 p-1 text-white shadow">
                          <Star className="h-2.5 w-2.5 fill-white" />
                        </span>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                              img.isFeatured
                                ? "text-amber-700 font-extrabold"
                                : "text-slate-500"
                            }`}
                          >
                            {img.isFeatured ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-amber-600" />
                                Cover Photo
                              </>
                            ) : (
                              `Slide #${index + 1}`
                            )}
                          </span>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1">
                            {!img.isFeatured && (
                              <button
                                type="button"
                                onClick={() => handleSetFeatured(index)}
                                title="Set as featured cover photo"
                                className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 hover:bg-amber-100 transition"
                              >
                                <Star className="h-2.5 w-2.5 text-amber-600" />
                                Set Cover
                              </button>
                            )}

                            {/* Order Controls */}
                            <button
                              type="button"
                              disabled={isFirst}
                              onClick={() => handleMove(index, "up")}
                              title="Move up in carousel"
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={isLast}
                              onClick={() => handleMove(index, "down")}
                              title="Move down in carousel"
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemove(index)}
                              title="Remove image"
                              className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* URL snippet */}
                        <p className="truncate text-[10px] text-slate-400 mt-0.5" title={img.url}>
                          {img.url}
                        </p>
                      </div>

                      {/* Alt text field for SEO */}
                      <div className="mt-2">
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => handleAltChange(index, e.target.value)}
                          placeholder="Image Alt text (e.g. Parramatta 10kW roof solar array)"
                          className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
          <p className="text-xs text-slate-500">
            No images uploaded yet. Upload 1 or more photos above to build the project carousel.
          </p>
        </div>
      )}
    </div>
  );
}
