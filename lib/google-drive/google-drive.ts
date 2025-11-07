export const getGoogleDriveFile = async (
  accessToken: string,
  fileId: string
) => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=*`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch file details");
  }

  return response.json();
};

// Fungsi getGoogleDriveFiles tetap sama
export const getGoogleDriveFiles = async (accessToken: string) => {
  const response = await fetch(
    "https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink)",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Google Drive files");
  }

  const data = await response.json();
  return data.files || [];
};
