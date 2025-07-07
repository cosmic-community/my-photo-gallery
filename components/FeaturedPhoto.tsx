import Link from 'next/link';
import { format } from 'date-fns';
import { Photo } from '@/types';

export interface FeaturedPhotoProps {
  photo: Photo;
}

export function FeaturedPhoto({ photo }: FeaturedPhotoProps) {
  const imageUrl = `${photo.metadata.photo.imgix_url}?w=1200&h=800&fit=crop&auto=format,compress`;

  return (
    <div className="featured-photo max-w-4xl mx-auto">
      <Link href={`/photos/${photo.slug}`}>
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={imageUrl}
            alt={photo.title}
            width={1200}
            height={800}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          
          <div className="caption">
            <h2 className="text-2xl font-bold mb-2">
              {photo.title}
            </h2>
            <p className="text-lg mb-3 opacity-90">
              {photo.metadata.caption}
            </p>
            <div className="flex items-center gap-4 text-sm opacity-75">
              <time dateTime={photo.metadata.upload_date}>
                {format(new Date(photo.metadata.upload_date), 'MMMM d, yyyy')}
              </time>
              {photo.metadata.email_source && (
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  Email Upload
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}