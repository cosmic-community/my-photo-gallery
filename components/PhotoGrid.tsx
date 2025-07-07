import { Photo } from '@/types';
import { PhotoCard } from '@/components/PhotoCard';

export interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📷</div>
        <h3 className="text-2xl font-semibold mb-2 text-gray-700">
          No photos to display
        </h3>
        <p className="text-gray-500">
          Photos will appear here once they're uploaded.
        </p>
      </div>
    );
  }

  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <PhotoCard 
          key={photo.id} 
          photo={photo} 
          showCaption={true}
        />
      ))}
    </div>
  );
}