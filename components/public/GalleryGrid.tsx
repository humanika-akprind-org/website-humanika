import GalleryCard from "./GalleryCard";

export default function GalleryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <GalleryCard key={index} index={index} />
      ))}
    </div>
  );
}