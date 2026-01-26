import ImageUpload from "../ImageUpload/ImageUpload";
import ResizeSettings from "../ResizeSettings/ResizeSettings";
import styles from "./ImageSetup.module.css";

export default function ImageSetup() {
  return (
    <div className={styles.container}>
      <ImageUpload />
      <ResizeSettings />
    </div>
  );
}
