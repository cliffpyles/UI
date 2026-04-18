import {
  forwardRef,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
} from "react";
import { Icon } from "../../primitives/Icon";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { ProgressBar } from "../../components/ProgressBar";
import { formatBytes } from "../../utils";
import "./FileUploader.css";

export interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

export interface FileUploaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onError"> {
  onUpload: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  uploads?: UploadProgress[];
  label?: string;
}

export const FileUploader = forwardRef<HTMLDivElement, FileUploaderProps>(
  function FileUploader(
    {
      onUpload,
      accept,
      maxSize,
      multiple = true,
      disabled,
      uploads,
      label = "Drop files here or click to browse",
      className,
      ...rest
    },
    ref,
  ) {
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const classes = [
      "ui-file-uploader",
      dragOver && "ui-file-uploader--drag-over",
      disabled && "ui-file-uploader--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const validate = (files: File[]): File[] => {
      const valid: File[] = [];
      for (const f of files) {
        if (maxSize && f.size > maxSize) {
          setError(`${f.name} exceeds ${formatBytes(maxSize)}`);
          continue;
        }
        valid.push(f);
      }
      if (valid.length === files.length) setError(null);
      return valid;
    };

    const handleFiles = (files: FileList | File[]) => {
      const arr = Array.from(files);
      const valid = validate(arr);
      if (valid.length > 0) onUpload(valid);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    };

    return (
      <div
        ref={ref}
        className={classes}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        {...rest}
      >
        <Button
          variant="ghost"
          size="sm"
          className="ui-file-uploader__button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <Box display="inline-flex" align="center" gap="1">
            <Icon name="upload" size="lg" aria-hidden />
            <Text as="span" className="ui-file-uploader__label">
              {label}
            </Text>
            {(accept || maxSize) && (
              <Text as="span" className="ui-file-uploader__hint">
                {accept && <>{accept}</>}
                {accept && maxSize && " · "}
                {maxSize && <>max {formatBytes(maxSize)}</>}
              </Text>
            )}
          </Box>
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="ui-file-uploader__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {error && (
          <div role="alert" className="ui-file-uploader__error">
            {error}
          </div>
        )}
        {uploads && uploads.length > 0 && (
          <ul className="ui-file-uploader__uploads">
            {uploads.map((u) => (
              <li key={u.file.name} className="ui-file-uploader__upload">
                <div className="ui-file-uploader__upload-header">
                  <span>{u.file.name}</span>
                  <span>{formatBytes(u.file.size)}</span>
                </div>
                {u.status === "uploading" && (
                  <ProgressBar value={u.progress} label={`Uploading ${u.file.name}`} />
                )}
                {u.status === "error" && (
                  <div className="ui-file-uploader__upload-error">{u.error ?? "Upload failed"}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
