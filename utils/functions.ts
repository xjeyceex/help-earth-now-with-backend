export const convertFileSize = (sizeInBytes: number, digits?: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes"; // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + " KB"; // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + " MB"; // Less than 1 GB, show in MB
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 2) + " GB"; // 1 GB or more, show in GB
  }
};

export const getNameInitials = (fullName: string): string => {
  // Trim any extra whitespace and split the name into words
  const nameParts = fullName.trim().split(/\s+/);

  // If no name is provided, return empty string
  if (nameParts.length === 0) return "";

  // Get the first word (first name)
  const firstName = nameParts[0];

  // Get the last word (last name)
  const lastName = nameParts[nameParts.length - 1];

  // Extract first letters and convert to uppercase
  const firstInitial = firstName[0]?.toUpperCase() || "";
  const lastInitial = lastName[0]?.toUpperCase() || "";

  return firstInitial + lastInitial;
};

export const getFileNameFromUrl = (url: string) => {
  const urlPath = new URL(url).pathname;
  return urlPath.split("/").pop() || "File";
};

export const getFileMetadataFromUrl = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });

    if (!response.ok) {
      throw new Error("Failed to fetch file metadata");
    }

    // Get basic metadata from headers
    const metadata = {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
      lastModified: response.headers.get("last-modified"),
    };

    return metadata;
  } catch (error) {
    console.error("Error fetching file metadata:", error);
    throw error;
  }
};
