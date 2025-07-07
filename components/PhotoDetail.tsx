import { Photo } from '@/types';

export interface PhotoDetailProps {
  photo: Photo;
}

export function PhotoDetail({ photo }: PhotoDetailProps) {
  const imageUrl = `${photo.metadata.photo.imgix_url}?w=1200&h=900&fit=crop&auto=format,compress`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={photo.title}
          width={1200}
          height={900}
          className="w-full h-full object-cover"
        />
        
        {photo.metadata.featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              Featured Photo
            </span>
          </div>
        )}
      </div>
    </div>
  );
}