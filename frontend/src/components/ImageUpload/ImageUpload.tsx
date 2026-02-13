import { useState } from "react";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  addedUrls: string[];
  setAddedUrls: (urls: string[] | ((prev: string[]) => string[])) => void;
}

export default function ImageUpload({
  selectedFiles,
  setSelectedFiles,
  addedUrls,
  setAddedUrls,
}: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      // Clear URLs when files are selected
      setAddedUrls([]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      setSelectedFiles(files);
      // Clear URLs when files are dropped
      setAddedUrls([]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      // Split by comma or newline and trim each URL
      const urls = urlInput
        .split(/[,\n]/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (urls.length > 0) {
        setAddedUrls((prev) => [...prev, ...urls]);
        setUrlInput("");
        // Clear files when URLs are added
        setSelectedFiles([]);
      }
    }
  };

  const hasUrls = addedUrls.length > 0;
  const hasFiles = selectedFiles.length > 0;

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.uploadContainer} ${
          isDragging ? styles.dragging : ""
        } ${hasUrls ? styles.disabled : ""}`}
        onDragOver={hasUrls ? undefined : handleDragOver}
        onDragLeave={hasUrls ? undefined : handleDragLeave}
        onDrop={hasUrls ? undefined : handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className={styles.fileInput}
          id="fileUpload"
          disabled={hasUrls}
        />
        <label
          htmlFor="fileUpload"
          className={`${styles.uploadLabel} ${hasUrls ? styles.disabled : ""}`}
        >
          <div className={styles.uploadContent}>
            <span className={styles.uploadIcon}>📁</span>
            <span className={styles.uploadText}>
              {selectedFiles.length > 0
                ? `${selectedFiles.length} image(s) selected`
                : hasUrls
                ? "File upload disabled (using URLs)"
                : "Click to upload images"}
            </span>
            {!hasUrls && (
              <span className={styles.uploadHint}>or drag and drop</span>
            )}
          </div>
        </label>
      </div>

      <div className={styles.urlSection}>
        <div className={styles.urlInputContainer}>
          <textarea
            placeholder={
              hasFiles
                ? "URL input disabled (using files)"
                : "Or paste image URLs (one per line or comma-separated)"
            }
            className={styles.urlField}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleUrlSubmit();
              }
            }}
            disabled={hasFiles}
            rows={3}
          />
          <button
            onClick={handleUrlSubmit}
            className={styles.urlButton}
            disabled={hasFiles}
          >
            Add URL
          </button>
        </div>
      </div>
    </div>
  );
}
