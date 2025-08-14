// page.tsx
import React from "react";
import { cookies } from "next/headers";
import { getGoogleDriveFiles } from "@/app/dashboard/server"; // Import the server-side function

export default async function Page() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;

  if (!accessToken) {
    return (
      <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
        <h1>Please log in to access your Google Drive files.</h1>
      </div>
    );
  }

  let files;
  try {
    files = await getGoogleDriveFiles(accessToken);
  } catch (error) {
    console.log(error);
    return (
      <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
        <h1>Something went wrong! Please login again!</h1>
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
