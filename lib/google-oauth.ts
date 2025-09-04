import { google } from "googleapis";

export const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set credentials if available
if (process.env.ACCESS_TOKEN && process.env.REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
  });
}

export const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});
