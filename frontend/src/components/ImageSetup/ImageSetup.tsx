import { useState, useEffect } from "react";
import ImageUpload from "../ImageUpload/ImageUpload";
import ResizeSettings from "../ResizeSettings/ResizeSettings";
import styles from "./ImageSetup.module.css";
import { ResizeImages, SaveImages } from "../../../wailsjs/go/main/App";

async function convertToBase64({ files }: { files: File[] }) {
  const filePromises = files.map((file) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (!reader?.result) {
          return reject(new Error("Failed to read file"));
        }

        const base64String = String(reader.result).split(",")[1];

        resolve(base64String);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });

  const base64Images = await Promise.all(filePromises);

  return base64Images;
}

async function convertUrlsToBase64({ urls }: { urls: string[] }) {
  const urlPromises = urls.map(async (url) => {
    // Fetch the image from URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image from ${url}: ${response.statusText}`
      );
    }

    // Convert to blob
    const blob = await response.blob();

    // Convert blob to base64
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (!reader?.result) {
          return reject(new Error("Failed to read image data"));
        }

        const base64String = String(reader.result).split(",")[1];
        resolve(base64String);
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  });

  const base64Images = await Promise.all(urlPromises);

  return base64Images;
}

interface PreviewImage {
  url: string;
  name: string;
  width?: number;
  height?: number;
}

export default function ImageSetup() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [addedUrls, setAddedUrls] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [autoScale, setAutoScale] = useState(true);

  // Load images and their dimensions when files or URLs change
  useEffect(() => {
    // Create preview objects from files
    const filePreviews: PreviewImage[] = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    // Create preview objects from URLs
    const urlPreviews: PreviewImage[] = addedUrls.map((url) => {
      // Extract filename from URL or use URL as name
      const urlObj = new URL(url);
      const filename = urlObj.pathname.split("/").pop() || url;
      return {
        url,
        name: filename,
      };
    });

    const allPreviews = [...filePreviews, ...urlPreviews];
    setPreviewImages(allPreviews);

    // Load dimensions asynchronously
    const loadPromises = allPreviews.map((preview, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          // Update the preview with dimensions
          setPreviewImages((prev) =>
            prev.map((p, i) =>
              i === index ? { ...p, width: img.width, height: img.height } : p
            )
          );
          resolve();
        };
        img.onerror = () => resolve();
        img.src = preview.url;
      });
    });

    Promise.all(loadPromises);

    // Cleanup: revoke object URLs when component unmounts or files change
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [selectedFiles, addedUrls]);

  const handleResizeImages = async () => {
    try {
      // Convert both files and URLs to base64
      const fileBase64Images = await convertToBase64({ files: selectedFiles });
      const urlBase64Images = await convertUrlsToBase64({ urls: addedUrls });

      // Combine both arrays
      const allBase64Images = [...fileBase64Images, ...urlBase64Images];

      const resized = await ResizeImages(
        Number(width),
        Number(height),
        allBase64Images
      );

      const result = await SaveImages(resized);

      alert(result);
    } catch (error) {
      console.error("Error resizing images:", error);
      alert(`Error: ${error}`);
    }
  };

  const handleClearImages = () => {
    setSelectedFiles([]);
    setAddedUrls([]);
    setPreviewImages([]);
  };

  const handleDeleteImage = (index: number) => {
    // Determine if this is a file or URL based on index
    if (index < selectedFiles.length) {
      // It's a file
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      // It's a URL
      const urlIndex = index - selectedFiles.length;
      setAddedUrls((prev) => prev.filter((_, i) => i !== urlIndex));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <ImageUpload
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          addedUrls={addedUrls}
          setAddedUrls={setAddedUrls}
        />

        <div className={styles.rightContent}>
          <ResizeSettings
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            autoScale={autoScale}
            setAutoScale={setAutoScale}
          />
          <button className={styles.processButton} onClick={handleResizeImages}>
            Resize images
          </button>
        </div>
      </div>

      {previewImages.length === 0 && (
        <h3 className={styles.previewTitle}>No Images Uploaded</h3>
      )}

      {previewImages.length > 0 && (
        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h3 className={styles.previewTitle}>Uploaded Images</h3>
            <button onClick={handleClearImages} className={styles.clearButton}>
              Clear all
            </button>
          </div>
          <div className={styles.previewGrid}>
            {previewImages.map((preview, index) => (
              <div key={preview.url} className={styles.previewItem}>
                <button
                  onClick={() => handleDeleteImage(index)}
                  className={styles.deleteButton}
                  aria-label="Delete image"
                >
                  ×
                </button>
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className={styles.previewImage}
                />
                <span className={styles.previewLabel}>{preview.name}</span>
                {preview.width && preview.height && (
                  <span className={styles.previewDimensions}>
                    {preview.width} × {preview.height}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
