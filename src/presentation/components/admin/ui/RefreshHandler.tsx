"use client";

import { useEffect } from "react";

export default function RefreshHandler() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("refresh") === "true") {
      // Remove the refresh parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
      // Refresh the page
      window.location.reload();
    }
  }, []);

  return null;
}
