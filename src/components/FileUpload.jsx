import { useId, useState } from "react";

export default function FileUpload({
  accept = "image/png, image/jpeg",
  className = "",
  error,
  onUpload,
  setPreviews,
  previews,
  disabled,
  ...props
}) {
  const id = useId();
  const [uploading, setUploading] = useState(false);

  // In FileUpload component - handle the array response
  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !onUpload || !setPreviews) return;
    setUploading(true);
    try {
      for (const file of files) {
        await onUpload(file);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const isDisabled = uploading || disabled;

  return (
    <div className="space-y-2">
      <div
        className={`h-[100px] w-full cursor-pointer overflow-hidden rounded-[4px] border border-dashed border-[#B2B9C766] bg-[#F7F9FD] text-center transition hover:bg-[#EFF2FA] ${className} ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <input
          type="file"
          accept={accept}
          multiple
          className="hidden"
          id={id}
          onChange={handleChange}
          disabled={isDisabled}
          {...props}
        />
        <label
          htmlFor={id}
          className={`flex h-full cursor-pointer flex-col items-center justify-center gap-2 ${isDisabled ? "cursor-not-allowed" : ""}`}
        >
          <div className="flex flex-col items-center gap-1">
            {previews.length < 3 && (
              <>
                {uploading ? (
                  <span className="font-medium text-[#2F0FD1]">
                    Uploading...
                  </span>
                ) : (
                  <img src="/pic_2_fill.svg" alt="" />
                )}
              </>
            )}

            {previews.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {previews.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="h-10 w-20 max-w-full min-w-[80px] rounded object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </label>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
