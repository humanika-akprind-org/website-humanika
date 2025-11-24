import AlbumCard from "./AlbumCard";

interface Album {
  id: string;
  title: string;
  count: number;
  cover?: string;
  lastUpdated?: Date;
}

interface AlbumGridProps {
  albums: Album[];
}

export default function AlbumGrid({ albums }: AlbumGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}
