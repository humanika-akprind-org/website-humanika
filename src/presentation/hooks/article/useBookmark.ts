import { useState } from "react";

export function useBookmark(initialState: boolean = false) {
  const [isBookmarked, setIsBookmarked] = useState(initialState);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return {
    isBookmarked,
    toggleBookmark,
  };
}
