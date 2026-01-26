import { useState } from "react";
import ImageUpload from "../ImageUpload/ImageUpload";
import ResizeSettings from "../ResizeSettings/ResizeSettings";
import styles from "./ImageSetup.module.css";
import { ResizeImages } from "../../../wailsjs/go/main/App";

export default function ImageSetup() {
  // Image upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [addedUrls, setAddedUrls] = useState<string[]>([]);

  // Resize settings state
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [autoScale, setAutoScale] = useState(true);

  const handleResizeImages = async () => {
    // Call Go backend
    console.log({ height, width });
    const resized = await ResizeImages(height, width);

    console.log({ resized });
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
