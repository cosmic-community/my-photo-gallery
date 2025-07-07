import Link from 'next/link';
import { format } from 'date-fns';
import { Photo } from '@/types';

export interface PhotoCardProps {
  photo: Photo;
  featured?: boolean;
  showCaption?: boolean;
}

export function PhotoCard({ photo, featured = false, showCaption = true }: PhotoCardProps) {
  const imageSize = featured ? { w: 1200, h: 800 } : { w: 600, h: 400 };
  const imageUrl = `${photo.metadata.photo.imgix_url}?w=${imageSize.w}&h=${imageSize.h}&fit=crop&auto=format,compress`;

  return (
    <article className="photo-card bg-white rounded-lg shadow-lg overflow-hidden">
      <Link href={`/photos/${photo.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={photo.title}
            width={imageSize.w / 2}
            height={imageSize.h / 2}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {photo.metadata.featured && (
            <div className="absolute top-3 right-3">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>

      {showCaption && (
        <div className="p-4">
          <Link href={`/photos/${photo.slug}`}>
            <h3 className="font-semibold text-gray-800 mb-2 hover:text-primary transition-colors">
              {photo.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {photo.metadata.caption}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <time dateTime={photo.metadata.upload_date}>
              {format(new Date(photo.metadata.upload_date), 'MMM d, yyyy')}
            </time>
            {photo.metadata.email_source && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Email Upload
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}