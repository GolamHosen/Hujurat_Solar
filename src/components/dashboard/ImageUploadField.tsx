"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadFieldProps {
  /** The form field name (e.g. "featuredImage", "heroImage", "coverImage") */
  name: string;
  /** Label text shown above the field */
  label?: string;
  /** Default URL value (for edit forms) */
  defaultValue?: string;
  /** Placeholder for the URL input */
  placeholder?: string;
  /** Additional CSS class for the outer container */
  className?: string;
}

type Mode = "upload" | "url";

export default function ImageUploadField({
  name,
  label = "Image",
  defaultValue = "",
  placeholder = "https://example.com/image.jpg or /uploads/image.jpg",
  className = "",
}: ImageUploadFieldProps) {
  const [mode, setMode] = useState<Mode>(defaultValue ? "url" : "upload");
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);

    if (file.size > 8 * 1024 * 1024) {
      setError("File too large. Maximum 8 MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setUrl(data.url);
      setMode("url");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const clearImage = useCallback(() => {
    setUrl("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* Hidden input that carries the URL value for the parent form */}
      <input type="hidden" name={name} value={url} />

      {/* Mode tabs */}
      <div className="mb-2 flex gap-1 rounded-lg bg-slate-100 p-0.5">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
            mode === "upload"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <UploadCloud className="h-3.5 w-3.5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
            mode === "url"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          Paste URL
        </button>
      </div>

      {/* Upload mode */}
      {mode === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all ${
            dragOver
              ? "border-brand bg-brand/5 scale-[1.01]"
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          } ${uploading ? "pointer-events-none opacity-60" : ""} p-6`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-2 text-center">
            {uploading ? (
              <>
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-brand" />
                <p className="text-xs font-semibold text-slate-600">
                  Uploading…
                </p>
              </>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <UploadCloud className="h-5 w-5 text-slate-500" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  Drop an image here or{" "}
                  <span className="text-brand underline">browse</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  JPG, PNG, GIF, WebP, AVIF · Max 8 MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL mode */}
      {mode === "url" && (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LinkIcon className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-10 text-sm focus:border-brand focus:outline-none"
          />
          {url && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}

      {/* Preview */}
      {url && (
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-200">
            {url.startsWith("http") || url.startsWith("/") ? (
              <Image
                src={url}
                alt="Preview"
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-5 w-5 text-slate-400" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-700">
              Image selected
            </p>
            <p className="truncate text-[10px] text-slate-400">{url}</p>
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
