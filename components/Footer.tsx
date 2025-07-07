export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p className="mb-2">
            © {currentYear} My Photo Gallery. All rights reserved.
          </p>
          <p className="text-sm">
            Powered by{' '}
            <a 
              href="https://www.cosmicjs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Cosmic
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}