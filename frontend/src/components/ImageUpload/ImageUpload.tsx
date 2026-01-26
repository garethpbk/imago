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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setAddedUrls((prev) => [...prev, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const handleRemoveUrl = (indexToRemove: number) => {
    setAddedUrls(addedUrls.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.uploadContainer}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className={styles.fileInput}
          id="fileUpload"
        />
        <label htmlFor="fileUpload" className={styles.uploadLabel}>
          <div className={styles.uploadContent}>
            <span className={styles.uploadIcon}>📁</span>
            <span className={styles.uploadText}>
              {selectedFiles.length > 0
                ? `${selectedFiles.length} image(s) selected`
                : "Click to upload images"}
            </span>
            <span className={styles.uploadHint}>or drag and drop</span>
          </div>
        </label>
      </div>

      <div className={styles.urlSection}>
        <div className={styles.urlInputContainer}>
          <input
            type="url"
            placeholder="Or paste image URL here"
            className={styles.urlField}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
          />
          <button onClick={handleUrlSubmit} className={styles.urlButton}>
            Add URL
          </button>
        </div>

        {addedUrls.length > 0 && (
          <div className={styles.urlList}>
            {addedUrls.map((url, index) => (
              <div key={index} className={styles.urlItem}>
                <span className={styles.urlText}>{url}</span>
                <button
                  onClick={() => handleRemoveUrl(index)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
