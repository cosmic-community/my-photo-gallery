// app/photos/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPhotoBySlug, getApprovedComments } from '@/lib/cosmic';
import { PhotoDetail } from '@/components/PhotoDetail';
import { CommentList } from '@/components/CommentList';
import { CommentForm } from '@/components/CommentForm';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { format } from 'date-fns';

interface PhotoPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { slug } = await params;
  
  const [photo, comments] = await Promise.all([
    getPhotoBySlug(slug),
    getApprovedComments(slug).catch(() => [])
  ]);

  if (!photo) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Photo Detail */}
          <PhotoDetail photo={photo} />

          {/* Photo Info */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              {photo.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <time dateTime={photo.metadata.upload_date}>
                {format(new Date(photo.metadata.upload_date), 'MMMM d, yyyy')}
              </time>
              {photo.metadata.featured && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {photo.metadata.caption}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Comments ({comments.length})
            </h2>
            
            {/* Comment Form */}
            <div className="mb-8">
              <CommentForm photoId={photo.id} />
            </div>

            {/* Comments List */}
            <CommentList comments={comments} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Generate metadata for the photo page
export async function generateMetadata({ params }: PhotoPageProps) {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);

  if (!photo) {
    return {
      title: 'Photo Not Found',
      description: 'The requested photo could not be found.',
    };
  }

  return {
    title: `${photo.title} - My Photo Gallery`,
    description: photo.metadata.caption,
    openGraph: {
      title: photo.title,
      description: photo.metadata.caption,
      images: [
        {
          url: `${photo.metadata.photo.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: photo.title,
        },
      ],
    },
  };
}