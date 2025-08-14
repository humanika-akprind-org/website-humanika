// lib/google-oauth.ts
import { google } from "googleapis";

// Inisialisasi OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export default oauth2Client;
