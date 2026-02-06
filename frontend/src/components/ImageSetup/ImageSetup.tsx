import { useState } from "react";
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

export default function ImageSetup() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [addedUrls, setAddedUrls] = useState<string[]>([]);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [autoScale, setAutoScale] = useState(true);

  const handleResizeImages = async () => {
    try {
      const base64Images = await convertToBase64({ files: selectedFiles });

      const resized = await ResizeImages(
        Number(width),
        Number(height),
        base64Images
      );

      const result = await SaveImages(resized);

      alert(result);
    } catch (error) {
      console.error("Error resizing images:", error);
      alert(`Error: ${error}`);
    }
  };

  return (
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
  );
}
