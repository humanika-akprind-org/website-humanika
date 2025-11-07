import { google } from "googleapis";
import {
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
} from "@/lib/config/config";

export const oauth2Client = new google.auth.OAuth2(
  googleClientId,
  googleClientSecret,
  googleRedirectUri
);

// Set credentials if available
// if (process.env.ACCESS_TOKEN && process.env.REFRESH_TOKEN) {
//   oauth2Client.setCredentials({
//     access_token: process.env.ACCESS_TOKEN,
//     refresh_token: process.env.REFRESH_TOKEN,
//   });
// }

export const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});
