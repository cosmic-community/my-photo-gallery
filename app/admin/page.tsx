import { getAllComments } from '@/lib/cosmic';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default async function AdminPage() {
  const comments = await getAllComments();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <span className="admin-badge">Admin</span>
          </div>

          <AdminDashboard comments={comments} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const metadata = {
  title: 'Admin Dashboard - My Photo Gallery',
  description: 'Manage comments and photos for your photo gallery',
};