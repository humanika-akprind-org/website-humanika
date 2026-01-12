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

// Fungsi getGoogleDriveFiles dengan dukungan folderId
export const getGoogleDriveFiles = async (
  accessToken: string,
  folderId: string = "root"
) => {
  // Build query untuk mengambil file dari folder tertentu
  let query = "trashed = false";
  if (folderId && folderId !== "root") {
    query += ` and '${folderId}' in parents`;
  } else {
    // Jika folderId adalah "root" atau tidak diberikan, filter untuk file di root
    query += ` and 'root' in parents`;
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,parents)&q=${encodeURIComponent(
      query
    )}&orderBy=name+asc`,
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
