import React from "react";
import oauth2Client from "../lib/google-oauth";
import { google } from "googleapis";
import { cookies } from "next/headers";

export default async function page() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;
  oauth2Client.setCredentials({ access_token: accessToken });
  let files;

  const drive = google.drive("v3");

  try {
    const result = await drive.files.list({
      auth: oauth2Client,
      pageSize: 15,
      fields: "nextPageToken, files(id, name)",
    });
    files = result.data.files;
  } catch (error) {
    console.log(error);
    return (
      <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
        Something went wrong! Please login again!
      </div>
    );
  }

  return (
    <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
      <h1 className="text-lg font-bold">Google Drive</h1>
      <div>
        <h2 className="font-semibold">Files</h2>
        <ul>
          {files?.map((file) => (
            <li key={file.id}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
