import ImageUpload from "../ImageUpload/ImageUpload";
import ResizeSettings from "../ResizeSettings/ResizeSettings";
import styles from "./ImageSetup.module.css";

export default function ImageSetup() {
  const handleProcessImages = () => {};

  return (
    <div className={styles.container}>
      <ImageUpload />

      <div className={styles.rightContent}>
        <ResizeSettings />
        <button className={styles.processButton} onClick={handleProcessImages}>
          Process images
        </button>
      </div>
    </div>
  );
}
