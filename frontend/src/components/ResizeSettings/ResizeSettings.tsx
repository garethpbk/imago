import styles from "./ResizeSettings.module.css";

interface ResizeSettingsProps {
  width: string;
  setWidth: (value: string) => void;
  height: string;
  setHeight: (value: string) => void;
  autoScale: boolean;
  setAutoScale: (value: boolean) => void;
}

export default function ResizeSettings({
  width,
  setWidth,
  height,
  setHeight,
  autoScale,
  setAutoScale,
}: ResizeSettingsProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Resize Settings</h3>

      <div className={styles.inputGroup}>
        <div className={styles.inputField}>
          <label htmlFor="width" className={styles.label}>
            Width (px)
          </label>
          <input
            id="width"
            type="number"
            min="1"
            placeholder="e.g., 1920"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputField}>
          <label htmlFor="height" className={styles.label}>
            Height (px)
          </label>
          <input
            id="height"
            type="number"
            min="1"
            placeholder="e.g., 1080"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.checkboxGroup}>
        <input
          id="autoScale"
          type="checkbox"
          checked={autoScale}
          onChange={(e) => setAutoScale(e.target.checked)}
          className={styles.checkbox}
        />
        <label htmlFor="autoScale" className={styles.checkboxLabel}>
          Auto-scale (preserve aspect ratio if only one dimension is set)
        </label>
      </div>
    </div>
  );
}
