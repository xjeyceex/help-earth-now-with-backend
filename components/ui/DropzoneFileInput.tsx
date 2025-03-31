import { convertFileSize } from "@/utils/functions";
import {
  Box,
  CloseButton,
  Flex,
  Group,
  Image,
  Paper,
  rem,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconUpload, IconX } from "@tabler/icons-react";
import { forwardRef, useEffect, useState } from "react";

type DropzoneFileInputProps = {
  onChange?: (files: File[] | File | undefined) => void;
  value?: File[] | File;
  maxFiles?: number;
  accept?: string[];
  maxSize?: number;
  isLoading?: boolean;
};

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
      isLoading = false,
    },
    ref,
  ) => {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();

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

    const getFileIcon = (file: File) => {
      if (file.type.includes("pdf")) {
        return (
          <Image
            radius="md"
            src="/images/pdf-icon.png"
            w={50}
            h={50}
            alt="PDF Icon"
          />
        );
      } else if (file.type.includes("image")) {
        return (
          <Image
            radius="md"
            src="/images/image-icon.png"
            w={50}
            h={50}
            alt="PDF Icon"
          />
        );
      } else {
        return (
          <Image
            radius="md"
            src="/images/file-icon.png"
            w={50}
            h={50}
            alt="PDF Icon"
          />
        );
      }
    };

    const previews = files.map((file, index) => (
      <Paper
        key={index}
        shadow="none"
        p="md"
        withBorder
        style={{ display: "flex", alignItems: "center", borderStyle: "dashed" }}
      >
        <Group gap="md" style={{ flex: 1 }}>
          {getFileIcon(file)}
          <Stack gap={1}>
            <Text size="md" truncate style={{ maxWidth: "100%" }} fw={500}>
              {file.name}
            </Text>
            <Text size="sm" c="dimmed">
              {convertFileSize(file.size)}
            </Text>
          </Stack>
        </Group>
        <CloseButton
          size="md"
          onClick={() => handleRemove(index)}
          aria-label="Remove file"
          disabled={isLoading}
        />
      </Paper>
    ));

    // Loading state for empty dropzone
    if (isLoading && files.length === 0) {
      return (
        <Box ref={ref}>
          <Skeleton height={rem(140)} radius="md" />
        </Box>
      );
    }

    // Loading state for files preview
    if (isLoading && files.length > 0) {
      return (
        <Box ref={ref}>
          <Stack gap="xs">
            {Array(files.length)
              .fill(0)
              .map((_, index) => (
                <Paper
                  key={index}
                  shadow="none"
                  p="md"
                  withBorder
                  style={{ borderStyle: "dashed" }}
                >
                  <Group gap="md" style={{ flex: 1 }}>
                    <Skeleton height={50} width={50} radius="md" />
                    <Stack gap={8} style={{ flex: 1 }}>
                      <Skeleton height={18} radius="sm" width="70%" />
                      <Skeleton height={14} radius="sm" width="40%" />
                    </Stack>
                  </Group>
                </Paper>
              ))}
          </Stack>
        </Box>
      );
    }

    return (
      <Box ref={ref}>
        {files.length === 0 ? (
          <Dropzone
            onDrop={handleDrop}
            maxFiles={maxFiles}
            accept={accept}
            maxSize={maxSize}
            disabled={isLoading}
            style={{
              borderStyle: "dashed",
              borderColor:
                colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[4],
              backgroundColor:
                colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
            }}
          >
            <Flex
              justify="center"
              align="center"
              gap="sm"
              style={{ minHeight: rem(140), pointerEvents: "none" }}
              direction="column"
            >
              <Dropzone.Accept>
                <Image
                  radius="md"
                  src="/images/cloud-storage-icon.png"
                  w={60}
                  h={60}
                  alt="PDF Icon"
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <ThemeIcon size="xl" color="red" variant="light" radius={100}>
                  <IconX fontSize={rem(20)} stroke={1.5} />
                </ThemeIcon>
              </Dropzone.Reject>
              <Dropzone.Idle>
                <Image
                  radius="md"
                  src="/images/cloud-storage-icon.png"
                  w={60}
                  h={60}
                  alt="PDF Icon"
                />
              </Dropzone.Idle>

              <Stack gap={4}>
                <Text fz="md" inline ta="center" fw={500}>
                  Drag files here or click to select files
                </Text>
                <Text fz="sm" c="dimmed" inline mt={4} ta="center">
                  Files should not exceed {maxSize / 1024 / 1024}MB
                </Text>
              </Stack>
            </Flex>
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
                  disabled={isLoading}
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
      </Box>
    );
  },
);

DropzoneFileInput.displayName = "DropzoneFileInput";

export default DropzoneFileInput;
