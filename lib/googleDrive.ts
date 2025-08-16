import { google } from 'googleapis';
import { Readable } from 'stream';
import { oauth2Client } from './google-oauth';

// Set credentials if available
if (process.env.ACCESS_TOKEN && process.env.REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
  });
}

const drive = google.drive({ version: 'v3', auth: oauth2Client });

interface UploadParams {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export async function uploadToGoogleDrive({ originalname, buffer, mimetype }: UploadParams) {
  try {
    const fileMetadata = {
      name: originalname,
      parents: ['root'], // Upload to root folder
    };

    const media = {
      mimeType: mimetype,
      body: Readable.from(buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    return {
      fileId: response.data.id!,
      webViewLink: response.data.webViewLink!,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
}

export async function listFiles() {
  try {
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name, webViewLink)',
    });
    return response.data.files || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error('Failed to list files from Google Drive');
  }
}
