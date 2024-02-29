
import { v4 as uuidv4 } from "uuid";

const prettyFileSize = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
};

const validateFileType = (file) => {
  if (file) {
    const supportedFilesList = ["jpg", "jpeg", "png"];
    const fileType = file.type.toString().toLowerCase();
    for (const supportedFile of supportedFilesList) {
      if (fileType.includes(supportedFile)) {
        return true;
      }
    }

    return false;
  } else return false;
};

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(reader.result);
    });

    reader.addEventListener("error", () => {
      reject(new Error("Error reading file."));
    });

    reader.readAsDataURL(file);
  });
};

const getImageDimensions = async (file) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      });
    };
    image.src = URL.createObjectURL(file);
  });
};

const removeFileExtension = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return fileName; // No file extension found
  }
  const fileNameWithoutExtension = fileName.substring(0, lastDotIndex);
  return fileNameWithoutExtension;
};

const newSelectedFilesBasedOnSorting = (
  selectedSortableFiles,
  selectedFiles
) => {
  const sortedFileidArray = selectedSortableFiles.map((m) => m.fileid);
  const newSortedSelectedFiles = [];
  for (const sf of sortedFileidArray) {
    const foundFile = selectedFiles.find((f) => f.fileid === sf);
    if (foundFile) {
      newSortedSelectedFiles.push(foundFile);
    }
  }
  return newSortedSelectedFiles;
};

const validateAndFormatFiles = (newFiles = []) => {
  return newFiles
    .filter((f) => validateFileType(f))
    .map((f) => ({ f, fileid: uuidv4() }));
};

export {
  prettyFileSize,
  validateFileType,
  readFileAsDataURL,
  getImageDimensions,
  removeFileExtension,
  newSelectedFilesBasedOnSorting,
  validateAndFormatFiles
};
