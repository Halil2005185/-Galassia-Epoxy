import { useEffect, useRef, useState } from "react";

export default function ImagePicker({
  files,
  onChange,
  max = 5,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list).filter((file) => file.type.startsWith("image/"));
    onChange([...files, ...incoming].slice(0, max));
  }

  function removeAt(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 border border-dashed px-6 py-10 text-center transition-colors ${
          isDragging ? "border-brass bg-canvas" : "border-border bg-canvas hover:border-ink"
        }`}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-graphite">
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          <path d="M7 9l5-5 5 5" />
          <path d="M12 4v12" />
        </svg>
        <span className="label-caps text-ink">اختر صورًا من جهازك</span>
        <span className="text-xs text-graphite">
          أو اسحبها وأفلتها هنا &bull; حتى {max} صور
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {files.map((file, index) => (
            <ImageThumb key={`${file.name}-${index}`} file={file} onRemove={() => removeAt(index)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageThumb({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="relative aspect-square border border-border bg-surface">
      {url && <img src={url} alt={file.name} className="h-full w-full object-cover" />}
      <button
        type="button"
        onClick={onRemove}
        aria-label="حذف الصورة"
        className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center bg-ink text-surface"
      >
        &times;
      </button>
    </div>
  );
}
