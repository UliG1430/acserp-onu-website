export const extractGoogleDriveFolderId = (url = "") => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return "";

  const folderMatch = trimmedUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];

  const embeddedMatch = trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (embeddedMatch) return embeddedMatch[1];

  return trimmedUrl;
};

export const buildGoogleDriveFolderUrl = (url = "") => {
  const folderId = extractGoogleDriveFolderId(url);
  return folderId ? `https://drive.google.com/drive/folders/${folderId}` : "";
};

export const buildGoogleDriveEmbedUrl = (url = "") => {
  const folderId = extractGoogleDriveFolderId(url);
  return folderId ? `https://drive.google.com/embeddedfolderview?id=${folderId}#grid` : "";
};
