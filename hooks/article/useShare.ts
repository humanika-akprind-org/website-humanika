export function useShare() {
  const handleShare = async (title: string, content: string, url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: content,
          url,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      // Fallback to clipboard if share fails
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Failed to share:", error);
        console.error("Failed to copy to clipboard:", clipboardError);
      }
    }
  };

  return { handleShare };
}
