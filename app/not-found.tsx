import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📸</div>
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          Photo Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The photo you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Gallery
        </Link>
      </div>
    </div>
  );
}