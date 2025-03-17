import { CloseButton, Group, Paper, rem, Stack, Text } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import {
  IconFile,
  IconPdf,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { forwardRef, useEffect, useState } from "react";

type DropzoneFileInputProps = {
  onChange?: (files: File[] | File | undefined) => void;
  value?: File[] | File;
  maxFiles?: number;
  accept?: string[];
  maxSize?: number;
}

const DropzoneFileInput = forwardRef<HTMLDivElement, DropzoneFileInputProps>(
  (
    {
      onChange,
      value,
      maxFiles = 1,
      accept = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ],
      maxSize = 5 * 1024 * 1024,
    },
    ref,
  ) => {
    const [files, setFiles] = useState<FileWithPath[]>([]);

    useEffect(() => {
      if (value) {
        if (Array.isArray(value)) {
          setFiles(value);
        } else {
          setFiles([value]);
        }
      } else {
        setFiles([]);
      }
    }, [value]);

    const handleDrop = (droppedFiles: FileWithPath[]) => {
      const newFiles = [...files, ...droppedFiles].slice(0, maxFiles);
      setFiles(newFiles);

      if (onChange) {
        if (maxFiles === 1) {
          onChange(newFiles[0]);
        } else {
          onChange(newFiles);
        }
      }
    };

    const handleRemove = (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);

      if (onChange) {
        if (newFiles.length === 0) {
          onChange(undefined);
        } else if (maxFiles === 1) {
          onChange(newFiles[0]);
        } else {
          onChange(newFiles);
        }
      }
    };

    // Get appropriate icon based on file type
    const getFileIcon = (file: File) => {
      if (file.type.includes("pdf")) {
        return <IconPdf fontSize={rem(14)} stroke={1.5} />;
      } else if (file.type.includes("image")) {
        return <IconPhoto fontSize={rem(14)} stroke={1.5} />;
      } else {
        return <IconFile fontSize={rem(14)} stroke={1.5} />;
      }
    };

    const previews = files.map((file, index) => (
      <Paper
        key={index}
        shadow="none"
        p="xs"
        withBorder
        style={{ display: "flex", alignItems: "center" }}
      >
        <Group gap="xs" style={{ flex: 1 }}>
          {getFileIcon(file)}
          <Text size="sm" truncate style={{ maxWidth: "80%" }}>
            {file.name}
          </Text>
        </Group>
        <CloseButton
          size="xs"
          onClick={() => handleRemove(index)}
          aria-label="Remove file"
        />
      </Paper>
    ));

    return (
      <div ref={ref}>
        {files.length === 0 ? (
          <Dropzone
            onDrop={handleDrop}
            maxFiles={maxFiles}
            accept={accept}
            maxSize={maxSize}
            styles={{
              root: {
                minHeight: rem(60),
                borderRadius: rem(10),
              },
            }}
          >
            <Group
              justify="center"
              gap="sm"
              style={{ minHeight: rem(60), pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload fontSize={rem(20)} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX fontSize={rem(20)} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconUpload fontSize={rem(20)} stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text fz="sm" inline>
                  Drag files here or click to select files
                </Text>
                <Text fz="xs" c="dimmed" inline mt={4}>
                  Files should not exceed {maxSize / 1024 / 1024}MB
                </Text>
              </div>
            </Group>
          </Dropzone>
        ) : (
          <>
            <Stack gap="xs">
              {previews}
              {files.length < maxFiles && (
                <Dropzone
                  onDrop={handleDrop}
                  maxFiles={maxFiles - files.length}
                  accept={accept}
                  maxSize={maxSize}
                  styles={{
                    root: {
                      minHeight: rem(40),
                      borderColor: "var(--mantine-color-blue-5)",
                      borderStyle: "dashed",
                    },
                  }}
                >
                  <Group
                    justify="center"
                    gap="xs"
                    style={{ minHeight: rem(40), pointerEvents: "none" }}
                  >
                    <IconUpload fontSize={rem(14)} stroke={1.5} />
                    <Text size="sm" inline c="blue">
                      {maxFiles > 1 ? "Add more files" : "Replace file"}
                    </Text>
                  </Group>
                </Dropzone>
              )}
            </Stack>
          </>
        )}
      </div>
    );
  },
);

DropzoneFileInput.displayName = "DropzoneFileInput";

export default DropzoneFileInput;
