import Image from "next/image";
import { getAllMedia } from "@/lib/queries";
import { uploadMediaAction, deleteMediaAction } from "@/lib/actions/media";
import { Trash2, UploadCloud, AlertTriangle } from "lucide-react";

/** Fixed codes only — the action never puts user-supplied text in the URL. */
const UPLOAD_ERRORS: Record<string, string> = {
  too_large: "That file is too large. The maximum upload size is 8 MB.",
  unsupported_type: "Unsupported file type. Upload a JPG, PNG, GIF, WebP, AVIF, MP4 or WebM file.",
  type_mismatch: "The file contents do not match its extension or content type.",
  upload_failed: "Failed to upload the file to Cloudinary. Please check your credentials.",
};

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [items, { error }] = await Promise.all([getAllMedia(), searchParams]);
  const uploadError = error ? UPLOAD_ERRORS[error] : undefined;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950">Media Library</h1>
          <p className="mt-1 text-sm text-slate-500">Upload project photos and videos to use across the site.</p>
        </div>
      </div>

      {uploadError && (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {uploadError}
        </p>
      )}

      <form action={uploadMediaAction} className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <input type="file" name="file" required accept="image/jpeg,image/png,image/gif,image/webp,image/avif,video/mp4,video/webm" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
        <input type="text" name="alt" maxLength={255} placeholder="Alt text (for SEO)" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
        <input type="text" name="caption" maxLength={255} placeholder="Caption (optional)" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          <UploadCloud className="h-4 w-4" /> Upload
        </button>
      </form>
      <p className="mt-2 text-xs text-slate-400">
        Maximum 8 MB. Images, WebP/AVIF and MP4/WebM video are supported.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="relative h-32 w-full bg-slate-100">
              {item.mimeType?.startsWith("video") ? (
                <video src={item.url} className="h-full w-full object-cover" muted />
              ) : (
                <Image src={item.url} alt={item.alt || item.filename} fill className="object-cover" sizes="25vw" />
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-semibold text-slate-800">{item.filename}</p>
              <p className="truncate text-[10px] text-slate-400">{item.url}</p>
              <form action={deleteMediaAction.bind(null, item.id)} className="mt-2">
                <button type="submit" className="flex items-center gap-1 text-[11px] font-semibold text-red-600">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400">No media uploaded yet.</p>}
      </div>
    </div>
  );
}
