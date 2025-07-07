import { Suspense } from 'react';
import { getPhotos, getFeaturedPhoto } from '@/lib/cosmic';
import { PhotoGrid } from '@/components/PhotoGrid';
import { FeaturedPhoto } from '@/components/FeaturedPhoto';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default async function HomePage() {
  const [photos, featuredPhoto] = await Promise.all([
    getPhotos(),
    getFeaturedPhoto()
  ]);

  // Filter out the featured photo from the grid if it exists
  const gridPhotos = featuredPhoto 
    ? photos.filter(photo => photo.id !== featuredPhoto.id)
    : photos;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Featured Photo Section */}
        {featuredPhoto && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Latest Photo
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedPhoto photo={featuredPhoto} />
            </Suspense>
          </section>
        )}

        {/* Photo Grid Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Photo Gallery
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <PhotoGrid photos={gridPhotos} />
          </Suspense>
        </section>

        {/* Empty State */}
        {photos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-700">
              No photos yet
            </h3>
            <p className="text-gray-500">
              Upload your first photo by sending it to your email address!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}