import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">📸</span>
            <h1 className="text-2xl font-bold text-gray-800">
              My Photo Gallery
            </h1>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Gallery
            </Link>
            <Link 
              href="/admin"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}