"use client";

import { useState } from "react";

type ImageUploaderProps = {
  name: string;
  label: string;
  currentUrl?: string | null;
};

export function ImageUploader({ name, label, currentUrl }: ImageUploaderProps) {
  const [preview, setPreview] = useState(currentUrl || "");

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 rounded-full object-cover border border-[var(--line)]"
          />
        ) : (
          <div className="h-20 w-20 rounded-full border border-dashed border-[var(--line)] bg-white/50" />
        )}
        <input
          type="file"
          accept="image/*"
          className="text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setPreview(String(reader.result || ""));
            reader.readAsDataURL(file);
          }}
        />
      </div>
      <input type="hidden" name={name} value={preview} />
    </div>
  );
}
