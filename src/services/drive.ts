export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  iconLink?: string;
  size?: string;
  createdTime?: string;
  webContentLink?: string;
}

/**
 * List files from user's Google Drive.
 * Filters for common media and design files (images, audio, video, pdfs)
 */
export const listGoogleDriveFiles = async (
  accessToken: string,
  searchQuery?: string
): Promise<DriveFileItem[]> => {
  try {
    let q = "trashed = false and mimeType != 'application/vnd.google-apps.folder'";
    
    if (searchQuery && searchQuery.trim()) {
      const sanitized = searchQuery.trim().replace(/'/g, "\\'");
      q += ` and name contains '${sanitized}'`;
    }

    const fields = 'files(id, name, mimeType, thumbnailLink, iconLink, size, createdTime, webContentLink)';
    const url = `https://www.googleapis.com/drive/v3/files?pageSize=30&orderBy=modifiedTime desc&fields=${encodeURIComponent(
      fields
    )}&q=${encodeURIComponent(q)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Google Drive list error:', response.status, errorText);
      throw new Error(`Gagal membaca Google Drive (${response.status})`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (err: any) {
    console.error('Error in listGoogleDriveFiles:', err);
    throw err;
  }
};

/**
 * Download file binary blob from Google Drive using accessToken
 */
export const fetchDriveFileBlob = async (
  fileId: string,
  accessToken: string
): Promise<Blob> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengunduh berkas Drive (${response.status})`);
  }

  return await response.blob();
};

/**
 * Upload a generated Certificate PDF back to Google Drive
 */
export const uploadCertificateToDrive = async (
  accessToken: string,
  fileName: string,
  pdfBlob: Blob
): Promise<{ id: string; name: string }> => {
  const metadata = {
    name: fileName,
    mimeType: 'application/pdf',
    description: 'Sertifikat Paspor Hak Cipta Kriptografi diterbitkan oleh CreativeTrust AI Guardian',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', pdfBlob);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errorMsg = await response.text();
    console.error('Failed to upload PDF to Drive:', errorMsg);
    throw new Error(`Gagal menyimpan ke Google Drive (${response.status})`);
  }

  return await response.json();
};
